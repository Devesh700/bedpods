import { FaWhatsapp } from "react-icons/fa";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  showText?: boolean;
}

const WhatsAppButton = ({ 
  phoneNumber = "+918288080954", 
  message = "Hi! I'm interested in ordering BEPODS products.",
  className = "",
  showText = true
}: WhatsAppButtonProps) => {
  const handleWhatsAppClick = () => {
    const formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className={`flex items-center gap-2 bg-[#25D366] text-pure-white px-6 py-3 rounded-full hover:bg-[#128C7E] transition-all transform hover:scale-105 shadow-glow animate-pulse ${className}`}
      aria-label="Contact on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
      {showText && <span className="font-semibold">Order on WhatsApp</span>}
    </button>
  );
};

export default WhatsAppButton;