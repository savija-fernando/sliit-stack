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

    if (item === 'profile') {
      router.push(
        '/staff-profile' as Href,
      );
    }
  };

  const items: {
    key: StaffNavItem;
    label: string;
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
            onPress={() =>
              navigate(item.key)
            }
            style={({ pressed }) => [
              styles.item,

              isActive &&
                styles.activeItem,

              pressed &&
                styles.pressedItem,
            ]}
          >
            <Text
              style={[
                styles.text,

                isActive &&
                  styles.activeText,
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

  text: {
    fontSize: 10,

    color: '#222222',
  },

  activeText: {
    fontWeight: '700',

    color: '#334E8A',
  },
});