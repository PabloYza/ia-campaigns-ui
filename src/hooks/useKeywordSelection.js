import { useDispatch, useSelector } from 'react-redux';
import {
	setSelectedKeywords,
	clearSelectedKeywords
} from '@/store/slices/campaignsSlice';

export default function useKeywordSelection() {
	const dispatch = useDispatch();
	const selected = useSelector(state => state.campaign.selectedKeywords);
	const selectedKeywords = Array.isArray(selected) ? selected : [];

	const toggleKeyword = (kw) => {
		if (selectedKeywords.includes(kw)) {
			dispatch(setSelectedKeywords(selectedKeywords.filter(k => k !== kw)));
		} else {
			dispatch(setSelectedKeywords([...selectedKeywords, kw]));
		}
	};

	const clearSelection = () => {
		dispatch(clearSelectedKeywords());
	};

	const isSelected = (kw) => selectedKeywords.includes(kw);

	return {
		selectedKeywords,
		toggleKeyword,
		clearSelection,
		isSelected
	};
}
