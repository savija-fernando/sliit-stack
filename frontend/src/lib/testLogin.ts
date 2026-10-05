
import { supabase } from './supabase';

export async function testStudentLogin(
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login failed:', error.message);
    return;
  }

  console.log('Student login successful!');
  console.log('Signed-in user ID:', data.user.id);

  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('id, title')
    .limit(5);

  if (booksError) {
    console.error('Books query failed:', booksError);
    return;
  }

  console.log('Books query successful:', books);
}
