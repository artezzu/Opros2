import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { sendToTelegram } from '../services/telegramService';
import { sendToGoogleSheets } from '../services/googleSheetsService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 20px;
    text-align: center;
  }
`;

const CheckmarkWrapper = styled(motion.div)`
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCheckmark = styled(motion.svg)`
  width: 100%;
  height: 100%;
  stroke-width: 5;
  stroke: ${props => props.theme.primary};
  stroke-miterlimit: 10;
  
  circle {
    fill: none;
    stroke-width: 5;
    stroke-miterlimit: 10;
  }

  path {
    fill: none;
    stroke-width: 5;
  }
`;

const Title = styled(motion.h2)`
  color: ${props => props.theme.primary};
  margin-top: 20px;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-top: 16px;
  }
`;

const ThankYou = () => {
  const language = localStorage.getItem('language') || 'ru';

  useEffect(() => {
    const sendData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const employees = JSON.parse(localStorage.getItem('employees') || '{}');
        const answers1 = localStorage.getItem('answers_employee1');
        const answers2 = localStorage.getItem('answers_employee2');
        
        console.log('Stored answers:', answers1);
        
        if (!answers1) {
          console.error('No answers found in localStorage');
          return;
        }

        if (userInfo && employees && answers1) {
          const data1 = {
            userInfo,
            employees,
            answers: {
              employee1: JSON.parse(answers1)
            },
            evaluatedPerson: employees.employee1,
            employeeNumber: 1
          };

          await Promise.all([
            sendToGoogleSheets(data1),
            sendToTelegram(data1)
          ]);

          if (answers2) {
            const data2 = {
              userInfo,
              employees,
              answers: {
                employee1: JSON.parse(answers2)
              },
              evaluatedPerson: employees.employee2,
              employeeNumber: 2
            };

            await new Promise(resolve => setTimeout(resolve, 500));

            await Promise.all([
              sendToGoogleSheets(data2),
              sendToTelegram(data2)
            ]);
          }

          localStorage.removeItem('userInfo');
          localStorage.removeItem('employees');
          localStorage.removeItem('answers_employee1');
          localStorage.removeItem('answers_employee2');
          localStorage.removeItem('currentEmployee');
          localStorage.removeItem('currentScreen');
        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
    };

    sendData();
  }, []);

  const translations = {
    ru: {
      thank: 'Спасибо за прохождение опроса!'
    },
    uz: {
      thank: 'So\'rovnomani to\'ldiganingiz uchun rahmat!'
    }
  };

  return (
    <Container>
      <CheckmarkWrapper
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <StyledCheckmark viewBox="0 0 52 52">
          <circle cx="26" cy="26" r="25" />
          <path d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </StyledCheckmark>
      </CheckmarkWrapper>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {translations[language].thank}
      </Title>
    </Container>
  );
};

export default ThankYou; 