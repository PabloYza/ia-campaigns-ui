import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Obtiene el contenido visible y relevante de una URL HTML
 * @param {string} url - URL de la página de destino
 * @param {number} maxLength - Longitud máxima de texto extraído (por defecto 3000 caracteres)
 * @returns {Promise<string>} texto plano de la página
 */
export async function scrapePageContent(url, maxLength = 3000) {
	try {
		const res = await axios.get(url, { timeout: 8000 });
		const $ = cheerio.load(res.data);

		// Elimina elementos irrelevantes
		['script', 'style', 'noscript', 'nav', 'footer'].forEach(tag => $(tag).remove());

		// Extrae texto visible
		const rawText = $('body').text().replace(/\s+/g, ' ').trim();

		// Corta a longitud máxima
		return rawText.slice(0, maxLength);
	} catch (err) {
		console.error("❌ Error scraping URL:", err.message);
		return '';
	}
}
