import React, { useState } from 'react';
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
import { PrivateRouteGuard } from './guards/PrivateRouteGuard';
import { PublicRouteGuard } from "./guards/PublicRouteGuard";
import { ProfileInformation } from './pages/ProfileInformation/ProfileInformation';
import { ProfileEdit } from './pages/ProfileEdit/ProfileEdit';

function App() {
  const { isLoading } = useAppSelector((state) => state.loader)
  const { id } = useAppSelector((state) => state.auth);

  return (
    <React.Fragment>
      {isLoading === false
        ? null
        : <Loader />}
      <Navigation></Navigation>
      <Routes>
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route element={<PublicRouteGuard />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
        <Route element={<PrivateRouteGuard />}>
          <Route path="/profile/edit/:userId" element={<ProfileEdit />} />
          <Route path="/profile/:userId" element={<ProfileInformation />} />
          <Route path='/my-properties' element={<MyProperties />} />
          <Route path='/my-bookings' element={<MyBookings />} />
        </Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
