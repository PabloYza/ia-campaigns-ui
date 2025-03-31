import { createSlice } from '@reduxjs/toolkit';

const initialState = []; // [{ id, title, body, groupName }]

const copiesSlice = createSlice({
	name: 'copies',
	initialState,
	reducers: {
		setCopies(state, action) {
			return action.payload;
		},
		updateCopy(state, action) {
			const index = state.findIndex(copy => copy.id === action.payload.id);
			if (index !== -1) {
				state[index] = { ...state[index], ...action.payload };
			}
		},
		clearCopies() {
			return [];
		}
	},
});

export const { setCopies, updateCopy, clearCopies } = copiesSlice.actions;
export default copiesSlice.reducer;
