import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Navigation } from './components/layout/navigation/Navigation';
import { Login } from './pages/Login/Login';

function App() {
  return (
    <React.Fragment>
      <Navigation></Navigation>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
