export type ReservationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'expired';

export type ReservationKind =
  | 'book'
  | 'seat';

export type ReservationQueueItem = {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  dateText: string;
  status: ReservationStatus;
  kind: ReservationKind;
};

export type ReservationRecord =
  ReservationQueueItem & {
    author: string;
    published: string;
    reservedOn: string;
    pickupDate: string;
    dueDate: string;
    note?: string;
  };