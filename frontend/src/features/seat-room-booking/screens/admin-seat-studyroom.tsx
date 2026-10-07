import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';

type ResourceType = 'room' | 'seat';
type ResourceForm = {
  name: string;
  floor: string;
  location: string;
  capacity: string;
  amenities: string;
  description: string;
};

const EMPTY_FORM: ResourceForm = {
  name: '',
  floor: '',
  location: '',
  capacity: '',
  amenities: '',
  description: '',
};

export default function AdminSeatStudyRoomScreen() {
  const router = useRouter();
  const [resourceType, setResourceType] = useState<ResourceType>('room');
  const [form, setForm] = useState<ResourceForm>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const updateField = (field: keyof ResourceForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
    setNotice('');
  };

  const selectType = (type: ResourceType) => {
    setResourceType(type);
    setError('');
    setNotice('');
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.floor.trim() || !form.location.trim()) {
      setError('Please complete the name, floor, and location fields.');
      setNotice('');
      return;
    }

    if (
      resourceType === 'room' &&
      (!form.capacity.trim() ||
        !Number.isInteger(Number(form.capacity)) ||
        Number(form.capacity) < 1)
    ) {
      setError('Enter a valid room capacity of at least one person.');
      setNotice('');
      return;
    }

    setError('');
    setNotice(
      'Details are valid. Database saving is not connected yet, so nothing has been created.',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color="#1E293B"
            />
          </Pressable>
          <View style={styles.headingText}>
            <Text style={styles.eyebrow}>ADMIN · RESOURCE MANAGEMENT</Text>
            <Text style={styles.title}>Add a resource</Text>
            <Text style={styles.subtitle}>
              Create a study room or add an individual seat.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Resource type</Text>
          <View style={styles.typeSelector}>
            <TypeOption
              selected={resourceType === 'room'}
              label="Study room"
              description="A shared space"
              icon="door-open"
              onPress={() => selectType('room')}
            />
            <TypeOption
              selected={resourceType === 'seat'}
              label="Seat"
              description="An individual spot"
              icon="seat-outline"
              onPress={() => selectType('seat')}
            />
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            {resourceType === 'room' ? 'Room details' : 'Seat details'}
          </Text>
          <FormField
            label={resourceType === 'room' ? 'Room name' : 'Seat identifier'}
            placeholder={
              resourceType === 'room' ? 'e.g. Quiet Study Room' : 'e.g. A01'
            }
            value={form.name}
            onChangeText={(value) => updateField('name', value)}
            autoCapitalize="words"
          />
          <FormField
            label="Building or area"
            placeholder="e.g. Main Library"
            value={form.location}
            onChangeText={(value) => updateField('location', value)}
            autoCapitalize="words"
          />
          <View style={styles.row}>
            <View style={styles.rowField}>
              <FormField
                label="Floor"
                placeholder="e.g. 2nd floor"
                value={form.floor}
                onChangeText={(value) => updateField('floor', value)}
                autoCapitalize="words"
              />
            </View>
            {resourceType === 'room' && (
              <View style={styles.rowField}>
                <FormField
                  label="Capacity"
                  placeholder="e.g. 6"
                  value={form.capacity}
                  onChangeText={(value) => updateField('capacity', value)}
                  keyboardType="number-pad"
                />
              </View>
            )}
          </View>

          {resourceType === 'room' ? (
            <FormField
              label="Amenities"
              placeholder="e.g. Whiteboard, power outlets"
              value={form.amenities}
              onChangeText={(value) => updateField('amenities', value)}
              autoCapitalize="sentences"
            />
          ) : (
            <FormField
              label="Section or zone"
              placeholder="e.g. Window seats, Zone B"
              value={form.amenities}
              onChangeText={(value) => updateField('amenities', value)}
              autoCapitalize="words"
            />
          )}
          <FormField
            label="Description (optional)"
            placeholder={
              resourceType === 'room'
                ? 'Add any useful details about this room'
                : 'Add any useful details about this seat'
            }
            value={form.description}
            onChangeText={(value) => updateField('description', value)}
            multiline
            autoCapitalize="sentences"
          />

          {error ? (
            <View style={styles.feedbackError} accessibilityRole="alert">
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={19}
                color="#B91C1C"
              />
              <Text style={styles.feedbackErrorText}>{error}</Text>
            </View>
          ) : null}
          {notice ? (
            <View style={styles.feedbackNotice} accessibilityRole="alert">
              <MaterialCommunityIcons
                name="information-outline"
                size={19}
                color="#1D4ED8"
              />
              <Text style={styles.feedbackNoticeText}>{notice}</Text>
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.submitButtonText}>Review details</Text>
          </Pressable>
          <Text style={styles.footerNote}>
            Required fields are marked with an asterisk (*).
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TypeOption({
  selected,
  label,
  description,
  icon,
  onPress,
}: {
  selected: boolean;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.typeOption,
        selected && styles.typeOptionSelected,
        pressed && styles.typeOptionPressed,
      ]}
    >
      <View
        style={[styles.typeIcon, selected && styles.typeIconSelected]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={selected ? '#2563EB' : '#64748B'}
        />
      </View>
      <View style={styles.typeOptionText}>
        <Text style={[styles.typeLabel, selected && styles.typeLabelSelected]}>
          {label}
        </Text>
        <Text style={styles.typeDescription}>{description}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
        {!label.includes('optional') ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        style={[styles.input, multiline && styles.multilineInput]}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headingText: {
    flex: 1,
    paddingTop: 2,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    marginTop: 5,
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 5,
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },
  formCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 14,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  typeSelector: {
    gap: 10,
  },
  typeOption: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  typeOptionSelected: {
    borderColor: '#93C5FD',
    backgroundColor: '#EFF6FF',
  },
  typeOptionPressed: {
    opacity: 0.85,
  },
  typeIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  typeIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  typeOptionText: {
    flex: 1,
    marginLeft: 12,
  },
  typeLabel: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  typeLabelSelected: {
    color: '#1D4ED8',
  },
  typeDescription: {
    marginTop: 3,
    color: '#64748B',
    fontSize: 12,
  },
  radio: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  radioSelected: {
    borderColor: '#2563EB',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  divider: {
    height: 1,
    marginVertical: 22,
    backgroundColor: '#E2E8F0',
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 7,
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  required: {
    color: '#DC2626',
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 13,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    fontSize: 14,
  },
  multilineInput: {
    minHeight: 92,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
  },
  feedbackError: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
    padding: 12,
    borderRadius: 11,
    backgroundColor: '#FEF2F2',
  },
  feedbackErrorText: {
    flex: 1,
    color: '#991B1B',
    fontSize: 13,
    lineHeight: 19,
  },
  feedbackNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
    padding: 12,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
  },
  feedbackNoticeText: {
    flex: 1,
    color: '#1E40AF',
    fontSize: 13,
    lineHeight: 19,
  },
  submitButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  submitButtonPressed: {
    opacity: 0.86,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footerNote: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 12,
  },
});