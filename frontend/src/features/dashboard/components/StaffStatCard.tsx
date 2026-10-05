import { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  value: string;
  label: string;
  icon: ReactNode;
  onPress?: () => void;
};

export default function StaffStatCard({
  value,
  label,
  icon,
  onPress,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          {icon}
        </View>

        <Text style={styles.value}>
          {value}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Ionicons
          name="chevron-forward-circle"
          size={18}
          color="#345A9C"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    height: 112,

    paddingHorizontal: 13,
    paddingVertical: 14,

    borderRadius: 12,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,
    borderColor: '#E7ECF4',

    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  cardPressed: {
    opacity: 0.8,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  iconContainer: {
    width: 38,
    height: 38,

    borderRadius: 10,

    backgroundColor: '#EEF3FB',

    alignItems: 'center',
    justifyContent: 'center',
  },

  value: {
    fontSize: 25,
    fontWeight: '800',
    color: '#111111',
  },

  bottomRow: {
    flex: 1,

    flexDirection: 'row',

    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#222222',
  },
});