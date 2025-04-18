import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	campaignName: "",
	clientName: "",
	clientUrl: "",
	description: "",
	adGroups: [
		{
			groupName: "",
			destinationUrl: "",
			keywords: []
		}
	],
	initialKeywords: [],
};

const campaignSlice = createSlice({
	name: "campaign",
	initialState,
	reducers: {
		setCampaignName: (state, action) => {
			state.campaignName = action.payload;
		},
		setClientName: (state, action) => {
			state.clientName = action.payload;
		},
		setDescription: (state, action) => {
			state.description = action.payload;
		},
		setClientUrl: (state, action) => {
			state.clientUrl = action.payload;
		},
		addKeywordGroup: (state, action) => {
			state.adGroups.push({
				groupName: action.payload.groupName,
				destinationUrl: action.payload.destinationUrl || "",
				keywords: action.payload.keywords || [],
			});
		},
		updateKeywordGroup: (state, action) => {
			const { index, groupData } = action.payload;
			if (state.adGroups[index]) {
				state.adGroups[index] = {
					...state.adGroups[index],
					...groupData,

				};
			}
		},
		removeKeywordGroup: (state, action) => {
			state.adGroups.splice(action.payload, 1);
		},
		resetCampaign: () => initialState,
		setInitialKeywords: (state, action) => {
			state.initialKeywords = action.payload;
		},
	},
});

export const {
	setCampaignName,
	setClientName,
	setDescription,
	addKeywordGroup,
	updateKeywordGroup,
	resetCampaign,
	setClientUrl,
	removeKeywordGroup,
	setInitialKeywords
} = campaignSlice.actions;

export default campaignSlice.reducer;


