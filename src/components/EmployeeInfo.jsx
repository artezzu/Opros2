import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 16px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 500px;
  padding: 32px;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};

  @media (max-width: 768px) {
    padding: 24px;
    gap: 20px;
  }
`;

const Input = styled.input`
  padding: 14px 16px;
  font-size: 16px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
`;

const Button = styled.button`
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
  }
`;

const Title = styled.h2`
  margin-bottom: 24px;
  color: ${props => props.theme.primary};
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.6;
`;

const EmployeeInfo = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem('language') || 'ru';
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [employees, setEmployees] = useState({
    employee1: '',
    employee2: userInfo.employeeCount === '2' ? '' : undefined
  });

  const translations = {
    ru: {
      title: 'Введите ФИО оцениваемых сотрудников',
      employee1: 'ФИО первого сотрудника',
      employee2: 'ФИО второго сотрудника',
      next: 'Далее'
    },
    uz: {
      title: 'Baholanadigan xodimlarning FISHini kiriting',
      employee1: 'Birinchi xodimning FISHi',
      employee2: 'Ikkinchi xodimning FISHi',
      next: 'Keyingi'
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('currentEmployee', '1');
    navigate('/survey');
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>{translations[language].title}</Title>
        <Input
          name="employee1"
          placeholder={translations[language].employee1}
          required
          value={employees.employee1}
          onChange={(e) => setEmployees({ ...employees, employee1: e.target.value })}
        />
        {userInfo.employeeCount === '2' && (
          <Input
            name="employee2"
            placeholder={translations[language].employee2}
            required
            value={employees.employee2}
            onChange={(e) => setEmployees({ ...employees, employee2: e.target.value })}
          />
        )}
        <Button type="submit">
          {translations[language].next}
        </Button>
      </Form>
    </Container>
  );
};

export default EmployeeInfo; 