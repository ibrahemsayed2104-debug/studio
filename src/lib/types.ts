export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageId: string;
  image: string;
  imageHint: string;
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
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
};
