import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCartDrawerOpen: false,
  isMobileNavOpen: false,
  searchQuery: '',
  isLoginModalOpen: false,
  loginModalRedirectPath: null, // path to go to after login
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
    openLoginModal: (state, action) => {
      state.isLoginModalOpen = true;
      state.loginModalRedirectPath = action.payload || null;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
      state.loginModalRedirectPath = null;
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
  openLoginModal,
  closeLoginModal,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;

