const API_URL = "http://localhost:3001";

// CAMPANAS
export async function createCampaign(campaignData) {
	try {
		const response = await fetch(`${API_URL}/campaigns`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(campaignData),
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error al crear campaña");
		return result;
	} catch (err) {
		console.error("❌ Error en createCampaign:", err);
		throw err;
	}
}

export async function getCampaigns() {
	try {
		const response = await fetch(`${API_URL}/campaigns`);
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error al obtener campañas");
		return result;
	} catch (err) {
		console.error("❌ Error en getCampaigns:", err);
		throw err;
	}
}

export async function updateCampaign(id, updatedData) {
	try {
		const response = await fetch(`http://localhost:3001/campaigns/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedData),
		});

		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || "Error al actualizar la campaña");
		}

		return result;
	} catch (err) {
		console.error("❌ Error en updateCampaign:", err);
		throw err;
	}
}

// CLIENTES
export async function getClients() {
	try {
		const response = await fetch(`${API_URL}/clients`);
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error al obtener clientes");
		return result;
	} catch (err) {
		console.error("❌ Error en getClients:", err);
		throw err;
	}
}

export async function createClient(clientData) {
	try {
		const response = await fetch(`${API_URL}/clients`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(clientData),
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error al crear cliente");
		return result;
	} catch (err) {
		console.error("❌ Error en createClient:", err);
		throw err;
	}
}

export async function deleteClient(id) {
	try {
		const response = await fetch(`http://localhost:3001/clients/${id}`, {
			method: "DELETE",
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error al eliminar cliente");
		return result;
	} catch (err) {
		console.error("❌ Error en deleteClient:", err);
		throw err;
	}
}

// KEYWORDS

export async function generateKeywords(payload) {
	try {
		const response = await fetch('http://localhost:3001/generate-keywords', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error generando keywords");
		return result;
	} catch (err) {
		console.error("❌ Error en generateKeywords:", err);
		throw err;
	}
}