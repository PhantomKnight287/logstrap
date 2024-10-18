import { useState, useCallback } from 'react';

function useClipboard(): { copy: (text: string) => void; copied: boolean } {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  }, []);

  return { copy, copied };
}

export default useClipboard;
