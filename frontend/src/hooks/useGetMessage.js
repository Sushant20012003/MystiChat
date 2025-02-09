import { useDispatch, useSelector } from "react-redux";
import { setAllMessages, setConversationId } from "../store/chatSlice";
import store from "../store/store";
import { useEffect } from "react";
import { BASE_URL } from "../api/config";

const useGetAllMessage = async () => {

    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    
    useEffect(() => {
        const fetchMessage = async () => {
            let conversationId = "";

            if (selectedUser.username === 'Unknown') {
                conversationId = `${selectedUser._id} to ${user._id}`;
            }
            else {
                conversationId = `${user._id} to ${selectedUser._id}`
            }
            
            dispatch(setConversationId(conversationId));
            

            try {
                if (selectedUser._id) {
                    let response = await fetch(`${BASE_URL}/api/message/get`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ conversationId: conversationId }),
                        credentials: 'include'
                    });

                    response = await response.json();

                    if (response.success) {
                        dispatch(setAllMessages(response.messages));

                    }
                    else {
                        console.log(response.message);

                    }
                }
                else {
                    let response = await fetch(`${BASE_URL}/api/message/all/get`, {
                        method: 'GET',
                        credentials: 'include'
                    });

                    response = await response.json();

                    if (response.success) {
                        dispatch(setAllMessages(response.messages));
                    }
                    else {
                        console.log(response.message);

                    }
                }

            } catch (error) {
                console.log(error);

            }
        }
        fetchMessage();
    }, [selectedUser]);
}


export default useGetAllMessage;