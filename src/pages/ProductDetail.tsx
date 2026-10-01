import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Product3DViewer from "@/components/Product3DViewer";
import ProductFilters from "@/components/ProductFilters";
import ImageDetailing from "@/components/ImageDetailing";
import PurchaseModal from "@/components/PurchaseModal";
import { PRODUCT_CATALOG, ColorOption, ProductDetailItem } from "@/lib/productData";
import { Star, ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Current active product
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailItem>(PRODUCT_CATALOG[0]);

  // Current active color option
  const [selectedColor, setSelectedColor] = useState<ColorOption>(PRODUCT_CATALOG[0].colors[0]);

  // 3D Box Open / Close state
  const [isBoxOpen, setIsBoxOpen] = useState<boolean>(true);

  // Purchase Modal state
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);

  // Sync selected product from URL param /product/:id
  useEffect(() => {
    if (id) {
      const match = PRODUCT_CATALOG.find((p) => p.id === id);
      if (match) {
        setSelectedProduct(match);
        setSelectedColor(match.colors[0]);
        setIsBoxOpen(true);
      }
    }
  }, [id]);

  // Handle product model switch
  const handleSelectProduct = (product: ProductDetailItem) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors[0]);
    setIsBoxOpen(true);
  };

  return (
    <div className="min-h-screen bg-pure-white text-pure-black font-sans selection:bg-pure-black selection:text-pure-white">
      {/* Navigation Header */}
      <Header />

      <main className="pt-24 pb-20">
        {/* Top Hero Section: Title + Price + 3D Canvas Showcase */}
        <section className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-6">
            <a href="/" className="hover:text-pure-black transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-pure-black transition-colors">Jewellery Boxes</a>
            <span>/</span>
            <span className="text-pure-black font-bold">{selectedProduct.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: 3D VIEWER CANVAS (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <Product3DViewer
                product={selectedProduct}
                selectedColor={selectedColor}
              />
            </div>

            {/* RIGHT COLUMN: PRODUCT INFO & CONFIGURATOR FILTERS (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Product Badge & Ratings */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pure-black text-pure-white">
                    {selectedProduct.badge}
                  </span>
                  <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full border border-granite/10 text-xs font-semibold text-pure-black">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-muted-foreground">({selectedProduct.reviewCount} reviews)</span>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold text-pure-black tracking-tight">
                  {selectedProduct.title}
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  {selectedProduct.subtitle}
                </p>
              </div>

              {/* Price & Savings Tag */}
              <div className="flex items-baseline gap-3 p-5 rounded-2xl bg-secondary border border-granite/10">
                <span className="text-3xl font-black text-pure-black">₹{selectedProduct.price}</span>
                <span className="text-base text-muted-foreground line-through font-semibold">
                  ₹{selectedProduct.originalPrice}
                </span>
                <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Save 75% Off
                </span>
              </div>

              {/* Interactive 3D Configurator Filters */}
              <ProductFilters
                selectedProduct={selectedProduct}
                onSelectProduct={handleSelectProduct}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />

              {/* Purchase Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setIsPurchaseModalOpen(true)}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-pure-black hover:bg-granite text-pure-white font-extrabold text-base shadow-strong transition-all duration-300 transform active:scale-98"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Order Now • ₹{selectedProduct.price} (Cash on Delivery)</span>
                </button>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground font-medium">
                  <div className="p-2.5 rounded-xl bg-secondary border border-granite/10 flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-pure-black" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary border border-granite/10 flex flex-col items-center gap-1">
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                    <span>7 Days Return</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-secondary border border-granite/10 flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>1 Year Warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: HD Image Detailing & Spec Breakdown */}
        <section className="container mx-auto px-4 md:px-6 mt-20">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-pure-black border border-granite/10">
              ALFA GOLD Engineering & Craftsmanship
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-pure-black">
              Crafted for Precious Gems & Gold
            </h2>
            <p className="text-muted-foreground text-sm">
              Use the interactive lens zoom to inspect gold foil hot-stamping, micro-velvet lining, and magnetic clasps.
            </p>
          </div>

          <ImageDetailing product={selectedProduct} />
        </section>
      </main>

      {/* Order Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        productName={selectedProduct.title}
        price={selectedProduct.price}
        originalPrice={selectedProduct.originalPrice}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductDetail;
