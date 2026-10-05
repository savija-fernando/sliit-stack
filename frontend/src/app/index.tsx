import HomeScreen from '@/features/dashboard/screens/HomeScreen';
import { testSupabaseConnection } from '@/lib/testSupabase';
import { useEffect } from 'react';
import { testStudentLogin } from '@/lib/testLogin';
import { testStaffLogin } from '@/lib/testStaffLogin';

export default function HomeRoute() {
  useEffect(() => {
  testStaffLogin(
    'staff@sliitstack.com',
    'SLIITStack@2026'
  );
}, []);
/*useEffect(() => {
  testStudentLogin(
    'savijanethika@gmail.com',
    'Savija28'
  );
}, []);*/
  return <HomeScreen />;
}