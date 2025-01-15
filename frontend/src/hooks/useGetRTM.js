import { useEffect } from "react";
import { setMessage } from "../store/chatSlice";
import { useDispatch, useSelector } from "react-redux";

export const useGetRTN = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { selectedUser } = useSelector(store => store.chat);

    useEffect(() => {
        if (!socket) return;

        const handlePersonalMessage = (newMessage) => {
            dispatch(setMessage(newMessage));
            console.log("Personal message:", newMessage);
        };

        const handleGroupMessage = (newMessage) => {
            dispatch(setMessage(newMessage));
            console.log("Group message:", newMessage);
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
    }, [socket, dispatch, selectedUser?._id]);
};
