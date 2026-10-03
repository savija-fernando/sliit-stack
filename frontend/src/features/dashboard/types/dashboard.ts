export type ActiveReservation = {
  id: string;
  type: 'book' | 'seat';
  title: string;
  subtitle: string;
  urgent?: boolean; // shows the subtitle in red with a clock icon
};

export type AppNotification = {
  id: string;
  message: string;
  time: string;
  unread?: boolean;
};

export type DashboardData = {
  userName: string;
  activeReservations: ActiveReservation[];
  notifications: AppNotification[];
  unreadCount: number;
};