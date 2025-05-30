import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CirclePlus } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import { updateAdGroupCopies } from '@/store/slices/campaignsSlice';
import { generateCopies } from '@/services/api';

import toast from 'react-hot-toast';
import {
	addKeywordGroup,
	setGlobalKeywords
} from '../store/slices/campaignsSlice';

import KeywordEditor from '../components/keywordEditor';
import KeywordStrategyPanel from '@/components/keywordStrategyPanel';
import AdGroupsList from '../components/adGroupList';

import useKeywordStrategies from '@/hooks/useKeywordStrategies';
import { useGoogleAdsLogin } from '@/hooks/useGoogleAdsAuth'

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CampaignTool = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const campaignData = useSelector((state) => state.campaign);
	const globalKeywords = useSelector((state) => state.campaign.globalKeywords);
	const triggerGoogleAdsLogin = useGoogleAdsLogin();
	const adGroups = useSelector(state => state.campaign.adGroups);

	useEffect(() => {
		const tokenData = localStorage.getItem("google_ads_API_token");

		// Solo dispara login si no hay refresh_token guardado
		if (!tokenData) {
			triggerGoogleAdsLogin();
		}
	}, []);

	const {
		loadingGoogle,
		loadingSemrush,
		fetchGoogleAdsStrategy,
		fetchSemrushData
	} = useKeywordStrategies(globalKeywords, campaignData.clientUrl);



	const handleAddKeywordGroup = () => {
		dispatch(addKeywordGroup({ groupName: '', destinationUrl: '', keywords: [] }));
	};

	const isKeywordDuplicate = (keyword, currentGroupIndex) => {
		const lower = keyword.toLowerCase();

		for (let i = 0; i < adGroups.length; i++) {
			if (i === currentGroupIndex) continue;
			if (adGroups[i].keywords.some(k => k.toLowerCase() === lower)) {
				return true;
			}
		}
		if (globalKeywords.some(k => k.toLowerCase() === lower)) {
			return true;
		}

		return false;
	};

	const handleGenerateCopies = async () => {
		const invalidGroups = adGroups.filter(g =>
			!g.groupName?.trim() || !g.destinationUrl?.trim() || !Array.isArray(g.keywords) || g.keywords.length === 0
		);

		if (invalidGroups.length > 0) {
			toast.error("⚠️ Algunos grupos están incompletos. Completa nombre, URL y al menos 1 keyword.");
			return;
		}

		try {
			toast.loading('Generando copies para todos los grupos...');
			const data = await generateCopies({ adGroups });
			toast.dismiss();

			data.results.forEach(groupResult => {
				if (!groupResult.error) {
					dispatch(updateAdGroupCopies(groupResult));
				}
			});

			toast.success('Copies generados con éxito');
			navigate(`/clients/${encodeURIComponent(campaignData.clientName)}/campaigns/${encodeURIComponent(campaignData.campaignName)}/copies`);

		} catch (err) {
			toast.dismiss();
			console.error('❌ Error al generar copies:', err);
			toast.error('No se pudieron generar los copies');
		}
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
					<div className="bg-white p-4 rounded-lg shadow-md border">
						<KeywordEditor
							keywords={Array.isArray(globalKeywords) ? globalKeywords : []}
							onUpdate={(updated) => dispatch(setGlobalKeywords(updated))}
						/>
					</div>

					<KeywordStrategyPanel
						keywords={globalKeywords}
						clientUrl={campaignData.clientUrl}
						onFetchGoogle={fetchGoogleAdsStrategy}
						onFetchSemrush={fetchSemrushData}
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

						<AdGroupsList isKeywordDuplicate={isKeywordDuplicate} />
					</div>
				</div>
				<div className="mt-6">
					<Button
						className="bg-green-600 text-white"
						onClick={handleGenerateCopies}
					>
						🟢 Continuar a generación de copies
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CampaignTool;
