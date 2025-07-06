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
	const {
		campaign_name,
		client_name,
		description,
		audience,
		client_url,
		created_by,
		created_at,
		ad_groups,
		global_keywords,
		campaign_type,
		campaign_url,
		campaign_language,
		campaign_status
	} = req.body;

	if (!campaign_name || !client_name || !created_by || !created_at || !Array.isArray(ad_groups)) {
		return res.status(400).json({ error: 'Faltan campos obligatorios o mal formateados.' });
	}

	try {
		const { data, error } = await supabase
			.from('campaigns')
			.insert([{
				campaign_name,
				client_name,
				description,
				audience,
				client_url,
				created_by,
				created_at,
				ad_groups,
				global_keywords,
				campaign_type,
				campaign_url,
				campaign_language,
				campaign_status
			}])
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

router.get('/by-client/:name', async (req, res) => {
	const { name } = req.params;
	try {
		const { data, error } = await supabase
			.from('campaigns')
			.select('*')
			.eq('client_name', name)
			.order('created_at', { ascending: false });

		if (error) throw error;

		res.json(data);
	} catch (err) {
		console.error("❌ Error al obtener campañas del cliente:", err.message);
		res.status(500).json({ error: 'Error al obtener campañas del cliente' });
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
		const { data, error } = await supabase
			.from('campaigns')
			.delete()
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;

		res.status(200).json({ message: 'Campaña eliminada correctamente', data });
	} catch (err) {
		console.error('❌ Error al eliminar campaña:', err);
		res.status(500).json({ error: 'Error al eliminar campaña' });
	}
});

export default router;

