"use client"; // Mark this file as a client component

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";


export default function LandingButtons() {
  const handleLaunchClick = () => {
    console.log("Launch App clicked!");
    // Example: window.location.href = "/dashboard";
  };

  const handleLearnMoreClick = () => {
    console.log("Learn More clicked!");
    // Example: Open a modal or navigate to another page
  };

  return (
    <div className="flex gap-6">
      <Link href={"/signup"}
        onClick={handleLaunchClick}
        className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center gap-2 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        SignUp Today
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>

      <Link href={"/signin"}
        onClick={handleLearnMoreClick}
        className="group px-8 py-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full flex items-center gap-2 hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        SignIn
        <Star className="w-5 h-5 group-hover:rotate-45 transition-transform" />
      </Link>
    </div>
  );
}
