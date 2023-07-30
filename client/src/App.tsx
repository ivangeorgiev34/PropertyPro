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
import { Footer } from './components/layout/footer/Footer';
import { PropertyDetails } from './pages/PropertyDetails/PropertyDetails';
import { NotFound } from './pages/NotFound/NotFound';
import { PropertyEdit } from './pages/PropertyEdit/PropertyEdit';
import { BookProperty } from './pages/BookProperty/BookProperty';

function App() {
  const { isLoading } = useAppSelector((state) => state.loader)
  const { id } = useAppSelector((state) => state.auth);

  return (
    <React.Fragment>
      {isLoading === false
        ? <React.Fragment>
          <Navigation />
          <div className='content'>
            <Routes>
              <Route path='/notfound' element={<NotFound />} />
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
                <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                <Route path='/property/edit/:propertyId' element={<PropertyEdit />} />
                <Route path='/property/book/:propertyId' element={<BookProperty />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </React.Fragment>
        : <Loader>
          <Navigation />
          <div className='content'>
            <Routes>
              <Route path='/notfound' element={<NotFound />} />
              <Route path='/unauthorized' element={<Unauthorized />} />
              <Route index path='/' element={<Home />} />
              <Route element={<PublicRouteGuard />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Route>
              <Route element={<PrivateRouteGuard />}>
                <Route path="/profile/edit/:userId" element={<ProfileEdit />} />
                <Route path="/profile/:userId" element={<ProfileInformation />} />
                <Route path='/my-properties' element={<MyProperties />} />
                <Route path='/my-bookings' element={<MyBookings />} />
                <Route path='/property/details/:propertyId' element={<PropertyDetails />} />
                <Route path='/property/edit/:propertyId' element={<PropertyEdit />} />
                <Route path='/property/book/:propertyId' element={<BookProperty />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </Loader>}
    </React.Fragment>
  );
}

export default App;
