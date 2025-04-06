import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Context } from '../../../main';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { store } = useContext(Context);
  const navigate = useNavigate();

  // Обработчик для блокировки скролла
  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Восстанавливаем позицию скролла
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Очищаем стили при размонтировании
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await store.logout();
    navigate('/auth/login');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className='lg:hidden overflow-hidden'>
      {/* Бургер кнопка */}
      <button onClick={toggleMenu} className='flex flex-col justify-center items-center w-8 h-8 relative z-50'>
        <span
          className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-black my-1 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-1' : ''
          }`}
        ></span>
      </button>

      {/* Мобильное меню */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex flex-col pt-24 px-8 h-full'>
          <nav className='flex flex-col gap-6 text-xl'>
            <Link to='/catalog' className='hover:text-secondary transition-colors' onClick={handleLinkClick}>
              Каталог
            </Link>
            <Link to='/delivery' className='hover:text-secondary transition-colors' onClick={handleLinkClick}>
              Доставка
            </Link>
            <Link to='/about' className='hover:text-secondary transition-colors' onClick={handleLinkClick}>
              О нас
            </Link>
            <Link to='/favorites' className='hover:text-secondary transition-colors' onClick={handleLinkClick}>
              Избранное
            </Link>
            <Link to='/cart' className='hover:text-secondary transition-colors' onClick={handleLinkClick}>
              Корзина
            </Link>
            {store.isAuth ? (
              <>
                <Link to='/profile' className='hover:text-secondary transition-colors' onClick={handleLinkClick}>
                  Профиль
                </Link>
                <button onClick={handleLogout} className='text-left text-red-500 hover:text-red-600 transition-colors'>
                  Выйти
                </button>
              </>
            ) : (
              <Link to='/auth/login' className='hover:text-secondary transition-colors' onClick={handleLinkClick}>
                Вход
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default observer(BurgerMenu);
