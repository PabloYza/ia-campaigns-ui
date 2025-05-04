import express from 'express';
console.log("🔁 Importando servicio de Google Ads...");
import { getGoogleAdsKeywordMetrics } from '../services/googleAdsService.js';

const router = express.Router();

router.post('/keyword-metrics', async (req, res) => {
	const { keywords, url, refresh_token } = req.body;
	console.log("📡 Endpoint activo. Body:", req.body);
	if (!Array.isArray(keywords) || keywords.length === 0) {
		return res.status(400).json({ error: 'Debes enviar un array de keywords' });
	}
	if (!refresh_token) {
		return res.status(400).json({ error: 'Falta el refresh_token' });
	}

	try {
		const metrics = await getGoogleAdsKeywordMetrics({ keywords, url, refresh_token });
		res.json(metrics);
	} catch (err) {
		console.error("❌ Error al obtener métricas desde Google Ads:", err.message);
		res.status(500).json({ error: 'Error al obtener métricas de Google Ads' });
	}
});

export default router;
