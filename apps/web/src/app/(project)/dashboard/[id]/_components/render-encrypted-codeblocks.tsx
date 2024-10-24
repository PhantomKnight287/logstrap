import 'server-only';
import Code from '@/components/code';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/encryption';
import { ReactNode } from 'react';

export default async function EncryptedCodeBlock({
  cookieIdentifier,
  encryptedData,
  iv,
  parseJson,
  renderInCodeBlock = true,
  customRenderer,
  defaultValue,
}: {
  encryptedData: string;
  cookieIdentifier: string;
  iv: string;
  parseJson?: boolean;
  renderInCodeBlock?: boolean;
  customRenderer?: (decryptedData: string) => ReactNode;
  defaultValue?: string;
}) {
  const cookiesStore = await cookies();
  const cookie = cookiesStore.get(cookieIdentifier);
  try {
    if (!cookie?.value) throw new Error('Decryption key not found');
    const decryptedData = await decrypt(
      encryptedData,
      cookie.value?.replace('key_', ''),
      iv,
    );
    if (!decryptedData) {
      if (renderInCodeBlock)
        return (
          <Code code={defaultValue ?? 'No data'} lang="json" theme="ayu-dark" />
        );
      return <span>{defaultValue ?? 'No data'}</span>;
    }
    return customRenderer ? (
      customRenderer(decryptedData)
    ) : renderInCodeBlock ? (
      <Code
        code={
          parseJson
            ? JSON.stringify(JSON.parse(decryptedData), null, 2)
            : decryptedData
        }
        lang="json"
        theme="ayu-dark"
      />
    ) : (
      <span>{decryptedData}</span>
    );
  } catch (e) {
    return renderInCodeBlock ? (
      <Code
        code={`Error decrypting data: ${
          e instanceof Error ? e.message : 'Unknown error'
        }`}
        lang="json"
        theme="ayu-dark"
      />
    ) : (
      <span>{`Error decrypting data: ${
        e instanceof Error ? e.message : 'Unknown error'
      }`}</span>
    );
  }
}
