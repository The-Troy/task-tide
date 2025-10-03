# task-tide 

This is a NextJS starter in Firebase Studio.

TaskTide is a simple, collaborative task management web app designed to help teams stay organized and productive.  
Deployed live at **[tasktid.netlify.app](https://tasktid.netlify.app)** 🚀

To get started, take a look at src/app/page.tsx.

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Copy your Firebase config and update `.env.local`
5. Set up Firestore security rules (see below)

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Classroom rules
    match /classrooms/{classroomId} {
      // Anyone can read classrooms they're a member of
      allow read: if request.auth != null && 
        (request.auth.uid in resource.data.members || 
         request.auth.uid == resource.data.createdBy);
      
      // Only class reps can create classrooms
      allow create: if request.auth != null;
      
      // Only creators can update classrooms
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.createdBy;
    }
  }
}
```

1. Prerequisites:

Node.js and npm (or yarn/pnpm): Make sure you have Node.js installed on your system. You'll also need a package manager like npm, yarn, or pnpm. You can download Node.js from https://nodejs.org/.
Git: You'll need Git to clone the project repository. You can download Git from https://git-scm.com/.
2. Clone the Repository:

If your project is in a Git repository, clone it to your local machine using the command line or your IDE's Git integration.
git clone <repository_url>



3. Install Dependencies:

Navigate to the project's root directory in your terminal.
Install the project's dependencies using the package manager specified in the package.json file (likely npm based on the package-lock.json file).
npm install



4. Run the Development Server:

The package.json file [4] shows a "dev" script: "dev": "next dev --turbopack -p 9002". This script starts the Next.js development server.
Run this script in your terminal:
npm run dev



This will start the development server, usually at http://localhost:9002 as specified in the script.
5. Access the App:

Open your web browser and go to the address where the development server is running (e.g., http://localhost:9002). You should see your application.
