import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Timesheet } from '@/lib/mock-data';

export default function Dashboard() {
  const { data: session } = useSession();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');

  useEffect(() => {
    fetchTimesheets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRangeFilter]);

  // Refresh timesheets when page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchTimesheets();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTimesheets = async () => {
    try {
      setIsLoading(true);
      
      // Build query params for date filtering
      let url = '/api/timesheets';
      const params = new URLSearchParams();
      
      if (dateRangeFilter !== 'all') {
        // Calculate date range based on preset filter
        const today = new Date();
        let startDate = '';
        let endDate = '';
        
        if (dateRangeFilter === 'thisMonth') {
          startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
          endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        } else if (dateRangeFilter === 'lastMonth') {
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
          endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
        } else if (dateRangeFilter === 'thisQuarter') {
          const quarter = Math.floor(today.getMonth() / 3);
          startDate = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
          endDate = new Date(today.getFullYear(), quarter * 3 + 3, 0).toISOString().split('T')[0];
        } else if (dateRangeFilter === 'january2024') {
          startDate = '2024-01-01';
          endDate = '2024-01-31';
        } else if (dateRangeFilter === 'february2024') {
          startDate = '2024-02-01';
          endDate = '2024-02-29';
        }
        
        if (startDate && endDate) {
          params.append('startDate', startDate);
          params.append('endDate', endDate);
        }
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch timesheets');
      }

      const data = await response.json();
      setTimesheets(data.timesheets || []);
    } catch (err) {
      setError('Failed to load timesheets. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter timesheets by status (client-side)
  const filteredTimesheets = timesheets.filter((ts) => {
    if (statusFilter === 'all') return true;
    return ts.status === statusFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTimesheets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTimesheets = filteredTimesheets.slice(startIndex, endIndex);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'status-badge status-completed';
      case 'INCOMPLETE':
        return 'status-badge status-incomplete';
      case 'MISSING':
        return 'status-badge status-missing';
      default:
        return 'status-badge';
    }
  };

  const getActionButton = (timesheet: Timesheet) => {
    if (timesheet.status === 'COMPLETED') {
      return (
        <Link
          href={`/dashboard/timesheet/${timesheet.id}`}
          className="text-primary hover:text-primary-dark font-medium"
        >
          View
        </Link>
      );
    } else if (timesheet.status === 'INCOMPLETE') {
      return (
        <Link
          href={`/dashboard/timesheet/${timesheet.id}`}
          className="text-primary hover:text-primary-dark font-medium"
        >
          Update
        </Link>
      );
    } else {
      return (
        <Link
          href={`/dashboard/timesheet/${timesheet.id}`}
          className="text-primary hover:text-primary-dark font-medium"
        >
          Create
        </Link>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Your Timesheets - ticktock</title>
      </Head>
      <DashboardLayout>
        <div className="bg-white lg:rounded-[8px] shadow-sm p-6">
          <h1 className="text-[24px] font-bold text-gray-900 mb-6">
            Your Timesheets
          </h1>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 max-w-[152px]">
                <div className="input-field  relative">
                  <select
                    className="appearance-none bg-transparent w-full text-gray-500 text-[14px]"
                    value={dateRangeFilter}
                    onChange={(e) => {
                      setDateRangeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="default">Date Range</option>
                    <option value="all">All dates</option>
                    <option value="january2024">January 2024</option>
                    <option value="february2024">February 2024</option>
                    <option value="thisMonth">This month</option>
                    <option value="lastMonth">Last month</option>
                    <option value="thisQuarter">This quarter</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-500 text-[12px]"></i>
                  </div>
                </div>
              </div>
              <div className="flex-1 max-w-[152px]">
                <div className="input-field relative">
                  <select
                    className=" appearance-none bg-transparent w-full text-gray-500 text-[14px]"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="default">Status</option>
                    <option value="COMPLETED">Completed (40 hours)</option>
                    <option value="INCOMPLETE">Incomplete (&lt; 40 hours)</option>
                    <option value="MISSING">Missing (0 hours)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <i className="fas fa-chevron-down text-gray-500 text-[12px]"></i>
                  </div>
                </div>
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
              <p className="mt-2 text-gray-600">Loading timesheets...</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-[10px_10px] shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-[107px] whitespace-nowrap px-4 py-4 text-left text-xs leading-[18px] font-semibold text-gray-500 uppercase tracking-wider">
                        Week #
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-left text-xs leading-[18px] font-semibold text-gray-500 uppercase tracking-wider">
                        Date <i className="fas fa-arrow-down text-gray-500 text-[12px] ml-1"></i>
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-left text-xs leading-[18px] font-semibold text-gray-500 uppercase tracking-wider">
                        Status <i className="fas fa-arrow-down text-gray-500 text-[12px] ml-1"></i>
                      </th>
                      <th className="text-right whitespace-nowrap px-4 py-4 text-left text-xs leading-[18px] font-semibold text-gray-500 uppercase tracking-wider pr-[42px]">
                        Actions <i className="fas fa-arrow-down text-gray-500 text-[12px] ml-1"></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentTimesheets.length > 0 ? (
                      currentTimesheets.map((timesheet) => (
                        <tr key={timesheet.id} className="hover:bg-gray-50">
                          <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                            {timesheet.weekNumber}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {timesheet.dateRange}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <span className={getStatusBadgeClass(timesheet.status)}>
                              {timesheet.status}
                            </span>
                          </td>
                          <td className="px-6  text-right py-4 font-normal whitespace-nowrap text-md pr-[42px]">
                            {getActionButton(timesheet)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          No timesheets found for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="input-field bg-gray-50 !py-1.5 min-w-[118px] rounded-[16px] relative">
                    <select
                      className="appearance-none !text-[#4A5565] py-0 bg-transparent w-full text-gray-500 text-[14px]"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <i className="fas fa-chevron-down text-[#4A5565] text-[12px]"></i>
                    </div>
                  </div>
                </div>

                <div className="flex h-[36px] [&>*]:h-full items-center shadow-sm rounded-[12px] border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm font-medium text-[#4A5565] bg-white border-r border-gray-300 rounded-l-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      // Show first, last, current, and adjacent pages
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <span key={`ellipsis-${page}`} className="flex items-center">
                            <span className="px-2 text-[#4A5565] text-sm font-medium border-r border-[#E5E7EB] bg-white">
                              ...
                            </span>
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-1 text-sm font-medium border-r border-[#E5E7EB] ${
                                currentPage === page
                                  ? 'text-[#2563EB] bg-gray-50'
                                  : 'text-[#4A5565] bg-white hover:bg-gray-50'
                              } focus:outline-none`}
                            >
                              {page}
                            </button>
                          </span>
                        );
                      }
                      const isLast = index === array.length - 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-1 text-sm font-medium ${
                            !isLast ? 'border-r border-[#E5E7EB]' : ''
                          } ${
                            currentPage === page
                              ? 'text-[#2563EB] bg-gray-50'
                              : 'text-[#4A5565] bg-white hover:bg-gray-50'
                          } focus:outline-none`}
                        >
                          {page}
                        </button>
                      );
                    })}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-1 text-sm font-medium border-l border-gray-300 text-[#4A5565] bg-white rounded-r-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                  >
                    Next
                  </button>
                </div>
              </div>

            </>
          )}
        </div>
      </DashboardLayout>
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
