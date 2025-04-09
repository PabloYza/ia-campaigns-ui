import { Trash2 } from 'lucide-react';

export const TrashIcon = ({ size = 20 }) => {
	return (
		<div className='m-1'>
			<Trash2 size={size} color='#f50000' />
		</div>
	)
}