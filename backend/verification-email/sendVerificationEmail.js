import nodemailer from 'nodemailer';
import { emailTemplate } from './emailTemplate.js';
import dotenv from 'dotenv';

dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Replace with your email
    pass: process.env.EMAIL_PASSWORD, // Replace with your app password
  },
});

export const sendVerificationEmail = async (email, otp, username) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL, // Your email
        to: email, // Recipient email
        subject: 'Verify Your Email Address',
        html: emailTemplate(otp, username), // Use the HTML template
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };
  