const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Настройки CORS (добавление поддержки для запросов с любого домена)
  res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешить все домены
  // Или, если нужно разрешить только определенные домены, замените '*' на нужный адрес:
  // res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Сервер работает!</h1>');
  if (req.method === 'OPTIONS') {
    // Обрабатываем preflight запросы
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    // Обрабатываем GET-запрос для главной страницы
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Ошибка сервера');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  }

  if (req.method === 'POST' && req.url === '/create-page') {
    const newPagePath = path.join(__dirname, 'new-page.html');
    const newPageContent = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Новая страница</title>
      </head>
      <body>
        <h1>Это новая страница!</h1>
        <p>Эта страница была создана сервером.</p>
      </body>
      </html>
    `;

    fs.writeFile(newPagePath, newPageContent, (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Ошибка при создании страницы', error: err.message }));
        return;
      }
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Страница успешно создана' }));
    });
  } else {
    res.writeHead(405, { 'Allow': 'GET, POST, OPTIONS' });
    res.end('Метод не поддерживается');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://0.0.0.0:${PORT}`);
});
