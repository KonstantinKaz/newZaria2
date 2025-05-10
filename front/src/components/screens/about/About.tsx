import { ArrowUp } from "lucide-react"

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 bg-white">
      {/* Contacts Section */}
      <section className="mb-16">
        <h1 className="text-4xl font-serif mb-1">КОНТАКТЫ</h1>
        <div className="text-sm text-[#757575] mb-6">
          <span>ГЛАВНАЯ</span> <span className="mx-1">•</span> <span>КОНТАКТЫ</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-[#6c0206] font-medium mb-1">Адрес</h3>
              <p>119435, г. Москва, Саввинская набережная 25</p>
            </div>

            <div className="mb-6">
              <h3 className="text-[#6c0206] font-medium mb-1">Режим работы</h3>
              <p>Пн – Пт: с 9:00 до 18:00</p>
            </div>

            <div className="mb-6">
              <h3 className="text-[#6c0206] font-medium mb-1">Телефон</h3>
              <p>8 (499) 237-00-32&nbsp;&nbsp;&nbsp;8 (499) 237-19-07</p>
            </div>

            <div className="mb-6">
              <h3 className="text-[#6c0206] font-medium mb-1">E-mail</h3>
              <p>
                <a href="mailto:inetshop@novzar.ru" className="text-[#6c0206] underline">
                  inetshop@novzar.ru
                </a>
              </p>
            </div>

            <div className="flex gap-3">
              <a href="#" className="bg-[#6c0206] text-white rounded-full w-10 h-10 flex items-center justify-center">
                <span className="sr-only">VK</span>
                <span className="font-bold">VK</span>
              </a>
              <a href="#" className="bg-[#6c0206] text-white rounded-full w-10 h-10 flex items-center justify-center">
                <span className="sr-only">Telegram</span>
                <span className="font-bold">TG</span>
              </a>
              <a href="#" className="bg-[#6c0206] text-white rounded-full w-10 h-10 flex items-center justify-center">
                <span className="sr-only">OK</span>
                <span className="font-bold">OK</span>
              </a>
            </div>
          </div>

          <div className="flex-1 border border-[#d9d9d9]">
            <img
              src="/images/карта.png"
              alt="Карта"
              width={500}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Factory History Section */}
      <section className="mb-16">
        <div className="relative mb-8">
          <img
            src="/images/фабрика.png"
            alt="Историческое изображение фабрики"
            width={800}
            height={400}
            className="w-full"
          />
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-8">
          <div className="md:w-2/3">
            <p className="mb-4">
              Парфюмерная фабрика "Новая Заря" - одна из старейших в Москве. Она была создана в{" "}
              <strong>1864 году</strong> французским подданным, потомственным парфюмером{" "}
              <strong>Генрихом Брокаром</strong>.
            </p>
            <p className="mb-4">
              Начатое с выпуска дешевого мыла, производство стало быстро развиваться и расширяться. В начале 70-х годов
              Брокар приступает к выпуску "Высокой парфюмерии" - духов и одеколонов. В 1869 году фабрика Брокара нашла
              свое постоянное место: она расположилась на углу Арсеньевского переулка и Малой Серпуховской (ныне
              Люсиновская улица), где и находится по сей день.
            </p>
          </div>
          <div className="md:w-1/3">
            <img
              src="/images/духи.png"
              alt="Винтажные флаконы духов"
              width={250}
              height={300}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-4">
            С этого момента каждый год существования фабрики становится все более и более успешным. Ни одно событие, где
            участвовала фабрика Брокара, не оставалось без наград, всевозможных медалей и почестей.
          </p>
          <p className="mb-4">
            Следуя этой благоприятной тенденции, к 1914 году фабрика обладала <strong>35 золотыми медалями</strong>,
            полученными на Всемирных выставках в <strong>Париже, Ницце, Барселоне</strong> и других мировых центрах.
            После Октябрьской революции 1917 года фабрика, по предложению главного парфюмера Августа Мишеля, работавшего
            на предприятии еще со времен "Брокар и Ко", фабрика получила свое современное название - "Новая Заря". В
            послевоенные годы начинается новый этап в развитии "Новой Зари": растет производство, расширяется
            ассортимент выпускаемой продукции. В это время фабрика выпускает более 200 наименований товаров, что
            составляло 64% всей парфюмерной продукции СССР.
          </p>
          <p className="mb-4">
            Сегодняшний день фабрики - это напряженная работа. "Новая Заря" основывает свою деятельность на сохранении
            достижений прошлого и разработках новых современных ароматов. Многое становится возможным благодаря бережно
            сохраненному на фабрике архиву, который ведется со времен Брокара. Специалисты фабрики придерживаются
            основных принципа ее основателя: максимальное использование натуральных компонентов!
          </p>
          <p>
            Более подробно о достопримечательностях и истории фабрики можно почитать{" "}
            <a href="#" className="text-[#6c0206] underline">
              здесь
            </a>
            .
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <h3 className="text-2xl mb-2">
              Если у вас есть
              <br />
              <span className="text-[#6c0206] font-medium">ВОПРОСЫ или ПОЖЕЛАНИЯ</span>
            </h3>
            <p className="mb-4">к нашей компании, вы можете задать их здесь</p>

            <div className="mt-8">
              <p className="mb-2">Общество с ограниченной ответственностью</p>
              <p className="mb-2">«Парфюм Косметик Сервис»</p>
              <p className="mb-2">119435, г. Москва, Саввинская набережная, 25</p>
              <p>ОГРН 1077763339939</p>
            </div>
          </div>

          <div className="md:w-1/2">
            <form className="space-y-4">
              <div>
                <label className="block mb-1">Ваше Имя*</label>
                <input type="text" className="w-full border border-[#d9d9d9] p-2" placeholder="Ваше имя*" />
              </div>
              <div>
                <label className="block mb-1">Телефон*</label>
                <input type="tel" className="w-full border border-[#d9d9d9] p-2" placeholder="Телефон*" />
              </div>
              <div>
                <label className="block mb-1">Email*</label>
                <input type="email" className="w-full border border-[#d9d9d9] p-2" placeholder="Email*" />
              </div>
              <div>
                <label className="block mb-1">Вопрос*</label>
                <textarea className="w-full border border-[#d9d9d9] p-2 h-24" placeholder="Вопрос*"></textarea>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" id="agreement" />
                <label htmlFor="agreement" className="text-sm">
                  Я соглашаюсь с условиями{" "}
                  <a href="#" className="underline">
                    Пользовательского соглашения
                  </a>{" "}
                  и{" "}
                  <a href="#" className="underline">
                    Политикой об обработке и защите персональных данных
                  </a>
                </label>
              </div>
              <button type="submit" className="bg-[#6c0206] text-white py-2 px-8 w-full">
                Отправить
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <div className="fixed bottom-8 right-8">
        <a
          href="#"
          className="bg-white border border-[#d9d9d9] rounded-full w-10 h-10 flex items-center justify-center shadow-md"
        >
          <ArrowUp className="w-5 h-5" />
        </a>
      </div>
    </div>
  )
}
