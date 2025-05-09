import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateKeywordGroup, removeKeywordGroup } from '@/store/slices/campaignsSlice';
import AdGroupCard from './adGroupCard';
import useConfirmToast from '@/hooks/useConfirmToast.jsx';


export default function AdGroupsList({ isKeywordDuplicate }) {
	const adGroups = useSelector((state) => state.campaign.adGroups);
	const dispatch = useDispatch();

	const handleUpdateGroup = (index, groupData) => {
		dispatch(updateKeywordGroup({ index, groupData }));
	};

	const handleRemoveGroup = (index) => {
		useConfirmToast({
			message: '¿Eliminar este grupo de anuncio?',
			onConfirm: () => dispatch(removeKeywordGroup(index)),
		});
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
					isKeywordDuplicate={isKeywordDuplicate}
				/>
			))}
		</div>
	);
}
