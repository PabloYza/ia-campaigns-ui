import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import './index.css';
import App from './App.jsx';
import Layout from "./components/layout/Layout";
import "./styles/globals.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store, persistor } from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { googleClientId } from "./lib/utils.js";

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={googleClientId}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Router>
						<Layout>
							<App />
						</Layout>
					</Router>
				</PersistGate>
			</Provider>
		</GoogleOAuthProvider>
	</StrictMode>,
);