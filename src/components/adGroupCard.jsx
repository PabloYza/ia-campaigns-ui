import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { TrashIcon } from '@/components/ui/trashIcon';

export default function AdGroupCard({ index, groupData, onUpdateGroup, onRemoveGroup }) {
	const [newKeyword, setNewKeyword] = useState('');

	const handleKeywordDelete = (i) => {
		const updatedKeywords = [...groupData.keywords];
		updatedKeywords.splice(i, 1);
		onUpdateGroup(index, {
			keywords: updatedKeywords,
		});
	};

	const handleAddKeyword = () => {
		const trimmed = newKeyword.trim();
		if (trimmed && !groupData.keywords.includes(trimmed)) {
			const updatedKeywords = [...groupData.keywords, trimmed];
			onUpdateGroup(index, { keywords: updatedKeywords });
		}
		setNewKeyword('');
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAddKeyword();
		}
	};

	return (
		<div className="border rounded-lg p-4 space-y-3 relative shadow-sm bg-white">
			<button
				className="absolute top-2 right-2 p-1 bg-white rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600"
				onClick={() => onRemoveGroup(index)}
				title="Eliminar grupo"
			>
				<TrashIcon />
			</button>

			<div className="flex flex-col sm:flex-row gap-4">
				<div className="flex flex-col w-full">
					<p className="text-sm font-medium text-gray-700 mb-1">Nombre del grupo</p>
					<Input
						placeholder="Nombre del grupo"
						value={groupData.groupName}
						onChange={(e) =>
							onUpdateGroup(index, { groupName: e.target.value })
						}
					/>
				</div>

				<div className="flex flex-col w-full">
					<p className="text-sm font-medium text-gray-700 mb-1">URL destino</p>
					<Input
						placeholder="https://example.com/destination"
						value={groupData.destinationUrl}
						onChange={(e) =>
							onUpdateGroup(index, { destinationUrl: e.target.value })
						}
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				{groupData.keywords.map((kw, i) => (
					<div
						key={i}
						className="bg-gray-200 px-2 py-1 rounded-full flex items-center space-x-1 text-sm"
					>
						<span>{kw}</span>
						<button
							onClick={() => handleKeywordDelete(i)}
							className="text-gray-500 hover:text-red-500"
							title="Eliminar"
						>
							<TrashIcon size={12} />
						</button>
					</div>
				))}
			</div>

			<Input
				placeholder="Añadir nueva palabra clave"
				value={newKeyword}
				onChange={(e) => setNewKeyword(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
		</div >
	);
}
