import React, { useState, useEffect, FormEvent } from 'react';
import { observer } from 'mobx-react-lite';
import CategoryService from '../../../services/CategoryService';
import ProductService from '../../../services/ProductService';
import { ICategory } from '../../../models/product/ICategory';
import { ICreateCategoryDto } from '../../../models/product/ICreateCategoryDto';

const AdminPage: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState<ICreateCategoryDto>({ name: '' });
  const [message, setMessage] = useState<string>('');

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Админка</h1>

        {message && <p className="mb-4 text-center text-lg text-red-500">{message}</p>}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Создать категорию</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Название категории"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ name: e.target.value })}
              className="w-full border p-2 rounded-md focus:ring focus:ring-red-200"
            />
            <button
              onClick={handleCategoryCreate}
              className="bg-secondary b-point text-white px-4 py-2 rounded-md transition"
            >
              Создать
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Создать товар</h2>
          <form onSubmit={handleProductCreate} className="grid gap-4">
            <div>
              <label className="block text-gray-700">Название товара:</label>
              <input
                type="text"
                placeholder="Введите название товара"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 rounded-md focus:ring focus:ring-red-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Цена:</label>
                <input
                  type="number"
                  placeholder="Введите цену"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border p-2 rounded-md focus:ring focus:ring-red-200"
                />
              </div>
              <div>
                <label className="block text-gray-700">Количество:</label>
                <input
                  type="number"
                  placeholder="Введите количество"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border p-2 rounded-md focus:ring focus:ring-red-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700">Описание:</label>
              <textarea
                placeholder="Введите описание товара"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded-md focus:ring focus:ring-red-200"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700">Изображение:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                className="w-full border p-2 rounded-md focus:ring focus:ring-red-200"
              />
            </div>

            <div>
              <label className="block text-gray-700">Категория:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full border p-2 rounded-md focus:ring focus:ring-red-200"
              >
                <option value={0}>Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 rounded-md transition"
            >
              Создать товар
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default observer(AdminPage);
