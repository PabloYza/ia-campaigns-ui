import { GoogleAdsApi } from 'google-ads-api';

const client = new GoogleAdsApi({
	client_id: process.env.GOOGLE_CLIENT_ID,
	client_secret: process.env.GOOGLE_CLIENT_SECRET,
	developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const MAX_SEED_KEYWORDS = 10;
const TARGET_LANGUAGE = 'languageConstants/1003'; // Español
const TARGET_GEO = 'geoTargetConstants/2392';     // España

const normalizeUrl = (url) => {
	if (!url) return '';
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		return `https://${url}`;
	}
	return url;
};

/**
 * FUNCIÓN REAL: Obtiene métricas de Google Ads para una lista de keywords.
 * Usa la lógica robusta que hemos desarrollado.
 */
export async function getGoogleAdsKeywordMetrics({ keywords = [], url = '', refresh_token }) {
	if (!refresh_token) throw new Error("Falta refresh_token");

	const customer = client.Customer({
		customer_id: String(process.env.GOOGLE_ADS_CUSTOMER_ID).trim(),
		login_customer_id: String(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID).trim(),
		refresh_token,
	});

	try {
		const seedConfig = {};
		if (keywords && keywords.length > 0) {
			const limitedKeywords = keywords.slice(0, MAX_SEED_KEYWORDS);
			seedConfig.keywordSeed = { keywords: limitedKeywords };
		} else if (url) {
			seedConfig.urlSeed = { url: normalizeUrl(url) };
		} else {
			return [];
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
		if (err.request_id) console.error("  - Request ID (Google):", err.request_id);
		throw err;
	}
}

/**
 * FUNCIÓN DE PRUEBA LIGERA: Intenta generar sugerencias usando un set fijo de keywords.
 * Útil para diagnosticar problemas de conexión/autenticación fundamentales.
 */
export async function getSuggestedKeywordsFromGoogle({ keywords = [], url = '', refresh_token }) {
	if (!refresh_token) throw new Error("Falta refresh_token");

	const customer = client.Customer({
		customer_id: String(process.env.GOOGLE_ADS_CUSTOMER_ID).trim(),
		login_customer_id: String(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID).trim(),
		refresh_token,
	});

	try {
		console.log("⚠️  PRUEBA LIGERA ACTIVA en getSuggestedKeywordsFromGoogle");

		const simpleSeedConfig = {
			keywordSeed: { keywords: ['marketing digital', 'agencia seo barcelona'] }
		};

		const requestPayload = {
			customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID?.trim(),
			...simpleSeedConfig,
			geoTargetConstants: [TARGET_GEO],
			language: TARGET_LANGUAGE,
		};

		console.log("ℹ️  Payload SIMPLIFICADO enviado a Google:", JSON.stringify(requestPayload, null, 2));

		const response = await customer.keywordPlanIdeas.generateKeywordIdeas(requestPayload);

		console.log("✅ Respuesta de Google (Prueba Ligera) recibida con éxito.");

		const suggestions = response.map(idea => idea.text).filter(Boolean);
		return suggestions;

	} catch (err) {
		console.error("❌ ERROR en getSuggestedKeywordsFromGoogle (Prueba Ligera):");
		console.error("  - Tipo de Error:", err.constructor?.name);
		console.error("  - Mensaje:", err.message);
		if (err.errors) {
			console.error("  - Detalles del Error (Google):", JSON.stringify(err.errors, null, 2));
			if (err.request_id) console.error("  - Request ID (Google):", err.request_id);
		} else {
			console.error("  - Error Completo (Objeto):", err);
		}
		throw new Error(err.message || "Error desconocido desde Google Ads API (Prueba Ligera)");
	}
}