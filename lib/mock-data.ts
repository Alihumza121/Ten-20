export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface TimesheetEntry {
  id: string;
  timesheetId: string;
  date: string;
  projectName: string;
  typeOfWork: string;
  description: string;
  hours: number;
}

export interface Timesheet {
  id: string;
  userId: string;
  weekNumber: number;
  dateRange: string;
  startDate: string;
  endDate: string;
  status: 'COMPLETED' | 'INCOMPLETE' | 'MISSING';
  totalHours: number;
  expectedHours: number;
}

// Mock users for authentication
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    password: 'password123', // In production, this would be hashed
    name: 'John Doe',
  },
  {
    id: '2',
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User',
  },
];

// Mock timesheets
export const mockTimesheets: Timesheet[] = [
  {
    id: '1',
    userId: '1',
    weekNumber: 1,
    dateRange: '1 - 5 January, 2024',
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    status: 'COMPLETED',
    totalHours: 40,
    expectedHours: 40,
  },
  {
    id: '2',
    userId: '1',
    weekNumber: 2,
    dateRange: '8 - 12 January, 2024',
    startDate: '2024-01-08',
    endDate: '2024-01-12',
    status: 'COMPLETED',
    totalHours: 40,
    expectedHours: 40,
  },
  {
    id: '3',
    userId: '1',
    weekNumber: 3,
    dateRange: '15 - 19 January, 2024',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    status: 'INCOMPLETE',
    totalHours: 28,
    expectedHours: 40,
  },
  {
    id: '4',
    userId: '1',
    weekNumber: 4,
    dateRange: '22 - 26 January, 2024',
    startDate: '2024-01-22',
    endDate: '2024-01-26',
    status: 'COMPLETED',
    totalHours: 40,
    expectedHours: 40,
  },
  {
    id: '5',
    userId: '1',
    weekNumber: 5,
    dateRange: '29 January - 2 February, 2024',
    startDate: '2024-01-29',
    endDate: '2024-02-02',
    status: 'MISSING',
    totalHours: 0,
    expectedHours: 40,
  },
  {
    id: '6',
    userId: '1',
    weekNumber: 6,
    dateRange: '5 - 9 February, 2024',
    startDate: '2024-02-05',
    endDate: '2024-02-09',
    status: 'INCOMPLETE',
    totalHours: 24,
    expectedHours: 40,
  },
  {
    id: '7',
    userId: '1',
    weekNumber: 7,
    dateRange: '12 - 16 February, 2024',
    startDate: '2024-02-12',
    endDate: '2024-02-16',
    status: 'COMPLETED',
    totalHours: 40,
    expectedHours: 40,
  },
  {
    id: '8',
    userId: '1',
    weekNumber: 8,
    dateRange: '19 - 23 February, 2024',
    startDate: '2024-02-19',
    endDate: '2024-02-23',
    status: 'COMPLETED',
    totalHours: 40,
    expectedHours: 40,
  },
];

// Mock timesheet entries
export const mockTimesheetEntries: TimesheetEntry[] = [
  // Week 4 entries (Jan 21-26)
  {
    id: '1',
    timesheetId: '4',
    date: '2024-01-21',
    projectName: 'Homepage Development',
    typeOfWork: 'Bug fixes',
    description: 'Fixed navigation menu responsive issues',
    hours: 4,
  },
  {
    id: '2',
    timesheetId: '4',
    date: '2024-01-21',
    projectName: 'Homepage Development',
    typeOfWork: 'Feature Development',
    description: 'Implemented user authentication flow',
    hours: 4,
  },
  {
    id: '3',
    timesheetId: '4',
    date: '2024-01-22',
    projectName: 'Homepage Development',
    typeOfWork: 'Code Review',
    description: 'Reviewed PR for payment integration',
    hours: 4,
  },
  {
    id: '4',
    timesheetId: '4',
    date: '2024-01-22',
    projectName: 'Homepage Development',
    typeOfWork: 'Testing',
    description: 'Wrote unit tests for API endpoints',
    hours: 4,
  },
  {
    id: '5',
    timesheetId: '4',
    date: '2024-01-22',
    projectName: 'Homepage Development',
    typeOfWork: 'Documentation',
    description: 'Updated API documentation',
    hours: 4,
  },
  {
    id: '6',
    timesheetId: '4',
    date: '2024-01-23',
    projectName: 'Homepage Development',
    typeOfWork: 'Feature Development',
    description: 'Built dashboard analytics component',
    hours: 4,
  },
  {
    id: '7',
    timesheetId: '4',
    date: '2024-01-23',
    projectName: 'Homepage Development',
    typeOfWork: 'Bug fixes',
    description: 'Fixed data loading issues',
    hours: 4,
  },
  {
    id: '8',
    timesheetId: '4',
    date: '2024-01-23',
    projectName: 'Homepage Development',
    typeOfWork: 'Refactoring',
    description: 'Optimized component rendering',
    hours: 4,
  },
  {
    id: '9',
    timesheetId: '4',
    date: '2024-01-24',
    projectName: 'Homepage Development',
    typeOfWork: 'Feature Development',
    description: 'Implemented search functionality',
    hours: 4,
  },
  {
    id: '10',
    timesheetId: '4',
    date: '2024-01-24',
    projectName: 'Homepage Development',
    typeOfWork: 'Testing',
    description: 'Integration testing for new features',
    hours: 4,
  },
  // Week 3 entries (Incomplete)
  {
    id: '11',
    timesheetId: '3',
    date: '2024-01-15',
    projectName: 'E-commerce Platform',
    typeOfWork: 'Feature Development',
    description: 'Shopping cart implementation',
    hours: 8,
  },
  {
    id: '12',
    timesheetId: '3',
    date: '2024-01-16',
    projectName: 'E-commerce Platform',
    typeOfWork: 'Bug fixes',
    description: 'Product page layout fixes',
    hours: 6,
  },
  {
    id: '13',
    timesheetId: '3',
    date: '2024-01-17',
    projectName: 'E-commerce Platform',
    typeOfWork: 'Code Review',
    description: 'Reviewed checkout flow changes',
    hours: 4,
  },
  {
    id: '14',
    timesheetId: '3',
    date: '2024-01-18',
    projectName: 'E-commerce Platform',
    typeOfWork: 'Feature Development',
    description: 'Payment gateway integration',
    hours: 6,
  },
  {
    id: '15',
    timesheetId: '3',
    date: '2024-01-19',
    projectName: 'E-commerce Platform',
    typeOfWork: 'Testing',
    description: 'End-to-end testing',
    hours: 4,
  },
];

// Mock projects for dropdown
export const mockProjects = [
  'Homepage Development',
  'E-commerce Platform',
  'Mobile App',
  'API Integration',
  'Dashboard Redesign',
  'Customer Portal',
];

// Mock work types for dropdown
export const mockWorkTypes = [
  'Feature Development',
  'Bug fixes',
  'Code Review',
  'Testing',
  'Documentation',
  'Refactoring',
  'Meeting',
  'Research',
];
