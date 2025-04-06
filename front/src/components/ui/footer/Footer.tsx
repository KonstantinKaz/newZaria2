import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className='bg-secondary w-full'>
      <div className='py-[30px] lg:py-[60px] px-4 lg:px-[100px] flex flex-col'>
        <Link to='/' className='max-w-[150px] lg:max-w-[200px]'>
          <img src='/images/logo_white.svg' className='w-full h-auto' alt='Логотип «Новая Заря»' />
        </Link>
        <div className='flex flex-col lg:flex-row lg:justify-between mt-[27px] gap-8 lg:gap-[107px]'>
          {/* About */}
          <div className='flex flex-col justify-between lg:max-w-[549px]'>
            <span className='text-[24px] text-white font-bold'>Новая Заря</span>
            <p className='text-[16px] lg:text-[18px] text-white mt-[20px] lg:mt-[30px] mb-[30px] lg:mb-[47.53px]'>
              Добро пожаловать в место, где красота сочетается с инновациями. Наша миссия - дать людям возможность с
              уверенностью относиться к своей уникальной красоте. Стремясь к качеству и совершенству, мы предлагаем
              тщательно подобранную коллекцию парфюмерии, разработанную для того, чтобы улучшить вашу повседневную
              жизнь.
            </p>
            <div className='flex gap-[40px]'>
              <Link to='/'>
                <img src='/images/vk.svg' width={34} height={32} alt='Логотип VK' />
              </Link>
              <Link to='/'>
                <img src='/images/tg.svg' width={34} height={32} alt='Логотип Telegram' />
              </Link>
              <Link to='/'>
                <img src='/images/odn.svg' width={34} height={32} alt='Логотип Одноклассники' />
              </Link>
            </div>
          </div>
          {/* Разделы */}
          <div className='flex flex-col mt-8 lg:mt-0'>
            <span className='text-white text-[24px] font-bold'>Разделы</span>
            <ul className='flex flex-col text-sm text-white list-none mt-[17px] gap-[15px]'>
              <li>
                <Link to='/catalog' className='hover:opacity-80'>
                  Каталог
                </Link>
              </li>
              <li>
                <Link to='/delivery' className='hover:opacity-80'>
                  Доставка
                </Link>
              </li>
              <li>
                <Link to='/about' className='hover:opacity-80'>
                  О нас
                </Link>
              </li>
              <li>
                <Link to='/login' className='hover:opacity-80'>
                  Вход
                </Link>
              </li>
              <li>
                <Link to='/favorites' className='hover:opacity-80'>
                  Избранное
                </Link>
              </li>
              <li>
                <Link to='/cart' className='hover:opacity-80'>
                  Корзина
                </Link>
              </li>
            </ul>
          </div>
          {/* Contacts */}
          <div className='flex flex-col mt-8 lg:mt-0'>
            <span className='text-white text-[24px] font-bold'>Контакты</span>
            <p className='mt-[18px] mb-[32px] text-[16px] lg:text-[18px] text-white'>
              У вас есть вопросы или вам нужна помощь? Наша специализированная служба поддержки клиентов готова помочь
              вам.
            </p>
            <div className='flex flex-col gap-[7px]'>
              <Link to='tel:66565666666' className='flex hover:opacity-80'>
                <img src='/images/phone.svg' width={18} height={18} alt='Телефон' />
                <span className='text-white text-[18px] font-normal ml-[13px]'>6(656)56-666-66</span>
              </Link>
              <Link to='mailto:email@bk.ru' className='flex hover:opacity-80'>
                <img src='/images/mail.svg' width={18} height={18} alt='Почта' />
                <span className='text-white text-[18px] font-normal ml-[13px]'>email@bk.ru</span>
              </Link>
              <Link to='/' className='flex hover:opacity-80'>
                <img src='/images/geo.svg' width={18} height={18} alt='Адрес' />
                <span className='text-white text-[18px] font-normal ml-[13px]'>Москва Москва</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
