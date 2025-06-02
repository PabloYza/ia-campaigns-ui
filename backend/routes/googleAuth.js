import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/code', async (req, res) => {
	const { code } = req.body;

	if (!code) {
		return res.status(400).json({ error: 'Missing authorization code' });
	}

	const isProd = process.env.NODE_ENV === 'production';
	const redirect_uri = isProd
		? process.env.REDIRECT_URI_PROD
		: process.env.REDIRECT_URI_DEV;

	try {
		console.log("🔁 Redirect URI usado:", redirect_uri);
		console.log("📥 Código recibido:", code);

		const payload = new URLSearchParams();
		payload.append('code', code);
		payload.append('client_id', process.env.GOOGLE_CLIENT_ID);
		payload.append('client_secret', process.env.GOOGLE_CLIENT_SECRET);
		payload.append('redirect_uri', redirect_uri);
		payload.append('grant_type', 'authorization_code');

		const response = await axios.post(
			'https://oauth2.googleapis.com/token',
			payload.toString(),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		const { access_token, refresh_token, expires_in, scope } = response.data;

		console.log("✅ Token obtenido:", { access_token, refresh_token, scope });

		if (!refresh_token) {
			console.warn("⚠️ No se recibió refresh_token (el usuario quizás ya otorgó acceso anteriormente sin prompt='consent')");
		}

		res.json({ access_token, refresh_token, expires_in });
	} catch (err) {
		console.error("❌ Error al intercambiar token:", err.response?.data || err.message);
		res.status(500).json({ error: 'Fallo en el intercambio de código OAuth' });
	}
});

export default router;
