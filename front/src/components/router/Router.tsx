import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Context } from '../../main';

import Login from '../auth/login/Login';
import Register from '../auth/register/Register';
import About from '../screens/about/About';
import AdminPage from '../screens/admin/AdminPage';
import CartPage from '../screens/cart/CartPage';
import CatalogPage from '../screens/catalogPage/CatalogPage';
import CategoryPage from '../screens/categoryPage/CategoryPage';
import CheckoutPage from '../screens/checkout/CheckoutPage';
import OrderSuccessPage from '../screens/checkout/OrderSuccessPage';
import Delivery from '../screens/delivery/Delivery';
import FavoritesPage from '../screens/favorite/FavouritePage';
import Profile from '../screens/profile/Profile';
import Layout from '../ui/layout/Layout';
import NotFound from './../screens/404/NotFound';
import Home from './../screens/home/Home';
// import Login from './../screens/login/Login';
// import AdminPage from './../screens/adminPage/AdminPage';

const Router = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);

  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='admin' element={<AdminPage />} />
          <Route index element={<Home />} />
          <Route path='profile' element={<Profile />} />
          <Route path='delivery' element={<Delivery />} />
          <Route path='about' element={<About />} />
          <Route path='auth/login' element={<Login />} />
          <Route path='auth/register' element={<Register />} />
          <Route path='catalog' element={<CatalogPage />} />
          <Route path='catalog/:categoryId' element={<CategoryPage />} />
          <Route path='cart' element={<CartPage />} />
          <Route path='checkout' element={<CheckoutPage />} />
          <Route path='order-success/:orderId' element={<OrderSuccessPage />} />
          <Route path='favorites' element={<FavoritesPage />} />
          <Route path='404' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default observer(Router);
