# IRFO - Investor Registration and Service Solution for Fund Operation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Features](#features)
- [User Manual](#user-manual)
- [Functional Requirements](#functional-requirements)
- [API Integration](#api-integration)
- [Development](#development)

---

## 🎯 Project Overview

**IRFO (Investor Registration and Service Solution for Fund Operation)** is a comprehensive web-based application designed to manage investment fund operations, investor registrations, and related administrative tasks. The system provides a centralized platform for managing fund allocations, unit holders, transactions, and various administrative setups.

**Version:** 0.0.0  
**Author:** IRFO Development Team  
**Last Updated:** 2025

---

## 🛠 Technology Stack

### Frontend Technologies
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.0.4** - Build tool
- **Tailwind CSS 4.1.11** - Styling
- **TanStack React Table 8.21.3** - Data tables
- **Recharts 3.1.0** - Data visualization
- **React Router DOM 7.7.1** - Routing
- **React DatePicker 8.4.0** - Date selection

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript linting

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation Steps

1. **Clone the repository** (if using version control):
```bash
   git clone <repository-url>
cd irfo-project
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

5. **Preview production build**:
```bash
npm run preview
```

The application will be available at `http://localhost:5173` (default Vite port).

---

## 📁 Project Structure

```
irfo-project/
├── public/                     # Static assets
│   └── vite.svg
├── src/
│   ├── assets/                 # Images and icons
│   │   └── img/
│   ├── components/             # Reusable components
│   │   ├── DataTable.tsx       # Table component
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── Sidebar.tsx         # Side navigation
│   │   └── SystemCalendar.tsx  # Calendar component
│   ├── pages/                  # Main pages
│   │   ├── Home.tsx           # Dashboard page
│   │   ├── Home1.tsx          # Alternate dashboard
│   │   ├── Setup.tsx          # Setup page (30 modules)
│   │   └── RegistrationSetup.tsx # Registration setup
│   ├── App.tsx                 # Root component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── dist/                       # Production build output
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript config
└── vite.config.ts             # Vite configuration
```

---

## ✨ Features

### 1. Dashboard (Home Page)
- **Interactive Pie Charts**: Visualize fund distribution (Unit-wise and Market Value)
- **Creation/Redeem Pricing**: Display real-time creation and redemption prices
- **Fund Data Table**: View and search through fund records
- **Date Selection**: Filter data by specific dates
- **View Mode Toggle**: Switch between "Unit Wise" and "Fund Size" views
- **Responsive Design**: Mobile, tablet, and desktop friendly

### 2. Setup Page (30 Modules)
Comprehensive configuration system with the following modules:

#### Core Setup Modules
1. **Bank** - Bank code, description, address, district, swift code, branch number
2. **Transaction Type** - Transaction code, type, name, last transaction number
3. **System Calendar** - Interactive calendar for managing system dates
4. **Trustees** - Trustee code, name, address, contact information
5. **Custodian** - Custodian details and active status
6. **Postal Area** - Postal code management
7. **Dividend Type** - Dividend type configuration
8. **Funds** - Fund management with launch dates, maturity, IPO dates
9. **Company** - Company information and settings

#### Advanced Features
- **Promotional Activity** - Promotion code and details
- **Other Charges** - Charge code management
- **Unit Fee Codes** - Fee structure setup
- **Agency Management** - Agency type, agency, sub-agency
- **Territory & Commission** - Territory, commission type, commission level
- **Agent Management** - Agent assignment and commission definitions
- **Institution Management** - Institution category and details
- **Document Management** - Document setup
- **Customer Zone** - Zone configuration
- **Join Sale Agent** - Sale agent details
- **Product Type** - Product categorization
- **Title** - Title code and description

### 3. Registration Setup Page
- Four-card interface for registration management
- Application Entry
- Registration Unit Holders Profiles
- Unit Holders Accounts
- Holder Document Handling

### 4. Common Features Across Modules
- **CRUD Operations**: Create, Read, Update, Delete functionality
- **Advanced Tables**: Sorting, filtering, pagination, search
- **Form Validation**: Input validation and error handling
- **Modal Interfaces**: Clean modal-based UI
- **Print Functionality**: Print reports and data
- **Clear Functionality**: Reset form data
- **Save Operations**: Save changes to database

---

## 📖 User Manual

### Getting Started

#### Logging In
1. Navigate to the application URL
2. The system displays the dashboard by default
3. User information is shown in the top-right corner

#### Navigation
- **Sidebar**: Access different modules (Home, Setup, Registration Setup)
- **Navbar**: System branding and user menu (logout)
- **Footer**: System information (company, user, database, date, IP)

---

### Dashboard Usage

#### Viewing Fund Distribution
1. The main dashboard shows an interactive pie chart
2. **Toggle View Mode**: Switch between "Unit Wise" and "Fund Size" using the toggle switch
3. **View Legend**: Fund names are listed with color indicators
4. **Hover Tooltip**: Hover over pie slices to see detailed information
5. **Creation/Redeem Prices**: Displayed prominently at the top

#### Selecting Dates
1. Locate the date selection section
2. Click on the date input field
3. Select your desired date from the calendar
4. The chart and data automatically update
5. Note: Future dates are restricted

#### Using the Fund Data Table
1. Scroll down to view the data table
2. **Search**: Use the search box to filter records
3. **Sort**: Click column headers to sort
4. **Pagination**: Navigate through pages using pagination controls
5. **Record Count**: Total records displayed at the bottom

---

### Setup Page Usage

#### Opening a Module
1. Navigate to Setup page from sidebar
2. Browse the grid of module cards (30 modules)
3. Click on any module card to open its modal
4. Each module has an icon for easy identification

#### Working with Modals

**New Record**
1. Click the "New" button (+ icon)
2. Fill in the form fields
3. Click "Save" to create the record

**Viewing Records**
1. Open a module to view the data table
2. Double-click on a row to edit
3. Double-click to select a value from the table

**Editing Records**
1. Double-click on a table row or click "New"
2. Enable "New" button to make fields editable
3. Modify the values
4. Click "Save" to update

**Deleting Records**
1. Select a record from the table
2. Click the "Delete" button (🗑️ icon)
3. Confirm deletion

**Printing**
1. Click the "Print" button (🖨️ icon)
2. Use browser print dialog to save or print

**Clearing Form**
1. Click the "Clear" button (🗑️ icon)
2. All form fields reset

#### Special Modules

**System Calendar**
- Interactive calendar popup
- Manage system dates and holidays
- Set blocking dates
- Calendar view for easy navigation

**Funds Module**
- Comprehensive fund configuration
- Fund codes and names
- Manager, trustee, custodian assignment
- Minimum values and units
- Launch date, maturity date, IPO dates
- Certificate and portfolio configuration

**Company Module**
- Company code and name
- Full address (postal code, street, town, city)
- Contact information (telephone, fax, email, website)
- Approval settings

---

### Registration Setup Usage

#### Accessing Registration Setup
1. Click "Registration Setup" from the sidebar
2. Four module cards appear:
   - 📨 Application Entry
   - 📝 Registration Unit Holders Profiles
   - 👤 Unit Holders Accounts
   - 📂 Holder Document Handling

#### Working with Registration Modules
1. Click on any of the four cards
2. A modal opens with that module's interface
3. Follow the same workflow as Setup page modules
4. Use New, Save, Delete, Print, Clear buttons
5. Manage data in the integrated data table

---

## 📋 Functional Requirements

### 1. Dashboard Requirements

#### FR-001: Fund Distribution Visualization
- **Description**: Display fund allocation data in interactive pie charts
- **Priority**: High
- **Acceptance Criteria**:
  - Pie chart shows 10 fund segments
  - User can toggle between unit-wise and market value views
  - Hover over slices displays detailed information
  - Chart updates when date is changed
  - Chart is responsive to different screen sizes

#### FR-002: Price Display
- **Description**: Show creation and redemption prices
- **Priority**: High
- **Acceptance Criteria**:
  - Prices are fetched from API endpoint
  - Prices update with date selection
  - Prices animate when changed
  - Format as LKR currency

#### FR-003: Data Table
- **Description**: Display fund records in a sortable, searchable table
- **Priority**: High
- **Acceptance Criteria**:
  - Table shows all fund records
  - Search functionality across all columns
  - Column sorting enabled
  - Pagination controls present
  - Record count displayed
  - Responsive to screen size

#### FR-004: Date Selection
- **Description**: Allow users to filter data by date
- **Priority**: Medium
- **Acceptance Criteria**:
  - Date picker available
  - Future dates disabled
  - Selected date displayed in readable format
  - Changing date updates all related data

---

### 2. Setup Module Requirements

#### FR-005: Module Management
- **Description**: Provide 30 configurable modules
- **Priority**: High
- **Acceptance Criteria**:
  - Each module opens in a modal
  - Module icons are visible
  - Module titles are clear
  - Modules are organized in a grid

#### FR-006: Form Management
- **Description**: CRUD operations for all modules
- **Priority**: High
- **Acceptance Criteria**:
  - Create new records with "New" button
  - Edit existing records by double-clicking table
  - Delete records with confirmation
  - Save changes to database
  - Clear form fields
  - Form validation in place

#### FR-007: Data Table Features
- **Description**: Advanced table functionality
- **Priority**: High
- **Acceptance Criteria**:
  - Sorting by multiple columns
  - Global search filter
  - Pagination (3, 5, 10, 15 items per page)
  - Row selection
  - Double-click to select value
  - Responsive design

#### FR-008: Field Validation
- **Description**: Validate form inputs
- **Priority**: Medium
- **Acceptance Criteria**:
  - Required fields marked
  - Format validation (codes, dates, emails)
  - Error messages displayed
  - Prevent invalid submissions
  - Disable controls when not editable

---

### 3. Bank Module Specific Requirements

#### FR-009: Bank Code Management
- **Description**: Manage bank codes
- **Priority**: High
- **Fields**:
  - **Bank Code**: Text input, 7 characters max, required
  - **Description**: Text input, required
  - **Address**: Textarea, format: "No, Street Name, Town, City"
  - **District**: Dropdown selection, required
  - **Swift Code**: Read-only field, auto-populated
  - **Branch No**: Text input, required

#### FR-010: Bank Data Table
- **Description**: Display and manage bank records
- **Priority**: High
- **Acceptance Criteria**:
  - Table shows all bank records
  - Search by code, description, address
  - Sort by any column
  - Pagination enabled
  - Row selection for operations

---

### 4. Transaction Type Requirements

#### FR-011: Transaction Configuration
- **Description**: Manage transaction types
- **Priority**: High
- **Fields**:
  - **Transaction Code**: Alphanumeric code
  - **Transaction Type**: Dropdown (Purchase, Sale, Dividend, Transfer)
  - **Transaction Name**: Text input
  - **Last Transaction Number**: Auto-increment

#### FR-012: Transaction Validation
- **Description**: Validate transaction entries
- **Priority**: Medium
- **Acceptance Criteria**:
  - Unique transaction codes
  - Valid transaction types only
  - Sequential transaction numbers
  - Historical record keeping

---

### 5. System Calendar Requirements

#### FR-013: Calendar Management
- **Description**: Manage system dates and holidays
- **Priority**: High
- **Acceptance Criteria**:
  - Interactive calendar popup
  - Mark holidays and blocked dates
  - Set working days
  - Date-based restrictions
  - Visual indication of blocked dates

---

### 6. Fund Management Requirements

#### FR-014: Fund Configuration
- **Description**: Comprehensive fund setup
- **Priority**: High
- **Fields**:
  - Fund code and name
  - Manager, trustee, custodian selection
  - Launch date, maturity date
  - IPO start/end dates
  - Minimum values and units
  - Certificate type
  - Portfolio code

#### FR-015: Fund Validation
- **Description**: Validate fund data
- **Priority**: High
- **Acceptance Criteria**:
  - IPO dates within launch date range
  - Maturity date after launch date
  - Positive minimum values
  - Valid portfolio codes

---

### 7. User Interface Requirements

#### FR-016: Responsive Design
- **Description**: Support multiple screen sizes
- **Priority**: High
- **Acceptance Criteria**:
  - Mobile-friendly layout (< 768px)
  - Tablet optimization (768px - 1024px)
  - Desktop layout (> 1024px)
  - Touch-friendly controls
  - Adaptive navigation

#### FR-017: Accessibility
- **Description**: Ensure accessibility standards
- **Priority**: Medium
- **Acceptance Criteria**:
  - Keyboard navigation
  - ARIA labels
  - Screen reader support
  - Focus indicators
  - Color contrast compliance

#### FR-018: Performance
- **Description**: Optimize application performance
- **Priority**: High
- **Acceptance Criteria**:
  - Page load time < 2 seconds
  - Smooth animations
  - Efficient data fetching
  - Lazy loading for images
  - Minimal re-renders

---

### 8. Security Requirements

#### FR-019: Authentication
- **Description**: Secure user authentication
- **Priority**: High
- **Acceptance Criteria**:
  - User login/logout
  - Session management
  - Protected routes
  - Auto-logout on inactivity

#### FR-020: Data Protection
- **Description**: Protect sensitive data
- **Priority**: High
- **Acceptance Criteria**:
  - HTTPS only
  - Input sanitization
  - SQL injection prevention
  - XSS protection
  - CSRF tokens

---

### 9. Reporting Requirements

#### FR-021: Print Functionality
- **Description**: Print reports and data
- **Priority**: Medium
- **Acceptance Criteria**:
  - Print button in each module
  - Formatted print layout
  - All data visible in print
  - Print preview available

#### FR-022: Export Capabilities
- **Description**: Export data to external formats
- **Priority**: Low (Future Enhancement)
- **Acceptance Criteria**:
  - Export to PDF
  - Export to Excel
  - Export to CSV
  - Custom format selection

---

## 🔌 API Integration

### Current API Endpoints

The application expects the following API endpoints to be available:

#### Dashboard APIs
```
GET /api/dashboard/funds/names
GET /api/dashboard/funds/data?date={date}&type={unit|market}
GET /api/dashboard/prices?date={date}
GET /api/dashboard/fund-records
```

#### Setup APIs (For each module)
```
GET /api/setup/{module}/data
GET /api/setup/{module}/data/{id}
POST /api/setup/{module}/create
PUT /api/setup/{module}/update/{id}
DELETE /api/setup/{module}/delete/{id}
```

#### Module Examples
- `/api/setup/bank/data`
- `/api/setup/transaction-type/data`
- `/api/setup/trustees/data`
- `/api/setup/funds/data`
- etc.

### Authentication
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/user
```

### Backend Integration Notes

**Current Status**: The application includes mock data and simulated API calls. These need to be replaced with actual backend API endpoints.

**TODO**: 
- Implement real API calls using `fetch()` or `axios`
- Add proper error handling for API failures
- Implement loading states
- Add request/response interceptors
- Handle authentication tokens

---

## 👨‍💻 Development

### Running the Development Server
```bash
npm run dev
```
Application runs on `http://localhost:5173`

### Building for Production
```bash
npm run build
```
Output directory: `dist/`

### Linting
```bash
npm run lint
```

### Code Style
- Follow ESLint rules
- Use TypeScript for type safety
- Component-based architecture
- Functional components with hooks
- CSS modules for styling

### File Naming Conventions
- Components: PascalCase (e.g., `DataTable.tsx`)
- Files: camelCase (e.g., `setup.tsx`)
- Styles: camelCase (e.g., `App.css`)

---

## 🤝 Contributing

### Development Workflow
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Run linter
5. Submit a pull request

### Commit Conventions
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📝 License

Copyright © 2024 IRFO Development Team. All rights reserved.

---

## 🆘 Support

For support and queries:
- **Email**: support@irfo.com
- **Documentation**: Available in the `/docs` directory
- **Issues**: Report bugs via issue tracker

---

## 📅 Version History

- **0.0.0** (Current) - Initial release
  - Dashboard with pie charts
  - Setup page with 30 modules
  - Registration setup with 4 modules
  - Responsive design
  - Full CRUD operations
  - Advanced data tables

---

**Last Updated**: 2024  
**Status**: Active Development
