import { createMockApiClient, mockApi } from './mock'

// Mock API client that mimics axios behavior
export const mockApiClient = {
  create: () => createMockApiClient(),
  
  // Direct access to mock data
  getMockData: () => mockApi,
  
  // Simulate axios interceptors
  interceptors: {
    request: {
      use: () => {}, // No-op for mock
    },
    response: {
      use: () => {}, // No-op for mock
    },
  },
}

// Environment-based API client selection
export const getApiClient = () => {
  const isMockMode = import.meta.env.VITE_USE_MOCK_API === 'true'
  
  if (isMockMode) {
    console.log('🎭 Using Mock API for development')
    return mockApiClient.create()
  }
  
  // Import real API client dynamically to avoid issues in mock mode
  return import('./client').then(module => module.apiClient)
}
