import HomeScreen from '@/features/dashboard/screens/HomeScreen';
import { testSupabaseConnection } from '@/lib/testSupabase';
import { useEffect } from 'react';
import { testStudentLogin } from '@/lib/testLogin';

export default function HomeRoute() {
useEffect(() => {
  testStudentLogin(
    'savijanethika@gmail.com',
    'Savija28'
  );
}, []);
  return <HomeScreen />;
}