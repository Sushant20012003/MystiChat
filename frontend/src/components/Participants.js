import React, { useEffect, useState } from 'react'
import SearchUser from './SearchUser';
import { useFindParticipants } from '../hooks/userHooks';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '../store/chatSlice';

export default function Participants() {

    const [users, setUsers] = useState([]);
    const [participants, setParticipants] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                let response = await fetch('http://localhost:8000/api/message/find/participants', {
                    method: 'GET',
                    credentials: 'include'
                });

                response = await response.json();

                if (response.success) {
                    setParticipants(response.participants);
                }
                else {
                    console.log(response.message);

                }
            } catch (error) {
                console.log(error);

            }
        }

        fetchParticipants();

    }, []);    //need to give dependencies


    const handleSelectUser = (user) => {
        dispatch(setSelectedUser(user));
    }

    return (
        <div className='flex-1 w-full pr-6'>
            <SearchUser users={users} setUsers={setUsers} />
            <div className='flex flex-col overflow-y-auto'>
                {
                    users && users.map((user, index) => {
                        return (
                            <div key={index} className='flex gap-2 items-center hover:bg-gray-700 py-2 px-2 rounded-[6px]'>
                                <img className='size-12 rounded-full ' src='https://i.pinimg.com/736x/a3/31/a8/a331a8d0a8ff50827c6cb3437f336a30.jpg' />
                                <span className='text-white font-medium text-lg'>{user.username}</span>
                            </div>
                        )
                    })
                }
                {
                    !users &&
                    <div className='flex gap-2 items-center hover:bg-gray-700 py-2 px-2 rounded-[6px]'>
                        <img className='size-12 rounded-full ' src='https://i.pinimg.com/736x/a3/31/a8/a331a8d0a8ff50827c6cb3437f336a30.jpg' />
                        <span className='text-white font-medium text-lg'>IIT Jammu</span>
                    </div>
                }
                {
                    !users && participants.map((user) => {
                        return (
                            <div onClick={()=>handleSelectUser(user)} key={user._id} className='flex gap-2 items-center hover:bg-gray-700 py-2 px-2 rounded-[6px] cursor-pointer' >
                                <img className='size-12 rounded-full ' src='https://i.pinimg.com/736x/a3/31/a8/a331a8d0a8ff50827c6cb3437f336a30.jpg' />
                                <span className='text-white font-medium text-lg'>{user.username}</span>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
