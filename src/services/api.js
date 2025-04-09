const API_URL = "http://localhost:3001"; // Actualiza si lo despliegas

export async function createCampaign(campaignData) {
	try {
		const response = await fetch(`${API_URL}/campaigns`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(campaignData),
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || "Error al crear campaña");
		}

		return result;
	} catch (err) {
		console.error("❌ Error en createCampaign:", err);
		throw err;
	}
}

export async function getCampaigns() {
	try {
		const response = await fetch(`${API_URL}/campaigns`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || "Error al obtener campañas");
		}

		return result;
	} catch (err) {
		console.error("❌ Error en getCampaigns:", err);
		throw err;
	}
}