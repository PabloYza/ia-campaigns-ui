import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	campaignName: "",
	clientName: "",
	clientUrl: "",
	description: "",
	keywordGroups: [
		{
			groupName: "",
			destinationUrl: "",
			keywords: []
		}
	],
	createdAt: null,
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
		setCreatedAt: (state, action) => {
			state.createdAt = action.payload;
		},
		addKeywordGroup: (state, action) => {
			state.keywordGroups.push({
				groupName: action.payload.groupName,
				destinationUrl: action.payload.destinationUrl || "",
				keywords: action.payload.keywords || [],
			});
		},
		updateKeywordGroup: (state, action) => {
			const { index, groupData } = action.payload;
			if (state.keywordGroups[index]) {
				state.keywordGroups[index] = {
					...state.keywordGroups[index],
					...groupData,

				};
			}
		},
		removeKeywordGroup: (state, action) => {
			state.keywordGroups.splice(action.payload, 1);
		},
		resetCampaign: () => initialState,
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
	setCreatedAt,
} = campaignSlice.actions;

export default campaignSlice.reducer;


