/**
 * Removes the prefix from the key
 * @param key - The key to remove the prefix from
 * @returns The key without the prefix
 */
export function getKeyFromPrefixedKey(key: string) {
  return key.replace('key_', '');
}
