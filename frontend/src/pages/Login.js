import React, { useEffect, useState } from 'react';
import { login } from '../api/authServices';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setToken } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import store from '../store/store';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // To manage the error message
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector(store=>store.auth);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset error message if the user starts typing again
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Add your form submission logic here (e.g., API call)
    if (formData.email === '' || formData.password === '') {
      setError('Please fill out both fields');
    } else {
       const response = await login(formData);
       if(response.success) {
          console.log(response);
          dispatch(setAuthUser(response.user));
          dispatch(setToken(response.token));
          navigate('/');
       }
       else {
        alert(response.message);
       }
    }
  };


  useEffect(()=> {
    if(user) {
      if(user.isVerified) {
        navigate('/');
      } 
      else {
        navigate('/verify-otp');
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg sm:shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
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

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

