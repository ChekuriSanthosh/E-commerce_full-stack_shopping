export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phoneNumber: string;
  cartItems: CartItem[];
  boughtItems: CartItem[];
}

export interface CartItem {
  itemId: number;
  prodId: number;
  quantity: number;
}

export interface ProductDto {
  productId: number;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  category: string;
  imageUrl: string;
} 