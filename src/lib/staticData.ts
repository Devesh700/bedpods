
import airpodsPro2ge1 from "@/assets/airpod-2ge.jpeg";
import airpodsPro2ge2 from "@/assets/airpod-2ge-2.jpeg"
import airpods4 from "@/assets/airpod-4ge.jpeg";
import airpods4_2 from "@/assets/airpod-4ge-2.jpeg"
export const products = [
    {
      title: "AirPods Pro 2 (2nd Gen)",
      price: "1,100",
      originalPrice: "24,900",
      image: airpodsPro2ge1,
      images: [airpodsPro2ge1, airpodsPro2ge2], // Multiple views for carousel
      badge: "Best Seller",
      features: [
        "Active Noise Cancellation",
        "Adaptive Transparency",
        "Personalized Spatial Audio",
        "MagSafe Charging Case",
        "Up to 6h listening time",
        "Precision Finding with Find My"
      ]
    },
    {
      title: "AirPods 4 (4th Gen)",
      price: "1,799",
      originalPrice: "12,900",
      image: airpods4,
      images: [airpods4, airpods4_2], // Multiple views for carousel
      badge: "New Arrival",
      features: [
        "Active Noise Cancellation",
        "USB-C Charging Case",
        "Personalized Spatial Audio",
        "Adaptive Audio",
        "Up to 5h listening time",
        "IP54 dust & water resistance"
      ]
    }
  ];