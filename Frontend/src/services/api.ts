// API Service Configuration
// This file manages all backend API communications

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API requests
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Failed: ${endpoint}`, error);
    throw error;
  }
}

// ============ DEBATE ENDPOINTS ============
export const debateAPI = {
  // Create a new debate
  createDebate: (debateData: any) =>
    apiRequest('/debates', {
      method: 'POST',
      body: JSON.stringify(debateData),
    }),

  // Get all debates
  getDebates: () =>
    apiRequest('/debates', {
      method: 'GET',
    }),

  // Get a specific debate
  getDebateById: (id: string) =>
    apiRequest(`/debates/${id}`, {
      method: 'GET',
    }),
};

// ============ ARGUMENTS ENDPOINTS ============
export const argumentAPI = {
  // Create an argument
  createArgument: (argumentData: any) =>
    apiRequest('/arguments', {
      method: 'POST',
      body: JSON.stringify(argumentData),
    }),

  // Get arguments for a debate
  getArgumentsByDebate: (debateId: string) =>
    apiRequest(`/arguments?debateId=${debateId}`, {
      method: 'GET',
    }),
};

// ============ FACT CHECK ENDPOINTS ============
export const factCheckAPI = {
  // Create a fact check
  createFactCheck: (factCheckData: any) =>
    apiRequest('/factcheck', {
      method: 'POST',
      body: JSON.stringify(factCheckData),
    }),

  // Get fact checks
  getFactChecks: (debateId?: string) =>
    apiRequest(`/factcheck${debateId ? `?debateId=${debateId}` : ''}`, {
      method: 'GET',
    }),
};

// ============ ANALYTICS ENDPOINTS ============
export const analyticsAPI = {
  // Get analytics for a debate
  getAnalytics: (debateId: string) =>
    apiRequest(`/analytics/${debateId}`, {
      method: 'GET',
    }),
};

// ============ BASIC ENDPOINTS ============
