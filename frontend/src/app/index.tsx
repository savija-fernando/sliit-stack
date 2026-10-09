import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import HomeScreen from '@/features/dashboard/screens/HomeScreen';
import { supabase } from '@/lib/supabase';

export default function HomeRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Failed to load user profile:', error);
          return;
        }

        setIsStaff(profile.role === 'staff');
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (isStaff) {
    return <Redirect href="/staff-dashboard" />;
  }

  return <HomeScreen />;
}