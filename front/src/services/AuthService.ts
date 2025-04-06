import $api from '../http';
import { AuthResponse } from '../models/response/AuthResponse';

export default class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await $api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  }

  static async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const response = await $api.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  }

  static async getProfile(): Promise<AuthResponse['user']> {
    try {
      const response = await $api.get<AuthResponse['user']>('/users/profile', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    } catch (error: any) {
      console.error('Ошибка запроса профиля:', error.message);
      throw new Error('Не удалось загрузить профиль');
    }
  }


  static async logout(): Promise<void> {
    localStorage.removeItem('token');
  }

  // Добавлен метод checkAuth
  static async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await $api.post<AuthResponse>('/auth/access-token', { withCredentials: true });
      localStorage.setItem('token', response.data.accessToken);
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      throw new Error('Ошибка проверки авторизации');
    }
  }
}
