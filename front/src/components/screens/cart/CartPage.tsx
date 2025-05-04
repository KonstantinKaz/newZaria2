import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useActions } from '../../../hooks/useActions';

import { CartResponseDto } from '../../../models/cart/CartResponseDto';
import { RemoveFromCartDto } from '../../../models/cart/RemoveFromCartDto';
import { UpdateSelectionDto } from '../../../models/cart/UpdateSelectionDto';

import CartService from '../../../services/CartService';
import { PromocodeService } from '../../../services/promocode.service';

import { Context } from '../../../main';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const { applyPromocode } = useActions();

  useEffect(() => {
    console.log('Auth state:', { isAuth: store.isAuth, user: store.user });
    if (!store.isAuth) {
      console.log('User not authenticated, redirecting to login');
      navigate('/auth/login');
      return;
    }
    fetchCart();
  }, [store.isAuth]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      console.log('Fetching cart data...');
      const data = await CartService.getCart();
      console.log('Cart data received:', data);
      setCart(data);
    } catch (error) {
      console.error('Ошибка при загрузке корзины', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = async (itemId: number, selected: boolean) => {
    try {
      await CartService.updateSelection(itemId, selected);
      setCart((prev) => {
        if (!prev) return prev;
        const newItems = prev.items.map((i) => (i.id === itemId ? { ...i, selected } : i));
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Ошибка при выборе товара', error);
    }
  };

  const handleChangeQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    try {
      await CartService.updateQuantity(itemId, newQuantity);
      setCart((prev) => {
        if (!prev) return prev;
        const newItems = prev.items.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i));
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Ошибка при изменении количества', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await CartService.removeItem(itemId);
      setCart((prev) => {
        if (!prev) return prev;
        const newItems = prev.items.filter((i) => i.id !== itemId);
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Ошибка при удалении товара', error);
    }
  };

  const handleSelectAll = async (checked: boolean) => {
    if (!cart) return;
    const itemIds = cart.items.map((i) => i.id);
    const dto: UpdateSelectionDto = {
      itemIds,
      selected: checked,
    };
    try {
      await CartService.updateMultipleSelection(dto);
      setCart((prev) => {
        if (!prev) return prev;
        const newItems = prev.items.map((i) => ({ ...i, selected: checked }));
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Ошибка при выборе всех товаров', error);
    }
  };

  const handleRemoveSelected = async () => {
    if (!cart) return;
    const itemIds = cart.items.filter((i) => i.selected).map((i) => i.id);
    if (!itemIds.length) return;
    const dto: RemoveFromCartDto = { itemIds };
    try {
      await CartService.removeMultiple(dto);
      setCart((prev) => {
        if (!prev) return prev;
        const newItems = prev.items.filter((i) => !i.selected);
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Ошибка при удалении выбранных товаров', error);
    }
  };

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return;

    try {
      setPromoError(null);
      const { data: promocode } = await PromocodeService.validate(promoCode);
      console.log('Validated promocode:', promocode);
      setPromoDiscount(promocode.discount);
      applyPromocode(promocode);
      setPromoError(null);

      // Обновляем корзину после применения промокода
      await fetchCart();
    } catch (error) {
      console.error('Promocode validation error:', error);
      setPromoDiscount(null);
      if (error.response?.status === 404) {
        const message = error.response?.data?.message || 'Промокод не найден';
        setPromoError(message);
      } else {
        setPromoError('Ошибка при проверке промокода');
      }
    }
  };

  const totalSelectedQuantity = cart?.items.reduce((sum, it) => (it.selected ? sum + it.quantity : sum), 0) || 0;

  const totalSelectedPrice =
    cart?.items.reduce((sum, it) => (it.selected ? sum + it.quantity * it.product.price : sum), 0) || 0;

  const discountAmount = promoDiscount ? (totalSelectedPrice * promoDiscount) / 100 : 0;
  const finalPrice = totalSelectedPrice - discountAmount;

  const allSelected = cart?.items.length ? cart.items.every((i) => i.selected) : false;

  if (loading) {
    return (
      <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] py-6'>
        <p>Загрузка корзины...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] py-6'>
        <h1 className='text-2xl font-semibold mb-4'>Корзина</h1>
        <p>Ваша корзина пуста.</p>
      </div>
    );
  }

  return (
    <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] mb-10 my-[40px]'>
      <h2 className='text-[32px] md:text-[48px] lg:text-[64px]'>КОРЗИНА</h2>
      <div className='text-sm mb-4'>
        <Link to='/'>Главная</Link> <span className='mx-2'>›</span> Корзина
      </div>
      <div className='flex flex-col'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-6'>
          <label className='inline-flex items-center space-x-2 mb-2 sm:mb-0'>
            <input
              type='checkbox'
              className='form-checkbox h-5 w-5 text-secondary'
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span>Выбрать все</span>
          </label>
          <button
            className='text-sm text-gray-600 hover:text-gray-800 inline-flex items-center space-x-1'
            onClick={handleRemoveSelected}
          >
            <svg className='w-4 h-4 inline-block' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19 7l-.867 12.142A2 2 0 0116.136 21H7.864a2 2 0 01-1.997-1.858L5 7m2-4h10m-7 4v10m4-10v10'
              />
            </svg>
            <span>Удалить выбранные</span>
          </button>
        </div>
        <div className='flex flex-col lg:flex-row lg:justify-between'>
          <div className='space-y-4 w-full lg:w-[740px]'>
            {cart.items.map((item) => {
              const product = item.product;
              const productArt = String(product.id).padStart(6, '0');
              const displayArt = `АРТ. ${productArt}`;
              const mainImage = import.meta.env.VITE_API_URL + product.images?.[0] || '/no-image.png';
              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row lg:items-start lg:h-auto border rounded p-4 w-full lg:w-[700px] ${
                    item.selected ? 'border-secondary' : 'border-gray-200'
                  }`}
                >
                  <div className='flex items-start space-x-3 w-full lg:w-auto'>
                    <input
                      type='checkbox'
                      className='form-checkbox h-5 w-5 text-secondary mt-2'
                      checked={item.selected}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    />
                    <div className='flex flex-col sm:flex-row gap-4 w-full'>
                      <div className='w-full sm:w-[135.4px] h-[200px] relative'>
                        <img
                          src={mainImage}
                          alt={product.title}
                          className='absolute inset-0 w-full h-full object-contain sm:object-cover rounded'
                        />
                      </div>
                      <div className='flex flex-col justify-between w-full sm:w-auto sm:max-w-[250px] sm:ml-[30px]'>
                        <span className='text-base font-medium'>{product.title}</span>
                        <div className='flex items-center space-x-2 border border-black rounded-[30px] justify-center w-[120px] my-3 sm:my-0'>
                          <button
                            onClick={() => handleChangeQuantity(item.id, item.quantity - 1)}
                            className='rounded px-2 py-1 b-point text-[18px]'
                          >
                            −
                          </button>
                          <span className='text-[18px]'>{item.quantity}</span>
                          <button
                            onClick={() => handleChangeQuantity(item.id, item.quantity + 1)}
                            className='rounded px-2 py-1 b-point text-[18px]'
                          >
                            +
                          </button>
                        </div>
                        <div className='flex flex-col sm:flex-row sm:items-center'>
                          <span className='text-[13px] font-bold text-[#c6c6c6]'>{displayArt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center justify-between sm:justify-end w-full mt-4 sm:mt-0 sm:space-x-6'>
                    <div className='text-right font-medium text-[24px] sm:text-[20px]'>
                      {item.quantity * product.price}₽
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className='text-gray-500 hover:text-secondary b-point'
                    >
                      <svg className='w-6 h-6' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M19 7l-.867 12.142A2 2 0 0116.136 21H7.864a2 2 0 01-1.997-1.858L5 7m2-4h10m-7 4v10m4-10v10'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='border rounded p-4 w-full lg:w-64 mt-8 lg:mt-0'>
            <div className='mb-4'>
              <label className='block text-sm text-gray-600 mb-2'>Промокод</label>
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder='Введите промокод'
                  className='border rounded px-2 py-1 text-sm w-full'
                />
                <button
                  onClick={handleApplyPromoCode}
                  className='bg-secondary text-white px-3 py-1 rounded text-sm hover:bg-secondary-dark'
                >
                  OK
                </button>
              </div>
              {promoError && <p className='text-red-500 text-xs mt-1'>{promoError}</p>}
              {promoDiscount && (
                <p className='text-green-600 text-xs mt-1'>Промокод применен! Скидка {promoDiscount}%</p>
              )}
            </div>

            <div className='mb-2 text-sm text-gray-600'>Выбрано товаров: {totalSelectedQuantity}</div>

            <div className='space-y-2 mb-4'>
              <div className='flex justify-between text-sm'>
                <span>Сумма:</span>
                <span>{totalSelectedPrice}₽</span>
              </div>

              {promoDiscount && (
                <div className='flex justify-between text-sm text-green-600'>
                  <span>Скидка:</span>
                  <span>-{discountAmount}₽</span>
                </div>
              )}

              <div className='flex justify-between font-semibold text-xl'>
                <span>Итого:</span>
                <span>{finalPrice}₽</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className='bg-secondary b-point text-white w-full py-2 rounded hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={totalSelectedQuantity === 0}
            >
              {totalSelectedQuantity === 0 ? 'Выберите товары' : 'Оформить заказ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
