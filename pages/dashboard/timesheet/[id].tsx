import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import TimesheetEntryModal from '@/components/TimesheetEntryModal';
import { TimesheetEntry, Timesheet } from '@/lib/mock-data';

export default function TimesheetDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTimesheet();
      fetchEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTimesheet = async () => {
    try {
      const response = await fetch('/api/timesheets');
      
      if (!response.ok) {
        throw new Error('Failed to fetch timesheet');
      }

      const data = await response.json();
      const foundTimesheet = data.timesheets?.find((ts: Timesheet) => ts.id === id);
      setTimesheet(foundTimesheet || null);
    } catch (err) {
      console.error('Failed to load timesheet:', err);
    }
  };

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/timesheets/${id}/entries`);

      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError('Failed to load timesheet entries.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = (date?: string) => {
    setSelectedDate(date || '');
    setEditingEntry(null);
    setShowModal(true);
  };

  const handleEditEntry = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    setShowModal(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/timesheets/${id}/entries`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      await fetchEntries();
    } catch (err) {
      alert('Failed to delete entry. Please try again.');
      console.error(err);
    }
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setShowModal(false);
    setEditingEntry(null);
    setSelectedDate('');
    if (shouldRefresh) {
      fetchEntries();
    }
  };

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimesheetEntry[]>);

  // Get unique dates and sort them
  const dates = Object.keys(entriesByDate).sort();

  // Calculate total hours
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const expectedHours = 40;
  const progressPercentage = Math.min((totalHours / expectedHours) * 100, 100);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startDay = start.getDate();
    const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
    const startYear = start.getFullYear();
    
    const endDay = end.getDate();
    const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
    const endYear = end.getFullYear();
    
    // If same month and year
    if (startMonth === endMonth && startYear === endYear) {
      return `${startDay} - ${endDay} ${startMonth}, ${startYear}`;
    }
    
    // If different months but same year
    if (startYear === endYear) {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}, ${startYear}`;
    }
    
    // Different years
    return `${startDay} ${startMonth}, ${startYear} - ${endDay} ${endMonth}, ${endYear}`;
  };

  return (
    <>
      <Head>
        <title>This week&apos;s timesheet - ticktock</title>
      </Head>
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 max-lg:flex-col max-lg:items-start">
            <div>
            
              <h1 className="text-[24px] font-bold text-gray-900 lg:mb-6 mb-2 max-lg:text-[18px]">
                This week&apos;s timesheet
              </h1>
              {timesheet ? (
                <p className="text-sm font-normal text-gray-500 lg:mb-6 mb-2">
                  {formatDateRange(timesheet.startDate, timesheet.endDate)}
                </p>
              ) : (
                <p className="text-sm font-normal text-gray-500 lg:mb-6 mb-2">Loading...</p>
              )}
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Tooltip */}
                {showTooltip && (
                  <div 
                    className="absolute bottom-full mb-2 z-10"
                    style={{ 
                      left: `${Math.min(progressPercentage, 50)}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="bg-white rounded-lg shadow-lg px-4 py-2 relative">
                      <div className="text-sm flex items-center gap-1 font-medium text-gray-900">
                        {totalHours}/{expectedHours} <span className="text-sm font-normal">hrs</span>
                      </div>
                      {/* Tooltip tail */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white"></div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Progress Bar */}
                <div
                  className="w-32 bg-gray-200 rounded-full h-2 cursor-pointer relative"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              {/* Percentage */}
              <div className="text-sm text-gray-600">
                {progressPercentage.toFixed(0)}%
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-600">Loading entries...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {dates.map((date) => (
                <div key={date} className="flex items-start justify-between lg:gap-[50px] max-lg:gap-0 max-lg:flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 w-[100px]">
                    {getDayName(date)} {formatDate(date)}
                  </h3>

                  <div className="space-y-[10px] flex-1 max-lg:w-full">
                    {entriesByDate[date].map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center border border-gray-200 p-[10px_12px] last:border-b-0 justify-between p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors max-lg:flex-col max-lg:items-start"
                      >
                        <div className="flex-1">
                          <div className="flex items-center max-md:flex-col max-md:items-start max-md:w-full max-w-full gap-3 mb-1">
                            <h4 className="font-medium text-[16px] text-gray-900">
                              {entry.projectName}
                            </h4>
                            <span className="text-sm text-gray-500">
                              {entry.typeOfWork}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {entry.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right flex items-center gap-2">
                            <div className="text-sm font-normal text-gray-400">
                              {entry.hours} hrs
                            </div>
                            <span className="inline-block px-2 py-1 text-xs font-medium text-[#1E429F] bg-[#E1EFFE] rounded">
                              {entry.projectName.split(' ')[0]}
                            </span>
                          </div>

                          <div className="relative group">
                            <button className="p-2 text-gray-400 rotate-90 hover:text-gray-600 focus:outline-none">
                              <i className="fas fa-ellipsis-v text-gray-500 text-lg"></i>
                            </button>

                            {/* Dropdown menu */}
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200">
                              <button
                                onClick={() => handleEditEntry(entry)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add new task button */}
                    <button
                      onClick={() => handleAddEntry(date)}
                      className="w-full font-medium text-[16px] p-[8px_20px] border border-dashed border-gray-300 rounded-lg text-primary hover:border-primary hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 focus:outline-none"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add new task
                    </button>
                  </div>
                </div>
              ))}

              {dates.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    No entries yet for this week.
                  </p>
                  <button
                    onClick={() => handleAddEntry()}
                    className="btn-primary"
                  >
                    Add your first entry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>

      {showModal && (
        <TimesheetEntryModal
          timesheetId={id as string}
          entry={editingEntry}
          initialDate={selectedDate}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
