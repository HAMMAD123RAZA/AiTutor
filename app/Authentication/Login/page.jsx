'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import { trackLogin } from '../../../utils/Operations';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    action:'login'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {setUser}=useUser()
const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        
        const result = await response.json();
        
        // track login firebase
        const email=result?.user?.email
      await trackLogin(email)

          
      if (!response.ok) {
        // This will now properly trigger for error status codes
        setError(result.message || 'Something went wrong');
        return;
      }
setFormData({
        email: '',
        password: '',
        action:'login'
      })
          setUser(result?.user);

router.push('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c7b48c] via-[#95854c] to-[#675853] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-black p-8 rounded-2xl shadow-2xl border border-gray-800">
          <motion.h2 
            className="text-3xl font-bold text-center bg-gradient-to-br from-[#dfa527] via-[#e6dbb5] to-[#675853] bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h2>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-300 mb-2 text-sm font-medium">
                Email
              </label>
              <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#95854c] transition-all duration-200"
                  required
                />
              </motion.div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2 text-sm font-medium">
                Password
              </label>
              <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#95854c] transition-all duration-200"
                  required
                />
              </motion.div>
            </div>
            
            <div className="mb-6 text-right">
              <Link href="/forgot-password" className="bg-gradient-to-br from-[#e1d6bd] via-[#fdfdfd] to-[#675853] bg-clip-text text-transparent text-sm hover:underline focus:outline-none">
                Forgot password?
              </Link>
            </div>
            
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 px-6 cursor-pointer rounded-lg font-bold text-lg transition-all duration-300 ${
                loading
                  ? 'bg-[#6e5b55] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#c7b48c] via-[#95854c] to-[#675853] hover:from-[#c7b48c]/90 hover:via-[#95854c]/90 hover:to-[#675853]/90'
              } text-white shadow-lg`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>
          
          <motion.div 
            className="mt-6 text-center text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Don't have an account?{' '}
            <Link href="/Authentication/Register" className="bg-gradient-to-br from-[#ffc039] via-[#dad5c7] to-[#675853] bg-clip-text text-transparent font-medium hover:underline transition-colors duration-200">
              Register here
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;