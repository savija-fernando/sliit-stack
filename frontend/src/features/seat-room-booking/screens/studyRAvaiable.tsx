import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';

const STUDY_ROOMS = [
  {
    id: 'room-a',
    name: 'Study Room A',
    floor: 'Library 2nd floor',
    capacity: 4,
    amenities: 'Whiteboard · Display',
    description: 'A comfortable room for small group study sessions.',
    available: true,
  },
  {
    id: 'room-b',
    name: 'Study Room B',
    floor: 'Library 2nd floor',
    capacity: 6,
    amenities: 'Whiteboard · Display · Power outlets',
    description: 'A spacious group room with presentation equipment.',
    available: true,
  },
  {
    id: 'room-c',
    name: 'Study Room C',
    floor: 'Library 3rd floor',
    capacity: 8,
    amenities: 'Whiteboard · Conference display',
    description: 'A large meeting space for collaborative study.',
    available: false,
  },
  {
    id: 'room-d',
    name: 'Quiet Study Room',
    floor: 'Library 3rd floor',
    capacity: 2,
    amenities: 'Quiet zone · Power outlets',
    description: 'A quiet space for focused individual or pair study.',
    available: true,
  },
];

export default function StudyRoomsAvailableScreen() {
  const router = useRouter();
  const { date, time, duration } = useLocalSearchParams<{
    date?: string;
    time?: string;
    duration?: string;
  }>();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heading}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color="#1F2937"
            />
          </Pressable>
          <View style={styles.headingText}>
            <Text style={styles.title}>Available study rooms</Text>
            <Text style={styles.subtitle}>
              Choose a room for your study session.
            </Text>
          </View>
        </View>

        {(date || time || duration) && (
          <View style={styles.bookingSummary}>
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={20}
              color="#2563EB"
            />
            <Text style={styles.bookingSummaryText}>
              {[date, time, duration].filter(Boolean).join(' · ')}
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>STUDY ROOMS</Text>
        {STUDY_ROOMS.map((room) => {
          const isSelected = selectedRoom === room.id;
          const isExpanded = expandedRoom === room.id;

          return (
            <View
              key={room.id}
              style={[
                styles.roomCard,
                isSelected && styles.roomCardSelected,
                !room.available && styles.roomCardUnavailable,
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${room.name}, ${
                  room.available ? 'available' : 'booked'
                }`}
                accessibilityState={{
                  selected: isSelected,
                  disabled: !room.available,
                }}
                disabled={!room.available}
                onPress={() => setSelectedRoom(room.id)}
                style={({ pressed }) => [
                  styles.roomCardMain,
                  pressed && room.available && styles.roomCardPressed,
                ]}
              >
                <View
                  style={[
                    styles.roomIcon,
                    isSelected && styles.roomIconSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="door-open"
                    size={24}
                    color={isSelected ? '#FFFFFF' : '#2563EB'}
                  />
                </View>

                <View style={styles.roomDetails}>
                  <View style={styles.roomTitleRow}>
                    <Text style={styles.roomName}>{room.name}</Text>
                    <Text
                      style={[
                        styles.availability,
                        room.available
                          ? styles.available
                          : styles.unavailable,
                      ]}
                    >
                      {room.available ? 'Available' : 'Booked'}
                    </Text>
                  </View>
                  <Text style={styles.roomMeta}>
                    {room.floor} · Up to {room.capacity} people
                  </Text>
                  <Text style={styles.amenities}>{room.amenities}</Text>
                </View>

                {isSelected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={22}
                    color="#2563EB"
                  />
                )}
              </Pressable>

              <View style={styles.roomActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${isExpanded ? 'Hide' : 'Show'} details for ${room.name}`}
                  accessibilityState={{ expanded: isExpanded }}
                  onPress={() =>
                    setExpandedRoom(isExpanded ? null : room.id)
                  }
                  style={({ pressed }) => [
                    styles.detailsButton,
                    pressed && styles.roomCardPressed,
                  ]}
                >
                  <Text style={styles.detailsButtonText}>
                    {isExpanded ? 'Hide details' : 'Details'}
                  </Text>
                  <MaterialCommunityIcons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={17}
                    color="#2563EB"
                  />
                </Pressable>
              </View>

              {isExpanded && (
                <View style={styles.expandedDetails}>
                  <Text style={styles.roomDescription}>
                    {room.description}
                  </Text>
                  <DetailRow
                    icon="map-marker-outline"
                    label="Location"
                    value={room.floor}
                  />
                  <DetailRow
                    icon="account-group-outline"
                    label="Capacity"
                    value={`Up to ${room.capacity} people`}
                  />
                  <DetailRow
                    icon="tools"
                    label="Amenities"
                    value={room.amenities}
                  />
                  {(date || time || duration) && (
                    <DetailRow
                      icon="calendar-clock-outline"
                      label="Requested session"
                      value={[date, time, duration].filter(Boolean).join(' · ')}
                    />
                  )}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Book ${room.name}`}
                    disabled={!room.available}
                    onPress={() => setSelectedRoom(room.id)}
                    style={({ pressed }) => [
                      styles.bookButton,
                      !room.available && styles.bookButtonDisabled,
                      pressed && room.available && styles.roomCardPressed,
                    ]}
                  >
                    <Text style={styles.bookButtonText}>
                      {isSelected ? 'SELECTED' : 'BOOK'}
                    </Text>
                  </Pressable>
                  {isSelected && (
                    <Text style={styles.selectedMessage}>
                      Selected for your booking.
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <Text style={styles.note}>
          Room availability shown here is sample data.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <MaterialCommunityIcons name={icon} size={17} color="#64748B" />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 14,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
  },
  headingText: {
    flex: 1,
  },
  title: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 3,
  },
  bookingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  bookingSummaryText: {
    flex: 1,
    color: '#1E3A8A',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 10,
  },
  roomCard: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  roomCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#F8FBFF',
  },
  roomCardUnavailable: {
    opacity: 0.55,
  },
  roomCardPressed: {
    opacity: 0.8,
  },
  roomCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roomActions: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  detailsButtonText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  expandedDetails: {
    gap: 11,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  roomDescription: {
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailLabel: {
    width: 72,
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  detailValue: {
    flex: 1,
    color: '#334155',
    fontSize: 11,
    lineHeight: 16,
  },
  bookButton: {
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  bookButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  selectedMessage: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  roomIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  roomIconSelected: {
    backgroundColor: '#2563EB',
  },
  roomDetails: {
    flex: 1,
    gap: 4,
  },
  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  roomName: {
    flex: 1,
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  availability: {
    fontSize: 10,
    fontWeight: '700',
  },
  available: {
    color: '#15803D',
  },
  unavailable: {
    color: '#B91C1C',
  },
  roomMeta: {
    color: '#475569',
    fontSize: 11,
  },
  amenities: {
    color: '#64748B',
    fontSize: 10,
  },
  note: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
