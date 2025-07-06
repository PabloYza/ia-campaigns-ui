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
	const [contextNote, setContextNote] = useState("");
	const [loadingKeywords, setLoadingKeywords] = useState(false);
	const [customUrl, setCustomUrl] = useState('');

	const dispatch = useDispatch();
	const clientUrl = useSelector((state) => state.campaign.clientUrl);
	const campaignLanguage = useSelector((state) => state.campaign.campaignLanguage);
	const groups = useSelector((state) => state.campaign.adGroups);
	const globalKeywords = useSelector((state) => state.campaign.globalKeywords);

	const {
		generateMoreKeywords,
		generateKeywordsFromUrl
	} = useKeywordStrategies(keywords, clientUrl, contextNote, globalKeywords, campaignLanguage);

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


	const handleGenerateMoreKeywords = async () => {
		setLoadingKeywords(true);
		try {
			const newOnes = await generateMoreKeywords();
			if (newOnes.length === 0) {
				toast("No se encontraron nuevas keywords");
				return;
			}
			onUpdate([...keywords, ...newOnes]);
			setHighlighted(newOnes);
			setTimeout(() => setHighlighted([]), 2000);
			toast.success(`Se añadieron ${newOnes.length} nuevas keywords`);

		} catch (err) {
			toast.error("❌ Error generando nuevas keywords");
		} finally {
			setLoadingKeywords(false);
			setContextNote("");
		}

	};
	const handleGenerateFromUrl = async () => {
		if (!customUrl) {
			toast.error("Introduce una URL válida");
			return;
		}
		setLoadingKeywords(true);
		try {
			const result = await generateKeywordsFromUrl(customUrl.trim());
			if (result.length === 0) {
				toast("No se encontraron nuevas keywords");
				return;
			}
			onUpdate([...keywords, ...result]);
			toast.success(`Se añadieron ${result.length} nuevas keywords`);
			setHighlighted(result);
			setTimeout(() => setHighlighted([]), 2000);
		} catch (err) {
			console.error("❌ Error en generateKeywordsFromUrl:", err);
			if (err?.response?.data?.error?.includes('extraer contenido')) {
				toast.error("No se pudo leer el contenido de esa URL. Asegúrate que es pública y tiene texto visible.");
			} else {
				toast.error("Error generando desde URL");
			}
		} finally {
			setLoadingKeywords(false);
			setCustomUrl('');
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
		if (groups.length === 1 && selectedKeywords.length > 0) {
			const group = groups[0];
			const updated = {
				...group,
				keywords: [
					...group.keywords,
					...selectedKeywords.filter(kw => !group.keywords.includes(kw))
				]
			};
			dispatch(updateGroupsBulk([updated]));
			toast.success(`📥 ${selectedKeywords.length} keywords añadidas al grupo "${group.groupName}"`);
			removeSelectedKeywords();
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
			{
				selectedKeywords.length > 0 && (
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
							{groups.length === 1 && selectedKeywords.length > 0 && (
								<Button onClick={addAllToSingleGroup}>📥 Añadir seleccionadas al grupo "{groups[0].groupName}"</Button>
							)}
						</div>
					</div>
				)
			}

			{keywords.length > 0 && clientUrl && (
				<div className="mt-6 space-y-4 border-t pt-4">
					<div>
						<label className="text-sm font-semibold text-gray-800 block mb-1">
							📝 Añade contexto adicional (opcional)
						</label>
						<p className="text-sm text-gray-500 mb-2">
							¿Hay algo más que deberíamos saber? Describe productos, enfoque, tono, diferenciadores, etc.
						</p>
						<Input
							value={contextNote}
							onChange={(e) => setContextNote(e.target.value)}
							className="w-full"
						/>
					</div>

					<div>
						<Button
							onClick={handleGenerateMoreKeywords}
							className="bg-indigo-600 text-white text-sm w-full sm:w-auto"
							disabled={loadingKeywords}
						>
							{loadingKeywords ? "Generando..." : "✨ Generar más keywords"}
						</Button>
					</div>
					<div className="mt-4 space-y-2">
						<label className="text-sm font-semibold text-gray-800 block">
							🔎 Extraer keywords desde una URL
						</label>
						<Input
							placeholder="https://ejemplo.com/producto"
							value={customUrl}
							onChange={(e) => setCustomUrl(e.target.value)}
						/>
						<Button
							className="bg-blue-600 text-white text-sm mt-2"
							onClick={handleGenerateFromUrl}
							disabled={loadingKeywords}
						>
							{loadingKeywords ? "Generando..." : "🌐 Generar desde URL"}
						</Button>
					</div>
				</div>
			)
			}

		</div >
	);
}