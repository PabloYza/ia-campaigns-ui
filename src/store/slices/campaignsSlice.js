import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	campaignName: "",
	clientName: "",
	clientUrl: "",
	description: "",
	audience: "",
	campaignType: "",
	campaignUrl: "",
	adGroups: [
		{
			groupName: "",
			destinationUrl: "",
			keywords: [],
			headlines: [],
			descriptions: [],
			path1: "",
			path2: "",
		},
	],
	selectedKeywords: [],
	globalKeywords: [],
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
		setClientUrl: (state, action) => {
			state.clientUrl = action.payload;
		},
		setDescription: (state, action) => {
			state.description = action.payload;
		},
		setAudience: (state, action) => {
			state.audience = action.payload;
		},
		setCampaignType: (state, action) => {
			state.campaignType = action.payload;
		},
		setCampaignUrl: (state, action) => {
			state.campaignUrl = action.payload;
		},
		setGlobalKeywords: (state, action) => {
			state.globalKeywords = action.payload;
		},
		addKeywordGroup: (state, action) => {
			state.adGroups.push({
				groupName: action.payload.groupName || "",
				destinationUrl: action.payload.destinationUrl || "",
				keywords: action.payload.keywords || [],
				headlines: action.payload.headlines || [],
				descriptions: action.payload.descriptions || [],
				path1: action.payload.path1 || "",
				path2: action.payload.path2 || "",
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
		setSelectedKeywords: (state, action) => {
			state.selectedKeywords = action.payload;
		},
		clearSelectedKeywords: (state) => {
			state.selectedKeywords = [];
		},
		updateGroupsBulk: (state, action) => {
			state.adGroups = action.payload;
		},
		updateAdGroupCopies: (state, action) => {
			const { groupName, headlines, descriptions } = action.payload;
			const index = state.adGroups.findIndex(group => group.groupName === groupName);
			if (index !== -1) {
				state.adGroups[index].headlines = headlines;
				state.adGroups[index].descriptions = descriptions;
			}
		}
	},
});

export const {
	setCampaignName,
	setClientName,
	setClientUrl,
	setDescription,
	setAudience,
	setCampaignType,
	setCampaignUrl,
	setGlobalKeywords,
	addKeywordGroup,
	updateKeywordGroup,
	removeKeywordGroup,
	resetCampaign,
	setSelectedKeywords,
	clearSelectedKeywords,
	updateGroupsBulk,
	updateAdGroupCopies,
} = campaignSlice.actions;

export default campaignSlice.reducer;
