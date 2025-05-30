import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";

export const useGoogleAdsLogin = () => {
	const connectAds = useGoogleLogin({
		flow: 'auth-code',
		access_type: 'offline',
		prompt: 'consent',
		scope: 'https://www.googleapis.com/auth/adwords',
		onSuccess: async ({ code }) => {
			try {
				const res = await axios.post(`${import.meta.env.VITE_API_URL}/google-auth/code`, { code });

				const { access_token, refresh_token, expires_in } = res.data;

				if (!refresh_token) {
					toast.error("No se recibió refresh_token. ¿Ya diste permisos antes?");
					return;
				}

				localStorage.setItem("google_ads_API_token", JSON.stringify({
					access_token,
					refresh_token,
					expires_at: Date.now() + expires_in * 1000,
				}));

				toast.success("Google Ads conectado correctamente 🎯");
			} catch (err) {
				console.error("❌ Error en login de Google Ads:", err);
				toast.error("Error al conectar con Google Ads");
			}
		},
		onError: () => toast.error("Error al conectar con Google Ads"),
	});

	return connectAds;
};
