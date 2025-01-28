import React, { useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
      setMessage('Password reset link has been sent to your email');
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending reset email');
      setIsSuccess(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
      {message && (
        <div className={`mb-4 text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} 
            text-white px-4 py-2 rounded-lg transition-colors`}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;