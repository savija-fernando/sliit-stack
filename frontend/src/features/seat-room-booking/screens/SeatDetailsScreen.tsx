import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppHeader from '@/components/AppHeader';

export default function SeatDetailsScreen() {
  const router = useRouter();
  const { date, time, startTime, endTime, duration, seats, seatIds } =
    useLocalSearchParams<{
      date?: string;
      time?: string;
      startTime?: string;
      endTime?: string;
      duration?: string;
      seats?: string;
      seatIds?: string;
    }>();

  const selectedSeats = (seats ?? '')
    .split(',')
    .map((seat) => seat.trim())
    .filter(Boolean);
  const selectedSeatIds = (seatIds ?? '')
    .split(',')
    .map((seatId) => seatId.trim())
    .filter(Boolean);

  const handleContinue = () => {
    if (!selectedSeatIds.length || !date || !startTime || !endTime) return;

    router.push({
      pathname: '/rules',
      params: {
        type: 'seat',
        date,
        time: time ?? '',
        startTime,
        endTime,
        duration: duration ?? '',
        seatIds: selectedSeatIds.join(','),
        seats: selectedSeats.join(', '),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back to seat selection"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color="#1F2937"
            />
          </Pressable>
          <View style={styles.headingText}>
            <View style={styles.eyebrow}>
              <MaterialCommunityIcons
                name="seat-outline"
                size={14}
                color="#2563EB"
              />
              <Text style={styles.eyebrowText}>SEAT DETAILS</Text>
            </View>
            <Text style={styles.title}>Your selected seats</Text>
            <Text style={styles.subtitle}>
              Review your seats and booking time before continuing.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SEAT OVERVIEW</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryIcon}>
                <MaterialCommunityIcons
                  name="seat"
                  size={21}
                  color="#2563EB"
                />
              </View>
              <View style={styles.summaryHeading}>
                <Text style={styles.summaryTitle}>
                  {selectedSeats.length}{' '}
                  {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
                </Text>
                <Text style={styles.summarySubtitle}>Library seating area</Text>
              </View>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Available</Text>
              </View>
            </View>

            {selectedSeats.length > 0 ? (
              <View style={styles.seatList}>
                {selectedSeats.map((seat) => (
                  <View key={seat} style={styles.seatChip}>
                    <MaterialCommunityIcons
                      name="seat-outline"
                      size={15}
                      color="#1D4ED8"
                    />
                    <Text style={styles.seatChipText}>{seat}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptySeats}>
                No seat details were provided. Go back and select a seat.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BOOKING SUMMARY</Text>
          <View style={styles.bookingCard}>
            <SummaryRow
              icon="calendar-blank-outline"
              label="Date"
              value={formatDate(date)}
            />
            <View style={styles.divider} />
            <SummaryRow
              icon="clock-outline"
              label="Time"
              value={time || formatTimeRange(startTime, endTime)}
            />
            <View style={styles.divider} />
            <SummaryRow
              icon="timer-outline"
              label="Duration"
              value={duration || getDuration(startTime, endTime)}
            />
          </View>
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={!selectedSeatIds.length || !date || !startTime || !endTime}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
            (!selectedSeatIds.length || !date || !startTime || !endTime) &&
              styles.continueButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Continue to booking rules"
          accessibilityState={{
            disabled:
              !selectedSeatIds.length || !date || !startTime || !endTime,
          }}
        >
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.continueText}>Continue to Rules</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryRowIcon}>
        <MaterialCommunityIcons name={icon} size={17} color="#2563EB" />
      </View>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function formatDate(value?: string) {
  if (!value) return 'Not selected';
  const parsedDate = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? value
    : parsedDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
}

function formatTimeRange(start?: string, end?: string) {
  if (!start || !end) return 'Not selected';
  return `${formatTime(start)} – ${formatTime(end)}`;
}

function formatTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return value;

  const period = hours >= 12 ? 'PM' : 'AM';
  return `${String(hours % 12 || 12).padStart(2, '0')}:${match[2]} ${period}`;
}

function getDuration(start?: string, end?: string) {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return 'Not selected';
  }

  const totalMinutes = endMinutes - startMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return [
    hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '',
    minutes ? `${minutes} minutes` : '',
  ]
    .filter(Boolean)
    .join(' ');
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 6,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    flex: 1,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    marginBottom: 8,
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#2563EB',
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 20,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginLeft: 2,
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  summaryCard: {
    padding: 16,
    gap: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  summaryIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#DBEAFE',
  },
  summaryHeading: {
    flex: 1,
    gap: 4,
  },
  summaryTitle: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  summarySubtitle: {
    color: '#64748B',
    fontSize: 11,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  statusText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '700',
  },
  seatList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
  },
  seatChipText: {
    color: '#1E3A8A',
    fontSize: 12,
    fontWeight: '700',
  },
  emptySeats: {
    color: '#B91C1C',
    fontSize: 12,
    lineHeight: 18,
  },
  bookingCard: {
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryRowIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
  },
  summaryLabel: {
    flex: 1,
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryValue: {
    maxWidth: '62%',
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  continueButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  continueButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
