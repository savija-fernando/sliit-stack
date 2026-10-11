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

export default function StudyRoomDetailsScreen() {
  const router = useRouter();
  const {
    roomId,
    roomName,
    roomLocation,
    roomCondition,
    roomDescription,
    availableFrom,
    availableUntil,
  } = useLocalSearchParams<{
    roomId?: string;
    roomName?: string;
    roomLocation?: string;
    roomCondition?: string;
    roomDescription?: string;
    availableFrom?: string;
    availableUntil?: string;
  }>();

  const formatAvailability = () => {
    if (availableFrom && availableUntil) {
      return `${availableFrom} – ${availableUntil}`;
    }
    if (availableFrom) return `From ${availableFrom}`;
    if (availableUntil) return `Until ${availableUntil}`;
    return 'All day';
  };

  const handleContinue = () => {
    if (!roomId) return;

    router.push({
      pathname: '/study-room-calendar',
      params: {
        roomId,
        roomName: roomName ?? '',
        roomLocation: roomLocation ?? '',
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
            accessibilityLabel="Go back to study rooms"
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
              <Text style={styles.eyebrowText}>STUDY ROOM DETAILS</Text>
            </View>
            <Text style={styles.title}>{roomName || 'Study room'}</Text>
            <Text style={styles.subtitle}>
              Review this room before choosing a booking date and time.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ROOM OVERVIEW</Text>
          <View style={styles.detailGrid}>
            <DetailTile
              icon="map-marker-outline"
              label="LOCATION"
              value={roomLocation || 'Not specified'}
            />
            <DetailTile
              icon="tools"
              label="CONDITION"
              value={roomCondition || 'Not specified'}
            />
          </View>
          <View style={styles.availabilityCard}>
            <View style={styles.availabilityIcon}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={19}
                color="#7C3AED"
              />
            </View>
            <View style={styles.availabilityText}>
              <Text style={styles.detailLabel}>AVAILABLE HOURS</Text>
              <Text style={styles.detailValue}>{formatAvailability()}</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Good</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <View style={styles.descriptionTitleRow}>
            <MaterialCommunityIcons
              name="text-box-outline"
              size={18}
              color="#7C3AED"
            />
            <Text style={styles.descriptionHeading}>About this room</Text>
          </View>
          <Text style={styles.description}>
            {roomDescription || 'No additional details are available.'}
          </Text>
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={!roomId}
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
            !roomId && styles.continueButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Continue to date and time selection"
          accessibilityState={{ disabled: !roomId }}
        >
          <MaterialCommunityIcons
            name="calendar-arrow-right"
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.continueText}>Select Date & Time</Text>
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

function DetailTile({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailTile}>
      <View style={styles.detailIcon}>
        <MaterialCommunityIcons name={icon} size={19} color="#7C3AED" />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
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
  detailGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailTile: {
    flex: 1,
    minHeight: 122,
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
  },
  detailText: {
    gap: 5,
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  detailValue: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  availabilityCard: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  availabilityIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#F3E8FF',
  },
  availabilityText: {
    flex: 1,
    gap: 5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    flexShrink: 0,
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
  descriptionCard: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  descriptionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptionHeading: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    color: '#475569',
    fontSize: 13,
    lineHeight: 21,
  },
  continueButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
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
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
