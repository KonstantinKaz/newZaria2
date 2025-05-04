import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Context } from '../../../main';
import OrderService from '../../../services/OrderService';

const CheckoutPage: React.FC = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!store.isAuth) {
        navigate('/auth/login');
        return;
      }

      if (!store.cart) {
        await store.fetchCart();
      }
      setPageLoading(false);
    };

    init();
  }, [store.isAuth]);

  const selectedItems = store.cart?.items.filter((item) => item.selected) || [];
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const cartItemIds = selectedItems.map((item) => item.id);

      if (cartItemIds.length === 0) {
        alert('Пожалуйста, выберите товары для заказа');
        return;
      }

      const { data: order } = await OrderService.createOrder(cartItemIds, store.user!.email);
      await store.fetchCart(); // Обновляем корзину после создания заказа
      navigate(`/order-success/${order.id}`);
    } catch (error: any) {
      console.error('Ошибка при создании заказа:', error);
      const errorMessage = error.response?.data?.message || 'Произошла ошибка при оформлении заказа';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] py-6'>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!store.isAuth || !store.cart || !store.user) {
    return null;
  }

  if (selectedItems.length === 0) {
    return (
      <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] py-6'>
        <h1 className='text-2xl font-semibold mb-4'>Корзина пуста</h1>
        <p className='text-gray-600 mb-4'>В вашей корзине нет выбранных товаров для оформления заказа.</p>
        <button onClick={() => navigate('/cart')} className='text-secondary hover:underline'>
          Вернуться в корзину
        </button>
      </div>
    );
  }

  return (
    <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] py-6'>
      <h1 className='text-2xl font-semibold mb-6'>Оформление заказа</h1>

      <div className='max-w-2xl'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Email для связи</label>
            <input
              type='email'
              value={store.user.email}
              disabled
              className='w-full px-4 py-2 border rounded-md bg-gray-50'
            />
          </div>

          <div className='mt-8'>
            <h2 className='text-lg font-medium mb-4'>Товары в заказе</h2>
            <div className='space-y-4'>
              {selectedItems.map((item) => {
                const mainImage = import.meta.env.VITE_API_URL + item.product.images?.[0] || '/no-image.png';
                return (
                  <div key={item.id} className='flex items-start space-x-4 border rounded p-4'>
                    <div className='w-20 h-20 flex-shrink-0'>
                      <img src={mainImage} alt={item.product.title} className='w-full h-full object-cover rounded' />
                    </div>
                    <div className='flex-grow'>
                      <h3 className='font-medium'>{item.product.title}</h3>
                      <p className='text-gray-600'>Количество: {item.quantity}</p>
                      <p className='font-medium'>{item.product.price * item.quantity}₽</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='border-t pt-4'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-lg'>Итого к оплате:</span>
              <span className='text-xl font-semibold'>{totalPrice}₽</span>
            </div>

            <button
              type='submit'
              disabled={loading || selectedItems.length === 0}
              className='w-full bg-secondary text-white py-3 rounded-md hover:bg-secondary-dark transition-colors disabled:opacity-50'
            >
              {loading ? 'Оформление...' : 'Оформить заказ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default observer(CheckoutPage);
