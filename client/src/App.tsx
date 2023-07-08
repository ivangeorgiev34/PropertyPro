import React from 'react';
import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';

import { Home } from './pages/Home/Home';
import { Navigation } from './components/layout/navigation/Navigation';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { MyProperties } from './pages/MyProperties/MyProperties';
import { MyBookings } from './pages/MyBookings/MyBookings';
import { Unauthorized } from './pages/Unauthorized/Unauthorized';
import { Loader } from './components/loader/Loader';
import { useAppSelector } from './hooks/reduxHooks';

function App() {
  const { isLoading } = useAppSelector((state) => state.loader)

  return (
    <React.Fragment>
      {isLoading === true ? <Loader /> : null}
      <Navigation></Navigation>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/my-properties' element={<MyProperties />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
      </Routes>
    </React.Fragment>
  );
}

export default App;
