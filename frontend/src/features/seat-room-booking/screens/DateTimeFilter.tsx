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
import { Calendar, DateData } from 'react-native-calendars';
import AppHeader from '@/components/AppHeader';

const TIME_SLOTS = [
  { label: '08:00 AM – 10:00 AM', start: '08:00', end: '10:00' },
  { label: '10:00 AM – 12:00 PM', start: '10:00', end: '12:00' },
];

function getDuration(startTime: string, endTime: string): string {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const minutes =
    endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return [
    hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '',
    remainingMinutes ? `${remainingMinutes} minutes` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/*
 * Convert Date into YYYY-MM-DD
 */
function getDateString(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/*
 * Get today's date
 */
function getTodayString() {
  return getDateString(new Date());
}

export default function DateTimeSelectionScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{ type?: string }>();

  /*
   * Date
   */
   const today = getTodayString();

   const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /*
   * Time
   */
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  /*
   * Booking type
   * We keep this because the next screen depends on it.
   */
  const bookingType = params.type === 'room' ? 'Room' : 'Seat';

  /*
   * Calendar marked dates
   */
  const markedDates: {
    [key: string]: {
      disabled?: boolean;
      disableTouchEvent?: boolean;
      marked?: boolean;
      dotColor?: string;
      selected?: boolean;
      selectedColor?: string;
      selectedTextColor?: string;
    };
  } = {};

  /*
   * Highlight selected date
   */
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#2563EB',
      selectedTextColor: '#FFFFFF',
    };
  }

  /*
   * When user selects a date
   */
  const handleDateSelect = (day: DateData) => {
    if (day.dateString < today) {
      Alert.alert(
        'Date unavailable',
        'Please select today or a future date.',
      );

      return;
    }

    setSelectedDate(day.dateString);
  };

  /*
   * Continue button
   */
  const handleContinue = () => {
    if (!selectedDate) {
      Alert.alert(
        'Select a time',
        'Please select a date from the calendar.',
      );

      return;
    }

    if (!selectedTime) {
      Alert.alert(
        'Select a time',
        'Please select a time.',
      );

      return;
    }

    /*
     * Keep the same data being sent to the next screen.
     */
    const routeParams = {
      date: selectedDate,
      time: selectedTime,
    };

    /*
     * ROOM
     */
    if (params.type === 'room') {
      router.push({
        pathname: '/study-rooms',
        params: routeParams,
      });

      return;
    }

    const selectedSlot = TIME_SLOTS.find(
      (slot) => slot.label === selectedTime,
    );
    if (!selectedSlot) {
      Alert.alert('Invalid time', 'Please select an available time slot again.');
      return;
    }

    /*
     * SEAT
     */
    router.push({
      pathname: '/available-seats',
      params: {
        ...routeParams,
        type: 'seat',
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        duration: getDuration(selectedSlot.start, selectedSlot.end),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Back + Header */}

        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color="#1F2937"
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Select Date & Time</Text>

            <Text style={styles.subtitle}>
              Choose when you want to book your {bookingType.toLowerCase()}.
            </Text>
          </View>
        </View>

        {/* Date */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select a date
          </Text>

          <Text style={styles.sectionSubtitle}>
            Choose an available date from the calendar.
          </Text>

          <View style={styles.calendarCard}>
            <Calendar
              minDate={today}
              current={selectedDate || today}
              onDayPress={handleDateSelect}
              markedDates={markedDates}
              enableSwipeMonths={true}
              firstDay={1}
              theme={{
                backgroundColor: '#FFFFFF',
                calendarBackground: '#FFFFFF',

                textSectionTitleColor: '#64748B',

                selectedDayBackgroundColor: '#2563EB',
                selectedDayTextColor: '#FFFFFF',

                todayTextColor: '#2563EB',

                dayTextColor: '#0F172A',
                textDisabledColor: '#CBD5E1',

                monthTextColor: '#0F172A',

                arrowColor: '#2563EB',

                textDayFontWeight: '600',
                textMonthFontWeight: '800',
                textDayHeaderFontWeight: '700',

                textDayFontSize: 14,
                textMonthFontSize: 17,
                textDayHeaderFontSize: 11,
              }}
            />
          </View>
        </View>

        {/* Selected Date */}

        {selectedDate && (
          <View style={styles.selectedBox}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={22}
              color="#2563EB"
            />

            <View>
              <Text style={styles.selectedLabel}>
                SELECTED DATE
              </Text>

              <Text style={styles.selectedValue}>
                {selectedDate}
              </Text>
            </View>
          </View>
        )}

        {/* Time */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Select a time
          </Text>

          <Text style={styles.sectionSubtitle}>
            Choose your preferred starting time.
          </Text>

          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((slot) => {
              const selected = selectedTime === slot.label;

              return (
                <Pressable
                  key={slot.label}
                  onPress={() => setSelectedTime(slot.label)}
                  style={[
                    styles.timeButton,
                    selected && styles.timeButtonSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={18}
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
                      size={17}
                      color="#2563EB"
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Continue */}

        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
          ]}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={21}
            color="#FFFFFF"
          />
        </Pressable>
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
    paddingTop: 24,
    paddingBottom: 35,
  },

  /*
   * Header
   */

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    marginTop: 6,
  },

  /*
   * Sections
   */

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 5,
    marginBottom: 13,
  },

  /*
   * Calendar
   */

  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },

  /*
   * Selected date
   */

  selectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,

    backgroundColor: '#EFF6FF',

    borderWidth: 1,
    borderColor: '#BFDBFE',

    borderRadius: 14,

    padding: 13,

    marginBottom: 25,
  },

  selectedLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.7,
  },

  selectedValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },

  /*
   * Time
   */

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  timeButton: {
    width: '47%',

    minHeight: 48,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    borderRadius: 12,

    paddingHorizontal: 8,
  },

  timeButtonSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#60A5FA',
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

  /*
   * Continue button
   */

  continueButton: {
    minHeight: 54,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 10,

    backgroundColor: '#2563EB',

    borderRadius: 15,

    marginTop: 5,
  },

  continueButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});