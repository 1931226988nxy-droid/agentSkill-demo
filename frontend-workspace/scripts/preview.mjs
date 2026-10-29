import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};
const routes = {
  admin: resolve(root, 'apps/admin-demo/dist'),
  lab: resolve(root, 'apps/component-lab/dist'),
};
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    if (path === '/') {
      res.writeHead(302, { Location: '/admin/' });
      res.end();
      return;
    }
    const [, app, ...parts] = path.split('/');
    const base = routes[app];
    if (!base) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    if (!parts.length) {
      res.writeHead(302, { Location: `/${app}/` });
      res.end();
      return;
    }
    const file = resolve(base, parts.join('/') || 'index.html');
    if (file !== base && !file.startsWith(base + sep)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    if (!(await stat(file)).isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
server.listen(5174, '127.0.0.1', () =>
  console.log('Admin: http://127.0.0.1:5174/admin/\nLab: http://127.0.0.1:5174/lab/'),
);
