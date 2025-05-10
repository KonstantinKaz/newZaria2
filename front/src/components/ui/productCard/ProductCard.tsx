import { FC, useContext, useEffect, useState } from 'react';
import { Context } from '../../../main';
import { AddToCartDto } from '../../../models/cart/AddToCartDto';
import { IProductCardProps } from '../../../models/product/IProductCardProps';
import CartService from '../../../services/CartService';
import FavoritesService from '../../../services/FavouritesService';
import StarRating from '../starRating';
import { Link } from 'react-router';

const BASE_URL = import.meta.env.VITE_API_URL;

const ProductCard: FC<IProductCardProps> = ({ product }) => {
  const { store } = useContext(Context);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!store.user) return;
      try {
        const favorites = await FavoritesService.getFavorites();
        setIsFavorite(favorites.items.some((fav: any) => fav.product.id === product.id));
      } catch (error) {
        console.error('Ошибка при загрузке избранного:', error);
      }
    };
    fetchFavorites();
  }, [store.user, product.id]);

  const handleAddToCart = async () => {
    try {
      if (!store.user) {
        console.warn('Пользователь не авторизован!');
        return;
      }

      const dto: AddToCartDto = {
        items: [{ productId: product.id, quantity: 1 }],
      };

      await CartService.addToCart(dto);
      console.log('Товар добавлен в корзину');
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!store.user) {
      console.warn('Пользователь не авторизован!');
      return;
    }

    try {
      await FavoritesService.toggleFavorite(product.id);
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
    }
  };

  const productArt = String(product.id).padStart(6, '0');
  const displayArt = `АРТ. ${productArt}`;
  const mainImage = product.images.length > 0 ? BASE_URL + product.images[0] : '/no-image.png';
  const heartIcon = isFavorite ? '/images/heart_red.svg' : '/images/heart_gray.svg';

  return (
    <div className='border border-gray-200 rounded-lg p-2 shadow-md relative w-full max-w-sm mx-auto'>
      {/* Иконка избранного */}
      <button onClick={toggleFavorite} className='absolute top-3 right-3 z-10'>
        <img src={heartIcon} alt='Избранное' className='w-6 h-6 b-point' />
      </button>

      {/* Изображение товара */}
      <div className='aspect-square w-full relative mb-3'>
        <Link to={`/products/${product.id}`} className='absolute inset-0 flex items-center justify-center'>
          <img src={mainImage} alt={product.title} className='max-w-full max-h-full object-contain rounded-md' />
        </Link>
      </div>

      <StarRating rating={4} />

      {/* Информация о товаре */}
      <div className='space-y-2'>
        <Link to={`/products/${product.id}`} className='text-[16px] font-semibold truncate block hover:text-secondary'>
          {product.title}, <span className='text-gray-500'>{displayArt}</span>
        </Link>
        <div className='flex justify-between items-center flex-wrap gap-2'>
          <p className='text-[24px] font-semibold'>{product.price} ₽ / шт</p>
          <p className='text-green-600 text-sm flex items-center whitespace-nowrap'>В наличии</p>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className='b-point border border-secondary font-medium w-full flex justify-between items-center px-3 text-secondary py-2 mt-4 rounded-[4px] hover:bg-secondary hover:text-white transition text-[13px]'
      >
        <span className='text-lg'>Добавить в корзину</span>
        <img src='/images/cart.svg' alt='корзина' className='w-4 h-4' />
      </button>
    </div>
  );
};

export default ProductCard;
