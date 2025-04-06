import $api from '../http';
import { AddToCartDto } from '../models/cart/AddToCartDto';

import { CartResponseDto } from '../models/cart/CartResponseDto';
import { RemoveFromCartDto } from '../models/cart/RemoveFromCartDto';
import { UpdateSelectionDto } from '../models/cart/UpdateSelectionDto';


export default class CartService {
  static async getCart() {
    const res = await $api.get<CartResponseDto>('/cart');
    return res.data;
  }

  static async addToCart(dto: AddToCartDto) {
    const res = await $api.post('/cart', dto);
    return res.data;
  }

  static async removeItem(itemId: number) {
    const res = await $api.delete(`/cart/${itemId}`);
    return res.data;
  }

  static async removeMultiple(dto: RemoveFromCartDto) {
    const res = await $api.request({
      url: '/cart',
      method: 'DELETE',
      data: dto,
    });
    return res.data;
  }

  static async updateSelection(itemId: number, selected: boolean) {
    const res = await $api.patch(`/cart/${itemId}/select`, { selected });
    return res.data;
  }

  static async updateMultipleSelection(dto: UpdateSelectionDto) {
    const res = await $api.patch('/cart/batch-select', dto);
    return res.data;
  }

  static async updateQuantity(itemId: number, quantity: number) {
    const res = await $api.patch(`/cart/${itemId}`, { quantity });
    return res.data;
  }
}
