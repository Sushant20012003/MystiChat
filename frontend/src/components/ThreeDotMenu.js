import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { logout } from '../api/authServices';
import { setAuthUser, setToken } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAllMessages, setOnlineUsers } from '../store/chatSlice';

export default function ThreeDotMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null); // To track the dropdown menu element
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(state=>state.auth);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleLogout = async () => {
        // Add your logout logic here
        const response = await logout();
        if (response.success) {
            console.log(response.message);
            dispatch(setAuthUser(null));
            dispatch(setToken(null));
            dispatch(setAllMessages([]));
            dispatch(setOnlineUsers([]));
            navigate('/login');
        }
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {/* Three Dot Button */}
            <button
                onClick={handleToggle}
                className="p-2 rounded-full text-white focus:outline-none"
            >
                <BsThreeDotsVertical />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 "
                >
                    <div className=" text-white">
                        <span className='flex justify-center'>Hi, {user.username}</span>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-sm  hover:bg-gray-800  hover:text-yellow-600 font-medium focus:outline-none rounded-md"
                        >
                            Logout
                        </button>
                        {/* Add more options here */}

                    </div>
                </div>
            )}
        </div>
    );
}
