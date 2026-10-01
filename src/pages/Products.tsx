import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/staticData";

const Products = () => {
  return (
    <div className="min-h-screen bg-pure-white">
      <Header />

      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-secondary to-pure-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pure-black text-pure-white">
                ALFA GOLD Catalog
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-pure-black mt-3 mb-4 animate-fade-in">
                Luxury Jewellery Boxes
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-200">
                Inspect each box in full interactive 3D unboxing mode
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {products.map((product, index) => (
                <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>

            <div className="mt-16 bg-pure-black text-pure-white rounded-3xl p-8 max-w-4xl mx-auto shadow-strong">
              <h2 className="text-3xl font-bold text-center mb-6">
                Direct Manufacturer Prices
              </h2>
              <p className="text-center text-pure-white/80 mb-8">
                Every ALFA GOLD BOX is backed by our 1-Year Quality Guarantee & Free Shipping across India.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2 text-amber-400">75%</p>
                  <p className="text-pure-white/60">Off Retail Price</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2 text-amber-400">5000+</p>
                  <p className="text-pure-white/60">Boxes Delivered</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2 text-amber-400">100%</p>
                  <p className="text-pure-white/60">Authentic ALFA GOLD</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Products;