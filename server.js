const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const BASE_DIR = __dirname;

const server = http.createServer((req, res) => {
  let filePath = path.join(BASE_DIR, req.url === '/' ? '/frontend/index.html' : req.url);
  
  const ext = path.extname(filePath);
  let contentType = 'text/html';
  
  if (ext === '.css') contentType = 'text/css';
  else if (ext === '.js') contentType = 'text/javascript';
  else if (ext === '.json') contentType = 'application/json';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg') contentType = 'image/jpeg';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1><p>Requested: ' + req.url + '</p>');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Web 服务器运行在 http://localhost:${PORT}`);
  console.log(`📱 打开浏览器访问: http://localhost:${PORT}/frontend/index.html`);
});
