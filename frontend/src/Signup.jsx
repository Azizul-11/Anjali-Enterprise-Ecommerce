import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    username: '',
    password: '',
    phone: '',
    agreedTerms: false,
    agreedRefund: false,
    agreedShipping: false,
    agreedPrivacy: false
  });
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedRefund, setAgreedRefund] = useState(false);
  const [agreedShipping, setAgreedShipping] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate agreements
    if (!formData.agreedTerms || !formData.agreedRefund || 
        !formData.agreedShipping || !formData.agreedPrivacy) {
      setError('You must agree to all terms and policies');
      setIsLoading(false);
      return;
    }

    // Client-side validation
    if (!formData.name || !formData.email || !formData.address || 
        !formData.username || !formData.password || !formData.phone) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      setIsLoading(false);
      return;
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    if (!usernameRegex.test(formData.username)) {
      setError('Username must be 3-16 characters long and can only contain letters, numbers, and underscores');
      setIsLoading(false);
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      setIsLoading(false);
      return;
    }

    try {
      if (!showOtpInput) {
        const response = await axios.post(
          `${apiUrl}/api/auth/signup`, 
          formData
        );
        setShowOtpInput(true);
        setNotification('OTP sent to your email');
      } else {
        await axios.post(`${apiUrl}/api/auth/verify-otp`, {
          email: formData.email,
          otp
        });
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      {notification && <p className="text-green-500">{notification}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!showOtpInput ? (
          <>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <div>
                <input
                  type="checkbox"
                  checked={formData.agreedTerms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    agreedTerms: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label className="text-gray-700">
                  I agree to the 
                  <a href="https://merchant.razorpay.com/policy/PkxnLXQOaL587H/terms" 
                    className="text-blue-500 ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <div>
                <input
                  type="checkbox"
                  checked={formData.agreedRefund}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    agreedRefund: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label className="text-gray-700">
                  I agree to the 
                  <a href="https://merchant.razorpay.com/policy/PkxnLXQOaL587H/refund"
                    className="text-blue-500 ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cancellation and Refund Policy
                  </a>
                </label>
              </div>

              <div>
                <input
                  type="checkbox"
                  checked={formData.agreedShipping}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    agreedShipping: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label className="text-gray-700">
                  I agree to the 
                  <a href="https://merchant.razorpay.com/policy/PkxnLXQOaL587H/shipping"
                    className="text-blue-500 ml-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shipping and Delivery Policy
                  </a>
                </label>
              </div>

              <div>
                <input
                  type="checkbox"
                  checked={formData.agreedPrivacy}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    agreedPrivacy: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label className="text-gray-700">
                  I agree to the 
                  <a href="https://merchant.razorpay.com/policy/PkxnLXQOaL587H/privacy"
                    className="text-blue-500 ml-1" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-gray-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        )}
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : (showOtpInput ? 'Verify OTP' : 'Sign Up')}
        </button>
      </form>
    </div>
  );
};

export default Signup;