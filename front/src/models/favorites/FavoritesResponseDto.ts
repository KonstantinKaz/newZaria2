export interface FavoritesResponseDto {
    items: {
      id: number;
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
  }
