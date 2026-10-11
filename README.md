# SLIITStack — Library Book Reservation and Reading-Room Seat Booking App

## 1. Project Overview

SLIITStack is a mobile application developed for the IT3060 Human Computer Interaction module at the Sri Lanka Institute of Information Technology (SLIIT).

The application aims to make library services more convenient by allowing students to search for books, check availability, make reservations, join waiting lists, book reading-room seats and study rooms, and manage existing reservations. It also provides staff-facing interfaces for reservation management and issue monitoring.

The project follows the requirements and high-fidelity prototype developed during Milestones 01 and 02, with Milestone 03 focusing on mobile application implementation and evaluation.

## 2. Project Information

- **Project Name:** SLIITStack
- **Module:** IT3060 — Human Computer Interaction
- **Academic Year:** Year 3, Semester 2 — 2026
- **Assessment:** Milestone 03 — Mobile App Implementation & Final Evaluation
- **Group Number:** WE_11
- **Repository:** https://github.com/savija-fernando/sliit-stack

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| React Native | Mobile application development |
| Expo | Mobile development and runtime |
| TypeScript | Type-safe application code |
| Expo Router | File-based navigation and routing |
| Supabase | Backend services and authentication |
| PostgreSQL | Relational database |
| Git and GitHub | Version control and team collaboration |

## 4. Main Features

### Student Features

- Search for library books by title, author or keyword.
- Filter books by genre or category.
- View book details and availability information.
- Reserve available books.
- Join and view book waiting lists.
- Access seat and study-room booking options.
- View existing reservations and reservation details.
- Modify or cancel eligible reservations.
- View notifications and reservation status updates.

### Seat and Study-Room Booking

- Access reading-room seat and study-room booking options.
- Select booking dates and time slots where supported.
- Manage seat and room reservations.
- Automatically expire eligible seat and room bookings after their end time through a scheduled Supabase database job.

### Staff Features

- Access the staff dashboard.
- View and manage reservation queues.
- Review reservation statuses.
- Monitor reported issues.
- Access staff profile information.

Feature availability and behaviour should be verified against the current integrated application.

## 5. Project Structure

The repository contains the main project documentation and a `frontend` directory containing the Expo mobile application.

```text
SLIITStack/
├── frontend/
│   ├── .expo/
│   ├── .vscode/
│   ├── assets/
│   ├── scripts/
│   ├── src/
│   │   ├── app/           # Application routes and screens
│   │   ├── components/    # Reusable UI components
│   │   ├── constants/     # Shared constants
│   │   ├── features/      # Feature-specific modules
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Shared utilities and services
│   │   └── global.css     # Global styling
│   ├── .env               # Local environment variables
│   ├── .env.example       # Environment variable template
│   ├── .gitignore
│   ├── AGENTS.md
│   ├── app.json
│   ├── eslint.config.js
│   ├── expo-env.d.ts
│   ├── LICENSE
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── tsconfig.json
├── .gitignore
└── README.md              # Main project documentation
```

**Note:** The `.expo` and `node_modules` directories are generated locally and should not normally be committed to GitHub. The root README documents the overall project, while `frontend/README.md` can contain frontend-specific instructions.

## 6. Prerequisites

Install the following before running the application:

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/go/) on a compatible mobile device, or an Android emulator.
- Access to the project's Supabase instance.

## 7. Installation and Setup

### Step 1: Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/savija-fernando/sliit-stack.git
cd sliit-stack
```

### Step 2: Install Frontend Dependencies

Navigate to the frontend directory:

```bash
cd frontend
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside the `frontend` directory if one does not already exist.

Use `.env.example` as a reference for the required variable names.

For example, if these names match the application's Supabase configuration:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with the correct project URL and publishable key from the Supabase project settings.

**Important security notes:**

- Never commit your `.env` file or private credentials to GitHub.
- Do not place a Supabase service-role key or database password in the mobile application.
- Only expose public client configuration intended for use in the frontend.
- Use appropriate Supabase Row Level Security (RLS) policies to protect database records.

### Step 4: Start the Application

From the `frontend` directory, run:

```bash
npx expo start
```

Once Expo starts:

1. Scan the displayed QR code using Expo Go on a compatible device.
2. Alternatively, open the project in an available Android emulator.
3. Ensure the device and computer can communicate over the network.
4. Check the terminal output if the application fails to start.

## 8. Supabase Configuration

Supabase provides the hosted authentication and PostgreSQL database services used by the application.

Before running the project in a separate environment:

1. Obtain access to the group's Supabase project.
2. Configure the correct project URL and public client key.
3. Ensure the required database tables, relationships, functions and RLS policies are configured.
4. Confirm that authentication and database access work correctly.
5. Verify that scheduled database jobs and required extensions are configured for automatic booking expiry.

The database is hosted through Supabase. Database setup scripts and migrations should be maintained and documented according to the team's actual repository configuration.

## 9. Testing

The application should be evaluated using functional and usability testing.

Functional testing covers the main application workflows, including:

- Book searching and genre filtering.
- Book availability and reservations.
- Waiting-list operations.
- Seat and study-room booking.
- Reservation modification and cancellation.
- Automatic reservation expiry.
- Notifications and staff reservation management.

Usability testing evaluates navigation clarity, task completion, errors, time taken and user feedback.

Test outcomes should be documented based on actual execution. Defects should be recorded together with their corrective actions and retest results.

## 10. Version Control and Collaboration

Git and GitHub are used for source-code management and collaboration among the four group members.

Repository: https://github.com/savija-fernando/sliit-stack

The `main` branch contains the integrated application. Development should take place on appropriate working branches, with pull requests used to review and merge changes.

## 11. Team Members and Responsibilities

| Student ID | Main Responsibilities |
|---|---|
| IT23544536 | Book search, filtering, book details, availability, location, book reservations and waiting lists |
| IT23277304 | Reading-room features, seat availability, seat map, date/time selection and booking confirmation |
| IT23534872 | My Reservations, reservation details, modification, cancellation, waiting-list status and notifications |
| IT23539068 | Onboarding, login, staff dashboard, reservation management, expiry, issue monitoring and staff profile |

## 12. Academic Context

SLIITStack was developed as a group project for IT3060 — Human Computer Interaction at the Sri Lanka Institute of Information Technology.

The project brings together user research, interface design, mobile application development and final evaluation across Milestones 01, 02 and 03.
