import { AxiosResponse } from 'axios';
import $api from '../http';

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    title: string;
    price: number;
    images: string[];
  };
}

export interface Order {
  id: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  email: string;
  items: OrderItem[];
  createdAt: string;
}

export interface CreateOrderDto {
  cartItemIds: number[];
  email: string;
}

export default class OrderService {
  static async createOrder(cartItemIds: number[], email: string): Promise<AxiosResponse<Order>> {
    const dto: CreateOrderDto = { cartItemIds, email };
    return $api.post<Order>('/orders', dto);
  }

  static async getOrderById(id: string): Promise<AxiosResponse<Order>> {
    return $api.get<Order>(`/orders/${id}`);
  }

  static async getPaidOrders(): Promise<AxiosResponse<Order[]>> {
    return $api.get<Order[]>('/orders/mine');
  }
}
