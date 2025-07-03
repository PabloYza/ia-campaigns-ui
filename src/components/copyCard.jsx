import React, { useState } from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateAdGroupCopies, updateKeywordGroup } from "@/store/slices/campaignsSlice";
import { generateCopies, regenerateSelectedCopiesAPI } from "@/services/api";

export default function CopyCard({ group, index }) {
	const dispatch = useDispatch();

	const initialSelectionState = {
		headlines: Array(15).fill(false),
		descriptions: Array(4).fill(false),
	};
	const [selectedForRegeneration, setSelectedForRegeneration] = useState(initialSelectionState);
	const [justRegenerated, setJustRegenerated] = useState(initialSelectionState);
	const campaignLanguage = useSelector(state => state.campaign.campaignLanguage);

	const handleChange = (field, value) => {
		const updated = { ...group, [field]: value };
		dispatch(updateKeywordGroup({ index, groupData: updated }));
	};

	const handleArrayChange = (field, itemIndex, value) => {
		const list = [...(group[field] || [])];
		list[itemIndex] = value;
		handleChange(field, list);
		setJustRegenerated(prev => ({
			...prev,
			[field]: prev[field].map((val, idx) => (idx === itemIndex ? false : val)),
		}));
	};

	const handleCheckboxChange = (type, itemIndex) => {
		setSelectedForRegeneration(prev => ({
			...prev,
			[type]: prev[type].map((isSelected, idx) => (idx === itemIndex ? !isSelected : isSelected)),
		}));
	};

	const getSelectedItemsInfo = () => {
		const headlinesToRegenerate = group.headlines
			?.map((text, i) => (selectedForRegeneration.headlines[i] ? { index: i, currentText: text || "" } : null))
			.filter(Boolean) || [];
		const descriptionsToRegenerate = group.descriptions
			?.map((text, i) => (selectedForRegeneration.descriptions[i] ? { index: i, currentText: text || "" } : null))
			.filter(Boolean) || [];

		return { headlinesToRegenerate, descriptionsToRegenerate };
	};

	const handleRegenerateCopies = async () => {
		const { headlinesToRegenerate, descriptionsToRegenerate } = getSelectedItemsInfo();
		const isSelectiveRegeneration = headlinesToRegenerate.length > 0 || descriptionsToRegenerate.length > 0;

		toast.loading(isSelectiveRegeneration ? `Regenerando copies seleccionados para "${group.groupName}"...` : `Generando todos los copies para "${group.groupName}"...`);

		try {
			if (isSelectiveRegeneration) {
				const payload = {
					groupName: group.groupName,
					destinationUrl: group.destinationUrl,
					keywords: group.keywords,
					headlinesToRegenerate,
					descriptionsToRegenerate,
					existingHeadlines: group.headlines?.filter((_, i) => !selectedForRegeneration.headlines[i]) || [],
					existingDescriptions: group.descriptions?.filter((_, i) => !selectedForRegeneration.descriptions[i]) || [],
					campaignLanguage
				};

				// LLAMADA REAL AL BACKEND
				const result = await regenerateSelectedCopiesAPI(payload);

				if (result && result.regeneratedItems && result.groupName === group.groupName) {
					const currentHeadlines = [...(group.headlines || Array(15).fill(""))];
					const currentDescriptions = [...(group.descriptions || Array(4).fill(""))];
					const newJustRegeneratedFlags = JSON.parse(JSON.stringify(initialSelectionState));

					result.regeneratedItems.forEach(item => {
						if (item.type === 'headline' && item.index < currentHeadlines.length) {
							currentHeadlines[item.index] = item.newText;
							newJustRegeneratedFlags.headlines[item.index] = true;
						} else if (item.type === 'description' && item.index < currentDescriptions.length) {
							currentDescriptions[item.index] = item.newText;
							newJustRegeneratedFlags.descriptions[item.index] = true;
						}
					});

					dispatch(updateAdGroupCopies({
						groupName: group.groupName,
						headlines: currentHeadlines,
						descriptions: currentDescriptions
					}));
					setJustRegenerated(newJustRegeneratedFlags);
					toast.success("✅ Copies seleccionados regenerados por IA!");
				} else {
					toast.error("❌ Error procesando la respuesta de regeneración selectiva.");
				}

			} else {
				// Regenerar todos los copies del grupo
				const result = await generateCopies({ adGroups: [group] });
				const updatedData = result.results?.[0];
				if (updatedData && !updatedData.error) {
					dispatch(updateAdGroupCopies(updatedData));
					setJustRegenerated({
						headlines: Array(15).fill(true),
						descriptions: Array(4).fill(true),
					});
					toast.success("✅ Todos los copies regenerados por IA");
				} else {
					toast.error(`❌ ${updatedData?.error || "Error generando todos los copies"}`);
				}
			}
		} catch (err) {
			console.error("Error en handleRegenerateCopies:", err);
			const errorMessage = err.response?.data?.error || (isSelectiveRegeneration ? "Error al regenerar copies seleccionados" : "Error al conectar con OpenAI");
			toast.error(`❌ ${errorMessage}`);
		} finally {
			toast.dismiss();
			setSelectedForRegeneration(initialSelectionState);
			setTimeout(() => setJustRegenerated(initialSelectionState), 5000);
		}
	};

	return (
		<AccordionItem value={`adgroup-${index}`}>
			<AccordionTrigger>
				📁 {group.groupName || "Sin nombre"} – {group.destinationUrl || "URL no definida"}
			</AccordionTrigger>
			<AccordionContent>
				<div className="p-6 rounded-xl bg-white shadow-md border border-gray-100 space-y-6">
					<div>
						<h3 className="text-sm font-semibold mb-2">📝 Titulares (máx. 30 caracteres)</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
							{Array.from({ length: 15 }).map((_, i) => (
								<div key={`headline-${index}-${i}`} className="flex items-center space-x-2">
									<Checkbox
										id={`headline-cb-${index}-${i}`}
										checked={selectedForRegeneration.headlines[i]}
										onCheckedChange={() => handleCheckboxChange('headlines', i)}
									/>
									<Label htmlFor={`headline-cb-${index}-${i}`} className="flex-1 cursor-pointer">
										<Input
											value={group.headlines?.[i] ?? ""}
											onChange={(e) => handleArrayChange("headlines", i, e.target.value)}
											maxLength={30}
											className={clsx(
												"text-sm w-full",
												(group.headlines?.[i]?.length ?? 0) > 30 && "border-red-500",
												justRegenerated.headlines[i] && "border-orange-500 border-2 ring-orange-300 ring-1"
											)}
										/>
										<p className={clsx(
											"text-xs text-right pr-1",
											(group.headlines?.[i]?.length ?? 0) > 30 ? "text-red-500" : "text-gray-500"
										)}>
											{(group.headlines?.[i] || "").length}/30
										</p>
									</Label>
								</div>
							))}
						</div>
					</div>

					<div>
						<h3 className="text-sm font-semibold mb-2">💬 Descripciones (máx. 90 caracteres)</h3>
						<div className="space-y-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={`description-${index}-${i}`} className="flex items-center space-x-2">
									<Checkbox
										id={`description-cb-${index}-${i}`}
										checked={selectedForRegeneration.descriptions[i]}
										onCheckedChange={() => handleCheckboxChange('descriptions', i)}
									/>
									<Label htmlFor={`description-cb-${index}-${i}`} className="flex-1 cursor-pointer">
										<Textarea
											value={group.descriptions?.[i] ?? ""}
											onChange={(e) => handleArrayChange("descriptions", i, e.target.value)}
											maxLength={90}
											rows={2}
											className={clsx(
												"text-sm w-full",
												(group.descriptions?.[i]?.length ?? 0) > 90 && "border-red-500",
												justRegenerated.descriptions[i] && "border-orange-500 border-2 ring-orange-300 ring-1"
											)}
										/>
										<p className={clsx(
											"text-xs text-right pr-1",
											(group.descriptions?.[i]?.length ?? 0) > 90 ? "text-red-500" : "text-gray-500"
										)}>
											{(group.descriptions?.[i] || "").length}/90
										</p>
									</Label>
								</div>
							))}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 mt-4">
						<div>
							<Label className="text-sm font-medium" htmlFor={`path1-${index}`}>Ruta 1</Label>
							<Input id={`path1-${index}`} maxLength={15} value={group.path1 || ""} onChange={(e) => handleChange("path1", e.target.value)} />
						</div>
						<div>
							<Label className="text-sm font-medium" htmlFor={`path2-${index}`}>Ruta 2</Label>
							<Input id={`path2-${index}`} maxLength={15} value={group.path2 || ""} onChange={(e) => handleChange("path2", e.target.value)} />
						</div>
					</div>

					<Button
						variant="secondary"
						onClick={handleRegenerateCopies}
						className="mt-4"
						title="Genera nuevos copies para este grupo o solo los seleccionados"
					>
						🤖 Regenerar copies con IA
					</Button>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
}