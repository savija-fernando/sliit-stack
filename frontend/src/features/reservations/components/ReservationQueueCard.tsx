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
} from '../types/reservation';

type Props = {
  reservation: ReservationQueueItem;
  onPress?: () => void;
};

function getStatusStyle(
  status: ReservationStatus,
) {
  if (status === 'approved') {
    return {
      backgroundColor: '#16A34A',
      text: 'Approved',
    };
  }

  if (status === 'rejected') {
    return {
      backgroundColor: '#DC2626',
      text: 'Rejected',
    };
  }

  return {
    backgroundColor: '#F5A400',
    text: 'Pending',
  };
}

export default function ReservationQueueCard({
  reservation,
  onPress,
}: Props) {
  const status =
    getStatusStyle(reservation.status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        {reservation.kind === 'book' ? (
          <Ionicons
            name="book"
            size={29}
            color="#111111"
          />
        ) : (
          <MaterialCommunityIcons
            name="seat"
            size={31}
            color="#111111"
          />
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {reservation.title}
        </Text>

        <Text style={styles.student}>
          {reservation.studentId}{' '}
          {reservation.studentName}
        </Text>

        <Text style={styles.date}>
          {reservation.dateText}
        </Text>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                status.backgroundColor,
            },
          ]}
        >
          <Text style={styles.statusText}>
            {status.text}
          </Text>
        </View>
      </View>

      <Ionicons
        name="arrow-forward-circle"
        size={24}
        color="#111111"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 104,

    paddingHorizontal: 13,
    paddingVertical: 12,

    backgroundColor: '#FFFFFF',

    borderRadius: 8,

    borderWidth: 1,
    borderColor: '#E4E7EC',

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  pressed: {
    opacity: 0.8,
  },

  iconContainer: {
    width: 43,
    height: 50,

    marginRight: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222222',
  },

  student: {
    marginTop: 3,

    fontSize: 9,
    color: '#555555',
  },

  date: {
    marginTop: 2,

    fontSize: 9,
    color: '#777777',
  },

  statusBadge: {
    marginTop: 5,

    alignSelf: 'flex-start',

    minWidth: 54,

    paddingHorizontal: 7,
    paddingVertical: 3,

    borderRadius: 5,

    alignItems: 'center',
  },

  statusText: {
    fontSize: 8,

    fontWeight: '700',

    color: '#FFFFFF',
  },
});