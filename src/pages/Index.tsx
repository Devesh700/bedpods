import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { products } from "@/lib/staticData";

const Index = () => {
  return (
    <div className="min-h-screen bg-pure-white">
      <Header />
      <main>
        <Hero />

        <section id="products" className="py-20 bg-gradient-to-b from-pure-white to-secondary">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pure-black text-pure-white">
                Luxury Jewellery Packaging
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-pure-black mt-3 mb-4">
                The ALFA GOLD BOX Collection
              </h2>
              <p className="text-lg text-muted-foreground">
                Click any product to inspect in full interactive 3D WebGL unboxing mode
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {products.map((product, index) => (
                <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Features />

        <section className="py-20 bg-pure-black text-pure-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Exclusive ALFA GOLD Warranty
            </h2>
            <p className="text-xl mb-8 text-pure-white/80">
              Crafted with reinforced rigid core & 24K foil hot-stamped branding
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Authentic ALFA GOLD</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>1 Year Quality Guarantee</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;