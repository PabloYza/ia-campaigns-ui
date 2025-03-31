import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
	setCampaignName,
	setClientName,
	setDescription,
	addKeywordGroup,
	updateKeywordGroup,
} from '../store/slices/campaignsSlice';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

import QueryHistory from '../components/campaignHistory';

const CampaignConfig = () => {
	const dispatch = useDispatch();
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

	return (
		<div className="p-4 bg-gray-50 max-w-5xl mx-auto"> {/* Ajuste aquí */}
			<Card className="mb-6">
				<h2 className="text-2xl font-semibold mb-4">Configuración de Campaña</h2>
				<div className="space-y-6">
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="clientUrl">URL del sitio web del cliente</Label>
								<Input id="clientUrl" name="clientUrl" />
							</div>
							<div>
								<Label htmlFor="clientName">Nombre del cliente</Label>
								<Input id="clientName" name="clientName" value={campaignData.clientName} onChange={handleInputChange} />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Label htmlFor="description">Breve descripción del objetivo de campaña</Label>
								<Textarea id="description" name="description" value={campaignData.description} onChange={handleInputChange} />
							</div>
							<div>
								<Label htmlFor="campaignDescription">Breve descripción del objetivo de campaña</Label>
								<Textarea id="campaignDescription" name="campaignDescription" />
							</div>
						</div>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-semibold mb-2">Grupos de Palabras Clave</h3>
						{campaignData.keywordGroups.map((group, index) => (
							<div key={index} className="grid grid-cols-2 gap-4 mb-4">
								<div>
									<Label htmlFor={`groupName-${index}`}>Nombre del grupo</Label>
									<Input id={`groupName-${index}`} name="groupName" value={group.groupName} onChange={(e) => handleKeywordGroupChange(index, e)} />
								</div>
								<div>
									<Label htmlFor={`destinationUrl-${index}`}>URL de destino de ese grupo</Label>
									<Input id={`destinationUrl-${index}`} name="destinationUrl" value={group.destinationUrl} onChange={(e) => handleKeywordGroupChange(index, e)} />
								</div>
							</div>
						))}
						<Button onClick={handleAddKeywordGroup} type="button">
							Añadir Grupo de Keywords
						</Button>
					</div>
					<div className="mt-6">
						<Button className="w-full">Generar Campaña</Button>
					</div>
				</div>
				<QueryHistory />
			</Card>
		</div>
	);
};

export default CampaignConfig;
