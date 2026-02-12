import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { TimesheetEntry } from '@/lib/mock-data';
import { updateTimesheetStatus } from '@/lib/status-management';
import { entriesStore, timesheetsStore, getNextId } from '@/lib/timesheet-store';

// Helper function to update timesheet status when entries change
function updateTimesheetInStore(timesheetId: string) {
  const timesheetIndex = timesheetsStore.findIndex(ts => ts.id === timesheetId);
  if (timesheetIndex !== -1) {
    const updatedTimesheet = updateTimesheetStatus(timesheetsStore[timesheetIndex], entriesStore);
    timesheetsStore[timesheetIndex] = updatedTimesheet;
    return updatedTimesheet;
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id: timesheetId } = req.query;

  if (req.method === 'GET') {
    // Get all entries for this timesheet
    const entries = entriesStore.filter(
      (entry) => entry.timesheetId === timesheetId
    );
    return res.status(200).json(entries);
  }

  if (req.method === 'POST') {
    // Create new entry
    const { date, projectName, typeOfWork, description, hours } = req.body;

    if (!date || !projectName || !typeOfWork || !description || !hours) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newEntry: TimesheetEntry = {
      id: String(getNextId()),
      timesheetId: timesheetId as string,
      date,
      projectName,
      typeOfWork,
      description,
      hours: Number(hours),
    };

    entriesStore.push(newEntry);
    
    // Update timesheet status
    const updatedTimesheet = updateTimesheetInStore(timesheetId as string);
    
    return res.status(201).json({
      entry: newEntry,
      timesheet: updatedTimesheet,
    });
  }

  if (req.method === 'PUT') {
    // Update entry
    const { entryId, date, projectName, typeOfWork, description, hours } =
      req.body;

    const entryIndex = entriesStore.findIndex(
      (entry) => entry.id === entryId && entry.timesheetId === timesheetId
    );

    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    entriesStore[entryIndex] = {
      ...entriesStore[entryIndex],
      date,
      projectName,
      typeOfWork,
      description,
      hours: Number(hours),
    };

    // Update timesheet status
    const updatedTimesheet = updateTimesheetInStore(timesheetId as string);

    return res.status(200).json({
      entry: entriesStore[entryIndex],
      timesheet: updatedTimesheet,
    });
  }

  if (req.method === 'DELETE') {
    // Delete entry
    const { entryId } = req.body;

    const entryIndex = entriesStore.findIndex(
      (entry) => entry.id === entryId && entry.timesheetId === timesheetId
    );

    if (entryIndex === -1) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    entriesStore.splice(entryIndex, 1);
    
    // Update timesheet status
    const updatedTimesheet = updateTimesheetInStore(timesheetId as string);
    
    return res.status(200).json({ 
      message: 'Entry deleted successfully',
      timesheet: updatedTimesheet,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
