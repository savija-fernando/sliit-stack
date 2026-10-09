import { supabase } from '@/lib/supabase';

export type UserRole = 'student' | 'staff';

export type AuthUser = {
  id: string;
  email: string | undefined;
  fullName: string | null;
  role: UserRole;
};

export async function login(
  email: string,
  password: string,
  selectedRole: UserRole
): Promise<AuthUser> {
  const cleanEmail = email.trim();

  if (!cleanEmail || !password) {
    throw new Error('Please enter your email and password.');
  }

  // 1. Authenticate with Supabase
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error('Login failed. User was not found.');
  }

  // 2. Get the user's profile and actual role
  const { data: profile, error: profileError } =
    await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', authData.user.id)
      .single();

  if (profileError) {
    await supabase.auth.signOut();

    throw new Error(
      `Unable to load your profile: ${profileError.message}`
    );
  }

  // 3. Validate the role selected on the login screen
  if (profile.role !== selectedRole) {
    await supabase.auth.signOut();

    throw new Error(
      `This account is registered as ${profile.role}, not ${selectedRole}.`
    );
  }

  return {
    id: authData.user.id,
    email: authData.user.email,
    fullName: profile.full_name,
    role: profile.role as UserRole,
  };
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
}



export async function signUp(
  fullName: string,
  universityId: string,
  email: string,
  password: string
): Promise<void> {
  const cleanName = fullName.trim();
  const cleanId = universityId.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName || !cleanId || !cleanEmail || !password) {
    throw new Error('Please fill in all required fields.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        full_name: cleanName,
        university_id: cleanId,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Unable to create your account. Please try again.');
  }
}
