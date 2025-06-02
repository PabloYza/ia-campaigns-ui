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
Actúa como un copywriter publicitario experto en Google Ads, altamente especializado en la creación de anuncios de máxima conversión para el mercado español.
Tu misión es redactar anuncios impactantes para el siguiente grupo de anuncios, utilizando la información proporcionada:
🔹 Nombre del grupo: ${groupName}
🔹 URL de destino: ${destinationUrl}
🔹 Keywords Principales del Grupo: ${keywords.join(', ')}
🎯 REGLAS DE REDACCIÓN MUY ESTRICTAS (ESPECIAL ATENCIÓN A LOS LÍMITES DE CARACTERES):
1.  IDIOMA: Todo el contenido (titulares y descripciones) debe estar en perfecto ESPAÑOL, adaptado culturalmente al mercado de España.
2.  TITULARES (REQUISITO CRÍTICO DE LONGITUD):
    * Genera exactamente 15 titulares únicos.
    * LÍMITE MÁXIMO ABSOLUTO: Cada titular, individualmente, debe tener 30 CARACTERES COMO MÁXIMO (incluyendo espacios). Es fundamental que no excedas este límite.
    * COMPLETOS Y CON SENTIDO: Los titulares deben ser frases completas, gramaticalmente correctas y tener pleno sentido por sí mismos dentro de este límite de 30 caracteres. No generes titulares que necesiten ser cortados para cumplir el límite; créalos concisos desde el inicio.
    * CALIDAD Y CONCISIÓN: Prioriza la brevedad, el impacto y la claridad. Evita palabras de relleno.
    * CONTENIDO: Deben ser atractivos, incluir llamadas a la acción claras (ej: "Compra Ahora", "Infórmate Hoy", "Regístrate Gratis") o beneficios clave directos. Intenta incorporar de forma natural alguna de las keywords principales si encaja perfectamente sin comprometer la calidad ni el límite de caracteres.
3.  DESCRIPCIONES:
    * Genera exactamente 4 descripciones únicas.
    * LÍMITE MÁXIMO ABSOLUTO: Cada descripción debe tener 90 CARACTERES COMO MÁXIMO (incluyendo espacios).
    * COMPLETAS Y CON SENTIDO: Deben complementar a los titulares, expandiendo la información, detallando beneficios y persuadiendo al usuario para que haga clic.
4.  FORMATO DE RESPUESTA (ESTRICTO):
    Estructura tu respuesta EXACTAMENTE así, sin ningún texto introductorio, comentarios o adornos:
Titulares:
- Titular A
- Titular B
... (hasta 15)
Descripciones:
- Descripción 1
- Descripción 2
- Descripción 3
- Descripción 4
			`.trim();

			const completion = await openai.chat.completions.create({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "system", content: "Eres un experto en redacción de anuncios de alto rendimiento para Google Ads, especializado en el mercado español." },
					{ role: "user", content: prompt },
				],
				temperature: 0.75, // Un poco más de creatividad
			});

			const content = completion.choices[0].message.content;
			const headlines = [];
			const descriptions = [];
			let section = null;

			content.split('\n').forEach(line => {
				const clean = line.replace(/^[-•\d.\s]+/, '').trim();
				if (/^Titulares[:]?$/i.test(line)) section = 'headlines';
				else if (/^Descripciones[:]?$/i.test(line)) section = 'descriptions';
				else if (section === 'headlines' && clean && headlines.length < 15) headlines.push(sanitizeCopy(clean, 30));
				else if (section === 'descriptions' && clean && descriptions.length < 4) descriptions.push(sanitizeCopy(clean, 90));
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
	const { groupName, destinationUrl, keywords } = groupContext;
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
* Keywords Relevantes: "${keywords.join(', ')}"
${contextToAvoid}

**${itemTypeSpanish.toUpperCase()} ACTUAL A REEMPLAZAR:**
"${currentText}"

**REGLAS DE ORO INQUEBRANTABLES para la NUEVA versión:**
1.  **IDIOMA:** Exclusivamente en **perfecto ESPAÑOL**.
2.  **LÍMITE DE CARACTERES ESTRICTO:** El nuevo ${itemTypeSpanish} debe tener **${maxLength} caracteres COMO MÁXIMO** (contando espacios). Este límite no es una sugerencia, es una restricción absoluta.
3.  **TEXTO COMPLETO Y NATURALMENTE CORTO:** El texto debe ser una frase completa, coherente y con pleno sentido por sí misma **DENTRO DEL LÍMITE ESTABLECIDO**. No generes un texto más largo que luego deba ser truncado; debe nacer ya perfecto para el espacio disponible. Cada carácter cuenta.
4.  **SUPERIOR Y DIFERENTE:** La nueva versión debe ser claramente distinta, más atractiva, persuasiva y, si es posible, más original que el texto actual. Aporta una nueva perspectiva o un beneficio más potente.
5.  **FORMATO DE RESPUESTA EXCLUSIVO:** Tu respuesta debe ser **ÚNICAMENTE el nuevo texto** del ${itemTypeSpanish}. Sin comillas, sin introducciones, sin explicaciones, sin etiquetas como "Nuevo titular:", solo el texto puro y listo para usar.
	`.trim();

	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
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
		existingDescriptions
	} = req.body;

	if (!groupName || !destinationUrl || !keywords || (!headlinesToRegenerate && !descriptionsToRegenerate)) {
		return res.status(400).json({ error: 'Faltan datos necesarios para la regeneración selectiva.' });
	}

	const groupContext = { groupName, destinationUrl, keywords };
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