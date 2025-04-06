import { FC, useState, useEffect, useContext } from 'react';
import { IProductCardProps } from '../../../models/product/IProductCardProps';
import CartService from '../../../services/CartService';
import { AddToCartDto } from '../../../models/cart/AddToCartDto';
import { Context } from '../../../main';
import FavoritesService from '../../../services/FavouritesService';
import StarRating from '../starRating';

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
    <div className="border border-gray-200 rounded-lg p-2 shadow-md relative">
      {/* Иконка избранного */}
      <button onClick={toggleFavorite} className="absolute top-3 right-3">
        <img src={heartIcon} alt="Избранное" className="w-6 h-6 b-point" />
      </button>

      {/* Изображение товара */}
      <div className="h-[300px] w-[280px] flex justify-center items-center overflow-hidden mb-3">
        <img src={mainImage} alt={product.title} className="w-full h-full object-cover rounded-md" />
      </div>

      <StarRating rating={4} />

      {/* Информация о товаре */}
      <p className="text-[16px] font-semibold truncate">{product.title}, <span className='text-gray-500'>{displayArt}</span></p>
      <div className='flex justify-between'>
        <p className="text-[24px] font-semibold mt-1">{product.price} ₽ / шт</p>
        <p className="text-green-600 mt-1 text-center flex items-center">В наличии</p>
      </div>

      <button
        onClick={handleAddToCart}
        className="b-point border border-secondary font-semibold w-full flex justify-between px-5 text-secondary py-3 mt-4 rounded-[4px] hover:bg-secondary hover:text-white transition"
      >
        Добавить в корзину
        <img src="/images/cart.svg" alt="" className='w-[20px]'/>
      </button>
    </div>
  );
};

export default ProductCard;
