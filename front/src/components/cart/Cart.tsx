import { useContext, useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Context } from '../../main';
import { Button } from '../ui/button/Button';
import { CartItem } from './CartItem';
import { PromoCodeInput } from './PromoCodeInput';

export function Cart() {
  const { items, total, promocode } = useTypedSelector((state) => state.cart);
  const { resetCart } = useActions();
  const { store } = useContext(Context);

  useEffect(() => {
    console.log('Cart state:', {
      isAuth: store.isAuth,
      items,
      total,
      promocode,
    });
  }, [store.isAuth, items, total, promocode]);

  if (!store.isAuth) {
    return (
      <div className='flex flex-col items-center justify-center py-10'>
        <h2 className='text-xl font-semibold mb-4'>Для просмотра корзины необходимо авторизоваться</h2>
        <Button onClick={() => (window.location.href = '/auth/login')}>Войти</Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between mb-10'>
        <h1 className='text-2xl font-semibold'>Корзина</h1>
        {items.length > 0 && (
          <Button onClick={() => resetCart()} variant='outline'>
            Очистить корзину
          </Button>
        )}
      </div>

      <div className='flex flex-col gap-10 mb-10'>
        {items.length ? items.map((item) => <CartItem key={item.id} item={item} />) : <div>Корзина пуста</div>}
      </div>

      {items.length > 0 && (
        <>
          <PromoCodeInput />
          <div className='text-xl font-semibold mt-5'>
            Итого: {new Intl.NumberFormat('ru-RU').format(total)} ₽
            {promocode && <span className='text-sm text-green-500 ml-2'>(Скидка {promocode.discount}%)</span>}
          </div>
        </>
      )}
    </div>
  );
}
