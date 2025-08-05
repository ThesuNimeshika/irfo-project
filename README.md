# React + TypeScript + Vite
# IRFO Project - Investor Registration and Service Solution for Fund Operation

A modern React + TypeScript + Vite application for managing investor registration and fund operations with a beautiful, responsive UI.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Pages and Components](#pages-and-components)
- [Development Workflow](#development-workflow)
- [Git Workflow](#git-workflow)
- [Technologies Used](#technologies-used)
- [Last Updated](#last-updated)

## ✨ Features

- **Modern UI/UX**: Beautiful gradient designs with responsive layouts
- **Interactive Dashboard**: Real-time pie charts and data visualization
- **Comprehensive Setup System**: 30+ configuration modules for fund operations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript Support**: Full type safety and better development experience
- **Data Tables**: Advanced table components with sorting, filtering, and pagination
- **Date Management**: Integrated calendar and date picker functionality

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for version control)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd irfo-project
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏃‍♂️ Running the Project

### Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
irfo-project/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and static files
│   ├── components/        # Reusable UI components
│   │   ├── DataTable.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── SystemCalendar.tsx
│   ├── pages/            # Main application pages
│   │   ├── Home.tsx      # Dashboard page
│   │   ├── Home1.tsx     # Alternative home page
│   │   └── Setup.tsx     # Configuration page
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 📄 Pages and Components

### 🏠 Home Page (`/`)
- **Interactive Dashboard** with real-time fund data visualization
- **Pie Chart** showing fund distribution (Unit-wise vs Market-wise)
- **Date Selection** for historical data viewing
- **Data Table** displaying fund records with pagination
- **Responsive Design** that adapts to mobile and desktop

**Key Features:**
- Dynamic pie chart with hover effects and tooltips
- Toggle between unit-wise and market-wise views
- Date picker for historical data analysis
- Real-time data fetching from backend API
- Beautiful gradient backgrounds and animations

### ⚙️ Setup Page (`/setup`)
- **30+ Configuration Modules** for comprehensive system setup
- **Modal-based Interface** for each configuration type
- **Advanced Data Tables** with sorting, filtering, and pagination
- **Form Management** with validation and data persistence

**Configuration Modules Include:**
- 🏦 Bank Management
- 🔄 Transaction Types
- 📅 System Calendar
- 👔 Trustees
- 🗄️ Custodian
- 📮 Postal Areas
- 💸 Dividend Types
- 💰 Funds
- 🏢 Company Information
- 🎉 Promotional Activities
- 💳 Other Charges
- 🧾 Unit Fee Codes
- 🏷️ Agency Types
- 🏬 Agencies
- 🏪 Sub Agencies
- 🧑‍💼 Agents
- 🗺️ Territories
- 📊 Commission Types
- 📈 Commission Levels
- 📝 Agent Commission Definitions
- 🔗 Assign Agents to Commission Definition
- 🏛️ Institution Categories
- 📄 Documents Setup
- 🏫 Institutions
- 🚫 Blocking Categories
- 🌐 Customer Zones
- 🤝 Join Sale Agents
- 💬 Compliance Message Setup
- 📦 Product Types
- 🔔 Titles

### 🧩 Components

#### Navbar Component
- **Fixed Header** with gradient background
- **Company Logo** and system title
- **User Menu** with logout functionality
- **Responsive Design** for mobile devices

#### Sidebar Component
- **Navigation Menu** for different sections
- **Collapsible Design** for mobile optimization
- **Icon-based Navigation** for better UX

#### DataTable Component
- **Advanced Table Features**: Sorting, filtering, pagination
- **Responsive Design**: Adapts to different screen sizes
- **Custom Styling**: Beautiful table design with hover effects

#### SystemCalendar Component
- **Calendar Interface** for date management
- **Holiday Marking** and business day tracking
- **Integration** with setup modules

## 🛠️ Development Workflow

### Creating a New React Project

1. **Create Vite Project**
```bash
npm create vite@latest my-project -- --template react-ts
cd my-project
```

2. **Install Dependencies**
```bash
npm install
```

3. **Add Additional Dependencies**
```bash
npm install react-router-dom react-icons recharts @tanstack/react-table react-datepicker tailwindcss
```

4. **Setup TypeScript**
```bash
npm install -D typescript @types/react @types/react-dom
```

5. **Initialize Git Repository**
```bash
git init
git add .
git commit -m "Initial commit: React + TypeScript + Vite setup"
```

### Project Development Steps

1. **Setup Project Structure**
   - Create component folders
   - Setup routing with React Router
   - Configure TypeScript

2. **Create Components**
   - Build reusable UI components
   - Implement responsive design
   - Add TypeScript interfaces

3. **Implement Pages**
   - Create main application pages
   - Add routing configuration
   - Implement page-specific logic

4. **Add Styling**
   - Configure Tailwind CSS
   - Create custom CSS classes
   - Implement responsive design

5. **Testing and Optimization**
   - Test on different devices
   - Optimize performance
   - Fix any issues

## 🔄 Git Workflow

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit: Project setup"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature: description"

# Push to remote
git push origin feature/new-feature

# Create pull request (on GitHub/GitLab)
# Merge after review

# Update main branch
git checkout main
git pull origin main
```

### Commit Message Convention
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add tests
chore: maintenance tasks
```

## 🛠️ Technologies Used

### Frontend
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.0.4** - Build tool and dev server
- **React Router DOM 7.7.1** - Client-side routing
- **Tailwind CSS 4.1.11** - Utility-first CSS framework

### UI Components
- **React Icons 5.5.0** - Icon library
- **Recharts 3.1.0** - Chart components
- **React DatePicker 8.4.0** - Date selection
- **TanStack React Table 8.21.3** - Advanced table functionality

### Development Tools
- **ESLint 9.30.1** - Code linting
- **TypeScript ESLint 8.35.1** - TypeScript linting

## 📅 Last Updated

**Last Work Date**: December 2024

**Recent Updates**:
- ✅ Complete project setup with React + TypeScript + Vite
- ✅ Implemented responsive navigation and sidebar
- ✅ Created interactive dashboard with pie charts
- ✅ Built comprehensive setup system with 30+ modules
- ✅ Added advanced data tables with sorting and filtering
- ✅ Implemented date management and calendar functionality
- ✅ Added beautiful gradient designs and animations
- ✅ Optimized for mobile and desktop responsiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using React, TypeScript, and Vite**
