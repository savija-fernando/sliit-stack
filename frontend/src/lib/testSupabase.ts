
import { supabase } from './supabase';

export async function testSupabaseConnection() {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.error('Session error:', sessionError.message);
    return;
  }

  console.log(
    'User signed in:',
    Boolean(sessionData.session?.user)
  );

  console.log(
    'User ID:',
    sessionData.session?.user?.id ?? 'No signed-in user'
  );

  const { data, error } = await supabase
    .from('books')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Supabase connection error:', error);
    return;
  }

  console.log('Supabase connection successful!');
  console.log('Books query result:', data);
}
