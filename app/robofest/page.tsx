"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { 
  MapPin, 
  Calendar, 
  ChevronDown, 
  Activity, 
  Menu, 
  X, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Settings,
  Zap,
  Clock,
  Trophy,
  Users,
  Target,
  Cpu,
  Gamepad2,
  Lightbulb,
  Code,
  Mic
} from "lucide-react"
import { cn } from "@/lib/utils"

// Event data
const mainEvent = {
  id: "robothon",
  badge: "MAIN EVENT",
  title: "ROBOTHON",
  subtitle: "BUILD THE FUTURE",
  description: "A 24-hour simulation-based hackathon focusing on GPS-Denied Drones, Swarm Drones, Underwater Robotics, Nanobots, and Six-Legged Rovers. Push your limits and innovate!",
  dateTime: "22-23 March 2026 • 10 AM Onwards",
  specs: [
    { icon: Clock, label: "Duration:", value: "24 Hours", iconColor: "text-cyan-400" },
    { icon: Users, label: "Team Size:", value: "2-4 Members", iconColor: "text-cyan-400" },
    { icon: Zap, label: "Format:", value: "Simulation-Based", iconColor: "text-yellow-500" },
    { icon: Trophy, label: "Prize Pool:", value: "₹35,000", iconColor: "text-yellow-500" },
  ],
  rules: ["Problem Statement", "Judging Criteria", "Submission Format", "Resource Kit"],
  registerLink: "/robofest/robothon",
  rulebookLink: "/robofest/robothon",
  bgImage: "/robothon-bg1.png",
}

const minorEvents = [
  // Day 1 - 22 March
  {
    id: "vibecoding",
    badge: "ARDUINO EVENT",
    title: "VIBECODING",
    subtitle: "CODE THE BOTS",
    description: "An Arduino coding competition where participants program microcontrollers to solve robotics challenges. Showcase your embedded systems skills and bring circuits to life!",
    dateTime: "22 March • 10 AM - 2 PM",
    specs: [
      { icon: Cpu, label: "Platform:", value: "Arduino/ESP/Verilog", iconColor: "text-cyan-400" },
      { icon: Users, label: "Team Size:", value: "1-2 Members", iconColor: "text-cyan-400" },
      { icon: Clock, label: "Duration:", value: "2-3 Hours", iconColor: "text-cyan-400" },
      { icon: Trophy, label: "Prize Pool:", value: "₹12,000", iconColor: "text-yellow-500" },
    ],
    rules: ["Hardware Provided", "Sensor Integration", "Code Optimization", "Real-time Testing"],
    registerLink: "https://unstop.com/o/mAyxjwR?utm_medium=Share&utm_source=robotixclubz3574&utm_campaign=Online_coding_challenge",
    rulebookLink: "#rulebook",
  },
  {
    id: "robowar",
    badge: "COMBAT EVENT",
    title: "ROBOWAR",
    subtitle: "ENTER THE ARENA",
    description: "Design and build a powerful remote-controlled battle robot capable of competing against other robots in a controlled combat arena.",
    dateTime: "22 March • 2 PM - 6 PM",
    specs: [
      { icon: Settings, label: "Weight Limit:", value: "8  kg", iconColor: "text-cyan-400" },
      { icon: Zap, label: "Connection:", value: "Wireless Only", iconColor: "text-yellow-500" },
      { icon: Users, label: "Team Size:", value: "1-4  Members", iconColor: "text-cyan-400" },
      { icon: Trophy, label: "Prize Pool:", value: "₹10,000", iconColor: "text-yellow-500" },
    ],
    rules: ["Arena Size", "Safety Rules", "Elimination Format", "Judging Criteria"],
    registerLink: "https://unstop.com/competitions/robowars-robofest-26-robofest-26-national-institute-of-technology-nit-raipur-1656702",
    rulebookLink: "#rulebook",
  },
  {
    id: "roboquiz",
    badge: "QUIZ EVENT",
    title: "ROBOQUIZ",
    subtitle: "TEST YOUR KNOWLEDGE",
    description: "Robotics-themed quiz competition designed to test participants’ knowledge of robotics, electronics, and emerging technologies through engaging and competitive rounds.",
    dateTime: "22 March • 2:30 PM Onwards",
    specs: [
      { icon: Lightbulb, label: "Rounds:", value: "2", iconColor: "text-yellow-500" },
      { icon: Settings, label: "Mode:", value: "Offline", iconColor: "text-cyan-400" },
      { icon: Users, label: "Team Size:", value: " Individual Participation", iconColor: "text-cyan-400" },
      { icon: Trophy, label: "1st Prize:", value: "Goodies worth ₹6,000", iconColor: "text-yellow-500" },
    ],
    rules: ["Arena Size", "Safety Rules", "Elimination Format", "Judging Criteria"],
    registerLink: "https://unstop.com/o/IwoBX5F?utm_medium=Share&utm_source=robotixclubz3574&utm_campaign=Quizzes",
    rulebookLink: "#rulebook",
  },
  // Day 2 - 23 March
  {
    id: "roborace",
    badge: "SPEED EVENT",
    title: "ROBORACE",
    subtitle: "SPEED UNLEASHED",
    description: "Design and build a self-built robot capable of navigating a demanding obstacle track with speed and precision.",
    dateTime: "23 March • 10 AM - 2 PM",
    specs: [
      { icon: Users, label: "Team Size:", value: "1-4 Members", iconColor: "text-cyan-400" },
      { icon: Settings, label: "Max Size:", value: "25x25x25 cm", iconColor: "text-cyan-400" },
      { icon: Settings, label: "Weight Limit:", value: "5 kg", iconColor: "text-cyan-400" },
      { icon: Trophy, label: "Prize Pool:", value: "₹10,000", iconColor: "text-yellow-500" },
    ],
    rules: ["Track Layout", "Bot Dimensions", "Timing Rules", "Restart Policy"],
    registerLink: "https://unstop.com/competitions/roborace-robofest26-robofest-26-national-institute-of-technology-nit-raipur-1655808?lb=hIF1eH2&utm_medium=Share&utm_source=robotixclubz3574&utm_campaign=Competitions",
    rulebookLink: "#rulebook",
  },

  {
    id: "ideathon",
    badge: "INNOVATION EVENT",
    title: "IDEATHON",
    subtitle: "THINK BEYOND",
    description: "Fast-paced innovation challenge where participants transform creative ideas into impactful solutions to real-world technological and societal problems.",
    dateTime: "23 March • 2 PM - 6 PM",
    specs: [
      { icon: Lightbulb, label: "Format:", value: "Pitch & Demo", iconColor: "text-yellow-500" },
      { icon: Users, label: "Team Size:", value: "2-4 Members", iconColor: "text-cyan-400" },
      { icon: Clock, label: "Pitch Time:", value: "10 Minutes", iconColor: "text-cyan-400" },
      { icon: Trophy, label: "Prize Pool:", value: "₹15,000", iconColor: "text-yellow-500" },
    ],
    rules: ["Presentation Format", "Evaluation Criteria", "Prototype Requirements", "Q&A Session"],
    registerLink: "https://unstop.com/o/I5jC4aD?lb=koLWlSN&utm_medium=Share&utm_source=competitions&utm_campaign=Innovrai2351",
    rulebookLink: "#rulebook",
  },
  {
    id: "robosoccer",
    badge: "SPORTS EVENT",
    title: "ROBOSOCCER",
    subtitle: "GOAL MACHINES",
    description: "Design and build manually or wirelessly controlled robots that compete in a soccer-style arena to score goals against the opposing team.",
    dateTime: "23 March • 2:50 PM - 6 PM",
    specs: [
      { icon: Settings, label: "Max Size:", value: "30 x 30 x 30 cm", iconColor: "text-cyan-400" },
      { icon: Settings, label: "Weight Limit:", value: "5 kg", iconColor: "text-cyan-400" },
      { icon: Clock, label: "Match Time:", value: "2.5 Minutes", iconColor: "text-cyan-400" },
      { icon: Trophy, label: "Prize Pool:", value: "₹10,000", iconColor: "text-yellow-500" },
    ],
    rules: ["Field Dimensions", "Bot Specifications", "Scoring System", "Fouls & Penalties"],
    registerLink: "https://unstop.com/competitions/robosoccer-robofest-26-national-institute-of-technology-nit-raipur-1656104",
    rulebookLink: "#rulebook",
  },
]

// Robofest navigation items
const navItems = [
  { name: "Home", href: "#home" },
  { name: "Events", href: "#events" },
  { name: "Main Website", href: "/home", isExternal: true },
]

// Countdown Timer Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Target date: March 22, 2026 at 10:00 AM
    const targetDate = new Date("2026-03-22T10:00:00").getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        // Event has started
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

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
        className="relative border-2 border-cyan-400/60 rounded-lg px-4 py-3 min-w-[70px] md:min-w-[80px]"
        style={{
          background: "rgba(10, 20, 40, 0.6)",
          backdropFilter: "blur(8px)",
          boxShadow:
            "0 0 15px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)",
        }}
      >
        <div className="text-center">
          <motion.div
            key={value}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl font-bold text-cyan-400 tabular-nums leading-none mb-1"
            style={{
              fontFamily: "var(--font-orbitron), monospace",
              textShadow:
                "0 0 20px rgba(0, 212, 255, 0.9), 0 0 40px rgba(0, 212, 255, 0.5)",
            }}
          >
            {String(value).padStart(2, "0")}
          </motion.div>
          <div
            className="text-xs text-cyan-300 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-exo), sans-serif" }}
          >
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
  )

  return (
    <div className="mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-4"
      >
        <p
          className="text-cyan-400 text-sm uppercase tracking-widest"
          style={{
            fontFamily: "var(--font-exo), sans-serif",
            textShadow: "0 0 10px rgba(0, 212, 255, 0.6)",
          }}
        >
          The Gate Opens In
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-2 md:gap-3">
        <TimeBlock value={timeLeft.days} label="Days" />
        <span
          className="text-cyan-400 text-2xl md:text-3xl font-bold mb-6"
          style={{ textShadow: "0 0 10px rgba(0, 212, 255, 0.8)" }}
        >
          :
        </span>
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <span
          className="text-cyan-400 text-2xl md:text-3xl font-bold mb-6"
          style={{ textShadow: "0 0 10px rgba(0, 212, 255, 0.8)" }}
        >
          :
        </span>
        <TimeBlock value={timeLeft.minutes} label="Mins" />
        <span
          className="text-cyan-400 text-2xl md:text-3xl font-bold mb-6"
          style={{ textShadow: "0 0 10px rgba(0, 212, 255, 0.8)" }}
        >
          :
        </span>
        <TimeBlock value={timeLeft.seconds} label="Secs" />
      </div>
    </div>
  )
}

// Main Event Section Component (Full Width)
function MainEventSection({ event }: { event: typeof mainEvent }) {
  const [expandedRule, setExpandedRule] = useState<string | null>(null)

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={event.bgImage}
          alt={event.title}
          fill
          className="object-cover object-left brightness-110"
        />
        {/* Gradient overlays - darken right side where card is, highlight left */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b17] via-transparent to-[#070b17]/30"></div>
        {/* Cyan glow highlight on left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent"></div>
      </div>

      {/* Animated particles - cyan */}
      <div className="absolute inset-0 z-[5]">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: "0 0 6px rgba(0, 212, 255, 0.8)",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - empty for background visual */}
          <div className="hidden lg:block"></div>

          {/* Right side - Event Info Card */}
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.9, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="relative"
          >
            {/* Card container - cyan/blue border */}
            <div
              className="relative rounded-lg p-6 md:p-8 border border-cyan-500/30"
              style={{
                background: "linear-gradient(135deg, rgba(10, 15, 30, 0.95), rgba(5, 10, 20, 0.9))",
                backdropFilter: "blur(10px)",
                boxShadow: "0 0 40px rgba(0, 212, 255, 0.15), inset 0 0 60px rgba(0, 212, 255, 0.03)",
              }}
            >
              {/* Corner accents - cyan */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400"></div>

              {/* Badge - cyan */}
              <div className="flex justify-center mb-4">
                <span
                  className="px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full border border-cyan-500 text-cyan-500"
                  style={{
                    background: "rgba(0, 212, 255, 0.1)",
                    boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
                  }}
                >
                  {event.badge}
                </span>
              </div>

              {/* Title - cyan gradient */}
              <h3
                className="text-5xl md:text-6xl font-black text-center mb-2"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  background: "linear-gradient(to bottom, #00d4ff, #0099cc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {event.title}
              </h3>

              {/* Subtitle - cyan decorations */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-500"></div>
                <p
                  className="text-cyan-400 text-lg font-bold tracking-wider"
                  style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
                >
                  {event.subtitle}
                </p>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-500"></div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center justify-center gap-3 mb-4 p-3 rounded-lg border border-cyan-500/40" style={{ background: "rgba(0, 212, 255, 0.1)" }}>
                <Calendar className="w-6 h-6 text-cyan-400" />
                <p className="text-cyan-300 text-lg font-bold" style={{ fontFamily: "var(--font-exo), sans-serif" }}>
                  {event.dateTime}
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-center mb-6 leading-relaxed">
                {event.description}
              </p>

              {/* Specs Grid - cyan borders */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {event.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-cyan-500/30"
                    style={{
                      background: "rgba(10, 20, 40, 0.8)",
                    }}
                  >
                    <spec.icon className={cn("w-5 h-5", spec.iconColor)} />
                    <div>
                      <p className="text-xs text-gray-400">{spec.label}</p>
                      <p className="text-white font-semibold" style={{ fontFamily: "var(--font-exo), sans-serif" }}>
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="w-full">
                <Link
                  href={event.registerLink}
                  className="block w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-6 text-center font-bold uppercase tracking-wider rounded text-white"
                    style={{
                      fontFamily: "var(--font-exo), sans-serif",
                      background: "linear-gradient(135deg, #00d4ff, #0099cc, #006699)",
                      boxShadow: "0 0 30px rgba(0, 212, 255, 0.4)",
                    }}
                  >
                    View {event.title} Details
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-white/20 hover:border-white/40 transition-colors bg-black/30 backdrop-blur-sm">
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full border border-white/20 hover:border-white/40 transition-colors bg-black/30 backdrop-blur-sm">
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  )
}

// Minor Event Card Component
function MinorEventCard({ event, index }: { event: typeof minorEvents[0]; index: number }) {
  const [expandedRule, setExpandedRule] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="relative rounded-xl overflow-hidden group"
    >
      {/* Background gradient - dark blue/black matching Figma */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(10, 15, 30, 0.98), rgba(5, 10, 20, 0.98), rgba(5, 5, 15, 1))",
        }}
      ></div>
      
      {/* Cyan glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 via-transparent to-transparent"></div>
      
      {/* Animated border glow - cyan */}
      <div 
        className="absolute inset-0 rounded-xl border border-cyan-500/30 group-hover:border-cyan-500/50 transition-colors"
        style={{ boxShadow: "inset 0 0 30px rgba(0, 212, 255, 0.03)" }}
      ></div>

      {/* Content */}
      <div className="relative p-6 md:p-8">
        {/* Badge - cyan */}
        <div className="mb-4">
          <span
            className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border border-cyan-500/50 text-cyan-400"
            style={{
              background: "rgba(0, 212, 255, 0.1)",
            }}
          >
            {event.badge}
          </span>
        </div>

        {/* Title - cyan gradient */}
        <h4
          className="text-3xl md:text-4xl font-black mb-1"
          style={{
            fontFamily: "var(--font-orbitron), sans-serif",
            background: "linear-gradient(to bottom, #ffffff, #00d4ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {event.title}
        </h4>

        {/* Subtitle - cyan */}
        <p
          className="text-cyan-400 text-sm font-bold tracking-wider mb-2"
          style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
        >
          {event.subtitle}
        </p>

        {/* Date & Time */}
        <div className="flex items-center gap-2 mb-4 p-2 rounded-lg border border-cyan-500/40" style={{ background: "rgba(0, 212, 255, 0.1)" }}>
          <Calendar className="w-5 h-5 text-cyan-400" />
          <p className="text-cyan-300 text-sm font-bold" style={{ fontFamily: "var(--font-exo), sans-serif" }}>
            {event.dateTime}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-5 leading-relaxed">
          {event.description}
        </p>

        {/* Specs Grid - cyan borders */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {event.specs.map((spec, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded border border-cyan-500/20"
              style={{ background: "rgba(10, 20, 40, 0.8)" }}
            >
              <spec.icon className={cn("w-4 h-4", spec.iconColor)} />
              <div>
                <p className="text-[10px] text-gray-500">{spec.label}</p>
                <p className="text-white text-sm font-medium">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <motion.a
            href={event.registerLink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 px-4 text-center text-sm font-bold uppercase tracking-wider rounded text-white"
            style={{
              fontFamily: "var(--font-exo), sans-serif",
              background: "linear-gradient(135deg, #00d4ff, #0099cc)",
              boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
            }}
          >
            Register
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

// Main Robofest Page Component
export default function RobofestPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Smooth scroll handler
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        })
      }
      setIsMenuOpen(false)
    }
  }, [])

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  return (
    <div className="min-h-screen bg-[#070b17] text-white overflow-x-hidden scroll-smooth">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(10, 15, 30, 0.5)",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 0 20px rgba(0, 212, 255, 0.2), 0 4px 6px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="border-b border-cyan-400/30"></div>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logoWhite.png"
                alt="ROBOTiX Club"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span
                className="text-xl font-bold text-white tracking-wider"
                style={{
                  fontFamily: "var(--font-orbitron), sans-serif",
                  textShadow: "0 0 10px rgba(0, 212, 255, 0.5)",
                }}
              >
                ROBOTiX CLUB
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="relative text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium group cursor-pointer"
                  style={{ fontFamily: "var(--font-exo), sans-serif" }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                  whileHover={{
                    textShadow: "0 0 8px rgba(0, 212, 255, 0.8)",
                  }}
                >
                  {link.name}
                  {index === 0 && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      layoutId="activeNav"
                      style={{ boxShadow: "0 0 8px rgba(0, 212, 255, 0.8)" }}
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-cyan-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#070b17]/95 border-t border-cyan-400/30"
            >
              <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-cyan-400 transition-colors py-2"
                    style={{ fontFamily: "var(--font-exo), sans-serif" }}
                    onClick={(e) => scrollToSection(e, item.href)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-[#070b17]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/robofest-hero.png"
            alt="ANANTYA'26"
            fill
            className="object-cover opacity-90"
            priority
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b17]/90 via-[#070b17]/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#070b17]/60 via-transparent to-[#070b17]/80"></div>
        </div>

        {/* Background atmospheric effects */}
        <div className="absolute inset-0 z-[5]">
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
                boxShadow: "0 0 4px rgba(0, 212, 255, 0.8)",
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
                width: "200px",
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
        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 z-[15] hidden lg:block">
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
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[15] hidden lg:block"
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
          <div
            className="relative w-16 h-8 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full border border-cyan-400/40"
            style={{ boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)" }}
          >
            {/* Navigation lights */}
            <motion.div
              className="absolute top-1 left-2 w-2 h-2 bg-cyan-400 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ boxShadow: "0 0 6px rgba(0, 212, 255, 0.9)" }}
            ></motion.div>
            <motion.div
              className="absolute top-1 right-2 w-2 h-2 bg-cyan-400 rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ boxShadow: "0 0 6px rgba(0, 212, 255, 0.9)" }}
            ></motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-[100] pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 items-center">
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
                  <div
                    className="flex items-center gap-2 text-cyan-400 text-sm tracking-[0.3em] font-medium"
                    style={{ fontFamily: "var(--font-exo), sans-serif" }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-cyan-400 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ boxShadow: "0 0 8px rgba(0, 212, 255, 0.9)" }}
                    ></motion.div>
                    ROBOTiX CLUB • NIT RAIPUR PRESENTS
                  </div>
                  <div className="text-cyan-400 text-xl opacity-50">]</div>
                </div>
              </motion.div>

              {/* Main Heading with enhanced glow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-none mb-2 whitespace-nowrap"
                  style={{
                    fontFamily: "var(--font-orbitron), sans-serif",
                    textShadow:
                      "0 0 40px rgba(0, 212, 255, 0.7), 0 0 80px rgba(0, 212, 255, 0.4), 0 0 120px rgba(0, 212, 255, 0.2)",
                    background:
                      "linear-gradient(to bottom, #ffffff, #00d4ff, #0ff0ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ROBOFEST&apos;26
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
                    className="text-1.5xl sm:text-2xl lg:text-3xl font-bold text-cyan-400"
                    style={{
                      fontFamily: "var(--font-orbitron), sans-serif",
                      textShadow:
                        "0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.4)",
                    }}
                  >
                    ANANTYA'26: Tech Fest NIT Raipur
                  </h2>
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-cyan-400"></div>
                </div>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 rounded-full"
                  style={{ boxShadow: "0 0 10px rgba(0, 212, 255, 0.6)" }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
              </motion.div>

              {/* Tagline with blue glow */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg sm:text-xl text-gray-200 max-w-lg"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  textShadow: "0 0 20px rgba(100, 200, 255, 0.3)",
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
                style={{ fontFamily: "var(--font-exo), sans-serif" }}
              >
                <div className="flex items-center gap-2">
                  <MapPin
                    className="w-5 h-5 text-cyan-400"
                    style={{
                      filter: "drop-shadow(0 0 4px rgba(0, 212, 255, 0.6))",
                    }}
                  />
                  <span>NIT Raipur</span>
                </div>
                <div className="w-px h-6 bg-cyan-400/40"></div>
                <div className="flex items-center gap-2">
                  <Calendar
                    className="w-5 h-5 text-cyan-400"
                    style={{
                      filter: "drop-shadow(0 0 4px rgba(0, 212, 255, 0.6))",
                    }}
                  />
                  <span>22 - 23 March 2026</span>
                </div>
              </motion.div>
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
                fontFamily: "var(--font-exo), sans-serif",
                textShadow: "0 0 10px rgba(0, 212, 255, 0.6)",
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
                style={{
                  filter: "drop-shadow(0 0 8px rgba(0, 212, 255, 0.8))",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tech divider at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-px">
          <div
            className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
            style={{ boxShadow: "0 0 10px rgba(0, 212, 255, 0.5)" }}
          ></div>
        </div>
      </div>

      {/* Events Section */}
      <section id="events" className="relative bg-[#070b17]">
        {/* Section Header */}
        <div className="py-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-cyan-500 text-sm uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "var(--font-exo), sans-serif" }}
            >
              ANANTYA&apos;26
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-6xl font-black mb-4"
              style={{
                fontFamily: "var(--font-orbitron), sans-serif",
                background: "linear-gradient(to bottom, #ffffff, #00d4ff, #0099cc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              EVENTS
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 max-w-2xl mx-auto px-4"
            >
              Compete, innovate, and showcase your skills in our flagship robotics events
            </motion.p>
          </motion.div>
        </div>

        {/* Main Event - Full Width */}
        <MainEventSection event={mainEvent} />

        {/* Minor Events - 2 per row */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-3xl font-bold text-center text-white mb-12"
              style={{
                fontFamily: "var(--font-orbitron), sans-serif",
                textShadow: "0 0 20px rgba(0, 212, 255, 0.4)",
              }}
            >
              MORE EVENTS
            </motion.h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {minorEvents.map((event, index) => (
                <MinorEventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="relative bg-[#070b17] py-20">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-cyan-500 text-sm uppercase tracking-[0.3em] mb-4"
              style={{ fontFamily: "var(--font-exo), sans-serif" }}
            >
              ROBOFEST&apos;26
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-6xl font-black mb-4"
              style={{
                fontFamily: "var(--font-orbitron), sans-serif",
                background: "linear-gradient(to bottom, #ffffff, #00d4ff, #0099cc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              OUR SPONSORS
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 max-w-2xl mx-auto px-4"
            >
              Fueling innovation — meet the visionaries who power ROBOFEST&apos;26
            </motion.p>
            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 mx-auto w-40 h-px"
              style={{
                background: "linear-gradient(to right, transparent, #00d4ff, transparent)",
                boxShadow: "0 0 10px rgba(0, 212, 255, 0.6)",
              }}
            />
          </motion.div>

          {/* Title Sponsor - largest, full width */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span
              className="px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] rounded-full border border-yellow-400/60 text-yellow-400"
              style={{
                background: "rgba(234, 179, 8, 0.1)",
                boxShadow: "0 0 20px rgba(234, 179, 8, 0.2)",
                fontFamily: "var(--font-exo), sans-serif",
              }}
            >
              ★ Title Sponsor ★
            </span>
          </motion.div> */}

          {/* Title Sponsor — full width prominent card */}
          


          {/* Divider */}
          <div className="flex items-center gap-4 mb-14 max-w-4xl mx-auto">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(0,212,255,0.3))" }} />
            <span
              className="text-cyan-500/70 text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-exo), sans-serif" }}
            >
              Partners &amp; Sponsors
            </span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(0,212,255,0.3))" }} />
          </div>

          {/* Other Sponsors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/sponsors/platform_partner.png", name: "Platform Partner" }, 
              { src: "/sponsors/coverage_partner_1.png", name: "Coverage Partner" },
              { src: "/sponsors/voice_of_the_event.png", name: "Voice of the event" },
              { src: "/sponsors/coverage_partner_2.png", name: "Coverage Partner" },  
              { src: "/sponsors/electronics_partner (2).png", name: "Electronics Partner" },
              { src: "/sponsors/gifting_partner_2.png", name: "Gifting Partner" },
              { src: "/sponsors/trophy_partner.png", name: "Trophy Partner" },
              { src: "/sponsors/media_partner.png", name: "Media Partner" }, 
            ].map((sponsor, index) => (
              <motion.div
                key={sponsor.src}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.5,
                  delay: (index % 4) * 0.08,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="relative rounded-lg group"
              >
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ boxShadow: "0 0 20px rgba(0,212,255,0.15)" }}
                />
                <div
                  className="relative rounded-lg p-5 border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors duration-300 flex flex-col items-center gap-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(10, 15, 30, 0.98), rgba(5, 10, 20, 0.98))",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="w-full flex items-center justify-center min-h-[120px]">
                    <Image
                      src={sponsor.src}
                      alt={sponsor.name}
                      width={240}
                      height={120}
                      className="object-contain max-h-[120px] w-auto"
                      style={{ filter: "brightness(1.1)" }}
                    />
                  </div>
                  <p
                    className="text-gray-400 text-sm font-medium uppercase tracking-wider text-center group-hover:text-cyan-400 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-exo), sans-serif" }}
                  >
                    {sponsor.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
