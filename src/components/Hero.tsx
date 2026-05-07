import { useState, useEffect } from "react";
import heroImg from "@/assets/hero-bg.jpg";
import PurchaseModal from "./PurchaseModal";
import WhatsAppButton from "./WhatsAppButton";
import { FaShippingFast, FaShieldAlt, FaMedal } from "react-icons/fa";

const Hero = () => {
  const [showModal, setShowModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background with Parallax */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`
          }}
        />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-gradient-to-br from-pure-black/80 via-transparent to-pure-black/80 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-transparent" />
        </div>

        {/* Floating Particles Animation */}
        <div className="absolute inset-0 z-[2]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-pure-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center pt-20 pb-10">
          {/* Animated Logo Text with Glow Effect */}
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-pure-white animate-fade-in relative">
              <span className="absolute inset-0 blur-3xl text-pure-white/50 animate-pulse">BEPODS</span>
              <span className="relative">BEPODS</span>
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-pure-white/20 to-transparent blur-3xl animate-pulse" />
          </div>

          {/* Animated Tagline */}
          <p className="text-xl md:text-3xl text-pure-white/90 mb-8 animate-fade-in animation-delay-200 font-light tracking-wide">
            <span className="inline-block animate-pulse">Feel</span>{" "}
            <span className="inline-block animate-pulse animation-delay-200">Music</span>{" "}
            <span className="inline-block animate-pulse animation-delay-400">with</span>{" "}
            <span className="inline-block font-bold bg-gradient-to-r from-pure-white to-pure-white/60 bg-clip-text text-transparent">
              BEPODS
            </span>
          </p>

          {/* WhatsApp Contact */}
          <div className="flex justify-center mb-8 animate-fade-in animation-delay-300">
            <WhatsAppButton message="Hi! I want to order BEPODS products." />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
            <button 
              onClick={() => setShowModal(true)}
              className="group relative px-8 py-4 bg-pure-white text-pure-black font-semibold rounded-lg overflow-hidden transition-all transform hover:scale-105 shadow-glow"
            >
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pure-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            <a 
              href="#products" 
              className="group relative px-8 py-4 border-2 border-pure-white text-pure-white font-semibold rounded-lg overflow-hidden transition-all transform hover:scale-105"
            >
              <span className="relative z-10">View Products</span>
              <div className="absolute inset-0 bg-pure-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
          </div>
          
          {/* Feature Icons with Animation */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in animation-delay-600">
            <div className="group text-center transform hover:scale-110 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-4 bg-pure-white/10 rounded-full backdrop-blur-sm group-hover:bg-pure-white/20 transition-all">
                  <FaMedal className="text-3xl text-pure-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-pure-white">Premium</p>
              <p className="text-pure-white/60">Quality</p>
            </div>
            <div className="group text-center transform hover:scale-110 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-4 bg-pure-white/10 rounded-full backdrop-blur-sm group-hover:bg-pure-white/20 transition-all">
                  <FaShieldAlt className="text-3xl text-pure-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-pure-white">6 Months</p>
              <p className="text-pure-white/60">Warranty</p>
            </div>
            <div className="group text-center transform hover:scale-110 transition-all duration-300">
              <div className="flex justify-center mb-3">
                <div className="p-4 bg-pure-white/10 rounded-full backdrop-blur-sm group-hover:bg-pure-white/20 transition-all">
                  <FaShippingFast className="text-3xl text-pure-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-pure-white">Free</p>
              <p className="text-pure-white/60">Shipping</p>
            </div>
          </div>

          {/* WhatsApp Contact Info */}
          <div className="mt-12 text-pure-white/80 animate-fade-in animation-delay-800">
            <p className="text-lg">Quick Order via WhatsApp</p>
            <p className="text-2xl font-bold mt-2">+91 6306201043</p>
          </div>
        </div>
      </section>
      
      <PurchaseModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Hero;