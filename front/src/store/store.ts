import { makeAutoObservable } from 'mobx';
import AuthService from '../services/AuthService';
import { IUser } from '../models/IUser';

class Store {
  user: IUser | null = null;
  isAuth = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.initAuth(); // Запускаем проверку при загрузке приложения
  }

  setAuth(auth: boolean) {
    this.isAuth = auth;
  }

  setUser(user: IUser | null) {
    this.user = user;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      this.setAuth(true);
      this.setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка входа');
    }
  }

  async register(data: { name: string; surname: string; patronymic?: string; email: string; gender?: string; birthday: string; password: string }) {
    try {
      const response = await AuthService.register(data);
      this.setAuth(true);
      this.setUser(response.user);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Ошибка регистрации');
    }
  }

  async logout() {
    AuthService.logout();
    this.setAuth(false);
    this.setUser(null);
  }

  async getProfile() {
    if (!localStorage.getItem('token')) {
      return;
    }

    try {
      this.setLoading(true);
      const user = await AuthService.getProfile();
      this.setUser(user);
      this.setAuth(true);
    } catch (error: any) {
      console.error('Ошибка при загрузке профиля:', error);
      this.setAuth(false);
      this.setUser(null);
    } finally {
      this.setLoading(false);
    }
  }

  async checkAuth() {
    try {
      const response = await AuthService.checkAuth();
      this.setAuth(true);
      this.setUser(response.user);
    } catch (error) {
      this.setAuth(false);
      this.setUser(null);
    }
  }

  async initAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      await this.checkAuth();
    }
  }
}

export default new Store();
