import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 95%;
  margin: 20px auto;
  padding: 24px;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    padding: 16px;
    border-radius: 0;
    min-height: 100vh;
  }
`;

const Form = styled.form`
  position: relative;
  z-index: 2;
`;

const QuestionContainer = styled(motion.div)`
  width: 100%;
`;

const questionVariants = {
  enter: {
    opacity: 0,
    x: 100,
  },
  center: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -100,
  }
};

const Question = styled.div`
  position: relative;
  z-index: 3;
  margin-bottom: 24px;
  padding: 20px;
  background: ${props => props.theme.background};
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

const QuestionText = styled.p`
  font-size: 18px;
  color: ${props => props.theme.text};
  margin-bottom: 20px;
  font-weight: 500;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
    margin-bottom: 12px;
  }
`;

const RadioGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.theme.surface};
  
  @media (max-width: 768px) {
    padding: 12px;
    font-size: 14px;
  }

  @media (hover: hover) {
    &:hover {
      border-color: ${props => props.theme.primary};
      transform: translateY(-2px);
    }
  }

  ${props => props.$isSelected && `
    background: ${props.theme.primary}15;
    border-color: ${props.theme.primary};
  `}
`;

const RadioInput = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

const RadioText = styled.span`
  font-size: 16px;
  line-height: 1.2;
  flex: 1;
  white-space: normal;
`;

const Button = styled.button`
  padding: 16px 32px;
  font-size: 18px;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 16px;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Progress = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.background};
  border-radius: 999px;
  margin-bottom: 32px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: ${props => props.$progress}%;
  height: 100%;
  background: ${props => props.theme.gradient};
  border-radius: 999px;
  transition: width 0.5s ease;
`;

export const allQuestions = {
  ru: [
    // Категория 1: Коммуникация
    [
      'Насколько Сотруднику получается донести сложную информацию простым языком своим подчиненным и коллегам?',
      'Насколько сотрудник даёт понятную и эффективную обратную связь по рабочим процессам?',
      'Насколько сотрудник прислушивается к вашим идеям, комментариям в работе?',
      'Насколько сотрудник умеет говорить с разными сотрудниками, чтобы каждому было понятно и комфортно?'
    ],
    // Категория 2: Эмоциональный интеллект
    [
      'Насколько сотрудник умеет контролировать свои негативные эмоции?',
      'Насколько сотрудник умеет разрешать конфликтные ситуации?',
      'Насколько сотрудник поддерживает позитивный настрой и мотивирует команду при любых обстоятельствах?',
      'Насколько сотрудник умеет сохранять спокойствие в стрессовых ситуациях?'
    ],
    // Категория 3: Принятие решений
    [
      'Насколько быстро сотрудник принимает решение в условиях ограниченного времени?',
      'Насколько сотрудник вникает в суть проблемы и эффективно решает возникающие вопросы?',
      'Насколько сотрудник принимает обдуманные и взвешенные решения?',
      'Насколько уверенно сотрудник принимает решения в критических ситуациях?'
    ]
  ],
  uz: [
    // Категория 1: Коммуникация
    [
      'Xodimingiz murakkab maʼlumotni qay darajada xodimlariga soddalashtirib yetkaza oladi?',
      'Xodimingiz ish jarayonlari toʼgʼrisida aniq va samarali fikrni qay darajada bildira oladi?',
      'Xodimingiz sizning fikr va mulohazalaringizni qay darajada tinglay oladi?',
      'Xodimingiz o`z xodimlari bilan qanchalik tushunarli va qulay darajada gaplasha oladi?'
    ],
    // Категория 2: Эмоциональный интеллект
    [
      'Xodimingiz oʼzining salbiy his-toʼygʼularini qay darajada nazorat qila oladi?',
      'Xodimingiz konflikt vaziyatlarni qay darajada xal qila oladi?',
      'Xodim ijobiy muhitni saqlab qolish uchun xodimlarni qay darajada ruhlantira oladi?',
      'Xodimingiz stress holatlarda qay darajada xotirjamlikni saqlay oladi'
    ],
    // Категория 3: Принятие решений
    [
      'Xodimingiz cheklangan vaqt sharoitida qay darajada tez qaror qabul qila oladi?',
      'Xodimingiz muammoning ichiga qay darajada kirisha oladi va paydo boʼlgan masalalarni qanchalik samarali hal qila oladi?',
      'Xodimingiz kritik vaziyatlarda qarorlarni qay darajada asosli qabul qiladi?',
      'Xodimingiz qay darajada oʼylangan va samarali qarorlar qabul qiladi?'
    ]
  ]
};

export const categories = {
  ru: ['Коммуникация', 'Эмоциональный интеллект', 'Принятие решений'],
  uz: ['Kommunikatsiya', 'Emotsional intellekt', 'Qaror qabul qilish']
};

export const ratings = {
  ru: ['Плохо', 'Хорошо', 'Отлично'],
  uz: ['Yomon', 'Yaxshi', 'A\'lo']
};

const Survey = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem('language') || 'ru';
  const employees = JSON.parse(localStorage.getItem('employees') || '{}');
  const currentEmployee = localStorage.getItem('currentEmployee') || '1';
  
  const [currentScreen, setCurrentScreen] = useState(0);
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(`answers_employee${currentEmployee}`);
    return saved ? JSON.parse(saved) : {};
  });

  const handleNext = (e) => {
    e.preventDefault();
    
    if (currentScreen < 2) {
      localStorage.setItem(`answers_employee${currentEmployee}`, JSON.stringify(answers));
      setCurrentScreen(prevScreen => prevScreen + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      localStorage.setItem(`answers_employee${currentEmployee}`, JSON.stringify(answers));
      
      if (currentEmployee === '1' && employees.employee2) {
        localStorage.setItem('currentEmployee', '2');
        setCurrentScreen(0);
        setAnswers({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/thank-you');
      }
    }
  };

  const isScreenComplete = () => {
    const screenQuestions = allQuestions[language][currentScreen];
    return screenQuestions.every((_, index) => 
      answers[`screen${currentScreen}_question${index}`] !== undefined
    );
  };

  const handleAnswerSelect = (questionIndex, value) => {
    console.log(`Setting answer for screen${currentScreen}_question${questionIndex} to ${value}`);
    
    setAnswers(prevAnswers => {
      const newAnswers = {
        ...prevAnswers,
        [`screen${currentScreen}_question${questionIndex}`]: value
      };
      
      localStorage.setItem(`answers_employee${currentEmployee}`, JSON.stringify(newAnswers));
      
      return newAnswers;
    });

    if (window.innerWidth <= 768) {
      const questions = document.querySelectorAll('.question');
      const nextQuestion = questions[questionIndex + 1];
      if (nextQuestion) {
        setTimeout(() => {
          nextQuestion.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center'
          });
        }, 300);
      } else {
        const nextButton = document.querySelector('.next-button');
        if (nextButton) {
          setTimeout(() => {
            nextButton.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center'
            });
          }, 300);
        }
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen === 0) {
      localStorage.removeItem('currentScreen');
      localStorage.removeItem('currentAnswers');
    }
  }, [currentScreen]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`answers_employee${currentEmployee}`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    } else {
      setAnswers({});
    }
    setCurrentScreen(0);
    window.scrollTo(0, 0);
  }, [currentEmployee]);

  return (
    <Container>
      <Form onSubmit={handleNext}>
        <h2>
          {language === 'ru' 
            ? `Оценка сотрудника: ${employees[`employee${currentEmployee}`]}`
            : `Xodimni baholash: ${employees[`employee${currentEmployee}`]}`}
        </h2>
        <Progress>
          <ProgressBar $progress={(currentScreen + 1) * 33} />
        </Progress>
        <AnimatePresence mode='wait'>
          <QuestionContainer
            key={currentScreen}
            initial="enter"
            animate="center"
            exit="exit"
            variants={questionVariants}
            transition={{ duration: 0.5 }}
          >
            {allQuestions[language][currentScreen].map((question, index) => (
              <Question key={index} className="question">
                <QuestionText>{question}</QuestionText>
                <RadioGroup>
                  {ratings[language].map((rating, value) => {
                    const currentValue = String(value + 1);
                    const isSelected = answers[`screen${currentScreen}_question${index}`] === currentValue;
                    
                    return (
                      <RadioLabel
                        key={value}
                        $isSelected={isSelected}
                        onClick={() => handleAnswerSelect(index, currentValue)}
                      >
                        <RadioInput
                          type="radio"
                          name={`screen${currentScreen}_question${index}`}
                          value={currentValue}
                          checked={isSelected}
                          onChange={() => {}}
                        />
                        <RadioText>{rating}</RadioText>
                      </RadioLabel>
                    );
                  })}
                </RadioGroup>
              </Question>
            ))}
          </QuestionContainer>
        </AnimatePresence>
        <Button 
          type="submit"
          disabled={!isScreenComplete()}
          className="next-button"
        >
          {currentScreen < 2 ? 
            (language === 'ru' ? 'Следующий этап' : 'Keyingi bosqich') :
            (language === 'ru' ? 'Завершить' : 'Yakunlash')}
        </Button>
      </Form>
    </Container>
  );
};

export default Survey; 