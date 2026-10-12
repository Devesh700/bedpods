import { useState, useEffect } from "react";
import heroImg from "@/assets/image.png";
import PurchaseModal from "./PurchaseModal";
import WhatsAppButton from "./WhatsAppButton";
import { FaShippingFast, FaShieldAlt, FaMedal } from "react-icons/fa";
import { Link } from "react-router-dom";

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
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background with Parallax */}
        <div
          className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.25)",
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-gradient-to-br from-pure-black/90 via-transparent to-pure-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-pure-black via-transparent to-transparent" />
        </div>

        {/* Floating Gold Particles */}
        <div className="absolute inset-0 z-[2]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center pt-24 pb-12">
          {/* Animated Logo Text */}
          <div className="relative inline-block mb-6">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-pure-white tracking-tight animate-fade-in relative">
              <span className="relative text-amber-400">ALFA GOLD BOX</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80 font-semibold mt-2">
              Luxury Jewellery Packaging & Storage Vaults
            </p>
          </div>

          {/* Tagline */}
          <p className="text-lg md:text-2xl text-pure-white/90 mb-8 max-w-2xl mx-auto font-light tracking-wide">
            Elevate Your Gold, Diamonds & Gemstones with the World's Finest Magnetic Flip-Top Jewellery Boxes
          </p>

          {/* WhatsApp Contact */}
          <div className="flex justify-center mb-8">
            <WhatsAppButton message="Hi! I want to order ALFA GOLD BOX luxury jewellery boxes." />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/product/alfa-gold-classic"
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-xl shadow-amber-400/20 transform hover:scale-105"
            >
              ✨ Experience 3D Box Unboxing
            </Link>

            <a
              href="#products"
              className="px-8 py-4 border border-pure-white/40 text-pure-white hover:bg-pure-white/10 font-bold text-sm rounded-xl transition-all"
            >
              Explore Collection
            </a>
          </div>

          {/* Feature Badges */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-pure-white/10 rounded-full backdrop-blur-sm">
                  <FaMedal className="text-2xl text-amber-400" />
                </div>
              </div>
              <p className="text-xl font-bold text-pure-white">24K Gold</p>
              <p className="text-xs text-pure-white/60">Foil Stamp</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-pure-white/10 rounded-full backdrop-blur-sm">
                  <FaShieldAlt className="text-2xl text-amber-400" />
                </div>
              </div>
              <p className="text-xl font-bold text-pure-white">Velvet</p>
              <p className="text-xs text-pure-white/60">Protection</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <div className="p-3 bg-pure-white/10 rounded-full backdrop-blur-sm">
                  <FaShippingFast className="text-2xl text-amber-400" />
                </div>
              </div>
              <p className="text-xl font-bold text-pure-white">Express</p>
              <p className="text-xs text-pure-white/60">Free Delivery</p>
            </div>
          </div>
        </div>
      </section>

      <PurchaseModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Hero;