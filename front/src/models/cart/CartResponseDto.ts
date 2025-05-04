import { IPromocode } from '../../store/cart/cart.types';

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  categoryId: number;
  category: {
    id: number;
    name: string;
    image: string;
  };
}

export interface CartItem {
  id: number;
  quantity: number;
  selected: boolean;
  product: CartProduct;
}

export interface CartResponseDto {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  promocode?: IPromocode | null;
}
