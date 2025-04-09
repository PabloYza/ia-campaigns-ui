import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateKeywordGroup, removeKeywordGroup } from '@/store/slices/campaignsSlice';
import KeywordGroupCard from './KeywordGroupCard';

export default function KeywordGroupsList() {
	const keywordGroups = useSelector((state) => state.campaign.keywordGroups);
	const dispatch = useDispatch();

	const handleUpdateGroup = (index, groupData) => {
		dispatch(updateKeywordGroup({ index, groupData }));
	};

	const handleRemoveGroup = (index) => {
		dispatch(removeKeywordGroup(index));
	};

	return (
		<div className="space-y-6">
			{keywordGroups.map((group, index) => (
				<KeywordGroupCard
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
