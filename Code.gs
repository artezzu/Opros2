function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  try {
    const jsonString = e.parameter.data;
    const data = JSON.parse(jsonString);
    
    Logger.log('Received data:', data);

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Определяем тип опроса и выбираем соответствующий лист
    const isManagerSurvey = data.employees !== undefined;
    let sheet;
    
    if (isManagerSurvey) {
      // Для оценки сотрудников руководителем используем Лист2
      sheet = spreadsheet.getSheetByName('Лист2');
      if (!sheet) {
        sheet = spreadsheet.insertSheet('Лист2');
      }
      setupSheet2Headers(sheet);
    } else {
      // Для оценки руководителя сотрудником используем Лист1
      sheet = spreadsheet.getSheetByName('Лист1');
      if (!sheet) {
        sheet = spreadsheet.insertSheet('Лист1');
      }
      setupSheet1Headers(sheet);
    }

    if (isManagerSurvey) {
      // Обработка оценки руководителем (Лист2)
      const employees = data.employees;
      const answers1 = data.answers.employee1;
      const answers2 = data.answers.employee2;

      // Записываем данные для первого сотрудника с его именем
      appendEmployeeData(sheet, data.userInfo, data.evaluatedPerson, answers1);

      // Если есть второй сотрудник, записываем его данные с его именем
      if (answers2) {
        appendEmployeeData(sheet, data.userInfo, data.evaluatedPerson, answers2);
      }
    } else {
      // Обработка оценки сотрудником (Лист1)
      const answers = JSON.parse(data.surveyAnswers);
      const userInfo = data.userInfo;
      appendEmployeeData(sheet, userInfo, userInfo.manager, answers);
    }

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);

  } catch (error) {
    Logger.log('Error in doPost:', error.toString());
    Logger.log('Error stack:', error.stack);
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

function setupSheet1Headers(sheet) {
  // Создаем заголовки для Лист1 если их нет
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Компания',
      'Отдел',
      'Должность сотрудника',
      'Оцениваемый руководитель',
      'Навыки коммуникации (баллы)',
      'Эмоциональная устойчивость (баллы)',
      'Постановка задач (баллы)',
      'Навыки коммуникации (%)',
      'Эмоциональная устойчивость (%)',
      'Постановка задач (%)',
      'Общий балл',
      'Общий процент',
      'Дата'
    ]);
    formatHeaders(sheet);
  }
}

function setupSheet2Headers(sheet) {
  // Создаем заголовки для Лист2 если их нет
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Компания',
      'Отдел',
      'Должность руководителя',
      'Оцениваемый сотрудник',
      'Навыки коммуникации (баллы)',
      'Эмоциональная устойчивость (баллы)',
      'Постановка задач (баллы)',
      'Навыки коммуникации (%)',
      'Эмоционалная устойчивость (%)',
      'Постановка задач (%)',
      'Общий балл',
      'Общий процент',
      'Дата'
    ]);
    formatHeaders(sheet);
  }
}

function formatHeaders(sheet) {
  // Форматируем заголовки
  const headerRange = sheet.getRange(1, 1, 1, 13);
  headerRange.setBackground('#4a4a4a')
             .setFontColor('#ffffff')
             .setFontWeight('bold')
             .setHorizontalAlignment('center')
             .setVerticalAlignment('middle')
             .setWrap(true);
  
  // Устанавливаем ширину столбцов
  sheet.setColumnWidths(1, 5, 150); // Для информации
  sheet.setColumnWidths(6, 13, 120); // Для баллов и процентов
  sheet.setFrozenRows(1);
}

function appendEmployeeData(sheet, userInfo, evaluatedPerson, answers) {
  // Считаем баллы по категориям (4 вопроса в каждой категории)
  const communication = parseInt(answers.screen0_question0) + parseInt(answers.screen0_question1) + 
                       parseInt(answers.screen0_question2) + parseInt(answers.screen0_question3);
  const emotional = parseInt(answers.screen1_question0) + parseInt(answers.screen1_question1) + 
                   parseInt(answers.screen1_question2) + parseInt(answers.screen1_question3);
  const tasks = parseInt(answers.screen2_question0) + parseInt(answers.screen2_question1) + 
                parseInt(answers.screen2_question2) + parseInt(answers.screen2_question3);

  // Максимальный балл за категорию - 12 (4 вопроса по 3 балла)
  const maxScorePerCategory = 12;
  const maxPercentPerCategory = 100 / 3;

  // Считаем проценты для каждой категории
  const communicationPercent = Number(((communication / maxScorePerCategory) * maxPercentPerCategory).toFixed(1));
  const emotionalPercent = Number(((emotional / maxScorePerCategory) * maxPercentPerCategory).toFixed(1));
  const tasksPercent = Number(((tasks / maxScorePerCategory) * maxPercentPerCategory).toFixed(1));

  // Общий балл из 36 возможных (3 категории по 12 баллов)
  const totalScore = communication + emotional + tasks;
  // Общий процент (сумма процентов по категориям, максимум 100%)
  const totalPercent = Number((communicationPercent + emotionalPercent + tasksPercent).toFixed(1));

  // Форматируем дату
  const now = new Date();
  const formattedDate = Utilities.formatDate(now, 'Asia/Tashkent', 'dd.MM.yyyy, HH:mm:ss');

  // Используем переданное имя сотрудника напрямую
  const rowData = [
    userInfo.company,
    userInfo.department,
    userInfo.position,
    evaluatedPerson, // Используем переданное имя напрямую
    communication,
    emotional,
    tasks,
    communicationPercent,
    emotionalPercent,
    tasksPercent,
    totalScore,
    totalPercent,
    formattedDate
  ];

  // Логируем для отладки
  Logger.log('Adding row with employee name:', evaluatedPerson);
  Logger.log('Full data:', JSON.stringify({
    userInfo: userInfo,
    evaluatedPerson: evaluatedPerson,
    answers: answers
  }));

  sheet.appendRow(rowData);
  const lastRow = sheet.getLastRow();
  
  const dataRange = sheet.getRange(lastRow, 1, 1, 13);
  dataRange.setHorizontalAlignment('center');
  
  // Форматируем числовые значения
  sheet.getRange(lastRow, 5, 1, 3).setNumberFormat('0'); // Баллы - целые числа
  sheet.getRange(lastRow, 8, 1, 3).setNumberFormat('0.0"%"'); // Проценты - с одним знаком после запятой
  sheet.getRange(lastRow, 11, 1, 1).setNumberFormat('0'); // Общий балл - целые числа
  sheet.getRange(lastRow, 12, 1, 1).setNumberFormat('0.0"%"'); // Общий процент - с одним знаком после запятой
  sheet.getRange(lastRow, 13, 1, 1).setNumberFormat('@'); // Формат для даты как текст
  
  // Чередующаяся подсветка строк
  if (lastRow % 2 === 0) {
    dataRange.setBackground('#f8f9fa');
  }

  // Добавляем границы
  dataRange.setBorder(true, true, true, true, true, true);
}

function doGet() {
  return ContentService.createTextOutput('Script is running').setMimeType(ContentService.MimeType.TEXT);
}