import { supabase } from './supabase';
import { testBookCrud } from './testBookCrud';

export async function testStaffLogin(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    console.error('Staff login failed:', error.message);
    return;
  }

  console.log('Staff login successful!');
  console.log('Staff user ID:', data.user.id);

  const { data: profile, error: profileError } =
    await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

  if (profileError) {
    console.error(
      'Failed to get staff profile:',
      profileError.message
    );
    return;
  }

  console.log('User role:', profile.role);

  if (profile.role !== 'staff') {
    console.error(
      'This account is not a staff account.'
    );
    return;
  }

  await testBookCrud();
}