import fs from 'fs';
import path from 'path';
import ignore from 'ignore';

export const MD_EXTENSIONS = new Set(['.md']);

export const CODE_EXTENSIONS = new Set([
  // TypeScript / JavaScript
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  // Python
  '.py',
  // C#
  '.cs',
  // Go
  '.go',
  // Rust
  '.rs',
  // Java / Kotlin / Scala
  '.java', '.kt', '.kts', '.scala',
  // Ruby
  '.rb',
  // PHP
  '.php',
  // C / C++
  '.c', '.cpp', '.cc', '.h', '.hpp',
  // Shell
  '.sh', '.bash',
  // Dart / Swift
  '.dart', '.swift',
  // Config / Data
  '.yaml', '.yml', '.json', '.toml', '.ini', '.conf',
  // Web
  '.html', '.htm', '.css', '.scss', '.sass', '.less',
  // SQL
  '.sql',
]);

export const SUPPORTED_EXTENSIONS = new Set([...MD_EXTENSIONS, ...CODE_EXTENSIONS]);

function loadGitignore(root: string): ReturnType<typeof ignore> {
  const ig = ignore();
  const entries = fs.readdirSync(root, { recursive: true, encoding: 'utf-8' }) as string[];
  for (const entry of entries) {
    if (path.basename(entry) !== '.gitignore') continue;
    const absPath = path.join(root, entry);
    try {
      const content = fs.readFileSync(absPath, 'utf-8');
      const dir = path.dirname(entry).split(path.sep).join('/');
      if (dir === '.') {
        ig.add(content);
      } else {
        // Prefix patterns with subdir so they apply to the correct paths
        const lines = content.split('\n').map((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) return line;
          return `${dir}/${trimmed}`;
        });
        ig.add(lines.join('\n'));
      }
    } catch {
      // skip unreadable .gitignore
    }
  }
  return ig;
}

export function scanFiles(root: string, includeCode = false): string[] {
  const allowed = includeCode ? SUPPORTED_EXTENSIONS : MD_EXTENSIONS;
  const ig = loadGitignore(root);
  const entries = fs.readdirSync(root, { recursive: true, encoding: 'utf-8' }) as string[];
  return entries
    .filter((e) => {
      const ext = path.extname(e).toLowerCase();
      return allowed.has(ext);
    })
    .filter((e) => fs.statSync(path.join(root, e)).isFile())
    .map((e) => e.split(path.sep).join('/'))
    .filter((e) => !ig.ignores(e))
    .sort();
}
