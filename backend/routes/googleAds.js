const { GoogleAdsApi } = require('google-ads-api');

const client = new GoogleAdsApi({
	client_id: process.env.GOOGLE_CLIENT_ID,
	client_secret: process.env.GOOGLE_CLIENT_SECRET,
	developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
	customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
	refresh_token: process.env.GOOGLE_REFRESH_TOKEN, // desde el login
	login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
});

async function fetchIdeas() {
	const results = await customer.keywordPlanIdeas.generateKeywordIdeas({
		keywordSeed: {
			keywords: ['limpieza industrial', 'servicios desinfección']
		},
		geoTargetConstants: ['geoTargetConstants/2392'], // España
		language: 'languageConstants/1003',
	});

	console.log(results);
}

fetchIdeas();
