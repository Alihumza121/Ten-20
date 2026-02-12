import { Timesheet, TimesheetEntry } from './mock-data';

export type TimesheetStatus = 'COMPLETED' | 'INCOMPLETE' | 'MISSING';

/**
 * Calculate timesheet status based on total hours
 * - MISSING: 0 hours
 * - COMPLETED: >= 40 hours
 * - INCOMPLETE: > 0 and < 40 hours
 */
export function calculateStatus(totalHours: number): TimesheetStatus {
  if (totalHours === 0) {
    return 'MISSING';
  } else if (totalHours >= 40) {
    return 'COMPLETED';
  } else {
    return 'INCOMPLETE';
  }
}

/**
 * Calculate total hours from timesheet entries
 */
export function calculateTotalHours(entries: TimesheetEntry[]): number {
  return entries.reduce((total, entry) => total + entry.hours, 0);
}

/**
 * Get timesheet entries for a specific timesheet
 */
export function getTimesheetEntries(
  timesheetId: string,
  allEntries: TimesheetEntry[]
): TimesheetEntry[] {
  return allEntries.filter(entry => entry.timesheetId === timesheetId);
}

/**
 * Update timesheet status based on current entries
 */
export function updateTimesheetStatus(
  timesheet: Timesheet,
  allEntries: TimesheetEntry[]
): Timesheet {
  const entries = getTimesheetEntries(timesheet.id, allEntries);
  const totalHours = calculateTotalHours(entries);
  const status = calculateStatus(totalHours);

  return {
    ...timesheet,
    totalHours,
    status,
  };
}

/**
 * Get status summary for multiple timesheets
 */
export function getTimesheetStatusSummary(
  timesheets: Timesheet[],
  allEntries: TimesheetEntry[]
) {
  const updatedTimesheets = timesheets.map(ts => 
    updateTimesheetStatus(ts, allEntries)
  );

  const summary = {
    total: timesheets.length,
    completed: updatedTimesheets.filter(ts => ts.status === 'COMPLETED').length,
    incomplete: updatedTimesheets.filter(ts => ts.status === 'INCOMPLETE').length,
    missing: updatedTimesheets.filter(ts => ts.status === 'MISSING').length,
  };

  return {
    timesheets: updatedTimesheets,
    summary,
  };
}

/**
 * Validate if a timesheet can be submitted based on status
 */
export function canSubmitTimesheet(status: TimesheetStatus): boolean {
  return status === 'COMPLETED';
}

/**
 * Get hours needed to complete a timesheet
 */
export function getHoursNeeded(totalHours: number): number {
  return Math.max(0, 40 - totalHours);
}

/**
 * Check if timesheet is overdue (based on end date)
 */
export function isOverdue(endDate: string): boolean {
  const end = new Date(endDate);
  const now = new Date();
  return end < now;
}
