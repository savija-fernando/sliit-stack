import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';

export default function ReservationConfirmationScreen() {
  const router = useRouter();
  const { reference } = useLocalSearchParams<{ reference?: string }>();

 const handleDone = () => {
  router.dismissTo('/books');
};

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={60} color="#FFFFFF" />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Reservation confirmed</Text>
          <Text style={styles.reference}>Reference #{reference}</Text>
        </View>

        <Text style={styles.message}>
          Collect by tomorrow, 5:00 pm{'\n'}or the reservation is
          auto-cancelled.
        </Text>

        <Pressable
          onPress={handleDone}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.doneButton,
            pressed && styles.doneButtonPressed,
          ]}
        >
          <Text style={styles.doneButtonText}>Done</Text>
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
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBlock: {
    alignItems: 'center',
    marginTop: 40,
    gap: 2,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  reference: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
  },

  message: {
    marginTop: 36,
    fontSize: 14,
    lineHeight: 21,
    color: '#111827',
    textAlign: 'center',
  },

  doneButton: {
    width: '60%',
    height: 48,
    marginTop: 40,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  doneButtonPressed: {
    opacity: 0.85,
  },

  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});