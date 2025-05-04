import { instance } from '../api/api.interceptor';
import { IPromocode } from '../store/cart/cart.types';

const PROMOCODES = '/api/promocodes';

interface ICreatePromocodeDto {
  code: string;
  discount: number;
  description?: string;
  maxUses?: number;
  validUntil?: string;
  isActive?: boolean;
}

export const PromocodeService = {
  async validate(code: string) {
    return instance<IPromocode>({
      url: `${PROMOCODES}/validate/${code}`,
      method: 'POST',
    });
  },

  async create(data: ICreatePromocodeDto) {
    return instance<IPromocode>({
      url: PROMOCODES,
      method: 'POST',
      data,
    });
  },

  async getAll() {
    return instance<IPromocode[]>({
      url: PROMOCODES,
      method: 'GET',
    });
  },

  async delete(id: string) {
    return instance<void>({
      url: `${PROMOCODES}/${id}`,
      method: 'DELETE',
    });
  },
};
