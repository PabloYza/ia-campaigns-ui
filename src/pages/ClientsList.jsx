import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store/slices/userSlice';
import { setActiveClient } from '../store/slices/clientsSlice';
import { getClients, createClient, deleteClient } from '../services/api';
import toast from 'react-hot-toast';
import { TrashIcon } from '@/components/ui/trashIcon';
import useConfirmToast from '@/hooks/useConfirmToast.jsx';
import GoogleAdsConnector from '@/components/googleAdsConnector';

const ClientsList = () => {
	// 2. Estados para manejar el estado de la conexión
	const [isAdsConnected, setIsAdsConnected] = useState(false);
	const [isCheckingConnection, setIsCheckingConnection] = useState(true);

	const [clients, setClients] = useState([]);
	const [newClient, setNewClient] = useState({ name: '', url: '' });
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// 3. Verificar la conexión al cargar la página
	useEffect(() => {
		const mccToken = localStorage.getItem('google_ads_mcc_token');
		if (mccToken) {
			setIsAdsConnected(true);
		}
		setIsCheckingConnection(false);
	}, []);

	useEffect(() => {
		// Solo cargar clientes si la conexión con Ads está establecida
		if (isAdsConnected) {
			const fetchClients = async () => {
				try {
					const data = await getClients();
					setClients(data);
				} catch (err) {
					console.error("❌ Error al cargar clientes:", err);
					toast.error("No se pudieron cargar los clientes.");
				}
			};
			fetchClients();
		}
	}, [isAdsConnected]);

	const filteredClients = clients.filter((client) =>
		client.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleSelectClient = async (client) => {
		dispatch(setActiveClient({ name: client.name, url: client.url }));
		navigate(`/clients/${client.id}`);
	};

	const handleCreateClientOnly = async () => {
		if (!newClient.name || !newClient.url || !user.name) return;
		setLoading(true);
		try {
			await createClient({ ...newClient, created_by: user.name });
			setNewClient({ name: '', url: '' });
			const data = await getClients();
			setClients(data);
			toast.success("Cliente creado correctamente.");
		} catch (err) {
			console.error("❌ Error al crear cliente:", err);
			toast.error("Error al crear cliente.");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteClient = async (clientId) => {
		useConfirmToast({
			message: "¿Estás seguro de que quieres eliminar este cliente?",
			onConfirm: async () => {
				try {
					await deleteClient(clientId);
					const updatedList = await getClients();
					setClients(updatedList);
					toast.success("Cliente eliminado correctamente.");
				} catch (err) {
					toast.error("Error al eliminar cliente.");
				}
			}
		});
	};

	// 4. Lógica de renderizado condicional
	if (isCheckingConnection) {
		return <div className="flex items-center justify-center h-screen"><p className="text-lg">Verificando conexión con Google Ads...</p></div>;
	}

	if (!isAdsConnected) {
		return <GoogleAdsConnector />;
	}

	// El resto del componente se renderiza solo si la conexión es exitosa
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
							className="w-full bg-green-100 text-green-700 hover:bg-green-200"
							onClick={handleCreateClientOnly}
							disabled={loading}
						>
							{loading ? "Creando..." : "Crear cliente"}
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