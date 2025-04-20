import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ICategory } from '../../../models/product/ICategory';
import { IProduct } from '../../../models/product/Product';
import CategoryService from '../../../services/CategoryService';
import ProductService from '../../../services/ProductService';
import ProductCard from '../../ui/productCard/ProductCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return;

      try {
        setLoadingProducts(true);
        const response = await ProductService.getAllByCategory(Number(categoryId));
        setProducts(response.products);
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loadingCategories) {
    return <div className='p-4'>Загрузка категорий...</div>;
  }

  const currentCategory = categories.find((cat) => cat.id === Number(categoryId));

  return (
    <div className='px-2 sm:px-4 md:px-8 lg:px-10 xl:px-[100px] py-[20px] sm:py-[40px]'>
      <div className='text-sm mb-4'>
        <Link to='/'>Главная</Link> <span className='mx-2'>›</span>
        <Link to='/catalog'>Каталог</Link>
        {currentCategory && (
          <>
            <span className='mx-2'>›</span>
            <span>{currentCategory.name}</span>
          </>
        )}
      </div>

      <div className='flex flex-col lg:flex-row lg:gap-[20px]'>
        {/* Mobile Categories Button */}
        <button
          className='lg:hidden flex items-center justify-between w-full p-4 mb-4 border border-[#000000] rounded'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className='text-[18px] font-semibold'>Категории</span>
          <img
            src='/images/bottom_arrow.svg'
            alt='Стрелочка'
            className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Categories List */}
        <aside className={`lg:w-[242px] ${isMenuOpen ? 'block' : 'hidden'} lg:block mb-6 lg:mb-0`}>
          <h3 className='text-[18px] text-secondary font-semibold hidden lg:block'>Категории</h3>
          <ul className='mt-4 lg:mt-[20px] border rounded-[1px] border-[#000000] divide-y divide-gray-200'>
            {categories.map((cat) => (
              <li key={cat.id} className='flex justify-between items-center p-3 hover:bg-gray-50'>
                <Link
                  to={`/catalog/${cat.id}`}
                  className={`transition flex-1 ${
                    Number(categoryId) === cat.id ? 'text-secondary font-semibold' : 'text-gray-800'
                  } hover:text-secondary b-point`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.name}
                </Link>
                <img src='/images/bottom_arrow.svg' alt='Стрелочка' className='w-4 h-4' />
              </li>
            ))}
          </ul>
        </aside>

        {/* Products Grid */}
        <main className='flex-1'>
          <h2 className='text-[32px] sm:text-[48px] lg:text-[64px] mb-6'>
            {currentCategory ? currentCategory.name : 'КАТАЛОГ'}
          </h2>

          {loadingProducts ? (
            <div className='mt-4'>Загрузка товаров...</div>
          ) : products.length === 0 ? (
            <div className='mt-4'>В этой категории пока нет товаров.</div>
          ) : (
            <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
              {products.map((product) => (
                <li key={product.id} className='w-full'>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
