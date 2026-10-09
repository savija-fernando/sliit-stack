
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

  const navigate = (item: StaffNavItem) => {
    let route: Href;

    switch (item) {
      case 'dashboard':
        route = '/staff-dashboard';
        break;
      case 'queues':
        route = '/staff-queues?type=book';
        break;
      case 'monitoring':
        route = '/issue-monitoring';
        break;
      case 'profile':
        route = '/staff-profile';
        break;
    }

    router.replace(route);
  };

  const items: {
    key: StaffNavItem;
    label: string;
  }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'queues', label: 'Queues' },
    { key: 'monitoring', label: 'Monitoring' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = active === item.key;

        return (
          <Pressable
            key={item.key}
            onPress={() => {
              if (!isActive) navigate(item.key);
            }}
            style={({ pressed }) => [
              styles.item,
              isActive && styles.activeItem,
              pressed && styles.pressedItem,
            ]}
          >
            <Text
              style={[
                styles.text,
                isActive && styles.activeText,
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
