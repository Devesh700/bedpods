import { useState } from "react";
import { Link } from "react-router-dom";
import PurchaseModal from "./PurchaseModal";
import ProductImageCarousel from "./ProductImageCarousel";
import WhatsAppButton from "./WhatsAppButton";

interface ProductCardProps {
  id?: string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  features: string[];
  badge?: string;
}

const ProductCard = ({
  id = "alfa-gold-classic",
  title,
  price,
  originalPrice,
  image,
  images,
  features,
  badge,
}: ProductCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const productImages = images || [image];
  const productDetailPath = `/product/${id}`;

  return (
    <>
      <div className="group relative bg-pure-white rounded-2xl overflow-hidden shadow-strong hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 flex flex-col justify-between">
        {badge && (
          <div className="absolute top-4 right-4 z-10 bg-pure-black text-pure-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
            {badge}
          </div>
        )}

        {/* Clicking Image Navigates directly to 3D Detail View */}
        <Link to={productDetailPath} className="block aspect-square bg-gradient-to-br from-secondary to-pure-white p-8 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <ProductImageCarousel images={productImages} title={title} />
        </Link>

        <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <Link to={productDetailPath} className="block hover:underline">
              <h3 className="text-xl font-bold text-pure-black">{title}</h3>
            </Link>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-pure-black">₹{price}</span>
              {originalPrice && (
                <span className="text-lg text-muted-foreground line-through">₹{originalPrice}</span>
              )}
            </div>

            <ul className="space-y-2 pt-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-xs text-granite">
                  <svg className="w-4 h-4 mr-2 text-pure-black flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-3">
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(true)}
                className="flex-1 py-3 bg-pure-black text-pure-white font-semibold text-xs rounded-xl hover:bg-granite transition-colors transform hover:scale-105 duration-200"
              >
                Buy Now
              </button>
              <WhatsAppButton
                phoneNumber="+916306201043"
                message={`Hi! I want to order ${title} for ₹${price}`}
                className="!px-4 !py-3"
                showText={false}
              />
            </div>

            {/* Direct 3D Detail View Link */}
            <Link
              to={productDetailPath}
              className="w-full py-2.5 bg-secondary border border-granite/20 hover:bg-pure-black hover:text-pure-white text-pure-black font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 transition-all"
            >
              <span>✨ View 3D Box Unboxing & Details</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="text-[11px] text-muted-foreground">✓ Free Express Shipping</span>
            <span className="text-[11px] text-muted-foreground">✓ 1 Year Warranty</span>
          </div>
        </div>
      </div>

      <PurchaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        productName={title}
        price={price}
        originalPrice={originalPrice}
      />
    </>
  );
};

export default ProductCard;