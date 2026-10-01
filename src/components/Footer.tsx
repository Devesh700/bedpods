const Footer = () => {
  return (
    <footer className="bg-pure-black text-pure-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-2xl font-black text-amber-400 block mb-3">
              ALFA GOLD BOX
            </span>
            <p className="text-pure-white/70 text-sm">
              Luxury Jewellery Packaging & Storage Vaults
            </p>
            <p className="text-xs text-pure-white/40 mt-2">
              Signature 24K Gold foil inner branding & magnetic flip-top boxes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-amber-400 mb-4 text-sm uppercase tracking-wider">Quick Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-pure-white/60 hover:text-amber-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-pure-white/60 hover:text-amber-400 transition-colors">
                  Jewellery Boxes
                </a>
              </li>
              <li>
                <a href="/product/alfa-gold-classic" className="text-pure-white/60 hover:text-amber-400 transition-colors">
                  3D Unboxing Experience
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-amber-400 mb-4 text-sm uppercase tracking-wider">Guarantee</h3>
            <ul className="space-y-2 text-sm text-pure-white/60">
              <li>✓ Free Express Shipping Pan India</li>
              <li>✓ 1 Year Quality Warranty</li>
              <li>✓ 7 Days Easy Returns</li>
              <li>✓ Cash on Delivery Available</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pure-white/10 mt-8 pt-8 text-center">
          <p className="text-pure-white/40 text-xs">
            © 2026 ALFA GOLD BOX. All rights reserved. | Luxury Packaging Redefined
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;