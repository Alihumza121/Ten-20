# Data Storage and Fetching - Complete Guide

## 📍 Where Data is Stored

### 1. **Initial Mock Data** (Static/Read-Only)
**Location**: `/lib/mock-data.ts`

This file contains the initial seed data:

```typescript
// Static timesheets (8 weeks)
export const mockTimesheets: Timesheet[] = [
  { id: '1', userId: '1', weekNumber: 1, ... },
  { id: '2', userId: '1', weekNumber: 2, ... },
  // ... 8 total timesheets
];

// Static entries (15 initial entries)
export const mockTimesheetEntries: TimesheetEntry[] = [
  { id: '1', timesheetId: '4', date: '2024-01-21', ... },
  // ... 15 total entries
];
```

**Characteristics**:
- ✅ Read-only for timesheets list
- ✅ Used as seed data for entries
- ✅ Persists across server restarts (hardcoded)

---

### 2. **Dynamic Entries Storage** (In-Memory/Runtime)
**Location**: `/pages/api/timesheets/[id]/entries.ts` (lines 6-8)

```typescript
// In-memory storage for new entries (simulating a database)
let entriesStore = [...mockTimesheetEntries];  // Starts with mock data
let nextId = entriesStore.length + 1;          // Auto-increment ID
```

**Characteristics**:
- ✅ Starts with mock data
- ✅ New entries added here (POST)
- ✅ Entries updated here (PUT)
- ✅ Entries deleted here (DELETE)
- ⚠️ **Resets on server restart** (in-memory only)

---

## 🔄 How Data is Fetched

### Flow Diagram

```
Component (Frontend)
    ↓ fetch('/api/timesheets')
API Route (/pages/api/timesheets/index.ts)
    ↓ reads from mockTimesheets
Mock Data (/lib/mock-data.ts)
    ↓ filters by userId
    ↓ returns JSON
Component receives data
```

---

## 📥 Fetching Timesheets List

### Frontend Component
**File**: `/pages/dashboard/index.tsx` (lines 24-41)

```typescript
const fetchTimesheets = async () => {
  try {
    setIsLoading(true);
    const response = await fetch('/api/timesheets');  // ← API call
    
    if (!response.ok) {
      throw new Error('Failed to fetch timesheets');
    }

    const data = await response.json();  // ← Receive data
    setTimesheets(data);                 // ← Store in component state
  } catch (err) {
    setError('Failed to load timesheets. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
```

### API Route Handler
**File**: `/pages/api/timesheets/index.ts` (lines 16-21)

```typescript
if (req.method === 'GET') {
  // Filter timesheets by user
  const userTimesheets = mockTimesheets.filter(
    (ts) => ts.userId === session.user.id  // ← Filter by logged-in user
  );
  return res.status(200).json(userTimesheets);  // ← Return JSON
}
```

**Data Source**: `mockTimesheets` from `/lib/mock-data.ts`

---

## 📥 Fetching Timesheet Entries

### Frontend Component
**File**: `/pages/dashboard/timesheet/[id].tsx` (lines 20-35)

```typescript
const fetchEntries = async () => {
  try {
    setIsLoading(true);
    const response = await fetch(`/api/timesheets/${id}/entries`);  // ← API call
    
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }

    const data = await response.json();  // ← Receive data
    setEntries(data);                     // ← Store in component state
  } catch (err) {
    setError('Failed to load timesheet entries.');
  } finally {
    setIsLoading(false);
  }
};
```

### API Route Handler
**File**: `/pages/api/timesheets/[id]/entries.ts` (lines 22-27)

```typescript
if (req.method === 'GET') {
  // Get all entries for this timesheet
  const entries = entriesStore.filter(
    (entry) => entry.timesheetId === timesheetId  // ← Filter by timesheet ID
  );
  return res.status(200).json(entries);  // ← Return JSON
}
```

**Data Source**: `entriesStore` (in-memory array in the same file)

---

## ✏️ Creating New Entries

### Frontend Component
**File**: `/components/TimesheetEntryModal.tsx` (lines 95-115)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const response = await fetch(`/api/timesheets/${timesheetId}/entries`, {
    method: 'POST',  // ← POST request
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date, projectName, typeOfWork, description, hours
    }),
  });
  
  if (!response.ok) throw new Error('Failed to save entry');
  onClose(true);  // ← Refresh entries list
};
```

### API Route Handler
**File**: `/pages/api/timesheets/[id]/entries.ts` (lines 30-49)

```typescript
if (req.method === 'POST') {
  const { date, projectName, typeOfWork, description, hours } = req.body;
  
  const newEntry: TimesheetEntry = {
    id: String(nextId++),              // ← Auto-generate ID
    timesheetId: timesheetId as string,
    date, projectName, typeOfWork, description,
    hours: Number(hours),
  };
  
  entriesStore.push(newEntry);        // ← Add to in-memory store
  return res.status(201).json(newEntry);
}
```

**Storage**: Added to `entriesStore` array (in-memory)

---

## 🔄 Updating Entries

### API Route Handler
**File**: `/pages/api/timesheets/[id]/entries.ts` (lines 52-74)

```typescript
if (req.method === 'PUT') {
  const { entryId, date, projectName, typeOfWork, description, hours } = req.body;
  
  const entryIndex = entriesStore.findIndex(
    (entry) => entry.id === entryId && entry.timesheetId === timesheetId
  );
  
  entriesStore[entryIndex] = {        // ← Update in-memory store
    ...entriesStore[entryIndex],
    date, projectName, typeOfWork, description,
    hours: Number(hours),
  };
  
  return res.status(200).json(entriesStore[entryIndex]);
}
```

**Storage**: Modified in `entriesStore` array

---

## 🗑️ Deleting Entries

### API Route Handler
**File**: `/pages/api/timesheets/[id]/entries.ts` (lines 77-90)

```typescript
if (req.method === 'DELETE') {
  const { entryId } = req.body;
  
  const entryIndex = entriesStore.findIndex(
    (entry) => entry.id === entryId && entry.timesheetId === timesheetId
  );
  
  entriesStore.splice(entryIndex, 1);  // ← Remove from in-memory store
  return res.status(200).json({ message: 'Entry deleted successfully' });
}
```

**Storage**: Removed from `entriesStore` array

---

## 📊 Data Storage Summary

| Data Type | Storage Location | Persistence | Read/Write |
|-----------|-----------------|-------------|------------|
| **Timesheets** | `/lib/mock-data.ts` → `mockTimesheets` | ✅ Permanent (hardcoded) | Read-only |
| **Entries (Initial)** | `/lib/mock-data.ts` → `mockTimesheetEntries` | ✅ Permanent (hardcoded) | Read-only (seed) |
| **Entries (Runtime)** | `/pages/api/timesheets/[id]/entries.ts` → `entriesStore` | ⚠️ Temporary (in-memory) | Read/Write |
| **Users** | `/lib/mock-data.ts` → `mockUsers` | ✅ Permanent (hardcoded) | Read-only |

---

## 🔍 Key Points

### 1. **Timesheets are Static**
- Stored in `/lib/mock-data.ts`
- Never modified (read-only)
- Always return the same 8 weeks
- Filtered by `userId` in API route

### 2. **Entries are Dynamic**
- Initial entries from `/lib/mock-data.ts` (seed data)
- New entries stored in `entriesStore` (in-memory)
- CRUD operations modify `entriesStore`
- **⚠️ Data resets when server restarts**

### 3. **API Pattern**
All data fetching follows this pattern:
```
Component → fetch('/api/...') → API Route → Mock Data/Store → JSON Response → Component State
```

### 4. **No Direct Component Access**
- ✅ Components NEVER import mock data directly
- ✅ All data access through API routes
- ✅ Follows requirement: "Do not call mock data directly on components"

---

## 🔄 Complete Data Flow Example

### Scenario: User views Week 4 timesheet

1. **User clicks "View" on Week 4**
   - Component: `/pages/dashboard/index.tsx`
   - Navigates to `/dashboard/timesheet/4`

2. **Component loads**
   - Component: `/pages/dashboard/timesheet/[id].tsx`
   - Calls `fetchEntries()` on mount

3. **API Request**
   ```typescript
   fetch('/api/timesheets/4/entries')
   ```

4. **API Handler processes**
   - File: `/pages/api/timesheets/[id]/entries.ts`
   - Filters `entriesStore` where `timesheetId === '4'`
   - Returns matching entries

5. **Component receives data**
   - Updates `entries` state
   - Groups by date
   - Renders UI

6. **User adds new entry**
   - Fills form in modal
   - Submits → POST to `/api/timesheets/4/entries`
   - API adds to `entriesStore`
   - Component refreshes list

---

## 🚨 Important Notes

### Data Persistence

**✅ Persists**:
- Timesheets list (hardcoded)
- Initial entries (hardcoded)
- User data (hardcoded)

**⚠️ Temporary**:
- New entries created via API
- Updated entries
- Deleted entries

**Why?** This is a demo/mock implementation. In production, you would:
- Replace `entriesStore` with database queries
- Replace `mockTimesheets` with database queries
- Use proper persistence layer (PostgreSQL, MongoDB, etc.)

### Migration to Database

To move to real database:

1. **Install database client** (e.g., Prisma, Mongoose)
2. **Replace mock data imports** with database queries
3. **Update API routes** to use database instead of arrays
4. **Keep same API structure** (components don't need changes)

Example:
```typescript
// Before (mock)
const entries = entriesStore.filter(...);

// After (database)
const entries = await db.timesheetEntry.findMany({
  where: { timesheetId }
});
```

---

## 📝 Code References

| Operation | Frontend File | API File | Data Source |
|-----------|--------------|----------|-------------|
| **List Timesheets** | `pages/dashboard/index.tsx:24` | `pages/api/timesheets/index.ts:16` | `lib/mock-data.ts:45` |
| **Get Entries** | `pages/dashboard/timesheet/[id].tsx:20` | `pages/api/timesheets/[id]/entries.ts:22` | `pages/api/timesheets/[id]/entries.ts:7` |
| **Create Entry** | `components/TimesheetEntryModal.tsx:95` | `pages/api/timesheets/[id]/entries.ts:30` | `pages/api/timesheets/[id]/entries.ts:7` |
| **Update Entry** | `components/TimesheetEntryModal.tsx:95` | `pages/api/timesheets/[id]/entries.ts:52` | `pages/api/timesheets/[id]/entries.ts:7` |
| **Delete Entry** | `pages/dashboard/timesheet/[id].tsx:75` | `pages/api/timesheets/[id]/entries.ts:77` | `pages/api/timesheets/[id]/entries.ts:7` |

---

## ✅ Summary

**Storage**:
- Timesheets: Static in `/lib/mock-data.ts`
- Entries: Dynamic in `entriesStore` (in-memory array)

**Fetching**:
- All through API routes (`/api/timesheets/*`)
- Components never access mock data directly
- API routes handle filtering and CRUD operations

**Pattern**:
```
Component → API Route → Data Source → JSON → Component State
```

This architecture allows easy migration to a real database later! 🚀
