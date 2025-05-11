# Knowledge Nexus - Second Brain Study Planning Application

## Description
Second Brain is a comprehensive study planning and tracking application designed to help users organize their learning materials, track progress, and maintain focus during study sessions. The application provides a system for managing subjects and their units, tracking completion, and optimizing study time with features like a Pomodoro timer.

## Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technical Implementation](#technical-implementation)
- [Future Enhancements](#future-enhancements)

## Features
- **Subject Management**: Create and organize subjects with custom units
- **Unit Tracking**: Mark units as completed and track overall progress
- **Focus Environment**: Record study sessions with customizable duration
- **Pomodoro Timer**: Built-in timer for the Pomodoro technique
- **Progress Visualization**: Visual charts showing completion statistics
- **Notes Export**: Download study session notes as text files
- **Session History**: View and manage past study sessions
- **Dark Mode UI**: Optimized for extended study sessions
- **Offline Functionality**: All data stored locally using IndexedDB
- **Responsive Design**: Works on desktop and mobile devices

## Demo
You can view a live demo of the Second Brain application [here](#).

## Technologies Used
- **Frontend**:
  - React.js - UI library
  - TypeScript - Type safety
  - Vite - Build tool
  - TailwindCSS - Styling
  - shadcn/ui - UI components
  - Framer Motion - Animations
  - Recharts - Data visualization

- **State Management**:
  - React Context API - Application state
  - React Query - Data fetching

- **Data Storage**:
  - Dexie.js - IndexedDB wrapper
  - Browser local storage

- **Backend**:
  - Express.js - Minimal server for production

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps
1. Clone the repository:
```bash
git clone https://github.com/kamleshp214/secondbrain.git
cd secondbrain
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Usage

### Creating Subjects
1. Navigate to the "Subjects" page
2. Click the "+" button to create a new subject
3. Enter the subject name and exam date
4. Add units with names and descriptions
5. Save the subject

### Tracking Progress
1. On the "Subjects" page, click on a subject card to expand it
2. Check off units as you complete them
3. View your overall progress on the "Progress" page

### Using the Focus Environment
1. Navigate to the "Study Focus" page
2. Select a subject and optionally a unit
3. Set your study duration
4. Complete the session to record your progress
5. Optionally download your notes as a text file

### Using the Pomodoro Timer
1. Go to the "Study Focus" page
2. Select the "Pomodoro Timer" tab
3. Start the timer and focus for the set duration
4. Take breaks as prompted

## Project Structure
The project follows a feature-based organization:

```
second-brain/
├── client/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React context for state management
│   │   ├── db/                # Database models and initialization
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   ├── pages/             # Page components
│   │   ├── App.tsx            # Main application component
│   │   └── main.tsx           # Entry point
│   └── index.html             # HTML template
├── server/                    # Express server for production
├── shared/                    # Shared types and schemas
└── README.md                  # Project documentation
```

## Technical Implementation

### Data Model
- **Subject**: Represents a course or area of study with name, exam date
- **Unit**: Represents a topic within a subject with name, description, completion status
- **StudySession**: Records study sessions with start/end times, subject, unit, and notes

### Local Storage with Dexie.js
The application uses Dexie.js, a wrapper for IndexedDB, to persist data locally:

```typescript
export class SecondBrainDatabase extends Dexie {
  subjects!: Table<Subject>;
  units!: Table<Unit>;
  studySessions!: Table<StudySession>;

  constructor() {
    super("SecondBrainDatabase");
    this.version(1).stores({
      subjects: "++id, name, examDate",
      units: "++id, subjectId, name, description, completed, goalDate",
      studySessions: "++id, subjectId, unitId, startTime, endTime, completed"
    });
  }
}
```

### Responsive UI with TailwindCSS
The application uses TailwindCSS for responsive styling:

```tsx
<motion.div
  className="bg-[#1E1E1E] rounded-xl p-5 hover:shadow-md transition-shadow"
  whileHover={{ scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
>
  {/* Component content */}
</motion.div>
```

### Animations with Framer Motion
Smooth animations are implemented using Framer Motion:

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0 }
};
```

## Future Enhancements
- Spaced repetition functionality
- Study streak tracking
- Cloud synchronization
- Collaboration features
- Mobile app versions

## Contributors
- [Kamlesh Porwal](https://github.com/kamleshp214) - Developer

## Connect
- GitHub: [https://github.com/kamleshp214](https://github.com/kamleshp214)
- LinkedIn: [https://www.linkedin.com/in/kamlesh-porwal-2b1a2a1a6/](https://www.linkedin.com/in/kamlesh-porwal-2b1a2a1a6/)

---

Built with ❤️ by Kamlesh Porwal using React and TypeScript