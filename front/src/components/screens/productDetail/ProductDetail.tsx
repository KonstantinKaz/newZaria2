import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Context } from '../../../main';
import { IProduct } from '../../../models/product/Product';
import { AddToCartDto } from '../../../models/cart/AddToCartDto';
import CartService from '../../../services/CartService';
import FavoritesService from '../../../services/FavouritesService';
import StarRating from '../../ui/starRating';

const BASE_URL = import.meta.env.VITE_API_URL;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { store } = useContext(Context);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
        
        // Проверка находится ли товар в избранном
        if (store.user) {
          const favorites = await FavoritesService.getFavorites();
          setIsFavorite(favorites.items.some((fav: any) => fav.product.id === parseInt(id || '0')));
        }
      } catch (error) {
        console.error('Ошибка при загрузке товара:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, store.user]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      if (!store.user) {
        console.warn('Пользователь не авторизован!');
        return;
      }

      const dto: AddToCartDto = {
        items: [{ productId: product.id, quantity }],
      };

      await CartService.addToCart(dto);
      console.log('Товар добавлен в корзину');
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!product) return;
    
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

  const incrementQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] py-10">
        <p className="text-center font-montserrat">Загрузка информации о товаре...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] py-10">
        <h1 className="text-2xl font-playfair font-semibold mb-4">Товар не найден</h1>
        <Link to="/" className="text-secondary hover:underline font-montserrat">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const productArt = String(product.id).padStart(6, '0');
  const displayArt = `АРТ. ${productArt}`;
  const productImages = product.images.length > 0 
    ? product.images.map(img => BASE_URL + img) 
    : ['/no-image.png'];
  const heartIcon = isFavorite ? '/images/heart_red.svg' : '/images/heart_gray.svg';

  return (
    <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] py-6">
      {/* Хлебные крошки */}
      <div className="mb-6 text-sm font-montserrat">
        <Link to="/" className="hover:underline">Главная</Link>
        <span className="mx-2">›</span>
        <Link to="/catalog" className="hover:underline">Каталог</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Галерея изображений */}
        <div className="space-y-4">
          <div className="aspect-square w-full relative border border-gray-200 rounded-lg p-4">
            <img 
              src={productImages[selectedImage]} 
              alt={product.title} 
              className="w-full h-full object-contain"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2">
              {productImages.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border rounded-md flex-shrink-0 ${selectedImage === index ? 'border-secondary' : 'border-gray-200'}`}
                >
                  <img src={img} alt={`${product.title} ${index + 1}`} className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-playfair font-semibold mb-2">{product.title}</h1>
            <p className="text-gray-500 font-montserrat">{displayArt}</p>
          </div>

          <div className="flex items-center gap-4">
            <StarRating rating={product.rating || 4} />
            <button onClick={toggleFavorite} className="flex items-center gap-2 text-sm font-montserrat">
              <img src={heartIcon} alt="Избранное" className="w-6 h-6" />
              {isFavorite ? 'В избранном' : 'В избранное'}
            </button>
          </div>

          <div className="text-3xl font-bold font-playfair">{product.price} ₽</div>

          {product.quantity > 0 ? (
            <p className="text-green-600 flex items-center font-montserrat">
              <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              В наличии {product.quantity} шт.
            </p>
          ) : (
            <p className="text-red-600 flex items-center font-montserrat">
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full mr-2"></span>
              Нет в наличии
            </p>
          )}

          {product.quantity > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={decrementQuantity}
                  className="px-4 py-2 text-lg"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly
                  className="w-14 text-center border-0 py-2" 
                />
                <button 
                  onClick={incrementQuantity}
                  className="px-4 py-2 text-lg"
                  disabled={quantity >= product.quantity}
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                className="b-point border border-secondary font-medium flex justify-between items-center px-6 text-secondary py-2 hover:bg-secondary hover:text-white transition rounded-[4px]"
              >
                <span className="font-montserrat">Добавить в корзину</span>
                <img src="/images/cart.svg" alt="корзина" className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}

          {/* Описание */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-playfair font-semibold mb-3">Описание</h2>
            <p className="text-gray-700 whitespace-pre-line font-montserrat font-light">{product.description}</p>
          </div>
          
          {/* Информация о ноте аромата (специфично для духов) */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-playfair font-semibold mb-3">Пирамида аромата</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-playfair font-medium text-secondary">Верхние ноты</h3>
                <p className="font-montserrat font-light">Бергамот, лимон, нероли</p>
              </div>
              <div>
                <h3 className="font-playfair font-medium text-secondary">Ноты сердца</h3>
                <p className="font-montserrat font-light">Жасмин, роза, иланг-иланг</p>
              </div>
              <div>
                <h3 className="font-playfair font-medium text-secondary">Базовые ноты</h3>
                <p className="font-montserrat font-light">Ваниль, мускус, сандал</p>
              </div>
            </div>
          </div>
          
          {/* Объем и концентрация */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-playfair font-semibold mb-3">Детали</h2>
            <div className="grid grid-cols-2 gap-4 font-montserrat">
              <div>
                <p className="font-medium">Объем:</p>
                <p className="font-light">50 мл</p>
              </div>
              <div>
                <p className="font-medium">Концентрация:</p>
                <p className="font-light">Парфюмерная вода (EDP)</p>
              </div>
              <div>
                <p className="font-medium">Год выпуска:</p>
                <p className="font-light">2023</p>
              </div>
              <div>
                <p className="font-medium">Страна бренда:</p>
                <p className="font-light">Франция</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Рекомендуемые товары */}
      <div className="mt-16">
        <h2 className="text-2xl font-playfair font-semibold mb-6">Вам также может понравиться</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Здесь можно добавить рекомендуемые товары */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 