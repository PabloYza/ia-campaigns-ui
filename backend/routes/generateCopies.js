import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const sanitizeCopy = (text, maxLength) => {
	const clean = text.replace(/[^a-zA-ZÀ-ÿ0-9 ,.¡!¿?"'()\-]/g, "").trim();
	return clean.length > maxLength ? clean.slice(0, maxLength) : clean;
};

router.post('/', async (req, res) => {
	const { adGroups } = req.body;

	if (!adGroups || !Array.isArray(adGroups)) {
		return res.status(400).json({ error: 'Missing or invalid adGroups array' });
	}

	try {
		const responses = [];

		for (const group of adGroups) {
			const { groupName, keywords, destinationUrl } = group;

			if (!groupName || !Array.isArray(keywords) || !keywords.length || !destinationUrl) {
				responses.push({ groupName, error: 'Missing required fields in ad group' });
				continue;
			}

			const prompt = `
Actúa como un experto en marketing digital especializado en Google Ads.

Tienes el siguiente grupo de anuncios:

🔹 Nombre del grupo: ${groupName}
🔹 URL de destino: ${destinationUrl}
🔹 Keywords: ${keywords.join(', ')}

Tu tarea es:
1. Generar 15 titulares de máximo 30 caracteres.
2. Generar 4 descripciones de máximo 90 caracteres.
3. Usar lenguaje persuasivo enfocado en conversión.
4. El contenido debe estar adaptado a las keywords y la URL de destino.

📌 Formato de respuesta:
Titulares:
- Titular 1
- Titular 2
...
Descripciones:
- Descripción 1
- Descripción 2
...
			`.trim();

			const completion = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "system", content: "Eres un experto en redacción de anuncios de alto rendimiento para Google Ads." },
					{ role: "user", content: prompt },
				],
				temperature: 0.7,
			});

			const content = completion.choices[0].message.content;
			const headlines = [];
			const descriptions = [];
			let section = null;

			content.split('\n').forEach(line => {
				const clean = line.replace(/^[-•\d.\s]+/, '').trim();

				if (/^Titulares[:]?$/i.test(line)) section = 'headlines';
				else if (/^Descripciones[:]?$/i.test(line)) section = 'descriptions';
				else if (section === 'headlines' && clean) headlines.push(sanitizeCopy(clean, 30));
				else if (section === 'descriptions' && clean) descriptions.push(sanitizeCopy(clean, 90));
			});

			responses.push({
				groupName,
				headlines,
				descriptions
			});
		}

		res.status(200).json({ results: responses });

	} catch (err) {
		console.error("❌ Error al generar copies:", err);
		res.status(500).json({ error: 'Error generando copies con OpenAI' });
	}
});

export default router;
