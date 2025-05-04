import { instance } from '@/api/api.interceptor';
import { IOrder } from '@/types/order.interface';

const ORDERS = 'orders';

export const OrderService = {
  async getAll() {
    return instance<IOrder[]>({
      url: `/${ORDERS}`,
      method: 'GET',
    });
  },

  async getByUserId() {
    return instance<IOrder[]>({
      url: `/${ORDERS}/by-user`,
      method: 'GET',
    });
  },

  async placeOrder(data: { email: string; promocodeId?: string }) {
    console.log('Placing order with data:', data);
    return instance<IOrder>({
      url: `/${ORDERS}`,
      method: 'POST',
      data,
    });
  },
};
