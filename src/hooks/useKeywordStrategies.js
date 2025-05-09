import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import {
	setGoogleAdsStrategy,
	setSemrushStrategy
} from '../store/slices/keywordStrategySlice';

export default function useKeywordStrategies(initialKeywords, clientUrl) {
	const dispatch = useDispatch();

	// 🔑 Leer refresh_token directamente de localStorage
	const tokenData = JSON.parse(localStorage.getItem("google_ads_token"));
	const refresh_token = tokenData?.refresh_token;
	const [googleAdsStrategy, setGoogleAdsStrategyLocal] = useState([]);
	const [semrushData, setSemrushDataLocal] = useState([]);
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const [loadingSemrush, setLoadingSemrush] = useState(false);

	const fetchGoogleAdsStrategy = async () => {
		try {
			setLoadingGoogle(true);

			const keywords = Array.isArray(initialKeywords)
				? initialKeywords
				: (initialKeywords || "").split(',').map(k => k.trim()).filter(Boolean);

			const res = await axios.post("http://localhost:3001/google-ads/keyword-metrics", {
				keywords,
				url: clientUrl,
				refresh_token
			});

			setGoogleAdsStrategyLocal(res.data);
			dispatch(setGoogleAdsStrategy(res.data));
		} catch (err) {
			console.error("❌ Google Ads error:", err);
		} finally {
			setLoadingGoogle(false);
		}
	};

	const fetchSemrushData = async () => {
		try {
			setLoadingSemrush(true);

			const keywords = Array.isArray(initialKeywords)
				? initialKeywords
				: (initialKeywords || "").split(',').map(k => k.trim()).filter(Boolean);

			const res = await axios.post("http://localhost:3001/semrush/organic-keywords", {
				keywords,
				database: 'es',
			});

			setSemrushDataLocal(res.data);
			dispatch(setSemrushStrategy(res.data));
		} catch (err) {
			console.error("❌ Semrush error:", err);
		} finally {
			setLoadingSemrush(false);
		}
	};

	const enrichKeywordsFromGoogle = async () => {
		try {
			setLoadingGoogle(true);

			// Recuperar el refresh_token desde localStorage
			const tokenData = JSON.parse(localStorage.getItem("google_ads_API_token"));
			const refresh_token = tokenData?.refresh_token;

			if (!refresh_token) {
				throw new Error("No se encontró refresh_token en localStorage");
			}

			const res = await axios.post("http://localhost:3001/google-ads/expand-keywords", {
				keywords: initialKeywords,
				url: clientUrl,
				refresh_token,
			});

			return res.data.keywords || [];
		} catch (err) {
			console.error("❌ Enrichment Google Ads:", err);
			throw err;
		} finally {
			setLoadingGoogle(false);
		}
	};

	const enrichKeywordsFromSemrush = async () => {
		try {
			setLoadingSemrush(true);

			const res = await axios.post("http://localhost:3001/semrush/expand-keywords", {
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

	return {
		googleAdsStrategy,
		semrushData,
		loadingGoogle,
		loadingSemrush,
		fetchGoogleAdsStrategy,
		fetchSemrushData,
		enrichKeywordsFromGoogle,
		enrichKeywordsFromSemrush
	};
}
