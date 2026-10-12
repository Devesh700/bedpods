import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-black/95 backdrop-blur-md border-b border-pure-white/10">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-black text-amber-400 tracking-wider">
              ALFA GOLD BOX
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-pure-white hover:text-amber-400 transition-colors text-sm font-medium">
              Home
            </Link>
            <Link to="/products" className="text-pure-white hover:text-amber-400 transition-colors text-sm font-medium">
              Jewellery Boxes
            </Link>
            <Link
              to="/product/alfa-gold-classic"
              className="text-amber-400 font-semibold hover:text-amber-300 transition-colors flex items-center gap-1.5 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 text-xs"
            >
              <span>✨ 3D Unboxing Experience</span>
            </Link>
            <Link to="/about" className="text-pure-white hover:text-amber-400 transition-colors text-sm font-medium">
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs text-pure-white/70 hidden sm:block">
              Free Express Shipping • 1 Year Warranty
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;