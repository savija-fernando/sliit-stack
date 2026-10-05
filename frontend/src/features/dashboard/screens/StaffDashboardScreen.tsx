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

import AppHeader from '@/components/AppHeader';

import StaffActivityRow from '../components/StaffActivityRow';
import StaffStatCard from '../components/StaffStatCard';

export default function StaffDashboardScreen() {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        {/* Header */}
        <AppHeader
          rightAction="profile"
        />

        {/* Main dashboard */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting */}
          <View style={styles.greetingSection}>
            <Text style={styles.title}>
              Hello, Staff!
            </Text>

            <Text style={styles.subtitle}>
              Manage reservations and keep the campus
              running smoothly
            </Text>
          </View>

          {/* Statistics */}
          <View style={styles.statsGrid}>
            <StaffStatCard
              value="12"
              label="Book Requests"
              icon={
                <Ionicons
                  name="book"
                  size={27}
                  color="#1F3E72"
                />
              }
            />

            <StaffStatCard
              value="09"
              label="Seat Requests"
              icon={
                <MaterialCommunityIcons
                  name="seat"
                  size={29}
                  color="#1F3E72"
                />
              }
            />

            <StaffStatCard
              value="26"
              label="Expired Today"
              icon={
                <Ionicons
                  name="time"
                  size={29}
                  color="#1F3E72"
                />
              }
            />

            <StaffStatCard
              value="04"
              label="Open Issues"
              icon={
                <Ionicons
                  name="warning"
                  size={29}
                  color="#1F3E72"
                />
              }
            />
          </View>

          {/* Recent activity heading */}
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>
              Recent Activity
            </Text>

            <View style={styles.updatedContainer}>
              <View style={styles.smallDot} />

              <Text style={styles.updatedText}>
                Updated a minute ago
              </Text>
            </View>
          </View>

          {/* Recent activity list */}
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

        {/* Bottom navigation */}
        <View style={styles.bottomNav}>
          <View style={styles.activeNavItem}>
            <Text style={styles.activeNavText}>
              Dashboard
            </Text>
          </View>

          <View style={styles.navItem}>
            <Text style={styles.navText}>
              Queues
            </Text>
          </View>

          <View style={styles.navItem}>
            <Text style={styles.navText}>
              Monitoring
            </Text>
          </View>

          <View style={styles.navItem}>
            <Text style={styles.navText}>
              Profile
            </Text>
          </View>
        </View>
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

    backgroundColor: '#F6F8FC',

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
    paddingHorizontal: 16,
    paddingVertical: 15,

    marginBottom: 18,

    borderRadius: 14,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#EDF1F6',

    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 1,
  },

  title: {
    fontSize: 24,

    fontWeight: '800',

    color: '#111827',
  },

  subtitle: {
    marginTop: 4,

    width: 245,

    fontSize: 11,
    lineHeight: 16,

    color: '#777777',
  },

  statsGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    rowGap: 14,
  },

  activityHeader: {
    marginTop: 27,
    marginBottom: 11,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',
  },

  activityTitle: {
    fontSize: 18,

    fontWeight: '800',

    color: '#111827',
  },

  updatedContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  smallDot: {
    width: 4,
    height: 4,

    borderRadius: 2,

    backgroundColor: '#345A9C',

    marginRight: 4,
  },

  updatedText: {
    fontSize: 8,

    color: '#888888',
  },

  activityList: {
    gap: 9,
  },

  bottomNav: {
    minHeight: 60,

    paddingHorizontal: 7,
    paddingVertical: 7,

    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',

    alignItems: 'center',
  },

  navItem: {
    flex: 1,

    alignItems: 'center',

    paddingVertical: 9,
  },

  activeNavItem: {
    flex: 1,

    alignItems: 'center',

    paddingVertical: 9,

    marginHorizontal: 3,

    borderRadius: 18,

    backgroundColor: '#DCE7FA',
  },

  navText: {
    fontSize: 10,

    color: '#374151',
  },

  activeNavText: {
    fontSize: 10,

    fontWeight: '700',

    color: '#334E8A',
  },
});