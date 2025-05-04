import { GoogleAdsApi } from 'google-ads-api';
console.log("✅ googleAdsService.js se cargó");
const client = new GoogleAdsApi({
	client_id: process.env.GOOGLE_CLIENT_ID,
	client_secret: process.env.GOOGLE_CLIENT_SECRET,
	developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

export async function getGoogleAdsKeywordMetrics({ keywords = [], url = '', refresh_token }) {
	if (!refresh_token) throw new Error("Falta refresh_token");
	const customer = client.Customer({
		customer_id: String(process.env.GOOGLE_ADS_CUSTOMER_ID).trim(),
		login_customer_id: String(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID).trim(),
		refresh_token,
	});

	try {
		console.log("📤 Llamando a generateKeywordIdeas con:", {
			keywords,
			url,
			customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
			login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
		});
		const response = await customer.keywordPlanIdeas.generateKeywordIdeas({
			customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID?.trim(), // 👈 importante
			...(keywords.length && { keywordSeed: { keywords } }),
			...(url && { urlSeed: { url } }),
			geoTargetConstants: ['geoTargetConstants/2392'],
			language: 'languageConstants/1003',
		});

		// Normaliza...
		return response.map(idea => ({
			keyword: idea.text,
			avg_monthly_searches: idea.keyword_idea_metrics?.avg_monthly_searches || 0,
			competition: idea.keyword_idea_metrics?.competition || 'UNSPECIFIED',
			suggested_bid: idea.keyword_idea_metrics?.high_top_of_page_bid_micros
				? (idea.keyword_idea_metrics.high_top_of_page_bid_micros / 1_000_000).toFixed(2)
				: null,
		}));
	} catch (err) {
		console.error("❌ ERROR en getGoogleAdsKeywordMetrics:");
		console.error("🧨 Tipo:", err.constructor?.name);
		console.error("🔍 Mensaje:", err.message);
		console.error("📦 Stack:", err.stack);
		console.error("📦 Data completa:", err.response?.data || err);
		throw err;
	}
}
