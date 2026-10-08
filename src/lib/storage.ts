import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import { encryptData, decryptData, base64ToArrayBuffer, arrayBufferToBase64 } from './crypto';

interface HerShieldDB extends DBSchema {
  logs: {
    key: string;
    value: {
      id: string;
      iv: string; // base64 encoded
      encryptedData: string; // base64 encoded
      timestamp: number;
    };
    indexes: { 'by-time': number };
  };
  media: {
    key: string;
    value: {
      id: string;
      iv: string; // base64 encoded
      encryptedBlob: ArrayBuffer;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<HerShieldDB>> | null = null;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<HerShieldDB>('hershield-secure-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('logs')) {
          const logStore = db.createObjectStore('logs', { keyPath: 'id' });
          logStore.createIndex('by-time', 'timestamp');
        }
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveEncryptedLog(id: string, plainTextData: string, key: CryptoKey) {
  const db = await initDB();
  const { encrypted, iv } = await encryptData(plainTextData, key);
  
  await db.put('logs', {
    id,
    iv: arrayBufferToBase64(iv),
    encryptedData: arrayBufferToBase64(encrypted),
    timestamp: Date.now()
  });
}

export async function getDecryptedLog(id: string, key: CryptoKey): Promise<string | null> {
  const db = await initDB();
  const log = await db.get('logs', id);
  if (!log) return null;

  try {
    const iv = base64ToArrayBuffer(log.iv);
    const encryptedData = base64ToArrayBuffer(log.encryptedData);
    const decrypted = await decryptData(encryptedData.buffer, iv, key);
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt log", error);
    return null;
  }
}

export async function getAllDecryptedLogs(key: CryptoKey): Promise<{id: string, data: string}[]> {
  const db = await initDB();
  const logs = await db.getAllFromIndex('logs', 'by-time');
  
  const decryptedLogs = [];
  for (const log of logs) {
    try {
      const iv = base64ToArrayBuffer(log.iv);
      const encryptedData = base64ToArrayBuffer(log.encryptedData);
      const decrypted = await decryptData(encryptedData.buffer, iv, key);
      decryptedLogs.push({ id: log.id, data: decrypted });
    } catch (error) {
      console.error(`Failed to decrypt log ${log.id}`, error);
    }
  }
  
  // Return in reverse chronological order (newest first)
  return decryptedLogs.reverse();
}

export async function deleteLog(id: string) {
  const db = await initDB();
  await db.delete('logs', id);
}

export async function clearAllData() {
  const db = await initDB();
  await db.clear('logs');
  await db.clear('media');
}
