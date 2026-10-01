import React from "react";
import JewelleryBoxViewer from "./JewelleryBoxViewer";
import { ColorOption, ProductDetailItem } from "@/lib/productData";

interface Product3DViewerProps {
  product: ProductDetailItem;
  selectedColor?: ColorOption;
  onOpenChange?: (isOpen: boolean) => void;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  product,
  selectedColor,
  onOpenChange,
}) => {
  return (
    <JewelleryBoxViewer
      selectedColor={selectedColor}
      onOpenChange={onOpenChange}
    />
  );
};

export default Product3DViewer;
