import Cities from './components/Cities.tsx'; 
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import SignUp from './components/SignUp';
import ChatbotReact from './components/ChatbotReact';
 
import Login from './components/Login'; 
import HeritagePlaces from './components/HeritagePlaces'; 
import PlaceDetails from './components/PlaceDetails'; 
import { useRef, useEffect } from 'react'; 
import { gsap } from 'gsap'; 
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { ThemeProvider } from './context/ThemeContext'; 
import ForgotPassword from './components/ForgotPassword'; 
import About from './components/About'; 
import Hills from './components/hills.tsx';
import Feedback from './components/FeedbackForm.tsx'; 
import Beach from './components/Beach.tsx';
import Waterfall from './components/waterfall.tsx';
import Lake from './components/Lake.tsx';
import Wildlife from './components/Wildlife.tsx';
import Temple from './components/Temple.tsx';
import PlacesSearch from './components/PlacesSearch.tsx';
import Papulardict from './components/Papulardict.tsx';
import Musium from './components/Musium.tsx';

// Placeholder components for About and Feedback



const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth(); 
 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); 
  const mainContentRef = useRef<HTMLDivElement>(null); 
 
  useEffect(() => { 
    const tl = gsap.timeline(); 
 
    if (mainContentRef.current) { 
      tl.fromTo(mainContentRef.current, { 
        opacity: 0, 
        y: 20 
      }, { opacity: 1, y: 0, duration: 0.5 }); 
    } 
 
    return () => { 
      if (mainContentRef.current) { 
        gsap.to(mainContentRef.current, { opacity: 0, y: -20, duration: 0.3 }); 
      } 
    }; 
 
  }, [location]); 
 
  return ( 
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"> 
      <Navbar /> 
      <main className="flex-grow"> 
        <div ref={mainContentRef}> 
          <Routes location={location} key={location.pathname}> 
            <Route path="/login" element={isAuthenticated ? <Navigate to="/cities" replace /> : <Login />} /> 
            <Route path="/cities" element={ 
              <ProtectedRoute> 
                <Cities /> 
              </ProtectedRoute> 
            } /> 
            <Route path="/heritage/:cityName" element={ 
              <ProtectedRoute> 
                <HeritagePlaces /> 
              </ProtectedRoute> 
            } /> 
            <Route path="/place/:city/:id" element={ 
              <ProtectedRoute> 
                <PlaceDetails /> 
              </ProtectedRoute> 
            } /> 
             <Route path="/hills" element={
              <ProtectedRoute>
                <Hills />
              </ProtectedRoute>
            } />
             <Route path="/beach" element={
              <ProtectedRoute>
                <Beach />
              </ProtectedRoute>
            } />
             <Route path="/waterfall" element={
              <ProtectedRoute>
                <Waterfall />
              </ProtectedRoute>
            } />
             <Route path="/lake" element={
              <ProtectedRoute>
                <Lake />
              </ProtectedRoute>
            } />

<Route path="/p" element={
              
                <PlacesSearch />
            
            } />
 <Route path="/papulardict" element={
              <ProtectedRoute>
                
               <Papulardict />
               
              </ProtectedRoute>
            } />







            <Route path="/wildlife" element={
              <ProtectedRoute>
                <Wildlife />
              </ProtectedRoute>
            } />
             <Route path="/temple" element={
              <ProtectedRoute>
                <Temple />
              </ProtectedRoute>
            } />
            <Route path="/museums" element={
              <ProtectedRoute>
                <Musium />
              </ProtectedRoute>
            }
            
            />

            <Route path="/chatbot" element={
              <ProtectedRoute>
                <ChatbotReact />
              </ProtectedRoute>
            } />

            <Route path="/sign-up" element={isAuthenticated ? <Navigate to="/cities" replace /> : <SignUp />} /> 
              <Route path="/about" element={<About />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              
              <Route path="*" element={<Navigate to={isAuthenticated ? "/cities" : "/login"} replace />} />
            </Routes>
          </div>
 
      </main> 
      <Footer /> 
    </div> 
  ); 
} 
 
function App() { 
  return ( 
    <ThemeProvider> 
      <AuthProvider> 
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;