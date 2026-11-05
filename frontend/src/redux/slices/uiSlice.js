import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartDrawerOpen: false,
  isMobileNavOpen: false,
  searchQuery: '',
  toast: {
    visible: false,
    message: '',
    type: 'success', // 'success' | 'error' | 'info'
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCartDrawer: (state, action) => {
      state.isCartDrawerOpen = action.payload ?? !state.isCartDrawerOpen;
    },
    toggleMobileNav: (state, action) => {
      state.isMobileNavOpen = action.payload ?? !state.isMobileNavOpen;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    showToast: (state, action) => {
      state.toast = {
        visible: true,
        message: action.payload.message || action.payload,
        type: action.payload.type || 'success',
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
  },
});

export const {
  toggleCartDrawer,
  toggleMobileNav,
  setSearchQuery,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;

