
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';

const TIME_SLOTS = [
  { label: '08:00 AM', period: 'Morning' },
  { label: '09:00 AM', period: 'Morning' },
  { label: '10:00 AM', period: 'Morning' },
  { label: '11:00 AM', period: 'Morning' },
  { label: '12:00 PM', period: 'Afternoon' },
  { label: '01:00 PM', period: 'Afternoon' },
  { label: '02:00 PM', period: 'Afternoon' },
  { label: '03:00 PM', period: 'Afternoon' },
  { label: '04:00 PM', period: 'Evening' },
  { label: '05:00 PM', period: 'Evening' },
];

const DURATIONS = ['1 hour', '2 hours', '3 hours', '4 hours'];

function getNextDates() {
  const dates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    dates.push({
      value: [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-'),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      number: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    });
  }

  return dates;
}

export default function DateTimeSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();

  const dates = getNextDates();

  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState('2 hours');
  const [selectedPeriod, setSelectedPeriod] = useState('All');

  const filteredTimes = TIME_SLOTS.filter(
    (slot) =>
      selectedPeriod === 'All' || slot.period === selectedPeriod,
  );

  const bookingType = params.type === 'room' ? 'Room' : 'Seat';

  const handleFilter = () => {
    if (!selectedTime) {
      Alert.alert(
        'Select a time',
        'Please choose a starting time for your booking.',
      );
      return;
    }

    const routeParams = {
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration,
    };

    if (params.type === 'room') {
      router.push({
        pathname: '/study-rooms',
        params: routeParams,
      });
      return;
    }

    router.push({
      pathname: '/available-seats',
      params: { ...routeParams, type: 'seat' },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.heading}>
          <View style={styles.eyebrow}>
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={15}
              color="#2563EB"
            />
            <Text style={styles.eyebrowText}>BOOKING PREFERENCES</Text>
          </View>

          <Text style={styles.title}>Date & Time</Text>
          <Text style={styles.subtitle}>
            Find the right time for your next study session.
          </Text>
        </View>

        {/* Selected space */}
        <View style={styles.spaceBanner}>
          <View style={styles.spaceIcon}>
            <MaterialCommunityIcons
              name={
                bookingType === 'Seat'
                  ? 'seat-outline'
                  : 'office-building-outline'
              }
              size={24}
              color="#2563EB"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.spaceLabel}>BOOKING TYPE</Text>
            <Text style={styles.spaceValue}>{bookingType} booking</Text>
          </View>

          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 2 OF 3</Text>
          </View>
        </View>

        {/* Date selection */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Choose a date</Text>
            <Text style={styles.sectionSubtitle}>
              Select your preferred day
            </Text>
          </View>

          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={23}
            color="#64748B"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
        >
          {dates.map((date) => {
            const selected = selectedDate === date.value;

            return (
              <Pressable
                key={date.value}
                onPress={() => setSelectedDate(date.value)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[
                  styles.dateCard,
                  selected && styles.dateCardSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dateDay,
                    selected && styles.selectedText,
                  ]}
                >
                  {date.day}
                </Text>

                <Text
                  style={[
                    styles.dateNumber,
                    selected && styles.selectedText,
                  ]}
                >
                  {date.number}
                </Text>

                <Text
                  style={[
                    styles.dateMonth,
                    selected && styles.selectedText,
                  ]}
                >
                  {date.month}
                </Text>

                {selected && (
                  <View style={styles.dateIndicator} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Time selection */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Choose a time</Text>
            <Text style={styles.sectionSubtitle}>
              Select your starting time
            </Text>
          </View>

          <MaterialCommunityIcons
            name="clock-time-four-outline"
            size={23}
            color="#64748B"
          />
        </View>

        {/* Time period filters */}
        <View style={styles.periodRow}>
          {['All', 'Morning', 'Afternoon', 'Evening'].map((period) => {
            const active = selectedPeriod === period;

            return (
              <Pressable
                key={period}
                onPress={() => {
                  setSelectedPeriod(period);
                  setSelectedTime(null);
                }}
                style={[
                  styles.periodChip,
                  active && styles.periodChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    active && styles.periodTextActive,
                  ]}
                >
                  {period}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Time slot grid */}
        <View style={styles.timeGrid}>
          {filteredTimes.map((slot) => {
            const selected = selectedTime === slot.label;

            return (
              <Pressable
                key={slot.label}
                onPress={() => setSelectedTime(slot.label)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                style={[
                  styles.timeSlot,
                  selected && styles.timeSlotSelected,
                ]}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={selected ? '#2563EB' : '#64748B'}
                />

                <Text
                  style={[
                    styles.timeText,
                    selected && styles.timeTextSelected,
                  ]}
                >
                  {slot.label}
                </Text>

                {selected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={16}
                    color="#2563EB"
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Duration */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Booking duration</Text>
            <Text style={styles.sectionSubtitle}>
              How long do you need the space?
            </Text>
          </View>

          <MaterialCommunityIcons
            name="timer-outline"
            size={23}
            color="#64748B"
          />
        </View>

        <View style={styles.durationRow}>
          {DURATIONS.map((duration) => {
            const selected = selectedDuration === duration;

            return (
              <Pressable
                key={duration}
                onPress={() => setSelectedDuration(duration)}
                style={[
                  styles.durationChip,
                  selected && styles.durationChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.durationText,
                    selected && styles.durationTextSelected,
                  ]}
                >
                  {duration}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Booking summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={24}
              color="#2563EB"
            />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Your booking preferences</Text>

            <Text style={styles.summaryDetail}>
              {dates.find((date) => date.value === selectedDate)?.day},{' '}
              {dates.find((date) => date.value === selectedDate)?.number}{' '}
              {dates.find((date) => date.value === selectedDate)?.month}
            </Text>

            <Text style={styles.summaryDetail}>
              {selectedTime ?? 'No time selected'} · {selectedDuration}
            </Text>
          </View>
        </View>

        {/* Continue button */}
        <Pressable
          onPress={handleFilter}
          style={({ pressed }) => [
            styles.filterButton,
            pressed && styles.filterButtonPressed,
          ]}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={21}
            color="#FFFFFF"
          />
          <Text style={styles.filterButtonText}>
            Find Available {bookingType === 'Seat' ? 'Seats' : 'Rooms'}
          </Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={21}
            color="#FFFFFF"
          />
        </Pressable>

        <Text style={styles.footerText}>
          Availability will depend on the selected date and time.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 30,
  },

  heading: {
    marginBottom: 23,
  },

  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginBottom: 10,
  },

  eyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#2563EB',
  },

  title: {
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -0.7,
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    marginTop: 7,
  },

  spaceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 27,
    gap: 11,
  },

  spaceIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  spaceLabel: {
    fontSize: 9,
    letterSpacing: 0.9,
    fontWeight: '800',
    color: '#94A3B8',
  },

  spaceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },

  stepBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  stepBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },

  dateList: {
    gap: 10,
    paddingTop: 2,
    paddingBottom: 5,
  },

  dateCard: {
    width: 61,
    height: 94,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dateCardSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },

  dateDay: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  dateNumber: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 3,
  },

  dateMonth: {
    fontSize: 10,
    color: '#64748B',
  },

  selectedText: {
    color: '#FFFFFF',
  },

  dateIndicator: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },

  periodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 13,
  },

  periodChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  periodChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },

  periodText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },

  periodTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 27,
  },

  timeSlot: {
    width: '48%',
    minHeight: 46,
    flexGrow: 1,
    flexBasis: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },

  timeSlotSelected: {
    borderColor: '#60A5FA',
    backgroundColor: '#EFF6FF',
  },

  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  timeTextSelected: {
    color: '#2563EB',
    fontWeight: '800',
  },

  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 25,
  },

  durationChip: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  durationChipSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#60A5FA',
  },

  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  durationTextSelected: {
    color: '#2563EB',
    fontWeight: '800',
  },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 17,
    marginBottom: 18,
  },

  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },

  summaryContent: {
    flex: 1,
  },

  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 5,
  },

  summaryDetail: {
    fontSize: 12,
    lineHeight: 19,
    color: '#64748B',
  },

  filterButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingHorizontal: 15,

    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 4,
  },

  filterButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  footerText: {
    textAlign: 'center',
    marginTop: 13,
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 16,
  },
});