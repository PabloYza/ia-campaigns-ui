import express from 'express';
import { getOrganicKeywordData } from '../services/semrushService.js';

const router = express.Router();

router.post('/organic-keywords', async (req, res) => {
	const { keywords, database = 'es' } = req.body;

	if (!Array.isArray(keywords) || keywords.length === 0) {
		return res.status(400).json({ error: 'Debe enviar un array de keywords' });
	}

	try {
		const results = await Promise.all(
			keywords.map(async (kw) => {
				const data = await getOrganicKeywordData({ keyword: kw, database });
				return {
					keyword: kw,
					data
				};
			})
		);

		res.json(results);
	} catch (err) {
		res.status(500).json({ error: err.message || 'Error procesando keywords' });
	}
});

export default router;
