Collaborative Text Editor
A real-time browser-based collaborative text editor built with React that allows multiple users to edit documents simultaneously without requiring a backend server.
Features

Real-time document collaboration
Word-level change tracking
User presence and activity monitoring
Detailed edit history
Cross-browser and cross-device synchronization
Responsive design for desktop and mobile

Prerequisites
Before running this project, make sure you have the following installed:

Node.js (v14.0.0 or higher)
npm (v6.0.0 or higher) or yarn (v1.22.0 or higher)

Installation

Clone the repository:

bashgit clone https://github.com/yourusername/collaborative-text-editor.git
cd collaborative-text-editor

Install the dependencies:

bashnpm install
# or
yarn install
Running the Project

Start the development server:

bashnpm start
# or
yarn start

Open your browser and navigate to:

http://localhost:3000

To test the collaborative features:

Open the application in multiple browser tabs or different browsers
Log in with different usernames in each tab/browser
Start editing the document to see real-time changes



How It Works
The application uses browser storage APIs (localStorage and sessionStorage) to:

Synchronize document content across multiple browsers
Track active users and their editing activity
Maintain edit history with detailed change information

No server is required as all communication happens through localStorage events.
Project Structure
src/
├── components/
│   └── CollaborativeEditor.jsx  # Main editor component
├── App.js                       # Root application component
├── index.js                     # Entry point
└── index.css                    # Global styles
Technologies Used

React (with Hooks)
localStorage/sessionStorage APIs
Tailwind CSS
Lucide React Icons

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

Built as part of a web development assignment
Inspired by collaborative editing tools like Google Docs