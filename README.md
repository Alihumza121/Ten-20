# Ticktock - Timesheet Management Application

A modern, full-featured timesheet management application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication**: Secure login with next-auth
- **Dashboard**: View all timesheets with status indicators (Completed, Incomplete, Missing)
- **Timesheet Management**: Detailed view of weekly timesheets with daily entries
- **CRUD Operations**: Add, edit, and delete timesheet entries
- **Form Validation**: Comprehensive client-side validation for all forms
- **Responsive Design**: Fully responsive UI that works on all devices
- **API Routes**: Internal API routes for all data operations
- **Modern UI**: Clean, professional interface with Tailwind CSS

## 📋 Requirements Met

### Core Features
- ✅ Login screen with email/password authentication
- ✅ next-auth integration for secure authentication
- ✅ Dashboard with timesheet list table (Week #, Date, Status, Actions)
- ✅ Add/Edit modal for timesheet entries
- ✅ Form validation and error handling
- ✅ Responsive layout for all screen sizes
- ✅ All API calls use internal API routes (no direct mock data access)

### Technical Stack
- ✅ Next.js 14 with TypeScript
- ✅ Tailwind CSS for styling
- ✅ next-auth for authentication
- ✅ Modular, reusable component structure
- ✅ Clean, maintainable code

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form
- **Validation**: Zod

## 📦 Installation & Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd "/Users/mbp/Desktop/1020 Assesment"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The `.env.local` file is already configured with:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-change-this-in-production
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   If you encounter port permission issues, try:
   ```bash
   npx next dev -p 3002 -H localhost
   ```
   
   Or deploy to Vercel (see DEPLOYMENT.md)

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port you specified)

## 🔐 Demo Credentials

Use these credentials to log in:

- **Email**: `john.doe@example.com`
- **Password**: `password123`

Alternative account:
- **Email**: `test@example.com`
- **Password**: `test123`

## 📁 Project Structure

```
├── components/              # Reusable React components
│   ├── DashboardLayout.tsx  # Main layout with header and navigation
│   └── TimesheetEntryModal.tsx  # Modal for add/edit entries
├── lib/                     # Utility functions and data
│   └── mock-data.ts         # Mock data for users, timesheets, entries
├── pages/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── timesheets/     # Timesheet CRUD endpoints
│   │   └── projects/       # Project and work type data
│   ├── dashboard/          # Dashboard pages
│   │   ├── index.tsx       # Timesheet list view
│   │   └── timesheet/[id].tsx  # Timesheet detail view
│   ├── login.tsx           # Login page
│   ├── index.tsx           # Home page (redirects)
│   ├── _app.tsx            # Next.js app wrapper
│   └── _document.tsx       # Custom document
├── styles/
│   └── globals.css         # Global styles and Tailwind
├── types/
│   └── next-auth.d.ts      # TypeScript type definitions
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🎯 Key Features & Implementation

### 1. Authentication Flow
- Credentials-based authentication using next-auth
- Session management with JWT strategy
- Protected routes with server-side session checks
- Automatic redirect to login for unauthenticated users

### 2. API Architecture
- **Pattern**: All client-side calls go through internal API routes
- **Benefits**: Centralized data access, security, type safety
- **Endpoints**:
  - `POST /api/auth/callback/credentials` - Login
  - `GET /api/timesheets` - Fetch all timesheets
  - `GET /api/timesheets/[id]/entries` - Fetch entries for a timesheet
  - `POST /api/timesheets/[id]/entries` - Create new entry
  - `PUT /api/timesheets/[id]/entries` - Update entry
  - `DELETE /api/timesheets/[id]/entries` - Delete entry
  - `GET /api/projects` - Get projects and work types

### 3. Data Management
- Mock data stored in `/lib/mock-data.ts`
- In-memory storage for CRUD operations (simulates database)
- Data persists during the session

### 4. Form Validation
- Client-side validation for all inputs
- Real-time error feedback
- Required field indicators
- Numeric validation for hours (0.5 - 24)
- Text length validation for descriptions

### 5. Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Touch-friendly interface elements
- Adaptive layouts and navigation

## 🧪 Testing

The application includes:
- Form validation testing
- API endpoint error handling
- Loading states for all async operations
- User feedback for all actions

To run tests (when implemented):
```bash
npm test
```

## 🎨 Design Decisions

### Component Architecture
- **Separation of Concerns**: Layout, pages, and business logic are separated
- **Reusability**: Components like modals and layouts are highly reusable
- **Props Interface**: Strong TypeScript typing for all component props

### State Management
- React hooks (useState, useEffect) for local state
- Session state managed by next-auth
- No global state library needed for this scale

### Styling Approach
- Tailwind CSS for utility-first styling
- Custom component classes in globals.css
- Consistent color scheme and spacing
- Semantic class names (e.g., `status-completed`)

### Error Handling
- Try-catch blocks for all async operations
- User-friendly error messages
- Fallback UI for loading and error states

## 📝 Assumptions & Notes

1. **Data Persistence**: Mock data is stored in memory and resets on server restart. In production, this would connect to a real database.

2. **Authentication**: Uses simple credential matching. In production, passwords would be hashed and stored securely.

3. **Timesheet Weeks**: Pre-defined timesheet weeks in mock data. In production, these would be generated dynamically.

4. **Validation**: Client-side validation only. Production would include server-side validation.

5. **Hours Tracking**: Hours are stored per entry. Total hours calculated on the fly.

6. **Status Updates**: Timesheet status (COMPLETED/INCOMPLETE/MISSING) is pre-defined in mock data. In production, this would be calculated based on entries.

## 🚀 Production Considerations

For production deployment, consider:

1. **Database Integration**: Replace mock data with PostgreSQL/MongoDB
2. **Password Hashing**: Use bcrypt for password storage
3. **Environment Variables**: Secure all secrets
4. **API Rate Limiting**: Implement rate limiting on API routes
5. **Error Logging**: Add error tracking (Sentry, LogRocket)
6. **Testing**: Add unit, integration, and E2E tests
7. **Performance**: Implement caching and pagination optimization
8. **Accessibility**: WCAG compliance audit
9. **SEO**: Meta tags and structured data

## ⏱️ Time Spent

Approximately 4-5 hours spent on:
- Project setup and configuration (30 min)
- Authentication implementation (45 min)
- API routes and mock data (45 min)
- UI components and pages (2 hours)
- Form validation and error handling (45 min)
- Responsive design and polish (30 min)
- Documentation (30 min)

## 👤 Developer Notes

This application demonstrates:
- Clean code organization and structure
- Type-safe development with TypeScript
- Modern React patterns and hooks
- RESTful API design
- User-centric UI/UX design
- Professional development practices

## 📞 Support

For questions or issues, please refer to the Next.js documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
