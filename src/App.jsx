import { Routes, Route } from "react-router-dom"; // Ya no se importa BrowserRouter as Router
import './App.css';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import CampaignTool from './pages/CampaignTool';
import ClientsList from "./pages/ClientsList";
import ClientProfile from "./pages/ClientProfile";
import PrivateRoute from './components/PrivateRoute';
import CopyEditor from "./pages/CopyEditor";

function App() {
	return (
		<>
			<Toaster position="top-center" toastOptions={{ duration: 5000 }} />
			<Routes>
				{/* Rutas públicas */}
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />

				{/* Rutas protegidas */}
				<Route
					path="/clients"
					element={
						<PrivateRoute>
							<ClientsList />
						</PrivateRoute>
					}
				/>
				<Route
					path="/clients/:id"
					element={
						<PrivateRoute>
							<ClientProfile />
						</PrivateRoute>
					}
				/>
				<Route
					path="/campaigns/tool"
					element={
						<PrivateRoute>
							<CampaignTool />
						</PrivateRoute>
					}
				/>
				<Route
					path="/clients/:clientName/campaigns/:campaignName/copies"
					element={
						<PrivateRoute>
							<CopyEditor />
						</PrivateRoute>
					}
				/>
			</Routes>
		</>
	);
}

export default App;