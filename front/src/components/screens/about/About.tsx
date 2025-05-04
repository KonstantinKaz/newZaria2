import React from 'react';
import { Link } from 'react-router';

const About: React.FC = () => {
  return (
    <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] my-[20px] lg:my-[40px]'>
      <div className='mb-8'>
        <h2 className='text-[32px] lg:text-[64px] mb-4'>О НАС</h2>
        <div className='text-sm'>
          <Link to='/'>Главная</Link> <span className='mx-2'>›</span> О нас
        </div>
      </div>

      {/* О КОМПАНИИ */}
      <section className='mb-10 lg:mb-[120px] relative'>
        <div className='flex flex-col lg:flex-row items-start gap-5 lg:gap-10'>
          <div className='flex flex-col w-full lg:w-[55%] relative z-10'>
            <h2 className='text-[28px] lg:text-[40px] font-medium mb-[11px]'>О компании</h2>
            <div className='space-y-4 text-base leading-7'>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                Мы - команда профессионалов, специализирующаяся на создании и продаже качественной одежды. Наша история
                началась с небольшого магазина, и сегодня мы - один из ведущих брендов на российском рынке.
              </p>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                Наша миссия - делать модную одежду доступной для каждого, не жертвуя качеством и стилем. Мы тщательно
                отбираем материалы и следим за каждым этапом производства.
              </p>
            </div>
          </div>
          <div className='w-full lg:w-[45%]'>
            <img src='/images/about.jpg' alt='О компании' className='w-full h-auto rounded-lg' />
          </div>
        </div>
      </section>

      {/* НАШИ ПРЕИМУЩЕСТВА */}
      <section className='mb-10 border border-[#494949] rounded-[22.17px] py-6 lg:py-10 px-4 lg:px-8 bg-white relative z-10'>
        <h2 className='text-[28px] lg:text-[40px] font-semibold mb-4'>Наши преимущества</h2>
        <ul className='list-none space-y-2 text-[16px] lg:text-[20px] font-extralight'>
          <li>- Только качественные материалы от проверенных поставщиков</li>
          <li>- Собственное производство с контролем качества на каждом этапе</li>
          <li>- Регулярное обновление коллекций в соответствии с последними трендами</li>
          <li>- Профессиональная команда дизайнеров и модельеров</li>
        </ul>
      </section>

      {/* НАШИ ЦЕННОСТИ */}
      <section className='relative z-10'>
        <div className='absolute inset-0 w-full h-full -z-10 opacity-30 hidden lg:block'>
          <img className='w-full h-full object-contain' src='/images/Capa.svg' alt='Задний фон' />
        </div>

        <div className='relative'>
          <h2 className='text-[28px] lg:text-[40px] font-semibold mb-6'>Наши ценности</h2>
          <div className='space-y-6'>
            <div className='border border-[#494949] p-4 lg:p-6 rounded-[22.17px] bg-white/90 space-y-3'>
              <p className='font-normal text-[18px] lg:text-[24px]'>Качество</p>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                Мы не идём на компромиссы когда речь идёт о качестве нашей продукции. Каждое изделие проходит тщательный
                контроль перед тем, как попасть к покупателю.
              </p>
            </div>

            <div className='border border-[#494949] p-4 lg:p-6 rounded-[22.17px] bg-white/90 space-y-3'>
              <p className='font-normal text-[18px] lg:text-[24px]'>Инновации</p>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                Мы постоянно следим за новыми технологиями в производстве одежды и внедряем современные решения для
                улучшения качества нашей продукции.
              </p>
            </div>

            <div className='border border-[#494949] p-4 lg:p-6 rounded-[22.17px] bg-white/90 space-y-3'>
              <p className='font-normal text-[18px] lg:text-[24px]'>Устойчивое развитие</p>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                Мы заботимся об окружающей среде и стремимся минимизировать влияние нашего производства на экологию,
                используя экологичные материалы и технологии.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
