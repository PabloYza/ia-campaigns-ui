import React from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import CopyCard from "@/components/copyCard";
import { saveCampaignToDB } from "@/services/api";

const getCurrentTimestamp = () => new Date().toISOString();

const CopyEditor = () => {
	const navigate = useNavigate();
	const { clientName, campaignName } = useParams();
	const campaign = useSelector((state) => state.campaign);
	const user = useSelector((state) => state.user);
	const handleSaveToDB = async () => {
		const payload = {
			client_name: campaign.clientName,
			campaign_name: campaign.campaignName,
			description: campaign.description,
			client_url: campaign.clientUrl,
			audience: campaign.audience,
			campaign_type: campaign.campaignType,
			campaign_url: campaign.campaignUrl,
			campaign_language: campaign.campaignLanguage,
			ad_groups: campaign.adGroups,
			global_keywords: campaign.globalKeywords,
			created_by: user?.email || "anon",
			created_at: getCurrentTimestamp()
		};

		try {
			await saveCampaignToDB(payload);
			toast.success("💾 Campaña guardada en Supabase");
		} catch (err) {
			toast.error("❌ Error al guardar campaña en Supabase");
		}
	};

	const exportCSV = () => {
		const rows = [];

		campaign.adGroups.forEach((group) => {
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
					"Campaign Name": index === 0 ? campaignName : "",
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
		XLSX.writeFile(wb, `${campaignName}-ads.xlsx`);

		toast.success("Archivo CSV exportado");

		handleSaveToDB();
	};


	return (
		<div className="p-6 space-y-6">
			<div className="sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
				<div>
					<h2 className="text-sm text-gray-500">Cliente: {clientName}</h2>
					<h1 className="text-lg font-semibold">Campaña: {campaignName}</h1>
				</div>
				<div className="flex gap-4">
					<Button onClick={() => navigate(-1)}>🔙 Volver a grupos</Button>
					<Button onClick={exportCSV}>📤 Exportar como CSV</Button>
				</div>
			</div>

			{/* Accordion por grupo */}
			<Accordion type="multiple" collapsible="true">
				{campaign.adGroups.map((group, index) => (
					<CopyCard key={index} group={group} index={index} />
				))}
			</Accordion>
		</div>
	);
};

export default CopyEditor;
