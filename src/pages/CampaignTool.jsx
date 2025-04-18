import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CirclePlus } from 'lucide-react';

import {
	setClientName,
	setClientUrl,
	setCampaignName,
	setDescription,
	setInitialKeywords,
	addKeywordGroup
} from '../store/slices/campaignsSlice';
import KeywordEditor from '../components/keywordEditor';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AdGroupsList from '../components/adGroupList';
import { getCampaigns, getClients } from '../services/api';

const CampaignTool = () => {
	const dispatch = useDispatch();
	const { campaignId } = useParams();
	const [googleSuggestions, setGoogleSuggestions] = useState([]);

	const campaignData = useSelector((state) => state.campaign);
	const initialKeywords = useSelector((state) => state.campaign.initialKeywords);

	useEffect(() => {
		const loadData = async () => {
			try {
				const campaigns = await getCampaigns();
				const campaign = campaigns.find(c => c.id === parseInt(campaignId));
				if (!campaign) return alert("No se encontró la campaña");

				const clients = await getClients();
				const client = clients.find(c => c.name === campaign.client_name);

				dispatch(setClientName(campaign.client_name));
				dispatch(setClientUrl(client?.url || ''));
				dispatch(setCampaignName(campaign.campaign_name));
				dispatch(setDescription(campaign.description || ''));

				if (campaign.initial_keywords) {
					dispatch(setInitialKeywords(campaign.initial_keywords));
				}
			} catch (err) {
				console.error("❌ Error al cargar campaña:", err);
			}
		};

		loadData();
	}, [campaignId, dispatch]);

	const handleAddKeywordGroup = () => {
		dispatch(addKeywordGroup({ groupName: '', destinationUrl: '', keywords: [] }));
	};

	const handleFetchFromGoogleAds = () => {
		const keywords = Array.isArray(initialKeywords)
			? initialKeywords
			: (initialKeywords || "").split(',').map(k => k.trim()).filter(Boolean);

		// Simulamos una respuesta como si viniera de Google Ads
		const fakeResponse = keywords.map((kw, i) => ({
			keyword: kw,
			avg_monthly_searches: Math.floor(Math.random() * 1000),
			competition: ['baja', 'media', 'alta'][i % 3],
			suggested_bid: (Math.random() * 1.5).toFixed(2)
		}));

		setGoogleSuggestions(fakeResponse);
	};

	return (<div className="w-full px-4 py-6 space-y-6">

		{/* Detalles de Campaña - fila arriba */}
		<div className="bg-white shadow-md rounded-lg p-4 border grid grid-cols-1 md:grid-cols-4 gap-4">
			<div>
				<label className="text-sm font-medium text-gray-700">Cliente</label>
				<Input value={campaignData.clientName} disabled />
			</div>
			<div>
				<label className="text-sm font-medium text-gray-700">Campaña</label>
				<Input value={campaignData.campaignName} disabled />
			</div>
			<div>
				<label className="text-sm font-medium text-gray-700">Descripción</label>
				<Textarea value={campaignData.description} disabled rows={1} />
			</div>
			<div>
				<label className="text-sm font-medium text-gray-700">URL Principal</label>
				<Input value={campaignData.clientUrl} disabled />
			</div>
		</div>

		{/* Cuerpo dividido en 5 columnas */}
		<div className="grid grid-cols-1 md:grid-cols-5 gap-6">

			{/* Sección de Keywords (3/5) */}
			<div className="md:col-span-3 space-y-6">

				{/* KeywordEditor */}
				{initialKeywords && initialKeywords.length > 0 && (
					<div className="bg-white p-4 rounded-lg shadow-md border">
						<KeywordEditor
							keywords={Array.isArray(initialKeywords) ? initialKeywords : []}
							onUpdate={(updated) => dispatch(setInitialKeywords(updated))}
						/>
					</div>
				)}

				{/* Botón Google Ads */}
				<Button className="bg-blue-600 text-white" onClick={handleFetchFromGoogleAds}>
					Obtener estrategia de Google Ads
				</Button>

				{/* Resultado de Google Ads */}
				{googleSuggestions.length > 0 && (
					<div className="bg-white p-4 rounded-lg shadow-md border">
						<h3 className="text-base font-semibold mb-3">🔍 Sugerencias de Google Ads</h3>
						<table className="w-full text-sm text-left border">
							<thead className="bg-gray-100 text-xs uppercase text-gray-600">
								<tr>
									<th className="px-3 py-2">Keyword</th>
									<th className="px-3 py-2">Búsquedas/mes</th>
									<th className="px-3 py-2">Competencia</th>
									<th className="px-3 py-2">CPC (€)</th>
								</tr>
							</thead>
							<tbody>
								{googleSuggestions.map((item, i) => (
									<tr key={i} className="border-t">
										<td className="px-3 py-2">{item.keyword}</td>
										<td className="px-3 py-2">{item.avg_monthly_searches}</td>
										<td className="px-3 py-2 capitalize">{item.competition}</td>
										<td className="px-3 py-2">{item.suggested_bid}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Sección de Grupos de Anuncios (2/5) */}
			<div className="md:col-span-2 space-y-6">
				<div className="bg-white p-4 rounded-lg shadow-md border">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-base font-semibold">Grupos de Anuncios</h3>
						<Button
							onClick={handleAddKeywordGroup}
							type="button"
							className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1 rounded-full"
						>
							Añadir Grupo
						</Button>
					</div>
					<AdGroupsList />
				</div>
			</div>

		</div>
	</div>
	);
};

export default CampaignTool;
