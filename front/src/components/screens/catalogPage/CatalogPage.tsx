import React, { useEffect, useState } from 'react';
import CategoryService from '../../../services/CategoryService';
import { ICategory } from '../../../models/product/ICategory';
import { Link } from 'react-router';

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
    <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] my-[40px]'>
      <h2 className="text-[64px]">КАТАЛОГ</h2>
      <div className="text-sm mb-4">
        <Link to="/">Главная</Link> <span className="mx-2">›</span> Каталог
      </div>
      <ul className='mt-[20px] flex gap-[13px]'>
        {categories.map(category => (
          <li key={category.id} className='b-point min-h-[80px] w-[300px] py-[15px] px-[25px] border border-[#000000] content-center'>
            <Link to={`/catalog/${category.id}`} className='flex justify-between'>
              {category.name}
              <img src="/images/bottom_arrow.svg" alt="Стрелочка" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CatalogPage;