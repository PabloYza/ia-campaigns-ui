import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import Login from './pages/Login';
import CampaignTool from './pages/CampaignTool';
import CampaignConfig from "./pages/CampaignConfig";
import ClientsList from "./pages/ClientsList";
import PrivateRoute from './components/PrivateRoute'; // Asegúrate de crearlo

function App() {
	return (
		<Router>
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
					path="/campaigns/:campaignId"
					element={
						<PrivateRoute>
							<CampaignConfig />
						</PrivateRoute>
					}
				/>
				<Route
					path="/campaigns/:campaignId/tool"
					element={
						<PrivateRoute>
							<CampaignTool />
						</PrivateRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
