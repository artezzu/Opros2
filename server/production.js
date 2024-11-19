const express = require('express');
const path = require('path');
const cors = require('cors');
const https = require('https');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// Самопинг каждые 14 минут
setInterval(() => {
  https.get('https://opros2.onrender.com', (res) => {
    console.log('Self-ping successful:', res.statusCode);
  }).on('error', (err) => {
    console.error('Self-ping failed:', err.message);
  });
}, 840000);

// Main route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 