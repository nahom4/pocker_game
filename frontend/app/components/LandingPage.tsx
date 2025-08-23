import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./ImageWithFallback";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
// import pokerImage from "figma:asset/c557a4a8acdb96016333166555cb144b56a9f3cc.png";

export function PokerLandingPage({
    handlePlayClick
} : {
    handlePlayClick : () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        <div className="container mx-auto px-4 py-20 lg:py-32 h-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="z-20"
            >
              <Badge className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white border-0">
                🔥 Most Popular Game
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Master the
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text block">
                  Poker Table
                </span>
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Experience the thrill of Texas Holdem in our exclusive 6-player tournaments. 
                Test your skills, bluff your way to victory, and become a poker legend.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handlePlayClick} size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Start Playing Now
                </Button>
                <a href='https://bicyclecards.com/how-to-play/texas-holdem-poker' target="_blank">
                    <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                        Read Tutorial
                    </Button>
                </a>
                
              </div>
            </motion.div>

            {/* Right Content - Poker Imagery */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:flex justify-center items-center hidden"
            >
              <div className="relative">
                {/* Main poker image */}
                <div className="relative z-10">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1674707173845-0402bc18e174?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8fDE3NTU3MjUwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Traditional red and black playing cards"
                    className="w-96 h-96 object-cover rounded-2xl shadow-2xl"
                  />
                </div>
                
                {/* Floating elements for visual interest */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-8 -left-8 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200"
                >
                  <span className="text-2xl text-black">♠</span>
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute -bottom-6 -right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200"
                >
                  <span className="text-xl text-red-600">♥</span>
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                    x: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute top-1/2 -right-12 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200"
                >
                  <span className="text-lg text-red-600">♦</span>
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 8, 0],
                    x: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                  className="absolute top-1/4 -left-10 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200"
                >
                  <span className="text-lg text-black">♣</span>
                </motion.div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-yellow-500/20 rounded-2xl blur-xl -z-10 scale-110"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}