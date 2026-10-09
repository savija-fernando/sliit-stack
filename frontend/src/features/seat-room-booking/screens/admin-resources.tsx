import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import AppHeader from '@/components/AppHeader';
import {
  deleteAdminResource,
  getAdminResources,
  updateSeat,
  updateStudyRoom,
  type AdminResource,
  type AdminSeat,
  type AdminStudyRoom,
} from '../services/studyRoomAdminService';

type ResourceType = 'room' | 'seat';
type ResourceForm = {
  name: string;
  location: string;
  condition: string;
  description: string;
  availableFrom: string;
  availableUntil: string;
};

const EMPTY_FORM: ResourceForm = {
  name: '',
  location: '',
  condition: '',
  description: '',
  availableFrom: '',
  availableUntil: '',
};
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

function timeToMinutes(value: string): number {
  const [hours, minutes, seconds = 0] = value.split(':').map(Number);
  return hours * 60 + minutes + seconds / 60;
}

export default function AdminResourcesScreen() {
  const router = useRouter();
  const [resourceType, setResourceType] = useState<ResourceType>('room');
  const [rooms, setRooms] = useState<AdminStudyRoom[]>([]);
  const [seats, setSeats] = useState<AdminSeat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [editingResource, setEditingResource] = useState<AdminResource | null>(
    null,
  );
  const [form, setForm] = useState<ResourceForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: ResourceType;
    name: string;
  } | null>(null);

  const applyResources = useCallback(
    (result: { rooms: AdminStudyRoom[]; seats: AdminSeat[] }) => {
      setRooms(result.rooms);
      setSeats(result.seats);
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getAdminResources()
        .then((result) => {
          if (active) {
            applyResources(result);
            setError('');
          }
        })
        .catch((loadError: unknown) => {
          if (active) {
            setError(
              loadError instanceof Error
                ? loadError.message
                : 'Could not load admin resources.',
            );
          }
        })
        .finally(() => {
          if (active) setIsLoading(false);
        });

      return () => {
        active = false;
      };
    }, [applyResources]),
  );

  const refreshResources = async () => {
    setIsLoading(true);
    setError('');
    try {
      applyResources(await getAdminResources());
    } catch (loadError: unknown) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load admin resources.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resources: AdminResource[] = resourceType === 'room' ? rooms : seats;

  const startEditing = (resource: AdminResource) => {
    setEditingResource(resource);
    setForm({
      name: resource.name,
      location: 'location' in resource ? resource.location : '',
      condition: resource.condition,
      description: resource.description,
      availableFrom:
        'availableFrom' in resource ? resource.availableFrom ?? '' : '',
      availableUntil:
        'availableUntil' in resource ? resource.availableUntil ?? '' : '',
    });
    setDeleteTarget(null);
    setError('');
  };

  const cancelEditing = () => {
    setEditingResource(null);
    setForm(EMPTY_FORM);
    setError('');
  };

  const updateField = (field: keyof ResourceForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const saveEdit = async () => {
    if (!editingResource) return;
    if (!form.name.trim()) {
      setError(
        resourceType === 'room'
          ? 'Room name is required.'
          : 'Seat name is required.',
      );
      return;
    }
    if (resourceType === 'room' && !form.location.trim()) {
      setError('Room location is required.');
      return;
    }
    if (resourceType === 'seat' && !form.condition.trim()) {
      setError('Seat condition is required.');
      return;
    }

    const availableFrom = form.availableFrom.trim();
    const availableUntil = form.availableUntil.trim();
    if (
      resourceType === 'room' &&
      ((availableFrom && !TIME_PATTERN.test(availableFrom)) ||
        (availableUntil && !TIME_PATTERN.test(availableUntil)))
    ) {
      setError('Enter availability in 24-hour format, such as 08:30.');
      return;
    }
    if (
      resourceType === 'room' &&
      availableFrom &&
      availableUntil &&
      timeToMinutes(availableFrom) >= timeToMinutes(availableUntil)
    ) {
      setError('Available until must be later than available from.');
      return;
    }

    setBusyId(editingResource.id);
    setError('');
    try {
      if (resourceType === 'room') {
        await updateStudyRoom(editingResource.id, {
          name: form.name.trim(),
          location: form.location.trim(),
          condition: form.condition.trim(),
          description: form.description.trim(),
          availableFrom: availableFrom || null,
          availableUntil: availableUntil || null,
        });
      } else {
        await updateSeat(editingResource.id, {
          name: form.name.trim(),
          condition: form.condition.trim(),
          description: form.description.trim(),
        });
      }

      await refreshResources();
      cancelEditing();
    } catch (saveError: unknown) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Could not update the resource.',
      );
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    setError('');
    try {
      await deleteAdminResource(deleteTarget.type, deleteTarget.id);
      if (editingResource?.id === deleteTarget.id) cancelEditing();
      setDeleteTarget(null);
      await refreshResources();
    } catch (deleteError: unknown) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Could not delete the resource.',
      );
    } finally {
      setBusyId(null);
    }
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
            <Text style={styles.title}>Manage resources</Text>
            <Text style={styles.subtitle}>
              View, update, or remove study rooms and seats.
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/admin-seat-studyroom')}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add a resource</Text>
        </Pressable>

        <View style={styles.tabs}>
          <ResourceTab
            selected={resourceType === 'room'}
            label="Study rooms"
            count={rooms.length}
            icon="door-open"
            onPress={() => {
              setResourceType('room');
              setEditingResource(null);
              setDeleteTarget(null);
              setError('');
            }}
          />
          <ResourceTab
            selected={resourceType === 'seat'}
            label="Seats"
            count={seats.length}
            icon="seat-outline"
            onPress={() => {
              setResourceType('seat');
              setEditingResource(null);
              setDeleteTarget(null);
              setError('');
            }}
          />
        </View>

        {error ? (
          <View style={styles.errorBox} accessibilityRole="alert">
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color="#B91C1C"
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color="#2563EB" />
            <Text style={styles.stateText}>Loading resources…</Text>
          </View>
        ) : (
          <>
            {resources.length === 0 ? (
              <View style={styles.stateCard}>
                <MaterialCommunityIcons
                  name={resourceType === 'room' ? 'door-closed' : 'seat-outline'}
                  size={28}
                  color="#64748B"
                />
                <Text style={styles.stateTitle}>
                  No {resourceType === 'room' ? 'study rooms' : 'seats'} yet
                </Text>
                <Text style={styles.stateText}>
                  Add a {resourceType === 'room' ? 'study room' : 'seat'} to
                  manage it here.
                </Text>
              </View>
            ) : (
              resources.map((resource) => (
                <View key={`${resourceType}-${resource.id}`}>
                  <ResourceCard
                    resource={resource}
                    type={resourceType}
                    isBusy={busyId === resource.id}
                    isEditing={editingResource?.id === resource.id}
                    isConfirmingDelete={deleteTarget?.id === resource.id}
                    onEdit={() => startEditing(resource)}
                    onDelete={() =>
                      setDeleteTarget({
                        id: resource.id,
                        type: resourceType,
                        name: resource.name,
                      })
                    }
                    onCancelDelete={() => setDeleteTarget(null)}
                    onConfirmDelete={confirmDelete}
                  />
                  {editingResource?.id === resource.id && (
                    <View style={styles.editCard}>
                      <Text style={styles.editTitle}>
                        Edit {resourceType === 'room' ? 'study room' : 'seat'}
                      </Text>
                      <EditField
                        label={
                          resourceType === 'room'
                            ? 'Room name'
                            : 'Seat name or identifier'
                        }
                        value={form.name}
                        onChangeText={(value) => updateField('name', value)}
                      />
                      {resourceType === 'room' && (
                        <>
                          <EditField
                            label="Location"
                            value={form.location}
                            onChangeText={(value) =>
                              updateField('location', value)
                            }
                          />
                          <View style={styles.editRow}>
                            <View style={styles.editRowField}>
                              <EditField
                                label="Available from"
                                placeholder="HH:MM"
                                value={form.availableFrom}
                                onChangeText={(value) =>
                                  updateField('availableFrom', value)
                                }
                              />
                            </View>
                            <View style={styles.editRowField}>
                              <EditField
                                label="Available until"
                                placeholder="HH:MM"
                                value={form.availableUntil}
                                onChangeText={(value) =>
                                  updateField('availableUntil', value)
                                }
                              />
                            </View>
                          </View>
                        </>
                      )}
                      <EditField
                        label="Condition"
                        value={form.condition}
                        onChangeText={(value) =>
                          updateField('condition', value)
                        }
                      />
                      <EditField
                        label="Description"
                        value={form.description}
                        onChangeText={(value) =>
                          updateField('description', value)
                        }
                        multiline
                      />
                      <View style={styles.editActions}>
                        <SecondaryButton
                          label="Cancel"
                          onPress={cancelEditing}
                        />
                        <PrimaryButton
                          label={
                            busyId === resource.id ? 'Saving…' : 'Save changes'
                          }
                          disabled={busyId === resource.id}
                          onPress={saveEdit}
                        />
                      </View>
                    </View>
                  )}
                </View>
              ))
            )}
            <Pressable
              accessibilityRole="button"
              onPress={refreshResources}
              style={({ pressed }) => [
                styles.refreshButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={18}
                color="#2563EB"
              />
              <Text style={styles.refreshText}>Refresh list</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ResourceTab({
  selected,
  label,
  count,
  icon,
  onPress,
}: {
  selected: boolean;
  label: string;
  count: number;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.tab, selected && styles.tabSelected]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={19}
        color={selected ? '#1D4ED8' : '#64748B'}
      />
      <Text style={[styles.tabText, selected && styles.tabTextSelected]}>
        {label}
      </Text>
      <Text style={[styles.tabCount, selected && styles.tabCountSelected]}>
        {count}
      </Text>
    </Pressable>
  );
}

function ResourceCard({
  resource,
  type,
  isBusy,
  isEditing,
  isConfirmingDelete,
  onEdit,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  resource: AdminResource;
  type: ResourceType;
  isBusy: boolean;
  isEditing: boolean;
  isConfirmingDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  return (
    <View style={styles.resourceCard}>
      <View style={styles.resourceMain}>
        <View
          style={[
            styles.resourceIcon,
            type === 'seat' && styles.seatIcon,
          ]}
        >
          <MaterialCommunityIcons
            name={type === 'room' ? 'door-open' : 'seat-outline'}
            size={22}
            color={type === 'room' ? '#2563EB' : '#7C3AED'}
          />
        </View>
        <View style={styles.resourceDetails}>
          <Text style={styles.resourceName}>{resource.name}</Text>
          <Text style={styles.resourceMeta}>
            {'location' in resource
              ? resource.location || 'Location not specified'
              : `Condition: ${resource.condition || 'Not specified'}`}
          </Text>
          {'location' in resource && (
            <Text style={styles.resourceMeta}>
              {resource.availableFrom || resource.availableUntil
                ? `${resource.availableFrom ?? '—'}–${resource.availableUntil ?? '—'}`
                : 'Availability hours not set'}
            </Text>
          )}
          {resource.description ? (
            <Text style={styles.resourceDescription} numberOfLines={2}>
              {resource.description}
            </Text>
          ) : null}
        </View>
      </View>
      {isConfirmingDelete ? (
        <View style={styles.deleteConfirm}>
          <Text style={styles.deleteQuestion}>
            Delete “{resource.name}”? This cannot be undone.
          </Text>
          <View style={styles.actionRow}>
            <SecondaryButton label="Keep" onPress={onCancelDelete} />
            <Pressable
              accessibilityRole="button"
              disabled={isBusy}
              onPress={onConfirmDelete}
              style={({ pressed }) => [
                styles.deleteConfirmButton,
                pressed && styles.buttonPressed,
                isBusy && styles.disabledButton,
              ]}
            >
              {isBusy ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.deleteConfirmText}>Delete</Text>
              )}
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Edit ${resource.name}`}
            accessibilityState={{ disabled: isBusy || isEditing }}
            disabled={isBusy || isEditing}
            onPress={onEdit}
            style={({ pressed }) => [
              styles.cardAction,
              pressed && styles.buttonPressed,
              (isBusy || isEditing) && styles.disabledButton,
            ]}
          >
            <MaterialCommunityIcons name="pencil-outline" size={17} color="#2563EB" />
            <Text style={styles.editActionText}>Edit</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${resource.name}`}
            accessibilityState={{ disabled: isBusy }}
            disabled={isBusy}
            onPress={onDelete}
            style={({ pressed }) => [
              styles.cardAction,
              styles.deleteAction,
              pressed && styles.buttonPressed,
              isBusy && styles.disabledButton,
            ]}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={17}
              color="#B91C1C"
            />
            <Text style={styles.deleteActionText}>Delete</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function EditField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.editField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        autoCapitalize="sentences"
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor="#94A3B8"
        style={[styles.input, multiline && styles.multilineInput]}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        pressed && styles.buttonPressed,
        disabled && styles.disabledButton,
      ]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.secondaryButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heading: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 22 },
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
  headingText: { flex: 1, paddingTop: 2 },
  eyebrow: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: { marginTop: 5, color: '#0F172A', fontSize: 26, fontWeight: '800' },
  subtitle: { marginTop: 5, color: '#64748B', fontSize: 14, lineHeight: 20 },
  addButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  addButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  buttonPressed: { opacity: 0.82 },
  tabs: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tabSelected: { borderColor: '#93C5FD', backgroundColor: '#EFF6FF' },
  tabText: { color: '#475569', fontSize: 13, fontWeight: '600' },
  tabTextSelected: { color: '#1D4ED8' },
  tabCount: {
    overflow: 'hidden',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
  },
  tabCountSelected: { backgroundColor: '#DBEAFE', color: '#1D4ED8' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },
  errorText: { flex: 1, color: '#991B1B', fontSize: 13, lineHeight: 19 },
  stateCard: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  stateTitle: {
    marginTop: 12,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  stateText: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  resourceCard: {
    marginBottom: 12,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  resourceMain: { flexDirection: 'row', alignItems: 'flex-start' },
  resourceIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  seatIcon: { backgroundColor: '#F5F3FF' },
  resourceDetails: { flex: 1, marginLeft: 12, paddingTop: 2 },
  resourceName: { color: '#0F172A', fontSize: 15, fontWeight: '700' },
  resourceMeta: { marginTop: 4, color: '#64748B', fontSize: 12 },
  resourceDescription: {
    marginTop: 7,
    color: '#475569',
    fontSize: 13,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 9,
    marginTop: 14,
  },
  cardAction: {
    minWidth: 88,
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
  },
  editActionText: { color: '#1D4ED8', fontSize: 13, fontWeight: '700' },
  deleteAction: { backgroundColor: '#FEF2F2' },
  deleteActionText: { color: '#B91C1C', fontSize: 13, fontWeight: '700' },
  disabledButton: { opacity: 0.55 },
  deleteConfirm: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },
  deleteQuestion: { color: '#991B1B', fontSize: 13, lineHeight: 19 },
  deleteConfirmButton: {
    minWidth: 88,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#B91C1C',
  },
  deleteConfirmText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  editCard: {
    marginTop: -4,
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  editTitle: {
    marginBottom: 14,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  editField: { flex: 1, marginBottom: 13 },
  fieldLabel: {
    marginBottom: 6,
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    fontSize: 14,
  },
  multilineInput: { minHeight: 78, paddingTop: 10 },
  editRow: { flexDirection: 'row', gap: 10 },
  editRowField: { flex: 1 },
  editActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 9 },
  primaryButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  secondaryButton: {
    minWidth: 76,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: { color: '#475569', fontSize: 13, fontWeight: '700' },
  refreshButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 3,
    borderRadius: 10,
  },
  refreshText: { color: '#2563EB', fontSize: 13, fontWeight: '700' },
});
