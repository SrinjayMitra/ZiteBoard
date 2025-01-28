// dashboard/page.tsx
"use client";
import React from "react";
import { useEffect } from "react";
import HomePage from "./dashboard";

export default function Dashboard() {
    // const [darkMode, setDarkMode] = React.useState(() => {
    //     const savedMode = localStorage.getItem('darkMode');
    //     return savedMode ? JSON.parse(savedMode) : false;
    //   });
    
    //   useEffect(() => {
    //     localStorage.setItem('darkMode', JSON.stringify(darkMode));
        
    //     if (darkMode) {
    //       document.documentElement.classList.add('dark');
    //     } else {
    //       document.documentElement.classList.remove('dark');
    //     }
    //   }, [darkMode]);
    return (
        <HomePage
        // darkMode={darkMode} 
        // onToggleDarkMode={() => setDarkMode(!darkMode)} 
      />
    );
  }
  