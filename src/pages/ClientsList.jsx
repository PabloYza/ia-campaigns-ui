import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store/slices/userSlice';
import { setActiveClient } from '../store/slices/clientsSlice';
import { getClients, createClient, createCampaign, getCampaigns, deleteClient } from '../services/api';
import { TrashIcon } from '@/components/ui/trashIcon';


const ClientsList = () => {
	const [clients, setClients] = useState([]);
	const [newClient, setNewClient] = useState({ name: '', url: '' });
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const data = await getClients();
				setClients(data);
			} catch (err) {
				console.error("❌ Error al cargar clientes:", err);
			}
		};

		fetchClients();
	}, []);

	const filteredClients = clients.filter((client) =>
		client.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleCreateClientAndCampaign = async () => {
		if (!newClient.name || !newClient.url || !user.name) return;
		setLoading(true);
		try {
			const clientData = await createClient({
				...newClient,
				created_by: user.name
			});

			dispatch(setActiveClient({ name: clientData.name, url: clientData.url }));

			const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
			const autoName = `${clientData.name} - ${new Date().toLocaleDateString()}`;

			const campaign = await createCampaign({
				campaign_name: autoName,
				client_name: clientData.name,
				description: "Campaña creada automáticamente al registrar cliente.",
				created_by: user.name,
				created_at: timestamp,
			});

			navigate(`/campaigns/${campaign.data[0].id}`);
		} catch (err) {
			console.error("❌ Error al crear cliente o campaña:", err);
			alert("Hubo un error al crear cliente o campaña.");
		} finally {
			setLoading(false);
		}
	};

	const handleSelectClient = async (client) => {
		setLoading(true);
		try {
			dispatch(setActiveClient({ name: client.name, url: client.url }));

			const campaigns = await getCampaigns();
			const existing = campaigns.find((c) => c.client_name === client.name);

			if (existing) {
				navigate(`/campaigns/${existing.id}`);
			} else {
				const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");
				const autoName = `${client.name} - ${new Date().toLocaleDateString()}`;
				const data = await createCampaign({
					campaign_name: autoName,
					client_name: client.name,
					description: "Campaña creada desde cliente existente.",
					created_by: user.name,
					created_at: timestamp,
				});
				navigate(`/campaigns/${data.data[0].id}`);
			}
		} catch (err) {
			console.error("❌ Error al gestionar selección de cliente:", err);
			alert("No se pudo continuar con la campaña.");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateClientOnly = async () => {
		if (!newClient.name || !newClient.url || !user.name) return;
		setLoading(true);
		try {
			await createClient({ ...newClient, created_by: user.name });
			setNewClient({ name: '', url: '' });
			const data = await getClients();
			setClients(data);
			alert("Cliente creado correctamente.");
		} catch (err) {
			console.error("❌ Error al crear cliente:", err);
			alert("Error al crear cliente.");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClient = async (clientId) => {
		const confirmed = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
		if (!confirmed) return;

		try {
			await deleteClient(clientId);
			const updatedList = await getClients();
			setClients(updatedList);
		} catch (err) {
			alert("Error al eliminar cliente.");
		}
	};

	return (
		<div className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md border">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Crear nuevo cliente (columna izquierda) */}
				<div className="md:col-span-1 space-y-4">
					<h3 className="text-lg font-semibold">Crear nuevo cliente</h3>
					<Input
						placeholder="Nombre del cliente"
						value={newClient.name}
						onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
					/>
					<Input
						placeholder="URL del cliente"
						value={newClient.url}
						onChange={(e) => setNewClient({ ...newClient, url: e.target.value })}
					/>
					<div className="space-y-2 pt-2">
						<Button
							className="w-full bg-blue-600 text-white hover:bg-blue-700"
							onClick={handleCreateClientAndCampaign}
							disabled={loading}
						>
							{loading ? "Creando..." : "Crear cliente y campaña"}
						</Button>
						<Button
							className="w-full bg-green-100 text-green-700 hover:bg-green-200"
							onClick={handleCreateClientOnly}
							disabled={loading}
						>
							{loading ? "Creando..." : "Crear cliente sin campaña"}
						</Button>
					</div>
				</div>

				{/* Lista de clientes existentes */}
				<div className="md:col-span-2">
					<h3 className="text-lg font-semibold mb-4">Selecciona un cliente existente</h3>

					<div className="mb-4">
						<Input
							placeholder="Buscar cliente por nombre..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className="max-h-[500px] overflow-y-auto pr-2">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							{filteredClients.map((client) => (
								<div
									key={client.id}
									className="p-4 border rounded hover:bg-gray-50 transition flex flex-col justify-between cursor-pointer"
								>
									<div onClick={() => handleSelectClient(client)}>
										<h4 className="font-medium">{client.name}</h4>
										<p className="text-sm text-gray-500">{client.url}</p>
									</div>
									<button
										variant="ghost"
										className="mt-4 text-red-600 hover:text-red-800 text-sm px-0 w-fit self-end"
										onClick={() => handleDeleteClient(client.id)}
									>
										<TrashIcon />
									</button>

								</div>
							))}

							{filteredClients.length === 0 && (
								<p className="text-sm text-gray-500 col-span-full">
									No hay clientes que coincidan con tu búsqueda.
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ClientsList;
