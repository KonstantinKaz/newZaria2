import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ICategory } from '../../../models/product/ICategory';
import CategoryService from '../../../services/CategoryService';

const CatalogPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Ошибка при загрузке категорий:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Загрузка категорий...</div>;
  }

  return (
    <div className='px-2 sm:px-4 md:px-8 lg:px-10 xl:px-[100px] my-[20px] sm:my-[40px]'>
      <div className='text-sm mb-4'>
        <Link to='/'>Главная</Link> <span className='mx-2'>›</span> Каталог
      </div>
      <h2 className='text-[32px] sm:text-[48px] lg:text-[64px] mb-4 sm:mb-6'>КАТАЛОГ</h2>
      <ul className='hidden sm:flex flex-wrap gap-3 lg:gap-[13px]'>
        {categories.map((category) => (
          <li
            key={category.id}
            className='b-point min-h-[80px] w-full sm:w-[calc(50%-0.375rem)] lg:w-[300px] py-[15px] px-[25px] border border-[#000000] content-center'
          >
            <Link to={`/catalog/${category.id}`} className='flex justify-between items-center'>
              <span className='text-base sm:text-lg'>{category.name}</span>
              <img src='/images/bottom_arrow.svg' alt='Стрелочка' className='w-5 h-5' />
            </Link>
          </li>
        ))}
      </ul>
      <ul className='mb-6 flex flex-col sm:hidden gap-2 w-full'>
        {categories.map((category) => (
          <li key={category.id} className='b-point min-h-[50px] w-full py-2 px-4 border border-[#000000]'>
            <Link to={`/catalog/${category.id}`} className='flex justify-between items-center'>
              <span className='text-base'>{category.name}</span>
              <img src='/images/bottom_arrow.svg' alt='Стрелочка' className='w-4 h-4' />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CatalogPage;
