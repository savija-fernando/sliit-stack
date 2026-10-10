import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import AppHeader from '@/components/AppHeader';

export default function SeatBookingConfirmationScreen() {
  const router = useRouter();
  const {
    type,
    roomName,
    date,
    time,
    startTime,
    endTime,
    duration,
    seats,
  } = useLocalSearchParams<{
    type?: string;
    roomName?: string;
    date?: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    duration?: string;
    seats?: string;
  }>();
  const isRoomBooking = type === 'room';

  const seatList = (seats ?? '')
    .split(',')
    .map((seat) => seat.trim())
    .filter(Boolean);

  const formatDate = (value?: string) => {
    if (!value) return 'Not selected';
    const parsedDate = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsedDate.getTime())
      ? value
      : parsedDate.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
  };

  const formatDuration = () => {
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);
    if (start !== null && end !== null && end > start) {
      const minutes = end - start;
      const hoursPart = Math.floor(minutes / 60);
      const minutesPart = minutes % 60;
      return [
        hoursPart ? `${hoursPart} ${hoursPart === 1 ? 'hour' : 'hours'}` : '',
        minutesPart ? `${minutesPart} minutes` : '',
      ]
        .filter(Boolean)
        .join(' ');
    }
    return duration?.trim() || 'Not selected';
  };

  const formatTime = () => {
    if (time?.trim()) return time.trim();
    if (startTime && endTime) return `${startTime} – ${endTime}`;
    return 'Not selected';
  };

  const handleDone = () => {
    router.dismissTo(isRoomBooking ? '/study-room-picker' : '/seats');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="check" size={52} color="#FFFFFF" />
        </View>

        <Text style={styles.title}>
          {isRoomBooking ? 'Study room booking confirmed' : 'Reservation confirmed'}
        </Text>
        <Text style={styles.subtitle}>
          {isRoomBooking
            ? 'Your study room is reserved.'
            : 'Your study space is ready.'}
        </Text>

        <View style={styles.infoCard}>
          {isRoomBooking ? (
            <InfoRow label="Study room" value={roomName?.trim() || 'Not specified'} />
          ) : null}
          <InfoRow label="Date" value={formatDate(date)} />
          <InfoRow label="Time" value={formatTime()} />
          <InfoRow label="Duration" value={formatDuration()} />
          {!isRoomBooking ? (
            <InfoRow
              label="Seat(s)"
              value={seatList.length ? seatList.join(', ') : 'Not selected'}
            />
          ) : null}
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

function toMinutes(value?: string) {
  if (!value) return null;
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
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
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 12,
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
