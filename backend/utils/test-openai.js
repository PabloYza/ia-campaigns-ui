import dotenv from 'dotenv';
import { OpenAI } from 'openai';
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

async function testConnection() {
	try {
		const chatCompletion = await openai.chat.completions.create({
			model: "gpt-4o",
			messages: [{ role: "user", content: "Hola, ¿estás funcionando?" }],
		});
		console.log("✅ Respuesta:", chatCompletion.choices[0].message.content);
	} catch (error) {
		console.error("❌ Error al conectar con OpenAI:", error);
	}
}

testConnection();