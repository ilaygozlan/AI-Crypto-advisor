import { useEffect, useState, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getMe, getMyData, refreshAccessToken } from '@/lib/api';

type User = { 
  id: string; 
  email: string; 
  firstName?: string; 
  lastName?: string;
  preferences?: {
    investorType: string;
    selectedAssets: string[];
    selectedContentTypes: string[];
    completedAt: string;
  }
};

export function useAuthController() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      // try existing token or refresh
      const me = await getMe();
      const userData = me.user as User;
      
      // Fetch user preferences
      try {
        const userDataResponse = await getMyData();
        if (userDataResponse.data && userDataResponse.data.length > 0) {
          const latestData = userDataResponse.data[0]; // Get the most recent preferences
          userData.preferences = {
            investorType: latestData.investorType,
            selectedAssets: latestData.selectedAssets,
            selectedContentTypes: latestData.selectedContentTypes,
            completedAt: latestData.completedAt
          };
        }
      } catch (prefError) {
        console.log('No preferences found for user');
      }
      
      setUser(userData);
    } catch {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const me2 = await getMe();
        const userData = me2.user as User;
        
        // Fetch user preferences
        try {
          const userDataResponse = await getMyData();
          if (userDataResponse.data && userDataResponse.data.length > 0) {
            const latestData = userDataResponse.data[0];
            userData.preferences = {
              investorType: latestData.investorType,
              selectedAssets: latestData.selectedAssets,
              selectedContentTypes: latestData.selectedContentTypes,
              completedAt: latestData.completedAt
            };
          }
        } catch (prefError) {
          console.log('No preferences found for user');
        }
        
        setUser(userData);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void bootstrap(); }, [bootstrap]);

  const doLogin = useCallback(async (email: string, password: string) => {
    const { user } = await apiLogin({ email, password });
    const userData = user as User;
    
    // Fetch user preferences
    try {
      const userDataResponse = await getMyData();
      if (userDataResponse.data && userDataResponse.data.length > 0) {
        const latestData = userDataResponse.data[0];
        userData.preferences = {
          investorType: latestData.investorType,
          selectedAssets: latestData.selectedAssets,
          selectedContentTypes: latestData.selectedContentTypes,
          completedAt: latestData.completedAt
        };
      }
    } catch (prefError) {
      console.log('No preferences found for user');
    }
    
    setUser(userData);
    return userData;
  }, []);

  const doSignup = useCallback(async (payload: {
    email: string; password: string; firstName?: string; lastName?: string;
    data: { investorType: string; selectedAssets: string[]; selectedContentTypes: string[]; completedAt: string; }
  }) => {
    const { user } = await apiSignup(payload);
    const userData = user as User;
    
    // Add preferences from signup data
    userData.preferences = {
      investorType: payload.data.investorType,
      selectedAssets: payload.data.selectedAssets,
      selectedContentTypes: payload.data.selectedContentTypes,
      completedAt: payload.data.completedAt
    };
    
    setUser(userData);
    return userData;
  }, []);

  const doLogout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  return { user, loading, doLogin, doSignup, doLogout };
}
