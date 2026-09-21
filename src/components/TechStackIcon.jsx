import React from 'react';

const TechStackIcon = ({ TechStackIcon, Language }) => {
  return (
    <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-maroon/20 hover:bg-maroon/10 hover:border-maroon/40 transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-3 hover:scale-105 cursor-pointer shadow-lg hover:shadow-maroon/20">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-maroon to-[#7A2E3B] rounded-full opacity-0 group-hover:opacity-50 blur transition duration-300"></div>
        <img 
          src={TechStackIcon} 
          alt={`${Language} icon`} 
          className="relative h-16 w-16 md:h-20 md:w-20 transform transition-transform duration-300"
        />
      </div>
      <span className="text-cream/70 font-semibold text-sm md:text-base tracking-wide group-hover:text-cream transition-colors duration-300">
        {Language}
      </span>
    </div>
  );
};

export default TechStackIcon; 