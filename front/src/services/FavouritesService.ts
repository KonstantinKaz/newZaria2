import $api from '../http';
import { FavoritesResponseDto } from '../models/favorites/FavoritesResponseDto';

export default class FavoritesService {
  static async getFavorites(): Promise<FavoritesResponseDto> {
    const res = await $api.get('/favorites');
    return res.data;
  }

  static async toggleFavorite(productId: number) {
    const res = await $api.post(`/favorites/${productId}`);
    return res.data;
  }
}
