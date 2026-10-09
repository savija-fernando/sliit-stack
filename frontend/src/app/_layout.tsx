
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
        
        <Stack.Screen
          name="staff-dashboard"
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="staff-profile"
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="staff-queues"
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="reservation-details"
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="update-reservation"
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="expired-reservations"
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="issue-details"
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="issue-monitoring"
          options={{ animation: 'none' }}
        />
        <Stack.Screen
          name="update-issue"
          options={{ animation: 'none' }}
        />

      </Stack>
    </ThemeProvider>
  );
}
