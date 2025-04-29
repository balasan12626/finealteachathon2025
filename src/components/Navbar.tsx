import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faRightFromBracket, 
  faSun, 
  faMoon, 
  faLandmark, 
  faChevronDown, 
  faBars, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const closeTimeoutRef = useRef<number | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // For mobile - we still want to toggle
  const toggleExplore = () => setIsExploreOpen(!isExploreOpen);

  // For desktop - we open/close with mouse hover with delay
  const openExplore = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsExploreOpen(true);
  };
  
  const closeExplore = () => {
    // Add a delay before closing the dropdown
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsExploreOpen(false);
    }, 500); // 500ms delay
  };

  const isDarkMode = theme === 'dark';
  
  // Close explore dropdown when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any remaining timeout on unmount
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [isMenuOpen]);

  // Reset states when route changes
  useEffect(() => {
    setIsExploreOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const exploreLinks = [
    ["Hills", "hills"],
    ["Beach", "beach"],
    ["Waterfall", "waterfall"],
    ["Lake", "lake"],
    ["Heritage Places", "heritageplaces"],
    ["Wildlife", "wildlife"],
    ["Temple", "temple"],
    ["Museum", "musium"],
    ["Cities", "cities"],
    ["Chatbot", "chatbot"]
  ];

  return (
    <header>
      {/* Top Banner */}
      <div className={`py-1 text-center text-sm font-medium ${isDarkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-800'}`}>
        Discover the rich cultural heritage of Tamil Nadu
      </div>

      <nav className={`transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-lg sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-700' : 'bg-blue-600'}`}>
                <FontAwesomeIcon icon={faLandmark} className="text-white text-xl" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HeritagePlaces
                </span>
                <span className="block text-xs -mt-1 text-gray-500 dark:text-gray-400">Explore Tamil Nadu</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/about" className="nav-link relative hover:text-blue-500 transition-colors py-1">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link to="/feedback" className="nav-link relative hover:text-blue-500 transition-colors py-1">
                Feedback
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Explore Dropdown with hover functionality and delay */}
              <div 
                className="relative" 
                ref={exploreRef}
                onMouseEnter={openExplore}
                onMouseLeave={closeExplore}
              >
                <button 
                  className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                >
                  <span>Explore</span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-xs transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                
                {isExploreOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 border dark:border-gray-700 grid grid-cols-1 gap-1 transform origin-top-left transition-all duration-200 animate-fadeIn"
                    onMouseEnter={openExplore}
                    onMouseLeave={closeExplore}
                  >
                    {exploreLinks.map(([label, path]) => (
                      <Link 
                        key={path} 
                        to={`/${path}`} 
                        className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <FontAwesomeIcon icon={faUser} />
                    <span className="max-w-[120px] truncate">{user.email}</span>
                  </Link>
                  <button onClick={logout} className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <FontAwesomeIcon icon={faRightFromBracket} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-1.5 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/sign-up" 
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              <button 
                onClick={toggleTheme} 
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isDarkMode ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleTheme}
                className={`mx-2 w-9 h-9 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-200 text-gray-800'}`}
              >
                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
              </button>
              
              <button 
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition duration-150 ease-in-out"
              >
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu, show/hide based on menu state */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-0 z-40 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleMenu}></div>
        <div className={`absolute right-0 top-0 w-64 h-full ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl p-5 overflow-y-auto`}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold text-blue-600">Menu</span>
            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
              <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            <Link to="/about" className="py-2 hover:text-blue-500" onClick={toggleMenu}>About</Link>
            <Link to="/feedback" className="py-2 hover:text-blue-500" onClick={toggleMenu}>Feedback</Link>
            
            <div className="py-2">
              <button 
                onClick={toggleExplore} 
                className="flex items-center justify-between w-full hover:text-blue-500"
              >
                <span>Explore</span>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`text-xs transition-transform duration-300 ${isExploreOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {isExploreOpen && (
                <div className="pl-4 mt-2 border-l-2 border-blue-500 space-y-2">
                  {exploreLinks.map(([label, path]) => (
                    <Link 
                      key={path} 
                      to={`/${path}`} 
                      className="block py-1.5 hover:text-blue-500 transition-colors"
                      onClick={toggleMenu}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            {user ? (
              <>
                  <Link to="/profile" className="flex items-center py-2 hover:text-blue-500" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    <span className="truncate">{user.email}</span>
                </Link>
                  <button onClick={() => { logout(); toggleMenu(); }} className="flex items-center py-2 hover:text-blue-500 w-full text-left">
                    <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                  <Link 
                    to="/login" 
                    className="block py-2 px-4 rounded-md text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 mb-2"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/sign-up" 
                    className="block py-2 px-4 rounded-md text-center bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
