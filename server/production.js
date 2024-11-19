const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Разрешаем CORS
app.use(cors());

// Парсим JSON
app.use(express.json());

// Раздаем статические файлы из папки build
app.use(express.static(path.join(__dirname, '../build')));

// Все остальные GET-запросы отправляем на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 