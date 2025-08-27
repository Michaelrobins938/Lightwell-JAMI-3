// src/utils/encryption.ts
import { subtle } from 'crypto';

export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptMessage(key: CryptoKey, message: string): Promise<string> {
  const encodedMessage = new TextEncoder().encode(message);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedMessage
  );
  const encryptedArray = new Uint8Array(encryptedData);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);
  return btoa(String.fromCharCode.apply(null, combined));
}

export async function decryptMessage(key: CryptoKey, encryptedMessage: string): Promise<string> {
  const encryptedData = Uint8Array.from(atob(encryptedMessage), (c) => c.charCodeAt(0));
  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);
  const decryptedData = await subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  return new TextDecoder().decode(decryptedData);
}