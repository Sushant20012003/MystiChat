import { useEffect } from "react";
import { setMessage } from "../store/chatSlice";
import { useDispatch, useSelector } from "react-redux";

export const useGetRTN = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { selectedUser, conversationId } = useSelector(store => store.chat);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (!socket) return;


        const handlePersonalMessage = (res) => {
            
            if (selectedUser?.username === "Unknown") {
                if(res.conversationId.split(' ')[0] === selectedUser?._id) dispatch(setMessage(res.message));
            }
            else {
                if(res.conversationId.split(' ')[0] === user._id) dispatch(setMessage(res.message));
            }
        };

        const handleGroupMessage = (newMessage) => {
            dispatch(setMessage(newMessage));
        };

        // Attach listeners
        if (selectedUser?._id) {
            socket.on('newMessage', handlePersonalMessage);
        } else {
            socket.on('groupMessage', handleGroupMessage);
        }

        // Cleanup listeners when `selectedUser` changes or on unmount
        return () => {
            socket.off('newMessage', handlePersonalMessage);
            socket.off('groupMessage', handleGroupMessage);
        };
    }, [socket, dispatch, selectedUser]);
};
