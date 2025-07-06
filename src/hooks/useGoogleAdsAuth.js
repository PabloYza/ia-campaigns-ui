import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";

export const useGoogleAdsLogin = ({ onSuccess, onError }) => {
	const connectAds = useGoogleLogin({
		flow: 'auth-code',
		access_type: 'offline',
		prompt: 'consent',
		scope: 'https://www.googleapis.com/auth/adwords',
		onSuccess: async ({ code }) => {
			try {
				const res = await axios.post(`${import.meta.env.VITE_API_URL}/google-auth/code`, { code });
				const { refresh_token } = res.data;

				if (!refresh_token) {
					toast.error("No se recibió el token de actualización de Google.");
					if (onError) onError("No se recibió el refresh_token.");
					return;
				}

				localStorage.setItem("google_ads_mcc_token", refresh_token);

				toast.success("¡Conexión con Google Ads establecida!");
				if (onSuccess) onSuccess();

			} catch (err) {
				console.error("❌ Error en login de Google Ads:", err);
				toast.error("Error al conectar con Google Ads.");
				if (onError) onError(err);
			}
		},
		onError: (err) => {
			toast.error("Error al iniciar el proceso de conexión con Google.");
			if (onError) onError(err);
		},
	});

	return connectAds;
};