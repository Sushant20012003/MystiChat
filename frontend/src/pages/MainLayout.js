import React from 'react'
import { useSelector } from 'react-redux'
import store from '../store/store'
import Home from './Home';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {

    const {user} = useSelector(store=>store.auth);

  return (
    <div>
        {
            user &&
            <div>
                <Home />
                <Outlet />
            </div>
        }
    </div>
  )
}
