import StarRating from '../../ui/starRating';

const Home = () => {
  return (
    <div className='flex flex-col px-4 lg:px-10 xl:px-[100px] overflow-hidden w-full'>
      {/* HERO */}
      <section className='flex-grow pt-[75px] flex flex-col lg:flex-row justify-between items-center w-full'>
        <div className='flex flex-col justify-between self-start w-full lg:w-auto mb-8 lg:mb-0'>
          <div className='relative w-full'>
            <span className='text-[28px] lg:text-[40px] font-light break-words'>Интернет-магазин</span>
            <h1 className='uppercase text-[32px] lg:text-h1 w-full relative lg:absolute break-words lg:whitespace-nowrap'>
              "Новая Заря"
            </h1>
          </div>
          <div className='w-full'>
            <p className='text-[20px] lg:text-[27px] mb-[32px] lg:mb-[62px] mt-[32px] lg:mt-[200px]'>
              Официальный интернет-магазин парфюмерии и косметики знаменитой московской фабрики.
            </p>
            <button
              type='submit'
              className='bg-secondary w-full lg:w-[320px] h-[54px] lg:h-[64px] text-white rounded-[40px] b-point'
            >
              <span className='text-[18px] lg:text-[20px] fort-semibold'>Перейти в каталог</span>
            </button>
          </div>
        </div>
        <div className='hidden lg:flex justify-center lg:justify-between items-end mt-8 lg:mt-0 w-full lg:w-auto'>
          <div className='relative h-[206px] lg:h-[306px] w-[146px] lg:w-[196px] mr-[36px] lg:mr-[76.5px]'>
            <div className='absolute inset-0 translate-y-2 lg:translate-y-3 translate-x-2 lg:translate-x-3 border-2 border-secondary rounded-[80px] lg:rounded-[106.11px]'></div>
            <img
              src='/images/perfume/1.png'
              alt='Одеколон «Красная Москва»'
              className='h-full w-full object-cover rounded-[80px] lg:rounded-[106.11px]'
            />
          </div>
          <div className='relative h-[417px] lg:h-[517px] w-[259px] lg:w-[309px]'>
            <div className='absolute inset-0 translate-y-3 lg:translate-y-5 translate-x-2 lg:translate-x-4 border-2 border-secondary rounded-[140px] lg:rounded-[171.89px]'></div>
            <img
              src='/images/perfume/2.jpg'
              alt='Одеколон «Красная Москва»'
              className='h-full w-full object-cover rounded-[140px] lg:rounded-[171.89px]'
            />
          </div>
        </div>
      </section>
      {/* ADD */}
      <div className='flex-shrink-0 relative my-[20px] lg:my-[30px] w-full'>
        <div className='flex justify-center mx-auto my-0 h-16 lg:h-20 gradient-border rounded-[40px] w-full lg:w-[760px] relative'>
          <span className='text-sm lg:text-base self-center px-4 text-center'>
            Бесплатная доставка при заказе от 3000 рублей
          </span>
          <div className='absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 border-2 border-secondary w-full h-full rounded-[40px] -z-[1]'></div>
        </div>
      </div>
      {/* COLLECTION */}
      <section className='flex-grow min-h-[598.04px] mb-[30px] lg:mb-[44px] w-full'>
        <span className='text-[28px] lg:text-[40px] underline underline-offset-8 decoration-secondary decoration-2'>
          Коллекции
        </span>
        <div className='flex justify-center items-center mt-[44px] w-full'>
          <ul className='flex flex-col sm:flex-row sm:flex-wrap justify-center xl:justify-between w-[90%] gap-4 lg:gap-[40.03px] px-1'>
            <li className='aspect-[1/1.6] w-full sm:w-[280px] lg:h-[500px] b-point'>
              <div className='h-[90%] w-full lg:w-[280px] relative mb-2.5'>
                <img src='/images/perfume/cat1.png' alt='perfume' className='h-full w-full object-cover' />
              </div>
              <span className='text-sm lg:text-base'>Для женщин</span>
            </li>
            <li className='aspect-[1/1.6] w-full sm:w-[280px] lg:h-[500px] b-point'>
              <div className='h-[90%] w-full lg:w-[280px] relative mb-2.5'>
                <img src='/images/perfume/cat2.png' alt='perfume' className='h-full w-full object-cover' />
              </div>
              <span className='text-sm lg:text-base'>Для мужчин</span>
            </li>
            <li className='aspect-[1/1.6] w-full sm:w-[280px] lg:h-[500px] b-point'>
              <div className='h-[90%] w-full lg:w-[280px] relative mb-2.5'>
                <img src='/images/perfume/cat3.png' alt='perfume' className='h-full w-full object-cover' />
              </div>
              <span className='text-sm lg:text-base'>Для детей</span>
            </li>
            <li className='aspect-[1/1.6] w-full sm:w-[280px] lg:h-[500px] b-point'>
              <div className='h-[90%] w-full lg:w-[280px] relative mb-2.5'>
                <img src='/images/perfume/cat4.png' alt='perfume' className='h-full w-full object-cover' />
              </div>
              <span className='text-sm lg:text-base'>Для дома</span>
            </li>
          </ul>
        </div>
      </section>
      {/* HITS */}
      <section className='flex-grow mb-[50px] lg:mb-[100px] w-full'>
        <span className='text-[28px] lg:text-[40px] underline underline-offset-8 decoration-secondary decoration-2'>
          Хиты продаж
        </span>
        <div className='flex justify-start items-center mt-[30px] lg:mt-[44px] w-full overflow-x-hidden'>
          <ul className='flex flex-col sm:flex-row sm:flex-wrap justify-center xl:justify-between gap-4 pb-4 w-full px-1'>
            <li className='aspect-[1/1.6] w-full sm:w-[416px] lg:h-[692px] p-4 lg:p-[25px] border-2 b-point'>
              <div className='h-[75%] w-full relative bg-zinc-200 mb-[24px]'>
                <img src='/images/perfume/hit1.png' alt='perfume' className='h-full w-full object-cover' />
              </div>
              <div className='flex flex-col h-[20%]'>
                <span className='text-[24px] lg:text-[32px] font-light tracking-[-0.08em] mb-[15px]'>
                  Красная Москва
                </span>
                <div className='flex justify-between items-center h-full w-full'>
                  <span className='text-[20px] lg:text-[24px] font-semibold'>₽200</span>
                  <StarRating rating={2} />
                </div>
              </div>
            </li>
            <li className='aspect-[1/1.6] w-full sm:w-[416px] lg:h-[692px] p-4 lg:p-[25px] border-2 b-point'>
              <div className='h-[75%] w-full relative bg-zinc-200 mb-[24px]'>
                <img src='/images/perfume/hit2.png' alt='perfume' className='h-full w-full object-cover' />
              </div>
              <div className='flex flex-col h-[20%]'>
                <span className='text-[24px] lg:text-[32px] font-light tracking-[-0.08em] mb-[15px]'>
                  Красная Москва
                </span>
                <div className='flex justify-between items-center h-full w-full'>
                  <span className='text-[20px] lg:text-[24px] font-semibold'>₽200</span>
                  <StarRating rating={3} />
                </div>
              </div>
            </li>
            <li className='aspect-[1/1.6] w-full sm:w-[416px] lg:h-[692px] p-4 lg:p-[25px] border-2 b-point'>
              <div className='h-[75%] w-full relative bg-zinc-200 mb-[24px]'>
                <img src='/images/perfume/hit3.png' alt='perfume' className='h-full w-full object-cover' />
              </div>
              <div className='flex flex-col h-[20%]'>
                <span className='text-[24px] lg:text-[32px] font-light tracking-[-0.08em] mb-[15px]'>
                  Красная Москва
                </span>
                <div className='flex justify-between items-center h-full w-full'>
                  <span className='text-[20px] lg:text-[24px] font-semibold'>₽200</span>
                  <StarRating rating={5} />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
