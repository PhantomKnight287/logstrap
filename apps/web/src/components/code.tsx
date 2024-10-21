import { cn } from '@/lib/utils';
import { codeToHtml } from 'shiki';
import type { BundledLanguage, BundledTheme } from 'shiki';

type Props = {
  code: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
  filename?: string;
  className?: string;
};
export default async function Code({
  code,
  lang = 'javascript',
  theme = 'nord',
  className,
}: Props) {
  const html = await codeToHtml(code, {
    lang,
    theme,
    transformers: [
      {
        line(node) {
          this.addClassToHast(node, ['break-words', 'text-wrap']);
        },
        pre(hast) {
          this.addClassToHast(hast, 'bg-transparent p-2 rounded-md text-sm');
        },
      },
    ],
  });

  return (
    <div
      className={cn('overflow-x-hidden max-w-full', className)}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
