import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	googleAdsStrategy: [],
	semrushStrategy: [],
};

const keywordStrategySlice = createSlice({
	name: "strategy",
	initialState,
	reducers: {
		setGoogleAdsStrategy: (state, action) => {
			state.googleAdsStrategy = action.payload;
		},
		setSemrushStrategy: (state, action) => {
			state.semrushStrategy = action.payload;
		},
		resetStrategies: () => initialState,
	},
});

export const {
	setGoogleAdsStrategy,
	setSemrushStrategy,
	resetStrategies,
} = keywordStrategySlice.actions;

export default keywordStrategySlice.reducer;
