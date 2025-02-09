// Interface for existing products (with ID)
export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  category: string;
  imageUrl: string;
}

// Interface for new products (without ID)
export interface NewProduct {
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  category: string;
  imageUrl: string;
} 