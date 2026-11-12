import { motion } from "motion/react";
import { Activity } from "lucide-react";

export function Navbar() {
  const navLinks = ["Home", "Events", "Schedule", "Contact"];
  
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10, 15, 30, 0.5)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.2), 0 4px 6px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="border-b border-cyan-400/30"></div>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-60 animate-pulse"></div>
              <Activity className="w-8 h-8 text-cyan-400 relative" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white tracking-wider" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}>
              ROBOTIX CLUB
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navLinks.map((link, index) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="relative text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium group"
                style={{ fontFamily: 'Exo 2, sans-serif' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                whileHover={{ textShadow: '0 0 8px rgba(0, 212, 255, 0.8)' }}
              >
                {link}
                {index === 0 && (
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    layoutId="activeNav"
                    style={{ boxShadow: '0 0 8px rgba(0, 212, 255, 0.8)' }}
                  />
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}