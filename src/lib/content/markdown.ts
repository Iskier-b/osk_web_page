import { createMarkdownProcessor } from "@astrojs/markdown-remark";

let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | null = null;

async function getProcessor() {
  processor ??= await createMarkdownProcessor();
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
