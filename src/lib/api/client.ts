const BASE_URL = 'http://localhost:8000';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, options);
		if (!response.ok) {
			throw new Error(`API Error: ${response.status} ${response.statusText}`);
		}
		return await response.json();
	} catch (error) {
		console.error('API Request Failed:', error);
		throw error;
	}
}
