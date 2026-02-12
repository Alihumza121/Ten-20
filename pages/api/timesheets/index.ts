import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { mockTimesheets } from '@/lib/mock-data';
import { getTimesheetStatusSummary } from '@/lib/status-management';
import { entriesStore } from '@/lib/timesheet-store';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    // Filter timesheets by user
    let userTimesheets = mockTimesheets.filter(
      (ts) => ts.userId === session.user.id
    );

    // Apply date range filter if provided
    if (startDate && endDate) {
      const filterStart = new Date(startDate as string);
      const filterEnd = new Date(endDate as string);

      userTimesheets = userTimesheets.filter((ts) => {
        const tsStart = new Date(ts.startDate);
        const tsEnd = new Date(ts.endDate);
        
        // Check if timesheet overlaps with the filter range
        return tsStart <= filterEnd && tsEnd >= filterStart;
      });
    }

    // Calculate dynamic status for each timesheet using the status management utility
    // Use the shared entriesStore which includes all updates
    const { timesheets: timesheetsWithStatus, summary } = getTimesheetStatusSummary(
      userTimesheets, 
      entriesStore
    );

    return res.status(200).json({
      timesheets: timesheetsWithStatus,
      summary,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
