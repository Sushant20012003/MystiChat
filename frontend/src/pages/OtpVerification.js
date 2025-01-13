// src/components/OtpVerification.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../store/store';
import { resendOTP, verifyOTP } from '../api/authServices';
import { useNavigate } from 'react-router-dom';
import { setAuthUser } from '../store/authSlice';
import ReactLoading from 'react-loading';

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill("")); // 6 digit OTP
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle OTP input changes
  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/\D/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input field
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    // Move focus to previous input field if Backspace is pressed
    if (!value && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  // Handle OTP form submission (no verification logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    // You can later add the verification API logic here.
    setLoading(true);
    const response = await verifyOTP(user.email, otpValue);

    if (response.success) {
      console.log(response.message);
      dispatch(setAuthUser(response.user));
      navigate('/');
    } else {
      alert(response.message);
    }
    setLoading(false);

  };

  useEffect(()=> {
    if(user && user.isVerified) {
        navigate('/');
    }
  }, []);



  const handleResendOTP = async () => {
    setLoading(true);
    const response = await resendOTP(user.email);
    alert(response.message);
    setLoading(false);
  }


  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg sm:shadow-md m-2 md:m-0">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">OTP Verification</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`otp-input-${index}`}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                maxLength="1"
                required
              />
            ))}
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 flex justify-center items-center"
            >
              {
                loading ? <ReactLoading type="bubbles" color="#00BFFF" width={35} height={25} /> : 'Verify OTP'
              }
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the OTP?{" "}
            <button className="text-blue-500 hover:underline" onClick={handleResendOTP}>Resend OTP</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
