// src/App.js
import React from 'react';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import Login from './pages/Login';
import Home from './pages/Home';

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home />
  },
  {
    path:'/signup',
    element:<Signup />
  },
  {
    path:'verify-otp',
    element:<OtpVerification />
  },
  {
    path:'/login',
    element:<Login />
  }
])



function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}


export default App;
