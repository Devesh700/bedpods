import { Link } from "react-router-dom";
import logoImg from "@/assets/bepods-logo.png.jpeg";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-pure-black/95 backdrop-blur-md border-b border-pure-white/10">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logoImg} alt="BEPODS" className="h-14 w-auto" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-pure-white hover:text-pure-white/80 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-pure-white hover:text-pure-white/80 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-pure-white hover:text-pure-white/80 transition-colors">
              About
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-xs text-pure-white/60 hidden sm:block">
              Free Shipping • 6 Months Warranty
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;