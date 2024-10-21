import { Injectable } from '@nestjs/common';
import { createCipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  async encrypt(data: string, key: string, id?: Buffer) {
    const iv = id ?? randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
  }
}
