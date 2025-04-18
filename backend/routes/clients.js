import express from 'express';
import supabase from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const { data, error } = await supabase
			.from('clients')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) throw error;
		res.json(data);
	} catch (err) {
		console.error('❌ Error al obtener clientes:', err);
		res.status(500).json({ error: 'Error al obtener clientes' });
	}
});

router.post('/', async (req, res) => {
	const { name, url, created_by } = req.body;

	if (!name || !url || !created_by) {
		return res.status(400).json({ error: 'Faltan campos obligatorios' });
	}

	try {
		const { data, error } = await supabase
			.from('clients')
			.insert([{ name, url, created_by }])
			.select()
			.single();

		if (error) throw error;
		res.status(201).json(data);
	} catch (err) {
		console.error('❌ Error al crear cliente:', err);
		res.status(500).json({ error: 'Error al crear cliente' });
	}
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const { data, error } = await supabase
			.from('clients')
			.delete()
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;

		res.status(200).json({ message: 'Cliente eliminado permanentemente', data });
	} catch (err) {
		console.error('❌ Error al eliminar cliente:', err);
		res.status(500).json({ error: 'Error al eliminar cliente' });
	}
});

export default router;
