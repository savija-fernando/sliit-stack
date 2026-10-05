import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { ReservationStatus } from '../../../types/reservation';

type Props = {
  activeStatus: ReservationStatus;
  onChange: (status: ReservationStatus) => void;
};

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

export default function ReservationStatusTabs({
  activeStatus,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active =
          tab.value === activeStatus;

        return (
          <Pressable
            key={tab.value}
            onPress={() =>
              onChange(tab.value)
            }
            style={[
              styles.tab,
              active && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.text,
                active && styles.activeText,
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
    gap: 10,
    marginTop: 14,
  },

  tab: {
    flex: 1,
    height: 38,

    borderRadius: 6,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#E8E8E8',
  },

  activeTab: {
    backgroundColor: '#08245B',
  },

  text: {
    fontSize: 11,
    color: '#666666',
  },

  activeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});