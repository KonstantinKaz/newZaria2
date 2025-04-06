import React from 'react';
import { Link } from 'react-router';

const Delivery: React.FC = () => {
  return (
    <div className='px-4 md:px-8 lg:px-10 xl:px-[100px] my-[20px] lg:my-[40px] relative'>
      <h2 className='text-[32px] lg:text-[64px]'>ДОСТАВКА</h2>
      <div className='text-sm mb-4'>
        <Link to='/'>Главная</Link> <span className='mx-2'>›</span> Доставка
      </div>

      {/* УСЛОВИЯ ОПЛАТЫ */}
      <section className='mb-10 flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-10'>
        <div className='flex flex-col w-full lg:w-[55%]'>
          <h2 className='text-[28px] lg:text-[40px] font-medium mb-[11px]'>Условия оплаты</h2>
          <div className='space-y-4 text-base leading-7'>
            <ul className='list-decimal pl-5 space-y-4'>
              <li>
                <span className='text-[18px] lg:text-[24px] font-semibold'>При доставке товара в г. Москве:</span>
                <ul className='list-none space-y-2 mt-2 text-[16px] lg:text-[24px] font-extralight'>
                  <li>– оплата за товар производится наличными Курьеру.</li>
                  <li>
                    – оплата за товар банковскими картами Visa, MasterCard, МИР через банковский терминал у Курьера.
                  </li>
                  <li>
                    – оплата можно произвести через интернет-магазин компании банковскими картами Visa, MasterCard, МИР,
                  </li>
                  <li>
                    – безналичным банковским переводом на расчётный счёт компании, указанном в выставленном счёте.
                  </li>
                </ul>
              </li>
              <li>
                <span className='text-[18px] lg:text-[24px] font-semibold'>
                  При доставке товара за МКАД и по России:
                </span>
                <ul className='list-none space-y-2 mt-2 text-[16px] lg:text-[24px] font-extralight'>
                  <li>
                    – безналичным банковским переводом на расчётный счёт компании, указанном в выставленном счёте.
                  </li>
                  <li>
                    – оплату можно произвести через интернет-магазин компании банковскими картами Visa, MasterCard, МИР
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div className='relative flex-1 hidden lg:block'>
          <img
            src='/images/red-car.png'
            alt='Красный автомобиль'
            className='absolute right-0 top-[-240px] max-w-[750px]'
          />
        </div>
      </section>

      {/* ВНИМАНИЕ! */}
      <section className='mb-10 border border-[#494949] rounded-[22.17px] py-6 lg:py-10 px-4 lg:px-8'>
        <h2 className='text-[28px] lg:text-[40px] font-semibold mb-4'>Внимание!</h2>
        <ul className='list-none space-y-2 text-[16px] lg:text-[24px] font-extralight'>
          <li>- без получения счета от интернет-магазина оплата за товар не производится.</li>
          <li>
            - до поступления денежных средств за оплату товара мы не резервируем товары на складе и не приступаем к
            формированию заказа.
          </li>
          <li>- срок оплаты счета составляет 3 суток с момента оформления заказа.</li>
          <li>- оплата принимается только от физических лиц. От юридических лиц оплата не принимается.</li>
        </ul>
      </section>

      {/* УСЛОВИЯ ДОСТАВКИ */}
      <section className='mb-10 py-6 lg:py-10'>
        {/* Фоновое изображение */}
        <img
          className='absolute inset-0 w-full h-full top-[39%] hidden lg:block'
          src='/images/Capa.svg'
          alt='Задний фон'
        />

        <div className='relative bg-opacity-90 rounded-lg'>
          <h2 className='text-[28px] lg:text-[40px] font-semibold mb-4'>Условия доставки</h2>
          <div className='space-y-4 text-base leading-7'>
            <div className='border border-[#494949] p-4 rounded-[22.17px] bg-gray-50 space-y-2 mt-4'>
              <p className='font-normal text-[18px] lg:text-[24px]'>бесплатная доставка при покупке от 3000 руб.</p>
              <p className='text-[16px] lg:text-[20px] font-extralight'>– минимальная сумма заказа 1000 руб.</p>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                – доставка товара по г. Москве осуществляется курьерской компанией в течение 3 рабочих дней с момента
                получения заказа. Стоимость доставки по г. Москве – 350 рублей, при покупке на сумму от 3000 руб. товар
                доставляется бесплатно.
              </p>
            </div>

            <div className='border p-4 border-[#494949] rounded-[22.17px] bg-gray-50 space-y-2 mt-4'>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                – доставка по г. Москва осуществляется с 10:00 до 18:00,
              </p>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                – доставка за МКАД и по России осуществляется через ФГУП «Почта России».
              </p>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                – срок отгрузки товара со склада интернет-магазина в ФГУП «Почта России» составляет не более 3 рабочих
                дней после получения оплаты по выставленному счету.
              </p>
              <p className='text-[16px] lg:text-[20px] font-extralight'>
                – после отправки товара через ФГУП «Почта России» покупателю высылается трек-номер для отслеживания
                доставки товара на указанный покупателем адрес.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Delivery;
