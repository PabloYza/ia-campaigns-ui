import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
	setGoogleAdsStrategy as setGoogleAdsStrategyInStore,
	setSemrushStrategy as setSemrushStrategyInStore
} from '../store/slices/keywordStrategySlice';
import { generateKeywords } from '@/services/api';
import { useSelector } from 'react-redux';

// Función para obtener el token de MCC de forma segura
const getMccToken = () => {
	// La única clave que usamos para el token de la API de Ads
	return localStorage.getItem("google_ads_mcc_token");
};

export default function useKeywordStrategies(initialKeywords, clientUrl) {
	const dispatch = useDispatch();
	const [googleAdsStrategy, setGoogleAdsStrategyLocal] = useState([]);
	const [semrushData, setSemrushDataLocal] = useState([]);
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const [loadingSemrush, setLoadingSemrush] = useState(false);

	// Función genérica para manejar errores de la API de Google
	const handleGoogleApiError = (err, source) => {
		console.error(`❌ Google Ads error en ${source}:`, err);
		// Si el error indica un token inválido, lo limpiamos y recargamos
		if (err.response && (err.response.status === 400 || err.response.status === 401)) {
			console.error("Token de Google Ads inválido o expirado. Solicitando nueva conexión...");
			localStorage.removeItem("google_ads_mcc_token");
			window.location.reload();
		}
	};

	const fetchGoogleAdsStrategy = async () => {
		const refresh_token = getMccToken();
		if (!refresh_token) return; // No hacer nada si no hay token

		try {
			setLoadingGoogle(true);
			const keywords = Array.isArray(initialKeywords) ? initialKeywords : (initialKeywords || "").split(',').map(k => k.trim()).filter(Boolean);

			const res = await axios.post(`${import.meta.env.VITE_API_URL}/google-ads/keyword-metrics`, {
				keywords,
				url: clientUrl,
				refresh_token
			});

			setGoogleAdsStrategyLocal(res.data);
			dispatch(setGoogleAdsStrategyInStore(res.data));
		} catch (err) {
			handleGoogleApiError(err, 'fetchGoogleAdsStrategy');
		} finally {
			setLoadingGoogle(false);
		}
	};

	const enrichKeywordsFromGoogle = async () => {
		const refresh_token = getMccToken();
		if (!refresh_token) throw new Error("No hay un token de Google Ads conectado.");

		try {
			setLoadingGoogle(true);
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/google-ads/expand-keywords`, {
				keywords: initialKeywords,
				url: clientUrl,
				refresh_token,
			});
			return res.data.keywords || [];
		} catch (err) {
			handleGoogleApiError(err, 'enrichKeywordsFromGoogle');
			throw err; // Relanzamos el error para que el componente que lo llama pueda manejarlo
		} finally {
			setLoadingGoogle(false);
		}
	};

	const fetchSemrushData = async () => {
		try {
			setLoadingSemrush(true);
			const keywords = Array.isArray(initialKeywords) ? initialKeywords : (initialKeywords || "").split(',').map(k => k.trim()).filter(Boolean);
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/semrush/organic-keywords`, {
				keywords,
				database: 'es',
			});
			setSemrushDataLocal(res.data);
			dispatch(setSemrushStrategyInStore(res.data));
		} catch (err) {
			console.error("❌ Semrush error:", err);
		} finally {
			setLoadingSemrush(false);
		}
	};

	const enrichKeywordsFromSemrush = async () => {
		try {
			setLoadingSemrush(true);
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/semrush/expand-keywords`, {
				keywords: initialKeywords,
				url: clientUrl
			});
			return res.data.keywords || [];
		} catch (err) {
			console.error("❌ Enrichment Semrush:", err);
			throw err;
		} finally {
			setLoadingSemrush(false);
		}
	};

	const generateMoreKeywords = async () => {
		const state = JSON.parse(localStorage.getItem("persist:root")) || {};
		const campaignState = JSON.parse(state.campaign || '{}');

		const {
			clientName,
			clientUrl,
			campaignName,
			description,
			audience,
			globalKeywords = [],
		} = campaignState;

		if (!clientName || !clientUrl || !campaignName || !description) {
			console.error("❌ Información incompleta para generar keywords");
			throw new Error("Información de campaña incompleta.");
		}

		try {
			const result = await generateKeywords({
				clientName,
				clientUrl,
				campaignName,
				description,
				audience,
				globalKeywords,
			});

			// Filtrar duplicadas
			const lowerGlobal = new Set(globalKeywords.map(k => k.toLowerCase()));
			const unique = result.keywords.filter(k => !lowerGlobal.has(k.toLowerCase()));

			return unique.slice(0, 10);
		} catch (err) {
			console.error("❌ Error al generar más keywords:", err);
			throw err;
		}
	};

	return {
		googleAdsStrategy,
		semrushData,
		loadingGoogle,
		loadingSemrush,
		fetchGoogleAdsStrategy,
		fetchSemrushData,
		enrichKeywordsFromGoogle,
		enrichKeywordsFromSemrush,
		generateMoreKeywords
	};
}