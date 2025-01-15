import React, { useState, useEffect, useRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { VscSend } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import store from "../store/store";
import { setMessage } from "../store/chatSlice";


const EmojiInputWithPicker = () => {
    const [text, setText] = useState("");
    const [showPicker, setShowPicker] = useState(false);

    const pickerRef = useRef(null); // Ref for the emoji picker container
    const inputRef = useRef(null); // Ref for the text input field

    const { selectedUser } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const handleEmojiSelect = (emoji) => {
        setText((prev) => prev + emoji.native); // Append emoji to input
    };

    const handleChange = (e) => {
        setText(e.target.value); // Update text on input change
        setShowPicker(false)
    };

    const togglePicker = () => {
        setShowPicker((prev) => !prev); // Toggle the picker visibility
    };

    // Close the picker if clicked outside the picker or when the text input is focused
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current && !pickerRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)
            ) {
                setShowPicker(false); // Close the picker when clicking outside
            }
        };

        // Add event listener for clicks outside
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup the event listener on unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSendMessage = async () => {
        let conversationId = "";

        if (selectedUser.username === 'Unknown') {
            conversationId = `${selectedUser._id} to ${user._id}`;
        }
        else {
            conversationId = `${user._id} to ${selectedUser._id}`
        }

        console.log(conversationId);

        if (selectedUser._id) {
            try {
                let response = await fetch(`http://localhost:8000/api/message/send/${selectedUser._id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: text, conversationId: conversationId }),
                    credentials: 'include'
                });

                response = await response.json();

                if (response.success) {
                    dispatch(setMessage(response.newMessage));
                    setText('');
                }
                else {
                    console.log(response.message);
        
                }

            } catch (error) {

            }
        }
        else {
            try {
                let response = await fetch(`http://localhost:8000/api/message/all/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: text }),
                    credentials: 'include'
                });

                response = await response.json();

                if (response.success) {
                    setText('');
                }
                else {
                    console.log(response.message);
        
                }
               

            } catch (error) {
                console.log(error);

            }
        }

    }

    return (
        <div className="relative w-full ">
            {/* Emoji Picker */}
            {showPicker && (
                <div
                    ref={pickerRef} // Attach ref to the emoji picker container
                    className="absolute bottom-full mb-2 left-0 z-50 w-full max-w-xs bg-white border rounded-lg shadow-lg"
                    style={{ animation: "fadeIn 0.2s" }}
                >
                    <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme="dark"
                        previewPosition="none"
                    />
                </div>
            )}

            {/* Input Field */}
            <div className="flex items-center gap-2 rounded-lg">
                <button
                    type="button"
                    onClick={togglePicker}
                    className="text-gray-500 hover:text-gray-800"
                >
                    <HiOutlineEmojiHappy size={28} color="white" />
                </button>
                <input
                    ref={inputRef} // Attach ref to the text input field
                    type="text"
                    value={text}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    className="flex-1 px-2 py-1 border-none outline-none rounded-lg bg-gray-800 text-white"
                />
                {
                    text && <VscSend color="white" size={22} onClick={handleSendMessage} />
                }
            </div>
        </div>
    );
};

export default EmojiInputWithPicker;
