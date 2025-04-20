import { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Context } from '../../../main';
import { FavoritesResponseDto } from '../../../models/favorites/FavoritesResponseDto';
import FavoritesService from '../../../services/FavouritesService';
import ProductCard from '../../ui/productCard/ProductCard';

const FavoritesPage: FC = () => {
  const { store } = useContext(Context); // Получаем пользователя
  const [favorites, setFavorites] = useState<FavoritesResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!store.user) return;
    fetchFavorites();
  }, [store.user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await FavoritesService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!store.user) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-4 text-center'>
        <p className='text-base sm:text-lg text-gray-600'>
          Пожалуйста,{' '}
          <Link to='/auth/login' className='text-secondary b-point underline'>
            войдите
          </Link>
          , чтобы увидеть избранное.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center px-4'>
        <p className='text-base sm:text-lg text-gray-600'>Загрузка...</p>
      </div>
    );
  }

  if (!favorites || favorites.items.length === 0) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center px-4 text-center'>
        <h1 className='text-xl sm:text-2xl font-semibold mb-4'>Избранное</h1>
        <p className='text-base sm:text-lg text-gray-600 mb-6'>Вы ещё ничего не добавили в избранное.</p>
        <Link
          to='/'
          className='px-6 py-2.5 bg-secondary text-white text-sm sm:text-base rounded-lg b-point transition hover:bg-opacity-90'
        >
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className='px-2 sm:px-4 md:px-8 lg:px-10 xl:px-[100px] py-[20px] sm:py-[40px]'>
      <div className='mb-6'>
        <div className='text-sm mb-2'>
          <Link to='/'>Главная</Link> <span className='mx-2'>›</span> Избранное
        </div>
        <h2 className='text-[32px] sm:text-[48px] lg:text-[64px]'>Избранное</h2>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
        {favorites.items.map((fav) => (
          <div key={fav.product.id} className='w-full flex justify-center'>
            <ProductCard product={fav.product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
