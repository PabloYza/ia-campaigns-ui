import express from 'express';
import supabase from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('"IA Campaigns"."campaigns"')
			.select('*');

		if (error) throw error;

		res.json(data);
	} catch (err) {
		console.error('❌ Error al obtener campañas:', err);
		res.status(500).json({ error: 'Error al obtener campañas' });
	}
});


router.post('/', async (req, res) => {
	const { campaign_name, client_name, description } = req.body;

	if (!campaign_name || !client_name) {
		return res.status(400).json({ error: 'Faltan campos obligatorios.' });
	}

	try {
		const { data, error } = await supabase
			.from('"IA Campaigns"."campaigns"')
			.insert([{ campaign_name, client_name, description }])
			.select();

		if (error) throw error;

		res.status(201).json({ message: 'Campaña creada correctamente', data });
	} catch (error) {
		console.error('❌ Error al crear la campaña:', error.message);
		res.status(500).json({ error: 'Error interno al guardar la campaña.' });
	}
});


export default router;

