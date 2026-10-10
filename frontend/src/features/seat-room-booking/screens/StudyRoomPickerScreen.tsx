import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import {
  getAllStudyRooms,
  type StudyRoomBasic,
} from '../services/studyRoomPickerService';

export default function StudyRoomPickerScreen() {
  const router = useRouter();
  const [rooms, setRooms] = useState<StudyRoomBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getAllStudyRooms()
      .then((data) => {
        if (!cancelled) {
          setRooms(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Could not load study rooms.',
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = (room: StudyRoomBasic) => {
    setSelectedId(room.id);
  };

  const handleContinue = () => {
    const room = rooms.find((r) => r.id === selectedId);
    if (!room) return;

    router.push({
      pathname: '/study-room-details',
      params: {
        roomId: room.id,
        roomName: room.name,
        roomLocation: room.location,
        roomCondition: room.condition,
        roomDescription: room.description,
        availableFrom: room.available_from ?? '',
        availableUntil: room.available_until ?? '',
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
        {/* Header */}
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
            <View style={styles.eyebrow}>
              <MaterialCommunityIcons
                name="door-open"
                size={14}
                color="#7C3AED"
              />
              <Text style={styles.eyebrowText}>STUDY ROOMS</Text>
            </View>
            <Text style={styles.title}>Choose a room</Text>
            <Text style={styles.subtitle}>
              Select a study room to review its details before booking.
            </Text>
          </View>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.stateCard}>
            <ActivityIndicator color="#7C3AED" />
            <Text style={styles.stateText}>Loading study rooms…</Text>
          </View>
        )}

        {/* Error */}
        {!loading && error && (
          <View style={styles.stateCard}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={22}
              color="#B91C1C"
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Empty */}
        {!loading && !error && rooms.length === 0 && (
          <View style={styles.stateCard}>
            <MaterialCommunityIcons
              name="door-closed"
              size={26}
              color="#64748B"
            />
            <Text style={styles.stateText}>
              No study rooms are available right now.
            </Text>
          </View>
        )}

        {/* Room cards */}
        {!loading && !error && rooms.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              {rooms.length} ROOM{rooms.length !== 1 ? 'S' : ''} AVAILABLE
            </Text>

            {rooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                index={index}
                selected={selectedId === room.id}
                expanded={expandedId === room.id}
                onSelect={() => handleSelect(room)}
                onToggleExpand={() =>
                  setExpandedId(expandedId === room.id ? null : room.id)
                }
              />
            ))}
          </>
        )}

        {/* Continue button */}
        {selectedId && (
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.continueButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Continue to study room details"
          >
            <MaterialCommunityIcons
              name="calendar-arrow-right"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.continueText}>View Room Details</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#FFFFFF"
            />
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─── Room card component ─────────────────────────────────── */

type RoomCardProps = {
  room: StudyRoomBasic;
  index: number;
  selected: boolean;
  expanded: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
};

function RoomCard({
  room,
  index: _index,
  selected,
  expanded,
  onSelect,
  onToggleExpand,
}: RoomCardProps) {
  // Only animate scale on selection — opacity animation with useNativeDriver
  // is unreliable on Expo Web and causes cards to be permanently invisible.
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.015 : 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [selected, scale]);

  const formatAvailability = () => {
    if (room.available_from && room.available_until) {
      return `${room.available_from} – ${room.available_until}`;
    }
    if (room.available_from) return `From ${room.available_from}`;
    if (room.available_until) return `Until ${room.available_until}`;
    return 'All day';
  };

  return (
    <Animated.View
      style={[styles.cardWrapper, { transform: [{ scale }] }]}
    >
      <View style={[styles.roomCard, selected && styles.roomCardSelected]}>
        {/* Main pressable row */}
        <Pressable
          onPress={onSelect}
          accessibilityRole="button"
          accessibilityLabel={`Select ${room.name}`}
          accessibilityState={{ selected }}
          style={({ pressed }) => [
            styles.roomMain,
            pressed && styles.roomMainPressed,
          ]}
        >
          {/* Icon */}
          <View style={[styles.roomIcon, selected && styles.roomIconSelected]}>
            <MaterialCommunityIcons
              name="door-open"
              size={26}
              color={selected ? '#FFFFFF' : '#7C3AED'}
            />
          </View>

          {/* Info */}
          <View style={styles.roomInfo}>
            <View style={styles.roomTitleRow}>
              <Text style={styles.roomName}>{room.name}</Text>
              <View style={styles.availableBadge}>
                <View style={styles.availableDot} />
                <Text style={styles.availableText}>Available</Text>
              </View>
            </View>

            <View style={styles.roomMeta}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={12}
                color="#64748B"
              />
              <Text style={styles.roomMetaText}>{room.location}</Text>
            </View>

            <View style={styles.roomMeta}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={12}
                color="#64748B"
              />
              <Text style={styles.roomMetaText}>{formatAvailability()}</Text>
            </View>
          </View>

          {/* Selection indicator */}
          {selected ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={24}
              color="#7C3AED"
            />
          ) : (
            <MaterialCommunityIcons
              name="radiobox-blank"
              size={22}
              color="#CBD5E1"
            />
          )}
        </Pressable>

        {/* Condition chip + details toggle */}
        <View style={styles.roomFooter}>
          {room.condition ? (
            <View style={styles.conditionChip}>
              <MaterialCommunityIcons
                name="tools"
                size={11}
                color="#64748B"
              />
              <Text style={styles.conditionText}>{room.condition}</Text>
            </View>
          ) : (
            <View />
          )}

          <Pressable
            onPress={onToggleExpand}
            style={styles.detailsButton}
            accessibilityRole="button"
            accessibilityLabel={expanded ? 'Hide details' : 'Show details'}
          >
            <Text style={styles.detailsButtonText}>
              {expanded ? 'Hide' : 'Details'}
            </Text>
            <MaterialCommunityIcons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={15}
              color="#7C3AED"
            />
          </Pressable>
        </View>

        {/* Expanded description */}
        {expanded && (
          <View style={styles.expandedSection}>
            <Text style={styles.descriptionText}>{room.description}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

/* ─── Styles ──────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    gap: 12,
  },

  /* Header */
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
    backgroundColor: '#F3E8FF',
    marginBottom: 8,
  },

  eyebrowText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#7C3AED',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 20,
  },

  /* Section label */
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#94A3B8',
    marginTop: 4,
  },

  /* State cards */
  stateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minHeight: 90,
    justifyContent: 'center',
  },

  stateText: {
    flexShrink: 1,
    color: '#475569',
    fontSize: 13,
    lineHeight: 19,
  },

  errorText: {
    flexShrink: 1,
    color: '#B91C1C',
    fontSize: 13,
    lineHeight: 19,
  },

  /* Room cards */
  cardWrapper: {
    // animation target
  },

  roomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },

  roomCardSelected: {
    borderColor: '#7C3AED',
    borderWidth: 1.8,
    backgroundColor: '#FDFAFF',
  },

  roomMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 14,
  },

  roomMainPressed: {
    opacity: 0.82,
  },

  roomIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E8FF',
  },

  roomIconSelected: {
    backgroundColor: '#7C3AED',
  },

  roomInfo: {
    flex: 1,
    gap: 4,
  },

  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  roomName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flexShrink: 1,
  },

  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
  },

  availableDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },

  availableText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803D',
  },

  roomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  roomMetaText: {
    fontSize: 11,
    color: '#64748B',
    flexShrink: 1,
  },

  /* Footer */
  roomFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
  },

  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },

  conditionText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },

  detailsButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },

  /* Expanded description */
  expandedSection: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },

  descriptionText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },

  /* Continue button */
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    marginTop: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
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
