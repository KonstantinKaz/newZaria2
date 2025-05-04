import { observer } from 'mobx-react-lite';
import React, { FormEvent, useEffect, useState } from 'react';
import { ICategory } from '../../../models/product/ICategory';
import { ICreateCategoryDto } from '../../../models/product/ICreateCategoryDto';
import CategoryService from '../../../services/CategoryService';
import ProductService from '../../../services/ProductService';
import { PromocodeService } from '../../../services/promocode.service';
import { IPromocode } from '../../../store/cart/cart.types';

const AdminPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState<ICreateCategoryDto>({ name: '' });
  const [message, setMessage] = useState<string>('');
  const [promocodes, setPromocodes] = useState<IPromocode[]>([]);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [promocode, setPromocode] = useState({
    code: '',
    discount: 0,
    description: '',
    maxUses: 0,
    validUntil: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Ошибка получения категорий', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPromocodes = async () => {
      try {
        const { data } = await PromocodeService.getAll();
        setPromocodes(data);
      } catch (error) {
        console.error('Ошибка при получении промокодов:', error);
      }
    };
    fetchPromocodes();
  }, []);

  const handleCategoryCreate = async () => {
    if (!newCategory.name.trim()) {
      setMessage('Введите название категории');
      return;
    }
    try {
      await CategoryService.create(newCategory);
      setMessage('Категория успешно создана');
      const data = await CategoryService.getAll();
      setCategories(data);
      setNewCategory({ name: '' });
    } catch (error) {
      console.error('Ошибка при создании категории:', error);
      setMessage('Ошибка при создании категории');
    }
  };

  const handleProductCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!title.trim()) {
      setMessage('Введите название товара');
      return;
    }
    if (price <= 0) {
      setMessage('Цена должна быть больше 0');
      return;
    }
    if (!description.trim()) {
      setMessage('Введите описание товара');
      return;
    }
    if (categoryId === 0) {
      setMessage('Выберите категорию');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', String(price));
    formData.append('description', description);
    formData.append('categoryId', String(categoryId));
    formData.append('quantity', String(quantity));

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await ProductService.createFormData(formData);
      setMessage('Товар успешно создан');
      setTitle('');
      setPrice(0);
      setDescription('');
      setCategoryId(0);
      setQuantity(0);
      setImageFile(null);
    } catch (error) {
      console.error('Ошибка при создании товара:', error);
      setMessage('Ошибка при создании товара');
    }
  };

  const handlePromocodeCreate = async () => {
    if (!promocode.code.trim()) {
      setMessage('Введите код промокода');
      return;
    }
    if (promocode.discount <= 0 || promocode.discount > 100) {
      setMessage('Скидка должна быть от 1 до 100 процентов');
      return;
    }

    try {
      await PromocodeService.create({
        code: promocode.code,
        discount: promocode.discount,
        description: promocode.description || undefined,
        maxUses: promocode.maxUses || undefined,
        validUntil: promocode.validUntil || undefined,
        isActive: promocode.isActive,
      });
      setMessage('Промокод успешно создан');
      setPromocode({
        code: '',
        discount: 0,
        description: '',
        maxUses: 0,
        validUntil: '',
        isActive: true,
      });
      // Обновляем список промокодов
      const { data } = await PromocodeService.getAll();
      setPromocodes(data);
    } catch (error) {
      console.error('Ошибка при создании промокода:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании промокода';
      setMessage(errorMessage);
    }
  };

  const handlePromocodeDelete = async (id: string) => {
    try {
      await PromocodeService.delete(id);
      setMessage('Промокод успешно удален');
      // Обновляем список промокодов
      const { data } = await PromocodeService.getAll();
      setPromocodes(data);
    } catch (error) {
      console.error('Ошибка при удалении промокода:', error);
      setMessage('Ошибка при удалении промокода');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold text-gray-800 mb-6'>Админка</h1>

        {message && <p className='mb-4 text-center text-lg text-red-500'>{message}</p>}

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4'>Создать категорию</h2>
          <div className='flex gap-4'>
            <input
              type='text'
              placeholder='Название категории'
              value={newCategory.name}
              onChange={(e) => setNewCategory({ name: e.target.value })}
              className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
            />
            <button
              onClick={handleCategoryCreate}
              className='bg-secondary b-point text-white px-4 py-2 rounded-md transition'
            >
              Создать
            </button>
          </div>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4'>Создать товар</h2>
          <form onSubmit={handleProductCreate} className='grid gap-4'>
            <div>
              <label className='block text-gray-700'>Название товара:</label>
              <input
                type='text'
                placeholder='Введите название товара'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-gray-700'>Цена:</label>
                <input
                  type='number'
                  placeholder='Введите цену'
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
                />
              </div>
              <div>
                <label className='block text-gray-700'>Количество:</label>
                <input
                  type='number'
                  placeholder='Введите количество'
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
                />
              </div>
            </div>

            <div>
              <label className='block text-gray-700'>Описание:</label>
              <textarea
                placeholder='Введите описание товара'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
              ></textarea>
            </div>

            <div>
              <label className='block text-gray-700'>Изображение:</label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
              />
            </div>

            <div>
              <label className='block text-gray-700'>Категория:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
              >
                <option value={0}>Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button type='submit' className='w-full bg-secondary text-white py-2 rounded-md transition'>
              Создать товар
            </button>
          </form>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4'>Создать промокод</h2>
          <div className='grid gap-4'>
            <div>
              <label className='block text-gray-700'>Код промокода:</label>
              <input
                type='text'
                placeholder='Например: SUMMER2024'
                value={promocode.code}
                onChange={(e) => setPromocode({ ...promocode, code: e.target.value })}
                className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
              />
            </div>

            <div>
              <label className='block text-gray-700'>Скидка (%):</label>
              <input
                type='number'
                min='1'
                max='100'
                placeholder='Введите процент скидки'
                value={promocode.discount}
                onChange={(e) => setPromocode({ ...promocode, discount: Number(e.target.value) })}
                className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
              />
            </div>

            <div>
              <label className='block text-gray-700'>Описание:</label>
              <textarea
                placeholder='Описание промокода'
                value={promocode.description}
                onChange={(e) => setPromocode({ ...promocode, description: e.target.value })}
                className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
              />
            </div>

            <div>
              <label className='block text-gray-700'>Максимальное количество использований:</label>
              <input
                type='number'
                min='0'
                placeholder='0 = без ограничений'
                value={promocode.maxUses}
                onChange={(e) => setPromocode({ ...promocode, maxUses: Number(e.target.value) })}
                className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
              />
            </div>

            <div>
              <label className='block text-gray-700'>Действует до:</label>
              <input
                type='datetime-local'
                value={promocode.validUntil}
                onChange={(e) => setPromocode({ ...promocode, validUntil: e.target.value })}
                className='w-full border p-2 rounded-md focus:ring focus:ring-red-200'
              />
            </div>

            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={promocode.isActive}
                onChange={(e) => setPromocode({ ...promocode, isActive: e.target.checked })}
                className='rounded text-red-500'
              />
              <label className='text-gray-700'>Активен</label>
            </div>

            <button
              onClick={handlePromocodeCreate}
              className='w-full bg-secondary text-white py-2 rounded-md transition'
            >
              Создать промокод
            </button>
          </div>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4'>Список промокодов</h2>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse table-auto'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border p-2 text-left'>Код</th>
                  <th className='border p-2 text-left'>Скидка</th>
                  <th className='border p-2 text-left'>Описание</th>
                  <th className='border p-2 text-left'>Статус</th>
                  <th className='border p-2 text-left'>Использований</th>
                  <th className='border p-2 text-left'>Действует до</th>
                  <th className='border p-2 text-left'>Действия</th>
                </tr>
              </thead>
              <tbody>
                {promocodes.map((promo) => (
                  <tr key={promo.id} className='hover:bg-gray-50'>
                    <td className='border p-2'>{promo.code}</td>
                    <td className='border p-2'>{promo.discount}%</td>
                    <td className='border p-2'>{promo.description || '-'}</td>
                    <td className='border p-2'>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          promo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {promo.isActive ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td className='border p-2'>
                      {promo.usedCount} / {promo.maxUses || '∞'}
                    </td>
                    <td className='border p-2'>{promo.validUntil ? formatDate(promo.validUntil) : 'Бессрочно'}</td>
                    <td className='border p-2'>
                      <button
                        onClick={() => handlePromocodeDelete(promo.id)}
                        className='text-red-600 hover:text-red-800'
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default observer(AdminPage);
