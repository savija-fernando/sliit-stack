import { supabase } from '@/lib/supabase';

export type NewStudyRoom = {
  name: string;
  location: string;
  description: string;
  condition: string;
  availableFrom: string | null;
  availableUntil: string | null;
};

export type NewSeat = {
  name: string;
  condition: string;
  description: string;
};

export type AdminStudyRoom = NewStudyRoom & {
  id: string;
};

export type AdminSeat = NewSeat & {
  id: string;
};

export type AdminResource = AdminStudyRoom | AdminSeat;

function mapResourceRow(row: Record<string, unknown>): AdminResource {
  const { id, name } = row;
  if (
    (typeof id !== 'string' && typeof id !== 'number') ||
    typeof name !== 'string' ||
    !name.trim()
  ) {
    throw new Error('A resource row is missing its id or name.');
  }

  const description =
    typeof row.description === 'string' ? row.description : '';
  const condition = typeof row.condition === 'string' ? row.condition : '';

  if ('location' in row || 'available_from' in row || 'available_until' in row) {
    return {
      id: String(id),
      name,
      location: typeof row.location === 'string' ? row.location : '',
      description,
      condition,
      availableFrom:
        typeof row.available_from === 'string' ? row.available_from : null,
      availableUntil:
        typeof row.available_until === 'string' ? row.available_until : null,
    };
  }

  return { id: String(id), name, condition, description };
}

export async function getAdminResources(): Promise<{
  rooms: AdminStudyRoom[];
  seats: AdminSeat[];
}> {
  const [roomsResult, seatsResult] = await Promise.all([
    supabase.from('studyrooms').select('*').order('created_at', { ascending: false }),
    supabase.from('seats').select('*').order('created_at', { ascending: false }),
  ]);

  if (roomsResult.error) {
    throw new Error(`Could not load study rooms: ${roomsResult.error.message}`);
  }
  if (seatsResult.error) {
    throw new Error(`Could not load seats: ${seatsResult.error.message}`);
  }

  const rooms = (roomsResult.data ?? []).map((row) =>
    mapResourceRow(row as Record<string, unknown>),
  );
  const seats = (seatsResult.data ?? []).map((row) =>
    mapResourceRow(row as Record<string, unknown>),
  );

  return {
    rooms: rooms.filter((resource): resource is AdminStudyRoom => 'location' in resource),
    seats: seats.filter((resource): resource is AdminSeat => !('location' in resource)),
  };
}

export async function addStudyRoom(room: NewStudyRoom): Promise<void> {
  const { error } = await supabase.from('studyrooms').insert({
    name: room.name,
    location: room.location,
    description: room.description,
    condition: room.condition || null,
    available_from: room.availableFrom,
    available_until: room.availableUntil,
  });

  if (error) {
    throw new Error(`Could not add study room: ${error.message}`);
  }
}

export async function addSeat(seat: NewSeat): Promise<void> {
  const { error } = await supabase.from('seats').insert({
    name: seat.name,
    condition: seat.condition || null,
    description: seat.description || null,
  });

  if (error) {
    throw new Error(`Could not add seat: ${error.message}`);
  }
}

export async function updateStudyRoom(
  id: string,
  room: NewStudyRoom,
): Promise<void> {
  const { data, error } = await supabase
    .from('studyrooms')
    .update({
      name: room.name,
      location: room.location,
      description: room.description,
      condition: room.condition || null,
      available_from: room.availableFrom,
      available_until: room.availableUntil,
    })
    .eq('id', id)
    .select('id');

  if (error) {
    throw new Error(`Could not update study room: ${error.message}`);
  }
  if (!data?.length) {
    throw new Error('Study room was not found or cannot be updated.');
  }
}

export async function updateSeat(id: string, seat: NewSeat): Promise<void> {
  const { data, error } = await supabase
    .from('seats')
    .update({
      name: seat.name,
      condition: seat.condition || null,
      description: seat.description || null,
    })
    .eq('id', id)
    .select('id');

  if (error) {
    throw new Error(`Could not update seat: ${error.message}`);
  }
  if (!data?.length) {
    throw new Error('Seat was not found or cannot be updated.');
  }
}

export async function deleteAdminResource(
  type: 'room' | 'seat',
  id: string,
): Promise<void> {
  const result =
    type === 'room'
      ? await supabase.from('studyrooms').delete().eq('id', id).select('id')
      : await supabase.from('seats').delete().eq('id', id).select('id');

  if (result.error) {
    throw new Error(
      `Could not delete ${type === 'room' ? 'study room' : 'seat'}: ${result.error.message}`,
    );
  }
  if (!result.data?.length) {
    throw new Error(
      `${type === 'room' ? 'Study room' : 'Seat'} was not found or cannot be deleted.`,
    );
  }
}
