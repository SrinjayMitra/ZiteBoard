import React from "react";

const NotSignedIn: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">409</h1>
        <p className="text-2xl mb-6">Oops! It looks like you are not signed in</p>
        <div className="bg-white text-black rounded-full px-8 py-4 inline-block cursor-pointer hover:bg-gray-200 transition-colors duration-300">
          <a href="/signin" className="text-xl">Go Back to Signin</a>
        </div>
      </div>
    </div>
  );
};

export default NotSignedIn;