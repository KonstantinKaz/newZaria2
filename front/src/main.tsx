import { createContext, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './assets/styles/global.css';
import Router from './components/router/Router';
import mobxStore from './store/store';
import { store } from './store/store';

export const Context = createContext({
  store: mobxStore,
});

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Context.Provider value={{ store: mobxStore }}>
      <StrictMode>
        <Router />
      </StrictMode>
    </Context.Provider>
  </Provider>,
);
