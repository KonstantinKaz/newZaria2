import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Context } from '../../../main';

const Profile = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!store.isAuth) {
        navigate('/auth/login');
        return;
      }

      if (!store.user) {
        try {
          await store.getProfile();
        } catch (err) {
          console.error('Ошибка получения профиля:', err);
          navigate('/auth/login');
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!store.user) {
    return <p>Ошибка: пользователь не найден</p>;
  }

  return (
    <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] mb-10 my-[40px]'>
      <h2 className='text-[64px]'>ЛИЧНЫЙ КАБИНЕТ</h2>
      <div className='text-sm mb-4'>
        <Link to='/'>Главная</Link> <span className='mx-2'>›</span> Личный кабинет
      </div>

      <div className='flex flex-col lg:flex-row'>
        <div className='flex flex-col mr-0 lg:mr-[150px] mb-8 lg:mb-0'>
          <div className='bg-secondary text-white h-[236px] p-6 rounded-[30px] w-full lg:w-[463px] relative flex flex-col justify-between'>
            <h2 className='text-[40px] font-medium leading-[48px]'>Скидка 15%</h2>
            <div className='flex flex-col'>
              <span className='text-[12px] mt-4 opacity-80'>БОНУСЫ:</span>
              <span className='text-2xl font-bold'>200</span>
            </div>
            <div className='absolute top-4 right-4 cursor-pointer'>
              <img src='/images/i.svg' alt='i' className='text-lg font-semibold opacity-80 '></img>
            </div>
          </div>
          {/* Блок с кнопками */}
          <div className='flex flex-col sm:flex-row gap-4 mt-[30px] justify-center sm:justify-start'>
            <Link
              to='#'
              className='border b-point border-secondary px-3 py-3 rounded-[30px] flex items-center justify-center gap-2 w-full sm:w-[220px]'
            >
              <img src='/images/spin.svg' alt='repeat' className='w-5 h-5' />
              <span>уже покупали</span>
            </Link>
            <Link
              to='/favorites'
              className='border b-point border-secondary px-3 py-3 rounded-[30px] flex items-center justify-center gap-2 w-full sm:w-[220px]'
            >
              <img src='/images/lk_heart.svg' alt='heart' className='w-5 h-5' />
              <span>избранное</span>
            </Link>
          </div>
        </div>
        {/* Разделение на 2 колонки */}
        <div className='mt-0 lg:mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 w-full'>
          {/* Левая колонка */}
          <ul className='space-y-4'>
            <li className='flex justify-between'>
              <Link to='#' className='hover:underline'>
                служба поддержки
              </Link>{' '}
              <span>›</span>
            </li>
            <li className='flex justify-between'>
              <Link to='#' className='hover:underline'>
                мои адреса
              </Link>{' '}
              <span>›</span>
            </li>
            <li className='flex justify-between'>
              <Link to='#' className='hover:underline'>
                настройки
              </Link>{' '}
              <span>›</span>
            </li>
            <li className='flex justify-between'>
              <Link to='#' className='hover:underline'>
                мои покупки
              </Link>{' '}
              <span>›</span>
            </li>
            <li className='flex justify-between'>
              <Link to='#' className='hover:underline'>
                FAQ / частые вопросы
              </Link>{' '}
              <span>›</span>
            </li>
          </ul>
          {/* Правая колонка */}
          <ul className='space-y-4'>
            <li className='flex justify-between'>
              <Link to='#' className='hover:underline'>
                настройка уведомлений
              </Link>{' '}
              <span>›</span>
            </li>
            <li className='flex justify-between'>
              <Link to='#' className='hover:underline'>
                купить подарочную карту
              </Link>{' '}
              <span>›</span>
            </li>
            <li className='flex justify-between'>
              <Link to='#' className='hover:underline'>
                документы
              </Link>{' '}
              <span>›</span>
            </li>
            <li className='flex justify-between'>
              <Link to='#' className='hover:underline'>
                вакансии
              </Link>{' '}
              <span>›</span>
            </li>
            {store.user.rights == 'ADMIN' && (
              <li className='flex justify-between'>
                <Link to='/admin' className='hover:underline text-secondary'>
                  админ
                </Link>{' '}
                <span>›</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
