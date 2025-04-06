import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Context } from '../../../main';
import Navbar from '../Navbar/Navbar';
import StickyCursor from '../cursor/stickyCursor';
import Footer from '../footer/Footer';

const Layout = () => {
  const { store } = useContext(Context);

  useEffect(() => {}, [store]);

  return (
    <div className='min-h-screen flex flex-col overflow-x-hidden'>
      <Navbar />
      <main className='flex-grow'>
        <Outlet />
      </main>
      <Footer />
      <StickyCursor />
    </div>
  );
};

export default observer(Layout);
