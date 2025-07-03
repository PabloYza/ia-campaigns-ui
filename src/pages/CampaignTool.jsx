import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { updateAdGroupCopies, addKeywordGroup, setGlobalKeywords } from '@/store/slices/campaignsSlice';
import { generateCopies } from '@/services/api';
import { saveCampaignToDB } from "@/services/api";

import toast from 'react-hot-toast';

import KeywordEditor from '../components/keywordEditor';
import KeywordStrategyPanel from '@/components/keywordStrategyPanel';
import AdGroupsList from '../components/adGroupList';
import useKeywordStrategies from '@/hooks/useKeywordStrategies';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CampaignTool = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const campaignData = useSelector((state) => state.campaign);
	const globalKeywords = useSelector((state) => state.campaign.globalKeywords);
	const adGroups = useSelector(state => state.campaign.adGroups);
	const user = useSelector(state => state.user);

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
			const data = await generateCopies({
				adGroups,
				campaignLanguage: campaignData.campaignLanguage
			});
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

	const handleSaveDraft = async () => {
		const payload = {
			client_name: campaignData.clientName,
			campaign_name: campaignData.campaignName,
			description: campaignData.description,
			client_url: campaignData.clientUrl,
			audience: campaignData.audience,
			campaign_type: campaignData.campaignType,
			campaign_language: campaignData.campaignLanguage,
			ad_groups: adGroups,
			global_keywords: globalKeywords,
			created_by: user?.email || "anon",
			created_at: new Date().toISOString(),
			campaign_status: "En curso"
		};

		try {
			await saveCampaignToDB(payload);
			toast.success("Borrador guardado correctamente");
			navigate('/clients');
		} catch (err) {
			toast.error("Error al guardar borrador");
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
					<label className="text-sm font-medium text-gray-700">URL de Campaña</label>
					<Input value={campaignData.campaignUrl} disabled />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
				<div className="mt-6 flex gap-4 items-center">
					<Button
						className="bg-green-600 text-white hover:bg-green-700"
						onClick={handleGenerateCopies}
					>
						🟢 Continuar a generación de copies
					</Button>
					<Button
						onClick={handleSaveDraft}
						className="bg-gray-700 text-white hover:bg-gray-800"
					>
						💾 Guardar borrador
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CampaignTool;