import { codeToHtml } from "shiki";
import type { BundledLanguage, BundledTheme } from "shiki";

type Props = {
  code: string;
  lang?: BundledLanguage;
  theme?: BundledTheme;
  filename?: string;
};
export default async function Code({
  code,
  lang = "javascript",
  theme = "nord",
  filename,
}: Props) {
  const html = await codeToHtml(code, {
    lang,
    theme,

    transformers: [
      {
        line(node, line) {
          this.addClassToHast(node, ["break-words", "text-wrap"]);
        },
        pre(hast) {
          this.addClassToHast(hast, "!bg-transparent");
        },
      },
    ],
  });

  return (
    <div
      className="overflow-x-hidden max-w-full bg-secondary p-2 rounded-md text-sm"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
