export type ReservationStatus =
  | 'pending'
  | 'approved'
  | 'rejected';

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