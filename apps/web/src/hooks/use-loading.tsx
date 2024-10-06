import { useState } from 'react';

export default function useLoading() {
  const [loading, setLoading] = useState(false);

  function toggle(value?: boolean) {
    if (value) {
      if (typeof value !== 'boolean') {
        throw new Error(
          `Expected \`value\` to be boolean but got ${typeof value}`,
        );
      }
      setLoading(value);
    } else {
      setLoading((o) => !o);
    }
  }

  return { loading, toggle };
}
