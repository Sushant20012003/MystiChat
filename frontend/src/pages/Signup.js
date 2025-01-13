import React, { useState, useRef, useEffect } from "react";
import { deleteUser, signup } from "../api/authServices";
import { toast, ToastContainer } from 'react-toastify';
import ReactLoading from 'react-loading';
import { setAuthUser } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import store from "../store/store";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(""); // State to manage the error message
  const confirmPasswordRef = useRef(null); // Reference for the Confirm Password input
  const [loading, setLoading] = useState(false); // State to manage the loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector(store=>store.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset error message when user starts typing in confirm password
    if (name === "confirmPassword" && error) {
      setError("");
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(formData.username === 'Unknown') {
      alert('Username not acceptable');
      return; 
    }
    
     // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Confirm password not matched");
      confirmPasswordRef.current.focus(); // Focus on the confirm password field
    } else {
      setError("");
      setLoading(true);
      
      // Add your form submission logic here (e.g., make an API call)
      
      const response = await signup(formData);
      if(response.success) {
        toast.success(response.message);
        dispatch(setAuthUser(response.user));
        navigate('/verify-otp');
      } else {
          alert(response.message);
      }
      setLoading(false);
    }
  };

  useEffect(()=> {
    if(user) {
        if(!user.isVerified) {
            deleteUser(user.email).then(response => {
              if(response.success) {
                console.log(response.message);
                dispatch(setAuthUser(null));
              }
              else {
                console.log(response.message);
              }
            });
        }
        else {
          navigate('/');
        }      
    }
  },[])

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg sm:shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600">Full Name</label>
            <input
              type="text"
              name="username"
              id="name"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              ref={confirmPasswordRef} // Attach ref to the confirm password field
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              required
            />
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 flex justify-center items-center"
          >
            {
              loading?<ReactLoading type="bubbles" color="#00BFFF" width={35} height={25} />:'Signup'
            }
          </button>
        </form>

        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
          <p className='text-xs text-gray-600'>
            Email not verified ! {' '}
            <a href="/verify-otp" className="text-blue-500 hover:underline">Verify Email</a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
