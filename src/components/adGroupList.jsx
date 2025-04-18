import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateKeywordGroup, removeKeywordGroup } from '@/store/slices/campaignsSlice';
import AdGroupCard from './adGroupCard';

export default function AdGroupsList() {
	const adGroups = useSelector((state) => state.campaign.adGroups);
	const dispatch = useDispatch();

	const handleUpdateGroup = (index, groupData) => {
		dispatch(updateKeywordGroup({ index, groupData }));
	};

	const handleRemoveGroup = (index) => {
		dispatch(removeKeywordGroup(index));
	};

	return (
		<div className="space-y-6">
			{adGroups.map((group, index) => (
				<AdGroupCard
					key={index}
					index={index}
					groupData={group}
					onUpdateGroup={handleUpdateGroup}
					onRemoveGroup={handleRemoveGroup}
				/>
			))}
		</div>
	);
}
