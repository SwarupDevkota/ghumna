import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedin: false,
    loading: false,
    userData: null,
    error: null,
  },
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedin = true;
      state.userData = action.payload; // payload = user data from API
    },
    signInFail: (state, action) => {
      state.loading = false;
      state.isLoggedin = false;
      state.userData = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedin = false;
      state.userData = null;
      state.error = null;
    },
    updateUserData: (state, action) => {
      state.userData = action.payload; // Update user data without affecting login state
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFail,
  logout,
  updateUserData,
} = userSlice.actions;

export default userSlice.reducer;
