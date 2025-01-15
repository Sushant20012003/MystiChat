// src/pages/Home.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Participants from '../components/Participants';
import Chat from '../components/Chat';
import { useSelector } from 'react-redux';
import store from '../store/store';

const Home = () => {
  const navigate = useNavigate();
  const displayWidth = window.innerWidth;
  const { selectedUser } = useSelector(store => store.chat);

  useEffect(()=>{
      navigate('/chat');
  }, [selectedUser]);

  return (
    <div className="flex h-screen">
      <div className={`${(displayWidth < 768 && selectedUser) && 'hidden'} w-[100vw] md:w-[400px] flex flex-col justify-between pl-2 py-2 bg-gradient-to-t from-gray-800 to-gray-950 shadow-xl shadow-black border-r-2 border-gray-900`}>
        <Header />
        <Participants />

      </div>



    </div>
  );
};

export default Home;
