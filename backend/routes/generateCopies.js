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
	if (clean.length > maxLength) {
		let cutText = clean.slice(0, maxLength);
		const lastSpace = cutText.lastIndexOf(' ');
		if (maxLength - lastSpace < 10 && lastSpace > -1) {
			cutText = cutText.slice(0, lastSpace);
		}
		return cutText;
	}
	return clean;
};

router.post('/', async (req, res) => {
	const { adGroups, campaignLanguage } = req.body;

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
				Actúa como un copywriter publicitario experto en Google Ads, especializado en crear anuncios de alta conversión para el mercado español.

				Tu tarea es redactar los anuncios para el siguiente grupo, basándote en sus keywords y URL de destino.

				🔹 Nombre del grupo: ${groupName}  
				🔹 URL de destino: ${destinationUrl}  
				🔹 Keywords del grupo: ${keywords.join(', ')}
				🔹 Idioma de la campaña: ${campaignLanguage}

				🎯 Reglas de Redacción:

				IDIOMA: Todos los titulares y descripciones deben estar en ${campaignLanguage}, pero puedes mantener palabras o frases clave en inglés si son propias del sector (ej: “Adock Fulfillment”, “email marketing”, “CRM”, etc.).

				TITULARES: Genera exactamente 15 titulares únicos.  
				Cada titular debe tener **como máximo 30 caracteres**, **usar solo letras y espacios (sin signos de puntuación o símbolos especiales)**, y **ser una frase completa con sentido por sí sola**.  
				No generes frases largas cortadas. El texto debe nacer ya adaptado al espacio disponible, respetando el límite como una regla estricta.  
				Deben ser atractivos, claros y contener llamadas a la acción o beneficios clave.  
				Utiliza algunas de las keywords cuando sea natural hacerlo.

				DESCRIPCIONES: Genera exactamente 4 descripciones únicas.  
				Cada descripción debe tener **90 caracteres como máximo**.  
				No uses signos de puntuación al final de las descripciones.
				Evita cortar frases. Cada descripción debe ser una oración completa, coherente y persuasiva.  
				Aprovecha el límite al máximo: intenta acercarte a los 90 caracteres, sin pasarte.  
				Deben complementar a los titulares aportando más contexto o razones para hacer clic.

				FORMATO DE RESPUESTA:  
				Estructura tu respuesta EXACTAMENTE así, sin ningún texto adicional:

				TITULARES:  
				[15 titulares en líneas separadas]

				DESCRIPCIONES:  
				[4 descripciones en líneas separadas]
			`.trim();

			const completion = await openai.chat.completions.create({
				model: "gpt-4o",
				messages: [
					{ role: "system", content: "Eres un experto en redacción de anuncios de alto rendimiento para Google Ads, especializado en el mercado español." },
					{ role: "user", content: prompt },
				],
				temperature: 0.75,
			});

			const content = completion.choices[0].message.content;
			const headlines = [];
			const descriptions = [];
			let section = null;
			console.log(content)

			content.split('\n').forEach(line => {
				const clean = line.replace(/^[-•\d.\s]+/, '').trim();

				if (/^TITULARES[:]?$/i.test(clean)) {
					section = 'headlines';
					return;
				} else if (/^DESCRIPCIONES[:]?$/i.test(clean)) {
					section = 'descriptions';
					return;
				}

				if (section === 'headlines' && clean && headlines.length < 15) {
					headlines.push(sanitizeCopy(clean, 30));
				} else if (section === 'descriptions' && clean && descriptions.length < 4) {
					descriptions.push(sanitizeCopy(clean, 90));
				}
			});
			responses.push({ groupName, headlines, descriptions });
		}
		res.status(200).json({ results: responses });
	} catch (err) {
		console.error("❌ Error al generar todos los copies:", err.response ? err.response.data : err.message);
		res.status(500).json({ error: 'Error generando todos los copies con OpenAI' });
	}
});


async function regenerateSingleCopyItem(groupContext, itemToRegenerate, existingCopies) {
	const { groupName, destinationUrl, keywords, campaignLanguage } = groupContext;
	const { type, currentText } = itemToRegenerate;

	const itemTypeSpanish = type === 'headline' ? 'titular' : 'descripción';
	const maxLength = type === 'headline' ? 30 : 90;

	const existingToAvoid = type === 'headline'
		? (existingCopies.headlines || []).join('; ')
		: (existingCopies.descriptions || []).join('; ');

	const contextToAvoid = existingToAvoid ? `\nIMPORTANTE: El nuevo texto NO DEBE PARECERSE a estos textos existentes: "${existingToAvoid}"` : '';

	const prompt = `
Actúa como un copywriter de élite para Google Ads, obsesionado con la brevedad, el impacto y el cumplimiento estricto de los límites de caracteres para el mercado español.

Tu misión es transformar y mejorar radicalmente el siguiente ${itemTypeSpanish} de un anuncio, creando una alternativa SUPERIOR.

**Contexto Clave del Grupo de Anuncios:**
* Nombre del grupo: "${groupName}"
* URL de destino: "${destinationUrl}"
* Idioma de la campaña: "${campaignLanguage}"
* Keywords Relevantes: "${keywords.join(', ')}"
${contextToAvoid}

**${itemTypeSpanish.toUpperCase()} ACTUAL A REEMPLAZAR:**
"${currentText}"

**REGLAS DE ORO INQUEBRANTABLES para la NUEVA versión:**
1.  **IDIOMA:** Exclusivamente en ${campaignLanguage}.
2.  **LÍMITE DE CARACTERES ESTRICTO:** El nuevo ${itemTypeSpanish} debe tener **${maxLength} caracteres COMO MÁXIMO** (contando espacios). Este límite no es una sugerencia, es una restricción absoluta.
3.  **TEXTO COMPLETO Y NATURALMENTE CORTO:** El texto debe ser una frase completa, coherente y con pleno sentido por sí misma **DENTRO DEL LÍMITE ESTABLECIDO**. No generes un texto más largo que luego deba ser truncado; debe nacer ya perfecto para el espacio disponible. Cada carácter cuenta.
4.  **SUPERIOR Y DIFERENTE:** La nueva versión debe ser claramente distinta, más atractiva, persuasiva y, si es posible, más original que el texto actual. Aporta una nueva perspectiva o un beneficio más potente.
5.  **FORMATO DE RESPUESTA EXCLUSIVO:** Tu respuesta debe ser **ÚNICAMENTE el nuevo texto** del ${itemTypeSpanish}. Sin comillas, sin introducciones, sin explicaciones, sin etiquetas como "Nuevo titular:", solo el texto puro y listo para usar.
	`.trim();

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [
				{ role: "system", content: "Eres un copywriter experto en Google Ads enfocado en mejorar textos específicos." },
				{ role: "user", content: prompt },
			],
			temperature: 0.8,
			max_tokens: type === 'headline' ? 20 : 50,
		});
		let newText = completion.choices[0].message.content.trim();
		return sanitizeCopy(newText, maxLength);
	} catch (error) {
		console.error(`Error regenerando ${type} para "${groupName}":`, error.response ? error.response.data : error.message);
		return currentText;
	}
}

router.post('/regenerate-selected', async (req, res) => {
	const {
		groupName,
		destinationUrl,
		keywords,
		headlinesToRegenerate,
		descriptionsToRegenerate,
		existingHeadlines,
		existingDescriptions,
		campaignLanguage
	} = req.body;

	if (!groupName || !destinationUrl || !keywords || (!headlinesToRegenerate && !descriptionsToRegenerate)) {
		return res.status(400).json({ error: 'Faltan datos necesarios para la regeneración selectiva.' });
	}

	const groupContext = { groupName, destinationUrl, keywords, campaignLanguage };
	const existingCopies = { headlines: existingHeadlines, descriptions: existingDescriptions };
	const regeneratedItems = [];

	const regenerationPromises = [];

	if (headlinesToRegenerate && headlinesToRegenerate.length > 0) {
		headlinesToRegenerate.forEach(item => {
			regenerationPromises.push(
				regenerateSingleCopyItem(groupContext, { ...item, type: 'headline' }, existingCopies)
					.then(newText => ({ type: 'headline', index: item.index, newText }))
			);
		});
	}

	if (descriptionsToRegenerate && descriptionsToRegenerate.length > 0) {
		descriptionsToRegenerate.forEach(item => {
			regenerationPromises.push(
				regenerateSingleCopyItem(groupContext, { ...item, type: 'description' }, existingCopies)
					.then(newText => ({ type: 'description', index: item.index, newText }))
			);
		});
	}

	try {
		const results = await Promise.all(regenerationPromises);
		regeneratedItems.push(...results);

		res.status(200).json({
			groupName,
			regeneratedItems
		});
	} catch (err) {
		console.error("❌ Error en el proceso de regeneración selectiva:", err);
		res.status(500).json({ error: 'Error durante la regeneración selectiva de copies.' });
	}
});

export default router;