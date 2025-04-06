import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../main';
import { Link, useNavigate } from 'react-router';

const Register = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState(''); // Добавлено
  const [patronymic, setPatronymic] = useState(''); // Добавлено
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState(''); // Добавлено
  const [birthday, setBirthday] = useState(''); // Добавлено
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Перенаправление, если уже авторизован
  useEffect(() => {
    if (store.isAuth) {
      navigate('/profile');
    }
  }, [store.isAuth, navigate]);

  const handleRegister = async () => {
    setIsPending(true);
    setError(null);
    try {
      await store.register({
        name,
        surname,
        patronymic,
        email,
        gender,
        birthday,
        password,
      });
      navigate('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className='px-4 md:px-8 lg:px-10 xl:px-[100px]'>
      <div className='min-h-[314x] pt-[47px] flex flex-col justify-center items-center mb-[142px]'>
        <h2 className='text-[64px]'>Регистрация</h2>
        <form className='mt-[25.5px] w-[639px] flex flex-col justify-center items-center' onSubmit={(e) => e.preventDefault()}>
          <div className='mb-5'>
            <label className='text-gray-600'>
              <input
                onChange={(e) => setName(e.target.value)}
                className='b-point border-2 py-[15px] px-[15px] border-gray-input w-[339px] rounded-[5px]'
                value={name}
                type='text'
                placeholder='Имя'
                required
              />
            </label>
          </div>
          <div className='mb-5'>
            <label className='text-gray-600'>
              <input
                onChange={(e) => setSurname(e.target.value)}
                className='b-point border-2 py-[15px] px-[15px] border-gray-input w-[339px] rounded-[5px]'
                value={surname}
                type='text'
                placeholder='Фамилия'
                required
              />
            </label>
          </div>
          <div className='mb-5'>
            <label className='text-gray-600'>
              <input
                onChange={(e) => setPatronymic(e.target.value)}
                className='b-point border-2 py-[15px] px-[15px] border-gray-input w-[339px] rounded-[5px]'
                value={patronymic}
                type='text'
                placeholder='Отчество (необязательно)'
              />
            </label>
          </div>
          <div className='mb-5'>
            <label className='text-gray-600'>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className='b-point border-2 py-[15px] px-[15px] border-gray-input w-[339px] rounded-[5px]'
                value={email}
                type='email'
                placeholder='Email'
                required
              />
            </label>
          </div>
          <div className='mb-5'>
            <label className='text-gray-600'>
              <input
                onChange={(e) => setGender(e.target.value)}
                className='b-point border-2 py-[15px] px-[15px] border-gray-input w-[339px] rounded-[5px]'
                value={gender}
                type='text'
                placeholder='Пол'
              />
            </label>
          </div>
          <div className='mb-5'>
            <label className='text-gray-600'>
              <input
                onChange={(e) => setBirthday(e.target.value)}
                className='b-point border-2 py-[15px] px-[15px] border-gray-input w-[339px] rounded-[5px]'
                value={birthday}
                type='date'
                required
              />
            </label>
          </div>
          <div className='mb-5'>
            <label className='text-gray-600'>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className='b-point border-2 py-[15px] px-[15px] border-gray-input w-[339px] rounded-[5px]'
                value={password}
                type='password'
                placeholder='Пароль'
                required
              />
            </label>
          </div>

          {error && <p className='text-red-500'>{error}</p>}

          <div className='flex justify-between w-[339px]'>
            <button
              onClick={handleRegister}
              className='b-point py-4 bg-secondary text-white text-[16px] w-[147px] rounded-[5px] disabled:opacity-50'
              disabled={isPending}
            >
              Регистрация
            </button>
            <div className='flex flex-col justify-center'>
              <span className='text-[12px]'>Уже есть аккаунт?</span>
              <Link to='/auth/login' className='b-point text-[12px] text-gray-input underline decoration-solid underline-offset-2'>
                Войти
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default observer(Register);
