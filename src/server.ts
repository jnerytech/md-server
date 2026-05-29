import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { scanFiles, SUPPORTED_EXTENSIONS } from './scanner.js';
import { renderMarkdown, renderMarkdownSpeech, renderCodeFile, renderCodeFileSpeech } from './renderer.js';
import { renderFilePage } from './templates.js';

interface ServerOptions {
  root?: string;
  file?: string;
  port?: number;
  speech?: boolean;
}

const EXT_TO_LANG: Record<string, string> = {
  '.ts': 'typescript', '.tsx': 'typescript',
  '.js': 'javascript', '.jsx': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript',
  '.py': 'python',
  '.cs': 'csharp',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.rb': 'ruby',
  '.php': 'php',
  '.c': 'c',
  '.cpp': 'cpp', '.cc': 'cpp', '.h': 'cpp', '.hpp': 'cpp',
  '.sh': 'bash', '.bash': 'bash',
  '.dart': 'dart',
  '.swift': 'swift',
  '.kt': 'kotlin', '.kts': 'kotlin',
  '.scala': 'scala',
  '.yaml': 'yaml', '.yml': 'yaml',
  '.json': 'json',
  '.toml': 'toml',
  '.html': 'html', '.htm': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',
  '.sql': 'sql',
};

const LANG_DISPLAY: Record<string, string> = {
  typescript: 'TypeScript', javascript: 'JavaScript', python: 'Python',
  csharp: 'C#', go: 'Go', rust: 'Rust', java: 'Java', ruby: 'Ruby',
  php: 'PHP', c: 'C', cpp: 'C++', bash: 'Shell', dart: 'Dart',
  swift: 'Swift', kotlin: 'Kotlin', scala: 'Scala', yaml: 'YAML',
  json: 'JSON', toml: 'TOML', html: 'HTML', css: 'CSS', scss: 'SCSS',
  sass: 'Sass', less: 'Less', sql: 'SQL',
};

function renderFile(
  absPath: string,
  speech: boolean,
): { html: string } {
  const ext = path.extname(absPath).toLowerCase();
  const isMd = ext === '.md';
  const content = fs.readFileSync(absPath, 'utf-8');

  if (isMd) {
    const render = speech ? renderMarkdownSpeech : renderMarkdown;
    return { html: render(content) };
  }

  const lang = EXT_TO_LANG[ext] ?? '';
  const render = speech ? renderCodeFileSpeech : renderCodeFile;
  return { html: render(content, lang) };
}

export function startServer({ root, file, port = 0, speech = false }: ServerOptions): void {
  const app = express();

  if (file) {
    const absFile = path.resolve(file);
    app.get('/', (_req, res) => {
      try {
        const { html } = renderFile(absFile, speech);
        res.send(renderFilePage(html, path.basename(absFile), [], { showBack: false, speech }));
      } catch {
        res.status(500).send('Error reading file');
      }
    });
  } else {
    const resolvedRoot = path.resolve(root!);

    app.get('/', (_req, res) => {
      const files = scanFiles(resolvedRoot);
      if (files.length === 0) {
        res.status(404).send('No supported files found');
        return;
      }
      const readmeIdx = files.findIndex((f) => path.basename(f).toLowerCase() === 'readme.md');
      const target = readmeIdx >= 0 ? files[readmeIdx] : files[0];
      const href = '/file/' + target.split('/').map(encodeURIComponent).join('/');
      res.redirect(302, href);
    });

    app.get('/file/*', (req, res) => {
      const relPath = (req.params as Record<string, string>)[0];
      if (!relPath) {
        res.status(400).send('Bad Request');
        return;
      }

      const absPath = path.resolve(resolvedRoot, ...relPath.split('/'));

      if (!absPath.startsWith(resolvedRoot + path.sep) && absPath !== resolvedRoot) {
        res.status(403).send('Forbidden');
        return;
      }

      const ext = path.extname(absPath).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.has(ext)) {
        res.status(404).send('Not Found');
        return;
      }

      if (!fs.existsSync(absPath)) {
        res.status(404).send('Not Found');
        return;
      }

      try {
        const { html } = renderFile(absPath, speech);
        const files = scanFiles(resolvedRoot);
        res.send(renderFilePage(html, relPath, files, { speech }));
      } catch {
        res.status(500).send('Error reading file');
      }
    });
  }

  const server = http.createServer(app);

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\nError: Port ${port} is already in use. Try again (a new port will be chosen) or use --port <n>.\n`);
    } else {
      console.error(`\nServer error: ${err.message}\n`);
    }
    process.exit(1);
  });

  server.listen(port, () => {
    const addr = server.address();
    const actualPort = typeof addr === 'object' && addr ? addr.port : port;
    const url = `http://localhost:${actualPort}`;
    const serving = file ?? root!;
    console.log(`\n  md-server running at ${url}`);
    console.log(`  Serving: ${path.resolve(serving)}\n`);

    import('open')
      .then(({ default: open }) => open(url))
      .catch(() => {
        console.log(`  Could not open browser automatically. Navigate to ${url}`);
      });
  });
}
