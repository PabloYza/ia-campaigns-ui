import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClients, getClientCampaigns, generateKeywords } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import {
	resetCampaign,
	setCampaignName,
	setClientName,
	setClientUrl,
	setDescription,
	setAudience,
	setCampaignType,
	setGlobalKeywords
} from '../store/slices/campaignsSlice';

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
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const clients = await getClients();
				const current = clients.find(c => String(c.id) === id || c.name === id);
				if (!current) return toast.error("Cliente no encontrado");

				setClient(current);
				const campaigns = await getClientCampaigns(current.name);
				setClientCampaigns(campaigns);
			} catch (err) {
				console.error("❌ Error cargando datos del cliente:", err);
			}
		};
		fetchData();
	}, [id]);

	const handleStartCampaignConfig = async () => {
		if (!client) return;

		if (!newCampaign.campaign_name.trim() || !newCampaign.description.trim()) {
			toast.error("Por favor completa el nombre y la descripción de la campaña");
			return;
		}

		try {
			dispatch(resetCampaign());

			const response = await generateKeywords({
				clientName: client.name,
				clientUrl: client.url,
				campaignName: newCampaign.campaign_name,
				description: newCampaign.description,
				audience: newCampaign.audience,
			});

			dispatch(setGlobalKeywords(response.keywords));
			dispatch(setCampaignName(newCampaign.campaign_name));
			dispatch(setDescription(newCampaign.description));
			dispatch(setAudience(newCampaign.audience));
			dispatch(setCampaignType(newCampaign.campaign_type));
			dispatch(setClientName(client.name));
			dispatch(setClientUrl(client.url));

			navigate(`/campaigns/tool`);
		} catch (err) {
			console.error("❌ Error al iniciar la campaña:", err);
			toast.error("Error al generar keywords");
		}
	};

	if (!client) return <div className="p-6">Cargando cliente...</div>;

	return (
		<div className="p-6 space-y-6">
			{/* Card con datos del cliente + botón y formulario */}
			<div className="bg-white shadow-md p-4 rounded-lg border">
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-xl font-bold">{client.name}</h1>
						<p className="text-sm text-gray-600">{client.url}</p>
					</div>
					<Button
						className="bg-green-600 text-white"
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
								placeholder="Grupo objetivo (opcional)"
								value={newCampaign.audience}
								onChange={(e) => setNewCampaign({ ...newCampaign, audience: e.target.value })}
							/>
							<Input
								placeholder="Tipo de campaña (opcional)"
								value={newCampaign.campaign_type}
								onChange={(e) => setNewCampaign({ ...newCampaign, campaign_type: e.target.value })}
							/>
						</div>
						<Button
							className="bg-blue-600 text-white"
							onClick={handleStartCampaignConfig}
						>
							Continuar con configuración
						</Button>
					</div>
				)}
			</div>

			{/* Card de campañas pasadas */}
			<div className="bg-white p-4 rounded-lg shadow-md border">
				<h2 className="text-lg font-semibold mb-4">Campañas pasadas</h2>

				{clientCampaigns.length === 0 ? (
					<div className="flex flex-col items-center justify-center text-gray-500 py-8">
						<ShieldAlert size={48} className="mb-3 text-amber-400" />
						<p className="text-sm font-medium">No existen campañas asociadas a este cliente.</p>
					</div>
				) : (
					<ul className="space-y-2">
						{clientCampaigns.map(c => (
							<li
								key={c.id}
								className="border p-3 rounded hover:bg-gray-50 cursor-pointer"
								onClick={() => navigate(`/campaigns/${c.id}`)}
							>
								<h3 className="font-semibold">{c.campaign_name}</h3>
								<p className="text-xs text-gray-500">{c.description}</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
