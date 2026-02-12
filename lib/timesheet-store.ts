import { mockTimesheets, mockTimesheetEntries, TimesheetEntry, Timesheet } from './mock-data';

// Shared in-memory storage for entries (simulating a database)
export let entriesStore: TimesheetEntry[] = [...mockTimesheetEntries];
let nextIdCounter = entriesStore.length + 1;

// Shared in-memory storage for timesheets to track status updates
export let timesheetsStore: Timesheet[] = [...mockTimesheets];

// Function to get and increment the next ID
export function getNextId(): number {
  return nextIdCounter++;
}

// Helper function to reset stores (useful for testing)
export function resetStores() {
  entriesStore = [...mockTimesheetEntries];
  nextIdCounter = entriesStore.length + 1;
  timesheetsStore = [...mockTimesheets];
}
