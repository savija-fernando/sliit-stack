import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import {
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';

import StaffActivityRow from '../components/StaffActivityRow';
import StaffBottomNav from '../components/StaffBottomNav';
import StaffStatCard from '../components/StaffStatCard';

export default function StaffDashboardScreen() {
  const router = useRouter();

  const openBookRequests = () => {
    router.push(
      '/staff-queues?type=book' as Href,
    );
  };

  const openSeatRequests = () => {
    router.push(
      '/staff-queues?type=seat' as Href,
    );
  };

  const openExpiredReservations = () => {
    router.push(
      '/expired-reservations' as Href,
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        {/* Header */}
        <AppHeader
          rightAction="profile"
          sideMenu="staff"
        />

        {/* Main dashboard */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting */}
          <View style={styles.greetingSection}>
            <View>
              <Text style={styles.welcomeText}>
                Staff Dashboard
              </Text>

              <Text style={styles.title}>
                Hello, Staff!
              </Text>

              <Text style={styles.subtitle}>
                Manage reservations and keep the campus
                running smoothly
              </Text>
            </View>

            <View style={styles.greetingIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={29}
                color="#1D4ED8"
              />
            </View>
          </View>

          {/* Section heading */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Overview
            </Text>

            <Text style={styles.sectionSubtitle}>
              Today
            </Text>
          </View>

          {/* Statistics */}
          <View style={styles.statsGrid}>
            {/* Book Requests */}
            <StaffStatCard
              value="12"
              label="Book Requests"
              variant="blue"
              onPress={openBookRequests}
              icon={
                <Ionicons
                  name="book"
                  size={25}
                  color="#2563EB"
                />
              }
            />

            {/* Seat Requests */}
            <StaffStatCard
              value="09"
              label="Seat Requests"
              variant="green"
              onPress={openSeatRequests}
              icon={
                <MaterialCommunityIcons
                  name="seat"
                  size={27}
                  color="#059669"
                />
              }
            />

            {/* Expired Reservations */}
            <StaffStatCard
              value="26"
              label="Expired Today"
              variant="orange"
              onPress={
                openExpiredReservations
              }
              icon={
                <Ionicons
                  name="time-outline"
                  size={27}
                  color="#EA580C"
                />
              }
            />

            {/* Open Issues */}
            <StaffStatCard
              value="04"
              label="Open Issues"
              variant="red"
              icon={
                <Ionicons
                  name="warning-outline"
                  size={27}
                  color="#DC2626"
                />
              }
            />
          </View>

          {/* Recent activity heading */}
          <View style={styles.activityHeader}>
            <View>
              <Text style={styles.activityTitle}>
                Recent Activity
              </Text>

              <Text style={styles.activitySubtitle}>
                Latest staff reservation activity
              </Text>
            </View>

            <View style={styles.updatedContainer}>
              <View style={styles.smallDot} />

              <Text style={styles.updatedText}>
                Just now
              </Text>
            </View>
          </View>

          {/* Recent activity */}
          <View style={styles.activityList}>
            <StaffActivityRow
              title="Book Reservation"
              time="02 Minutes ago"
            />

            <StaffActivityRow
              title="Seat Reservation"
              time="11 Minutes ago"
            />

            <StaffActivityRow
              title="Expired Reservations"
              time="14 Minutes ago"
            />

            <StaffActivityRow
              title="Issue Reported"
              time="16 Minutes ago"
            />
          </View>
        </ScrollView>

        <StaffBottomNav active="dashboard" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },

  phoneContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 390,

    backgroundColor: '#F8FAFC',

    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 2,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },

  greetingSection: {
    minHeight: 128,

    paddingHorizontal: 17,
    paddingVertical: 17,

    marginBottom: 21,

    borderRadius: 18,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  welcomeText: {
    marginBottom: 3,

    fontSize: 9,
    fontWeight: '700',

    letterSpacing: 0.7,

    textTransform: 'uppercase',

    color: '#2563EB',
  },

  title: {
    fontSize: 24,
    fontWeight: '800',

    color: '#111827',
  },

  subtitle: {
    marginTop: 5,

    width: 225,

    fontSize: 10,
    lineHeight: 15,

    color: '#64748B',
  },

  greetingIcon: {
    width: 50,
    height: 50,

    borderRadius: 16,

    backgroundColor: '#EFF6FF',

    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader: {
    marginBottom: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',

    color: '#111827',
  },

  sectionSubtitle: {
    fontSize: 9,
    fontWeight: '600',

    color: '#94A3B8',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    justifyContent: 'space-between',

    rowGap: 14,
  },

  activityHeader: {
    marginTop: 29,
    marginBottom: 12,

    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  activityTitle: {
    fontSize: 18,
    fontWeight: '800',

    color: '#111827',
  },

  activitySubtitle: {
    marginTop: 2,

    fontSize: 9,

    color: '#94A3B8',
  },

  updatedContainer: {
    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: '#EFF6FF',

    flexDirection: 'row',
    alignItems: 'center',
  },

  smallDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    backgroundColor: '#2563EB',

    marginRight: 4,
  },

  updatedText: {
    fontSize: 8,
    fontWeight: '600',

    color: '#2563EB',
  },

  activityList: {
    gap: 9,
  },
});