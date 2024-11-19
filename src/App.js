import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
// ... остальные импорты

function App() {
  return (
    <Router>
      <ThemeProvider>
        <GlobalStyle />
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/language-selection" element={<LanguageSelection />} />
          {/* ... остальные маршруты */}
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App; 