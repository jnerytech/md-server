import { marked } from 'marked';

marked.use({ gfm: true });

export function renderMarkdown(content: string): string {
  const result = marked.parse(content);
  if (result instanceof Promise) {
    throw new Error('marked returned Promise unexpectedly');
  }
  return result;
}
