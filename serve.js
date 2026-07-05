// Zero-dependency static server for the mesh gradient generator.
// Usage: node serve.js   (opens http://localhost:4321)
// Port:  PORT=8080 node serve.js

const http = require('http')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const PORT = process.env.PORT || 4321
const ROOT = __dirname
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0])
  if (rel === '/') rel = '/index.html'
  const file = path.join(ROOT, path.normalize(rel))
  if (!file.startsWith(ROOT)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404)
      return res.end('Not found')
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' })
    res.end(data)
  })
})

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`
  console.log(`\n  Mesh gradient generator: ${url}`)
  console.log('  Stop: Ctrl+C\n')
  const opener =
    process.platform === 'win32' ? `start "" "${url}"` :
    process.platform === 'darwin' ? `open "${url}"` :
    `xdg-open "${url}"`
  exec(opener, () => {})
})
