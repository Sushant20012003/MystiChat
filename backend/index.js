import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {app, server} from './socket/socket.js';
import cookieParser from "cookie-parser";
import './services/cronJobs.js';
import path from 'path';

dotenv.config({});

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cors({
    origin:'http://localhost:8000',
    credentials:true
}));
app.use(cookieParser());


//routing 
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

//serving static files
app.use(express.static(path.join(__dirname, 'frontend' , 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
})


server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server running on port ${PORT}`);
    
})