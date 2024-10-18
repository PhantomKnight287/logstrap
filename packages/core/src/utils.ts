export async function getCrypto() {
  if (typeof self !== 'undefined' && 'crypto' in self) {
    return self.crypto as Crypto;
  }
  // For Web Workers and Browsers
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto as Crypto;
  }
  // For Node.js
  if (typeof globalThis !== 'undefined' && typeof process !== 'undefined') {
    try {
      // Dynamically import the 'crypto' module available in Node.js
      return await import('crypto');
    } catch (e) {
      throw new Error('Unable to import "crypto" module');
    }
  }

  throw new Error('Unsupported environment');
}

export async function generateId() {
  const crypto = await getCrypto();
  return crypto.randomUUID();
}
