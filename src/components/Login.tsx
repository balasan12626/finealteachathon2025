import React, { useState, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FaGoogle, FaEye, FaEyeSlash, FaLandmark } from 'react-icons/fa';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { googleSignIn, auth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {      
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Navigating to /cities');
      navigate('/cities');
    } catch (error: any) {
      setError('Invalid email or password.');
      console.error(error)

    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await googleSignIn();
      navigate('/cities');
    } catch (err: any) {
      setError('Google sign-in failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center text-white relative">
      {/* Animated background with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-90"></div>
        <img 
          src="https://images.unsplash.com/photo-1609242778906-2d98e24a5f8b?q=80&w=2070&auto=format&fit=crop" 
          alt="Heritage background" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay animate-slow-zoom"
          style={{ animation: 'slowZoom 60s infinite alternate' }}
        />
        {/* Animated patterns */}
        {/* <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/oriental-tiles.png')] opacity-10"></div> */}
      </div>

      <div className="max-w-md w-full mx-4 relative animate-fade-in-up">
        {/* Branding Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-full">
            <FaLandmark className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold ml-2 text-white">
            Heritage Places
          </h1>
        </div>
        
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/10">
          <h2 className="text-3xl font-bold text-center mb-8">Login</h2>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="group transition-all duration-300 hover:scale-105 focus-within:scale-105">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-black/30 border border-gray-500 text-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-300"
              />
              {email && !/\S+@\S+\.\S+/.test(email) && (
                <p className="text-yellow-400 text-xs mt-1 ml-1">Please enter a valid email address</p>
              )}
            </div>

            {/* Password */}
            <div className="group transition-all duration-300 hover:scale-105 focus-within:scale-105">
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 bg-black/30 border border-gray-500 text-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 mt-6"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </div>
              ) : (
                'Login'
              )}
            </button>

            <div className="text-sm mt-2 flex justify-end">
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all duration-300">
                Forgot password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-600" />
            <span className="px-4 text-sm text-gray-400">or</span>
            <hr className="flex-grow border-gray-600" />
          </div>

          {/* Google Sign In */}
          <button 
            onClick={handleGoogleSignIn} 
            disabled={isLoading}
            type="button" 
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-400 rounded-lg shadow-sm text-base font-medium text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <FaGoogle className="text-red-500 mr-2" />
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-sm text-center mt-8">
            Don't have an account? {" "}
            <Link to="/sign-up" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all duration-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
