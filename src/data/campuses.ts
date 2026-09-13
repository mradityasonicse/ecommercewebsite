export interface Campus {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  studentCount: number;
  activeProviders: number;
  status: 'active' | 'launching_soon';
  hubLocation: string;
}

export const CAMPUSES: Campus[] = [
  {
    id: 'campus-hub',
    name: 'Campus Living Hub',
    shortName: 'Campus Living',
    city: 'Student Area',
    state: '',
    studentCount: 0,
    activeProviders: 0,
    status: 'active',
    hubLocation: 'Campus Operations Desk'
  }
];
