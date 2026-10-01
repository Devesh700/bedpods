import React from "react";
import { ColorOption, PRODUCT_CATALOG, ProductDetailItem } from "@/lib/productData";
import { Check, SlidersHorizontal, ShieldCheck, Sparkles } from "lucide-react";

interface ProductFiltersProps {
  selectedProduct: ProductDetailItem;
  onSelectProduct: (product: ProductDetailItem) => void;
  selectedColor: ColorOption;
  onSelectColor: (color: ColorOption) => void;
  isBoxOpen: boolean;
  onToggleBox: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedProduct,
  onSelectProduct,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <div className="bg-pure-white border border-granite/10 rounded-3xl p-6 shadow-strong space-y-6">
      {/* Header Title */}
      <div className="flex items-center justify-between pb-4 border-b border-granite/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-pure-black" />
          <h3 className="text-base font-bold text-pure-black">3D Configurator</h3>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-pure-black border border-granite/10">
          Real-time View
        </span>
      </div>

      {/* 1. PRODUCT TYPE FILTER */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Select Product Model
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRODUCT_CATALOG.map((item) => {
            const isSelected = item.id === selectedProduct.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectProduct(item)}
                className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all duration-200 relative ${
                  isSelected
                    ? "bg-pure-black text-pure-white border-pure-black shadow-md"
                    : "bg-secondary/50 border-granite/10 text-pure-black hover:border-granite/30"
                }`}
              >
                <span className="text-xs font-bold line-clamp-1">{item.title}</span>
                <span className={`text-[11px] font-semibold mt-1 ${isSelected ? "text-pure-white/80" : "text-muted-foreground"}`}>
                  ₹{item.price}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. COLOR PALETTE FILTER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Color Finish
          </label>
          <span className="text-xs font-semibold text-pure-black">
            {selectedColor.name}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {selectedProduct.colors.map((color) => {
            const isSelected = color.id === selectedColor.id;
            return (
              <button
                key={color.id}
                onClick={() => onSelectColor(color)}
                className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 transform active:scale-95 shadow-sm border border-granite/20 ${
                  isSelected
                    ? "ring-2 ring-pure-black ring-offset-2 scale-110"
                    : "hover:scale-105 opacity-80 hover:opacity-100"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {isSelected && (
                  <Check
                    className={`w-4 h-4 ${
                      color.id === "white" || color.id === "rosegold"
                        ? "text-pure-black font-bold"
                        : "text-pure-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. VALUE PROPOSITION */}
      <div className="pt-2 flex items-center justify-between text-muted-foreground text-xs font-medium border-t border-granite/10">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>1 Year Warranty</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>100% Authentic</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
