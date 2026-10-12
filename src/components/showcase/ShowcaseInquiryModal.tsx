import React, { useState } from "react";
import { ShowcaseState } from "./types";
import { X, CheckCircle2, Copy, FileText, Send } from "lucide-react";
import { toast } from "sonner";

interface ShowcaseInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: ShowcaseState;
}

export const ShowcaseInquiryModal: React.FC<ShowcaseInquiryModalProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const boxTypeName =
    state.boxType === "cuboid"
      ? "Cuboid Jewellery Box (Separable Lid)"
      : state.boxType === "paper-packet"
      ? "Paper Packet of Jewellery (Folding Flap)"
      : "Cloth Packet (Thread Drawstring Pocket)";

  const handleCopySpec = () => {
    const specText = `ALFA GOLD Mall Showcase Specification:
Type: ${boxTypeName}
Dimensions: ${state.dimensions.width}mm (W) × ${state.dimensions.height}mm (H) × ${state.dimensions.depth}mm (D)
Color: ${state.selectedColor?.name || state.customHex} (${state.customHex})
Surface Finish: ${state.surfaceFinish}
24K Gold Foil Emboss: ${state.goldEmbossing ? "Yes" : "No"}`;

    navigator.clipboard.writeText(specText);
    toast.success("Specification copied to clipboard!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Quotation inquiry submitted! Our showcase representative will contact you.");
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pure-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg bg-[#0e1117] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-pure-white space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
            Mall Showcase Spec Sheet
          </span>
          <h2 className="text-2xl font-black text-pure-white">
            Custom Packaging Quotation
          </h2>
          <p className="text-xs text-pure-white/60">
            Review your custom 3D configured attributes and request manufacturer pricing.
          </p>
        </div>

        {/* Spec Summary Card */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-pure-white/60">Box Category:</span>
            <span className="font-bold text-amber-300">{boxTypeName}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-pure-white/60">Custom Dimensions:</span>
            <span className="font-mono font-bold text-pure-white">
              {state.dimensions.width} × {state.dimensions.height} × {state.dimensions.depth} mm
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-pure-white/60">Selected Color:</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/30"
                style={{ backgroundColor: state.customHex }}
              />
              <span className="font-semibold text-pure-white">
                {state.selectedColor?.name || state.customHex}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-pure-white/60">Surface Finish:</span>
            <span className="capitalize font-semibold text-pure-white">
              {state.surfaceFinish}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-pure-white/60">24K Gold Embossing:</span>
            <span className="font-semibold text-amber-300">
              {state.goldEmbossing ? "Included" : "None"}
            </span>
          </div>
        </div>

        {/* Action Buttons: Copy Spec or Submit Inquiry */}
        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-pure-white">Inquiry Received!</h3>
            <p className="text-xs text-pure-white/70">
              A luxury packaging consultant will contact you with volume discount tiers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-pure-white/70 block mb-1">
                  Your Name / Jewellery Brand
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Diamond Boutique"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-pure-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-pure-white/70 block mb-1">
                  Mobile / WhatsApp Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-pure-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-pure-white/70 block mb-1">
                  Estimated Quantity / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. 500 units for mall festive collection"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-pure-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopySpec}
                className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-pure-white font-semibold text-xs flex items-center justify-center border border-white/10 transition-all"
              >
                <span>Copy Spec Sheet</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-pure-black font-extrabold text-xs flex items-center justify-center shadow-lg transition-all"
              >
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShowcaseInquiryModal;
