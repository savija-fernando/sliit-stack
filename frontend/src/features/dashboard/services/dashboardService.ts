
import { supabase } from '@/lib/supabase';
import type { DashboardData, ActiveReservation } from '../types/dashboard';

type ReservationRow = {
  id: string;
  reservation_type: string;
  status: string;
  book_id: string | null;
  seat_id: string | null;
  reserved_at: string | null;
  books: { title: string } | null;
  seats: { name: string } | null;
  seat_bookings: {
    date: string;
    start_time: string;
    end_time: string;
  }[] | null;
};

function formatTime(time: string) {
  return time.slice(0, 5);
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
}

export async function getDashboardData(): Promise<DashboardData> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!user) {
    throw new Error('Please sign in to view your dashboard.');
  }

  const [
    { data: profile, error: profileError },
    { data: rows, error: reservationsError },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle(),

    supabase
      .from('reservations')
      .select(`
        id,
        reservation_type,
        status,
        book_id,
        seat_id,
        reserved_at,
        seat_bookings (
          date,
          start_time,
          end_time,
          seat_id
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'Active')
      .in('reservation_type', ['BOOK', 'SEAT'])
      .order('created_at', { ascending: false }),
  ]);

  if (profileError) throw profileError;
  if (reservationsError) throw reservationsError;

  const activeReservations: ActiveReservation[] = (
    (rows ?? []) as unknown as ReservationRow[]
  ).map((row) => {
    if (row.reservation_type === 'BOOK') {
      return {
        id: row.id,
        type: 'book',
        title: row.books?.title ?? 'Book reservation',
        subtitle: 'Book reservation active',
      };
    }

    const booking = row.seat_bookings?.[0];

    return {
      id: row.id,
      type: 'seat',
      title: row.seats?.name ?? 'Seat reservation',
      subtitle: booking
        ? `${formatDate(booking.date)}, ${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`
        : 'Seat reservation active',
    };
  });

  return {
    userName:
      profile?.full_name?.trim() ||
      user.user_metadata?.full_name ||
      user.email?.split('@')[0] ||
      'Student',
    activeReservations,
    notifications: [],
    unreadCount: 0,
  };
}
