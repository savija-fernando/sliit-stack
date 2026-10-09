import { supabase } from '@/lib/supabase';

export type NotificationItem = {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  reservationId: string | null;
};

export async function getMyNotifications(): Promise<
  NotificationItem[]
> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { data, error } = await supabase
    .from('notifications')
    .select(`
      id,
      message,
      type,
      read,
      created_at,
      reservation_id
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch notifications: ${error.message}`
    );
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    message: row.message,
    type: row.type,
    read: row.read,
    createdAt: row.created_at,
    reservationId: row.reservation_id,
  }));
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { error } = await supabase
    .from('notifications')
    .update({
      read: true,
    })
    .eq('id', notificationId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(
      `Failed to mark notification as read: ${error.message}`
    );
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const { error } = await supabase
    .from('notifications')
    .update({
      read: true,
    })
    .eq('user_id', user.id)
    .eq('read', false);

  if (error) {
    throw new Error(
      `Failed to mark notifications as read: ${error.message}`
    );
  }
}