import { supabase } from '@/lib/supabase';

export type StudyRoomBasic = {
  id: string;
  name: string;
  location: string;
  condition: string;
  description: string;
  available_from: string | null;
  available_until: string | null;
};

/**
 * Returns true when the varchar is_active column should be treated as active.
 * Inactive only if the value is explicitly 'false' or '0'.
 * NULL / empty / any other value → active.
 */
function isActiveRoom(raw: unknown): boolean {
  if (typeof raw !== 'string') return true; // NULL → active
  const v = raw.trim().toLowerCase();
  return v !== 'false' && v !== '0';
}

/**
 * Fetch all active study rooms from the studyrooms table.
 * is_active is varchar, so we filter client-side.
 */
export async function getAllStudyRooms(): Promise<StudyRoomBasic[]> {
  const { data, error } = await supabase
    .from('studyrooms')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Could not load study rooms: ${error.message}`);
  }

  return (data ?? [])
    .map((row) => row as Record<string, unknown>)
    .filter((r) => isActiveRoom(r.is_active))
    .map((r) => ({
      id: String(r.id ?? ''),
      name: typeof r.name === 'string' ? r.name : '',
      location: typeof r.location === 'string' ? r.location : 'Study area',
      condition: typeof r.condition === 'string' ? r.condition : '',
      description:
        typeof r.description === 'string'
          ? r.description
          : 'A space for focused study.',
      available_from:
        typeof r.available_from === 'string' ? r.available_from : null,
      available_until:
        typeof r.available_until === 'string' ? r.available_until : null,
    }));
}


/** All 2-hour time slots we offer. */
export const ALL_TIME_SLOTS = [
  { label: '08:00 AM – 10:00 AM', start: '08:00', end: '10:00' },
  { label: '10:00 AM – 12:00 PM', start: '10:00', end: '12:00' },
  { label: '12:00 PM – 02:00 PM', start: '12:00', end: '14:00' },
  { label: '02:00 PM – 04:00 PM', start: '14:00', end: '16:00' },
  { label: '04:00 PM – 06:00 PM', start: '16:00', end: '18:00' },
];

function hhmm(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const m = value.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

/**
 * Given a roomId and date (YYYY-MM-DD), return which of ALL_TIME_SLOTS
 * are still available (not overlapping any active booking).
 *
 * Table: studyroom_bookings
 * Columns: study_room_id, Date (date), start_time (time), end_time (time), status
 */
export async function getAvailableSlotsForRoom(
  roomId: string,
  date: string,
): Promise<typeof ALL_TIME_SLOTS> {
  const { data, error } = await supabase
    .from('studyroom_bookings')
    .select('study_room_id, start_time, end_time, status, Date')
    .eq('Date', date)
    .eq('study_room_id', roomId)
    .eq('status', 'active');

  if (error) {
    throw new Error(`Could not check bookings: ${error.message}`);
  }

  const bookedRanges = (data ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    return {
      start: hhmm(r.start_time) ?? 0,
      end: hhmm(r.end_time) ?? 0,
    };
  });

  return ALL_TIME_SLOTS.filter((slot) => {
    const slotStart = hhmm(slot.start)!;
    const slotEnd = hhmm(slot.end)!;
    // Keep slot only if it doesn't overlap any active booking
    return !bookedRanges.some(
      (b) => b.start < slotEnd && b.end > slotStart,
    );
  });
}


export async function createStudyRoomBooking(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Please sign in before booking a study room.');
  }

  // Create the shared reservation first.
  const reference = `ROOM-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  const { data: reservation, error: reservationError } = await supabase
    .from('reservations')
    .insert({
      user_id: user.id,
      reservation_type: 'ROOM',
      room_id: roomId,
      reference,
      status: 'Active',
    })
    .select('id')
    .single();

  if (reservationError || !reservation) {
    throw new Error(
      `Could not create room reservation: ${
        reservationError?.message ?? 'Unknown error'
      }`,
    );
  }

  // Link the room booking to the shared reservation.
  const { error: bookingError } = await supabase
    .from('studyroom_bookings')
    .insert({
      study_room_id: roomId,
      Date: date,
      start_time: startTime,
      end_time: endTime,
      status: 'active',
      reservation_id: reservation.id,
    });

  if (bookingError) {
    throw new Error(
      `Reservation ${reference} was created, but the room booking failed: ${bookingError.message}`,
    );
  }
}
