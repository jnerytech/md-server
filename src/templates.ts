import path from 'path';

const CSS_RESET = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1f2328; }
  a { color: #0969da; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;

const CSS_LAYOUT = `
  ${CSS_RESET}
  html, body { height: 100%; overflow: hidden; }
  body {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 240px 1fr;
    background: #fff;
  }
  body.sidebar-collapsed { grid-template-columns: 0 1fr; }
  body.sidebar-collapsed .sidebar { display: none; }
  .top-bar {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #f6f8fa;
    border-bottom: 1px solid #d0d7de;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    min-width: 0;
  }
  .toggle-btn {
    background: none;
    border: 1px solid #d0d7de;
    border-radius: 4px;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
    line-height: 1;
    color: #57606a;
    flex-shrink: 0;
  }
  .toggle-btn:hover { background: #eaeef2; }
  .breadcrumb { color: #57606a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar {
    grid-row: 2;
    grid-column: 1;
    overflow-y: auto;
    border-right: 1px solid #d0d7de;
    background: #f6f8fa;
    padding: 0.5rem 0;
  }
  .sidebar-group { margin-bottom: 0.75rem; }
  .sidebar-group-header {
    font-size: 0.6875rem;
    font-weight: 600;
    color: #656d76;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.375rem 1rem 0.25rem;
  }
  .sidebar-item {
    display: block;
    padding: 0.3125rem 1rem;
    font-size: 0.875rem;
    color: #24292f;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sidebar-item:hover { background: #eaeef2; text-decoration: none; }
  .sidebar-item.active {
    background: #ddf4ff;
    color: #0969da;
    font-weight: 600;
    box-shadow: inset 3px 0 0 #0969da;
  }
  .content {
    grid-row: 2;
    grid-column: 2;
    overflow-y: auto;
    padding: 2rem 2.5rem 4rem;
  }
  .content h1 { font-size: 1.875rem; padding-bottom: 0.5rem; border-bottom: 1px solid #d0d7de; margin-bottom: 1.25rem; }
  .content h2 { font-size: 1.375rem; margin: 1.75rem 0 0.75rem; padding-bottom: 0.375rem; border-bottom: 1px solid #d0d7de; }
  .content h3 { font-size: 1.125rem; margin: 1.5rem 0 0.5rem; }
  .content h4, .content h5, .content h6 { font-size: 1rem; margin: 1.25rem 0 0.5rem; }
  .content p { margin: 0.75rem 0; line-height: 1.7; }
  .content ul, .content ol { margin: 0.75rem 0; padding-left: 1.75rem; }
  .content li { margin: 0.25rem 0; line-height: 1.7; }
  .content li > ul, .content li > ol { margin: 0.25rem 0; }
  .content code { font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace; font-size: 0.875em; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 0.1em 0.4em; }
  .content pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 1rem 1.25rem; overflow-x: auto; margin: 1rem 0; }
  .content pre code { background: none; border: none; padding: 0; font-size: 0.875rem; line-height: 1.6; }
  .content blockquote { border-left: 4px solid #d0d7de; margin: 1rem 0; padding: 0.5rem 1rem; color: #57606a; }
  .content table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.9375rem; }
  .content th, .content td { border: 1px solid #d0d7de; padding: 0.5rem 0.75rem; text-align: left; }
  .content th { background: #f6f8fa; font-weight: 600; }
  __ZEBRA__
  .content hr { border: none; border-top: 1px solid #d0d7de; margin: 1.5rem 0; }
  .content img { max-width: 100%; height: auto; }
  .content .task-list-item { list-style: none; margin-left: -1.75rem; padding-left: 1.75rem; }
`;

const CSS_FILE = `
  ${CSS_RESET}
  body { background: #fff; }
  .top-bar { background: #f6f8fa; border-bottom: 1px solid #d0d7de; padding: 0.625rem 1.25rem; font-size: 0.875rem; }
  .top-bar a { color: #57606a; }
  .top-bar a:hover { color: #0969da; text-decoration: none; }
  .container { max-width: 860px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
  h1 { font-size: 1.875rem; padding-bottom: 0.5rem; border-bottom: 1px solid #d0d7de; margin-bottom: 1.25rem; }
  h2 { font-size: 1.375rem; margin: 1.75rem 0 0.75rem; padding-bottom: 0.375rem; border-bottom: 1px solid #d0d7de; }
  h3 { font-size: 1.125rem; margin: 1.5rem 0 0.5rem; }
  h4, h5, h6 { font-size: 1rem; margin: 1.25rem 0 0.5rem; }
  p { margin: 0.75rem 0; line-height: 1.7; }
  ul, ol { margin: 0.75rem 0; padding-left: 1.75rem; }
  li { margin: 0.25rem 0; line-height: 1.7; }
  li > ul, li > ol { margin: 0.25rem 0; }
  code { font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace; font-size: 0.875em; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 4px; padding: 0.1em 0.4em; }
  pre { background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 1rem 1.25rem; overflow-x: auto; margin: 1rem 0; }
  pre code { background: none; border: none; padding: 0; font-size: 0.875rem; line-height: 1.6; }
  blockquote { border-left: 4px solid #d0d7de; margin: 1rem 0; padding: 0.5rem 1rem; color: #57606a; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 0.9375rem; }
  th, td { border: 1px solid #d0d7de; padding: 0.5rem 0.75rem; text-align: left; }
  th { background: #f6f8fa; font-weight: 600; }
  __ZEBRA__
  hr { border: none; border-top: 1px solid #d0d7de; margin: 1.5rem 0; }
  img { max-width: 100%; height: auto; }
  .task-list-item { list-style: none; margin-left: -1.75rem; padding-left: 1.75rem; }
`;

function buildSidebar(files: string[], currentPath: string): string {
  const groups = new Map<string, string[]>();

  for (const f of files) {
    const dir = path.dirname(f) === '.' ? '(raiz)' : path.dirname(f);
    const list = groups.get(dir) ?? [];
    list.push(f);
    groups.set(dir, list);
  }

  const sections = Array.from(groups.entries())
    .map(([dir, groupFiles]) => {
      const items = groupFiles
        .map((f) => {
          const name = path.basename(f, '.md');
          const href = '/file/' + f.split('/').map(encodeURIComponent).join('/');
          const isActive = f === currentPath;
          return `<a class="sidebar-item${isActive ? ' active' : ''}" href="${href}" title="${escapeHtml(f)}">${escapeHtml(name)}</a>`;
        })
        .join('\n');
      return `<div class="sidebar-group">
  <div class="sidebar-group-header">${escapeHtml(dir)}</div>
  ${items}
</div>`;
    })
    .join('\n');

  return `<nav class="sidebar">\n${sections}\n</nav>`;
}

export function renderFilePage(
  htmlContent: string,
  relPath: string,
  files: string[],
  { showBack = true, speech = false }: { showBack?: boolean; speech?: boolean } = {}
): string {
  const name = path.basename(relPath, '.md');

  if (files.length === 0) {
    const topBar = showBack
      ? `<div class="top-bar">
    <a href="/">&#8592; Índice</a>
    &nbsp;/&nbsp;
    ${escapeHtml(relPath)}
  </div>`
      : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)}</title>
  <style>${CSS_FILE.replace('__ZEBRA__', speech ? '' : 'tr:nth-child(even) td { background: #f6f8fa; }')}${speech ? 'th { background: none; font-weight: normal; }' : ''}</style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
</head>
<body>
  ${topBar}
  <div class="container">
    ${htmlContent}
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
</body>
</html>`;
  }

  const zebraRule = speech ? '' : '.content tr:nth-child(even) td { background: #f6f8fa; }';
  const speechOverride = speech ? '.content th { background: none; font-weight: normal; }' : '';
  const css = CSS_LAYOUT.replace('__ZEBRA__', zebraRule) + speechOverride;
  const sidebar = buildSidebar(files, relPath);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)}</title>
  <style>${css}</style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
</head>
<body>
  <div class="top-bar">
    <button class="toggle-btn" id="toggle-btn" title="Toggle sidebar">&#9776;</button>
    <span class="breadcrumb">${escapeHtml(relPath)}</span>
  </div>
  ${sidebar}
  <div class="content">
    ${htmlContent}
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>
    hljs.highlightAll();
    document.getElementById('toggle-btn').addEventListener('click', function() {
      document.body.classList.toggle('sidebar-collapsed');
    });
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
