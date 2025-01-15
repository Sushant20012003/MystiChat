import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useGetAllMessage from '../hooks/useGetMessage';
import { useGetRTN } from '../hooks/useGetRTM';

export default function Message() {
    useGetAllMessage();
    useGetRTN();

    const { selectedUser } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    const { messages } = useSelector(store => store.chat);
    const displayWidth = window.innerWidth;

    // Ref to track the bottom of the message container
    const bottomRef = useRef(null);

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div
            className="flex-1 bg-gray-700 bg-blend-multiply overflow-y-auto scrollbar-hidden"
            style={{ backgroundImage: 'url(/message-bg.jpg)' }}
        >
            <div className="flex flex-col gap-3">
                {messages?.map((message, index) => (
                    <div key={index}>
                        <div className={`text-white ${index === 0 && 'pt-3'}`}>
                            <div
                                className={`flex gap-2 w-full ${
                                    user._id === message.senderId ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                {user._id !== message.senderId && (
                                    <img
                                        className="size-6 rounded-full ml-1"
                                        src="https://i.pinimg.com/736x/a3/31/a8/a331a8d0a8ff50827c6cb3437f336a30.jpg"
                                        alt="User Avatar"
                                    />
                                )}

                                <div
                                    className={`${
                                        user._id === message.senderId ? 'bg-green-900' : 'bg-gray-800'
                                    } max-w-[80%] break-words whitespace-pre-wrap py-2 px-2 rounded-[14px] ${user._id === message.senderId? ' rounded-tr-none':'rounded-tl-none'}`}
                                >
                                    {message.message}
                                </div>

                                {(user._id === message.senderId && displayWidth >= 768)&& (
                                    <img
                                        className="size-6 rounded-full mr-1"
                                        src="https://i.pinimg.com/736x/a3/31/a8/a331a8d0a8ff50827c6cb3437f336a30.jpg"
                                        alt="User Avatar"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Invisible div to ensure auto-scroll */}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
