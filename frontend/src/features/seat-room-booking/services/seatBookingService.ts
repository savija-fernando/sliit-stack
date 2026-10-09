import { supabase } from '@/lib/supabase';

export type BookableSeat = {
  id: string;
  name: string;
};

function toMinutes(value: unknown): number | null {
  if (typeof value !== 'string') return null;

  const match = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function getTimeRange(startTime: string, endTime: string) {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (start === null || end === null || end <= start) {
    throw new Error('The selected seat booking time is invalid.');
  }

  return { start, end };
}

export async function getAllSeats(): Promise<BookableSeat[]> {
  const { data, error } = await supabase
    .from('seats')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(`Could not load seats: ${error.message}`);
  }

  return (data ?? []).map((row) => {
    const seat = row as Record<string, unknown>;
    if (
      (typeof seat.id !== 'string' && typeof seat.id !== 'number') ||
      typeof seat.name !== 'string' ||
      !seat.name.trim()
    ) {
      throw new Error('A seat row is missing its id or name.');
    }

    return { id: String(seat.id), name: seat.name.trim() };
  });
}

export async function getUnavailableSeatIds(
  date: string,
  startTime: string,
  endTime: string,
): Promise<string[]> {
  const requested = getTimeRange(startTime, endTime);
  const { data, error } = await supabase
    .from('seat_bookings')
    .select('*')
    .eq('date', date);

  if (error) {
    throw new Error(`Could not check seat bookings: ${error.message}`);
  }

  const unavailable = new Set<string>();
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    if (row['is-active'] !== true) continue;

    const seatId = row.seat_id;
    const bookedStart = toMinutes(row.start_time);
    const bookedEnd = toMinutes(row.end_time);
    if (
      (typeof seatId !== 'string' && typeof seatId !== 'number') ||
      bookedStart === null ||
      bookedEnd === null ||
      bookedEnd <= bookedStart
    ) {
      throw new Error('An active seat booking has invalid seat or time data.');
    }

    if (bookedStart < requested.end && bookedEnd > requested.start) {
      unavailable.add(String(seatId));
    }
  }

  return [...unavailable];
}

export async function createSeatBookings({
  seatIds,
  date,
  startTime,
  endTime,
}: {
  seatIds: string[];
  date: string;
  startTime: string;
  endTime: string;
}): Promise<void> {
  if (!seatIds.length) {
    throw new Error('Select at least one seat before continuing.');
  }

  const unavailable = new Set(
    await getUnavailableSeatIds(date, startTime, endTime),
  );
  const conflictingSeats = seatIds.filter((seatId) => unavailable.has(seatId));
  if (conflictingSeats.length) {
    throw new Error(
      'One or more selected seats have just been booked. Go back and choose available seats.',
    );
  }

  const { error } = await supabase.from('seat_bookings').insert(
    seatIds.map((seatId) => ({
      seat_id: seatId,
      date,
      start_time: `${startTime}:00`,
      end_time: `${endTime}:00`,
      'is-active': true,
    })),
  );

  if (error) {
    throw new Error(`Could not create seat booking: ${error.message}`);
  }
}
