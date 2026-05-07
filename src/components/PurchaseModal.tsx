import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { analytics, db } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { products } from "@/lib/staticData"
import { Select, SelectGroup, SelectTrigger, SelectItem, SelectContent } from "./ui/select";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  price?: string;
  originalPrice?: string
}

const PurchaseModal = ({ isOpen, onClose, productName, price, originalPrice }: PurchaseModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState({ productName, price, originalPrice })
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (Object.values(formData).some(value => !value)) {
      toast.error("Please fill all fields");
      return;
    }


    try {
      setIsSubmitting(true);
      const docRef = await addDoc(collection(db, "Leads"), {
        ...formData,
        productName: product?.productName || "Unknown Product",
        price: product?.price || "N/A",
        originalPrice: product?.originalPrice || "N/A",
        generatedAt: new Date().toISOString(),
      })
      console.log("Document written with ID: ", docRef.id);
      console.log("Document written with data: ", docRef);

      // Show success message
      toast.success("🎉 Congratulations! Welcome to BEPODS Family!", {
        description: "Your order has been placed successfully. We'll contact you soon!",
        duration: 5000,
      });

      // Reset form and close modal
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: ""
      });
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-pure-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-pure-black">
            Complete Your Purchase
          </DialogTitle>
          {productName && (
            <p className="text-muted-foreground">Ordering: {productName}</p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="fullName" className="text-pure-black">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="border-granite/20 focus:border-pure-black"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-pure-black">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="border-granite/20 focus:border-pure-black"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-pure-black">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="border-granite/20 focus:border-pure-black"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-pure-black">Delivery Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete address"
              className="border-granite/20 focus:border-pure-black"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-pure-black">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
                className="border-granite/20 focus:border-pure-black"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="state" className="text-pure-black">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Your state"
                className="border-granite/20 focus:border-pure-black"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 mb-4">
            {
              !(productName && price && originalPrice) &&
              <div className="">
                <Label htmlFor="product" className="text-pure-black">Select Product</Label>
                <Select
                  onValueChange={(value) => {
                    const selectedProduct = products.find(p => p.title === value);
                    if (selectedProduct) {
                      setProduct({
                        productName: selectedProduct.title,
                        price: selectedProduct.price,
                        originalPrice: selectedProduct.originalPrice || ""
                      })
                    }
                  }}>
                  <SelectTrigger
                    id="product"
                    name="product"
                    value={product.productName}

                    className="w-full border-granite/20 focus:border-pure-black"
                    // required
                    disabled={isSubmitting}
                  >
                    {product.productName || "Select a product"}
                  </SelectTrigger>

                  <SelectContent>
                    {products.map((prod, index) => (
                      <SelectItem key={index} value={prod.title} className="text-pure-black">
                        {prod.title} - ₹{prod.price} {prod.originalPrice && `(₹${prod.originalPrice})`}
                      </SelectItem>
                    ))}
                  </SelectContent>

                </Select>
              </div>
            }
          </div>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-pure-black hover:bg-granite text-pure-white font-semibold py-6"
          >
            {isSubmitting ? "Submitting..."
              : "Submit Order"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;