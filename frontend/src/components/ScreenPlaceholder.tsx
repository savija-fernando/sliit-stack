import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '@/components/AppHeader';

export default function ScreenPlaceholder({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  text: { fontSize: 14, color: '#6B7280' },
});