import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";

import mockData from "../lib/mockData.json";

export default function CampaignHistory() {
	const [history] = useState(mockData.CampaignHistoryData); // Set initial data

	if (history.length === 0) return null;

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
							<TableRow
								key={i}
								className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
							>
								<TableCell className="text-sm text-left">{q.timestamp}</TableCell>
								<TableCell className="text-sm text-left">{q.campaignName}</TableCell>
								<TableCell className="text-sm text-left">{q.email}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
