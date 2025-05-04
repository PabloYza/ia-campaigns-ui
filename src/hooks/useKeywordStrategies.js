import { useState } from 'react';
import axios from 'axios';

export default function useKeywordStrategies(initialKeywords, clientUrl) {
	const [googleAdsStrategy, setGoogleAdsStrategy] = useState([]);
	const [semrushData, setSemrushData] = useState([]);
	const [loadingGoogle, setLoadingGoogle] = useState(false);
	const [loadingSemrush, setLoadingSemrush] = useState(false);

	const fetchGoogleAdsStrategy = async (refresh_token) => {
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
			setGoogleAdsStrategy(res.data);
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
			setSemrushData(res.data);
		} catch (err) {
			console.error("❌ Semrush error:", err);
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
		fetchSemrushData
	};
}
