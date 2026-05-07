import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import airpodsPro2 from "@/assets/airpods-pro-2.png";
import airpods4 from "@/assets/airpods-4.png";

const Products = () => {
  const products = [
    {
      title: "AirPods Pro 2 (2nd Gen)",
      price: "1,100",
      originalPrice: "24,900",
      image: airpodsPro2,
      images: [airpodsPro2, airpodsPro2, airpodsPro2], // Multiple views for carousel
      badge: "Best Seller",
      features: [
        "Active Noise Cancellation",
        "Adaptive Transparency",
        "Personalized Spatial Audio",
        "MagSafe Charging Case",
        "Up to 6h listening time",
        "Precision Finding with Find My"
      ]
    },
    {
      title: "AirPods 4 (4th Gen)",
      price: "1,799",
      originalPrice: "12,900",
      image: airpods4,
      images: [airpods4, airpods4, airpods4], // Multiple views for carousel
      badge: "New Arrival",
      features: [
        "Active Noise Cancellation",
        "USB-C Charging Case",
        "Personalized Spatial Audio",
        "Adaptive Audio",
        "Up to 5h listening time",
        "IP54 dust & water resistance"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-pure-white">
      <Header />
      
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-b from-secondary to-pure-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-pure-black mb-4 animate-fade-in">
                Our Products
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-200">
                Premium Apple AirPods at prices that will amaze you
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {products.map((product, index) => (
                <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
            
            <div className="mt-16 bg-pure-black text-pure-white rounded-2xl p-8 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-6">
                Limited Stock Available
              </h2>
              <p className="text-center text-pure-white/80 mb-8">
                Our products are in high demand due to our incredible prices. Order now to secure yours!
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">95%</p>
                  <p className="text-pure-white/60">Off Retail Price</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">1000+</p>
                  <p className="text-pure-white/60">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">100%</p>
                  <p className="text-pure-white/60">Authentic Products</p>
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