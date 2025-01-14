import React, { useEffect } from 'react'
import Message from './Message'
import EmojiInputWithPicker from './SendMessage'
import { useDispatch, useSelector } from 'react-redux'
import store from '../store/store';
import { FaComments } from "react-icons/fa";
import { FaRegComments } from "react-icons/fa";
import { setSelectedUser } from '../store/chatSlice';
import { useNavigate } from 'react-router-dom';

export default function Chat() {

    const {selectedUser} = useSelector(store=>store.chat);
    const dispatch = useDispatch();
    const displayWidth = window.innerWidth;
    const navigate = useNavigate();

    // useEffect(()=>{
    //     return ()=> {
    //             dispatch(setSelectedUser(null));
    //             navigate('/');
    //     }
    // }, []);

    useEffect(() => {
        const handleBackButton = () => {
            dispatch(setSelectedUser(null));
          navigate("/"); // Navigate to home on back button press
        };
    
        window.addEventListener("popstate", handleBackButton);
    
        return () => {
          window.removeEventListener("popstate", handleBackButton);
        };
      }, [navigate, selectedUser]);

    return (
        <div className={`md:pl-[400px] ${(!selectedUser && displayWidth < 768) && 'hidden'}`}>
            {
                selectedUser ?
                    <div className='flex flex-col justify-between h-screen'>
                        <div className='flex bg-gradient-to-br from-gray-900 to-gray-800 pl-5 gap-2 items-center py-2 '>
                            <img className='size-12 rounded-full ' src='https://i.pinimg.com/736x/a3/31/a8/a331a8d0a8ff50827c6cb3437f336a30.jpg' />
                            <span className='text-white font-medium text-lg'>{selectedUser.username}</span>
                        </div>
                        <Message />
                        <div className='p-2 bg-gray-800'>
                            <div className=' '>
                                <EmojiInputWithPicker />
                            </div>
                        </div>
                    </div>
                    : <div className='flex justify-center h-screen items-center bg-gradient-to-br from-gray-800 to-pink-950' >
                        <div className='flex flex-col items-center'>
                        <FaRegComments size={150} color='gray'  />
                        <pre className=' ' style={{color:'#94a3b8'}}>
                            Confess your feelings to your favorite person<br></br>
                                 <span>{'      '}</span> Chat anonymously . Be respectful!
                            </pre>
                        <p style={{color:'#94a3b8'}}></p>
                        </div>
                    </div>
            }
        </div>
    )
}
