import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { TrashIcon } from '@/components/ui/trashIcon';

export default function KeywordEditor({ keywords = [], onUpdate }) {
	const [newKeyword, setNewKeyword] = useState('');

	const handleDelete = (i) => {
		const updated = [...keywords];
		updated.splice(i, 1);
		onUpdate(updated);
	};

	const handleAdd = () => {
		const trimmed = newKeyword.trim();
		if (trimmed && !keywords.includes(trimmed)) {
			onUpdate([...keywords, trimmed]);
		}
		setNewKeyword('');
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<div className="border rounded-lg p-4 shadow-sm bg-white space-y-4">
			<h3 className="text-base font-semibold mb-2">Keywords de trabajo</h3>

			{/* Lista de keywords */}
			<div className="flex flex-wrap gap-2">
				{keywords.map((kw, i) => (
					<div key={i} className="bg-gray-200 px-2 py-1 rounded-full flex items-center space-x-1 text-sm">
						<span>{kw}</span>
						<button
							onClick={() => handleDelete(i)}
							className="text-gray-500 hover:text-red-500"
							title="Eliminar"
						>
							<TrashIcon size={12} />
						</button>
					</div>
				))}
			</div>

			{/* Input para añadir */}
			<Input
				placeholder="Añadir nueva palabra clave"
				value={newKeyword}
				onChange={(e) => setNewKeyword(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
}
