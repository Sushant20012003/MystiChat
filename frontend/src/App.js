// src/App.js
import React, { useEffect } from 'react';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import Login from './pages/Login';
import Home from './pages/Home';
import MainLayout from './pages/MainLayout';
import Chat from './components/Chat';
import { useDispatch, useSelector } from 'react-redux';
import store from './store/store';
import { io } from 'socket.io-client';
import { setSocket } from './store/socketSlice';
import { setOnlineUsers, setSelectedUser } from './store/chatSlice';

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

    const {user} = useSelector(store=>store.auth);
    const {socket} = useSelector(store=>store.socketio);
    const dispatch = useDispatch();

    useEffect(()=>{
      if(user) {
        const socketio = io('http://localhost:8000', {
          query: {
            userId:user._id
          }
        });
        dispatch(setSocket(socketio));

        //event listening

        socketio.on('getOnlineUsers', (users)=>{
          console.log('fetched online users');
          dispatch(setOnlineUsers(users));
          
        });

        return ()=> {
          socketio.close();
          dispatch(setSocket(null));
        }
      }
      else if(socket) {
        socket.close();
        dispatch(setSocket(null));
      }

      return ()=> {
        dispatch(setSelectedUser(null));
      }
    }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}


export default App;
