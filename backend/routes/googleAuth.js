import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/code', async (req, res) => {
	const { code } = req.body;

	if (!code) return res.status(400).json({ error: 'Missing authorization code' });

	try {
		const response = await axios.post('https://oauth2.googleapis.com/token', {
			code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: 'http://localhost:5173',
			grant_type: 'authorization_code',
		});

		const { access_token, refresh_token, expires_in } = response.data;

		console.log("✅ Token obtenido:", { access_token, refresh_token });

		res.json({ access_token, refresh_token, expires_in });
	} catch (err) {
		console.error("❌ Error al intercambiar token:", err.response?.data || err.message);
		res.status(500).json({ error: 'Token exchange failed' });
	}
});


export default router;
