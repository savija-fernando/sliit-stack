
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';

type BookingType = 'seat' | 'room';

export default function SeatRoomSelectionScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<BookingType | null>('seat');

  const summaryOpacity = useRef(new Animated.Value(0)).current;
  const summaryTranslateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    if (selectedType) {
      Animated.parallel([
        Animated.timing(summaryOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(summaryTranslateY, {
          toValue: 0,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedType, summaryOpacity, summaryTranslateY]);

  const handleContinue = () => {
    if (!selectedType) {
      Alert.alert('Choose a space', 'Please select Seat or Room first.');
      return;
    }

    router.push({
      pathname: '/date-time-filter',
      params: { type: selectedType },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <View style={styles.content}>
        {/* Page heading */}
        <View style={styles.headingContainer}>
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
                name="calendar-check-outline"
                size={15}
                color="#2563EB"
              />
              <Text style={styles.eyebrowText}>RESERVATIONS</Text>
            </View>

            <Text style={styles.title}>Book a space</Text>
            <Text style={styles.subtitle}>
              Find the perfect space for your next study session.
            </Text>
          </View>
        </View>

        {/* Section heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Choose your space</Text>
          <Text style={styles.stepText}>STEP 1 OF 2</Text>
        </View>

        {/* Booking options */}
        <View style={styles.optionsRow}>
          <OptionCard
            label="Seat"
            description="Individual study"
            iconName="seat-outline"
            selected={selectedType === 'seat'}
            accentColor="#2563EB"
            onPress={() => setSelectedType('seat')}
          />

          <OptionCard
            label="Room"
            description="Group study"
            iconName="office-building-outline"
            selected={selectedType === 'room'}
            accentColor="#7C3AED"
            onPress={() => setSelectedType('room')}
          />
        </View>

        {/* Animated selection summary */}
        {selectedType && (
          <Animated.View
            style={[
              styles.selectionBox,
              {
                opacity: summaryOpacity,
                transform: [{ translateY: summaryTranslateY }],
              },
            ]}
          >
            <View style={styles.summaryIcon}>
              <MaterialCommunityIcons
                name={
                  selectedType === 'seat'
                    ? 'seat-outline'
                    : 'office-building-outline'
                }
                size={25}
                color={selectedType === 'seat' ? '#2563EB' : '#7C3AED'}
              />
            </View>

            <View style={styles.summaryContent}>
              <Text style={styles.selectionLabel}>YOUR SELECTION</Text>
              <Text style={styles.selectionValue}>
                {selectedType === 'seat' ? 'Seat booking' : 'Room booking'}
              </Text>
              <Text style={styles.selectionDescription}>
                {selectedType === 'seat'
                  ? 'A personal space for focused study.'
                  : 'A shared space for group collaboration.'}
              </Text>
            </View>

            <MaterialCommunityIcons
              name="check-circle"
              size={23}
              color="#16A34A"
            />
          </Animated.View>
        )}

        {/* Helpful information */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color="#64748B"
          />
          <Text style={styles.infoText}>
            Select your preferred space to continue with your reservation.
          </Text>
        </View>

        <View style={styles.bottomArea}>
          <Pressable
            onPress={handleContinue}
            disabled={!selectedType}
            style={({ pressed }) => [
              styles.continueButton,
              !selectedType && styles.continueButtonDisabled,
              pressed && selectedType && styles.continueButtonPressed,
            ]}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={21}
              color="#FFFFFF"
            />
          </Pressable>

          <Text style={styles.footerText}>
            Simple, convenient, and easy booking.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

type OptionCardProps = {
  label: string;
  description: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  selected: boolean;
  accentColor: string;
  onPress: () => void;
};

function OptionCard({
  label,
  description,
  iconName,
  selected,
  accentColor,
  onPress,
}: OptionCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.025 : 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [selected, scale]);

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { transform: [{ scale }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label} booking option`}
        accessibilityState={{ selected }}
        style={({ pressed }) => [
          styles.optionCard,
          selected && {
            backgroundColor: '#FFFFFF',
            borderColor: accentColor,
            borderWidth: 1.8,
          },
          pressed && styles.optionCardPressed,
        ]}
      >
        {/* Selected indicator */}
        {selected && (
          <View
            style={[
              styles.selectedBadge,
              { backgroundColor: accentColor },
            ]}
          >
            <MaterialCommunityIcons
              name="check"
              size={13}
              color="#FFFFFF"
            />
          </View>
        )}

        {/* Icon background */}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: selected
                ? `${accentColor}15`
                : '#F1F5F9',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={iconName}
            size={39}
            color={selected ? accentColor : '#64748B'}
          />
        </View>

        <Text
          style={[
            styles.optionText,
            selected && { color: accentColor },
          ]}
        >
          {label}
        </Text>

        <Text style={styles.optionDescription}>{description}</Text>

        <View
          style={[
            styles.cardBottomLine,
            {
              backgroundColor: selected ? accentColor : '#E2E8F0',
              width: selected ? 42 : 22,
            },
          ]}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 20,
  },

  headingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 32,
  },

  headingText: {
    flex: 1,
  },

  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
  },

  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 7,
    marginBottom: 10,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
  },

  eyebrowText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#2563EB',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },

  stepText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#94A3B8',
  },

  optionsRow: {
    flexDirection: 'row',
    gap: 14,
  },

  cardWrapper: {
    flex: 1,
  },

  optionCard: {
    minHeight: 195,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',

    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.045,
    shadowRadius: 12,
    elevation: 2,
  },

  optionCardPressed: {
    opacity: 0.88,
  },

  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  optionText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#334155',
  },

  optionDescription: {
    marginTop: 5,
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },

  cardBottomLine: {
    height: 4,
    borderRadius: 5,
    marginTop: 17,
  },

  selectionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',

    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.035,
    shadowRadius: 10,
    elevation: 1,
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    marginRight: 13,
  },

  summaryContent: {
    flex: 1,
  },

  selectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#94A3B8',
  },

  selectionValue: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },

  selectionDescription: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: '#64748B',
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 18,
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 19,
    color: '#64748B',
  },

  bottomArea: {
    marginTop: 'auto',
    paddingTop: 25,
  },

  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#2563EB',

    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },

  continueButtonDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },

  continueButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  footerText: {
    marginTop: 12,
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});