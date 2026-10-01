import alfaBoxImage from "@/assets/image.png";
import airpodsPro2 from "@/assets/airpods-pro-2.png";
import airpods4 from "@/assets/airpods-4.png";

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  boxColor: string;
  boxLidColor: string;
}

export interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  description: string;
}

export interface ProductDetailItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviewCount: number;
  badge: string;
  description: string;
  modelType: "alfa-classic" | "alfa-deluxe" | "alfa-royal";
  defaultColorId: string;
  colors: ColorOption[];
  images: string[];
  hotspots: Hotspot[];
  features: string[];
  specs: { label: string; value: string }[];
}

export const COLOR_PALETTE: Record<string, ColorOption> = {
  silver: {
    id: "silver",
    name: "Alpha Platinum Silver",
    hex: "#475569",
    accentHex: "#D97706",
    roughness: 0.3,
    metalness: 0.4,
    clearcoat: 0.6,
    boxColor: "#334155",
    boxLidColor: "#475569",
  },
  gold: {
    id: "gold",
    name: "Alpha Royal Gold",
    hex: "#D97706",
    accentHex: "#F59E0B",
    roughness: 0.2,
    metalness: 0.85,
    clearcoat: 0.9,
    boxColor: "#B45309",
    boxLidColor: "#D97706",
  },
  midnight: {
    id: "midnight",
    name: "Classic Obsidian Black",
    hex: "#0F172A",
    accentHex: "#F59E0B",
    roughness: 0.45,
    metalness: 0.6,
    clearcoat: 0.3,
    boxColor: "#020617",
    boxLidColor: "#0F172A",
  },
  ruby: {
    id: "ruby",
    name: "Ruby Red Velvet",
    hex: "#991B1B",
    accentHex: "#F59E0B",
    roughness: 0.25,
    metalness: 0.4,
    clearcoat: 0.8,
    boxColor: "#7F1D1D",
    boxLidColor: "#991B1B",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Jade Green",
    hex: "#065F46",
    accentHex: "#F59E0B",
    roughness: 0.3,
    metalness: 0.5,
    clearcoat: 0.7,
    boxColor: "#064E3B",
    boxLidColor: "#065F46",
  },
  sapphire: {
    id: "sapphire",
    name: "Sapphire Royal Blue",
    hex: "#1E3A8A",
    accentHex: "#F59E0B",
    roughness: 0.25,
    metalness: 0.6,
    clearcoat: 0.8,
    boxColor: "#1E1B4B",
    boxLidColor: "#1E3A8A",
  },
};

export const PRODUCT_CATALOG: ProductDetailItem[] = [
  {
    id: "alfa-gold-classic",
    title: "ALFA GOLD BOX - Classic Ring & Coin Edition",
    subtitle: "Premium Magnetic Flip-Lid Luxury Jewellery Packaging",
    price: "1,299",
    originalPrice: "4,999",
    rating: 4.95,
    reviewCount: 482,
    badge: "Flagship Edition",
    description:
      "Crafted with precision magnetic clasp closure, golden foil embossed ALFA GOLD BOX interior branding, and deep black plush velvet ring insert. The benchmark for luxury gold and diamond presentation.",
    modelType: "alfa-classic",
    defaultColorId: "silver",
    colors: [
      COLOR_PALETTE.silver,
      COLOR_PALETTE.gold,
      COLOR_PALETTE.midnight,
      COLOR_PALETTE.ruby,
      COLOR_PALETTE.emerald,
      COLOR_PALETTE.sapphire,
    ],
    images: [alfaBoxImage, alfaBoxImage, alfaBoxImage],
    hotspots: [
      {
        id: "h1",
        x: 50,
        y: 25,
        title: "ALFA GOLD Embossed Foil",
        description: "24K Gold foil hot-stamped logo with precision border detail.",
      },
      {
        id: "h2",
        x: 50,
        y: 65,
        title: "Deep Velvet Cushion",
        description: "High-density micro-velvet slot protecting gold rings & coins.",
      },
      {
        id: "h3",
        x: 80,
        y: 40,
        title: "Hinged Magnetic Lock",
        description: "Soft magnetic snap-lock closure mechanism with 120° flip lid.",
      },
    ],
    features: [
      "Signature ALFA GOLD BOX 24K Foil Inner Branding",
      "Ergonomic Magnetic Flip-Top 120° Open Physics",
      "High-Density Black Plush Velvet Ring & Coin Slot",
      "Scratch-Resistant Satin Finish Outer Exterior",
      "Ideal for Engagement Rings, Gold Coins & Diamond Studs",
    ],
    specs: [
      { label: "Dimensions", value: "6.5 cm x 6.5 cm x 5.8 cm" },
      { label: "Weight", value: "185 grams" },
      { label: "Material", value: "Reinforced Rigitex Core + Italian Matte Leatherette" },
      { label: "Interior", value: "Black Plush Microfiber Velvet" },
      { label: "Lock Mechanism", value: "Dual Neodymium Magnetic Clasp" },
    ],
  },
  {
    id: "alfa-gold-deluxe",
    title: "ALFA GOLD BOX - Deluxe Pendant & Necklace Edition",
    subtitle: "Wide Velvet Tray for Fine Chains & Pendants",
    price: "1,899",
    originalPrice: "6,499",
    rating: 4.88,
    reviewCount: 310,
    badge: "Bestseller",
    description:
      "Designed specifically for gold chains, diamond pendants, and bangles. Features dual elastic security tabs and custom velvet lining.",
    modelType: "alfa-deluxe",
    defaultColorId: "gold",
    colors: [
      COLOR_PALETTE.gold,
      COLOR_PALETTE.silver,
      COLOR_PALETTE.midnight,
      COLOR_PALETTE.ruby,
    ],
    images: [alfaBoxImage, airpodsPro2],
    hotspots: [
      {
        id: "hd1",
        x: 45,
        y: 30,
        title: "Chain Security Hooks",
        description: "Concealed elastic loops to keep chain necklaces tangle-free.",
      },
    ],
    features: [
      "Extended Rectangular Profile for Chain & Pendant Layout",
      "Signature ALFA GOLD Metallic Branding",
      "Dual Hidden Security Hooks for Gold Necklaces",
      "Padded Velvet Insert Cushion",
    ],
    specs: [
      { label: "Dimensions", value: "10.0 cm x 8.0 cm x 4.5 cm" },
      { label: "Weight", value: "240 grams" },
      { label: "Capacity", value: "Necklace, Earrings & Ring Combo" },
      { label: "Finish", value: "Anodized Matte Satin Finish" },
    ],
  },
  {
    id: "alfa-gold-royal",
    title: "ALFA GOLD BOX - Royal Heirloom Master Trunk",
    subtitle: "Double-Door Vault Chest for Complete Jewellery Sets",
    price: "3,499",
    originalPrice: "12,999",
    rating: 4.98,
    reviewCount: 195,
    badge: "Royal Luxury",
    description:
      "The pinnacle of luxury jewellery storage. Double French door opening with multi-tier ring rolls, watch pillow, and necklace vault.",
    modelType: "alfa-royal",
    defaultColorId: "midnight",
    colors: [
      COLOR_PALETTE.midnight,
      COLOR_PALETTE.gold,
      COLOR_PALETTE.ruby,
      COLOR_PALETTE.emerald,
    ],
    images: [alfaBoxImage, airpods4],
    hotspots: [
      {
        id: "hr1",
        x: 50,
        y: 50,
        title: "Multi-Tier Drawer Vault",
        description: "Pull-out velvet drawers for complete bridal jewellery sets.",
      },
    ],
    features: [
      "Double French Door Synchronized Opening",
      "Multi-Tiered Velvet Compartments & Watch Pillow",
      "24K Gold Plated Hardware & Keylock",
      "Hand-Finished Leatherette & Velvet Vault",
    ],
    specs: [
      { label: "Dimensions", value: "18.5 cm x 14.0 cm x 12.0 cm" },
      { label: "Weight", value: "850 grams" },
      { label: "Security", value: "Keylock + Magnetic Double Door" },
    ],
  },
];
