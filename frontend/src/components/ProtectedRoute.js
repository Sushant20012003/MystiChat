import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isTokenExpired } from '../utils/isTokenExpired';
import { useNavigate } from 'react-router-dom';
import { setAuthUser, setToken } from '../store/authSlice';
import { setAllMessages, setOnlineUsers } from '../store/chatSlice';

export default function ProtectedRoute({children}) {

    const {token} = useSelector(state=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!token || isTokenExpired(token)) {
            dispatch(setAuthUser(null));
            dispatch(setToken(null));
            dispatch(setAllMessages([]));
            dispatch(setOnlineUsers([]));
            navigate('/login');
        }
    }, [])

  return (
    <>{children}</>
  )
}
