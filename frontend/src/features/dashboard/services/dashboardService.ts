import type { DashboardData } from '../types/dashboard';

// Dummy data. Replace with the Supabase queries later.
export async function getDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return {
    userName: 'Savija',
    activeReservations: [
      {
        id: '1',
        type: 'book',
        title: 'Design patterns',
        subtitle: 'Collect by 5:00 pm today',
        urgent: true,
      },
      {
        id: '2',
        type: 'seat',
        title: 'Seat B-12, Reading room 2',
        subtitle: 'Today, 2:00 pm – 4:00 pm',
      },
    ],
    notifications: [
      {
        id: '1',
        message: 'Your reserved book is ready for pickup',
        time: '10 minutes ago',
        unread: true,
      },
    ],
    unreadCount: 1,
  };
}