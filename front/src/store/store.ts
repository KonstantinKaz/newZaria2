import { configureStore } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { CartResponseDto } from '../models/cart/CartResponseDto';
import { IUser } from '../models/IUser';
import AuthService from '../services/AuthService';
import CartService from '../services/CartService';
import { cartActions, cartReducer } from './cart/cart.slice';

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
    // Синхронизируем с Redux store
    if (cart) {
      console.log('Syncing cart with Redux store:', cart);
      // Очищаем текущую корзину в Redux
      store.dispatch(cartActions.resetCart());
      // Добавляем каждый товар в Redux store
      cart.items.forEach((item) => {
        store.dispatch(
          cartActions.addToCart({
            id: item.id,
            product: item.product,
            quantity: item.quantity,
            selected: item.selected,
          }),
        );
      });
      // Если есть промокод, применяем его
      if (cart.promocode) {
        store.dispatch(cartActions.applyPromocode(cart.promocode));
      }
    } else {
      // Если корзина пуста, очищаем Redux store
      store.dispatch(cartActions.resetCart());
    }
  }

  async fetchCart() {
    try {
      console.log('Fetching cart from backend...');
      const data = await CartService.getCart();
      console.log('Received cart data:', data);
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

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
