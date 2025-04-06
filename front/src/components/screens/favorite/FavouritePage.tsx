import { FC, useEffect, useState, useContext } from 'react';
import { Link } from 'react-router';
import { Context } from '../../../main';
import ProductCard from '../../ui/productCard/ProductCard';
import { FavoritesResponseDto } from '../../../models/favorites/FavoritesResponseDto';
import FavoritesService from '../../../services/FavouritesService';

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Пожалуйста, <Link to="/auth/login" className="text-secondary b-point underline">войдите</Link>, чтобы увидеть избранное.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Загрузка...</p>
      </div>
    );
  }

  if (!favorites || favorites.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Избранное</h1>
        <p className="text-lg text-gray-600">Вы ещё ничего не добавили в избранное.</p>
        <Link to="/" className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg b-point transition">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] mb-10 my-[40px]">
      <h2 className="text-[64px]">Избранное</h2>
      <div className="text-sm mb-4">
        <Link to="/">Главная</Link> <span className="mx-2">›</span> Избранное
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.items.map((fav) => (
          <ProductCard key={fav.product.id} product={fav.product} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
