import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import CategoryService from '../../../services/CategoryService';
import ProductService from '../../../services/ProductService';
import { ICategory } from '../../../models/product/ICategory';
import { IProduct } from '../../../models/product/Product';
import ProductCard from '../../ui/productCard/ProductCard';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

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
    return <div style={{ padding: '20px' }}>Загрузка категорий...</div>;
  }

  return (
    <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] mb-10 my-[40px]'>
      <h2 className="text-[64px]">КАТАЛОГ</h2>
      <div className="text-sm mb-4">
        <Link to="/">Главная</Link> <span className="mx-2">›</span> Каталог
      </div>
      <div className='flex'>
        <aside className='w-[242px] mr-[20px]'>
          <h3 className='text-[18px] text-secondary font-semibold'>Категории</h3>
          <ul className='mt-[20px] list-none p-0 border rounded-[1px] border-[#000000] mx-0 my-auto align-middle'>
            {categories.map((cat) => (
              <li key={cat.id} style={{ marginBottom: '8px' }} className='mb-[8px] flex justify-between px-3'>
                <Link
                  to={`/catalog/${cat.id}`}
                  className={`transition ${
                    Number(categoryId) === cat.id ? 'text-secondary font-semibold' : 'text-gray-800'
                  } hover:text-secondary b-point` }
                >
                  {cat.name}
                </Link>
                <img src="/images/bottom_arrow.svg" alt="Стрелочка" />
              </li>
            ))}
          </ul>
        </aside>
        <main style={{ flex: 1 }}>
          {loadingProducts ? (
            <div style={{ marginTop: '20px' }}>Загрузка товаров...</div>
          ) : products.length === 0 ? (
            <div style={{ marginTop: '20px' }}>В этой категории пока нет товаров.</div>
          ) : (
            <ul
              style={{
                marginTop: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                listStyle: 'none',
                padding: 0,
              }}
            >
              {products.map((product) => (
                <li key={product.id}>
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