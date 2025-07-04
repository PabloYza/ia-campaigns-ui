import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClients, getClientCampaigns, generateKeywords } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import * as XLSX from "xlsx";
import {
	resetCampaign,
	setCampaignName,
	setClientName,
	setClientUrl,
	setDescription,
	setCampaignUrl,
	setAudience,
	setCampaignType,
	setGlobalKeywords,
	setCampaignLanguage
} from '../store/slices/campaignsSlice';
import CampaignData from '@/components/campaignData';

export default function ClientProfile() {
	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [client, setClient] = useState(null);
	const [clientCampaigns, setClientCampaigns] = useState([]);
	const [showNewCampaignForm, setShowNewCampaignForm] = useState(false);
	const [newCampaign, setNewCampaign] = useState({
		campaign_name: '',
		description: '',
		audience: '',
		campaign_type: '',
		campaign_url: ''
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const clients = await getClients();
				const current = clients.find(c => String(c.id) === id || c.name === id);
				if (!current) {
					toast.error("Cliente no encontrado");
					navigate("/clients");
					return;
				}

				setClient(current);
				const campaigns = await getClientCampaigns(current.name);
				setClientCampaigns(campaigns);
			} catch (err) {
				console.error("❌ Error cargando datos del cliente:", err);
				toast.error("Error al cargar datos del cliente.");
			}
		};
		fetchData();
	}, [id, navigate]);

	const handleStartCampaignConfig = async () => {
		if (!client) return;

		if (!newCampaign.campaign_name.trim() || !newCampaign.description.trim()) {
			toast.error("Por favor completa el nombre y la descripción de la campaña");
			return;
		}

		try {
			dispatch(resetCampaign());
			toast.loading("Generando keywords iniciales...");
			const response = await generateKeywords({
				clientName: client.name,
				clientUrl: client.url,
				campaignName: newCampaign.campaign_name,
				campaignUrl: newCampaign.campaign_url,
				description: newCampaign.description,
				audience: newCampaign.audience,
				campaignLanguage: newCampaign.campaign_language,
			});
			toast.dismiss();

			dispatch(setGlobalKeywords(response.keywords));
			dispatch(setCampaignName(newCampaign.campaign_name));
			dispatch(setDescription(newCampaign.description));
			dispatch(setAudience(newCampaign.audience));
			dispatch(setCampaignType(newCampaign.campaign_type));
			dispatch(setCampaignUrl(newCampaign.campaign_url));
			dispatch(setCampaignLanguage(newCampaign.campaign_language));
			dispatch(setClientName(client.name));
			dispatch(setClientUrl(client.url));
			navigate(`/campaigns/tool`);
		} catch (err) {
			toast.dismiss();
			console.error("❌ Error al iniciar la campaña:", err);
			toast.error("Error al generar keywords para la nueva campaña.");
		}
	};

	if (!client) return <div className="p-6 flex justify-center items-center h-screen">Cargando cliente...</div>;

	return (
		<div className="p-6 space-y-6">
			<div className="bg-white shadow-md p-4 rounded-lg border">
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-xl font-bold">{client.name}</h1>
						<p className="text-sm text-gray-600">{client.url}</p>
					</div>
					<Button
						className="bg-green-600 text-white hover:bg-green-700"
						onClick={() => { setShowNewCampaignForm(true) }}
					>
						Crear nueva campaña
					</Button>
				</div>

				{showNewCampaignForm && (
					<div className="mt-6 bg-gray-50 border rounded-lg p-4 space-y-4">
						<h3 className="text-md font-semibold">Configurar nueva campaña</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Input
								placeholder="Nombre de campaña"
								value={newCampaign.campaign_name}
								onChange={(e) => setNewCampaign({ ...newCampaign, campaign_name: e.target.value })}
							/>
							<Input
								placeholder="Descripción"
								value={newCampaign.description}
								onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
							/>
							<Input
								placeholder="URL de la campaña"
								value={newCampaign.campaign_url}
								onChange={(e) => setNewCampaign({ ...newCampaign, campaign_url: e.target.value })}
							/>
							<Input
								placeholder="Grupo objetivo (opcional)"
								value={newCampaign.audience}
								onChange={(e) => setNewCampaign({ ...newCampaign, audience: e.target.value })}
							/>
							<Input
								placeholder="Tipo de campaña (opcional)"
								value={newCampaign.campaign_type}
								onChange={(e) => setNewCampaign({ ...newCampaign, campaign_type: e.target.value })}
							/>
							<select
								className="border rounded px-3 py-2 text-sm"
								value={newCampaign.language}
								onChange={(e) => setNewCampaign({ ...newCampaign, campaign_language: e.target.value })}
							>
								<option value="es">Español</option>
								<option value="en">Inglés</option>
								<option value="ca">Catalán</option>
							</select>
						</div>
						<Button
							className="bg-blue-600 text-white hover:bg-blue-700"
							onClick={handleStartCampaignConfig}
						>
							Continuar con configuración
						</Button>
					</div>
				)}
			</div>

			<div className="bg-white p-4 rounded-lg shadow-md border">
				<h2 className="text-lg font-semibold mb-4">Campañas pasadas</h2>
				{clientCampaigns.length === 0 ? (
					<div className="flex flex-col items-center justify-center text-gray-500 py-8">
						<ShieldAlert size={48} className="mb-3 text-amber-400" />
						<p className="text-sm font-medium">No existen campañas asociadas a este cliente.</p>
					</div>
				) : (
					<div className="bg-white p-4 rounded-lg shadow-md border">
						<CampaignData clientName={client.name} />
					</div>

				)}
			</div>
		</div>
	);
}