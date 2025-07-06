import axios from 'axios';

const BASE_URL = 'https://api.semrush.com/';

export async function getOrganicKeywordData({ keyword, database = 'es' }) {
	const apiKey = process.env.SEMRUSH_API_KEY;
	const exportColumns = 'Ph,Nq,Cp,Co,Nr,Td';

	const url = `${BASE_URL}?type=phrase_all&key=${apiKey}&phrase=${encodeURIComponent(keyword)}&database=${database}&export_columns=${exportColumns}`;

	try {
		const response = await axios.get(url);
		const lines = response.data.split('\n');
		const headers = lines[0].replace(/\r/g, '').split(';');
		const rows = lines.slice(1).filter(Boolean);

		const data = rows.map(row => {
			const values = row.split(';');
			return headers.reduce((acc, header, i) => {
				acc[header] = values[i];
				return acc;
			}, {});
		});

		return data;
	} catch (err) {
		console.error("❌ Error al consultar SEMrush:", err.message);
		throw new Error("Error consultando Semrush API");
	}
}

export async function getPaidKeywordData({ keyword, database = 'es', limit = 10 }) {
	const apiKey = process.env.SEMRUSH_API_KEY;
	const exportColumns = 'Dn,Ur,Vu';

	const url = `${BASE_URL}?type=phrase_adwords&key=${apiKey}&phrase=${encodeURIComponent(keyword)}&database=${database}&export_columns=${exportColumns}&display_limit=${limit}&export_decode=1`;

	try {
		const response = await axios.get(url);
		const lines = response.data.split('\n').map(line => line.trim()).filter(Boolean);

		if (lines.length <= 1) {
			console.warn(`📭 SEMrush no devolvió resultados pagados para: "${keyword}"`);
			return [];
		}

		const headers = lines[0].replace(/\r/g, '').split(';');
		const rows = lines.slice(1);

		const data = rows.map(row => {
			const values = row.split(';');
			return headers.reduce((acc, header, i) => {
				acc[header] = values[i];
				return acc;
			}, {});
		});

		return data;
	} catch (err) {
		console.error("❌ Error al consultar SEMrush Paid:", err.message);
		throw new Error("Error consultando resultados pagados en Semrush API");
	}
}

export async function getRelatedKeywords({ keyword, database = 'es', limit = 100 }) {
	const apiKey = process.env.SEMRUSH_API_KEY;

	const exportColumns = 'Ph,Nq';
	const url = `https://api.semrush.com/?type=phrase_related&key=${apiKey}&phrase=${encodeURIComponent(keyword)}&database=${database}&export_columns=${exportColumns}&display_limit=${limit}`;

	try {
		const response = await axios.get(url);

		const lines = response.data.split('\n').map(line => line.trim()).filter(Boolean);

		if (lines.length <= 1) {
			console.warn(`📭 SEMrush no devolvió resultados para la keyword: "${keyword}"`);
			return [];
		}

		const headers = lines[0].replace(/\r/g, '').split(';');
		const rows = lines.slice(1);

		const data = rows.map(row => {
			const values = row.split(';');
			return headers.reduce((acc, header, i) => {
				acc[header] = values[i];
				return acc;
			}, {});
		});

		return data;
	} catch (err) {
		console.error("❌ Error al consultar SEMrush:", err.message);
		throw new Error("Error consultando Semrush API");
	}
}