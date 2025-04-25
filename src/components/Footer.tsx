import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Landmark, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 mt-10 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Traditional Tamil pattern/border as decorative element */}
        <div className="w-full h-2 bg-repeat-x mb-6" style={{ 
          backgroundImage: "url('https://i.pinimg.com/originals/fd/1e/cc/fd1ecc7f6c7bb4e4c5125d1d71466650.png')", 
          backgroundSize: "40px",
          opacity: 0.3
        }}></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <Landmark className="h-6 w-6 text-red-500" />
              <span className="text-red-500 font-semibold text-lg">Tamil Nadu Heritage</span>
            </div>
            <span className="text-gray-400 text-sm mt-1">தமிழ்நாடு பாரம்பரியம்</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300 animate-pulse">
            <span>Made with</span>
            <Heart className="h-4 w-4 mx-1 text-red-500 animate-heartbeat" fill="#ef4444" />
            <span>for Tamil culture</span>
          </div>        
          
          <div className="mt-4 md:mt-0 text-sm text-gray-300 space-x-4">
            <Link to="/about" className="hover:text-red-400 transition-colors duration-300">About</Link>
            <span className="text-gray-600">|</span>
            <Link to="/feedback" className="hover:text-red-400 transition-colors duration-300">Feedback</Link>
            <span className="text-gray-600">|</span>
            <Link to="/contact" className="hover:text-red-400 transition-colors duration-300">Contact</Link>
          </div>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-300">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors duration-300">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Tamil Nadu Heritage. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;