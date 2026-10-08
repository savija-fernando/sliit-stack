export type StaffProfile = {
  name: string;
  email: string;
  staffId: string;
  role: string;
  department: string;
};

let staffProfile: StaffProfile = {
  name: 'Staff Member',
  email: 'staff@sliit.lk',
  staffId: 'STF-001',
  role: 'Staff',
  department: 'Library Services',
};

export function getStaffProfile(): StaffProfile {
  return {
    ...staffProfile,
  };
}

export function updateStaffProfile(
  updatedProfile: StaffProfile,
): StaffProfile {
  staffProfile = {
    ...updatedProfile,
  };

  return {
    ...staffProfile,
  };
}