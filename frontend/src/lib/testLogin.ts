import { supabase } from './supabase';
import { testBookService } from './testBooks';

export async function testStudentLogin(
  email: string,
  password: string
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    console.error('Login failed:', error.message);
    return false;
  }

  console.log('Student login successful!');
  console.log('Signed-in user ID:', data.user.id);
  console.log('Signed-in email:', data.user.email);

  await testBookService();

  return true;
}