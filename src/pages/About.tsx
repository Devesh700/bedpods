import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-pure-white">
      <Header />
      
      <main className="pt-20">
        <section className="py-20 bg-gradient-premium text-pure-white">
          <div className="container mx-auto px-6">
            <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 animate-fade-in">
              About BEPODS
            </h1>
            <p className="text-xl text-center text-pure-white/80 max-w-3xl mx-auto animate-fade-in animation-delay-200">
              Your trusted destination for premium Apple products at revolutionary prices
            </p>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                  <h2 className="text-4xl font-bold text-pure-black">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    At BEPODS, we believe everyone deserves to experience premium audio quality without breaking the bank. We specialize in bringing you authentic Apple products at prices that make luxury accessible.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our direct sourcing and efficient operations allow us to offer genuine Apple AirPods at up to 95% less than retail prices, without compromising on quality or authenticity.
                  </p>
                </div>
                
                <div className="bg-gradient-black rounded-2xl p-8 text-pure-white">
                  <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <span className="text-2xl mr-3">✓</span>
                      <div>
                        <strong>100% Authentic Products</strong>
                        <p className="text-pure-white/80 text-sm mt-1">Every product is genuine Apple, sourced directly</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-2xl mr-3">✓</span>
                      <div>
                        <strong>Unbeatable Prices</strong>
                        <p className="text-pure-white/80 text-sm mt-1">Premium quality at prices that surprise you</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-2xl mr-3">✓</span>
                      <div>
                        <strong>Complete Peace of Mind</strong>
                        <p className="text-pure-white/80 text-sm mt-1">6 months warranty on all products</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-secondary rounded-2xl p-8 mb-16">
                <h2 className="text-3xl font-bold text-pure-black mb-8 text-center">Our Promise</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🚚</div>
                    <h3 className="text-xl font-semibold text-pure-black mb-2">Free Shipping</h3>
                    <p className="text-muted-foreground">Pan India delivery at no extra cost</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">🛡️</div>
                    <h3 className="text-xl font-semibold text-pure-black mb-2">6 Months Warranty</h3>
                    <p className="text-muted-foreground">Comprehensive coverage for your peace of mind</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-4">💯</div>
                    <h3 className="text-xl font-semibold text-pure-black mb-2">Quality Assured</h3>
                    <p className="text-muted-foreground">Every product tested and verified</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-3xl font-bold text-pure-black mb-6">
                  Ready to Experience Premium Audio?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of satisfied customers who've made the smart choice
                </p>
                <Link 
                  to="/"
                  className="inline-block px-8 py-4 bg-pure-black text-pure-white font-semibold rounded-lg hover:bg-granite transition-colors transform hover:scale-105"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;