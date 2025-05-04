import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../main';

import Home from './../screens/home/Home';
import NotFound from './../screens/404/NotFound';
import Layout from '../ui/layout/Layout';
import Login from '../auth/login/Login';
import Register from '../auth/register/Register';
import Profile from '../screens/profile/Profile';
import Delivery from '../screens/delivery/Delivery';
import AdminPage from '../screens/admin/AdminPage';
import CatalogPage from '../screens/catalogPage/CatalogPage';
import CategoryPage from '../screens/categoryPage/CategoryPage';
import CartPage from '../screens/cart/CartPage';
import FavoritesPage from '../screens/favorite/FavouritePage';
import About from '../screens/about/About'
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
            <Route path="/" element={<Layout />}>
                <Route path="admin" element={<AdminPage />} />
                <Route index element={<Home />} />
                <Route path="profile" element={<Profile />} />
                <Route path="delivery" element={<Delivery />} />
                <Route path="about" element={<About />} />
                <Route path="auth/login" element={<Login />} />
                <Route path="auth/register" element={<Register />} />
                <Route path="catalog" element={<CatalogPage />} />
                <Route path="catalog/:categoryId" element={<CategoryPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="404" element={<NotFound />} />
            </Route>
        </Routes>
    </BrowserRouter>
  );
};

export default observer(Router);
