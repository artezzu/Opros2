const GOOGLE_SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
const GOOGLE_SHEET_ID = process.env.REACT_APP_GOOGLE_SHEET_ID;

export const sendToGoogleSheets = async (data) => {
  const maxRetries = 3;
  const retryDelay = 2000;

  const sendWithRetry = async (attempt = 1) => {
    try {
      const isManagerSurvey = data.employees !== undefined;
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        ...data,
        isManagerSurvey,
        targetSheet: 'Лист2',
        attempt
      }));

      console.log(`Attempt ${attempt} - Sending data to sheets:`, {
        isManagerSurvey,
        data,
        targetSheet: 'Лист2'
      });

      await fetch('https://script.google.com/macros/s/AKfycbzKr3IWH7StaK7lq53lST1dXuF1BKlUUnUU2lP6ibPLptTxz5jmoV988qpwOVcfOBth/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          data: JSON.stringify({
            ...data,
            isManagerSurvey,
            targetSheet: 'Лист2'
          })
        })
      });

      return true;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return sendWithRetry(attempt + 1);
      }
      
      throw error;
    }
  };

  try {
    return await sendWithRetry();
  } catch (error) {
    console.error('All retries failed:', error);
    return false;
  }
}; 