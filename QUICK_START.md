# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

If you encounter port permission issues:
```bash
npx next dev -p 3002 -H localhost
```

### 3. Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

---

## Login Credentials

Use these demo credentials:

**Email**: `john.doe@example.com`  
**Password**: `password123`

---

## What You Can Do

### 1. View Timesheets
- See all your weekly timesheets
- Filter by status or date range
- Paginate through entries

### 2. View Timesheet Details
- Click "View", "Update", or "Create" on any timesheet
- See daily entries grouped by date
- Track your progress (hours logged vs expected)

### 3. Manage Entries
- **Add Entry**: Click "+ Add new task" button
- **Edit Entry**: Click the three dots menu, select "Edit"
- **Delete Entry**: Click the three dots menu, select "Delete"

### 4. Fill Out Entry Form
Required fields:
- Date
- Project (dropdown)
- Type of Work (dropdown)
- Task Description (min 5 characters)
- Hours (0.5 - 24)

---

## Project Structure

```
├── pages/
│   ├── login.tsx              # Login page
│   ├── dashboard/
│   │   ├── index.tsx          # Timesheets list
│   │   └── timesheet/[id].tsx # Timesheet detail
│   └── api/                   # API routes
├── components/
│   ├── DashboardLayout.tsx    # Main layout
│   └── TimesheetEntryModal.tsx # Add/Edit modal
├── lib/
│   └── mock-data.ts           # Mock data
└── styles/
    └── globals.css            # Tailwind styles
```

---

## Key Features

✅ Secure authentication with next-auth  
✅ Responsive design (mobile, tablet, desktop)  
✅ Form validation with error messages  
✅ CRUD operations for timesheet entries  
✅ Real-time progress tracking  
✅ Status filtering and pagination  
✅ Clean, modern UI  

---

## Build for Production

```bash
npm run build
npm start
```

Or deploy to Vercel:

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Deploy on vercel.com
# Import your GitHub repo
# Add environment variables
# Deploy!
```

---

## Need Help?

- **Setup Issues**: See [README.md](README.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Requirements**: See [REQUIREMENTS_CHECKLIST.md](REQUIREMENTS_CHECKLIST.md)
- **Verification**: See [VERIFICATION.md](VERIFICATION.md)

---

## Demo Flow

1. **Login** with demo credentials
2. **View Dashboard** - See list of 8 weeks
3. **Click Week 4** - See detailed entries
4. **Add New Task** - Fill form and save
5. **Edit Entry** - Click menu → Edit
6. **Delete Entry** - Click menu → Delete
7. **Filter** - Try different status filters
8. **Sign Out** - Click your name → Sign out

Enjoy exploring the Ticktock Timesheet App! 🚀
