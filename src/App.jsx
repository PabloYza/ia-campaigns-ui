import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

import Login from './pages/Login'
import CampaignTool from './pages/CampaignTool'
import CampaignConfig from "./pages/CampaignConfig";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/config" element={<CampaignConfig />} />
				<Route path="/tool" element={<CampaignTool />} />
			</Routes>
		</Router>
	);
}

export default App;
