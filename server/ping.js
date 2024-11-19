const https = require('https');

const ping = () => {
  const url = 'https://opros2.onrender.com'; // Замените на ваш URL после деплоя
  
  setInterval(() => {
    https.get(url, (resp) => {
      if (resp.statusCode === 200) {
        console.log('Ping successful');
      } else {
        console.log('Ping failed with status:', resp.statusCode);
      }
    }).on('error', (err) => {
      console.log('Ping error:', err.message);
    });
  }, 840000); // Пинг каждые 14 минут (840000 мс)
};

module.exports = ping; 