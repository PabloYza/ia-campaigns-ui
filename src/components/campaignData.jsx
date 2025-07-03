import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getCampaigns } from "@/services/api";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
	setClientName,
	setCampaignName,
	setClientUrl,
	setDescription,
	setAudience,
	setCampaignType,
	setGlobalKeywords,
	setCampaignLanguage,
	updateGroupsBulk
} from "@/store/slices/campaignsSlice";

export default function CampaignData({ clientName }) {
	const [campaigns, setCampaigns] = useState([]);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchCampaigns = async () => {
			try {
				const data = await getCampaigns();
				const filtered = clientName
					? data.filter(c => c.client_name?.toLowerCase() === clientName.toLowerCase())
					: data;
				setCampaigns(filtered);
			} catch (err) {
				console.error("❌ Error cargando campañas:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchCampaigns();
	}, [clientName]);

	const formatDate = (dateString) => {
		try {
			return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
		} catch {
			return dateString;
		}
	};

	const exportCampaignCSV = (campaign) => {
		if (!campaign || !campaign.ad_groups || !campaign.campaign_name) {
			toast.error("Datos incompletos para exportar.");
			return;
		}

		const rows = [];

		campaign.ad_groups.forEach((group) => {
			const {
				groupName,
				keywords = [],
				destinationUrl,
				path1 = "",
				path2 = "",
				headlines = [],
				descriptions = []
			} = group;

			keywords.forEach((keyword, index) => {
				const row = {
					"Campaign Name": index === 0 ? campaign.campaign_name : "",
					"Ad Group": groupName,
					"Keyword": keyword,
					"Final URL": index === 0 ? destinationUrl : "",
					"Path 1": index === 0 ? path1 : "",
					"Path 2": index === 0 ? path2 : "",
				};

				if (index === 0) {
					headlines.forEach((h, i) => {
						row[`Headline ${i + 1}`] = h;
					});
					descriptions.forEach((d, i) => {
						row[`Description ${i + 1}`] = d;
					});
				}

				rows.push(row);
			});
		});

		const ws = XLSX.utils.json_to_sheet(rows);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Ad Copies");
		XLSX.writeFile(wb, `${campaign.campaign_name}-ads.xlsx`);

		toast.success("Archivo CSV exportado");
	};

	const handleResumeCampaign = (campaign) => {
		dispatch(setClientName(campaign.client_name));
		dispatch(setCampaignName(campaign.campaign_name));
		dispatch(setClientUrl(campaign.client_url));
		dispatch(setDescription(campaign.description));
		dispatch(setAudience(campaign.audience));
		dispatch(setCampaignType(campaign.campaign_type));
		dispatch(setGlobalKeywords(campaign.global_keywords || []));
		dispatch(setCampaignLanguage(campaign.campaign_language));
		dispatch(updateGroupsBulk(campaign.ad_groups || []));

		navigate("/campaigns/tool");
	};

	if (loading) return <p className="text-sm text-gray-500">Cargando campañas...</p>;
	if (campaigns.length === 0) return <p className="text-sm text-gray-500">No hay campañas guardadas.</p>;

	return (
		<div className="mt-6">
			<div className="overflow-auto border rounded-lg">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-100">
							<TableHead className="text-left text-sm">Fecha</TableHead>
							<TableHead className="text-left text-sm">Campaña</TableHead>
							<TableHead className="text-left text-sm">Usuario</TableHead>
							<TableHead className="text-left text-sm">Estado</TableHead>
							<TableHead className="text-left text-sm">Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{campaigns.map((c, i) => (
							<TableRow key={c.id || i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
								<TableCell className="text-sm">{formatDate(c.created_at)}</TableCell>
								<TableCell className="text-sm">{c.campaign_name}</TableCell>
								<TableCell className="text-sm">{c.created_by}</TableCell>
								<TableCell className="text-sm capitalize">{c.campaign_status || "desconocido"}</TableCell>
								<TableCell className="text-sm">
									{c.campaign_status === "En curso" ? (
										<Button
											className="bg-blue-600 text-white hover:bg-blue-700"
											onClick={() => handleResumeCampaign(c)}
										>
											📂 Continuar campaña
										</Button>
									) : (
										<Button
											className="bg-green-600 text-white hover:bg-green-700"
											onClick={() => exportCampaignCSV(c)}
										>
											Descargar CSV
										</Button>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
