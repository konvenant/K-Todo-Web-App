import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/Auth';
import CategoriesPage from './components/Categories';
import TodoPage from './components/Todo';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    // Check if user is already logged in (e.g., token exists in local storage)
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    // Perform login logic and set isLoggedIn state if successful
    setIsLoggedIn(true);
    // Store authentication token in local storage
    localStorage.setItem('token', 'your-auth-token-here');
  };

  const handleLogout = () => {
    // Perform logout logic and clear isLoggedIn state
    setIsLoggedIn(false);
    // Remove authentication token from local storage
    localStorage.removeItem('token');
  };

  return (
  

    <Router>
      <Routes>
        <Route path="/" element={ <AuthPage onLogin={handleLogin} />  } />
        <Route path="/categories/:username" element={ isLoggedIn ? <CategoriesPage  onLogout={handleLogout} /> :  <AuthPage onLogin={handleLogin} />} />
        <Route path="/todo/:username/:category" element={ isLoggedIn ?  <TodoPage /> : <AuthPage onLogin={handleLogin} /> } /> {/* Dynamic route for category */}
        <Route path="*" element={ <AuthPage onLogin={handleLogin} />  } />
      </Routes>
    </Router>
  );
}

export default App;


