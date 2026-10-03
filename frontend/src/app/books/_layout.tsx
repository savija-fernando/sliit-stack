import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function BooksLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="results" />
      <Stack.Screen name="reserve" />
      {/* Stop swiping back from the confirmation to the reserve screen */}
      <Stack.Screen name="confirmation" options={{ gestureEnabled: false }} />
    </Stack>
  );
}