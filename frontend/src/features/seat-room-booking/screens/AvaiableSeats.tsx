import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppHeader from '@/components/AppHeader';
import {
  getAllSeats,
  getUnavailableSeatIds,
  type BookableSeat,
} from '../services/seatBookingService';

const COLUMNS = 7;

export default function AvailableSeats() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    date?: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    duration?: string;
    type?: string;
  }>();
  const [seats, setSeats] = useState<BookableSeat[]>([]);
  const [unavailableSeatIds, setUnavailableSeatIds] = useState<Set<string>>(
    new Set(),
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      setError(null);

      const load = async () => {
        try {
          if (!params.date || !params.startTime || !params.endTime) {
            throw new Error('Select a date and time before choosing seats.');
          }

          const [allSeats, unavailableIds] = await Promise.all([
            getAllSeats(),
            getUnavailableSeatIds(
              params.date,
              params.startTime,
              params.endTime,
            ),
          ]);

          if (cancelled) return;
          setSeats(allSeats);
          setUnavailableSeatIds(new Set(unavailableIds));
          setSelected((current) =>
            current.filter((seatId) => !unavailableIds.includes(seatId)),
          );
        } catch (err: unknown) {
          if (!cancelled) {
            setError(
              err instanceof Error ? err.message : 'Could not load seats.',
            );
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      };

      void load();
      return () => {
        cancelled = true;
      };
    }, [params.date, params.startTime, params.endTime]),
  );

  const toggleSeat = (seatId: string) => {
    if (unavailableSeatIds.has(seatId)) return;
    setSelected((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const hasSelection = selected.length > 0;
  const selectedNames = seats
    .filter((seat) => selected.includes(seat.id))
    .map((seat) => seat.name);
  const handleContinue = () => {
    if (!selected.length) {
      Alert.alert('Select a seat', 'Please select at least one available seat.');
      return;
    }

    router.push({
      pathname: '/rules',
      params: {
        type: 'seat',
        date: params.date ?? '',
        time: params.time ?? '',
        startTime: params.startTime ?? '',
        endTime: params.endTime ?? '',
        duration: params.duration ?? '2 hours',
        seatIds: selected.join(','),
        seats: selectedNames.join(', '),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Title */}
        <View style={styles.titleRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <Text style={styles.title}>Select your seat</Text>
        </View>

        {/* Info chips */}
        <View style={styles.infoRow}>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="map-marker-outline" size={15} color="#475569" />
            <Text style={styles.chipText}>Library seats</Text>
          </View>
          <View style={styles.chip}>
            <MaterialCommunityIcons name="clock-outline" size={15} color="#475569" />
            <Text style={styles.chipText}>{params.time ?? 'Selected time'}</Text>
          </View>
        </View>

        {/* Seat map */}
        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator color="#2563EB" />
            <Text style={styles.stateText}>Loading seat availability…</Text>
          </View>
        ) : error ? (
          <View style={styles.state}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : seats.length === 0 ? (
          <View style={styles.state}>
            <Text style={styles.stateText}>No seats are configured yet.</Text>
          </View>
        ) : (
          <View style={styles.seatMap}>
            {Array.from(
              { length: Math.ceil(seats.length / COLUMNS) },
              (_, row) => (
                <View key={row} style={styles.seatRow}>
                  {seats.slice(row * COLUMNS, (row + 1) * COLUMNS).map((seat) => {
                    const isBooked = unavailableSeatIds.has(seat.id);
                    const isSelected = selected.includes(seat.id);

                    return (
                      <Pressable
                        key={seat.id}
                        onPress={() => toggleSeat(seat.id)}
                        disabled={isBooked}
                        accessibilityRole="button"
                        accessibilityLabel={`Seat ${seat.name}, ${
                          isBooked
                            ? 'booked'
                            : isSelected
                              ? 'selected'
                              : 'available'
                        }`}
                        accessibilityState={{
                          selected: isSelected,
                          disabled: isBooked,
                        }}
                        style={({ pressed }) => [
                          styles.seat,
                          isBooked && styles.booked,
                          isSelected && styles.selected,
                          pressed && !isBooked && styles.pressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.seatName,
                            isBooked && styles.bookedSeatName,
                            isSelected && styles.selectedSeatName,
                          ]}
                          numberOfLines={1}
                        >
                          {seat.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ),
            )}
          </View>
        )}

        {/* Legend */}
        <View style={styles.legend}>
          <LegendItem color="#4ADE80" label="Available" />
          <LegendItem color="#F87171" label="Booked" />
          <LegendItem color="#2563EB" label="Selected" />
        </View>

        {/* Selected seats */}
        {hasSelection && (
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              Selected:{' '}
              <Text style={styles.summarySeats}>
                {selectedNames.join(', ')}
              </Text>
            </Text>
            <Pressable
              onPress={() => setSelected([])}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear selected seats"
            >
              <Text style={styles.clear}>Clear</Text>
            </Pressable>
          </View>
        )}

        {/* Continue */}
        <Pressable
          onPress={handleContinue}
          disabled={!hasSelection || loading || !!error}
          style={({ pressed }) => [
            styles.button,
            (!hasSelection || loading || !!error) && styles.buttonDisabled,
            pressed && hasSelection && styles.pressed,
          ]}
        >
          <Text style={styles.buttonText}>
            {hasSelection ? `Continue (${selected.length})` : 'Continue'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 20, paddingBottom: 32 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },

  infoRow: { flexDirection: 'row', gap: 10, marginTop: 14, marginBottom: 22 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  chipText: { fontSize: 12, color: '#475569' },

  seatMap: {
    padding: 10,
    gap: 9,
    borderRadius: 0,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  seat: {
    flex: 1,
    aspectRatio: 1.3,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ADE80',
    paddingHorizontal: 1,
  },
  seatName: { fontSize: 9, fontWeight: '700', color: '#14532D' },
  bookedSeatName: { color: '#7F1D1D' },
  selectedSeatName: { color: '#FFFFFF' },
  booked: { backgroundColor: '#F87171', opacity: 0.55 },
  selected: { backgroundColor: '#2563EB' },
  state: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
  },
  stateText: { fontSize: 14, color: '#475569', textAlign: 'center' },
  errorText: { fontSize: 14, color: '#B91C1C', textAlign: 'center' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.94 }] },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginVertical: 22,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 14, height: 14, borderRadius: 4 },
  legendText: { fontSize: 12, color: '#475569' },

  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
  },
  summaryText: { fontSize: 14, color: '#1E3A8A' },
  summarySeats: { fontWeight: '700' },
  clear: { fontSize: 13, fontWeight: '600', color: '#2563EB' },

  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#2563EB',
  },
  buttonDisabled: { backgroundColor: '#CBD5E1' },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
