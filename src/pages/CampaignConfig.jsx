import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CirclePlus, ArrowRightFromLine } from 'lucide-react';

import {
	setCampaignName,
	setClientName,
	setDescription,
	addKeywordGroup,
	setClientUrl,
	updateKeywordGroup,
	removeKeywordGroup,
	resetCampaign,
	setKeywords,
} from '../store/slices/campaignsSlice';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { TrashIcon } from '@/components/ui/trashIcon';

import { getCampaigns, updateCampaign, generateKeywords, getClients } from '../services/api';
import QueryHistory from '../components/campaignHistory';

const CampaignConfig = () => {
	const [error, setError] = useState('');
	const [audience, setAudience] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { campaignId } = useParams();

	const campaignData = useSelector((state) => state.campaign);

	// Cargar campaña existente al entrar
	useEffect(() => {
		const loadCampaign = async () => {
			try {
				const campaigns = await getCampaigns();
				const clients = await getClients();

				const campaign = campaigns.find((c) => c.id === parseInt(campaignId));
				if (!campaign) {
					alert("No se encontró la campaña");
					return;
				}

				const client = clients.find((c) => c.name === campaign.client_name);

				dispatch(setClientName(campaign.client_name));
				dispatch(setClientUrl(client?.url || ''));
				dispatch(setCampaignName(campaign.campaign_name));
				if (campaign.audience) setAudience(campaign.audience);
			} catch (err) {
				console.error("❌ Error al cargar campaña y cliente:", err);
			}
		};

		loadCampaign();
	}, [campaignId, dispatch]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		switch (name) {
			case 'campaignName':
				dispatch(setCampaignName(value));
				break;
			case 'description':
				dispatch(setDescription(value));
				break;
			case 'clientUrl':
				dispatch(setClientUrl(value));
				break;
			case 'audience':
				setAudience(value);
				break;
			default:
				break;
		}
	};

	const handleKeywordGroupChange = (index, e) => {
		const { name, value } = e.target;
		dispatch(updateKeywordGroup({ index, groupData: { [name]: value } }));
	};

	const handleAddKeywordGroup = () => {
		dispatch(addKeywordGroup({ groupName: '', destinationUrl: '', keywords: [] }));
	};

	const handleCreateCampaign = async () => {
		const { campaignName, clientName, clientUrl, description, adGroups } = campaignData;

		const isEmpty = !campaignName || !clientName || !clientUrl || !description;
		const hasEmptyGroup = adGroups.some(
			(group) => !group.groupName.trim() || !group.destinationUrl.trim()
		);

		if (isEmpty || hasEmptyGroup) {
			setError("Completa todos los campos antes de generar la campaña");
			return;
		}

		try {
			await updateCampaign(campaignId, {
				campaign_name: campaignName,
				description,
				client_url: clientUrl,
				audience,
			});

			// Llamamos a OpenAIa
			/* 		const response = await generateKeywords({
						clientName,
						clientUrl,
						campaignName,
						description,
						audience,
						adGroups: adGroups.map((g) => ({
							groupName: g.groupName,
							destinationUrl: g.destinationUrl,
						})),
					});
		
					dispatch(setKeywords(response.keywords)); */
			dispatch(setKeywords([
				"iconos modernos",
				"iconos para developers",
				"iconos web"
			]));
			navigate(`/campaigns/${campaignId}/tool`);

		} catch (err) {
			console.error("❌ Error al actualizar campaña:", err);
			alert("No se pudo actualizar la campaña.");
		}
	};

	return (
		<div className="p-4 bg-gray-50 max-w-5xl mx-auto">
			<Card className="mb-8 p-6 shadow-lg bg-white rounded-lg">
				<h2 className="text-2xl font-semibold mb-4">Configuración de Campaña</h2>

				<div className="space-y-6">
					{/* Sección 1: Datos del cliente */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Datos del cliente</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="clientName">Nombre del cliente</Label>
								<Input id="clientName" name="clientName" value={campaignData.clientName} disabled />
							</div>
							<div>
								<Label htmlFor="clientUrl">URL Asociada</Label>
								<Input id="clientUrl" name="clientUrl" value={campaignData.clientUrl} onChange={handleInputChange} />
							</div>
						</div>
					</div>

					{/* Sección 2: Datos de la campaña */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Datos de la campaña</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="campaignName">Nombre de la campaña</Label>
								<Input id="campaignName" name="campaignName" value={campaignData.campaignName} onChange={handleInputChange} />
							</div>
							<div>
								<Label htmlFor="description">Descripción de la campaña</Label>
								<Textarea
									id="description"
									name="description"
									value={campaignData.description}
									onChange={handleInputChange}
									placeholder="Descripción de la campaña..."
								/>
							</div>
							<div className="col-span-2 flex flex-col">
								<Label htmlFor="audience" className="mb-1 text-left">
									Grupo objetivo / audiencia (opcional)
								</Label>
								<Input
									id="audience"
									name="audience"
									value={audience}
									onChange={handleInputChange}
									className="w-90 h-10 text-base px-3"
								/>
							</div>
						</div>
					</div>

					{/* Sección 3: Grupos de anuncios */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold mb-2">Grupos de Anuncios</h3>
						<Button
							onClick={handleAddKeywordGroup}
							type="button"
							className="mb-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full px-4 py-2 text-sm font-medium shadow-sm transition"
						>
							Añadir Grupo
							<CirclePlus />
						</Button>
						{campaignData.adGroups.map((group, index) => (
							<div key={index} className="grid grid-cols-2 gap-4 mb-4">
								<div>
									<Label htmlFor={`groupName-${index}`}>Nombre del grupo</Label>
									<Input
										id={`groupName-${index}`}
										name="groupName"
										value={group.groupName}
										onChange={(e) => handleKeywordGroupChange(index, e)}
									/>
								</div>
								<div>
									<Label htmlFor={`destinationUrl-${index}`}>URL de destino</Label>
									<div className="flex items-center gap-2">
										<Input
											id={`destinationUrl-${index}`}
											name="destinationUrl"
											value={group.destinationUrl}
											onChange={(e) => handleKeywordGroupChange(index, e)}
										/>
										<button
											type="button"
											onClick={() => dispatch(removeKeywordGroup(index))}
											className="text-red-600 font-bold text-lg hover:text-red-800"
											title="Eliminar grupo"
										>
											<TrashIcon />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Botón de guardar */}
					<div className="mt-6">
						{error && <p className="text-red-600 text-sm text-center font-medium mb-2">{error}</p>}
						<Button
							className=" py-3 text-base bg-green-600 hover:bg-green-700 text-white"
							type="button"
							onClick={handleCreateCampaign}
						>
							Generar keywords
							<ArrowRightFromLine />
						</Button>
					</div>
				</div>

				<QueryHistory />
			</Card>
		</div>
	);
};

export default CampaignConfig;
