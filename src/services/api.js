const API_URL = import.meta.env.VITE_API_URL;

// CAMPAÑAS

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

export async function getClientCampaigns(clientName) {
	try {
		const response = await fetch(`${API_URL}/campaigns/by-client/${encodeURIComponent(clientName)}`);
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error al obtener campañas del cliente");
		return result;
	} catch (err) {
		console.error("❌ Error en getClientCampaigns:", err);
		throw err;
	}
}

export async function updateCampaign(id, updatedData) {
	try {
		const response = await fetch(`${API_URL}/campaigns/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updatedData),
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error al actualizar la campaña");
		return result;
	} catch (err) {
		console.error("❌ Error en updateCampaign:", err);
		throw err;
	}
}

export async function saveCampaignToDB(campaignData) {
	try {
		const response = await fetch(`${API_URL}/campaigns`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(campaignData),
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error al guardar campaña en DB");
		return result;
	} catch (err) {
		console.error("❌ Error en saveCampaignToDB:", err);
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
		const response = await fetch(`${API_URL}/clients/${id}`, {
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
		const response = await fetch(`${API_URL}/generateKeywords`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
			const text = await response.text();
			throw new Error(`API Error: ${text}`);
		}
		return await response.json();
	} catch (err) {
		console.error("❌ Error en generateKeywords:", err);
		throw err;
	}
}

// COPIES

export async function generateCopies(payload) {
	try {
		const response = await fetch(`${API_URL}/generateCopies`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const result = await response.json();
		if (!response.ok) throw new Error(result.error || "Error generando copies");
		return result;
	} catch (err) {
		console.error("❌ Error en generateCopies:", err);
		throw err;
	}
}

export async function regenerateSelectedCopiesAPI(payload) {
	try {
		const response = await fetch(`${API_URL}/generateCopies/regenerate-selected`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		const result = await response.json();
		if (!response.ok) {
			const errorMessage = result.error || "Error en la regeneración selectiva de copies";
			throw new Error(errorMessage);
		}
		return result;
	} catch (err) {
		console.error("❌ Error en regenerateSelectedCopiesAPI:", err.message);
		throw err;
	}
}