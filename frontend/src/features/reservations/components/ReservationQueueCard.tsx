import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import type {
  ReservationQueueItem,
  ReservationStatus,
} from '@/features/reservations/types/reservation';

type Props = {
  reservation: ReservationQueueItem;
  onPress?: () => void;
};

export default function ReservationQueueCard({
  reservation,
  onPress,
}: Props) {
  const statusStyle =
    getStatusStyle(
      reservation.status,
    );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,

        pressed &&
          styles.cardPressed,
      ]}
      onPress={onPress}
    >
      {/* Book / Seat icon */}
      <View style={styles.iconContainer}>
        {reservation.kind ===
        'book' ? (
          <Ionicons
            name="book"
            size={25}
            color="#1F3E72"
          />
        ) : (
          <MaterialCommunityIcons
            name="seat"
            size={27}
            color="#1F3E72"
          />
        )}
      </View>

      {/* Reservation details */}
      <View style={styles.content}>
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {reservation.title}
        </Text>

        <Text style={styles.detailText}>
          {reservation.studentId}
        </Text>

        <Text style={styles.detailText}>
          {reservation.studentName}
        </Text>

        <Text style={styles.dateText}>
          {reservation.dateText}
        </Text>
      </View>

      {/* Right side */}
      <View style={styles.rightSection}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                statusStyle.backgroundColor,
            },
          ]}
        >
          <Text
            style={styles.statusText}
          >
            {statusStyle.label}
          </Text>
        </View>

        <View style={styles.arrowButton}>
          <Ionicons
            name="chevron-forward"
            size={17}
            color="#345A9C"
          />
        </View>
      </View>
    </Pressable>
  );
}

function getStatusStyle(
  status: ReservationStatus,
) {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        backgroundColor:
          '#16A34A',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        backgroundColor:
          '#DC2626',
      };

    case 'returned':
      return {
        label: 'Returned',
        backgroundColor:
          '#2563EB',
      };

    case 'expired':
      return {
        label: 'Expired',
        backgroundColor:
          '#7C3AED',
      };

    default:
      return {
        label: 'Pending',
        backgroundColor:
          '#F59E0B',
      };
  }
}

const styles = StyleSheet.create({
  card: {
    minHeight: 105,

    padding: 12,

    borderRadius: 10,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E1E7EF',

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 4,

    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 1,
  },

  cardPressed: {
    opacity: 0.85,
  },

  iconContainer: {
    width: 45,
    height: 52,

    borderRadius: 7,

    backgroundColor: '#EEF3FB',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 11,
  },

  content: {
    flex: 1,

    paddingRight: 6,
  },

  title: {
    fontSize: 13,
    fontWeight: '800',

    color: '#111827',

    marginBottom: 5,
  },

  detailText: {
    fontSize: 9,

    color: '#6B7280',

    marginTop: 1,
  },

  dateText: {
    marginTop: 5,

    fontSize: 9,
    fontWeight: '600',

    color: '#4B5563',
  },

  rightSection: {
    minWidth: 72,

    alignItems: 'flex-end',
    justifyContent:
      'space-between',

    alignSelf: 'stretch',
  },

  statusBadge: {
    minWidth: 67,

    paddingHorizontal: 8,
    paddingVertical: 4,

    borderRadius: 5,

    alignItems: 'center',
    justifyContent: 'center',
  },

  statusText: {
    fontSize: 8,
    fontWeight: '700',

    color: '#FFFFFF',
  },

  arrowButton: {
    width: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: '#EEF3FB',

    alignItems: 'center',
    justifyContent: 'center',
  },
});