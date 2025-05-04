import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CirclePlus } from 'lucide-react';

import {
	setClientName,
	setClientUrl,
	setCampaignName,
	setDescription,
	setKeywords,
	addKeywordGroup
} from '../store/slices/campaignsSlice';

import KeywordEditor from '../components/keywordEditor';
import KeywordStrategyPanel from '@/components/KeywordStrategyPanel';
import AdGroupsList from '../components/adGroupList';

import useKeywordStrategies from '@/hooks/useKeywordStrategies';
import { getCampaigns, getClients } from '../services/api';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CampaignTool = () => {
	const dispatch = useDispatch();
	const { campaignId } = useParams();

	const campaignData = useSelector((state) => state.campaign);
	const keywords = useSelector((state) => state.campaign.keywords);


	const {
		googleAdsStrategy,
		semrushData,
		loadingGoogle,
		loadingSemrush,
		fetchGoogleAdsStrategy,
		fetchSemrushData
	} = useKeywordStrategies(keywords, campaignData.clientUrl);

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
					dispatch(setKeywords(campaign.initial_keywords));
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

	return (
		<div className="w-full px-4 py-6 space-y-6">

			{/* Campaign Details */}
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

			{/* 2-Column layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

				{/* Left (2/3): Keywords + Estrategia */}
				<div className="lg:col-span-2 space-y-6">
					{keywords && keywords.length > 0 && (
						<div className="bg-white p-4 rounded-lg shadow-md border">
							<KeywordEditor
								keywords={Array.isArray(keywords) ? keywords : []}
								onUpdate={(updated) => dispatch(setKeywords(updated))}
							/>
						</div>
					)}

					<KeywordStrategyPanel
						keywords={keywords}
						clientUrl={campaignData.clientUrl}
						onFetchGoogle={fetchGoogleAdsStrategy}
						onFetchSemrush={fetchSemrushData}
						googleAdsStrategy={googleAdsStrategy}
						semrushData={semrushData}
						loadingGoogle={loadingGoogle}
						loadingSemrush={loadingSemrush}
					/>
				</div>

				{/* Right (1/3): Ad Groups */}
				<div className="space-y-6 sticky top-6 self-start h-fit">
					<div className="bg-white p-4 rounded-lg shadow-md border">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-base font-semibold">Grupos de Anuncios</h3>
							<Button
								onClick={handleAddKeywordGroup}
								type="button"
								className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-3 py-1 rounded-full"
							>
								Añadir Grupo
								<CirclePlus />
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
