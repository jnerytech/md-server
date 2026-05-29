import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { startServer } from './server.js';
import { SUPPORTED_EXTENSIONS } from './scanner.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json') as { version: string };

const HELP = `
Usage: md-server [folder] [options]

  Serves Markdown files from a folder as HTML in the browser.
  Defaults to the current directory when no folder is given.

Arguments:
  folder        Path to the folder containing .md files (default: cwd)

Options:
  --port <n>    Port to listen on (default: random available port)
  --speech      TTS-friendly rendering (for Speechify and similar readers)
  --code        Also serve code files (default: .md only)
  --version     Print version number
  --help        Show this help message

Examples:
  md-server
  md-server ./guidelines
  md-server ../docs --port 4000
  md-server "arquivo.md" --speech
`.trim();

const args = process.argv.slice(2);

if (args.includes('--version')) {
  console.log(version);
  process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
  console.log(HELP);
  process.exit(0);
}

const speech = args.includes('--speech');
const code = args.includes('--code');
const portFlagIndex = args.indexOf('--port');
const port = portFlagIndex !== -1 ? parseInt(args[portFlagIndex + 1], 10) : undefined;

if (port !== undefined && (isNaN(port) || port < 1 || port > 65535)) {
  console.error('Error: --port requires a valid port number (1–65535)');
  process.exit(1);
}

const pathParts = args.filter((a, i) => {
  if (a.startsWith('--')) return false;
  if (portFlagIndex !== -1 && i === portFlagIndex + 1) return false;
  return true;
});

const folderArg = pathParts.length > 0 ? pathParts.join(' ') : undefined;

const target = folderArg ? path.resolve(process.cwd(), folderArg) : process.cwd();

if (!fs.existsSync(target)) {
  console.error(`Error: Not found: ${target}`);
  process.exit(1);
}

const stat = fs.statSync(target);

if (stat.isFile()) {
  const ext = path.extname(target).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    console.error(`Error: Unsupported file type: ${target}`);
    process.exit(1);
  }
  startServer({ file: target, port, speech });
} else if (stat.isDirectory()) {
  startServer({ root: target, port, speech, code });
} else {
  console.error(`Error: Not a file or directory: ${target}`);
  process.exit(1);
}
