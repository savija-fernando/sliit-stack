import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Stop swiping back from the confirmation to the reserve screen */}
      <Stack.Screen name="confirmation" options={{ gestureEnabled: false }} />
    </Stack>
  );
}