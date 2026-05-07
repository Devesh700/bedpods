import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";

interface ProductImageCarouselProps {
  images: string[];
  title: string;
}

const ProductImageCarousel = ({ images, title }: ProductImageCarouselProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (!api || !isHovered) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 1500); // Change slide every 1.5 seconds

    return () => clearInterval(interval);
  }, [api, isHovered]);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div 
      className="relative w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        <img 
          src={images[0]} 
          alt={title}
          className="w-full h-full object-contain transition-all duration-500 ease-out"
        />
      ) : (
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full h-full"
        >
          <CarouselContent className="-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="pl-4">
                <img 
                  src={image} 
                  alt={`${title} view ${index + 1}`}
                  className="w-full h-full object-contain animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
      
      {isHovered && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                current === index 
                  ? 'bg-pure-black/70 scale-125' 
                  : 'bg-pure-black/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
