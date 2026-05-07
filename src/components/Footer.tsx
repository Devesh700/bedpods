import logoImg from "@/assets/bepods-logo.png";

const Footer = () => {
  return (
    <footer className="bg-pure-black text-pure-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img src={logoImg} alt="BEPODS" className="h-8 w-auto mb-4" />
            <p className="text-pure-white/60">
              Feel Music with BEPODS
            </p>
            <p className="text-sm text-pure-white/40 mt-2">
              Premium Apple products at the best prices
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-pure-white/60 hover:text-pure-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-pure-white/60 hover:text-pure-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="text-pure-white/60 hover:text-pure-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-2 text-pure-white/60">
              <li>✓ Free Shipping Pan India</li>
              <li>✓ 6 Months Warranty</li>
              <li>✓ Easy Returns</li>
              <li>✓ Secure Payment</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-pure-white/10 mt-8 pt-8 text-center">
          <p className="text-pure-white/40 text-sm">
            © 2024 BEPODS. All rights reserved. | Premium Quality Guaranteed
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;