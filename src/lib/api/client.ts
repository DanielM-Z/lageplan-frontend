// VITE_API_BASE_URL has to be set to find the api path.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = '/v1';
export async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
	console.log(BASE_URL);
	return fetch(`${BASE_URL}${API_VERSION}${endpoint}`, options);
}
