import React from 'react';

import { useSelector } from 'react-redux';
import store from '../store/store';
import useGetAllMessage from '../hooks/useGetMessage';



export default function Message() {
    const { selectedUser } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    const { messages } = useSelector(store => store.chat);

    useGetAllMessage();


    return (
        <div
            className="flex-1 bg-gray-700 bg-blend-multiply overflow-y-auto  scrollbar-hidden"
            style={{ backgroundImage: 'url(/message-bg.jpg)' }} // Correct inline style for background image
        >
            <div className='flex flex-col gap-3'>
            {
                messages?.map((message, index) => {
                    return (
                        <div key={index}>
                            <div className={`text-white ${index === 0 && 'pt-3'}`}>
                                <div className={`flex gap-2 w-full ${user._id === message.senderId ? 'justify-end' : 'justify-start'}`}>
                                    {
                                        user._id !== message.senderId && <img className='size-6 rounded-full ml-1 ' src='https://i.pinimg.com/736x/a3/31/a8/a331a8d0a8ff50827c6cb3437f336a30.jpg' />
                                    }

                                    <div className={`${user._id === message.senderId ? 'bg-green-900' : 'bg-gray-800'} max-w-[80%] break-words whitespace-pre-wrap py-2  px-2 rounded-[14px] rounded-tr-none`}>{message.message}</div>
                                    {
                                        user._id === message.senderId && <img className='size-6 rounded-full mr-1 ' src='https://i.pinimg.com/736x/a3/31/a8/a331a8d0a8ff50827c6cb3437f336a30.jpg' />
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    );
}
