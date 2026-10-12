import React, { useState, useEffect } from "react";
import {
  BoxType,
  Dimensions,
  ShowcaseState,
  SurfaceFinish,
  LUXURY_COLORS,
  DIMENSION_LIMITS,
} from "@/components/showcase/types";
import ShowcaseSidebar from "@/components/showcase/ShowcaseSidebar";
import MallShowcaseViewer from "@/components/showcase/MallShowcaseViewer";
import ShowcaseInquiryModal from "@/components/showcase/ShowcaseInquiryModal";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const MallShowcase: React.FC = () => {
  // Mall Showcase Central State
  const [state, setState] = useState<ShowcaseState>({
    boxType: "cuboid",
    dimensions: DIMENSION_LIMITS.cuboid.default,
    selectedColor: LUXURY_COLORS[0],
    customHex: LUXURY_COLORS[0].hex,
    surfaceFinish: "matte",
    isLidRemoved: false,
    isFlapOpen: false,
    isClothPocketOpen: false,
    autoRotate: false,
    showDimensions: false, // Dimension numbers not shown inside 3D view
    lightingPreset: "boutique",
    goldEmbossing: true,
    embossText: "ALFA GOLD",
  });

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync fullscreen state with DOM API
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Change Box Type
  const handleBoxTypeChange = (newType: BoxType) => {
    setState((prev) => {
      let defaultFinish: SurfaceFinish = "matte";
      if (newType === "cloth-packet") defaultFinish = "velvet";
      else if (newType === "cuboid") defaultFinish = "matte";
      else if (newType === "paper-packet") defaultFinish = "matte";

      return {
        ...prev,
        boxType: newType,
        dimensions: DIMENSION_LIMITS[newType].default,
        surfaceFinish: defaultFinish,
        isLidRemoved: false,
        isFlapOpen: false,
        isClothPocketOpen: false,
      };
    });
  };

  // Toggle Action for Cuboid Box (remove / replace lid)
  const handleToggleAction = () => {
    setState((prev) => ({
      ...prev,
      isLidRemoved: !prev.isLidRemoved,
    }));
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-[#07080a] overflow-hidden select-none font-sans">
      {/* ============================================================== */}
      {/* SLIM TOP SHOWCASE NAVIGATION BAR                               */}
      {/* ============================================================== */}
      <header className="h-12 bg-pure-black/95 border-b border-white/10 px-4 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Catalog</span>
          </Link>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider text-amber-400">
              ALFA GOLD BOX
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Mall Kiosk 360°
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="hidden md:flex items-center gap-4 text-white/70 text-xs">
            <Link to="/store" className="hover:text-amber-400 transition-colors">
              Store
            </Link>
            <Link to="/products" className="hover:text-amber-400 transition-colors">
              Jewellery Boxes
            </Link>
            <Link to="/about" className="hover:text-amber-400 transition-colors">
              About
            </Link>
          </div>

          <button
            onClick={() => setIsInquiryModalOpen(true)}
            className="px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-pure-black font-bold text-xs transition-all shadow-md"
          >
            Order Spec
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MAIN SCREEN: SIDEBAR (LEFT) + 3D 360° SHOWCASE (RIGHT)          */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-48px)] overflow-hidden">
        {/* LEFT: ATTRIBUTES CONFIGURATOR SIDEBAR */}
        <ShowcaseSidebar
          state={state}
          onChangeBoxType={handleBoxTypeChange}
          onChangeDimensions={(dims) => setState((prev) => ({ ...prev, dimensions: dims }))}
          onSelectColor={(color) =>
            setState((prev) => ({
              ...prev,
              selectedColor: color,
              customHex: color.hex,
            }))
          }
          onChangeCustomHex={(hex) =>
            setState((prev) => ({
              ...prev,
              customHex: hex,
              selectedColor: {
                id: "custom",
                name: "Custom Hex Tint",
                hex,
                roughness: 0.4,
                metalness: 0.2,
              },
            }))
          }
          onChangeSurfaceFinish={(finish) =>
            setState((prev) => ({ ...prev, surfaceFinish: finish }))
          }
          onToggleAction={handleToggleAction}
          onToggleGoldEmbossing={() =>
            setState((prev) => ({ ...prev, goldEmbossing: !prev.goldEmbossing }))
          }
          onOpenOrderModal={() => setIsInquiryModalOpen(true)}
        />

        {/* RIGHT SCREEN: 3D COMPLETE 360-DEGREE ACTIONABLE VIEW */}
        <section className="flex-1 h-full relative overflow-hidden">
          <MallShowcaseViewer
            state={state}
            onToggleAction={handleToggleAction}
            onToggleAutoRotate={() =>
              setState((prev) => ({ ...prev, autoRotate: !prev.autoRotate }))
            }
            onChangeLighting={(preset) =>
              setState((prev) => ({ ...prev, lightingPreset: preset }))
            }
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        </section>
      </main>

      {/* MALL SPECIFICATION INQUIRY MODAL */}
      <ShowcaseInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        state={state}
      />
    </div>
  );
};

export default MallShowcase;
