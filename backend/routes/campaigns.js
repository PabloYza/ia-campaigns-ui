import express from 'express';
import supabase from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('campaigns')
			.select('*');

		if (error) throw error;

		res.json(data);
	} catch (err) {
		console.error('❌ Error al obtener campañas:', err);
		res.status(500).json({ error: 'Error al obtener campañas' });
	}
});


router.post('/', async (req, res) => {
	const { campaign_name, client_name, description, created_by, created_at } = req.body;

	if (!campaign_name || !client_name) {
		return res.status(400).json({ error: 'Faltan campos obligatorios.' });
	}

	try {
		const { data, error } = await supabase
			.from('campaigns')
			.insert([{ campaign_name, client_name, description, created_by, created_at }])
			.select();

		if (error) throw error;

		res.status(201).json({ message: 'Campaña creada correctamente', data });
	} catch (error) {
		console.error('❌ Error al crear la campaña:', error);
		res.status(500).json({ error: 'Error interno al guardar la campaña.' });
	}
});

router.patch('/:id', async (req, res) => {
	const { id } = req.params;
	const { campaign_name, description } = req.body;

	if (!campaign_name && !description) {
		return res.status(400).json({ error: 'No se enviaron campos a actualizar' });
	}

	const updateFields = {};
	if (campaign_name) updateFields.campaign_name = campaign_name;
	if (description) updateFields.description = description;

	try {
		const { data, error } = await supabase
			.from('campaigns')
			.update(updateFields)
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;

		res.status(200).json({ message: 'Campaña actualizada correctamente', data });
	} catch (error) {
		console.error('❌ Error al actualizar campaña:', error);
		res.status(500).json({ error: 'Error al actualizar la campaña' });
	}
});


export default router;

