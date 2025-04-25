import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { FaEye, FaEyeSlash, FaGoogle, FaLandmark } from 'react-icons/fa';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  // Password strength check
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    let userExists = false;
    try {
          // Check if the user already exists by attempting to sign in
          await signInWithEmailAndPassword(auth, email, password);
          userExists = true;
    } catch (signInError) {
         // If sign-in fails, user doesn't exist or wrong credentials, which is okay for sign-up.
      userExists = false;
    }
    if (userExists) {
      // If user exists, log them in and navigate
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/cities');
      } catch (err: any) {
        setError('Incorrect password.');
      } finally {
        setIsLoading(false);
      }
    } else {
          try {
                await createUserWithEmailAndPassword(auth, email, password);
                navigate('/cities');
          } catch (err: any) {
                setError(err.message || 'Sign-up failed. Please try again.');
          } finally {
                setIsLoading(false);
          }
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/cities');
    } catch (err: any) {
      setError(err.message);
    }
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
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/oriental-tiles.png')] opacity-10"></div>
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
          <h2 className="text-3xl font-bold text-white text-center mb-6">Sign Up</h2>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
            <div className="group transition-all duration-300 hover:scale-105 focus-within:scale-105">
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
                placeholder="Enter your email"
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
                autoComplete="new-password"
                required
                  placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 bg-black/30 border border-gray-500 text-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
              >
                  {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
              </div>
              
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex h-1.5 rounded-full bg-gray-700 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${passwordStrength === 0 ? 'bg-red-500 w-1/4' : 
                        passwordStrength === 1 ? 'bg-orange-500 w-2/4' : 
                        passwordStrength === 2 ? 'bg-yellow-500 w-3/4' : 
                        'bg-green-500 w-full'}`}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-300">
                    Password strength: {
                      passwordStrength === 0 ? 'Very Weak' :
                      passwordStrength === 1 ? 'Weak' :
                      passwordStrength === 2 ? 'Good' :
                      'Strong'
                    }
                  </p>
                  <ul className="text-xs mt-1 text-gray-300 list-disc pl-4">
                    <li className={password.length >= 8 ? "text-green-400" : "text-gray-400"}>
                      At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? "text-green-400" : "text-gray-400"}>
                      At least one uppercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? "text-green-400" : "text-gray-400"}>
                      At least one number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-400" : "text-gray-400"}>
                      At least one special character
                    </li>
                  </ul>
                </div>
              )}
          </div>

          {/* Confirm Password */}
            <div className="group transition-all duration-300 hover:scale-105 focus-within:scale-105">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
                placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-black/30 border border-gray-500 text-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-300"
              />
              {password !== confirmPassword && confirmPassword && (
                <p className="text-red-400 text-xs mt-1 ml-1">Passwords do not match</p>
              )}
              {password === confirmPassword && confirmPassword && (
                <p className="text-green-400 text-xs mt-1 ml-1">Passwords match</p>
            )}
          </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 mt-6"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing Up...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
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
            type="button" 
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-400 rounded-lg shadow-sm text-base font-medium text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <FaGoogle className="text-red-500 mr-2" />
            Sign in with Google
          </button>

          {/* Login Link */}
          <p className="text-sm text-center mt-8">
            Already have an account? {" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all duration-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
