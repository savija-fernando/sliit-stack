import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  ReservationKind,
} from '@/features/reservations/types/reservation';

type Props = {
  activeType: ReservationKind;
  onChange: (
    type: ReservationKind,
  ) => void;
};

export default function ReservationTypeTabs({
  activeType,
  onChange,
}: Props) {
  const tabs: {
    label: string;
    value: ReservationKind;
  }[] = [
    {
      label: 'Books',
      value: 'book',
    },
    {
      label: 'Seats',
      value: 'seat',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive =
          activeType === tab.value;

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
    flexDirection: 'row',

    marginTop: 14,

    padding: 3,

    borderRadius: 7,

    backgroundColor: '#E5E7EB',
  },

  tab: {
    flex: 1,

    minHeight: 36,

    borderRadius: 5,

    alignItems: 'center',
    justifyContent: 'center',
  },

  activeTab: {
    backgroundColor: '#08245B',
  },

  tabText: {
    fontSize: 11,
    fontWeight: '600',

    color: '#6B7280',
  },

  activeTabText: {
    fontWeight: '700',

    color: '#FFFFFF',
  },
});