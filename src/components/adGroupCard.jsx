import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { TrashIcon } from '@/components/ui/trashIcon';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function AdGroupCard({ index, groupData, onUpdateGroup, onRemoveGroup, isKeywordDuplicate }) {
	const [expanded, setExpanded] = useState(false);
	const [newKeyword, setNewKeyword] = useState('');

	const toggleExpand = () => setExpanded(!expanded);

	const handleKeywordDelete = (i) => {
		const updatedKeywords = [...groupData.keywords];
		updatedKeywords.splice(i, 1);
		onUpdateGroup(index, { keywords: updatedKeywords });
	};

	const handleAddKeyword = () => {
		const trimmed = newKeyword.trim();
		const alreadyExists = groupData.keywords.includes(trimmed);
		const duplicateElsewhere = isKeywordDuplicate?.(trimmed, index);

		if (trimmed && !alreadyExists && !duplicateElsewhere) {
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

	const hasDuplicates = new Set(groupData.keywords).size !== groupData.keywords.length;

	const isIncomplete =
		!groupData.groupName?.trim() ||
		!groupData.destinationUrl?.trim() ||
		!Array.isArray(groupData.keywords) ||
		groupData.keywords.length === 0;

	return (
		<div className="border rounded-lg shadow-sm bg-white overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50" onClick={toggleExpand}>
				<div className="flex items-center gap-3">
					{expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
					<div className="text-sm font-medium">{groupData.groupName || 'Sin nombre'}</div>
					<div className="text-xs text-gray-500">({groupData.keywords.length} keywords)</div>
					{hasDuplicates && <div className="text-red-500 text-xs font-medium ml-2">⚠ Duplicados internos</div>}
					{isIncomplete && <div className="text-yellow-600 text-xs font-medium ml-2">⚠ Incompleto</div>}
				</div>
				<button
					className="text-gray-400 hover:text-red-600"
					title="Eliminar grupo"
					onClick={(e) => {
						e.stopPropagation();
						onRemoveGroup(index);
					}}
				>
					<TrashIcon />
				</button>
			</div>

			{/* Expanded View */}
			{expanded && (
				<div className="border-t px-4 py-4 space-y-4">
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="w-full">
							<p className="text-sm text-gray-600 mb-1">Nombre del grupo</p>
							<Input
								value={groupData.groupName}
								onChange={(e) => onUpdateGroup(index, { groupName: e.target.value })}
							/>
						</div>
						<div className="w-full">
							<p className="text-sm text-gray-600 mb-1">URL destino</p>
							<Input
								value={groupData.destinationUrl}
								onChange={(e) => onUpdateGroup(index, { destinationUrl: e.target.value })}
							/>
						</div>
					</div>

					{/* Keyword Editor */}
					<div className="flex flex-wrap gap-2">
						{groupData.keywords.map((kw, i) => (
							<div key={i} className="bg-gray-100 px-2 py-1 rounded-full flex items-center space-x-1 text-sm">
								<span>{kw}</span>
								<button
									onClick={() => handleKeywordDelete(i)}
									className="text-gray-400 hover:text-red-500"
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
				</div>
			)}
		</div>
	);
}
