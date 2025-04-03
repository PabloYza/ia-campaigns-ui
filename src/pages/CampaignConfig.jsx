import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	setCampaignName,
	setClientName,
	setDescription,
	addKeywordGroup,
	setClientUrl,
	updateKeywordGroup,
	removeKeywordGroup,
	setCreatedAt,
} from '../store/slices/campaignsSlice';
import { getEuropeanTimestamp } from '../lib/utils';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

import QueryHistory from '../components/campaignHistory';

const CampaignConfig = () => {
	const [error, setError] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const campaignData = useSelector((state) => state.campaign);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		switch (name) {
			case 'campaignName':
				dispatch(setCampaignName(value));
				break;
			case 'clientName':
				dispatch(setClientName(value));
				break;
			case 'description':
				dispatch(setDescription(value));
				break;
			case 'clientUrl':
				dispatch(setClientUrl(value));
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

	const handleGenerateCampaign = () => {
		debugger
		const { campaignName, clientName, clientUrl, description, keywordGroups } = campaignData;

		const isEmpty = !campaignName || !clientName || !clientUrl || !description;

		const hasEmptyGroup = keywordGroups.some(
			(group) => !group.groupName.trim() || !group.destinationUrl.trim()
		);

		if (isEmpty || hasEmptyGroup) {
			setError("Completa todos los campos antes de generar la campaña");
			return;
		}

		const timestamp = getEuropeanTimestamp();
		dispatch(setCreatedAt(timestamp));
		setError('');
		navigate("/tool", { replace: true });
	};

	return (
		<div className="p-4 bg-gray-50 max-w-5xl mx-auto"> {/* Ajuste aquí */}
			<Card className="mb-8 p-6 shadow-lg bg-white rounded-lg">
				<h2 className="text-2xl font-semibold mb-4">Configuración de Campaña</h2>
				<div className="space-y-6">
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="clientUrl">URL del sitio web del cliente</Label>
								<Input id="clientUrl" name="clientUrl" value={campaignData.clientUrl} onChange={handleInputChange} />
							</div>
							<div>
								<Label htmlFor="clientName">Nombre del cliente</Label>
								<Input id="clientName" name="clientName" value={campaignData.clientName} onChange={handleInputChange} />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="campaignName">Nombre de la campaña</Label>
								<Input id="campaignName" name="campaignName" value={campaignData.campaignName} onChange={handleInputChange} />
							</div>
							<div>
								<Label htmlFor="description">Breve descripción del objetivo de campaña</Label>
								<Textarea id="description" name="description" value={campaignData.description} onChange={handleInputChange} />
							</div>
						</div>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-semibold mb-2">Grupos de Palabras Clave</h3>
						<Button onClick={handleAddKeywordGroup} type="button">
							Añadir Grupo de Keywords
						</Button>
						{campaignData.keywordGroups.map((group, index) => (
							<div key={index} className="grid grid-cols-2 gap-4 mb-4">
								<div>
									<Label htmlFor={`groupName-${index}`}>Nombre del grupo</Label>
									<Input id={`groupName-${index}`} name="groupName" value={group.groupName} onChange={(e) => handleKeywordGroupChange(index, e)} />
								</div>
								<div>
									<Label htmlFor={`destinationUrl-${index}`}>URL de destino de ese grupo</Label>
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
											X
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className="mt-6">
						{error && (
							<p className="text-red-600 text-sm text-center font-medium mb-2">
								{error}
							</p>
						)}
						<Button
							className="w-full py-3 text-base bg-green-600 hover:bg-green-700 text-white"
							type="button"
							onClick={handleGenerateCampaign}
						>
							Generar Campaña
						</Button>
					</div>
				</div>
				<QueryHistory />
			</Card>
		</div>
	);
};

export default CampaignConfig;
