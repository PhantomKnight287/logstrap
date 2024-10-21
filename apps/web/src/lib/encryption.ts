import { createDecipheriv } from 'crypto';

export async function decrypt(encryptedData: string, key: string, iv: string) {
  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'hex'),
    Buffer.from(iv, 'hex'),
  );
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
