import type {
  IssueRecord,
  IssueStatus,
} from '@/features/issues/types/issue';

let issues: IssueRecord[] = [
  {
    id: 'ISS-001',
    title: 'Unable to reserve library seat',
    description:
      'The student receives an error when trying to reserve a seat in the main library.',
    studentId: 'IT23540112',
    studentName: 'K.D. Perera',
    category: 'seat',
    priority: 'high',
    status: 'open',
    reportedOn: '07 Oct 2026 - 09:15 AM',
  },

  {
    id: 'ISS-002',
    title: 'Book reservation not appearing',
    description:
      'The student reserved a book but the reservation does not appear in the reservation list.',
    studentId: 'IT23539068',
    studentName: 'A.L.S Silva',
    category: 'book',
    priority: 'medium',
    status: 'open',
    reportedOn: '07 Oct 2026 - 10:25 AM',
  },

  {
    id: 'ISS-003',
    title: 'Account profile details incorrect',
    description:
      'The student reports that the name displayed in the account profile is incorrect.',
    studentId: 'IT23445489',
    studentName: 'Nimmaka K.A.T.R',
    category: 'account',
    priority: 'low',
    status: 'in-progress',
    reportedOn: '06 Oct 2026 - 02:40 PM',
    staffNote:
      'Account information is currently being checked.',
  },

  {
    id: 'ISS-004',
    title: 'Reservation page loading problem',
    description:
      'The reservation page sometimes remains on the loading screen and does not display available resources.',
    studentId: 'IT23548821',
    studentName: 'R.M. Fernando',
    category: 'system',
    priority: 'high',
    status: 'in-progress',
    reportedOn: '06 Oct 2026 - 11:10 AM',
    staffNote:
      'Issue forwarded for technical investigation.',
  },

  {
    id: 'ISS-005',
    title: 'Seat reservation time mismatch',
    description:
      'The reserved seat time shown in the student dashboard is different from the selected time slot.',
    studentId: 'IT23543301',
    studentName: 'S.N. Perera',
    category: 'seat',
    priority: 'medium',
    status: 'resolved',
    reportedOn: '05 Oct 2026 - 03:30 PM',
    staffNote:
      'Reservation information was corrected.',
  },

  {
    id: 'ISS-006',
    title: 'Cannot view book due date',
    description:
      'The due date of a reserved book is not visible in the student reservation details.',
    studentId: 'IT23542218',
    studentName: 'P.H. Jayasinghe',
    category: 'book',
    priority: 'low',
    status: 'resolved',
    reportedOn: '05 Oct 2026 - 01:05 PM',
    staffNote:
      'The reservation details were checked and the issue was resolved.',
  },
];

export function getIssues(): IssueRecord[] {
  return [...issues];
}

export function getIssueById(
  id: string,
): IssueRecord | undefined {
  return issues.find(
    (issue) => issue.id === id,
  );
}

export function updateIssue(
  id: string,
  status: IssueStatus,
  staffNote: string,
): IssueRecord | undefined {
  const issueIndex =
    issues.findIndex(
      (issue) => issue.id === id,
    );

  if (issueIndex === -1) {
    return undefined;
  }

  const updatedIssue: IssueRecord = {
    ...issues[issueIndex],
    status,
    staffNote,
  };

  issues = [
    ...issues.slice(0, issueIndex),
    updatedIssue,
    ...issues.slice(issueIndex + 1),
  ];

  return updatedIssue;
}