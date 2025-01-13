import { User } from '../models/user.model.js';
import { sendVerificationEmail } from '../verification-email/sendVerificationEmail.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  //checking all fields are available or not
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    //checking if email is acceptable or not
    // if(!(email.split("@")[1] === "iitjammu.ac.in")) {
    //     return res.status(400).json({ message: 'Please enter valid IIT Jammu email' });
    // }

    //checking if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiresAt: Date.now() + 15 * 60 * 1000,
    });

    newUser.password = undefined;
    newUser.otp = undefined;

    // Send verification email
    await sendVerificationEmail(email, otp, username);

    res.status(201).json({success:true, message: 'Verification email sent. Please check your inbox.', user:newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user or sending email' });
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if email and OTP are provided
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

    //Check out is available or not
    if(!otp) {
        await User.deleteOne({email});
        return res.status(400).json({ success: false, message: 'OTP is required.'});
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || Date.now() > user.otpExpiresAt) {
        await User.deleteOne({email});
        return res.status(400).json({ success: false, message: 'OTP invalid or expired.' });
    }
  
    // Mark user as verified
    user.isVerified = true;
    user.otp = null; // Clear the OTP
    user.otpExpiresAt = null; // Clear the expiration date
    await user.save();

    user.password=undefined;

    const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY,{expiresIn:'1d'});

    return res.status(200).cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).json({ success: true, message: 'Email verified successfully.', user });
  
} catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
};


export const resendOTP = async(req, res)=>{
    try {
        const {email}=req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({success:false, message:"Invalid Email"});
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now
        await user.save();

        await sendVerificationEmail(email, otp, user.username);

        return res.status(200).json({ success: true, message: 'OTP resent successfully.' });

    } catch (error) {
        console.log(error);
        
    }
}



export const login = async(req, res)=> {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required '});
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password'})
        }

        if(user.isVerified) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ success: false, message: 'Invalid email or password'});
            }

            const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY,{expiresIn:'1d'});
            user.password = undefined;

            return res.status(200).cookie('token', token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite:'strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            }).json({ success: true, message: 'Logged in successfully.', user });
        }
        else {
            return res.status(400).json({ success: false, message: 'Please verify your email first.'});
        }

    } catch (error) {
        console.log(error);
        
    }
}



export const logout = async(req, res)=> {
    try {
        return res.status(200).clearCookie('token').json({ success: true, message: 'Logged out successfully'});
    } catch (error) {
        console.log(error);
        
    }
}


export const search = async(req, res) => {
    try {
        const {username} = req.body;

        if(!username) {
            return res.status(400).json({ success: false, message: 'Please enter a username'});
        }

        const users = await User.find({username: {$regex: username, $options: 'i'}, _id:{$ne: req.id}}).select('username').lean();

        if(!users) {
            return res.status(404).json({success:false, message: 'No users found'});
        }

        return res.status(200).json({success:true, users});

    } catch (error) {
        console.log(error);
        
    }
}



export const deleteUser = async(req, res) => {
    try {
        const {email} = req.body;

        if(!email) {
            return res.status(400).json({ success: false, message: 'Please enter an email'});
        }

        const user = await User.deleteOne({email});

        if(user.deletedCount === 0) {
            return res.status(404).json({success:false, message: 'No user found'});
        }
        
        return res.status(200).json({success:true, message: 'User deleted successfully'});

    } catch (error) {
        console.log(error);
        
    }
}