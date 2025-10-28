import React from 'react';

const MobileCard = ({ 
  title, 
  description, 
  features = [], 
  emoji, 
  gradientColor, 
  onClick,
  buttonText = "Learn More"
}) => {
  return (
    <div className="flex flex-col">
      {/* Title outside card */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        {title}
      </h3>
      
      {/* Card */}
      <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col h-full overflow-hidden border border-gray-200"
      >
        {/* Image Section */}
        <div className={`h-24 bg-gradient-to-r ${gradientColor} flex items-center justify-center relative`}>
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10">
            <span className="text-3xl">
              {emoji}
            </span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 flex flex-col h-full">
          <p className="text-sm text-gray-600 mb-3 leading-relaxed text-center line-clamp-2">
            {description}
          </p>

          {features.length > 0 && (
            <ul className="space-y-2 mb-4 flex-1">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-xs text-gray-600 justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          <button className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-md hover:from-orange-600 hover:to-orange-700 transition-colors duration-200 text-sm">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCard;
