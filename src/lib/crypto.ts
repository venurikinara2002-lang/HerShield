export const ITERATIONS = 250000;
export const SALT_LENGTH = 16;
export const IV_LENGTH = 12;

let activeMasterKey: CryptoKey | null = null;
export function setActiveMasterKey(key: CryptoKey | null) { activeMasterKey = key; }
export function getActiveMasterKey(): CryptoKey { 
  if (!activeMasterKey) throw new Error("Vault is locked");
  return activeMasterKey; 
}

// Derives a cryptographic key from a PIN or Recovery Code using PBKDF2
export async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Generates the true Master Key that encrypts the actual data
export async function generateMasterKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true, // Must be extractable so we can wrap it
    ["encrypt", "decrypt"]
  );
}

// Encrypts the Master Key with a wrapping key (PIN-derived or Recovery-derived)
export async function encryptMasterKey(masterKey: CryptoKey, wrappingKey: CryptoKey): Promise<{ encryptedKey: ArrayBuffer; iv: Uint8Array }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const exportedMasterKey = await window.crypto.subtle.exportKey("raw", masterKey);
  
  const encryptedKey = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    wrappingKey,
    exportedMasterKey
  );
  
  return { encryptedKey, iv };
}

// Decrypts the Master Key using a wrapping key
export async function decryptMasterKey(encryptedKey: ArrayBuffer, iv: Uint8Array, wrappingKey: CryptoKey): Promise<CryptoKey> {
  const decryptedRaw = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    wrappingKey,
    encryptedKey
  );
  
  return window.crypto.subtle.importKey(
    "raw",
    decryptedRaw,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
}

// Data encryption/decryption using the Master Key
export async function encryptData(data: string, key: CryptoKey): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const enc = new TextEncoder();
  
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(data)
  );
  
  return { encrypted, iv };
}

export async function decryptData(encrypted: ArrayBuffer, iv: Uint8Array, key: CryptoKey): Promise<string> {
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encrypted
  );
  
  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

export function generateRecoveryCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars like I, 1, O, 0
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${code.slice(0,4)}-${code.slice(4,8)}-${code.slice(8,12)}`;
}

export function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): Uint8Array {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}
