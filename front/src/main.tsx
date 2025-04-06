import { createContext, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './assets/styles/global.css';
import Router from './components/router/Router';
import store from './store/store';

export const Context = createContext({
  store,
});

createRoot(document.getElementById('root')!).render(
  <Context.Provider value={{ store }}>
    <StrictMode>
      <Router />
    </StrictMode>
  </Context.Provider>,
);
