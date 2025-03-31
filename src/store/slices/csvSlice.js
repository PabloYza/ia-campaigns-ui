import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	fileName: '',
	structure: [], // [{ group: 'Grupo A', title: '', description: '', url: '' }]
};

const csvSlice = createSlice({
	name: 'csv',
	initialState,
	reducers: {
		setCsvData(state, action) {
			state.fileName = action.payload.fileName;
			state.structure = action.payload.structure;
		},
		clearCsv() {
			return initialState;
		},
	},
});

export const { setCsvData, clearCsv } = csvSlice.actions;
export default csvSlice.reducer;
