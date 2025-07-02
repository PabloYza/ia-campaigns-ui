import { scrapePageContent } from './utils/scrapePageContent.js';

const test = async () => {
	const url = 'https://www.rittal.com/es-es/products/PG20231215SCH101';
	const content = await scrapePageContent(url);
	console.log('Contenido extraído:\n');
	console.log(content);
};

test();
