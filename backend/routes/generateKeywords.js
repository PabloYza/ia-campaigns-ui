import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// POST /generateKeywords
router.post('/', async (req, res) => {
	const {
		clientName,
		clientUrl,
		campaignName,
		description,
		audience,
	} = req.body;

	if (!clientName || !clientUrl || !campaignName || !description) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	// Prompt
	const prompt = `
Actúa como un especialista senior en Marketing Digital y estratega SEM, con amplia experiencia en el mercado de España.

Analiza la siguiente información de campaña:

🔹 **Cliente**: ${clientName}
🔹 **URL**: ${clientUrl}
🔹 **Campaña**: ${campaignName}
🔹 **Descripción**: ${description}
🔹 **Audiencia Objetivo**: ${audience || 'No especificada'}

🎯 **Tu Tarea Principal**:
Generar una lista de entre 20 y 30 keywords de alto potencial para esta campaña, siguiendo estas reglas estrictas:

1.  **IDIOMA OBLIGATORIO**: Todas las keywords deben estar **en perfecto español**. Ignora cualquier término en inglés que pueda aparecer en los datos de entrada.
2.  **RELEVANCIA**: Las keywords deben estar directamente relacionadas con los productos o servicios que se intuyen de la URL y la descripción.
3.  **INTENCIÓN DE BÚSQUEDA**: Incluye una mezcla saludable de:
    * **Keywords transaccionales**: (ej: "comprar zapatillas rojas", "precio de software de contabilidad").
    * **Keywords informativas**: (ej: "cómo limpiar zapatillas de cuero", "mejores programas de contabilidad").
    * **Keywords de cola larga (long-tail)**: Frases más específicas de 3 o más palabras (ej: "agencia de marketing digital para pymes en madrid").
4.  **FORMATO DE SALIDA**:
    * Responde ÚNICAMENTE con la lista de keywords.
    * Una keyword por línea.
    * No incluyas guiones, comas, números, categorías ni ningún texto introductorio o de cierre.
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

		const keywordList = keywordText
			.split('\n')
			.map(line => line.replace(/^[-\d.\s]+/, '').trim()) // elimina "-", "1." etc
			.filter(Boolean);

		res.status(200).json({ keywords: keywordList });

	} catch (err) {
		console.error("❌ Error al generar keywords:", err);
		res.status(500).json({ error: 'Error generando keywords desde OpenAI' });
	}
});

export default router;
