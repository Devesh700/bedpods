export type BoxType = "cuboid" | "paper-packet" | "cloth-packet";

export type SurfaceFinish = "matte" | "glossy" | "metallic" | "textured" | "velvet" | "silk";

export interface Dimensions {
  width: number; // in mm
  height: number; // in mm
  depth: number; // in mm
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  accentHex?: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
}

export interface DimensionPreset {
  id: string;
  label: string;
  description: string;
  dimensions: Dimensions;
}

export interface ShowcaseState {
  boxType: BoxType;
  dimensions: Dimensions;
  selectedColor: ColorOption;
  customHex: string;
  surfaceFinish: SurfaceFinish;
  isLidRemoved: boolean; // For Cuboid Box: lid removed and placed beside
  isFlapOpen: boolean; // For Paper Packet: top flap opened
  isClothPocketOpen: boolean; // For Cloth Packet: drawstring loosened & pocket opened
  autoRotate: boolean;
  showDimensions: boolean;
  lightingPreset: "boutique" | "studio" | "jewel-dark";
  goldEmbossing: boolean;
  embossText: string;
}

export const LUXURY_COLORS: ColorOption[] = [
  {
    id: "royal-gold",
    name: "24K Royal Gold",
    hex: "#d4af37",
    accentHex: "#ffd700",
    roughness: 0.25,
    metalness: 0.85,
    clearcoat: 0.8,
  },
  {
    id: "obsidian-black",
    name: "Obsidian Noir Black",
    hex: "#111418",
    accentHex: "#d4af37",
    roughness: 0.35,
    metalness: 0.2,
    clearcoat: 0.5,
  },
  {
    id: "pearl-white",
    name: "Pure Pearl Ivory",
    hex: "#f8f7f4",
    accentHex: "#d4af37",
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.6,
  },
  {
    id: "ruby-wine",
    name: "Imperial Ruby Velvet",
    hex: "#7a0c1e",
    accentHex: "#ffd700",
    roughness: 0.35,
    metalness: 0.3,
    clearcoat: 0.7,
  },
  {
    id: "emerald-green",
    name: "Emerald Jade Royal",
    hex: "#0e4d3a",
    accentHex: "#d4af37",
    roughness: 0.35,
    metalness: 0.4,
    clearcoat: 0.7,
  },
  {
    id: "sapphire-blue",
    name: "Midnight Sapphire Blue",
    hex: "#0f2b5c",
    accentHex: "#d4af37",
    roughness: 0.3,
    metalness: 0.5,
    clearcoat: 0.8,
  },
  {
    id: "artisan-kraft",
    name: "Artisan Kraft Brown",
    hex: "#9b724c",
    accentHex: "#3e2723",
    roughness: 0.75,
    metalness: 0.05,
    clearcoat: 0.1,
  },
  {
    id: "rose-champagne",
    name: "Rose Quartz Champagne",
    hex: "#cfa6a0",
    accentHex: "#d4af37",
    roughness: 0.3,
    metalness: 0.4,
    clearcoat: 0.6,
  },
  {
    id: "platinum-slate",
    name: "Platinum Slate Grey",
    hex: "#4b5563",
    accentHex: "#e2e8f0",
    roughness: 0.3,
    metalness: 0.6,
    clearcoat: 0.5,
  },
];

export const DIMENSION_LIMITS: Record<BoxType, { min: Dimensions; max: Dimensions; default: Dimensions }> = {
  cuboid: {
    min: { width: 50, height: 30, depth: 50 },
    max: { width: 200, height: 120, depth: 200 },
    default: { width: 80, height: 55, depth: 80 },
  },
  "paper-packet": {
    min: { width: 60, height: 80, depth: 10 },
    max: { width: 220, height: 260, depth: 40 },
    default: { width: 110, height: 140, depth: 16 },
  },
  "cloth-packet": {
    min: { width: 60, height: 80, depth: 25 },
    max: { width: 180, height: 220, depth: 80 },
    default: { width: 100, height: 130, depth: 45 },
  },
};

export const DIMENSION_PRESETS: Record<BoxType, DimensionPreset[]> = {
  cuboid: [
    {
      id: "ring",
      label: "Ring & Earring Box",
      description: "65 × 55 × 65 mm - Compact square showcase",
      dimensions: { width: 65, height: 55, depth: 65 },
    },
    {
      id: "bangle",
      label: "Bangle & Bracelet Box",
      description: "95 × 60 × 95 mm - Medium luxury square",
      dimensions: { width: 95, height: 60, depth: 95 },
    },
    {
      id: "necklace",
      label: "Necklace & Pendant Chest",
      description: "160 × 48 × 125 mm - Wide display profile",
      dimensions: { width: 160, height: 48, depth: 125 },
    },
    {
      id: "watch",
      label: "Watch & Keepsake Box",
      description: "110 × 75 × 110 mm - Deep tall profile",
      dimensions: { width: 110, height: 75, depth: 110 },
    },
  ],
  "paper-packet": [
    {
      id: "coin-envelope",
      label: "Gold Coin & Bullion Packet",
      description: "75 × 95 × 12 mm - Slim folded pouch",
      dimensions: { width: 75, height: 95, depth: 12 },
    },
    {
      id: "pendant-packet",
      label: "Pendant & Chain Pouch",
      description: "105 × 135 × 16 mm - Classic boutique envelope",
      dimensions: { width: 105, height: 135, depth: 16 },
    },
    {
      id: "certificate-packet",
      label: "Necklace & Certificate Packet",
      description: "175 × 150 × 22 mm - Wide luxury envelope",
      dimensions: { width: 175, height: 150, depth: 22 },
    },
  ],
  "cloth-packet": [
    {
      id: "ring-pouch",
      label: "Ring & Gem Pouch",
      description: "70 × 90 × 30 mm - Petite drawstring pouch",
      dimensions: { width: 70, height: 90, depth: 30 },
    },
    {
      id: "bangle-pouch",
      label: "Bangle & Wristlet Pouch",
      description: "105 × 135 × 45 mm - Medium velvet pocket",
      dimensions: { width: 105, height: 135, depth: 45 },
    },
    {
      id: "mala-pouch",
      label: "Bridal Mala & Necklace Pouch",
      description: "145 × 180 × 60 mm - Large drawstring pocket",
      dimensions: { width: 145, height: 180, depth: 60 },
    },
  ],
};
