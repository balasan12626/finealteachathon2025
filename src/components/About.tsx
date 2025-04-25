import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-[#1E2835] text-white min-h-screen py-12 animate-fadeIn relative overflow-hidden">
      {/* Background light effect */}
      <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-blue-600 opacity-5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-30%] right-[-10%] w-[80%] h-[80%] bg-indigo-600 opacity-5 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-12 animate-slideDown drop-shadow-lg">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white">About Tamil Nadu Heritage</span>
        </h1>
        
        <div className="overflow-x-auto shadow-2xl animate-slideUp backdrop-blur-sm bg-[#1E2835]/90 border border-blue-400/20 rounded-md">
          <table className="min-w-full overflow-hidden">
            <thead className="bg-[#1E2835]/95 backdrop-blur-sm border-b border-blue-400/20">
              <tr>
                <th className="py-5 px-8 text-left text-white border-r border-blue-400/20 font-bold">Feature</th>
                <th className="py-5 px-8 text-left text-white font-bold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-[#283545] transition-all duration-300 ease-in-out">
                <td className="py-6 px-8 border-b border-r border-blue-400/20">Explore Cities</td>
                <td className="py-6 px-8 border-b border-blue-400/20">Discover various cities in Tamil Nadu, each with its unique cultural and historical significance.</td>
              </tr>
              <tr className="bg-[#232D3A] hover:bg-[#283545] transition-all duration-300 ease-in-out">
                <td className="py-6 px-8 border-b border-r border-blue-400/20">Heritage Sites</td>
                <td className="py-6 px-8 border-b border-blue-400/20">Browse through a curated list of heritage sites within each city, including temples, monuments, and historical landmarks.</td>
              </tr>
              <tr className="hover:bg-[#283545] transition-all duration-300 ease-in-out">
                <td className="py-6 px-8 border-b border-r border-blue-400/20">Detailed Information</td>
                <td className="py-6 px-8 border-b border-blue-400/20">Access detailed information about each heritage site, including its history, architecture, and cultural importance.</td>
              </tr>
              <tr className="bg-[#232D3A] hover:bg-[#283545] transition-all duration-300 ease-in-out">
                <td className="py-6 px-8 border-b border-r border-blue-400/20">User-Friendly Interface</td>
                <td className="py-6 px-8 border-b border-blue-400/20">Enjoy a seamless browsing experience with an intuitive and responsive design.</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-16 flex flex-wrap gap-6 justify-center animate-fadeIn delay-300 px-4">
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-8 rounded border border-blue-400/30 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 backdrop-blur-sm hover:translate-y-[-3px] hover:scale-105 ease-in-out">
            Primary Button
          </button>
          <button className="bg-gradient-to-r from-red-600 to-red-700 text-white font-medium py-3 px-8 rounded border border-red-400/30 shadow-lg hover:shadow-red-500/30 transition-all duration-300 backdrop-blur-sm hover:translate-y-[-3px] hover:scale-105 ease-in-out">
            Destructive
          </button>
          <button className="bg-transparent border border-slate-300/40 hover:bg-white/10 text-white font-medium py-3 px-8 rounded shadow-lg hover:shadow-white/20 transition-all duration-300 backdrop-blur-sm hover:translate-y-[-3px] hover:scale-105 ease-in-out">
            Outline
          </button>
          <button className="bg-gradient-to-r from-slate-700 to-slate-800 text-white font-medium py-3 px-8 rounded border border-slate-400/30 shadow-lg hover:shadow-slate-400/30 transition-all duration-300 backdrop-blur-sm hover:translate-y-[-3px] hover:scale-105 ease-in-out">
            Secondary
          </button>
          <button className="bg-transparent hover:bg-white/5 text-white font-medium py-3 px-8 rounded border border-transparent hover:border-slate-400/30 shadow-lg hover:shadow-slate-400/20 transition-all duration-300 hover:translate-y-[-3px] hover:scale-105 ease-in-out">
            Ghost
          </button>
          <button className="text-blue-300 hover:text-blue-200 font-medium py-3 px-8 transition-all duration-300 relative overflow-hidden group hover:translate-y-[-3px] ease-in-out">
            Link Style
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-300 group-hover:w-full transition-all duration-500 ease-in-out"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;