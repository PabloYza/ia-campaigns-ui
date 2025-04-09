import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";

import { getCampaigns } from "../services/api";

export default function CampaignHistory() {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCampaigns = async () => {
			try {
				const data = await getCampaigns();
				setHistory(data);
			} catch (err) {
				console.error("❌ Error cargando campañas:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchCampaigns();
	}, []);

	if (loading) return <p className="text-sm text-gray-500">Cargando historial...</p>;
	if (history.length === 0) return <p className="text-sm text-gray-500">No hay campañas registradas.</p>;

	return (
		<div className="mt-6">
			<h2 className="text-xl font-semibold mb-2">Historial de Campañas</h2>
			<div className="rounded-lg border border-gray-200 overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-100">
							<TableHead className="text-sm font-medium text-left">Fecha</TableHead>
							<TableHead className="text-sm font-medium text-left">Campaña</TableHead>
							<TableHead className="text-sm font-medium text-left">Usuario</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{history.map((q, i) => (
							<TableRow key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
								<TableCell className="text-sm text-left">{q.created_at}</TableCell>
								<TableCell className="text-sm text-left">{q.campaign_name}</TableCell>
								<TableCell className="text-sm text-left">{q.created_by}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
