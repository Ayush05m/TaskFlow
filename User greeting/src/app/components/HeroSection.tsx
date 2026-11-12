import { motion } from "motion/react";
import { MapPin, Calendar, ChevronDown, ArrowRight } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import heroImage from "figma:asset/ae17c04283107a6cc68562ea4f9e1fc0a337ef29.png";

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070b17]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Robofest 2026" 
          className="w-full h-full object-cover opacity-90"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070b17]/90 via-[#070b17]/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b17]/60 via-transparent to-[#070b17]/80"></div>
      </div>

      {/* Background atmospheric effects */}
      <div className="absolute inset-0 z-5">
        {/* Volumetric light beams */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-cyan-400/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Animated particles - foreground layer */}
      <div className="absolute inset-0 z-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 4px rgba(0, 212, 255, 0.8)',
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Light streaks */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`streak-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
            style={{
              width: '200px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [-200, 200],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* HUD elements around portal */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 z-15 hidden lg:block">
        {/* Circular HUD ring */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full border border-cyan-400/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full -translate-x-1/2"></div>
        </motion.div>
        
        {/* Scanning lines */}
        <motion.div
          className="absolute top-10 right-10 opacity-30"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-px bg-cyan-400"></div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Drone element */}
      <motion.div
        className="absolute bottom-32 left-1/2 -translate-x-1/2 z-15 hidden lg:block"
        animate={{
          y: [0, -15, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative w-16 h-8 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full border border-cyan-400/40"
             style={{ boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' }}>
          {/* Navigation lights */}
          <motion.div
            className="absolute top-1 left-2 w-2 h-2 bg-cyan-400 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ boxShadow: '0 0 6px rgba(0, 212, 255, 0.9)' }}
          ></motion.div>
          <motion.div
            className="absolute top-1 right-2 w-2 h-2 bg-cyan-400 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ boxShadow: '0 0 6px rgba(0, 212, 255, 0.9)' }}
          ></motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Subtitle with futuristic brackets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block"
            >
              <div className="flex items-center gap-2">
                <div className="text-cyan-400 text-xl opacity-50">[</div>
                <div className="flex items-center gap-2 text-cyan-400 text-sm uppercase tracking-[0.3em] font-medium" style={{ fontFamily: 'Exo 2, sans-serif' }}>
                  <motion.div 
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ boxShadow: '0 0 8px rgba(0, 212, 255, 0.9)' }}
                  ></motion.div>
                  ROBOTIX CLUB • NIT RAIPUR PRESENTS
                </div>
                <div className="text-cyan-400 text-xl opacity-50">]</div>
              </div>
            </motion.div>

            {/* Main Heading with enhanced glow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 
                className="text-7xl lg:text-8xl font-black text-white leading-none mb-2"
                style={{ 
                  fontFamily: 'Orbitron, sans-serif',
                  textShadow: '0 0 40px rgba(0, 212, 255, 0.7), 0 0 80px rgba(0, 212, 255, 0.4), 0 0 120px rgba(0, 212, 255, 0.2)',
                  background: 'linear-gradient(to bottom, #ffffff, #00d4ff, #0ff0ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                ROBOFEST 2026
              </h1>
              {/* Light bloom effect */}
              <div className="absolute -top-4 left-0 w-full h-32 bg-cyan-400/10 blur-3xl -z-10"></div>
            </motion.div>

            {/* Subheading with decorative line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative inline-block"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-400"></div>
                <h2 
                  className="text-3xl lg:text-4xl font-bold text-cyan-400"
                  style={{ 
                    fontFamily: 'Orbitron, sans-serif',
                    textShadow: '0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.4)'
                  }}
                >
                  ENTER THE TECHSIDE
                </h2>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400"></div>
              </div>
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 rounded-full"
                style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.6)' }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </motion.div>

            {/* Tagline with blue glow */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-200 max-w-lg"
              style={{ 
                fontFamily: 'Inter, sans-serif',
                textShadow: '0 0 20px rgba(100, 200, 255, 0.3)'
              }}
            >
              Where Robotics, AI & Innovation collide with the Unknown
            </motion.p>

            {/* Location & Date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-6 text-gray-200"
              style={{ fontFamily: 'Exo 2, sans-serif' }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 212, 255, 0.6))' }} />
                <span>NIT Raipur</span>
              </div>
              <div className="w-px h-6 bg-cyan-400/40"></div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 212, 255, 0.6))' }} />
                <span>March 2026</span>
              </div>
            </motion.div>

            {/* CTA Buttons with enhanced effects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              {/* Primary Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 text-white font-bold uppercase tracking-wider rounded overflow-hidden"
                style={{ 
                  fontFamily: 'Exo 2, sans-serif',
                  background: 'linear-gradient(135deg, #00d4ff, #0ff0ff, #00a8cc)',
                  boxShadow: '0 0 30px rgba(0, 212, 255, 0.5)'
                }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></motion.div>
                <div className="absolute inset-0 bg-cyan-400/30 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                
                {/* Light sweep effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                ></motion.div>
                
                <span className="relative z-10 flex items-center gap-2">
                  Register Now
                  <ArrowRight className="w-5 h-5" />
                </span>
              </motion.button>

              {/* Secondary Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-wider rounded overflow-hidden transition-all duration-300"
                style={{ 
                  fontFamily: 'Exo 2, sans-serif',
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
                }}
              >
                <motion.div 
                  className="absolute inset-0 bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></motion.div>
                <div className="absolute inset-0 bg-cyan-400/10 blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Explore Events</span>
              </motion.button>
            </motion.div>

            {/* Countdown Timer - Removed from here */}
          </motion.div>

          {/* Right side - Image is in background */}
          <div className="hidden lg:block"></div>
        </div>
      </div>

      {/* Countdown Timer - Centered at bottom */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30">
        <CountdownTimer />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <span 
            className="text-cyan-400 text-sm uppercase tracking-wider" 
            style={{ 
              fontFamily: 'Exo 2, sans-serif',
              textShadow: '0 0 10px rgba(0, 212, 255, 0.6)'
            }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown 
              className="w-6 h-6 text-cyan-400" 
              style={{ filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.8))' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Tech divider at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-px">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
             style={{ boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}></div>
      </div>
    </div>
  );
}