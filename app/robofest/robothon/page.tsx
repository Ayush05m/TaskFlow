"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Activity, 
  Menu, 
  X, 
  ArrowLeft,
  Clock,
  Trophy,
  Users,
  Target,
  Cpu,
  Rocket,
  FileCode,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Navigation,
  Waves,
  Bug,
  Hexagon,
  Plane,
  Github,
  FileVideo,
  Presentation,
  Brain,
  Cog,
  AlertTriangle,
  BarChart3,
  Settings,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"

// Navigation items
const navItems = [
  { name: "Back to Robofest", href: "/robofest", icon: ArrowLeft },
  { name: "About", href: "#about" },
  { name: "Evaluation", href: "#evaluation" },
  { name: "Problem Statements", href: "#problems" },
  { name: "Deliverables", href: "#deliverables" },
]

// Event specs
const eventSpecs = [
  { icon: Clock, label: "Duration:", value: "24 Hours", iconColor: "text-cyan-400" },
  { icon: Users, label: "Team Size:", value: "2-4 Members", iconColor: "text-cyan-400" },
  { icon: Target, label: "Format:", value: "Simulation-Based", iconColor: "text-yellow-500" },
  { icon: Trophy, label: "Prize Pool:", value: "₹35,000", iconColor: "text-cyan-400" },
  { icon: AlertTriangle, label: "Registration Deadline:", value: "15 March", iconColor: "text-red-400" },
  { icon: CheckCircle, label: "Shortlisting Round:", value: "16-18 March", iconColor: "text-green-400" },
]

// Problem statements data
const problemStatements = [
  {
    id: "gps-denied",
    title: "GPS-Denied Navigation System",
    icon: Navigation,
    description: "Design and implement a cost-effective swarm of drones capable of cooperative surveillance, mapping, and real-time SLAM in both GPS-enabled and GPS-denied environments. The project proposes a low-cost, autonomous drone integrating RGB-D vision, 2D LiDAR, and onboard computation (NVIDIA Jetson) to perform real-time SLAM, obstacle avoidance, and path planning without GPS.",
    problems: [
      {
        title: "A* Algorithm Navigation",
        desc: "Simulate autonomous navigation of a drone from a start location to a goal location in a 2D environment using the A* algorithm while avoiding obstacles."
      },
      {
        title: "PID Controller Height Maintenance",
        desc: "Simulate a drone using PID controller such that it maintains a certain vertical height and avoids obstacles."
      },
      {
        title: "Underground/Tunnel Navigation",
        desc: "Develop an autonomous navigation system for underground or tunnel environments where GPS signals cannot reach, using alternative sensing methods. (Either bot or drone can be used for simulation)"
      }
    ]
  },
  {
    id: "swarm-drones",
    title: "Swarm Drones",
    icon: Plane,
    description: "A cost-effective swarm of drones capable of cooperative surveillance, mapping, and real-time SLAM. Each drone possesses distinct sensing and computational capabilities, enabling multi-purpose functionality such as garbage monitoring, disaster mapping, and defense reconnaissance. The focus is on building decentralized algorithms for coordination and communication.",
    problems: [
      {
        title: "Lightweight Swarm Navigation in Dynamic Environment",
        desc: "The drones fly in coordinated formations like triangle or square to efficiently cover and scan the entire area. This formation-based navigation ensures maximum coverage, better stability, and collision avoidance while moving through the environment. (Webots/ROS Simulation)"
      },
      {
        title: "Energy-Efficient Lightweight Swarm Task Allocation",
        desc: "Multiple drones operate simultaneously and share real-time location data of detected tasks (like garbage spots). Once garbage is detected, the drone marks the exact coordinates and integrates it into a digital map. All drones update this map collaboratively, ensuring faster response and accurate monitoring."
      },
      {
        title: "Compact Hybrid Lightweight Drone Design",
        desc: "Design Challenge - Create a scalable, autonomous swarm UAV platform that can assist in civil, environmental, and defense applications with resilience, adaptability, and efficient data fusion."
      }
    ]
  },
  {
    id: "underwater-robot",
    title: "Underwater Robot",
    icon: Waves,
    description: "A bio-inspired, autonomous underwater robot capable of reliable navigation and communication in subsea environments. The project aims to overcome limitations like GPS unavailability, sensor drift, signal attenuation, and inefficient energy usage using an integrated navigation, communication, and safety framework.",
    problems: [
      {
        title: "AUV Sensor Placement Simulation",
        desc: "Design and simulate sensor layouts on an underwater robot and visually show regions the sensors cannot see (blind spots demonstration)."
      },
      {
        title: "Hydrodynamic Force Modeling for an AUV",
        desc: "Use simulation data to build a simple model showing gravity, drag, thrust, buoyancy forces, etc. acting on an AUV in water."
      },
      {
        title: "Collision Avoidance for Multiple AUV",
        desc: "Coordinate several simulated underwater robots so they move toward their goals without colliding with each other or obstacles."
      }
    ]
  },
  {
    id: "nanobot",
    title: "Nanobot",
    icon: Bug,
    description: "A breakthrough in spinal cancer treatment using magnetically controlled nanoparticles to eliminate residual cancer cells non-invasively. It aims to restore mobility, reduce surgical risks, and improve outcomes for all patients. With biocompatible materials and scalable methods, it supports long-term sustainability and advances public health through safer, more effective cancer care.",
    problems: [
      {
        title: "The Blood-Brain Barrier (BBB) Breach",
        desc: "The robot is placed in a capillary (fluid environment) with varying pore sizes on its wall which are closed. The robot has to navigate toward the correct pore without hitting the wall and has to emit a specific biochemical key (a signal or sequence) to open the correct pore and enter in it."
      },
      {
        title: "Chemotactic Plume Tracking",
        desc: "Mimic a bacteria or nanorobot to find target by following a chemical trail. In a 3D space, there is a source releasing a biomarker that follows a Gaussian distribution. The nanorobot must find the source in shortest time possible using a gradient-climbing algorithm."
      },
      {
        title: "Swarm Coordination for Structural Repair",
        desc: "Using a swarm of smaller units to fix a larger structure. A virtual pipe (blood vessel) has multiple cracks. A swarm of 5-10 virtual nanorobots must navigate to the target and coordinate their movements to cluster around the crack simultaneously to bridge the gap."
      }
    ]
  },
  {
    id: "six-legged-rover",
    title: "Six-Legged Rough Terrain Rover",
    icon: Hexagon,
    description: "An iterative, tightly integrated hardware–software development cycle for building a six-legged, rugged terrain robot with advanced navigation and modular sensing capabilities. The goal is to create a versatile platform blending affordability with advanced autonomy, ensuring practical deployment in real-world conditions.",
    problems: [
      {
        title: "Rough Terrain Autonomous Navigation",
        desc: "Design and simulate a six-legged rover or Quadruped robot in ROS2 that autonomously navigates through rough terrain (rocks, slopes, uneven ground) while maintaining stability. The robot must monitor body tilt and adjust gait to prevent tipping."
      },
      {
        title: "Indoor Exploration & Object Detection",
        desc: "Develop a ROS2-based simulation of a quadruped or six-legged robot that autonomously explores an indoor room environment, generates a map using onboard sensors, detects objects, and counts total number of objects with their approximate positions."
      },
      {
        title: "Keyboard Teleoperation with SLAM",
        desc: "Develop a ROS2-based simulation of a quadruped or six-legged robot that can be manually controlled using keyboard teleoperation while simultaneously building a map of the environment and detecting objects using onboard sensors."
      },
      {
        title: "Optimized Leg Architecture Design",
        desc: "Simulation-Based Mechanical Design - Create a staged approach from simulation and mechanical design to hardware prototyping, perception integration, and field validation."
      }
    ]
  }
]

// Evaluation criteria
const evaluationCriteria = [
  "Adaptability to new or modified environments",
  "Algorithm robustness and fault tolerance",
  "Computational efficiency",
  "Scalability (especially for swarm systems)",
  "Quality of system architecture",
  "Clarity of technical explanation",
  "Reproducibility of results"
]

// Pre-event metrics
const preEventMetrics = [
  "Task completion time",
  "Energy efficiency (if modeled)",
  "Collision count",
  "Path optimality",
  "Communication efficiency (for swarm systems)",
  "Stability metrics (tilt angle, oscillations, etc.)"
]

// Deliverables
const deliverables = [
  {
    icon: Github,
    title: "ROS2/WeBOT Package",
    desc: "Upload a complete package to a public GitHub repository. Include a detailed README with installation, setup, and execution instructions."
  },
  {
    icon: FileVideo,
    title: "Demonstration Video",
    desc: "A comprehensive video demonstrating your simulation in action, showcasing key features and capabilities."
  },
  {
    icon: Presentation,
    title: "Technical Presentation",
    desc: "PowerPoint covering overall software architecture, AI/ML algorithms used for navigation and obstacle avoidance, key implementation details and design choices."
  }
]

// Collapsible Problem Statement Card
function ProblemStatementCard({ ps, index }: { ps: typeof problemStatements[0]; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const IconComponent = ps.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative rounded-xl overflow-hidden"
    >
      {/* Card background */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(10, 15, 30, 0.98), rgba(5, 10, 20, 0.98), rgba(5, 5, 15, 1))",
        }}
      />
      
      {/* Border */}
      <div 
        className="absolute inset-0 rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 transition-colors"
        style={{ boxShadow: "inset 0 0 30px rgba(0, 212, 255, 0.03)" }}
      />

      <div className="relative p-6">
        {/* Header - Always visible */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div 
                className="p-3 rounded-lg border border-cyan-500/30"
                style={{ background: "rgba(0, 212, 255, 0.1)" }}
              >
                <IconComponent className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <span 
                  className="text-xs font-bold text-cyan-500 uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-exo), sans-serif" }}
                >
                  Project {index + 1}
                </span>
                <h3
                  className="text-xl md:text-2xl font-bold text-white mt-1"
                  style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
                >
                  {ps.title}
                </h3>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="p-2 rounded-full border border-cyan-500/30 bg-cyan-500/10"
            >
              <ChevronDown className="w-5 h-5 text-cyan-400" />
            </motion.div>
          </div>
        </button>

        {/* Expandable content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-cyan-500/20">
                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {ps.description}
                </p>

                {/* Problem statements */}
                <div className="space-y-4">
                  <h4 
                    className="text-cyan-400 font-bold uppercase tracking-wider text-sm"
                    style={{ fontFamily: "var(--font-exo), sans-serif" }}
                  >
                    Problem Statements
                  </h4>
                  {ps.problems.map((problem, idx) => (
                    <div 
                      key={idx}
                      className="p-4 rounded-lg border border-cyan-500/20"
                      style={{ background: "rgba(10, 20, 40, 0.6)" }}
                    >
                      <div className="flex items-start gap-3">
                        <span 
                          className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-bold"
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="text-white font-semibold mb-1">{problem.title}</h5>
                          <p className="text-gray-400 text-sm">{problem.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Section Header Component
function SectionHeader({ tag, title, description }: { tag: string; title: string; description?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <p
        className="text-cyan-500 text-sm uppercase tracking-[0.3em] mb-4"
        style={{ fontFamily: "var(--font-exo), sans-serif" }}
      >
        {tag}
      </p>
      <h2
        className="text-4xl md:text-5xl font-black mb-4"
        style={{
          fontFamily: "var(--font-orbitron), sans-serif",
          background: "linear-gradient(to bottom, #ffffff, #00d4ff, #0099cc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-gray-400 max-w-3xl mx-auto px-4">
          {description}
        </p>
      )}
    </motion.div>
  )
}

export default function RobothonPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#070b17] text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(10, 15, 30, 0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 20px rgba(0, 212, 255, 0.2), 0 4px 6px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="border-b border-cyan-400/30"></div>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/robofest" className="flex items-center gap-3">
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="relative text-gray-300 hover:text-cyan-400 transition-all duration-300 font-medium flex items-center gap-1"
                  style={{ fontFamily: "var(--font-exo), sans-serif" }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                  whileHover={{ textShadow: "0 0 8px rgba(0, 212, 255, 0.8)" }}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.name}
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
                    className="text-gray-300 hover:text-cyan-400 transition-colors py-2 flex items-center gap-2"
                    style={{ fontFamily: "var(--font-exo), sans-serif" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#070b17] via-[#0a1628] to-[#070b17]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full"></div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 z-[5]">
          {[...Array(25)].map((_, i) => (
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
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span
                className="px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-full border border-cyan-500 text-cyan-500"
                style={{
                  background: "rgba(0, 212, 255, 0.1)",
                  boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
                }}
              >
                ANANTYA&apos;26 • ROBOTiX MAIN EVENT
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black mb-4"
              style={{
                fontFamily: "var(--font-orbitron), sans-serif",
                background: "linear-gradient(to bottom, #ffffff, #00d4ff, #0ff0ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 60px rgba(0, 212, 255, 0.5)",
              }}
            >
              ROBOTHON
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan-400"></div>
              <p
                className="text-cyan-400 text-xl font-bold tracking-wider"
                style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
              >
                24-HOUR SIMULATION HACKATHON
              </p>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-cyan-400"></div>
            </motion.div>

            {/* Date & Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex items-center justify-center gap-3 mb-6 p-4 rounded-lg border border-cyan-500/40 max-w-md mx-auto"
              style={{ background: "rgba(0, 212, 255, 0.1)" }}
            >
              <Calendar className="w-7 h-7 text-cyan-400" />
              <p className="text-cyan-300 text-xl font-bold" style={{ fontFamily: "var(--font-exo), sans-serif" }}>
                22 - 23 March 2026 • 10 AM Onwards
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              A premier simulation-based hackathon focusing on five high-impact projects. 
              Push your limits in virtual prototyping and compete for glory!
            </motion.p>

            {/* Specs Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto mb-10"
            >
              {eventSpecs.map((spec, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-cyan-500/30"
                  style={{ background: "rgba(10, 20, 40, 0.6)" }}
                >
                  <spec.icon className={cn("w-6 h-6", spec.iconColor)} />
                  <p className="text-xs text-gray-400">{spec.label}</p>
                  <p className="text-white font-bold" style={{ fontFamily: "var(--font-exo), sans-serif" }}>
                    {spec.value}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.a
                href="https://unstop.com/hackathons/robothon-26-robofest-26-national-institute-of-technology-nit-raipur-1654645?lb=hIF1eH2&utm_medium=Share&utm_source=online_coding_challenge&utm_campaign=Robotixclubz3574"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-white font-bold uppercase tracking-wider rounded"
                style={{
                  fontFamily: "var(--font-exo), sans-serif",
                  background: "linear-gradient(135deg, #00d4ff, #0099cc, #006699)",
                  boxShadow: "0 0 30px rgba(0, 212, 255, 0.4)",
                }}
              >
                Register Now
              </motion.a>
              <motion.a
                href="#problems"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-bold uppercase tracking-wider rounded hover:bg-cyan-400/10 transition-colors"
                style={{ fontFamily: "var(--font-exo), sans-serif" }}
              >
                View Problem Statements
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-cyan-400 text-sm uppercase tracking-wider">Scroll</span>
            <ChevronDown className="w-6 h-6 text-cyan-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-6">
          <SectionHeader 
            tag="Overview"
            title="ABOUT ROBOTHON"
            description="Prepare for an intense 24-hour sprint of innovation"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div 
                className="p-6 rounded-xl border border-cyan-500/30"
                style={{ background: "rgba(10, 20, 40, 0.6)" }}
              >
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                  The Challenge
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  This year, the challenge goes virtual, focusing on five high-impact, ongoing projects: 
                  <span className="text-cyan-400"> GPS-Denied Drones, Swarm Drones, Underwater Robotics, Nanobots, and Six-Legged Rough Terrain Rovers</span>. 
                  Teams of 2–4 members must select their Problem Statement (PS) at the time of registration and begin developing their simulation models immediately.
                </p>
              </div>

              <div 
                className="p-6 rounded-xl border border-cyan-500/30"
                style={{ background: "rgba(10, 20, 40, 0.6)" }}
              >
                <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                  The Format
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  A few days before the main event, progress will be evaluated to shortlist the <span className="text-cyan-400">top 10–12 teams</span> who will advance to the final stage. 
                  During the 24-hour live event, finalists will be tasked with modifying and optimizing their simulations in real-time to meet new technical hurdles.
                </p>
              </div>
            </motion.div>

            {/* Key highlights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div 
                className="p-6 rounded-xl border border-cyan-500/30"
                style={{ background: "rgba(10, 20, 40, 0.6)" }}
              >
                <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                  What You&apos;ll Gain
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Brain, text: "Enhanced problem-solving abilities in specialized fields" },
                    { icon: Users, text: "Teamwork experience with seamless collaboration under pressure" },
                    { icon: Zap, text: "Real-time engineering skills: iterate and troubleshoot on the fly" },
                    { icon: Cog, text: "Deep understanding of industry-standard simulation tools" },
                    { icon: Trophy, text: "Cash prizes and recognition for top performers" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                        <item.icon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <p className="text-gray-300">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Evaluation Section */}
      <section id="evaluation" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
            tag="Process"
            title="TESTING & EVALUATION"
            description="Two structured phases to ensure fairness, robustness, and real-world adaptability"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phase 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div 
                className="p-6 rounded-xl border border-cyan-500/30 h-full"
                style={{ background: "rgba(10, 20, 40, 0.6)" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-cyan-400 font-bold">1</span>
                  <div>
                    <p className="text-cyan-400 text-xs uppercase tracking-wider">Pre-Event</p>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                      Shortlisting Round
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 text-gray-300 text-sm">
                  <p>Each team must design and prepare its own testing environment based on the selected Problem Statement, realistically reflecting constraints and operating conditions.</p>
                  
                  <div className="p-4 rounded-lg bg-[#070b17] border border-cyan-500/20">
                    <p className="text-cyan-400 font-semibold mb-2">Documentation Required:</p>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Environment assumptions</li>
                      <li>• Simulation parameters</li>
                      <li>• Performance metrics</li>
                      <li>• Hardware/software constraints</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-[#070b17] border border-cyan-500/20">
                    <p className="text-cyan-400 font-semibold mb-2">Performance Metrics:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {preEventMetrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-gray-400 text-xs">
                          <CheckCircle className="w-3 h-3 text-cyan-500" />
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Phase 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div 
                className="p-6 rounded-xl border border-yellow-500/30 h-full"
                style={{ background: "rgba(20, 15, 10, 0.6)" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-yellow-400 font-bold">2</span>
                  <div>
                    <p className="text-yellow-400 text-xs uppercase tracking-wider">Final Round</p>
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                      24-Hour Robothon
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 text-gray-300 text-sm">
                  <p>Teams will validate their simulation under modified or entirely new testing conditions during the live event.</p>
                  
                  <div className="p-4 rounded-lg bg-[#070b17] border border-yellow-500/20">
                    <p className="text-yellow-400 font-semibold mb-2">Organizers May:</p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Modify your testing environment (dynamic obstacles, terrain roughness, communication delay, sensor noise, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Settings className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>Provide a completely new standardized testing environment</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-[#070b17] border border-yellow-500/20">
                    <p className="text-yellow-400 font-semibold mb-2">Teams Must:</p>
                    <ul className="space-y-1 text-gray-400">
                      <li>• Adapt and optimize simulation in real time</li>
                      <li>• Tune control parameters and algorithms</li>
                      <li>• Ensure stability under new constraints</li>
                      <li>• Demonstrate robustness against uncertainty</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Evaluation Criteria */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div 
              className="p-6 rounded-xl border border-cyan-500/30"
              style={{ background: "rgba(10, 20, 40, 0.6)" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                  Final Evaluation Criteria
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {evaluationCriteria.map((criteria, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-lg border border-cyan-500/20 text-center"
                    style={{ background: "rgba(0, 212, 255, 0.05)" }}
                  >
                    <p className="text-gray-300 text-sm">{criteria}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-4 text-center italic">
                The final ranking will heavily emphasize how well the system performs outside its originally designed testing conditions, reflecting real-world engineering challenges.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statements Section */}
      <section id="problems" className="py-20 relative">
        <div className="container mx-auto px-6">
          <SectionHeader 
            tag="Challenges"
            title="PROBLEM STATEMENTS"
            description="Choose from five ongoing projects currently being undertaken by the ROBOTiX Club"
          />

          <div className="space-y-6">
            {problemStatements.map((ps, index) => (
              <ProblemStatementCard key={ps.id} ps={ps} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section id="deliverables" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
            tag="Submissions"
            title="DELIVERABLES"
            description="What you need to submit for the evaluation"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliverables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 rounded-xl border border-cyan-500/30"
                style={{ background: "rgba(10, 20, 40, 0.6)" }}
              >
                <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 w-fit mb-4">
                  <item.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Technical Presentation Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <div 
              className="p-6 rounded-xl border border-cyan-500/30"
              style={{ background: "rgba(10, 20, 40, 0.6)" }}
            >
              <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "var(--font-orbitron), sans-serif" }}>
                Technical Presentation Must Cover:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-cyan-500/20">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300 text-sm">Overall software architecture</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-cyan-500/20">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300 text-sm">AI/ML algorithms for navigation</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-cyan-500/20">
                  <Cog className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300 text-sm">Key implementation details</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div 
              className="p-8 md:p-12 rounded-2xl border border-cyan-500/30 relative overflow-hidden"
              style={{ background: "rgba(10, 20, 40, 0.6)" }}
            >
              {/* Glow effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-400/10 blur-[100px] rounded-full"></div>
              
              <div className="relative z-10">
                <Rocket className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
                <h2 
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-orbitron), sans-serif" }}
                >
                  Ready to Build the Future?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                  Join the most intense 24-hour robotics simulation hackathon. 
                  Select your problem statement, build your simulation, and compete for glory!
                </p>
                <motion.a
                  href="https://unstop.com/o/Gw4fTex?lb=bqoA1gBv&utm_medium=Share&utm_source=online_coding_challenge&utm_campaign=Anantyac28082"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-10 py-4 text-white font-bold uppercase tracking-wider rounded"
                  style={{
                    fontFamily: "var(--font-exo), sans-serif",
                    background: "linear-gradient(135deg, #00d4ff, #0099cc, #006699)",
                    boxShadow: "0 0 30px rgba(0, 212, 255, 0.4)",
                  }}
                >
                  Register for Robothon
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-cyan-500/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logoWhite.png"
                alt="ROBOTiX Club"
                width={24}
                height={24}
                className="h-6 w-auto"
              />
              <span className="text-gray-400 text-sm">ROBOTiX Club • NIT Raipur</span>
            </div>
            <p className="text-gray-500 text-sm">G. E. Road, Raipur – 492010 (C. G)</p>
            <Link 
              href="/robofest" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Robofest
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
