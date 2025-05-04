import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICartItem, ICartState, IPromocode } from './cart.types';

const initialState: ICartState = {
  items: [],
  total: 0,
  promocode: null,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ICartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.total = calculateTotal(state);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateTotal(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = calculateTotal(state);
      }
    },
    applyPromocode: (state, action: PayloadAction<IPromocode>) => {
      console.log('Applying promocode to state:', action.payload);
      state.promocode = action.payload;
      state.total = calculateTotal(state);
      console.log('New state after applying promocode:', state);
    },
    removePromocode: (state) => {
      console.log('Removing promocode from state');
      state.promocode = null;
      state.total = calculateTotal(state);
      console.log('New state after removing promocode:', state);
    },
    resetCart: (state) => {
      console.log('Resetting cart state');
      state.items = [];
      state.total = 0;
      state.promocode = null;
      console.log('New state after reset:', state);
    },
  },
});

const calculateTotal = (state: ICartState): number => {
  const subtotal = state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  if (state.promocode) {
    const discount = (subtotal * state.promocode.discount) / 100;
    console.log(`Calculating total with discount: ${subtotal} - ${discount} = ${subtotal - discount}`);
    return subtotal - discount;
  }
  return subtotal;
};

export const cartActions = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
