import { useState } from "react";
import PurchaseModal from "./PurchaseModal";
import ProductImageCarousel from "./ProductImageCarousel";
import WhatsAppButton from "./WhatsAppButton";

interface ProductCardProps {
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  images?: string[];
  features: string[];
  badge?: string;
}

const ProductCard = ({ title, price, originalPrice, image, images, features, badge }: ProductCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const productImages = images || [image];

  return (
    <>
      <div className="group relative bg-pure-white rounded-2xl overflow-hidden shadow-strong hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2">
        {badge && (
          <div className="absolute top-4 right-4 z-10 bg-pure-black text-pure-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
            {badge}
          </div>
        )}
        
        <div className="aspect-square bg-gradient-to-br from-secondary to-pure-white p-8 flex items-center justify-center overflow-hidden">
          <ProductImageCarousel images={productImages} title={title} />
        </div>
        
        <div className="p-6 space-y-4">
          <h3 className="text-2xl font-bold text-pure-black">{title}</h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-pure-black">₹{price}</span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">₹{originalPrice}</span>
            )}
          </div>
          
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-granite">
                <svg className="w-4 h-4 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowModal(true)}
              className="flex-1 py-3 bg-pure-black text-pure-white font-semibold rounded-lg hover:bg-granite transition-colors transform hover:scale-105 duration-200"
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
          
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="text-xs text-muted-foreground">✓ Free Shipping</span>
            <span className="text-xs text-muted-foreground">✓ 6 Months Warranty</span>
          </div>
        </div>
      </div>
      
      <PurchaseModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        productName={title}
        price = {price}
        originalPrice = {originalPrice}
      />
    </>
  );
};

export default ProductCard;