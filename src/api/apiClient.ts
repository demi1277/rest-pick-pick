export const API_BASE_URL = 'https://data.ex.co.kr/openapi/business/conveniServiceArea';

export interface ApiResponseParams {
    pageNo?: number;
    numOfRows?: number;
    type?: 'json' | 'xml';
    key?: string;
    serviceAreaName?: string;
}

export async function fetchRestStopData(page: number = 1, perPage: number = 20) {
    const apiKey = import.meta.env.VITE_DATA_API_KEY;

    // Note: If no key is present, we might want to return mock data or throw error.
    // For now, valid key is assumed or user will see auth error from API.

    const params = new URLSearchParams({
        pageNo: page.toString(),
        numOfRows: perPage.toString(),
        type: 'json',
        key: apiKey || '',
    });

    try {
        const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch rest stop data:', error);
        throw error;
    }
}
