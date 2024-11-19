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
    padding: 0;
    align-items: flex-start;
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
  position: relative;
  z-index: 3;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    border-radius: 0;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    padding: 20px;
    gap: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  position: relative;
  z-index: 4;
  cursor: text;

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
  }

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
  position: relative;
  z-index: 4;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
  }

  &:active {
    transform: translateY(0);
  }
`;

const Title = styled.h2`
  margin-bottom: 24px;
  color: ${props => props.theme.primary};
  text-align: center;
  font-size: 1.2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 20px;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 16px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 4;

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${props => props.theme.text};
  font-size: 16px;
  font-weight: 500;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const UserInfo = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    department: '',
    company: '',
    employeeCount: '1'
  });

  const companies = [
    'Steel Property Construction',
    'Bektimir Metall Konstruksiyalari',
    'Metal Invent',
    'Binokor Temir Beton',
    'Dacros',
    'Binokor Precast Technologies',
    'Steel Special Decor',
    'Metal Polymer Technologies',
    'Yangi Zamon Bino',
    'Binket Group'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    navigate('/employee-info');
  };

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const language = localStorage.getItem('language') || 'ru';

  const translations = {
    ru: {
      title: 'Заполните информацию для оценки сотрудников',
      company: 'Компания',
      department: 'Отдел',
      employeeCount: 'Количество оцениваемых сотрудников',
      next: 'Далее',
      selectCompany: 'Выберите компанию',
      selectEmployeeCount: 'Количество приемников'
    },
    uz: {
      title: 'Xodimlarni baholash uchun ma\'lumotlarni to\'ldiring',
      company: 'Kompaniya',
      department: 'Bo\'lim',
      employeeCount: 'Baholanadigan xodimlar soni',
      next: 'Keyingi',
      selectCompany: 'Kompaniya tanlang',
      selectEmployeeCount: 'Qabul qiluvchilar soni'
    }
  };

  const t = translations[language];

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>{t.title}</Title>
        
        <FormGroup>
          <Label>{t.company}</Label>
          <Select
            name="company"
            value={userInfo.company}
            onChange={handleChange}
            required
          >
            <option value="">{t.selectCompany}</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t.department}</Label>
          <Input
            name="department"
            placeholder={t.department}
            required
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t.selectEmployeeCount}</Label>
          <Select
            name="employeeCount"
            value={userInfo.employeeCount}
            onChange={handleChange}
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </Select>
        </FormGroup>

        <Button type="submit">
          {t.next}
        </Button>
      </Form>
    </Container>
  );
};

export default UserInfo; 