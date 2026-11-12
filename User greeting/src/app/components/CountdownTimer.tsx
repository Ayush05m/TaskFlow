import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target date: March 22, 2026
    const targetDate = new Date("2026-03-22T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-cyan-400/20 blur-xl group-hover:bg-cyan-400/30 transition-all duration-300"></div>
      
      {/* Timer block */}
      <div 
        className="relative border-2 border-cyan-400/60 rounded-lg px-4 py-3 min-w-[80px]"
        style={{
          background: 'rgba(10, 20, 40, 0.6)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 0 15px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)'
        }}
      >
        <div className="text-center">
          <motion.div 
            key={value}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold text-cyan-400 tabular-nums leading-none mb-1"
            style={{ 
              fontFamily: 'Orbitron, monospace',
              textShadow: '0 0 20px rgba(0, 212, 255, 0.9), 0 0 40px rgba(0, 212, 255, 0.5)'
            }}
          >
            {String(value).padStart(2, '0')}
          </motion.div>
          <div className="text-xs text-cyan-300 uppercase tracking-wider" style={{ fontFamily: 'Exo 2, sans-serif' }}>
            {label}
          </div>
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-300"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-300"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-300"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-300"></div>
        
        {/* Pulse animation */}
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400/40 rounded-lg"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        ></motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-4"
      >
        <p className="text-cyan-400 text-sm uppercase tracking-widest" style={{ fontFamily: 'Exo 2, sans-serif', textShadow: '0 0 10px rgba(0, 212, 255, 0.6)' }}>
          The Gate Opens In
        </p>
      </motion.div>
      
      <div className="flex items-center justify-center gap-3">
        <TimeBlock value={timeLeft.days} label="Days" />
        <span className="text-cyan-400 text-3xl font-bold mb-6" style={{ textShadow: '0 0 10px rgba(0, 212, 255, 0.8)' }}>:</span>
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <span className="text-cyan-400 text-3xl font-bold mb-6" style={{ textShadow: '0 0 10px rgba(0, 212, 255, 0.8)' }}>:</span>
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <span className="text-cyan-400 text-3xl font-bold mb-6" style={{ textShadow: '0 0 10px rgba(0, 212, 255, 0.8)' }}>:</span>
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  );
}