import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  title: string;
  time: string;
};

export default function StaffActivityRow({
  title,
  time,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.dot} />

        <Text style={styles.title}>
          {title}
        </Text>
      </View>

      <Text style={styles.time}>
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,

    paddingHorizontal: 12,
    paddingVertical: 10,

    borderWidth: 1,
    borderColor: '#E1E7EF',

    borderRadius: 10,

    backgroundColor: '#FFFFFF',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },

    elevation: 1,
  },

  leftSection: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 9,
    height: 9,

    borderRadius: 5,

    backgroundColor: '#345A9C',

    marginRight: 10,
  },

  title: {
    flexShrink: 1,

    fontSize: 13,
    fontWeight: '600',

    color: '#222222',
  },

  time: {
    marginLeft: 10,

    fontSize: 9,

    color: '#777777',
  },
});