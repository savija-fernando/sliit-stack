import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '@/components/AppHeader';

export default function AdminResourceConfirmationScreen() {
  const router = useRouter();
  const { resourceName } = useLocalSearchParams<{ resourceName?: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="check" size={48} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Resource created successfully</Text>
        <Text style={styles.message}>
          {resourceName
            ? `${resourceName} has been added and is ready to use.`
            : 'Your resource has been added successfully and is ready to use.'}
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 48,
  },
  iconCircle: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
    backgroundColor: '#16A34A',
    marginBottom: 28,
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});