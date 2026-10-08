import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useRouter,
  type Href,
} from 'expo-router';

type StaffNavItem =
  | 'dashboard'
  | 'queues'
  | 'monitoring'
  | 'profile';

type Props = {
  active: StaffNavItem;
};

export default function StaffBottomNav({
  active,
}: Props) {
  const router = useRouter();

  const navigate = (
    item: StaffNavItem,
  ) => {
    if (item === 'dashboard') {
      router.push(
        '/staff-dashboard' as Href,
      );

      return;
    }

    if (item === 'queues') {
      router.push(
        '/staff-queues?type=book' as Href,
      );

      return;
    }

    if (item === 'monitoring') {
      router.push(
        '/issue-monitoring' as Href,
      );

      return;
    }

    // Profile will be connected
    // when the staff profile screen exists.
  };

  const items: {
    key: StaffNavItem;
    label: string;
    disabled?: boolean;
  }[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
    },
    {
      key: 'queues',
      label: 'Queues',
    },
    {
      key: 'monitoring',
      label: 'Monitoring',
    },
    {
      key: 'profile',
      label: 'Profile',
      disabled: true,
    },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive =
          active === item.key;

        return (
          <Pressable
            key={item.key}
            disabled={item.disabled}
            onPress={() =>
              navigate(item.key)
            }
            style={({ pressed }) => [
              styles.item,

              isActive &&
                styles.activeItem,

              item.disabled &&
                styles.disabledItem,

              pressed &&
                !item.disabled &&
                styles.pressedItem,
            ]}
          >
            <Text
              style={[
                styles.text,

                isActive &&
                  styles.activeText,

                item.disabled &&
                  styles.disabledText,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,

    paddingHorizontal: 7,
    paddingVertical: 7,

    backgroundColor: '#FFFFFF',

    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',

    flexDirection: 'row',
    alignItems: 'center',
  },

  item: {
    flex: 1,

    alignItems: 'center',

    paddingVertical: 9,

    borderRadius: 18,

    marginHorizontal: 3,
  },

  activeItem: {
    backgroundColor: '#C8D6F0',
  },

  pressedItem: {
    opacity: 0.75,
  },

  disabledItem: {
    opacity: 0.45,
  },

  text: {
    fontSize: 10,

    color: '#222222',
  },

  activeText: {
    fontWeight: '700',

    color: '#334E8A',
  },

  disabledText: {
    color: '#94A3B8',
  },
});