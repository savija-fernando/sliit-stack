import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY in frontend/.env.',
  );
}

// In React Native, `window` === `global` and is always defined.
// In Expo Router's Node SSR renderer, `window` is NOT defined.
// We guard every AsyncStorage call so the SSR pass doesn't crash.
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