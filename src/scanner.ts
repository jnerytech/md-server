import fs from 'fs';
import path from 'path';

export function scanMarkdownFiles(root: string): string[] {
  const entries = fs.readdirSync(root, { recursive: true, encoding: 'utf-8' });
  return (entries as string[])
    .filter((e) => e.toLowerCase().endsWith('.md'))
    .filter((e) => fs.statSync(path.join(root, e)).isFile())
    .map((e) => e.split(path.sep).join('/'))
    .sort();
}
