import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	email: '',
	name: '',
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			return { ...state, ...action.payload };
		},
		clearUser() {
			return initialState;
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state) => state.user;
export default userSlice.reducer;
