import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { type Database } from '&/types/supabase';

export const supabase: SupabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'public',
  },
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
