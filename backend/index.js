import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {app, server} from './socket/socket.js';
import cookieParser from "cookie-parser";
import './services/cronJobs.js';

dotenv.config({});

const PORT = process.env.PORT || 8000;

//middlewares
app.use(express.json());
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));
app.use(cookieParser());


//routing 
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);


server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server running on port ${PORT}`);
    
})