
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(student)" />
        <Stack.Screen name="staff-dashboard" />
        <Stack.Screen name="staff-profile" />
        <Stack.Screen name="staff-queues" />
        <Stack.Screen name="reservation-details" />
        <Stack.Screen name="update-reservation" />
        <Stack.Screen name="expired-reservations" />
        <Stack.Screen name="issue-details" />
        <Stack.Screen name="issue-monitoring" />
        <Stack.Screen name="update-issue" />
      </Stack>
    </ThemeProvider>
  );
}
