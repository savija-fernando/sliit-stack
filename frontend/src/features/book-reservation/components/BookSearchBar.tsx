import { StyleSheet, TextInput, View } from 'react-native';

type BookSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function BookSearchBar({
  value,
  onChangeText,
}: BookSearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Title, author or keyword"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  input: {
    height: 42,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 12,
    color: '#111827',
  },
});