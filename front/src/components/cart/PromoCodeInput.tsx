import { useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { PromocodeService } from '../../services/promocode.service';
import { Button } from '../ui/button/Button';

export function PromoCodeInput() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { applyPromocode, removePromocode } = useActions();

  const handleApplyPromocode = async () => {
    try {
      setIsLoading(true);
      setError('');
      const { data: promocode } = await PromocodeService.validate(code);
      console.log('Validated promocode:', promocode);
      applyPromocode(promocode);
      console.log('Applied promocode to Redux store');
      setCode('');
    } catch (error: any) {
      console.error('Error applying promocode:', error);
      setError(error.response?.data?.message || 'Ошибка при применении промокода');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        <input
          type='text'
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder='Введите промокод'
          className='px-4 py-2 border rounded-md flex-grow'
        />
        <Button onClick={handleApplyPromocode} disabled={!code || isLoading}>
          {isLoading ? 'Проверяем...' : 'Применить'}
        </Button>
        <Button
          onClick={() => {
            removePromocode();
            console.log('Removed promocode from Redux store');
          }}
          variant='outline'
        >
          Сбросить
        </Button>
      </div>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
}
