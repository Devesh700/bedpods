import React from "react";
import {
  BoxType,
  Dimensions,
  ShowcaseState,
  SurfaceFinish,
  LUXURY_COLORS,
  DIMENSION_PRESETS,
  DIMENSION_LIMITS,
} from "./types";
import { Check } from "lucide-react";

interface ShowcaseSidebarProps {
  state: ShowcaseState;
  onChangeBoxType: (type: BoxType) => void;
  onChangeDimensions: (dims: Dimensions) => void;
  onSelectColor: (color: (typeof LUXURY_COLORS)[0]) => void;
  onChangeCustomHex: (hex: string) => void;
  onChangeSurfaceFinish: (finish: SurfaceFinish) => void;
  onToggleAction: () => void;
  onToggleGoldEmbossing: () => void;
  onOpenOrderModal: () => void;
}

export const ShowcaseSidebar: React.FC<ShowcaseSidebarProps> = ({
  state,
  onChangeBoxType,
  onChangeDimensions,
  onSelectColor,
  onChangeCustomHex,
  onChangeSurfaceFinish,
  onToggleAction,
  onToggleGoldEmbossing,
  onOpenOrderModal,
}) => {
  const limits = DIMENSION_LIMITS[state.boxType];
  const presets = DIMENSION_PRESETS[state.boxType];

  const handleDimensionChange = (key: keyof Dimensions, value: number) => {
    const clamped = Math.max(limits.min[key], Math.min(limits.max[key], value));
    onChangeDimensions({
      ...state.dimensions,
      [key]: clamped,
    });
  };

  return (
    <aside className="w-full lg:w-[400px] xl:w-[440px] h-full flex flex-col bg-[#0d0f14] border-r border-white/10 text-pure-white overflow-y-auto select-none custom-scrollbar">
      {/* ============================================================== */}
      {/* 1. HEADER / MALL SHOWCASE BRANDING                              */}
      {/* ============================================================== */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-b from-[#141822] to-[#0d0f14]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono tracking-widest text-amber-400 font-bold uppercase">
            MALL SHOWCASE
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
            3D Configurator
          </span>
        </div>
        <h1 className="text-2xl font-black text-pure-white tracking-tight">
          ALFA GOLD LUXE
        </h1>
        <p className="text-xs text-pure-white/60 mt-1">
          Customize paper color, dimensions, and removable lid.
        </p>
      </div>

      <div className="p-6 space-y-7 flex-1">
        {/* ============================================================== */}
        {/* 2. ATTRIBUTE 1: BOX TYPE SELECTOR (ONLY CUBOID SHOWN)          */}
        {/* ============================================================== */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold tracking-wider uppercase text-amber-400/90">
              1. Box Type
            </label>
            <span className="text-[11px] text-pure-white/40">Selected</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Box Type 1: Cuboid Jewellery Box */}
            <button
              onClick={() => onChangeBoxType("cuboid")}
              className="p-4 rounded-2xl border text-left transition-all duration-200 relative bg-amber-400/10 border-amber-400 text-pure-white shadow-lg shadow-amber-500/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-pure-white">
                  Cuboid Jewellery Box
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-pure-white/60 mt-1.5 leading-relaxed">
                Cuboid jewellery box with removable lid that separates completely and is placed just beside the box. Interior is hollow with nothing inside.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-amber-300 border border-white/5">
                  Hollow Interior
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-pure-white/70 border border-white/5">
                  Separable Lid
                </span>
              </div>
            </button>

            {/* Other box types commented out for now as requested:
            {/* Box Type 2: Paper Packet */}
            {/*
            <button
              onClick={() => onChangeBoxType("paper-packet")}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative group flex items-start gap-3.5 ${
                state.boxType === "paper-packet"
                  ? "bg-amber-400/10 border-amber-400 text-pure-white shadow-lg shadow-amber-500/10"
                  : "bg-white/[0.03] border-white/10 text-pure-white/70 hover:bg-white/[0.06] hover:border-white/20"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-pure-white">
                    Paper Packet of Jewellery
                  </span>
                </div>
                <p className="text-[11px] text-pure-white/60 mt-0.5">
                  Folded luxury cardstock envelope packet for pendants & coins.
                </p>
              </div>
            </button>
            */}

            {/* Box Type 3: Cloth Packet with Thread */}
            {/*
            <button
              onClick={() => onChangeBoxType("cloth-packet")}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative group flex items-start gap-3.5 ${
                state.boxType === "cloth-packet"
                  ? "bg-amber-400/10 border-amber-400 text-pure-white shadow-lg shadow-amber-500/10"
                  : "bg-white/[0.03] border-white/10 text-pure-white/70 hover:bg-white/[0.06] hover:border-white/20"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-pure-white">
                    Cloth Packet with Thread
                  </span>
                </div>
                <p className="text-[11px] text-pure-white/60 mt-0.5">
                  Luxury pouch with thread to open and close the pocket.
                </p>
              </div>
            </button>
            */}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. ATTRIBUTE 2: PAPER COLOR & MATERIAL FINISH                  */}
        {/* ============================================================== */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold tracking-wider uppercase text-amber-400/90">
              2. Paper Color
            </label>
            <span className="text-xs font-semibold text-pure-white/90">
              {state.selectedColor?.name || "Custom Color"}
            </span>
          </div>

          {/* Luxury Swatches Grid */}
          <div className="grid grid-cols-5 gap-2.5">
            {LUXURY_COLORS.map((color) => {
              const isSelected = state.selectedColor?.id === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => onSelectColor(color)}
                  className={`group relative flex flex-col items-center justify-center h-12 rounded-xl transition-all duration-200 transform active:scale-95 border ${
                    isSelected
                      ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0d0f14] scale-105 border-white"
                      : "border-white/10 hover:border-white/30 hover:scale-102"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && (
                    <Check
                      className={`w-4 h-4 drop-shadow-md ${
                        color.id === "pearl-white" || color.id === "rose-champagne"
                          ? "text-pure-black font-extrabold"
                          : "text-pure-white"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Hex Color Picker */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <input
              type="color"
              value={state.customHex}
              onChange={(e) => onChangeCustomHex(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <div className="flex-1">
              <span className="text-[11px] text-pure-white/60 block">Custom Hex Color</span>
              <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                {state.customHex}
              </span>
            </div>
          </div>

          {/* Surface Texture Finish */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-semibold text-pure-white/70 block">
              Surface Texture Finish
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(["matte", "metallic", "glossy", "textured", "velvet", "silk"] as SurfaceFinish[]).map(
                (finish) => {
                  const isSelected = state.surfaceFinish === finish;
                  return (
                    <button
                      key={finish}
                      onClick={() => onChangeSurfaceFinish(finish)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        isSelected
                          ? "bg-amber-400 text-pure-black font-bold border-amber-300 shadow-md"
                          : "bg-white/[0.03] border-white/10 text-pure-white/70 hover:bg-white/[0.06]"
                      }`}
                    >
                      {finish}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. ATTRIBUTE 3: DIMENSION ATTRIBUTES                           */}
        {/* ============================================================== */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold tracking-wider uppercase text-amber-400/90">
              3. Dimensions
            </label>
            <span className="text-[11px] font-mono text-amber-300">
              {state.dimensions.width} × {state.dimensions.height} × {state.dimensions.depth} mm
            </span>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-pure-white/60 block">Box Size Presets:</span>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onChangeDimensions(preset.dimensions)}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-left transition-all group"
                >
                  <span className="text-xs font-bold text-pure-white group-hover:text-amber-300 block line-clamp-1">
                    {preset.label}
                  </span>
                  <span className="text-[10px] font-mono text-pure-white/50 block mt-0.5">
                    {preset.dimensions.width}×{preset.dimensions.height}×{preset.dimensions.depth}mm
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Sliders */}
          <div className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            {/* WIDTH SLIDER */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-pure-white/70 font-medium">Width (X)</span>
                <span className="font-mono font-bold text-amber-300">
                  {state.dimensions.width} mm
                </span>
              </div>
              <input
                type="range"
                min={limits.min.width}
                max={limits.max.width}
                step={2}
                value={state.dimensions.width}
                onChange={(e) => handleDimensionChange("width", parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
            </div>

            {/* HEIGHT SLIDER */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-pure-white/70 font-medium">Height (Y)</span>
                <span className="font-mono font-bold text-amber-300">
                  {state.dimensions.height} mm
                </span>
              </div>
              <input
                type="range"
                min={limits.min.height}
                max={limits.max.height}
                step={2}
                value={state.dimensions.height}
                onChange={(e) => handleDimensionChange("height", parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
            </div>

            {/* DEPTH SLIDER */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-pure-white/70 font-medium">Depth (Z)</span>
                <span className="font-mono font-bold text-amber-300">
                  {state.dimensions.depth} mm
                </span>
              </div>
              <input
                type="range"
                min={limits.min.depth}
                max={limits.max.depth}
                step={2}
                value={state.dimensions.depth}
                onChange={(e) => handleDimensionChange("depth", parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. 24K GOLD EMBOSSING TOGGLE                                    */}
        {/* ============================================================== */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pure-white">24K Gold Foil Emboss</span>
            <button
              onClick={onToggleGoldEmbossing}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                state.goldEmbossing ? "bg-amber-400" : "bg-white/20"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-pure-black transition-transform ${
                  state.goldEmbossing ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-[11px] text-pure-white/50">
            Gold foil hot-stamped royal insignia on box lid.
          </p>
        </div>

        {/* ============================================================== */}
        {/* 6. ACTION BUTTON: SEPARATE / REPLACE LID                       */}
        {/* ============================================================== */}
        <div className="pt-1">
          <button
            onClick={onToggleAction}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-pure-black font-extrabold text-sm flex items-center justify-center shadow-xl transition-all active:scale-98"
          >
            {state.isLidRemoved
              ? "Place Lid Back on Box"
              : "Remove Lid (Place Beside Box)"}
          </button>
        </div>

        {/* ============================================================== */}
        {/* 7. MALL QUOTATION BUTTON                                       */}
        {/* ============================================================== */}
        <div>
          <button
            onClick={onOpenOrderModal}
            className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-pure-white font-semibold text-xs flex items-center justify-center border border-white/10 transition-all"
          >
            Request Box Specification / Quotation
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 8. FOOTER STATUS                                               */}
      {/* ============================================================== */}
      <div className="p-4 border-t border-white/10 bg-[#090b0e] flex items-center justify-between text-[11px] text-pure-white/50">
        <span>Mall Kiosk Display</span>
        <span className="text-amber-400 font-mono">Real-time 3D</span>
      </div>
    </aside>
  );
};

export default ShowcaseSidebar;
