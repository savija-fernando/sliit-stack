import 'react-native-url-polyfill/auto';
//import 'expo-sqlite/localStorage/install';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;


if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY in frontend/.env.',
  );
}

// React Native uses AsyncStorage; guard storage access during Expo Router SSR.
const isRuntime = typeof window !== 'undefined';

const ssrSafeStorage = {
  getItem: (key: string): Promise<string | null> =>
    isRuntime ? AsyncStorage.getItem(key) : Promise.resolve(null),

  setItem: (key: string, value: string): Promise<void> =>
    isRuntime ? AsyncStorage.setItem(key, value) : Promise.resolve(),

  removeItem: (key: string): Promise<void> =>
    isRuntime ? AsyncStorage.removeItem(key) : Promise.resolve(),
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: ssrSafeStorage,
    autoRefreshToken: isRuntime,
    persistSession: isRuntime,
    detectSessionInUrl: false,
  },
});