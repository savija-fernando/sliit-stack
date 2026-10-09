import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '@/components/AppHeader';

export default function SeatBookingConfirmationScreen() {
  const router = useRouter();
  const { date, time, startTime, endTime, duration, seats } = useLocalSearchParams<{
    date?: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    duration?: string;
    seats?: string;
  }>();

  const seatList = (seats ?? '')
    .split(',')
    .map((seat) => seat.trim())
    .filter(Boolean);

  const handleDone = () => {
    router.dismissTo('/seats');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="check" size={52} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>Reservation confirmed</Text>
        <Text style={styles.subtitle}>Your study space is ready.</Text>

        <View style={styles.infoCard}>
          <InfoRow label="Date" value={date ?? 'Not selected'} />
          <InfoRow label="Time" value={time ?? 'Not selected'} />
          <InfoRow label="Duration" value={duration ?? 'Not selected'} />
          <InfoRow
            label="Seat(s)"
            value={seatList.length ? seatList.join(', ') : 'Not selected'}
          />
        </View>

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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
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
    paddingBottom: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
  },
  infoCard: {
    width: '100%',
    marginTop: 28,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  rowLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  rowValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
  },
  doneButton: {
    width: '70%',
    marginTop: 28,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonPressed: {
    opacity: 0.9,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
