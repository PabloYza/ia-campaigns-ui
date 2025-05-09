import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateAdGroupCopies, updateKeywordGroup } from "@/store/slices/campaignsSlice";
import { generateCopies } from "@/services/api";

export default function CopyCard({ group, index }) {
	const dispatch = useDispatch();

	const handleChange = (field, value) => {
		const updated = { ...group, [field]: value };
		dispatch(updateKeywordGroup({ index, groupData: updated }));
	};

	const handleArrayChange = (field, i, value) => {
		const list = [...(group[field] || [])];
		list[i] = value;
		handleChange(field, list);
	};

	const regenerate = async () => {
		try {
			toast.loading(`Generando copies para "${group.groupName}"...`);
			const result = await generateCopies({ adGroups: [group] });
			const updated = result.results?.[0];
			if (updated && !updated.error) {
				dispatch(updateAdGroupCopies(updated));
				toast.success("✅ Copies generados");
			} else {
				toast.error(`❌ ${updated?.error || "Error generando copies"}`);
			}
		} catch {
			toast.error("Error al conectar con OpenAI");
		} finally {
			toast.dismiss();
		}
	};

	return (
		<AccordionItem value={`adgroup-${index}`}>
			<AccordionTrigger>
				📁 {group.groupName || "Sin nombre"} – {group.destinationUrl || "URL no definida"}
			</AccordionTrigger>
			<AccordionContent>
				<div className="p-6 rounded-xl bg-white shadow-md border border-gray-100 space-y-6">
					{/* HEADLINES */}
					<div>
						<h3 className="text-sm font-semibold mb-2">📝 Titulares (máx. 30 caracteres)</h3>
						<div className="grid grid-cols-2 gap-2">
							{Array.from({ length: 15 }).map((_, i) => (
								<div key={i}>
									<Input
										value={group.headlines?.[i] ?? ""}
										onChange={(e) => handleArrayChange("headlines", i, e.target.value)}
										maxLength={60}
										className={clsx("text-sm", (group.headlines?.[i]?.length ?? 0) > 30 && "border-red-500")}
									/>
									<p className={clsx(
										"text-xs text-right",
										(group.headlines?.[i]?.length ?? 0) > 30 ? "text-red-500" : "text-gray-500"
									)}>
										{(group.headlines?.[i] || "").length}/30
									</p>
								</div>
							))}
						</div>
					</div>

					{/* DESCRIPTIONS */}
					<div>
						<h3 className="text-sm font-semibold mb-2">💬 Descripciones (máx. 90 caracteres)</h3>
						{Array.from({ length: 4 }).map((_, i) => (
							<div key={i}>
								<Textarea
									value={group.descriptions?.[i] ?? ""}
									onChange={(e) => handleArrayChange("descriptions", i, e.target.value)}
									maxLength={90}
									rows={2}
									className={clsx("text-sm", (group.descriptions?.[i]?.length ?? 0) > 90 && "border-red-500")}
								/>
								<p className={clsx(
									"text-xs text-right",
									(group.descriptions?.[i]?.length ?? 0) > 90 ? "text-red-500" : "text-gray-500"
								)}>
									{(group.descriptions?.[i] || "").length}/90
								</p>
							</div>
						))}
					</div>

					{/* PATHS */}
					<div className="grid grid-cols-2 gap-4 mt-4">
						<div>
							<label className="text-sm font-medium">Ruta 1</label>
							<Input maxLength={15} value={group.path1 || ""} onChange={(e) => handleChange("path1", e.target.value)} />
						</div>
						<div>
							<label className="text-sm font-medium">Ruta 2</label>
							<Input maxLength={15} value={group.path2 || ""} onChange={(e) => handleChange("path2", e.target.value)} />
						</div>
					</div>

					{/* REGENERATE */}
					<Button variant="secondary" onClick={regenerate} className="mt-4" title="Genera nuevos copies para este grupo">
						🤖 Regenerar copies con IA
					</Button>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
}
