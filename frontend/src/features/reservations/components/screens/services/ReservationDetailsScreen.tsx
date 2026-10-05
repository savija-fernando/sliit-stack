import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import {
  useLocalSearchParams,
  useRouter,
  type Href,
} from 'expo-router';

import AppHeader from '@/components/AppHeader';
import StaffBottomNav from '@/features/dashboard/components/StaffBottomNav';

const reservationDetails = {
  id: 'B123S45091',
  title: 'Introduction to Programming',
  author: 'J.H Bernard',
  published: '21st June 2016',
  studentId: 'IT23539068',
  studentName: 'W.A.D.S Wijesinghe',
  reservedOn: '12th September 2026 - 11.16am',
  pickupDate: '13th September 2026',
  dueDate: '20th September 2026',
  status: 'Pending',
};

export default function ReservationDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const reservationId =
    typeof params.id === 'string'
      ? params.id
      : reservationDetails.id;

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneContainer}>
        <AppHeader rightAction="profile" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleRow}>
            <Pressable
              onPress={() =>
                router.replace('/staff-queues' as Href)
              }
            >
              <Ionicons
                name="arrow-back-circle"
                size={30}
                color="#111111"
              />
            </Pressable>

            <Text style={styles.pageTitle}>
              Reservation Details
            </Text>
          </View>

          <View style={styles.bookCard}>
            <View style={styles.bookIcon}>
              <Ionicons
                name="book"
                size={32}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>
                {reservationDetails.title}
              </Text>

              <Text style={styles.bookMeta}>
                By {reservationDetails.author}
              </Text>

              <Text style={styles.bookMeta}>
                Published on {reservationDetails.published}
              </Text>

              <View style={styles.availableBadge}>
                <Text style={styles.availableText}>
                  Available
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <InfoRow
              label="Reservation ID"
              value={reservationId}
            />

            <InfoRow
              label="Student ID"
              value={reservationDetails.studentId}
            />

            <InfoRow
              label="Student Name"
              value={reservationDetails.studentName}
            />

            <InfoRow
              label="Reserved On"
              value={reservationDetails.reservedOn}
            />

            <InfoRow
              label="Pick-up Date"
              value={reservationDetails.pickupDate}
            />

            <InfoRow
              label="Due Date"
              value={reservationDetails.dueDate}
            />

            <View style={styles.statusRow}>
              <Text style={styles.infoLabel}>
                Reservation Status
              </Text>

              <View style={styles.pendingBadge}>
                <Text style={styles.pendingText}>
                  {reservationDetails.status}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={styles.updateButton}
            onPress={() =>
              router.push(
                `/update-reservation?id=${reservationId}` as Href,
              )
            }
          >
            <Text style={styles.updateButtonText}>
              Update Reservation
            </Text>
          </Pressable>
        </ScrollView>

        <StaffBottomNav active="queues" />
      </View>
    </SafeAreaView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
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
    backgroundColor: '#F7F9FC',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 25,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },

  pageTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111111',
  },

  bookCard: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  bookIcon: {
    width: 46,
    height: 54,
    borderRadius: 6,
    backgroundColor: '#111827',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 12,
  },

  bookInfo: {
    flex: 1,
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },

  bookMeta: {
    marginTop: 3,
    fontSize: 10,
    color: '#555555',
  },

  availableBadge: {
    marginTop: 7,
    alignSelf: 'flex-start',

    paddingHorizontal: 10,
    paddingVertical: 3,

    borderRadius: 4,
    backgroundColor: '#16A34A',
  },

  availableText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  detailsCard: {
    marginTop: 18,
    gap: 9,
  },

  infoRow: {
    minHeight: 52,

    paddingHorizontal: 13,
    paddingVertical: 12,

    borderRadius: 8,
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333333',
  },

  infoValue: {
    maxWidth: '60%',
    fontSize: 10,
    color: '#555555',
    textAlign: 'right',
  },

  statusRow: {
    minHeight: 52,

    paddingHorizontal: 13,
    paddingVertical: 12,

    borderRadius: 8,
    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E5E7EB',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pendingBadge: {
    minWidth: 72,

    paddingHorizontal: 10,
    paddingVertical: 5,

    borderRadius: 5,
    backgroundColor: '#F5A400',

    alignItems: 'center',
  },

  pendingText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  updateButton: {
    height: 46,
    marginTop: 18,

    borderRadius: 8,
    backgroundColor: '#08245B',

    alignItems: 'center',
    justifyContent: 'center',
  },

  updateButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});