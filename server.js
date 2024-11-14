const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Настройки CORS
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500'); // Разрешаем запросы с локального сайта
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
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
        return; // Выход из функции
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data); // Завершаем ответ
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
        console.error('Ошибка записи файла:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Ошибка при создании страницы', error: err.message }));
        return; // Выход из функции
      }
      console.log('Страница успешно создана');
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Страница успешно создана' }));
    });
  } else {
    res.writeHead(405, { 'Allow': 'GET, POST, OPTIONS' });
    res.end('Метод не поддерживается');
  }
});

server.listen(PORT, () => {
  console.log(`Сервер работает на http://150.241.99.160:${PORT}`);
});
