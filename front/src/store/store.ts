import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { CartResponseDto } from '../models/cart/CartResponseDto';
import { IUser } from '../models/IUser';
import AuthService from '../services/AuthService';
import CartService from '../services/CartService';

class Store {
  user: IUser | null = null;
  isAuth = false;
  isLoading = false;
  cart: CartResponseDto | null = null;

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

  setCart(cart: CartResponseDto | null) {
    this.cart = cart;
  }

  async fetchCart() {
    try {
      const data = await CartService.getCart();
      this.setCart(data);
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      this.setCart(null);
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await AuthService.login(email, password);
      this.setAuth(true);
      this.setUser(response.user);
      await this.fetchCart(); // Загружаем корзину после входа
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      throw new Error(axiosError.response?.data?.message || 'Ошибка входа');
    }
  }

  async register(data: {
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    gender?: string;
    birthday: string;
    password: string;
  }) {
    try {
      const response = await AuthService.register(data);
      this.setAuth(true);
      this.setUser(response.user);
      await this.fetchCart(); // Загружаем корзину после регистрации
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      throw new Error(axiosError.response?.data?.message || 'Ошибка регистрации');
    }
  }

  async logout() {
    AuthService.logout();
    this.setAuth(false);
    this.setUser(null);
    this.setCart(null);
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
      await this.fetchCart(); // Загружаем корзину после получения профиля
    } catch (error: unknown) {
      console.error('Ошибка при загрузке профиля:', error);
      this.setAuth(false);
      this.setUser(null);
      this.setCart(null);
    } finally {
      this.setLoading(false);
    }
  }

  async checkAuth() {
    try {
      const response = await AuthService.checkAuth();
      this.setAuth(true);
      this.setUser(response.user);
      await this.fetchCart(); // Загружаем корзину после проверки авторизации
    } catch (error: unknown) {
      this.setAuth(false);
      this.setUser(null);
      this.setCart(null);
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
