export type IssueStatus =
  | 'open'
  | 'in-progress'
  | 'resolved';

export type IssuePriority =
  | 'low'
  | 'medium'
  | 'high';

export type IssueCategory =
  | 'book'
  | 'seat'
  | 'account'
  | 'system'
  | 'other';

export type IssueRecord = {
  id: string;

  title: string;
  description: string;

  studentId: string;
  studentName: string;

  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;

  reportedOn: string;

  staffNote?: string;
};