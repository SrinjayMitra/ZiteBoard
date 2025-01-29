import React from "react";

const PageNotFound: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">Oops! The page you are looking for doesn't exist.</p>
        <div className="bg-white text-black rounded-full px-8 py-4 inline-block cursor-pointer hover:bg-gray-200 transition-colors duration-300">
          <a href="/dashboard" className="text-xl">Go Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
