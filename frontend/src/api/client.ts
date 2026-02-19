import type { ApiError } from '../types';

const BASE_URL = 'http://localhost:5000';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
            error: 'UNKNOWN_ERROR',
            message: 'An unexpected error occurred',
        }));
        throw errorData;
    }
    if (response.status === 204) return {} as T;
    return response.json();
}

export const api = {
    async get<T>(path: string): Promise<T> {
        const response = await fetch(`${BASE_URL}${path}`);
        return handleResponse<T>(response);
    },

    async post<T>(path: string, body?: any): Promise<T> {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        return handleResponse<T>(response);
    },
};
