import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState:{
        selectedUser:null,
        messages:[],
        onlineUsers:[]
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
        }
    }
});


export const {setSelectedUser, setAllMessages, setMessage, setOnlineUsers} = chatSlice.actions;
export default chatSlice.reducer;