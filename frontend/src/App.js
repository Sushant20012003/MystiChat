// src/App.js
import React from 'react';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import Login from './pages/Login';
import Home from './pages/Home';
import MainLayout from './pages/MainLayout';
import Chat from './components/Chat';

const browserRouter = createBrowserRouter([
  {
    path:'/',
    element:<MainLayout />,
    children: [
      {
        path:'/chat',
        element:<Chat />
      }
    ]
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
