import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";

export default function App() {
  return (
    <div className="min-h-screen bg-[#070b17] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
    </div>
  );
}
