import { supabase } from '@/lib/supabase';

export type StudyRoom = {
  id: string;
  name: string;
  location: string;
  condition: string;
  description: string;
};

type DatabaseRow = Record<string, unknown>;

function toMinutes(value: unknown): number | null {
  if (typeof value !== 'string') return null;

  const match = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function parseRequestedTime(time: string, duration: string) {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  const hours = match ? Number(match[1]) : NaN;
  const minutes = match ? Number(match[2]) : NaN;
  const period = match?.[3].toUpperCase();
  const durationMatch = duration.trim().match(/^(\d+)\s*hours?$/i);

  if (
    !match ||
    !period ||
    hours < 1 ||
    hours > 12 ||
    minutes > 59 ||
    !durationMatch
  ) {
    throw new Error('The selected booking time or duration is invalid.');
  }

  const start =
    ((hours % 12) + (period === 'PM' ? 12 : 0)) * 60 + minutes;
  const end = start + Number(durationMatch[1]) * 60;

  if (end > 24 * 60) {
    throw new Error('The selected booking ends after midnight.');
  }

  return { start, end };
}

function getRoomString(
  room: DatabaseRow,
  keys: string[],
  fallback: string,
): string {
  for (const key of keys) {
    const value = room[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  return fallback;
}

function mapRoom(room: DatabaseRow): StudyRoom {
  const id = room.id;
  const name = getRoomString(room, ['name', 'room_name'], '');

  if ((typeof id !== 'string' && typeof id !== 'number') || !name) {
    throw new Error(
      'A row in studyrooms is missing its id or name column.',
    );
  }

  return {
    id: String(id),
    name,
    location: getRoomString(room, ['location', 'floor'], 'Study area'),
    condition: getRoomString(room, ['condition', 'amenities'], 'Study room'),
    description: getRoomString(
      room,
      ['description'],
      'A space for focused study.',
    ),
  };
}

function isWithinAvailability(
  room: DatabaseRow,
  requested: { start: number; end: number },
): boolean {
  const availableFrom = room.available_from;
  const availableUntil = room.available_until;
  const start =
    availableFrom == null ? null : toMinutes(availableFrom);
  const end =
    availableUntil == null ? null : toMinutes(availableUntil);

  if (availableFrom != null && start === null) {
    throw new Error('A studyrooms row has an invalid available_from time.');
  }
  if (availableUntil != null && end === null) {
    throw new Error('A studyrooms row has an invalid available_until time.');
  }

  return (
    (start === null || requested.start >= start) &&
    (end === null || requested.end <= end)
  );
}

export async function getAvailableStudyRooms({
  date,
  time,
  duration,
}: {
  date: string;
  time: string;
  duration: string;
}): Promise<StudyRoom[]> {
  const requested = parseRequestedTime(time, duration);

  const [roomsResult, bookingsResult] = await Promise.all([
    supabase.from('studyrooms').select('*'),
    supabase
      .from('studyroombookings')
      .select('*')
      .eq('Date', date)
      .eq('status', 'active'),
  ]);

  if (roomsResult.error) {
    throw new Error(`Could not load study rooms: ${roomsResult.error.message}`);
  }
  if (bookingsResult.error) {
    throw new Error(
      `Could not check room bookings: ${bookingsResult.error.message}`,
    );
  }

  const rooms = (roomsResult.data ?? [])
    .map((row) => row as DatabaseRow)
    .filter((room) => room.is_active !== false)
    .filter((room) => isWithinAvailability(room, requested))
    .map(mapRoom);
  const bookedRoomIds = new Set<string>();

  for (const row of (bookingsResult.data ?? []) as DatabaseRow[]) {
    const roomId = row.study_room_id;
    if (typeof roomId !== 'string' && typeof roomId !== 'number') continue;

    const bookedStart = toMinutes(row['start-time']);
    const bookedEnd = toMinutes(row['end-time']);

    if (bookedStart === null || bookedEnd === null) {
      throw new Error(
        'A studyroombookings row has an invalid start-time or end-time.',
      );
    }

    if (bookedStart < requested.end && bookedEnd > requested.start) {
      bookedRoomIds.add(String(roomId));
    }
  }

  return rooms.filter((room) => !bookedRoomIds.has(room.id));
}
