import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.background};
  z-index: 1000;
  animation: ${props => props.$isExiting ? fadeOut : fadeIn} 1s ease-in-out;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Logo = styled(motion.img)`
  width: 300px;
  height: auto;
`;

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        navigate('/language-selection');
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container $isExiting={isExiting}>
      <LogoContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Logo
          src="/logo.png"
          alt="Company Logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </LogoContainer>
    </Container>
  );
};

export default SplashScreen; 