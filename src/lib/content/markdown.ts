import { createMarkdownProcessor, markdownConfigDefaults } from "@astrojs/markdown-remark";
import rehypeSanitize from "rehype-sanitize";

let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;

async function getProcessor() {
  processor ??= await createMarkdownProcessor({
    rehypePlugins: [...markdownConfigDefaults.rehypePlugins, rehypeSanitize],
  });
  return processor;
}

export async function renderMarkdownBody(source: string): Promise<string> {
  if (!source) {
    return "";
  }
  const md = await getProcessor();
  const result = await md.render(source);
  return result.code;
}
