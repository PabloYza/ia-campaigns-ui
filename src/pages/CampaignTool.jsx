import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import KeywordGroupsList from '../components/keywordGroupList';

const CampaignTool = () => {
	const campaignData = useSelector((state) => state.campaign);

	return (
		<div className="w-full px-4 py-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* LEFT COLUMN - Campaign Config */}
				<div className="bg-white shadow-md rounded-lg p-4 md:col-span-1 border">
					<h2 className="text-lg font-semibold mb-4">Detalles de Campaña</h2>
					<div className="space-y-4 " style={{ textAlign: 'left' }}>
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
							<Textarea value={campaignData.description} disabled />
						</div>

						<div>
							<label className="text-sm font-medium text-gray-700">URL Principal</label>
							<Input value={campaignData.clientUrl} disabled />
						</div>
					</div>

					<div className="mt-6">
						<Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
							Generar CSV
						</Button>
					</div>
				</div>

				{/* RIGHT COLUMN - Steps + Keyword Groups */}
				<div className="md:col-span-2 space-y-8">
					<div className="bg-white p-4 rounded-lg shadow-md border">
						<h3 className="text-base font-semibold mb-4">Keyword Groups</h3>
						<KeywordGroupsList />
					</div>
					{/* STEP 1 */}
					<div className="bg-white p-4 rounded-lg shadow-md border">
						<h3 className="text-base font-semibold mb-2">Step 1: Initial Keywords</h3>
						<Textarea placeholder="Comma-separated list..." rows={3} />
						<Button className="mt-2">Regenerate with OpenAI</Button>
					</div>

					{/* STEP 2 */}
					<div className="bg-white p-4 rounded-lg shadow-md border">
						<h3 className="text-base font-semibold mb-2">Step 2: Google Ads Keyword Planner</h3>
						<Button>Fetch from Google Ads</Button>
					</div>

					{/* STEP 3 */}
					<div className="bg-white p-4 rounded-lg shadow-md border">
						<h3 className="text-base font-semibold mb-2">Step 3: SEMrush Strategy</h3>
						{/* Output from SEMrush */}
						<div className="space-y-4">
							<div>
								<p className="font-semibold">Limpieza Industrial Rápida</p>
								<p className="text-sm text-gray-700">Servicio profesional para naves, fábricas y almacenes. Pide tu presupuesto gratis.</p>
							</div>
							{/* Buttons can be added per copy item */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CampaignTool;
