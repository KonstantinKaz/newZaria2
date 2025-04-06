export interface ICreateProductDto {
    title: string;
    price: number;
    description: string;
    categoryId: number;
    images: string[];
    quantity: number;
  }