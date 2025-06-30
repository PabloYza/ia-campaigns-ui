import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrashIcon } from '@/components/ui/trashIcon';
import toast from 'react-hot-toast';
import clsx from 'clsx';

import useKeywordStrategies from '@/hooks/useKeywordStrategies';
import useKeywordSelection from '@/hooks/useKeywordSelection';
import { updateGroupsBulk, setSelectedKeywords } from '@/store/slices/campaignsSlice';

export default function KeywordEditor({ keywords = [], onUpdate }) {
	const [newKeyword, setNewKeyword] = useState('');
	const [highlighted, setHighlighted] = useState([]);

	const dispatch = useDispatch();
	const clientUrl = useSelector((state) => state.campaign.clientUrl);
	const groups = useSelector((state) => state.campaign.adGroups);
	const globalKeywords = useSelector((state) => state.campaign.globalKeywords);

	const {
		loadingGoogle,
		loadingSemrush,
		enrichKeywordsFromGoogle,
		enrichKeywordsFromSemrush,
		generateMoreKeywords
	} = useKeywordStrategies(keywords, clientUrl);

	const {
		selectedKeywords,
		toggleKeyword,
		clearSelection,
		isSelected
	} = useKeywordSelection();

	const handleSelectAll = () => {
		dispatch(setSelectedKeywords(keywords));
	};

	const handleDelete = (i) => {
		const updated = [...keywords];
		const deleted = updated.splice(i, 1)[0];
		onUpdate(updated);
		if (selectedKeywords.includes(deleted)) {
			toggleKeyword(deleted);
		}
	};

	const handleAdd = () => {
		const newKeywordsToAdd = newKeyword
			.split(',')
			.map(kw => kw.trim())
			.filter(kw => kw.length > 0)
			.filter(kw => !keywords.find(existingKw => existingKw.toLowerCase() === kw.toLowerCase()));

		if (newKeywordsToAdd.length > 0) {
			onUpdate([...keywords, ...newKeywordsToAdd]);
		}

		setNewKeyword('');
	};

	const enrichKeywords = async (source) => {
		try {
			const enrichFunc = source === 'google' ? enrichKeywordsFromGoogle : enrichKeywordsFromSemrush;
			const suggestions = await enrichFunc();
			const uniqueNew = suggestions.filter(k => !keywords.includes(k));

			if (uniqueNew.length > 0) {
				onUpdate([...keywords, ...uniqueNew]);
				setHighlighted(uniqueNew);
				setTimeout(() => setHighlighted([]), 2000);
				toast.success(`✅ ${uniqueNew.length} nuevas keywords añadidas desde ${source === 'google' ? 'Google Ads' : 'Semrush'}`);
			} else {
				toast(`No se encontraron nuevas keywords desde ${source}`);
			}
		} catch (err) {
			console.error(`❌ Error desde ${source}:`, err);
			toast.error(`Error al obtener sugerencias de ${source}`);
		}
	};

	const handleGenerateMoreKeywords = async () => {
		try {
			const newOnes = await generateMoreKeywords();
			if (newOnes.length === 0) {
				toast("No se encontraron nuevas keywords");
				return;
			}
			onUpdate([...keywords, ...newOnes]);
			setHighlighted(newOnes);
			setTimeout(() => setHighlighted([]), 2000);
			toast.success(`✅ Se añadieron ${newOnes.length} nuevas keywords`);
		} catch (err) {
			toast.error("❌ Error generando nuevas keywords");
		}
	};

	const removeSelectedKeywords = () => {
		const updated = keywords.filter(k => !selectedKeywords.includes(k));
		onUpdate(updated);
		clearSelection();
	};

	const addToGroup = (groupId) => {
		const updatedGroups = groups.map(group =>
			group.id === groupId || group.groupName === groupId
				? {
					...group, keywords: [
						...group.keywords,
						...selectedKeywords.filter(kw => !group.keywords.includes(kw))
					]
				}
				: group
		);
		dispatch(updateGroupsBulk(updatedGroups));
		toast.success(`📥 ${selectedKeywords.length} keywords añadidas al grupo "${groupId}"`);
		removeSelectedKeywords();
	};

	const addAllToSingleGroup = () => {
		if (groups.length === 1) {
			const group = groups[0];
			const updated = {
				...group,
				keywords: [
					...group.keywords,
					...keywords.filter(kw => !group.keywords.includes(kw))
				]
			};
			dispatch(updateGroupsBulk([updated]));
			toast.success(`📥 ${keywords.length} keywords añadidas al grupo "${group.groupName}"`);
			onUpdate([]);
			clearSelection();
		}
	};

	const allKeywordsSelected = keywords.length > 0 && selectedKeywords.length === keywords.length;

	return (
		<div className="border rounded-lg p-4 shadow-sm bg-white space-y-4">
			<div className="flex justify-between items-center">
				<h3 className="text-base font-semibold">Keywords de trabajo</h3>
				{keywords.length > 0 && (
					allKeywordsSelected ? (
						<Button variant="link" className="text-xs" onClick={clearSelection}>
							Deseleccionar Todas
						</Button>
					) : (
						<Button variant="link" className="text-xs" onClick={handleSelectAll}>
							Seleccionar Todas
						</Button>
					)
				)}
			</div>

			<div className="flex flex-wrap gap-2">
				{keywords.map((kw, i) => (
					<div
						key={i}
						onClick={() => toggleKeyword(kw)}
						className={clsx(
							'px-2 py-1 rounded-full flex items-center space-x-1 text-sm cursor-pointer',
							highlighted.includes(kw)
								? 'bg-green-100 text-green-700'
								: isSelected(kw)
									? 'bg-blue-100 border border-blue-500 text-blue-700'
									: 'bg-gray-200'
						)}
						title="Haz clic para seleccionar"
					>
						<span>{kw}</span>
						{isSelected(kw) && <span className='ml-1'>✓</span>}
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleDelete(i);
							}}
							className="text-gray-500 hover:text-red-500"
						>
							<TrashIcon size={12} />
						</button>
					</div>
				))}
			</div>

			<Input
				placeholder="Añadir nueva(s) palabra(s) clave (separadas por comas)"
				value={newKeyword}
				onChange={(e) => setNewKeyword(e.target.value)}
				onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
			/>

			{keywords.length > 0 && clientUrl && (
				<div className="mt-4 space-y-2">
					<div className="flex gap-2">
						<Button onClick={handleGenerateMoreKeywords} className="bg-indigo-600 text-white text-sm">
							✨ Generar más keywords
						</Button>
						{/* <Button onClick={() => enrichKeywords('google')} disabled={loadingGoogle} className="bg-blue-600 text-white text-sm">Google Ads</Button>
						<Button onClick={() => enrichKeywords('semrush')} disabled={loadingSemrush} className="bg-green-600 text-white text-sm">Semrush</Button> */}
					</div>
				</div>
			)}

			{selectedKeywords.length > 0 && (
				<div className="mt-4 space-y-2">
					<p className="text-sm text-gray-600 font-medium">{selectedKeywords.length} keywords seleccionadas</p>
					<div className="flex flex-wrap gap-2">
						<Button variant="destructive" onClick={removeSelectedKeywords}>🗑 Borrar seleccionadas</Button>
						{groups.length > 1 && (
							<select onChange={(e) => addToGroup(e.target.value)} className="border px-2 py-1 rounded">
								<option>Añadir a grupo ▼</option>
								{groups.map((g) => (
									<option key={g.id || g.groupName} value={g.id || g.groupName}>{g.groupName}</option>
								))}
							</select>
						)}
						{groups.length === 1 && (
							<Button onClick={addAllToSingleGroup}>📥 Añadir todo al grupo "{groups[0].groupName}"</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}