import { GoogleAdsApi } from 'google-ads-api';

const client = new GoogleAdsApi({
	client_id: process.env.GOOGLE_CLIENT_ID,
	client_secret: process.env.GOOGLE_CLIENT_SECRET,
	developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const MAX_SEED_KEYWORDS = 10;
const TARGET_LANGUAGE = 'languageConstants/1003'; // Español
const TARGET_GEO = 'geoTargetConstants/2392';     // España

// --- FUNCIÓN AUXILIAR PARA NORMALIZAR URL ---
const normalizeUrl = (url) => {
	if (!url) return '';
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return `https://${url}`;
	}
	return url;
};

export async function getGoogleAdsKeywordMetrics({ keywords = [], url = '', refresh_token }) {
	if (!refresh_token) throw new Error("Falta refresh_token");

	const customer = client.Customer({
		customer_id: String(process.env.GOOGLE_ADS_CUSTOMER_ID).trim(),
		login_customer_id: String(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID).trim(),
		refresh_token,
	});

	try {
		const seedConfig = {};
		// --- LÓGICA DE AISLAMIENTO ---
		// Si hay keywords, IGNORAMOS la URL por completo.
		if (keywords && keywords.length > 0) {
			const limitedKeywords = keywords.slice(0, MAX_SEED_KEYWORDS);
			seedConfig.keywordSeed = { keywords: limitedKeywords };
		}
		// Solo si NO hay keywords, consideramos usar la URL.
		else if (url) {
			seedConfig.urlSeed = { url: normalizeUrl(url) };
		} else {
			return []; // No hay nada que buscar
		}

		const response = await customer.keywordPlanIdeas.generateKeywordIdeas({
			customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID?.trim(),
			...seedConfig,
			geoTargetConstants: [TARGET_GEO],
			language: TARGET_LANGUAGE,
		});

		return response.map(idea => ({
			keyword: idea.text,
			avg_monthly_searches: idea.keyword_idea_metrics?.avg_monthly_searches || 0,
			competition: idea.keyword_idea_metrics?.competition || 'UNSPECIFIED',
			suggested_bid: idea.keyword_idea_metrics?.high_top_of_page_bid_micros
				? (idea.keyword_idea_metrics.high_top_of_page_bid_micros / 1_000_000).toFixed(2)
				: null,
		}));

	} catch (err) {
		console.error("❌ ERROR en getGoogleAdsKeywordMetrics:", err);
		if (err.errors) console.error("  - Detalles del Error (Google):", JSON.stringify(err.errors, null, 2));
		throw err;
	}
}

export async function getSuggestedKeywordsFromGoogle({ keywords = [], url = '', refresh_token }) {
	if (!refresh_token) throw new Error("Falta refresh_token");

	const customer = client.Customer({
		customer_id: String(process.env.GOOGLE_ADS_CUSTOMER_ID).trim(),
		login_customer_id: String(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID).trim(),
		refresh_token,
	});

	try {
		console.log("📤 Sugerencias expand-keywords con:", { keywords, url });

		const seedConfig = {};
		// --- LÓGICA DE AISLAMIENTO ---
		// Exactamente la misma lógica que en la otra función para ser consistentes.
		if (keywords && keywords.length > 0) {
			const limitedKeywords = keywords.slice(0, MAX_SEED_KEYWORDS);
			seedConfig.keywordSeed = { keywords: limitedKeywords };
		} else if (url) {
			seedConfig.urlSeed = { url: normalizeUrl(url) };
		} else {
			throw new Error("Debes proporcionar al menos keywords o url");
		}

		const response = await customer.keywordPlanIdeas.generateKeywordIdeas({
			customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID?.trim(),
			...seedConfig,
			geoTargetConstants: [TARGET_GEO],
			language: TARGET_LANGUAGE,
		});

		const suggestions = response.map(idea => idea.text).filter(Boolean);
		return suggestions;

	} catch (err) {
		console.error("❌ ERROR en getSuggestedKeywordsFromGoogle:");
		if (err.errors) console.error("  - Detalles del Error (Google):", JSON.stringify(err.errors, null, 2));
		throw new Error(err.message || "Error desconocido desde Google Ads API");
	}
}