import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { scrapePageContent } from '../utils/scrapePageContent.js';

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
		campaignUrl,
		campaignLanguage
	} = req.body;

	if (!clientName || !clientUrl || !campaignName || !description) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	const campaignUrlContent = await scrapePageContent(campaignUrl);

	// Prompt
	const prompt = `
Actúa como un especialista senior en Marketing Digital y estratega SEM, con amplia experiencia en campañas de búsqueda para el mercado español.

Vas a generar ideas de palabras clave para una campaña de Google Ads, basándote en la información que se proporciona a continuación.

🧩 Información de campaña:
- Cliente: ${clientName}
- URL del cliente: ${clientUrl}
- Nombre de campaña: ${campaignName}
- Descripción: ${description}
- Audiencia objetivo: ${audience || 'No especificada'}
- Idioma de la campaña: ${campaignLanguage}

🔍 Contenido real de la página de destino de campaña (extraído automáticamente):
${campaignUrlContent}

🧠 Instrucciones clave:
1. Basa la generación de keywords principalmente en el contenido visible de la página de destino (sección anterior).
2. Utiliza también la descripción de campaña para enriquecer las ideas si hay ambigüedad.
3. Evita repeticiones o keywords demasiado similares entre sí. Cada línea debe aportar una intención de búsqueda distinta.
4. Si hay nombres de productos, marcas o beneficios concretos, priorízalos en las keywords.
5. Ignora categorías genéricas o irrelevantes que no estén mencionadas en el contenido de campaña.

🎯 Tu tarea:
Generar una lista de entre 20 y 30 keywords únicas, variadas y de alto potencial para esta campaña.

📌 Reglas estrictas:
- Idioma: ${campaignLanguage}, excepto si un término en inglés es comúnmente usado en el sector (como “email marketing”, “CRM”, “Adock Fulfillment”).
- Intención de búsqueda: mezcla de keywords:
  • Transaccionales (ej: “comprar zapatillas rojas”)
  • Informativas (ej: “cómo funciona el servicio fulfillment”)
  • Long-tail (ej: “software de logística para ecommerce en españa”)
- Formato: solo la lista.
  • Una keyword por línea.
  • No añadas números, guiones, comas ni encabezados.
`;

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o",
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

router.post('/more', async (req, res) => {
	const {
		clientName,
		clientUrl,
		campaignName,
		description,
		audience,
		globalKeywords = [],
		contextNote,
		campaignLanguage
	} = req.body;

	if (!clientName || !clientUrl || !campaignName || !description) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	const prompt = `
Actúa como un especialista senior en Marketing Digital y estratega SEM, con amplia experiencia en el mercado de España.

Queremos seguir expandiendo nuestra lista de keywords para esta campaña basada en la siguiente información:

🔹 Cliente: ${clientName}
🔹 URL: ${clientUrl}
🔹 Campaña: ${campaignName}
🔹 Descripción: ${description}
🔹 Contexto: ${contextNote}
🔹 Audiencia objetivo: ${audience || 'No especificada'}
- Idioma de la campaña: ${campaignLanguage}
🔹 Ya tenemos las siguientes keywords (no las repitas):
${globalKeywords.join(', ')}

🎯 Tu tarea:
Sugiere 10 nuevas keywords relevantes, usa el contexto dado por el usuario para guiarte en la creacion, únicas y de alto potencial que aún **no estén en la lista existente**. Usando estas reglas 
IDIOMA PRINCIPAL: Las keywords deben estar en ${campaignLanguage}, excepto si la palabra o frase principal es un término comúnmente utilizado en inglés (por ejemplo: “Adock Fulfillment”, “email marketing” o “Google Ads”).
RELEVANCIA: Las keywords deben estar directamente relacionadas con los productos o servicios que se intuyen de la URL y la descripción.
INTENCIÓN DE BÚSQUEDA: Incluye una mezcla saludable de:
Keywords transaccionales: (ej: "comprar zapatillas rojas", "precio de software de contabilidad").
Keywords informativas: (ej: "cómo limpiar zapatillas de cuero", "mejores programas de contabilidad").
Keywords de cola larga (long-tail): Frases más específicas de 3 o más palabras (ej: "agencia de marketing digital para pymes en madrid").

FORMATO DE SALIDA:
Responde ÚNICAMENTE con la lista de keywords.
Una keyword por línea.
No incluyas guiones, comas, números, categorías ni ningún texto introductorio o de cierre.
`;

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{ role: "system", content: "Eres un asistente experto en campañas SEM y generación de keywords." },
				{ role: "user", content: prompt },
			],
			temperature: 0.7,
		});

		const keywordText = completion.choices[0].message.content;

		const keywordList = keywordText
			.split('\n')
			.map(line => line.replace(/^[-\d.\s]+/, '').trim())
			.filter(Boolean);

		res.status(200).json({ keywords: keywordList });
	} catch (err) {
		console.error("❌ Error en /generateKeywords/more:", err);
		res.status(500).json({ error: 'Error generando más keywords desde OpenAI' });
	}
});

export default router;
