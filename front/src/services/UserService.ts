import $api from "../http";
import { AuthResponse } from '../models/response/AuthResponse';

export default class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await $api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  }

  static async register(data: { name: string; surname: string; patronymic?: string; email: string; gender?: string; birthday: string; password: string }): Promise<AuthResponse> {
    const response = await $api.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('token');
  }

  static async getProfile(): Promise<AuthResponse['user']> {
    const response = await $api.get<AuthResponse['user']>('/users/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
  }

  static async checkAuth(): Promise<AuthResponse> {
    const response = await $api.get<AuthResponse>('/auth/refresh', { withCredentials: true });
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  }
}
