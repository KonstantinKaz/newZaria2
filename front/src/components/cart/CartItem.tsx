import { useActions } from '../../hooks/useActions';
import { ICartItem } from '../../store/cart/cart.types';
import { Button } from '../ui/button/Button';

interface CartItemProps {
  item: ICartItem;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useActions();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(item.id);
    } else {
      updateQuantity({ id: item.id, quantity: newQuantity });
    }
  };

  return (
    <div className='flex items-center gap-4 border-b pb-4'>
      <img src={item.image} alt={item.name} className='w-24 h-24 object-cover rounded' />
      <div className='flex-grow'>
        <h3 className='text-lg font-medium'>{item.name}</h3>
        <p className='text-gray-600'>{new Intl.NumberFormat('ru-RU').format(item.price)} ₽</p>
      </div>
      <div className='flex items-center gap-2'>
        <Button onClick={() => handleQuantityChange(item.quantity - 1)} variant='outline'>
          -
        </Button>
        <span className='w-8 text-center'>{item.quantity}</span>
        <Button onClick={() => handleQuantityChange(item.quantity + 1)} variant='outline'>
          +
        </Button>
      </div>
      <Button onClick={() => removeFromCart(item.id)} variant='outline'>
        Удалить
      </Button>
    </div>
  );
}
