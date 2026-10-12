import React, { useState, useEffect, useCallback } from "react";
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
    showDimensions: false,
    lightingPreset: "boutique",
    goldEmbossing: true,
    embossText: "ALFA GOLD",
  });

  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Responsive & Adjustable Sidebar Width (for screens >= 768px)
  // Default to 340px on tablets (768px-1024px) and 380px on desktop
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024 ? 330 : 380;
    }
    return 360;
  });

  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Handle Drag to Resize (Mouse and Touch supported for tablets/iPads)
  const handleResize = useCallback(
    (clientX: number) => {
      const minW = 260; // Minimum width
      const maxW = Math.min(560, window.innerWidth * 0.58); // Maximum width capped proportionally
      const clamped = Math.max(minW, Math.min(maxW, clientX));
      setSidebarWidth(clamped);
    },
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      handleResize(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizing || e.touches.length === 0) return;
      handleResize(e.touches[0].clientX);
    };

    const handleStopResize = () => {
      setIsResizing(false);
      document.body.style.cursor = "auto";
      document.body.style.userSelect = "auto";
    };

    if (isResizing) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleStopResize);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleStopResize);
      window.addEventListener("touchcancel", handleStopResize);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleStopResize);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleStopResize);
      window.removeEventListener("touchcancel", handleStopResize);
    };
  }, [isResizing, handleResize]);

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
      <header className="h-12 bg-pure-black/95 border-b border-white/10 px-3 md:px-4 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-2.5 md:gap-3">
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
              Mall Kiosk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 text-xs font-medium">
          {/* Quick Width presets for tablet / desktop */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-[11px] text-white/60">
            <span className="text-[10px] uppercase tracking-wider text-white/40 mr-1">Width:</span>
            <button
              onClick={() => setSidebarWidth(280)}
              className={`px-1.5 py-0.5 rounded transition-all ${
                sidebarWidth <= 300 ? "text-amber-300 font-bold bg-white/10" : "hover:text-white"
              }`}
              title="Compact Sidebar"
            >
              280
            </button>
            <button
              onClick={() => setSidebarWidth(350)}
              className={`px-1.5 py-0.5 rounded transition-all ${
                sidebarWidth > 300 && sidebarWidth < 420
                  ? "text-amber-300 font-bold bg-white/10"
                  : "hover:text-white"
              }`}
              title="Standard Sidebar"
            >
              350
            </button>
            <button
              onClick={() => setSidebarWidth(440)}
              className={`px-1.5 py-0.5 rounded transition-all ${
                sidebarWidth >= 420 ? "text-amber-300 font-bold bg-white/10" : "hover:text-white"
              }`}
              title="Wide Sidebar"
            >
              440
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-white/70 text-xs">
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
      {/* MAIN SCREEN: RESPONSIVE SIDEBAR + ADJUSTABLE DIVIDER + 3D VIEW */}
      {/* Starting at md (>=768px): clean horizontal side-by-side layout  */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col md:flex-row w-full h-[calc(100vh-48px)] overflow-hidden relative">
        {/* LEFT: ATTRIBUTES CONFIGURATOR SIDEBAR (ADJUSTABLE WIDTH) */}
        <div
          className="w-full md:h-full flex-shrink-0 overflow-hidden relative"
          style={{
            // On screens >= 768px (tablets and above), apply adjustable width
            width: typeof window !== "undefined" && window.innerWidth >= 768 ? `${sidebarWidth}px` : undefined,
            minWidth: typeof window !== "undefined" && window.innerWidth >= 768 ? "260px" : undefined,
            maxWidth: typeof window !== "undefined" && window.innerWidth >= 768 ? "560px" : undefined,
          }}
        >
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
        </div>

        {/* INTERACTIVE DRAGGABLE RESIZER DIVIDER (FOR SCREENS >= 768px) */}
        <div
          onMouseDown={() => setIsResizing(true)}
          onTouchStart={() => setIsResizing(true)}
          onDoubleClick={() => setSidebarWidth(350)}
          className="hidden md:flex items-center justify-center w-3 h-full cursor-col-resize group hover:bg-amber-400/20 active:bg-amber-400/30 transition-colors z-30 flex-shrink-0 relative select-none"
          title="Drag to resize sidebar width (double click to reset)"
        >
          {/* Vertical dividing line */}
          <div className="w-[1.5px] h-full bg-white/10 group-hover:bg-amber-400/80 group-active:bg-amber-400 transition-colors" />

          {/* Centered Pill Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-11 rounded-full bg-[#12151c] border border-white/20 group-hover:border-amber-400/80 flex items-center justify-center gap-0.5 shadow-xl transition-all">
            <div className="w-[1px] h-3.5 bg-white/40 group-hover:bg-amber-300" />
            <div className="w-[1px] h-3.5 bg-white/40 group-hover:bg-amber-300" />
          </div>
        </div>

        {/* RIGHT SCREEN: 3D COMPLETE 360-DEGREE ACTIONABLE VIEW */}
        <section className="flex-1 h-full min-w-0 relative overflow-hidden">
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
