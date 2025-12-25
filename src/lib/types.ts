export type Product = {
  id: string;
  name: string;
  description: string;
  imageId: string;
  image: string;
  imageHint: string;
  fabricDetails: string;
  features: string[];
  careInstructions: string;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  customization: {
    fabric: string;
    size: string;
    color: string;
    style: string;
  };
};

export type Order = {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
};
