import React, { useState } from 'react';
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";

export default function GoogleAdsConnector() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const connectToGoogleAds = useGoogleLogin({
		flow: 'auth-code',
		scope: 'https://www.googleapis.com/auth/adwords',
		access_type: 'offline',
		prompt: 'consent',

		onSuccess: async (codeResponse) => {
			setLoading(true);
			setError("");
			try {
				const res = await axios.post(`${import.meta.env.VITE_API_URL}/google-auth/code`, {
					code: codeResponse.code,
				});

				const { refresh_token } = res.data;

				if (!refresh_token) {
					toast.error("No se recibió el token de actualización. Por favor, inténtalo de nuevo.");
					setError("La cuenta de Google no proporcionó el token necesario. Asegúrate de dar todos los permisos.");
					setLoading(false);
					return;
				}

				localStorage.setItem('google_ads_mcc_token', refresh_token);

				toast.success("¡Conexión con Google Ads establecida!");

				window.location.reload();

			} catch (err) {
				console.error("❌ Error en la conexión con Google Ads:", err);
				toast.error("Error al conectar con Google Ads.");
				setError("Ocurrió un error inesperado durante la conexión.");
				setLoading(false);
			}
		},
		onError: () => {
			setError("Error al iniciar el proceso de conexión con Google.");
			setLoading(false);
		}
	});

	return (
		<div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50">
			<div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
				<h2 className="text-xl font-bold text-gray-800 mb-2">Se requiere conexión con Google Ads</h2>
				<p className="text-gray-600 mb-6">
					Para continuar, la aplicación necesita autorización para acceder a la API de Google Ads.
					<br />
					<strong className="text-red-600">Por favor, inicia sesión con la cuenta que gestiona el MCC (marketing@nothingad.com).</strong>
				</p>

				<button
					onClick={() => connectToGoogleAds()}
					disabled={loading}
					className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 disabled:bg-red-400 transition-colors duration-300 font-semibold"
				>
					{loading ? "Conectando..." : "Conectar con Google Ads"}
				</button>

				{error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}
			</div>
		</div>
	);
}