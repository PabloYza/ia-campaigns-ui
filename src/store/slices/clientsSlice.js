import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchClients = createAsyncThunk('clients/fetchClients', async () => {
	const response = await axios.get('/api/clients');
	return response.data;
});

export const addClient = createAsyncThunk('clients/addClient', async (clientData) => {
	const response = await axios.post('/api/clients', clientData);
	return response.data;
});

const clientsSlice = createSlice({
	name: 'clients',
	initialState: {
		list: [],
		activeClient: null,
		loading: false,
		error: null,
	},
	reducers: {
		setActiveClient: (state, action) => {
			state.activeClient = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchClients.pending, (state) => {
				state.loading = true;
			})
			.addCase(fetchClients.fulfilled, (state, action) => {
				state.loading = false;
				state.list = action.payload;
			})
			.addCase(fetchClients.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			})
			.addCase(addClient.fulfilled, (state, action) => {
				state.list.push(action.payload);
			});
	},
});

export const { setActiveClient } = clientsSlice.actions;
export default clientsSlice.reducer;
