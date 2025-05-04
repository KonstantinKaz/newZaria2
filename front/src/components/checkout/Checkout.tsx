import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Context } from '../../main';
import { OrderService } from '../../services/order.service';
import { ICartItem } from '../../store/cart/cart.types';
import { RootState } from '../../store/store';
import { Button } from '../ui/button/Button';
import { Input } from '../ui/input/Input';

export function Checkout() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { store } = useContext(Context);

  const { items } = useTypedSelector((state: RootState) => state.cart);
  const selectedItems = items.filter((item: ICartItem) => item.selected);

  // Расчет базовой суммы
  const subtotal = selectedItems.reduce((sum: number, item: ICartItem) => sum + item.product.price * item.quantity, 0);

  // Получаем промокод из MobX состояния
  const promocode = store.cart?.promocode;

  useEffect(() => {
    // Синхронизируем с бэкендом при монтировании
    store.fetchCart();
  }, []);

  // Расчет скидки и итоговой суммы
  const discount = promocode ? (subtotal * promocode.discount) / 100 : 0;
  const finalTotal = subtotal - discount;

  const { resetCart } = useActions();
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      setIsLoading(true);
      setError('');

      const orderData = {
        email,
        promocodeId: promocode?.id,
      };

      console.log('Placing order with data:', orderData);

      const { data: order } = await OrderService.placeOrder(orderData);
      console.log('Order created:', order);

      resetCart();
      navigate('/thanks');
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при оформлении заказа';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedItems.length) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-xl font-semibold mb-4'>Корзина пуста</h2>
        <p className='text-gray-600 mb-4'>В вашей корзине нет выбранных товаров для оформления заказа.</p>
        <Button onClick={() => navigate('/cart')}>Вернуться в корзину</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-2xl font-semibold mb-10'>Оформление заказа</h1>

      <div className='max-w-md'>
        <Input
          placeholder='Email'
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className='mb-5'
        />

        <div className='space-y-4 mb-6'>
          <div className='border rounded-lg p-4'>
            <h3 className='font-medium mb-3'>Выбранные товары:</h3>
            {selectedItems.map((item: ICartItem) => (
              <div key={item.id} className='flex justify-between items-center py-2'>
                <div>
                  <div className='font-medium'>{item.product.title}</div>
                  <div className='text-sm text-gray-600'>
                    {item.quantity} шт. × {item.product.price}₽
                  </div>
                </div>
                <div className='font-medium'>{(item.product.price * item.quantity).toFixed(2)}₽</div>
              </div>
            ))}
          </div>

          <div className='border rounded-lg p-4 space-y-2'>
            <div className='flex justify-between text-gray-600'>
              <span>Сумма:</span>
              <span>{subtotal.toFixed(2)}₽</span>
            </div>

            {promocode && (
              <div className='flex justify-between text-green-600'>
                <span>
                  Скидка по промокоду {promocode.code} ({promocode.discount}%):
                </span>
                <span>-{discount.toFixed(2)}₽</span>
              </div>
            )}

            <div className='flex justify-between text-xl font-semibold pt-2 border-t'>
              <span>Итого к оплате:</span>
              <span>{finalTotal.toFixed(2)}₽</span>
            </div>
          </div>
        </div>

        <Button onClick={placeOrder} disabled={!email || isLoading} className='w-full'>
          {isLoading ? 'Оформление...' : 'Оформить заказ'}
        </Button>

        {error && <div className='text-red-500 text-sm mt-2'>{error}</div>}
      </div>
    </div>
  );
}
