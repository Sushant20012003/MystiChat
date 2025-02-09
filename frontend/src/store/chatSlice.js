import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState:{
        selectedUser:null,
        messages:[],
        onlineUsers:[],
        conversationId:null
    },
    reducers:{
        setSelectedUser:(state, action) => {
            state.selectedUser = action.payload;
        },
        setAllMessages:(state, action) => {
            state.messages = action.payload;
        },
        setMessage:(state, action) => {
            state.messages.push(action.payload);
        },
        setOnlineUsers:(state, action) => {
            state.onlineUsers = action.payload;
        },
        setConversationId:(state, action) => {
            state.conversationId = action.payload;
        }
    }
});


export const {setSelectedUser, setAllMessages, setMessage, setOnlineUsers, setConversationId} = chatSlice.actions;
export default chatSlice.reducer;