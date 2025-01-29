import { Rocket, Zap, Sparkles, Globe2 } from "lucide-react";
import LandingButtons from "./buttons"; // Import the Client Component

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="flex flex-col items-center text-center mb-20">
          <div className="mb-8 animate-float">
            <div className="relative">
              <Rocket className="w-20 h-20 text-blue-400" />
              <div className="absolute -bottom-4 -left-2 w-24 h-8 bg-blue-500/20 blur-xl rounded-full" />
            </div>
          </div>

          <h1 className="text-7xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              ZiteBoard Space
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl animate-fade-in-delay-1">
            Embark on a journey through digital constellations. Create, collaborate, and
            bring your ideas to life in an infinite canvas of possibilities.
          </p>
          <LandingButtons />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-12 mt-32">
          {[
            {
              icon: <Zap className="w-8 h-8 text-yellow-400" />,
              title: "Real-time Collaboration",
              description: "Connect and create together across the digital cosmos.",
            },
            {
              icon: <Sparkles className="w-8 h-8 text-purple-400" />,
              title: "Infinite Canvas",
              description: "Your imagination knows no bounds in this limitless space.",
            },
            {
              icon: <Globe2 className="w-8 h-8 text-blue-400" />,
              title: "Universal Access",
              description: "Share your creations instantly across the universe.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="mb-6 animate-float">
                <div className="group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
