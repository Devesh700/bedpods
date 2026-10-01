import React, { useState } from "react";
import { Hotspot, ProductDetailItem } from "@/lib/productData";
import { ZoomIn, Info, Sparkles, CheckCircle2 } from "lucide-react";

interface ImageDetailingProps {
  product: ProductDetailItem;
}

export const ImageDetailing: React.FC<ImageDetailingProps> = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<"features" | "specs">("features");

  const currentImage = product.images[selectedImageIndex] || product.images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: 2D Gallery & Lens Zoom (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Image Container with Hotspots & Lens Zoom */}
        <div
          className="relative w-full h-[400px] md:h-[480px] bg-secondary/60 rounded-3xl overflow-hidden border border-granite/10 flex items-center justify-center p-8 cursor-crosshair group select-none shadow-strong"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => {
            setIsZoomed(false);
            setActiveHotspot(null);
          }}
          onMouseMove={handleMouseMove}
        >
          {/* Base Product Image */}
          <img
            src={currentImage}
            alt={product.title}
            className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
              isZoomed ? "scale-110" : "scale-100"
            }`}
          />

          {/* Zoom Lens Magnifier Window */}
          {isZoomed && (
            <div
              className="absolute pointer-events-none w-44 h-44 rounded-full border-2 border-pure-black shadow-2xl overflow-hidden bg-pure-white z-30"
              style={{
                left: `calc(${zoomPos.x}% - 88px)`,
                top: `calc(${zoomPos.y}% - 88px)`,
                backgroundImage: `url(${currentImage})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "300%",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          {/* Interactive Feature Hotspots */}
          {product.hotspots.map((hotspot) => {
            const isActive = activeHotspot?.id === hotspot.id;
            return (
              <div
                key={hotspot.id}
                className="absolute z-20"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              >
                <button
                  onClick={() => setActiveHotspot(isActive ? null : hotspot)}
                  onMouseEnter={() => setActiveHotspot(hotspot)}
                  className="relative group/pin flex items-center justify-center"
                >
                  <span className="absolute w-7 h-7 rounded-full bg-pure-black/20 animate-ping" />
                  <span className="relative w-5 h-5 rounded-full bg-pure-black border-2 border-pure-white text-pure-white font-bold text-[10px] flex items-center justify-center shadow-lg group-hover/pin:scale-125 transition-transform">
                    +
                  </span>
                </button>

                {/* Hotspot Popup Tooltip */}
                {isActive && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 bg-pure-black text-pure-white p-4 rounded-2xl border border-pure-black shadow-2xl z-40 animate-fade-in">
                    <div className="flex items-center gap-2 mb-1 text-pure-white font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{hotspot.title}</span>
                    </div>
                    <p className="text-[11px] text-pure-white/80 leading-relaxed">
                      {hotspot.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Lens Zoom Hint Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-pure-white px-3 py-1.5 rounded-full text-xs text-pure-black border border-granite/10 shadow-sm pointer-events-none font-medium">
            <ZoomIn className="w-3.5 h-3.5 text-pure-black" />
            <span>Hover to Zoom Detail</span>
          </div>
        </div>

        {/* Thumbnail Selector Row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {product.images.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`w-20 h-20 rounded-2xl bg-secondary border-2 p-2 flex-shrink-0 transition-all ${
                selectedImageIndex === idx
                  ? "border-pure-black shadow-md scale-105"
                  : "border-granite/10 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={imgUrl}
                alt={`${product.title} view ${idx + 1}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Tech Specs & Feature Breakdown Tabs (5 cols) */}
      <div className="lg:col-span-5 bg-pure-white border border-granite/10 rounded-3xl p-6 shadow-strong space-y-6">
        {/* Tab Toggle Buttons */}
        <div className="flex items-center p-1 bg-secondary rounded-2xl border border-granite/10">
          <button
            onClick={() => setActiveTab("features")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "features"
                ? "bg-pure-black text-pure-white shadow-md"
                : "text-muted-foreground hover:text-pure-black"
            }`}
          >
            Key Highlights
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === "specs"
                ? "bg-pure-black text-pure-white shadow-md"
                : "text-muted-foreground hover:text-pure-black"
            }`}
          >
            Technical Specs
          </button>
        </div>

        {/* TAB 1: Key Features */}
        {activeTab === "features" && (
          <div className="space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Acoustic Architecture & Design
            </h4>
            <div className="space-y-2.5">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/50 border border-granite/10"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-pure-black font-medium leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Tech Specs Matrix */}
        {activeTab === "specs" && (
          <div className="space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Hardware Specifications
            </h4>
            <div className="divide-y divide-granite/10 rounded-2xl bg-secondary/50 border border-granite/10 overflow-hidden">
              {product.specs.map((spec, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 text-xs">
                  <span className="text-muted-foreground font-medium">{spec.label}</span>
                  <span className="text-pure-black font-bold text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guarantee Footer */}
        <div className="p-4 rounded-2xl bg-secondary border border-granite/10 text-pure-black text-xs flex items-center gap-3">
          <Info className="w-5 h-5 text-pure-black flex-shrink-0" />
          <span>
            Every unit is tested with high-precision audio calibrators prior to dispatch.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImageDetailing;
