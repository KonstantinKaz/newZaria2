export interface AddToCartItemDto {
    productId: number;
    quantity: number;
  }

export interface AddToCartDto {
items: AddToCartItemDto[];
}