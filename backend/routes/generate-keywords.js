import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// POST /generate-keywords
router.post('/', async (req, res) => {
	const {
		clientName,
		clientUrl,
		campaignName,
		description,
		audience,
		adGroups,
	} = req.body;

	if (!clientName || !clientUrl || !campaignName || !description) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	// Construimos el prompt
	const prompt = `
Queremos generar ideas iniciales de keywords para una campaña de anuncios. Aquí está la información proporcionada por el usuario:

🔹 **Nombre del cliente**: ${clientName}
🔹 **URL del cliente**: ${clientUrl}
🔹 **Nombre de la campaña**: ${campaignName}
🔹 **Descripción de la campaña**: ${description}
🔹 **Audiencia objetivo**: ${audience || 'No especificada'}
🔹 **Grupos de anuncios definidos**:
${adGroups.map((group, i) => `  ${i + 1}. ${group.groupName} → ${group.destinationUrl}`).join('\n')}

🎯 Tu tarea es generar un listado inicial de keywords relacionadas con el negocio, sus objetivos y los grupos mencionados. NO agrupes las palabras por grupos todavía. Simplemente genera una lista variada y amplia de keywords relevantes como punto de partida. Responde solo con la lista, sin explicaciones ni encabezados.
`;

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{ role: "system", content: "Eres un asistente experto en campañas SEM y generación de keywords." },
				{ role: "user", content: prompt },
			],
			temperature: 0.7,
		});

		const keywordText = completion.choices[0].message.content;
		res.status(200).json({ keywords: keywordText });
	} catch (err) {
		console.error("❌ Error al generar keywords:", err);
		res.status(500).json({ error: 'Error generando keywords desde OpenAI' });
	}
});

export default router;
