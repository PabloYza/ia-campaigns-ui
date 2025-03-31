import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const keywordsSlice = createSlice({
	name: 'keywords',
	initialState,
	reducers: {
		setKeywords(state, action) {
			return action.payload;
		},
		clearKeywords() {
			return [];
		},
	},
});

export const { setKeywords, clearKeywords } = keywordsSlice.actions;
export default keywordsSlice.reducer;
