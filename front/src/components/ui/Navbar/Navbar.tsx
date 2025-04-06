import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Context } from '../../../main';
import BurgerMenu from '../BurgerMenu/BurgerMenu';

const Navbar = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (store.isAuth && !store.user) {
        try {
          const profile = await store.getProfile();
          setUser({ name: profile.name, email: profile.email });
        } catch (err) {
          console.error('Ошибка при загрузке профиля:', err);
        }
      } else if (store.user) {
        setUser({ name: store.user.name, email: store.user.email });
      }
    };

    loadUser();
  }, [store.isAuth, store.user]);

  const handleLogout = async () => {
    await store.logout();
    setUser(null);
    navigate('/auth/login');
  };

  return (
    <div className='h-20 pt-5 px-4 md:px-8 lg:px-10 xl:px-[100px] relative'>
      {/* MOBILE */}
      <div className='h-full flex items-center justify-between lg:hidden'>
        <Link to='/'>
          <img src='/images/logo.svg' width={70} height={50} alt='Логотип' />
        </Link>
        <BurgerMenu />
      </div>
      {/* BIGGER */}
      <div className='hidden lg:flex items-center h-full justify-between'>
        {/* LEFT */}
        <div className='flex gap-[80px]'>
          <Link to='/catalog' className='b-point hover:text-secondary transition-colors'>
            Каталог
          </Link>
          <Link to='/delivery' className='b-point hover:text-secondary transition-colors'>
            Доставка
          </Link>
          <Link to='/about' className='b-point hover:text-secondary transition-colors'>
            О нас
          </Link>
        </div>
        {/* LOGO */}
        <Link to='/'>
          <img className='b-point' src='/images/logo.svg' width={90} height={50} alt='Логотип' />
        </Link>
        {/* RIGHT */}
        <div className='flex gap-[80px] items-center'>
          <Link to='/favorites' className='b-point hover:text-secondary transition-colors easy-in-out duration-300'>
            Избранное
          </Link>
          <Link to='/cart' className='b-point hover:text-secondary transition-colors easy-in-out duration-300'>
            Корзина
          </Link>
          {store.isAuth && user ? (
            <div className='flex items-center gap-4'>
              <Link to='/profile' className='b-point hover:text-secondary transition-colors'>
                {user.name}
              </Link>
              <button onClick={handleLogout} className='b-point text-red-500'>
                <img src='/images/logout.svg' alt='' />
              </button>
            </div>
          ) : (
            <Link to='/auth/login' className='b-point hover:text-secondary transition-colors'>
              Вход
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(Navbar);
