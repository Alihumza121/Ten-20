# Timesheet Filtering Implementation

## Overview

The timesheet listing page now includes advanced filtering capabilities with dynamic status calculation based on hours logged.

---

## ✅ Implemented Features

### 1. **Dynamic Status Calculation**

Statuses are now calculated dynamically based on hours logged by the user:

```typescript
// Status Logic (in /pages/api/timesheets/index.ts)
function calculateStatus(totalHours: number): 'COMPLETED' | 'INCOMPLETE' | 'MISSING' {
  if (totalHours === 0) {
    return 'MISSING';      // No hours added
  } else if (totalHours >= 40) {
    return 'COMPLETED';    // 40 or more hours added
  } else {
    return 'INCOMPLETE';   // Less than 40 hours added
  }
}
```

**Status Definitions**:
- ✅ **COMPLETED** = Exactly 40 hours or more added by the user
- ⚠️ **INCOMPLETE** = Less than 40 hours but more than 0 hours added
- ❌ **MISSING** = No hours added (0 hours)

The status is shown in the table with the hour count for transparency:
- `COMPLETED (40h)`
- `INCOMPLETE (28h)`
- `MISSING (0h)`

---

### 2. **Date Range Filtering**

#### Preset Date Ranges

Users can filter timesheets using preset date ranges:

- **All dates** - Shows all timesheets
- **January 2024** - Shows all weeks in January 2024
- **February 2024** - Shows all weeks in February 2024
- **This month** - Dynamically calculates current month
- **Last month** - Previous month
- **This quarter** - Current quarter
- **Custom range...** - Opens custom date picker

#### Custom Date Range

When "Custom range..." is selected:
- Two date pickers appear (Start Date and End Date)
- Users can select any date range
- **Multiple weeks are shown** if they overlap with the selected range
- Visual feedback shows the active date range

**Example**: If you select Jan 10 - Feb 15:
- Week 2 (Jan 8-12) ✅ Shown (overlaps)
- Week 3 (Jan 15-19) ✅ Shown (within range)
- Week 4 (Jan 22-26) ✅ Shown (within range)
- Week 5 (Jan 29 - Feb 2) ✅ Shown (overlaps)
- Week 6 (Feb 5-9) ✅ Shown (within range)
- Week 7 (Feb 12-16) ✅ Shown (overlaps)

#### How It Works

The API checks if a timesheet overlaps with the filter range:

```typescript
// Overlap detection logic
const filterStart = new Date(startDate);
const filterEnd = new Date(endDate);
const tsStart = new Date(ts.startDate);
const tsEnd = new Date(ts.endDate);

// A timesheet is included if it overlaps with the filter range
return tsStart <= filterEnd && tsEnd >= filterStart;
```

This ensures that:
- Weeks fully within the range are shown
- Weeks that partially overlap are shown
- Weeks outside the range are hidden

---

### 3. **Status Filtering**

Filter timesheets by status:

- **All statuses** - Shows all timesheets
- **Completed (40 hours)** - Only timesheets with 40+ hours
- **Incomplete (< 40 hours)** - Only timesheets with 1-39 hours
- **Missing (0 hours)** - Only timesheets with no hours logged

**Note**: Status filtering is applied AFTER date range filtering (client-side), so both filters work together.

---

## 🔄 Data Flow

### Frontend (Dashboard Page)

**File**: `/pages/dashboard/index.tsx`

1. User selects date range filter
2. Component calls `fetchTimesheets()` with query params
3. API returns filtered timesheets with calculated statuses
4. User can further filter by status (client-side)
5. Results are displayed in the table

### Backend (API Route)

**File**: `/pages/api/timesheets/index.ts`

1. Receives GET request with optional `startDate` and `endDate` params
2. Filters timesheets by userId
3. If date range provided, filters by date overlap
4. Calculates dynamic status for each timesheet
5. Returns JSON array of timesheets

---

## 📊 Example Use Cases

### Use Case 1: View All January Timesheets

1. Select "January 2024" from Date Range dropdown
2. Shows Week 1, 2, 3, 4 (all in January)
3. Week 5 is hidden (starts Jan 29 but mostly in February)

**Actually shown**: All weeks that overlap with January 1-31

### Use Case 2: Find Incomplete Timesheets

1. Select "All dates" from Date Range
2. Select "Incomplete (< 40 hours)" from Status
3. Shows only Week 3 (28h) and Week 6 (24h)

### Use Case 3: Custom Range Spanning Multiple Weeks

1. Select "Custom range..." from Date Range
2. Start Date: `2024-01-15` (mid-January)
3. End Date: `2024-02-10` (mid-February)
4. Shows Weeks 3, 4, 5, 6 (all weeks that overlap this range)

### Use Case 4: Find Missing Timesheets in February

1. Select "February 2024" from Date Range
2. Select "Missing (0 hours)" from Status
3. Shows only Week 5 (0h) from February weeks

---

## 💻 Code Changes

### 1. Updated Mock Data Structure

**File**: `/lib/mock-data.ts`

Added `startDate` and `endDate` fields to `Timesheet` interface:

```typescript
export interface Timesheet {
  id: string;
  userId: string;
  weekNumber: number;
  dateRange: string;
  startDate: string;    // NEW: ISO date string
  endDate: string;      // NEW: ISO date string
  status: 'COMPLETED' | 'INCOMPLETE' | 'MISSING';
  totalHours: number;
  expectedHours: number;
}
```

### 2. Updated API Route

**File**: `/pages/api/timesheets/index.ts`

- Added `calculateStatus()` function
- Added date range filtering logic
- Statuses now calculated dynamically on every request

```typescript
// Calculate dynamic status for each timesheet
const timesheetsWithStatus = userTimesheets.map((ts) => ({
  ...ts,
  status: calculateStatus(ts.totalHours),
}));
```

### 3. Updated Dashboard Component

**File**: `/pages/dashboard/index.tsx`

Added state:
- `dateRangeFilter` - Selected date range option
- `customStartDate` - Custom range start
- `customEndDate` - Custom range end

Added logic:
- Query param building for API calls
- Preset date range calculation
- Custom date range UI
- Empty state when no results

---

## 🎨 UI Improvements

### Filter Section

1. **Date Range Dropdown**
   - Clear labels for each option
   - Helper text showing what's selected
   - Smooth transition to custom date picker

2. **Custom Date Range Panel**
   - Blue background for visual distinction
   - Two date inputs side-by-side
   - Helpful description text
   - Live feedback showing selected range

3. **Status Dropdown**
   - Descriptive labels with hour criteria
   - Example: "Completed (40 hours)" instead of just "Completed"

### Table Display

1. **Status Badge Enhancement**
   - Shows status AND hours: `COMPLETED (40h)`
   - Color-coded badges (green, yellow, red)
   - Makes it clear why a status was assigned

2. **Empty State**
   - Friendly message when no results match filters
   - Prompts user to adjust filters

---

## 🧪 Testing Scenarios

### Test 1: Verify Status Calculation

1. View timesheets list
2. Check Week 3: Should show "INCOMPLETE (28h)"
3. Check Week 4: Should show "COMPLETED (40h)"
4. Check Week 5: Should show "MISSING (0h)"

**Expected**: Status matches hours logged

### Test 2: Date Range with Multiple Weeks

1. Select "Custom range..."
2. Start: 2024-01-01
3. End: 2024-01-31
4. Should show Weeks 1, 2, 3, 4
5. Should hide Weeks 5-8

**Expected**: Only January weeks shown

### Test 3: Combined Filters

1. Select "January 2024" from Date Range
2. Select "Incomplete (< 40 hours)" from Status
3. Should show only Week 3 (28h)

**Expected**: Only incomplete January weeks shown

### Test 4: Custom Range Spanning Months

1. Select "Custom range..."
2. Start: 2024-01-20
3. End: 2024-02-15
4. Should show Weeks 4, 5, 6, 7

**Expected**: All weeks that overlap with Jan 20 - Feb 15

---

## 📝 Important Notes

### Status Calculation

- ✅ Status is calculated **server-side** every time timesheets are fetched
- ✅ Based on `totalHours` field in mock data
- ✅ In production, would calculate from sum of entries in database

### Date Filtering

- ✅ Implemented as **overlap detection** not exact match
- ✅ A week is shown if ANY day falls within the filter range
- ✅ This matches real-world expectations (partial weeks count)

### Filter Behavior

- ✅ Date range filter = **Server-side** (API query params)
- ✅ Status filter = **Client-side** (filters API results)
- ✅ Both filters can be combined
- ✅ Changing date range triggers new API call
- ✅ Changing status filter just re-filters current results

### Pagination

- ✅ Works with filtered results
- ✅ Resets to page 1 when filters change
- ✅ Total pages calculated from filtered count

---

## 🚀 Future Enhancements

Potential improvements for production:

1. **Saved Filters**
   - Save favorite filter combinations
   - Quick access to common views

2. **Advanced Filters**
   - Filter by week number
   - Filter by total hours range
   - Multiple status selection

3. **Export Functionality**
   - Export filtered results to CSV
   - Print-friendly view

4. **Real-time Updates**
   - Auto-refresh when entries change
   - WebSocket updates for team views

5. **Filter Presets**
   - "Needs attention" (incomplete + missing)
   - "This week"
   - "Pending approval"

---

## 📊 Summary

**What Changed**:
1. ✅ Status now calculated based on hours (0 = MISSING, 1-39 = INCOMPLETE, 40+ = COMPLETED)
2. ✅ Date range filtering shows all weeks that overlap with selected range
3. ✅ Custom date picker allows any date range selection
4. ✅ Status shown with hours in table for clarity
5. ✅ Both filters work together seamlessly

**Files Modified**:
- `/lib/mock-data.ts` - Added date fields
- `/pages/api/timesheets/index.ts` - Dynamic status + date filtering
- `/pages/dashboard/index.tsx` - Enhanced UI with filters

**Result**:
A powerful filtering system that meets all requirements and provides excellent user experience! 🎉
