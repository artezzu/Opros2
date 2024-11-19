const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();

// Настройка CORS для разработки
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST'],
  credentials: true
}));

app.use(express.json());

const SPREADSHEET_ID = '1z5jcNcq84jxdoRMsX54rV3e6hXKRRFJwUpR28ePFmh4';
const SHEET_ID = '2022349392';

// Создаем auth клиент
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json', // Убедитесь, что файл находится в папке server
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

app.post('/api/submit-survey', async (req, res) => {
  try {
    const { userInfo, surveyAnswers } = req.body;
    const answers = JSON.parse(surveyAnswers);
    
    // Получаем авторизованный клиент
    const authClient = await auth.getClient();
    
    // Создаем инстанс Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Форматируем данные для записи
    const values = [[
      new Date().toLocaleString(),
      userInfo.company,
      userInfo.department,
      userInfo.position,
      userInfo.manager,
      // Добавляем результаты опроса
      ...Object.values(answers)
    ]];

    // Изменяем здесь - указываем конкретно Лист2
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Лист2!A:Z', // Меняем на Лист2
      valueInputOption: 'USER_ENTERED',
      resource: {
        values
      }
    });

    console.log('Data written successfully:', response.data);
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing to sheet:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 