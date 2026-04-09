const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
};

const ALLOWED = [
  'index.html', 'admin.html', 'style.css', 'data.json',
  'project-1.html', 'project-2.html', 'project-3.html',
];

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';

  // Strip leading slash
  const rel = urlPath.replace(/^\//, '');
  const ext = path.extname(rel).toLowerCase();

  // Allow images/ directory
  const isImage = rel.startsWith('images/') && (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.svg');
  const isAllowed = ALLOWED.includes(rel) || isImage;

  if (!isAllowed) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const filePath = path.join(ROOT, rel);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
      return;
    }
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Portfolio server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
});
