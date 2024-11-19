import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { allQuestions, categories } from '../components/Survey';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

const calculateResults = (answers) => {
  const results = {
    categories: [],
    total: {
      percentage: 0,
      score: 0
    }
  };

  const maxScorePerCategory = 12;
  const maxPercentPerCategory = 100 / 3;

  for (let category = 0; category < 3; category++) {
    let categoryScore = 0;
    
    for (let question = 0; question < 4; question++) {
      const answer = parseInt(answers[`screen${category}_question${question}`]);
      categoryScore += answer;
    }
    
    const categoryPercentage = Number(((categoryScore / maxScorePerCategory) * maxPercentPerCategory).toFixed(1));
    
    results.categories.push({
      score: categoryScore,
      percentage: categoryPercentage
    });

    results.total.score += categoryScore;
  }

  results.total.percentage = Number((results.categories.reduce((sum, category) => sum + category.percentage, 0)).toFixed(1));

  return results;
};

const getRussianRating = (value) => {
  const stringValue = String(value);
  
  const ratings = {
    '1': 'Плохо (1 балл)',
    '2': 'Хорошо (2 балла)',
    '3': 'Отлично (3 балла)'
  };
  
  if (ratings[stringValue]) {
    return ratings[stringValue];
  }
  
  console.log('Неопределенное значение ответа:', value);
  return 'Не указано';
};

const generateManagerPDF = async (data, employeeNumber) => {
  const { userInfo, answers, evaluatedPerson } = data;
  
  console.log('Ответы для PDF:', answers);
  
  const results = calculateResults(answers.employee1);

  const docDefinition = {
    content: [
      {
        text: 'Результаты оценки сотрудника',
        style: 'header'
      },
      {
        text: '\n'
      },
      {
        text: [
          { text: 'Отдел: ', bold: true },
          userInfo.department,
          '\n',
          { text: 'Компания: ', bold: true },
          userInfo.company,
          '\n',
          { text: 'Оцениваемый сотрудник: ', bold: true },
          evaluatedPerson
        ]
      },
      {
        text: '\n\n'
      },
      ...categories['ru'].map((category, categoryIndex) => [
        {
          text: category,
          style: 'categoryHeader'
        },
        ...allQuestions['ru'][categoryIndex].map((question, questionIndex) => {
          const answerValue = answers.employee1[`screen${categoryIndex}_question${questionIndex}`];
          const rating = getRussianRating(answerValue);
          
          console.log(`Вопрос ${categoryIndex}-${questionIndex}:`, answerValue, rating);
          
          return {
            text: [
              { text: `${questionIndex + 1}. ${question}\n`, style: 'question' },
              { text: `Ответ: ${rating}\n`, style: 'answer' }
            ],
            margin: [0, 0, 0, 10]
          };
        }),
        {
          text: [
            `Итого по категории: `,
            `${results.categories[categoryIndex].score} баллов `,
            `(${results.categories[categoryIndex].percentage.toFixed(1)}%)\n\n`
          ],
          style: 'categoryTotal'
        }
      ]).flat(),
      {
        text: [
          `\nОБЩИЙ РЕЗУЛЬТАТ:\n`,
          `Общие баллы: ${results.total.score}/36\n`,
          `Общий процент: ${results.total.percentage.toFixed(1)}%`
        ],
        style: 'total'
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      categoryHeader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 10],
        color: '#2196f3'
      },
      question: {
        fontSize: 12,
        margin: [0, 5, 0, 2]
      },
      answer: {
        fontSize: 12,
        margin: [20, 0, 0, 5],
        color: '#666666'
      },
      categoryTotal: {
        fontSize: 12,
        bold: true,
        margin: [0, 5, 0, 15]
      },
      total: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 0]
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };

  return new Promise((resolve) => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer((buffer) => {
      resolve({
        buffer,
        fileName: `survey_results_employee${employeeNumber}.pdf`
      });
    });
  });
};

export const sendToTelegram = async (data) => {
  try {
    const results = calculateResults(data.answers.employee1);
    
    const caption = `📊 Результаты опроса\n\n` +
      `Отдел: ${data.userInfo.department}\n` +
      `Компания: ${data.userInfo.company}\n` +
      `Оцениваемый сотрудник: ${data.evaluatedPerson}\n\n` +
      `Коммуникация: ${results.categories[0].percentage.toFixed(1)}%\n` +
      `Эмоциональный интеллект: ${results.categories[1].percentage.toFixed(1)}%\n` +
      `Принятие решений: ${results.categories[2].percentage.toFixed(1)}%\n\n` +
      `Общий процент: ${results.total.percentage.toFixed(1)}%`;

    const { buffer, fileName } = await generateManagerPDF(data);

    const formData = new FormData();
    const pdfBlob = new Blob([buffer], { type: 'application/pdf' });
    formData.append('document', pdfBlob, fileName);
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('caption', caption);

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to send PDF to Telegram');
    }

    return true;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
}; 