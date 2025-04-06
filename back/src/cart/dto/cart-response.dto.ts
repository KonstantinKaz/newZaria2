export class CartResponseDto {
  items: {
    id: number;
    quantity: number;
    selected: boolean;
    product: {
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
    };
  }[];
  totalQuantity: number;
  totalPrice: number;
} 