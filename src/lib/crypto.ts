export const ITERATIONS = 250000;
export const SALT_LENGTH = 16;
export const IV_LENGTH = 12;

/**
 * Derives a cryptographic key from a PIN using PBKDF2 with SHA-256.
 */
export async function generateKeyFromPin(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
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
    true, // We need to be able to export it if we ever need it in memory (though we should avoid it if possible, the prompt says "keep the key only in memory")
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a string using AES-GCM.
 */
export async function encryptData(data: string, key: CryptoKey): Promise<{ encrypted: ArrayBuffer; iv: Uint8Array }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const enc = new TextEncoder();
  
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    enc.encode(data)
  );
  
  return { encrypted, iv };
}

/**
 * Decrypts data using AES-GCM.
 */
export async function decryptData(encrypted: ArrayBuffer, iv: Uint8Array, key: CryptoKey): Promise<string> {
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encrypted
  );
  
  const dec = new TextDecoder();
  return dec.decode(decrypted);
}

/**
 * Generates a random salt for key derivation.
 */
export function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Helper to encode/decode arrays to Base64 for local storage of IVs/Salts
 */
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
