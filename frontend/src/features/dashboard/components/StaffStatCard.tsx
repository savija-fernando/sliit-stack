import { ReactNode } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type CardVariant =
  | 'blue'
  | 'green'
  | 'orange'
  | 'red';

type Props = {
  value: string;
  label: string;
  icon: ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
};

export default function StaffStatCard({
  value,
  label,
  icon,
  onPress,
  variant = 'blue',
}: Props) {
  const theme = getCardTheme(variant);

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor:
            theme.background,
          borderColor:
            theme.border,
        },

        pressed &&
          onPress &&
          styles.cardPressed,
      ]}
    >
      {/* Decorative accent */}
      <View
        style={[
          styles.accent,
          {
            backgroundColor:
              theme.accent,
          },
        ]}
      />

      {/* Top */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                theme.iconBackground,
            },
          ]}
        >
          {icon}
        </View>

        <Text
          style={[
            styles.value,
            {
              color:
                theme.valueColor,
            },
          ]}
        >
          {value}
        </Text>
      </View>

      {/* Bottom */}
      <View style={styles.bottomRow}>
        <Text
          style={[
            styles.label,
            {
              color:
                theme.labelColor,
            },
          ]}
        >
          {label}
        </Text>

        {onPress ? (
          <View
            style={[
              styles.arrowContainer,
              {
                backgroundColor:
                  theme.arrowBackground,
              },
            ]}
          >
            <Ionicons
              name="arrow-forward"
              size={14}
              color={theme.accent}
            />
          </View>
        ) : (
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  theme.accent,
              },
            ]}
          />
        )}
      </View>
    </Pressable>
  );
}

function getCardTheme(
  variant: CardVariant,
) {
  switch (variant) {
    case 'green':
      return {
        background: '#ECFDF5',
        border: '#D1FAE5',
        accent: '#059669',
        iconBackground: '#D1FAE5',
        arrowBackground: '#D1FAE5',
        valueColor: '#065F46',
        labelColor: '#047857',
      };

    case 'orange':
      return {
        background: '#FFF7ED',
        border: '#FED7AA',
        accent: '#EA580C',
        iconBackground: '#FFEDD5',
        arrowBackground: '#FFEDD5',
        valueColor: '#9A3412',
        labelColor: '#C2410C',
      };

    case 'red':
      return {
        background: '#FEF2F2',
        border: '#FECACA',
        accent: '#DC2626',
        iconBackground: '#FEE2E2',
        arrowBackground: '#FEE2E2',
        valueColor: '#991B1B',
        labelColor: '#B91C1C',
      };

    default:
      return {
        background: '#EFF6FF',
        border: '#DBEAFE',
        accent: '#2563EB',
        iconBackground: '#DBEAFE',
        arrowBackground: '#DBEAFE',
        valueColor: '#1E3A8A',
        labelColor: '#1D4ED8',
      };
  }
}

const styles = StyleSheet.create({
  card: {
    width: '47.5%',
    height: 118,

    paddingHorizontal: 14,
    paddingVertical: 14,

    borderRadius: 16,

    borderWidth: 1,

    overflow: 'hidden',

    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 7,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  cardPressed: {
    opacity: 0.88,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  accent: {
    position: 'absolute',

    top: 0,
    left: 0,

    width: 5,
    height: '100%',

    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 11,
  },

  iconContainer: {
    width: 40,
    height: 40,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',
  },

  value: {
    fontSize: 26,
    fontWeight: '800',
  },

  bottomRow: {
    flex: 1,

    marginTop: 8,

    flexDirection: 'row',

    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  label: {
    flex: 1,

    fontSize: 10,
    fontWeight: '700',
  },

  arrowContainer: {
    width: 27,
    height: 27,

    borderRadius: 14,

    alignItems: 'center',
    justifyContent: 'center',
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginBottom: 8,
  },
});