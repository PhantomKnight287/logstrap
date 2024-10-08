export default class Logger {
  async getCrypto() {
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
  /**
   * This generates a id for a request. This will be used to associate `application logs` with `request log`
   * @returns string
   */
  async generateId() {
    const _crypto = await this.getCrypto();
    return _crypto.randomUUID();
  }
}
