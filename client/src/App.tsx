import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes,Route } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { Navigation } from './components/layout/navigation/Navigation';

function App() {
  return (
    <Navigation></Navigation>
      // <Routes>
      //   <Route path='/home' element={<Home/>}/>
      // </Routes>
  );
}

export default App;
