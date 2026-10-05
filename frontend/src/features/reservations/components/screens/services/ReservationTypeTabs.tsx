import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  ReservationKind,
} from '../../../types/reservation';

type Props = {
  activeType: ReservationKind;
  onChange: (
    type: ReservationKind,
  ) => void;
};

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

export default function ReservationTypeTabs({
  activeType,
  onChange,
}: Props) {
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
    marginTop: 14,

    marginHorizontal: 15,

    padding: 4,

    borderRadius: 8,

    backgroundColor: '#E5E7EB',

    flexDirection: 'row',
  },

  tab: {
    flex: 1,

    minHeight: 38,

    borderRadius: 6,

    alignItems: 'center',
    justifyContent: 'center',
  },

  activeTab: {
    backgroundColor: '#08245B',
  },

  tabText: {
    fontSize: 12,
    fontWeight: '700',

    color: '#6B7280',
  },

  activeTabText: {
    color: '#FFFFFF',
  },
});