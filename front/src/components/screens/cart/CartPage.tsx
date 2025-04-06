import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router';

import { CartResponseDto } from '../../../models/cart/CartResponseDto';
import { UpdateSelectionDto } from '../../../models/cart/UpdateSelectionDto';
import { RemoveFromCartDto } from '../../../models/cart/RemoveFromCartDto';

import CartService from '../../../services/CartService';

import { Context } from '../../../main';

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { store } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.isAuth) {
      navigate('/auth/login');
      return;
    }
    fetchCart();
  }, [store.isAuth]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await CartService.getCart();
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
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.items.map(i =>
          i.id === itemId ? { ...i, selected } : i
        );
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
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.items.map(i =>
          i.id === itemId ? { ...i, quantity: newQuantity } : i
        );
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Ошибка при изменении количества', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await CartService.removeItem(itemId);
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.items.filter(i => i.id !== itemId);
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Ошибка при удалении товара', error);
    }
  };

  const handleSelectAll = async (checked: boolean) => {
    if (!cart) return;
    const itemIds = cart.items.map(i => i.id);
    const dto: UpdateSelectionDto = {
      itemIds,
      selected: checked,
    };
    try {
      await CartService.updateMultipleSelection(dto);
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.items.map(i => ({ ...i, selected: checked }));
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Ошибка при выборе всех товаров', error);
    }
  };

  const handleRemoveSelected = async () => {
    if (!cart) return;
    const itemIds = cart.items.filter(i => i.selected).map(i => i.id);
    if (!itemIds.length) return;
    const dto: RemoveFromCartDto = { itemIds };
    try {
      await CartService.removeMultiple(dto);
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.items.filter(i => !i.selected);
        return { ...prev, items: newItems };
      });
    } catch (error) {
      console.error('Ошибка при удалении выбранных товаров', error);
    }
  };

  const totalSelectedQuantity =
    cart?.items.reduce((sum, it) => (it.selected ? sum + it.quantity : sum), 0) || 0;

  const totalSelectedPrice =
    cart?.items.reduce((sum, it) => (it.selected ? sum + it.quantity * it.product.price : sum), 0) || 0;

  const allSelected = cart?.items.length
    ? cart.items.every(i => i.selected)
    : false;

  if (loading) {
    return (
      <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] py-6">
        <p>Загрузка корзины...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] py-6">
        <h1 className="text-2xl font-semibold mb-4">Корзина</h1>
        <p>Ваша корзина пуста.</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] mb-10 my-[40px]">
      <h2 className="text-[64px]">КОРЗИНА</h2>
      <div className="text-sm mb-4">
        <Link to="/">Главная</Link> <span className="mx-2">›</span> Корзина
      </div>
      <div className='flex flex-col'>
        <div className="flex items-center space-x-4 mb-6 gap-[370px]">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-secondary"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span>Выбрать все</span>
          </label>
          <button
            className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center space-x-1"
            onClick={handleRemoveSelected}
          >
            <svg
              className="w-4 h-4 inline-block"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.136 21H7.864a2 2 0 01-1.997-1.858L5 7m2-4h10m-7 4v10m4-10v10" />
            </svg>
            <span>Удалить выбранные</span>
          </button>
        </div>
        <div className='flex justify-between'>
          <div className="space-y-4 w-[740px]">
            {cart.items.map(item => {
              const product = item.product;
              const productArt = String(product.id).padStart(6, '0');
              const displayArt = `АРТ. ${productArt}`;
              const mainImage = import.meta.env.VITE_API_URL + product.images?.[0] || '/no-image.png';
              return (
                <div
                  key={item.id}
                  className={`flex items-start justify-between border rounded p-4 w-[700px] ${
                    item.selected ? 'border-secondary' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-top space-x-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-secondary"
                      checked={item.selected}
                      onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                    />
                    <div className='flex gap-4'>
                      <img
                        src={mainImage}
                        alt={product.title}
                        className="w-[135.4px] h-[200px] object-cover rounded"
                      />
                      <div className="flex flex-col justify-between max-w-[250px] ml-[30px]">
                        <span className="text-base font-medium">{product.title}</span>
                        <div className="flex items-center space-x-2 border border-black rounded-[30px] justify-center w-[120px]">
                          <button
                            onClick={() => handleChangeQuantity(item.id, item.quantity - 1)}
                            className="rounded px-2 py-1 b-point text-[18px]"
                          >
                            −
                          </button>
                          <span className='text-[18px]'>{item.quantity}</span>
                          <button
                            onClick={() => handleChangeQuantity(item.id, item.quantity + 1)}
                            className="rounded px-2 py-1 b-point text-[18px]"
                          >
                            +
                          </button>
                        </div>
                        <div className='flex'>
                          <span className="text-[15px] font-medium mr-[50px]">{product.price}₽ / шт</span>
                          <span className="text-[13px] font-bold text-[#c6c6c6]">{displayArt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="w-16 text-right">
                      {item.quantity * product.price}₽
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-500 hover:text-secondary b-point"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.136 21H7.864a2 2 0 01-1.997-1.858L5 7m2-4h10m-7 4v10m4-10v10" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border rounded p-4 w-64 mt-8 h-[150px]">
            <div className="mb-2 text-sm text-gray-600">
              Выбрано товаров: {totalSelectedQuantity}
            </div>
            <div className="mb-4 font-semibold text-xl">
              {totalSelectedPrice}₽
            </div>
            <button className="bg-secondary b-point text-white w-full py-2 rounded hover:bg-secondary-dark">
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
