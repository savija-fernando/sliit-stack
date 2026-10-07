import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  ReservationKind,
  ReservationStatus,
} from '../../../types/reservation';

type Props = {
  activeStatus: ReservationStatus;
  reservationKind: ReservationKind;
  onChange: (
    status: ReservationStatus,
  ) => void;
};

export default function ReservationStatusTabs({
  activeStatus,
  reservationKind,
  onChange,
}: Props) {
  const tabs: {
    label: string;
    value: ReservationStatus;
  }[] = [
    {
      label: 'Pending',
      value: 'pending',
    },
    {
      label: 'Approved',
      value: 'approved',
    },
    {
      label: 'Rejected',
      value: 'rejected',
    },
  ];

  if (reservationKind === 'book') {
    tabs.push({
      label: 'Returned',
      value: 'returned',
    });
  }

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive =
          activeStatus === tab.value;

        return (
          <Pressable
            key={tab.value}
            style={[
              styles.tab,
              isActive &&
                styles.activeTab,
            ]}
            onPress={() =>
              onChange(tab.value)
            }
          >
            <Text
              style={[
                styles.tabText,
                isActive &&
                  styles.activeTabText,
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,

    flexDirection: 'row',

    borderRadius: 7,

    backgroundColor: '#E5E7EB',

    padding: 3,
  },

  tab: {
    flex: 1,

    minHeight: 35,

    borderRadius: 5,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 2,
  },

  activeTab: {
    backgroundColor: '#08245B',
  },

  tabText: {
    fontSize: 10,
    fontWeight: '600',

    color: '#6B7280',

    textAlign: 'center',
  },

  activeTabText: {
    fontWeight: '700',

    color: '#FFFFFF',
  },
});