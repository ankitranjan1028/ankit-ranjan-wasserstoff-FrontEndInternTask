// import { useState, useEffect } from 'react';
// import { User, UserCircle, Edit, Check, Menu, X, Clock, Users } from 'lucide-react';

// // Generate a random color for user identification
// const getRandomColor = () => {
//   const colors = [
//     'bg-red-200 text-red-800',
//     'bg-blue-200 text-blue-800',
//     'bg-green-200 text-green-800',
//     'bg-yellow-200 text-yellow-800',
//     'bg-purple-200 text-purple-800',
//     'bg-pink-200 text-pink-800',
//     'bg-indigo-200 text-indigo-800',
//     'bg-teal-200 text-teal-800'
//   ];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// // Generate a unique session ID
// const generateSessionId = () => {
//   return Math.random().toString(36).substring(2, 9);
// };

// // Storage keys for better organization
// const STORAGE_KEYS = {
//   CONTENT: 'collaborative-editor-content',
//   USERS: 'collaborative-editor-users',
//   HISTORY: 'collaborative-editor-history'
// };

// export default function CollaborativeEditor() {
//   const [username, setUsername] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [content, setContent] = useState('');
//   const [sessionId, setSessionId] = useState('');
//   const [userColor, setUserColor] = useState('');
//   const [activeUsers, setActiveUsers] = useState([]);
//   const [editHistory, setEditHistory] = useState([]);
//   const [lastEdit, setLastEdit] = useState(null);
//   const [activeMobileTab, setActiveMobileTab] = useState('editor'); // 'editor', 'users', 'history'

//   // Initialize session when component mounts
//   useEffect(() => {
//     const id = generateSessionId();
//     setSessionId(id);
//     setUserColor(getRandomColor());
    
//     // Load initial data from localStorage
//     const loadInitialData = () => {
//       const savedContent = localStorage.getItem(STORAGE_KEYS.CONTENT) || '';
//       const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
//       const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
      
//       setContent(savedContent);
//       setActiveUsers(savedUsers);
//       setEditHistory(savedHistory);
//     };
    
//     loadInitialData();

//     // Set up localStorage event listener for cross-tab/browser communication
//     const handleStorageChange = (e) => {
//       if (e.key === STORAGE_KEYS.CONTENT) {
//         setContent(e.newValue || '');
//       } else if (e.key === STORAGE_KEYS.USERS) {
//         const users = JSON.parse(e.newValue || '[]');
//         setActiveUsers(users);
//       } else if (e.key === STORAGE_KEYS.HISTORY) {
//         const history = JSON.parse(e.newValue || '[]');
//         setEditHistory(history);
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   // Handle user logout or page close
//   useEffect(() => {
//     const handleBeforeUnload = () => {
//       if (isLoggedIn && sessionId) {
//         const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
//         const updatedUsers = users.filter(user => user.id !== sessionId);
//         localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);
    
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       handleBeforeUnload();
//     };
//   }, [isLoggedIn, sessionId]);

//   // Update users when logged in
//   useEffect(() => {
//     if (isLoggedIn && username) {
//       const currentUser = {
//         id: sessionId,
//         name: username,
//         color: userColor,
//         lastActive: new Date().toISOString(),
//         // Store login information in localStorage to persist across browser restarts
//         loginTime: new Date().toISOString()
//       };
      
//       const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
//       const updatedUsers = [...savedUsers.filter(user => user.id !== sessionId), currentUser];
//       setActiveUsers(updatedUsers);
//       localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      
//       // Set up ping interval to show user is active - increased timeout
//       const interval = setInterval(() => {
//         const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
//         const currentUserExists = users.some(user => user.id === sessionId);
        
//         if (currentUserExists) {
//           const updatedUsers = users.map(user => 
//             user.id === sessionId 
//               ? { ...user, lastActive: new Date().toISOString() } 
//               : user
//           );
//           localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
//           setActiveUsers(updatedUsers);
//         } else {
//           // Re-add the user if somehow they got removed
//           const updatedUsers = [...users, {
//             ...currentUser,
//             lastActive: new Date().toISOString()
//           }];
//           localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
//           setActiveUsers(updatedUsers);
//         }
//       }, 3000);
      
//       return () => clearInterval(interval);
//     }
//   }, [isLoggedIn, username, sessionId, userColor]);

//   // Clean up inactive users - with much longer timeout (2 minutes)
//   useEffect(() => {
//     if (isLoggedIn) {
//       const interval = setInterval(() => {
//         const currentTime = new Date();
//         const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        
//         const activeUsersOnly = users.filter(user => {
//           const lastActive = new Date(user.lastActive);
//           // 2 minute timeout instead of 15 seconds
//           return currentTime - lastActive < 120000;
//         });
        
//         if (activeUsersOnly.length !== users.length) {
//           localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(activeUsersOnly));
//           setActiveUsers(activeUsersOnly);
//         }
//       }, 10000);
      
//       return () => clearInterval(interval);
//     }
//   }, [isLoggedIn]);

//   const handleLogin = (e) => {
//     if (e) e.preventDefault();
//     if (username.trim()) {
//       setIsLoggedIn(true);
      
//       // Store login data to browser's sessionStorage to maintain login across page refreshes
//       sessionStorage.setItem('editor-username', username);
//       sessionStorage.setItem('editor-sessionId', sessionId);
//       sessionStorage.setItem('editor-userColor', userColor);
//     }
//   };

//   // Check for existing session on page load
//   useEffect(() => {
//     const savedUsername = sessionStorage.getItem('editor-username');
//     const savedSessionId = sessionStorage.getItem('editor-sessionId');
//     const savedUserColor = sessionStorage.getItem('editor-userColor');
    
//     if (savedUsername && savedSessionId) {
//       setUsername(savedUsername);
//       setSessionId(savedSessionId);
      
//       if (savedUserColor) {
//         setUserColor(savedUserColor);
//       }
      
//       setIsLoggedIn(true);
//     }
//   }, []);

//   // Throttle content changes to avoid too many updates
//   useEffect(() => {
//     if (lastEdit && isLoggedIn) {
//       // Add a small delay before saving to storage to avoid excessive updates
//       const timer = setTimeout(() => {
//         localStorage.setItem(STORAGE_KEYS.CONTENT, content);
        
//         // Record edit in history
//         const newEdit = {
//           id: Math.random().toString(36).substring(2, 9),
//           user: username,
//           userId: sessionId,
//           userColor,
//           timestamp: new Date().toISOString(),
//           contentLength: content.length
//         };
        
//         const currentHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
//         // Keep more history (100 items instead of 20)
//         const updatedHistory = [...currentHistory.slice(-99), newEdit];
//         setEditHistory(updatedHistory);
//         localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
        
//         setLastEdit(null);
//       }, 300);
      
//       return () => clearTimeout(timer);
//     }
//   }, [lastEdit, content, isLoggedIn, username, sessionId, userColor]);

//   const handleContentChange = (e) => {
//     const newContent = e.target.value;
//     setContent(newContent);
//     setLastEdit(new Date());
//   };

//   // Format timestamp to readable format
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
//   };

//   // Format date for longer durations
//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   const switchToTab = (tab) => {
//     setActiveMobileTab(tab);
//   };

//   // Render the mobile navigation tabs
//   const renderMobileNav = () => (
//     <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-10 md:hidden">
//       <button 
//         onClick={() => switchToTab('editor')}
//         className={`flex flex-col items-center px-4 py-2 ${activeMobileTab === 'editor' ? 'text-blue-600' : 'text-gray-500'}`}
//       >
//         <Edit size={20} />
//         <span className="text-xs mt-1">Editor</span>
//       </button>
//       <button 
//         onClick={() => switchToTab('users')}
//         className={`flex flex-col items-center px-4 py-2 ${activeMobileTab === 'users' ? 'text-blue-600' : 'text-gray-500'}`}
//       >
//         <Users size={20} />
//         <span className="text-xs mt-1">Users ({activeUsers.length})</span>
//       </button>
//       <button 
//         onClick={() => switchToTab('history')}
//         className={`flex flex-col items-center px-4 py-2 ${activeMobileTab === 'history' ? 'text-blue-600' : 'text-gray-500'}`}
//       >
//         <Clock size={20} />
//         <span className="text-xs mt-1">History</span>
//       </button>
//     </div>
//   );

//   if (!isLoggedIn) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//         <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//           <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Collaborative Text Editor</h1>
//           <div className="space-y-4">
//             <div>
//               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User size={18} className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   id="username"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
//                   placeholder="Enter your username"
//                   onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
//                   required
//                 />
//               </div>
//             </div>
//             <button
//               onClick={handleLogin}
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               Join Editor
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col pb-16 md:pb-0">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-lg md:text-xl font-bold text-gray-900">Collaborative Editor</h1>
//           <div className="flex items-center space-x-2 md:space-x-4">
//             <div className={`flex items-center ${userColor} px-2 py-1 rounded-full text-xs md:text-sm`}>
//               <UserCircle size={16} className="mr-1 md:mr-2" />
//               <span className="truncate max-w-[80px] md:max-w-full">{username}</span>
//             </div>
//             <button 
//               onClick={() => {
//                 sessionStorage.removeItem('editor-username');
//                 sessionStorage.removeItem('editor-sessionId');
//                 sessionStorage.removeItem('editor-userColor');
                
//                 // Remove user from active users
//                 const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
//                 const updatedUsers = users.filter(user => user.id !== sessionId);
//                 localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
                
//                 setIsLoggedIn(false);
//               }}
//               className="text-xs md:text-sm text-gray-600 hover:text-gray-900"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>
      
//       <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex-grow">
//         {/* Mobile view */}
//         <div className="md:hidden">
//           {activeMobileTab === 'editor' && (
//             <div className="bg-white shadow rounded-lg p-3">
//               <div className="mb-2 flex justify-between items-center">
//                 <h2 className="text-lg font-medium">Document</h2>
//                 <div className="text-sm text-gray-500">
//                   {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''}
//                 </div>
//               </div>
//               <textarea
//                 value={content}
//                 onChange={handleContentChange}
//                 className="w-full h-[calc(100vh-200px)] p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Start typing here..."
//               ></textarea>
//             </div>
//           )}
          
//           {activeMobileTab === 'users' && (
//             <div className="bg-white shadow rounded-lg p-4">
//               <h2 className="text-lg font-medium mb-3">Active Users</h2>
//               <ul className="space-y-2">
//                 {activeUsers.length > 0 ? activeUsers.map(user => (
//                   <li key={user.id} className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className={`w-2 h-2 rounded-full mr-2 ${user.id === sessionId ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                       <div className={`px-2 py-1 rounded-full text-sm ${user.color}`}>
//                         {user.name}
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <span className="text-xs text-gray-500" title={formatDate(user.loginTime)}>
//                         {user.id === sessionId ? 'You' : 'Active'}
//                       </span>
//                       {user.id === sessionId && <Check size={14} className="text-green-500" />}
//                     </div>
//                   </li>
//                 )) : (
//                   <li className="text-sm text-gray-500">No active users</li>
//                 )}
//               </ul>
//             </div>
//           )}
          
//           {activeMobileTab === 'history' && (
//             <div className="bg-white shadow rounded-lg p-4">
//               <h2 className="text-lg font-medium mb-3">Edit History</h2>
//               <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
//                 {editHistory.length > 0 ? (
//                   [...editHistory].reverse().map(edit => (
//                     <div key={edit.id} className="text-sm border-l-2 pl-2" style={{ borderColor: edit.userColor?.split(' ')[0]?.replace('bg-', 'border-') || 'border-gray-300' }}>
//                       <div className="flex justify-between items-center">
//                         <div className={`px-2 py-0.5 rounded-full text-xs ${edit.userColor}`}>
//                           {edit.user === username ? 'You' : edit.user}
//                         </div>
//                         <span className="text-gray-500 text-xs">{formatTime(edit.timestamp)}</span>
//                       </div>
//                       <div className="flex items-center mt-1">
//                         <Edit size={12} className="text-gray-400 mr-1" />
//                         <span className="text-gray-600 text-xs">Edited ({edit.contentLength} chars)</span>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">No edits yet</p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Desktop view */}
//         <div className="hidden md:grid md:grid-cols-4 gap-6">
//           <div className="md:col-span-3">
//             <div className="bg-white shadow rounded-lg p-4">
//               <div className="mb-4 flex justify-between items-center">
//                 <h2 className="text-lg font-medium">Document</h2>
//                 <div className="text-sm text-gray-500">
//                   {activeUsers.length} active user{activeUsers.length !== 1 ? 's' : ''}
//                 </div>
//               </div>
//               <textarea
//                 value={content}
//                 onChange={handleContentChange}
//                 className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Start typing here..."
//               ></textarea>
//             </div>
//           </div>
          
//           <div className="space-y-6">
//             <div className="bg-white shadow rounded-lg p-4">
//               <h2 className="text-lg font-medium mb-4">Active Users</h2>
//               <ul className="space-y-2">
//                 {activeUsers.length > 0 ? activeUsers.map(user => (
//                   <li key={user.id} className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className={`w-3 h-3 rounded-full mr-2 ${user.id === sessionId ? 'bg-green-500' : 'bg-gray-300'}`}></div>
//                       <div className={`px-2 py-1 rounded-full text-sm ${user.color}`}>
//                         {user.name}
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-xs text-gray-500" title={formatDate(user.loginTime)}>
//                         {user.id === sessionId ? 'You' : 'Active'}
//                       </span>
//                       {user.id === sessionId && <Check size={16} className="text-green-500" />}
//                     </div>
//                   </li>
//                 )) : (
//                   <li className="text-sm text-gray-500">No active users</li>
//                 )}
//               </ul>
//             </div>
            
//             <div className="bg-white shadow rounded-lg p-4">
//               <h2 className="text-lg font-medium mb-4">Edit History</h2>
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {editHistory.length > 0 ? (
//                   [...editHistory].reverse().map(edit => (
//                     <div key={edit.id} className="text-sm border-l-2 pl-2" style={{ borderColor: edit.userColor?.split(' ')[0]?.replace('bg-', 'border-') || 'border-gray-300' }}>
//                       <div className="flex justify-between items-center">
//                         <div className={`px-2 py-0.5 rounded-full text-xs ${edit.userColor}`}>
//                           {edit.user === username ? 'You' : edit.user}
//                         </div>
//                         <span className="text-gray-500 text-xs">{formatTime(edit.timestamp)}</span>
//                       </div>
//                       <div className="flex items-center mt-1">
//                         <Edit size={14} className="text-gray-400 mr-1" />
//                         <span className="text-gray-600">Edited ({edit.contentLength} chars)</span>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-sm text-gray-500">No edits yet</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
      
//       {/* Mobile navigation */}
//       {renderMobileNav()}
//     </div>
//   );
// }








// // import { useState, useEffect } from 'react';
// // import { User, UserCircle, Edit, Check, Menu, X, Clock, Users } from 'lucide-react';

// // // Generate a random color for user identification
// // const getRandomColor = () => {
// //   const colors = [
// //     'bg-red-200 text-red-800',
// //     'bg-blue-200 text-blue-800',
// //     'bg-green-200 text-green-800',
// //     'bg-yellow-200 text-yellow-800',
// //     'bg-purple-200 text-purple-800',
// //     'bg-pink-200 text-pink-800',
// //     'bg-indigo-200 text-indigo-800',
// //     'bg-teal-200 text-teal-800'
// //   ];
// //   return colors[Math.floor(Math.random() * colors.length)];
// // };

// // // Generate a unique session ID
// // const generateSessionId = () => {
// //   return Math.random().toString(36).substring(2, 9);
// // };

// // // Storage keys for better organization
// // const STORAGE_KEYS = {
// //   CONTENT: 'collaborative-editor-content',
// //   USERS: 'collaborative-editor-users',
// //   HISTORY: 'collaborative-editor-history',
// //   PREV_CONTENT: 'collaborative-editor-prev-content'
// // };

// // // Calculate diff between two strings (simplified)
// // const calculateEditDiff = (prevContent, newContent) => {
// //   if (!prevContent) return { type: 'added', text: newContent.slice(0, 50) + (newContent.length > 50 ? '...' : '') };
  
// //   // Find if text was added
// //   if (newContent.length > prevContent.length) {
// //     // Try to find what was added
// //     for (let i = 0; i < prevContent.length; i++) {
// //       if (prevContent[i] !== newContent[i]) {
// //         // Content was added in the middle
// //         const addedText = newContent.slice(i, i + 50);
// //         return { type: 'added', text: addedText + (addedText.length >= 50 ? '...' : '') };
// //       }
// //     }
// //     // Content was added at the end
// //     const addedText = newContent.slice(prevContent.length, prevContent.length + 50);
// //     return { type: 'added', text: addedText + (addedText.length >= 50 ? '...' : '') };
// //   } 
// //   // Find if text was removed
// //   else if (newContent.length < prevContent.length) {
// //     for (let i = 0; i < newContent.length; i++) {
// //       if (prevContent[i] !== newContent[i]) {
// //         // Content was removed from the middle
// //         const removedText = prevContent.slice(i, i + 50);
// //         return { type: 'removed', text: removedText + (removedText.length >= 50 ? '...' : '') };
// //       }
// //     }
// //     // Content was removed from the end
// //     const removedText = prevContent.slice(newContent.length, newContent.length + 50);
// //     return { type: 'removed', text: removedText + (removedText.length >= 50 ? '...' : '') };
// //   }
// //   // If same length but different content, it's likely a replacement or small edit
// //   else {
// //     let startDiff = -1;
// //     let endDiff = -1;
    
// //     // Find the first character that differs
// //     for (let i = 0; i < prevContent.length; i++) {
// //       if (prevContent[i] !== newContent[i]) {
// //         startDiff = i;
// //         break;
// //       }
// //     }
    
// //     // Find the last character that differs (backwards)
// //     for (let i = prevContent.length - 1; i >= 0; i--) {
// //       if (prevContent[i] !== newContent[i]) {
// //         endDiff = i;
// //         break;
// //       }
// //     }
    
// //     if (startDiff !== -1) {
// //       const beforeText = prevContent.slice(Math.max(0, startDiff - 10), startDiff);
// //       const oldText = prevContent.slice(startDiff, endDiff + 1);
// //       const newText = newContent.slice(startDiff, startDiff + (endDiff - startDiff + 1));
// //       const afterText = prevContent.slice(endDiff + 1, Math.min(prevContent.length, endDiff + 11));
      
// //       let displayText = "";
// //       if (beforeText) displayText += "..." + beforeText;
// //       displayText += "[" + oldText + " → " + newText + "]";
// //       if (afterText) displayText += afterText + "...";
      
// //       return { type: 'modified', text: displayText };
// //     }
// //   }
  
// //   return { type: 'unknown', text: 'Modified document' };
// // };

// // export default function CollaborativeEditor() {
// //   const [username, setUsername] = useState('');
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [content, setContent] = useState('');
// //   const [prevContent, setPrevContent] = useState('');
// //   const [sessionId, setSessionId] = useState('');
// //   const [userColor, setUserColor] = useState('');
// //   const [activeUsers, setActiveUsers] = useState([]);
// //   const [editHistory, setEditHistory] = useState([]);
// //   const [lastEdit, setLastEdit] = useState(null);
// //   const [activeMobileTab, setActiveMobileTab] = useState('editor'); // 'editor', 'users', 'history'

// //   // Initialize session when component mounts
// //   useEffect(() => {
// //     const id = generateSessionId();
// //     setSessionId(id);
// //     setUserColor(getRandomColor());
    
// //     // Load initial data from localStorage
// //     const loadInitialData = () => {
// //       const savedContent = localStorage.getItem(STORAGE_KEYS.CONTENT) || '';
// //       const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
// //       const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
      
// //       setContent(savedContent);
// //       setPrevContent(savedContent);
// //       setActiveUsers(savedUsers);
// //       setEditHistory(savedHistory);
// //     };
    
// //     loadInitialData();

// //     // Set up localStorage event listener for cross-tab/browser communication
// //     const handleStorageChange = (e) => {
// //       if (e.key === STORAGE_KEYS.CONTENT) {
// //         setContent(e.newValue || '');
// //         setPrevContent(e.newValue || '');
// //       } else if (e.key === STORAGE_KEYS.USERS) {
// //         const users = JSON.parse(e.newValue || '[]');
// //         setActiveUsers(users);
// //       } else if (e.key === STORAGE_KEYS.HISTORY) {
// //         const history = JSON.parse(e.newValue || '[]');
// //         setEditHistory(history);
// //       }
// //     };

// //     window.addEventListener('storage', handleStorageChange);

// //     return () => {
// //       window.removeEventListener('storage', handleStorageChange);
// //     };
// //   }, []);

// //   // Handle user logout or page close
// //   useEffect(() => {
// //     const handleBeforeUnload = () => {
// //       if (isLoggedIn && sessionId) {
// //         const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
// //         const updatedUsers = users.filter(user => user.id !== sessionId);
// //         localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
// //       }
// //     };

// //     window.addEventListener('beforeunload', handleBeforeUnload);
    
// //     return () => {
// //       window.removeEventListener('beforeunload', handleBeforeUnload);
// //       handleBeforeUnload();
// //     };
// //   }, [isLoggedIn, sessionId]);

// //   // Update users when logged in
// //   useEffect(() => {
// //     if (isLoggedIn && username) {
// //       const currentUser = {
// //         id: sessionId,
// //         name: username,
// //         color: userColor,
// //         lastActive: new Date().toISOString(),
// //         // Store login information in localStorage to persist across browser restarts
// //         loginTime: new Date().toISOString()
// //       };
      
// //       const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
// //       const updatedUsers = [...savedUsers.filter(user => user.id !== sessionId), currentUser];
// //       setActiveUsers(updatedUsers);
// //       localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      
// //       // Set up ping interval to show user is active - increased timeout
// //       const interval = setInterval(() => {
// //         const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
// //         const currentUserExists = users.some(user => user.id === sessionId);
        
// //         if (currentUserExists) {
// //           const updatedUsers = users.map(user => 
// //             user.id === sessionId 
// //               ? { ...user, lastActive: new Date().toISOString() } 
// //               : user
// //           );
// //           localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
// //           setActiveUsers(updatedUsers);
// //         } else {
// //           // Re-add the user if somehow they got removed
// //           const updatedUsers = [...users, {
// //             ...currentUser,
// //             lastActive: new Date().toISOString()
// //           }];
// //           localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
// //           setActiveUsers(updatedUsers);
// //         }
// //       }, 3000);
      
// //       return () => clearInterval(interval);
// //     }
// //   }, [isLoggedIn, username, sessionId, userColor]);

// //   // Clean up inactive users - with much longer timeout (2 minutes)
// //   useEffect(() => {
// //     if (isLoggedIn) {
// //       const interval = setInterval(() => {
// //         const currentTime = new Date();
// //         const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        
// //         const activeUsersOnly = users.filter(user => {
// //           const lastActive = new Date(user.lastActive);
// //           // 2 minute timeout instead of 15 seconds
// //           return currentTime - lastActive < 120000;
// //         });
        
// //         if (activeUsersOnly.length !== users.length) {
// //           localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(activeUsersOnly));
// //           setActiveUsers(activeUsersOnly);
// //         }
// //       }, 10000);
      
// //       return () => clearInterval(interval);
// //     }
// //   }, [isLoggedIn]);

// //   const handleLogin = (e) => {
// //     if (e) e.preventDefault();
// //     if (username.trim()) {
// //       setIsLoggedIn(true);
      
// //       // Store login data to browser's sessionStorage to maintain login across page refreshes
// //       sessionStorage.setItem('editor-username', username);
// //       sessionStorage.setItem('editor-sessionId', sessionId);
// //       sessionStorage.setItem('editor-userColor', userColor);
// //     }
// //   };

// //   // Check for existing session on page load
// //   useEffect(() => {
// //     const savedUsername = sessionStorage.getItem('editor-username');
// //     const savedSessionId = sessionStorage.getItem('editor-sessionId');
// //     const savedUserColor = sessionStorage.getItem('editor-userColor');
    
// //     if (savedUsername && savedSessionId) {
// //       setUsername(savedUsername);
// //       setSessionId(savedSessionId);
      
// //       if (savedUserColor) {
// //         setUserColor(savedUserColor);
// //       }
      
// //       setIsLoggedIn(true);
// //     }
// //   }, []);

// //   // Throttle content changes to avoid too many updates
// //   useEffect(() => {
// //     if (lastEdit && isLoggedIn) {
// //       // Add a small delay before saving to storage to avoid excessive updates
// //       const timer = setTimeout(() => {
// //         localStorage.setItem(STORAGE_KEYS.CONTENT, content);
        
// //         // Calculate what was edited
// //         const diff = calculateEditDiff(prevContent, content);
        
// //         // Record edit in history
// //         const newEdit = {
// //           id: Math.random().toString(36).substring(2, 9),
// //           user: username,
// //           userId: sessionId,
// //           userColor,
// //           timestamp: new Date().toISOString(),
// //           contentLength: content.length,
// //           editType: diff.type,
// //           editedText: diff.text
// //         };
        
// //         const currentHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
// //         // Keep more history (100 items instead of 20)
// //         const updatedHistory = [...currentHistory.slice(-99), newEdit];
// //         setEditHistory(updatedHistory);
// //         localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
        
// //         // Update previous content
// //         setPrevContent(content);
// //         localStorage.setItem(STORAGE_KEYS.PREV_CONTENT, content);
        
// //         setLastEdit(null);
// //       }, 300);
      
// //       return () => clearTimeout(timer);
// //     }
// //   }, [lastEdit, content, isLoggedIn, username, sessionId, userColor, prevContent]);

// //   const handleContentChange = (e) => {
// //     const newContent = e.target.value;
// //     setContent(newContent);
// //     setLastEdit(new Date());
// //   };

// //   // Format timestamp to readable format
// //   const formatTime = (timestamp) => {
// //     const date = new Date(timestamp);
// //     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
// //   };

// //   // Format date for longer durations
// //   const formatDate = (timestamp) => {
// //     const date = new Date(timestamp);
// //     return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// //   };

// //   // Get the appropriate icon and style for edit type
// //   const getEditTypeInfo = (editType) => {
// //     switch (editType) {
// //       case 'added':
// //         return { icon: <span className="text-green-500">+</span>, className: 'border-green-300 bg-green-50' };
// //       case 'removed':
// //         return { icon: <span className="text-red-500">-</span>, className: 'border-red-300 bg-red-50' };
// //       case 'modified':
// //         return { icon: <span className="text-amber-500">≈</span>, className: 'border-amber-300 bg-amber-50' };
// //       default:
// //         return { icon: <Edit size={12} className="text-gray-400" />, className: 'border-gray-300 bg-gray-50' };
// //     }
// //   };

// //   const switchToTab = (tab) => {
// //     setActiveMobileTab(tab);
// //   };

// //   // Render the mobile navigation tabs
// //   const renderMobileNav = () => (
// //     <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-10 md:hidden">
// //       <button 
// //         onClick={() => switchToTab('editor')}
// //         className={`flex flex-col items-center px-4 py-2 ${activeMobileTab === 'editor' ? 'text-blue-600' : 'text-gray-500'}`}
// //       >
// //         <Edit size={20} />
// //         <span className="text-xs mt-1">Editor</span>
// //       </button>
// //       <button 
// //         onClick={() => switchToTab('users')}
// //         className={`flex flex-col items-center px-4 py-2 ${activeMobileTab === 'users' ? 'text-blue-600' : 'text-gray-500'}`}
// //       >
// //         <Users size={20} />
// //         <span className="text-xs mt-1">Users ({activeUsers.length})</span>
// //       </button>
// //       <button 
// //         onClick={() => switchToTab('history')}
// //         className={`flex flex-col items-center px-4 py-2 ${activeMobileTab === 'history' ? 'text-blue-600' : 'text-gray-500'}`}
// //       >
// //         <Clock size={20} />
// //         <span className="text-xs mt-1">History</span>
// //       </button>
// //     </div>
// //   );

// //   if (!isLoggedIn) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
// //         <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
// //           <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Collaborative Text Editor</h1>
// //           <div className="space-y-4">
// //             <div>
// //               <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
// //               <div className="relative">
// //                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                   <User size={18} className="text-gray-400" />
// //                 </div>
// //                 <input
// //                   type="text"
// //                   id="username"
// //                   value={username}
// //                   onChange={(e) => setUsername(e.target.value)}
// //                   className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
// //                   placeholder="Enter your username"
// //                   onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
// //                   required
// //                 />
// //               </div>
// //             </div>
// //             <button
// //               onClick={handleLogin}
// //               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //             >
// //               Join Editor
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex flex-col pb-16 md:pb-0">
// //       <header className="bg-white shadow">
// //         <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
// //           <h1 className="text-lg md:text-xl font-bold text-gray-900">Collaborative Editor</h1>
// //           <div className="flex items-center space-x-2 md:space-x-4">
// //             <div className={`flex items-center ${userColor} px-2 py-1 rounded-full text-xs md:text-sm`}>
// //               <UserCircle size={16} className="mr-1 md:mr-2" />
// //               <span className="truncate max-w-[80px] md:max-w-full">{username}</span>
// //             </div>
// //             <button 
// //               onClick={() => {
// //                 sessionStorage.removeItem('editor-username');
// //                 sessionStorage.removeItem('editor-sessionId');
// //                 sessionStorage.removeItem('editor-userColor');
                
// //                 // Remove user from active users
// //                 const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
// //                 const updatedUsers = users.filter(user => user.id !== sessionId);
// //                 localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
                
// //                 setIsLoggedIn(false);
// //               }}
// //               className="text-xs md:text-sm text-gray-600 hover:text-gray-900"
// //             >
// //               Logout
// //             </button>
// //           </div>
// //         </div>
// //       </header>
      
// //       <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex-grow">
// //         {/* Mobile view */}
// //         <div className="md:hidden">
// //           {activeMobileTab === 'editor' && (
// //             <div className="bg-white shadow rounded-lg p-3">
// //               <div className="mb-2 flex justify-between items-center">
// //                 <h2 className="text-lg font-medium">Document</h2>
// //                 <div className="text-sm text-gray-500">
// //                   {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''}
// //                 </div>
// //               </div>
// //               <textarea
// //                 value={content}
// //                 onChange={handleContentChange}
// //                 className="w-full h-[calc(100vh-200px)] p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
// //                 placeholder="Start typing here..."
// //               ></textarea>
// //             </div>
// //           )}
          
// //           {activeMobileTab === 'users' && (
// //             <div className="bg-white shadow rounded-lg p-4">
// //               <h2 className="text-lg font-medium mb-3">Active Users</h2>
// //               <ul className="space-y-2">
// //                 {activeUsers.length > 0 ? activeUsers.map(user => (
// //                   <li key={user.id} className="flex items-center justify-between">
// //                     <div className="flex items-center">
// //                       <div className={`w-2 h-2 rounded-full mr-2 ${user.id === sessionId ? 'bg-green-500' : 'bg-gray-300'}`}></div>
// //                       <div className={`px-2 py-1 rounded-full text-sm ${user.color}`}>
// //                         {user.name}
// //                       </div>
// //                     </div>
// //                     <div className="flex items-center space-x-1">
// //                       <span className="text-xs text-gray-500" title={formatDate(user.loginTime)}>
// //                         {user.id === sessionId ? 'You' : 'Active'}
// //                       </span>
// //                       {user.id === sessionId && <Check size={14} className="text-green-500" />}
// //                     </div>
// //                   </li>
// //                 )) : (
// //                   <li className="text-sm text-gray-500">No active users</li>
// //                 )}
// //               </ul>
// //             </div>
// //           )}
          
// //           {activeMobileTab === 'history' && (
// //             <div className="bg-white shadow rounded-lg p-4">
// //               <h2 className="text-lg font-medium mb-3">Edit History</h2>
// //               <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
// //                 {editHistory.length > 0 ? (
// //                   [...editHistory].reverse().map(edit => {
// //                     const typeInfo = getEditTypeInfo(edit.editType);
                    
// //                     return (
// //                       <div key={edit.id} className="text-sm border-l-2 pl-2" style={{ borderColor: edit.userColor?.split(' ')[0]?.replace('bg-', 'border-') || 'border-gray-300' }}>
// //                         <div className="flex justify-between items-center">
// //                           <div className={`px-2 py-0.5 rounded-full text-xs ${edit.userColor}`}>
// //                             {edit.user === username ? 'You' : edit.user}
// //                           </div>
// //                           <span className="text-gray-500 text-xs">{formatTime(edit.timestamp)}</span>
// //                         </div>
// //                         <div className="flex items-center mt-1 text-xs text-gray-600">
// //                           {typeInfo.icon}
// //                           <span className="ml-1">
// //                             {edit.editType === 'added' ? 'Added' : 
// //                              edit.editType === 'removed' ? 'Removed' : 
// //                              edit.editType === 'modified' ? 'Changed' : 'Edited'} 
// //                             ({edit.contentLength} chars)
// //                           </span>
// //                         </div>
// //                         {edit.editedText && (
// //                           <div className={`mt-1 p-1.5 text-xs border rounded ${typeInfo.className}`}>
// //                             {edit.editedText}
// //                           </div>
// //                         )}
// //                       </div>
// //                     );
// //                   })
// //                 ) : (
// //                   <p className="text-sm text-gray-500">No edits yet</p>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Desktop view */}
// //         <div className="hidden md:grid md:grid-cols-4 gap-6">
// //           <div className="md:col-span-3">
// //             <div className="bg-white shadow rounded-lg p-4">
// //               <div className="mb-4 flex justify-between items-center">
// //                 <h2 className="text-lg font-medium">Document</h2>
// //                 <div className="text-sm text-gray-500">
// //                   {activeUsers.length} active user{activeUsers.length !== 1 ? 's' : ''}
// //                 </div>
// //               </div>
// //               <textarea
// //                 value={content}
// //                 onChange={handleContentChange}
// //                 className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
// //                 placeholder="Start typing here..."
// //               ></textarea>
// //             </div>
// //           </div>
          
// //           <div className="space-y-6">
// //             <div className="bg-white shadow rounded-lg p-4">
// //               <h2 className="text-lg font-medium mb-4">Active Users</h2>
// //               <ul className="space-y-2">
// //                 {activeUsers.length > 0 ? activeUsers.map(user => (
// //                   <li key={user.id} className="flex items-center justify-between">
// //                     <div className="flex items-center">
// //                       <div className={`w-3 h-3 rounded-full mr-2 ${user.id === sessionId ? 'bg-green-500' : 'bg-gray-300'}`}></div>
// //                       <div className={`px-2 py-1 rounded-full text-sm ${user.color}`}>
// //                         {user.name}
// //                       </div>
// //                     </div>
// //                     <div className="flex items-center space-x-2">
// //                       <span className="text-xs text-gray-500" title={formatDate(user.loginTime)}>
// //                         {user.id === sessionId ? 'You' : 'Active'}
// //                       </span>
// //                       {user.id === sessionId && <Check size={16} className="text-green-500" />}
// //                     </div>
// //                   </li>
// //                 )) : (
// //                   <li className="text-sm text-gray-500">No active users</li>
// //                 )}
// //               </ul>
// //             </div>
            
// //             <div className="bg-white shadow rounded-lg p-4">
// //               <h2 className="text-lg font-medium mb-4">Edit History</h2>
// //               <div className="space-y-3 max-h-64 overflow-y-auto">
// //                 {editHistory.length > 0 ? (
// //                   [...editHistory].reverse().map(edit => {
// //                     const typeInfo = getEditTypeInfo(edit.editType);
                    
// //                     return (
// //                       <div key={edit.id} className="text-sm border-l-2 pl-2" style={{ borderColor: edit.userColor?.split(' ')[0]?.replace('bg-', 'border-') || 'border-gray-300' }}>
// //                         <div className="flex justify-between items-center">
// //                           <div className={`px-2 py-0.5 rounded-full text-xs ${edit.userColor}`}>
// //                             {edit.user === username ? 'You' : edit.user}
// //                           </div>
// //                           <span className="text-gray-500 text-xs">{formatTime(edit.timestamp)}</span>
// //                         </div>
// //                         <div className="flex items-center mt-1 text-xs text-gray-600">
// //                           {typeInfo.icon}
// //                           <span className="ml-1">
// //                             {edit.editType === 'added' ? 'Added' : 
// //                              edit.editType === 'removed' ? 'Removed' : 
// //                              edit.editType === 'modified' ? 'Changed' : 'Edited'} 
// //                             ({edit.contentLength} chars)
// //                           </span>
// //                         </div>
// //                         {edit.editedText && (
// //                           <div className={`mt-1 p-2 text-xs border rounded ${typeInfo.className}`}>
// //                             {edit.editedText}
// //                           </div>
// //                         )}
// //                       </div>
// //                     );
// //                   })
// //                 ) : (
// //                   <p className="text-sm text-gray-500">No edits yet</p>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
      
// //       {/* Mobile navigation */}
// //       {renderMobileNav()}
// //     </div>
// //   );
// // }




















































































import { useState, useEffect } from 'react';
import { User, UserCircle, Edit, Check, X, Clock, Users } from 'lucide-react';

// Generate a random color for user identification
const getRandomColor = () => {
  const colors = [
    'bg-red-200 text-red-800',
    'bg-blue-200 text-blue-800',
    'bg-green-200 text-green-800',
    'bg-yellow-200 text-yellow-800',
    'bg-purple-200 text-purple-800',
    'bg-pink-200 text-pink-800',
    'bg-indigo-200 text-indigo-800',
    'bg-teal-200 text-teal-800'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Generate a unique session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Storage keys for better organization
const STORAGE_KEYS = {
  CONTENT: 'collaborative-editor-content',
  USERS: 'collaborative-editor-users',
  HISTORY: 'collaborative-editor-history',
  PREV_CONTENT: 'collaborative-editor-prev-content'
};

// Split text into words for better tracking
const splitIntoWords = (text) => {
  if (!text) return [];
  // Split by spaces, keeping punctuation attached to words
  return text.match(/\S+/g) || [];
};

// Calculate diff between two texts based on words
const calculateWordDiff = (prevContent, newContent) => {
  if (!prevContent) return { type: 'added', words: splitIntoWords(newContent).slice(0, 10), count: splitIntoWords(newContent).length };
  
  const prevWords = splitIntoWords(prevContent);
  const newWords = splitIntoWords(newContent);
  
  // If words were added
  if (newWords.length > prevWords.length) {
    // Check if words were added at the end (common case)
    let isAppend = true;
    for (let i = 0; i < prevWords.length; i++) {
      if (prevWords[i] !== newWords[i]) {
        isAppend = false;
        break;
      }
    }
    
    if (isAppend) {
      // Words added at the end
      const addedWords = newWords.slice(prevWords.length);
      return { 
        type: 'added', 
        position: 'end',
        words: addedWords.slice(0, 10),
        count: addedWords.length,
        hasMore: addedWords.length > 10
      };
    }
    
    // Find where words differ
    for (let i = 0; i < prevWords.length; i++) {
      if (prevWords[i] !== newWords[i]) {
        // Words added in the middle - simplified approach
        return {
          type: 'modified',
          position: 'middle',
          words: newWords.slice(i, i + 10),
          count: newWords.length - prevWords.length,
          hasMore: newWords.length - prevWords.length > 10
        };
      }
    }
  }
  
  // If words were removed
  else if (newWords.length < prevWords.length) {
    // Check if words were removed from the end
    let isRemoveFromEnd = true;
    for (let i = 0; i < newWords.length; i++) {
      if (prevWords[i] !== newWords[i]) {
        isRemoveFromEnd = false;
        break;
      }
    }
    
    if (isRemoveFromEnd) {
      // Words removed from the end
      const removedWords = prevWords.slice(newWords.length);
      return {
        type: 'removed',
        position: 'end',
        words: removedWords.slice(0, 10),
        count: removedWords.length,
        hasMore: removedWords.length > 10
      };
    }
    
    // Find where words differ
    for (let i = 0; i < newWords.length; i++) {
      if (prevWords[i] !== newWords[i]) {
        // Words removed from the middle - simplified approach
        return {
          type: 'removed',
          position: 'middle',
          words: prevWords.slice(i, i + 10),
          count: prevWords.length - newWords.length,
          hasMore: prevWords.length - newWords.length > 10
        };
      }
    }
  }
  
  // Same number of words but possibly modified
  else {
    for (let i = 0; i < prevWords.length; i++) {
      if (prevWords[i] !== newWords[i]) {
        // Find how many consecutive words were modified
        let modifiedCount = 1;
        while (i + modifiedCount < prevWords.length && 
               prevWords[i + modifiedCount] !== newWords[i + modifiedCount]) {
          modifiedCount++;
        }
        
        return {
          type: 'modified',
          position: i === 0 ? 'start' : i === prevWords.length - 1 ? 'end' : 'middle',
          prevWords: prevWords.slice(i, i + Math.min(modifiedCount, 10)),
          newWords: newWords.slice(i, i + Math.min(modifiedCount, 10)),
          count: modifiedCount,
          hasMore: modifiedCount > 10
        };
      }
    }
  }
  
  // If we get here, content changed but we can't determine how (e.g., formatting only)
  return { 
    type: 'unknown', 
    words: [],
    count: Math.abs(newWords.length - prevWords.length) || 1
  };
};

export default function CollaborativeEditor() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [content, setContent] = useState('');
  const [prevContent, setPrevContent] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [userColor, setUserColor] = useState('');
  const [activeUsers, setActiveUsers] = useState([]);
  const [editHistory, setEditHistory] = useState([]);
  const [lastEdit, setLastEdit] = useState(null);
  const [activeMobileTab, setActiveMobileTab] = useState('editor'); // 'editor', 'users', 'history'
  
  // New state to track word-level changes
  const [pendingEdit, setPendingEdit] = useState(false);
  const [lastWordCount, setLastWordCount] = useState(0);
  const [currentWordBuffer, setCurrentWordBuffer] = useState('');

  // Initialize session when component mounts
  useEffect(() => {
    const id = generateSessionId();
    setSessionId(id);
    setUserColor(getRandomColor());
    
    // Load initial data from localStorage
    const loadInitialData = () => {
      const savedContent = localStorage.getItem(STORAGE_KEYS.CONTENT) || '';
      const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
      
      setContent(savedContent);
      setPrevContent(savedContent);
      setActiveUsers(savedUsers);
      setEditHistory(savedHistory);
      
      // Initialize word count for the loaded content
      setLastWordCount(splitIntoWords(savedContent).length);
    };
    
    loadInitialData();

    // Set up localStorage event listener for cross-tab/browser communication
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEYS.CONTENT) {
        setContent(e.newValue || '');
        setPrevContent(e.newValue || '');
        setLastWordCount(splitIntoWords(e.newValue || '').length);
      } else if (e.key === STORAGE_KEYS.USERS) {
        const users = JSON.parse(e.newValue || '[]');
        setActiveUsers(users);
      } else if (e.key === STORAGE_KEYS.HISTORY) {
        const history = JSON.parse(e.newValue || '[]');
        setEditHistory(history);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle user logout or page close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isLoggedIn && sessionId) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const updatedUsers = users.filter(user => user.id !== sessionId);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [isLoggedIn, sessionId]);

  // Update users when logged in
  useEffect(() => {
    if (isLoggedIn && username) {
      const currentUser = {
        id: sessionId,
        name: username,
        color: userColor,
        lastActive: new Date().toISOString(),
        // Store login information in localStorage to persist across browser restarts
        loginTime: new Date().toISOString()
      };
      
      const savedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const updatedUsers = [...savedUsers.filter(user => user.id !== sessionId), currentUser];
      setActiveUsers(updatedUsers);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      
      // Set up ping interval to show user is active - increased timeout
      const interval = setInterval(() => {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        const currentUserExists = users.some(user => user.id === sessionId);
        
        if (currentUserExists) {
          const updatedUsers = users.map(user => 
            user.id === sessionId 
              ? { ...user, lastActive: new Date().toISOString() } 
              : user
          );
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
          setActiveUsers(updatedUsers);
        } else {
          // Re-add the user if somehow they got removed
          const updatedUsers = [...users, {
            ...currentUser,
            lastActive: new Date().toISOString()
          }];
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
          setActiveUsers(updatedUsers);
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, username, sessionId, userColor]);

  // Clean up inactive users - with much longer timeout (2 minutes)
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        const currentTime = new Date();
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
        
        const activeUsersOnly = users.filter(user => {
          const lastActive = new Date(user.lastActive);
          // 2 minute timeout instead of 15 seconds
          return currentTime - lastActive < 120000;
        });
        
        if (activeUsersOnly.length !== users.length) {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(activeUsersOnly));
          setActiveUsers(activeUsersOnly);
        }
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
      
      // Store login data to browser's sessionStorage to maintain login across page refreshes
      sessionStorage.setItem('editor-username', username);
      sessionStorage.setItem('editor-sessionId', sessionId);
      sessionStorage.setItem('editor-userColor', userColor);
    }
  };

  // Check for existing session on page load
  useEffect(() => {
    const savedUsername = sessionStorage.getItem('editor-username');
    const savedSessionId = sessionStorage.getItem('editor-sessionId');
    const savedUserColor = sessionStorage.getItem('editor-userColor');
    
    if (savedUsername && savedSessionId) {
      setUsername(savedUsername);
      setSessionId(savedSessionId);
      
      if (savedUserColor) {
        setUserColor(savedUserColor);
      }
      
      setIsLoggedIn(true);
    }
  }, []);

  // Modified effect to handle word-level changes
  useEffect(() => {
    if (pendingEdit && isLoggedIn) {
      // Add a longer delay before saving to allow for continuous typing of a word
      const timer = setTimeout(() => {
        localStorage.setItem(STORAGE_KEYS.CONTENT, content);
        
        // Count current words
        const currentWords = splitIntoWords(content);
        const currentWordCount = currentWords.length;
        
        // Check if word count has changed
        if (currentWordCount !== lastWordCount) {
          // Calculate what was edited using word-based diff
          const diff = calculateWordDiff(prevContent, content);
          
          // Record edit in history only if words have changed
          const newEdit = {
            id: Math.random().toString(36).substring(2, 9),
            user: username,
            userId: sessionId,
            userColor,
            timestamp: new Date().toISOString(),
            wordCount: currentWordCount,
            editType: diff.type,
            editDetails: diff
          };
          
          const currentHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
          // Keep more history (100 items)
          const updatedHistory = [...currentHistory.slice(-99), newEdit];
          setEditHistory(updatedHistory);
          localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
          
          // Update previous content and word count
          setPrevContent(content);
          localStorage.setItem(STORAGE_KEYS.PREV_CONTENT, content);
          setLastWordCount(currentWordCount);
        }
        
        setPendingEdit(false);
        setCurrentWordBuffer('');
      }, 1000);  // Longer delay to capture full words
      
      return () => clearTimeout(timer);
    }
  }, [pendingEdit, content, isLoggedIn, username, sessionId, userColor, prevContent, lastWordCount]);

  // Modified handler to detect word-level changes
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Check if space was added or punctuation that signifies end of word
    const lastCharEntered = newContent.slice(-1);
    const isWordSeparator = /[\s\.\,\!\?\;\:\"\']/g.test(lastCharEntered);
    
    // If space detected or punctuation added, this might be a completed word
    if (isWordSeparator || 
        // Also check if words were deleted (content length decreased significantly)
        newContent.length < content.length - 3) {
      setPendingEdit(true);
    } else {
      // Accumulate characters but don't treat as a complete word yet
      setCurrentWordBuffer(currentWordBuffer + lastCharEntered);
    }
  };

  // Add function to handle paste events which should trigger an immediate history update
  const handlePaste = () => {
    setPendingEdit(true);
  };

  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Format date for longer durations
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render the edit details in a human-readable format
  const renderEditDetails = (editDetails) => {
    if (!editDetails) return 'Modified document';
    
    switch (editDetails.type) {
      case 'added':
        return (
          <span>
            Added {editDetails.count} word{editDetails.count !== 1 ? 's' : ''}: 
            <span className="font-medium"> "{editDetails.words.join(' ')}{editDetails.hasMore ? '...' : ''}"</span>
          </span>
        );
      case 'removed':
        return (
          <span>
            Removed {editDetails.count} word{editDetails.count !== 1 ? 's' : ''}: 
            <span className="font-medium"> "{editDetails.words.join(' ')}{editDetails.hasMore ? '...' : ''}"</span>
          </span>
        );
      case 'modified':
        if (editDetails.prevWords && editDetails.newWords) {
          return (
            <span>
              Changed <span className="font-medium">"{editDetails.prevWords.join(' ')}{editDetails.hasMore ? '...' : ''}"</span> to{' '}
              <span className="font-medium">"{editDetails.newWords.join(' ')}{editDetails.hasMore ? '...' : ''}"</span>
            </span>
          );
        }
        return (
          <span>
            Modified {editDetails.count} word{editDetails.count !== 1 ? 's' : ''}: 
            <span className="font-medium"> "{editDetails.words?.join(' ') || ''}
            {editDetails.hasMore ? '...' : ''}"</span>
          </span>
        );
      default:
        return `Edited document (${editDetails.count} word change${editDetails.count !== 1 ? 's' : ''})`;
    }
  };

  // Get the appropriate icon and style for edit type
  const getEditTypeInfo = (editType) => {
    switch (editType) {
      case 'added':
        return { icon: <span className="text-green-500">+</span>, className: 'border-green-300 bg-green-50' };
      case 'removed':
        return { icon: <span className="text-red-500">-</span>, className: 'border-red-300 bg-red-50' };
      case 'modified':
        return { icon: <span className="text-amber-500">≈</span>, className: 'border-amber-300 bg-amber-50' };
      default:
        return { icon: <Edit size={12} className="text-gray-400" />, className: 'border-gray-300 bg-gray-50' };
    }
  };

  const switchToTab = (tab) => {
    setActiveMobileTab(tab);
  };

  // Render the mobile navigation tabs
  const renderMobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-10 md:hidden">
      <button 
        onClick={() => switchToTab('editor')}
        className={`flex flex-col items-center px-4 py-2 ${activeMobileTab === 'editor' ? 'text-blue-600' : 'text-gray-500'}`}
      >
        <Edit size={20} />
        <span className="text-xs mt-1">Editor</span>
      </button>
      <button 
        onClick={() => switchToTab('users')}
        className={`flex flex-col items-center px-4 py-2 ${activeMobileTab === 'users' ? 'text-blue-600' : 'text-gray-500'}`}
      >
        <Users size={20} />
        <span className="text-xs mt-1">Users ({activeUsers.length})</span>
      </button>
      <button 
        onClick={() => switchToTab('history')}
        className={`flex flex-col items-center px-4 py-2 ${activeMobileTab === 'history' ? 'text-blue-600' : 'text-gray-500'}`}
      >
        <Clock size={20} />
        <span className="text-xs mt-1">History</span>
      </button>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Collaborative Text Editor</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                  placeholder="Enter your username"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  required
                />
              </div>
            </div>
            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Join Editor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16 md:pb-0">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Collaborative Editor</h1>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className={`flex items-center ${userColor} px-2 py-1 rounded-full text-xs md:text-sm`}>
              <UserCircle size={16} className="mr-1 md:mr-2" />
              <span className="truncate max-w-[80px] md:max-w-full">{username}</span>
            </div>
            <button 
              onClick={() => {
                sessionStorage.removeItem('editor-username');
                sessionStorage.removeItem('editor-sessionId');
                sessionStorage.removeItem('editor-userColor');
                
                // Remove user from active users
                const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
                const updatedUsers = users.filter(user => user.id !== sessionId);
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
                
                setIsLoggedIn(false);
              }}
              className="text-xs md:text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex-grow">
        {/* Mobile view */}
        <div className="md:hidden">
          {activeMobileTab === 'editor' && (
            <div className="bg-white shadow rounded-lg p-3">
              <div className="mb-2 flex justify-between items-center">
                <h2 className="text-lg font-medium">Document</h2>
                <div className="text-sm text-gray-500">
                  {activeUsers.length} user{activeUsers.length !== 1 ? 's' : ''}
                </div>
              </div>
              <textarea
                value={content}
                onChange={handleContentChange}
                onPaste={handlePaste}
                onBlur={() => setPendingEdit(true)} // Also update history when focus is lost
                className="w-full h-[calc(100vh-200px)] p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Start typing here..."
              ></textarea>
            </div>
          )}
          
          {activeMobileTab === 'users' && (
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-medium mb-3">Active Users</h2>
              <ul className="space-y-2">
                {activeUsers.length > 0 ? activeUsers.map(user => (
                  <li key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${user.id === sessionId ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`px-2 py-1 rounded-full text-sm ${user.color}`}>
                        {user.name}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500" title={formatDate(user.loginTime)}>
                        {user.id === sessionId ? 'You' : 'Active'}
                      </span>
                      {user.id === sessionId && <Check size={14} className="text-green-500" />}
                    </div>
                  </li>
                )) : (
                  <li className="text-sm text-gray-500">No active users</li>
                )}
              </ul>
            </div>
          )}
          
          {activeMobileTab === 'history' && (
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-medium mb-3">Edit History</h2>
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {editHistory.length > 0 ? (
                  [...editHistory].reverse().map(edit => {
                    const typeInfo = getEditTypeInfo(edit.editType);
                    
                    return (
                      <div key={edit.id} className="text-sm border-l-2 pl-2" style={{ borderColor: edit.userColor?.split(' ')[0]?.replace('bg-', 'border-') || 'border-gray-300' }}>
                        <div className="flex justify-between items-center">
                          <div className={`px-2 py-0.5 rounded-full text-xs ${edit.userColor}`}>
                            {edit.user === username ? 'You' : edit.user}
                          </div>
                          <span className="text-gray-500 text-xs">{formatTime(edit.timestamp)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-600">
                          {typeInfo.icon}
                          <span className="ml-1">
                            {edit.editType === 'added' ? 'Added' : 
                             edit.editType === 'removed' ? 'Removed' : 
                             edit.editType === 'modified' ? 'Changed' : 'Edited'} 
                            ({edit.wordCount || 0} total words)
                          </span>
                        </div>
                        <div className={`mt-1 p-1.5 text-xs border rounded ${typeInfo.className}`}>
                          {renderEditDetails(edit.editDetails)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No edits yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop view */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-medium">Document</h2>
                <div className="text-sm text-gray-500">
                  {activeUsers.length} active user{activeUsers.length !== 1 ? 's' : ''}
                </div>
              </div>
              <textarea
                value={content}
                onChange={handleContentChange}
                onPaste={handlePaste}
                onBlur={() => setPendingEdit(true)} // Also update history when focus is lost
                className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Start typing here..."
              ></textarea>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Active Users</h2>
              <ul className="space-y-2">
                {activeUsers.length > 0 ? activeUsers.map(user => (
                  <li key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${user.id === sessionId ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`px-2 py-1 rounded-full text-sm ${user.color}`}>
                        {user.name}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                     <span className="text-xs text-gray-500" title={formatDate(user.loginTime)}>
                        {user.id === sessionId ? 'You' : 'Active'}
                      </span>
                      {user.id === sessionId && <Check size={14} className="text-green-500" />}
                    </div>
                  </li>
                )) : (
                  <li className="text-sm text-gray-500">No active users</li>
                )}
              </ul>
            </div>
            
            <div className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-medium mb-4">Edit History</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {editHistory.length > 0 ? (
                  [...editHistory].reverse().map(edit => {
                    const typeInfo = getEditTypeInfo(edit.editType);
                    
                    return (
                      <div key={edit.id} className="text-sm border-l-2 pl-2" style={{ borderColor: edit.userColor?.split(' ')[0]?.replace('bg-', 'border-') || 'border-gray-300' }}>
                        <div className="flex justify-between items-center">
                          <div className={`px-2 py-0.5 rounded-full text-xs ${edit.userColor}`}>
                            {edit.user === username ? 'You' : edit.user}
                          </div>
                          <span className="text-gray-500 text-xs">{formatTime(edit.timestamp)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-600">
                          {typeInfo.icon}
                          <span className="ml-1">
                            {edit.editType === 'added' ? 'Added' : 
                             edit.editType === 'removed' ? 'Removed' : 
                             edit.editType === 'modified' ? 'Changed' : 'Edited'} 
                            ({edit.wordCount || 0} total words)
                          </span>
                        </div>
                        <div className={`mt-1 p-1.5 text-xs border rounded ${typeInfo.className}`}>
                          {renderEditDetails(edit.editDetails)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No edits yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {renderMobileNav()}
      
      {/* Show notifications when users join/leave */}
      <div className="fixed bottom-16 md:bottom-4 right-4 flex flex-col-reverse space-y-reverse space-y-2 max-w-xs z-20">
        {lastEdit && (
          <div className="bg-white rounded-lg shadow-md p-3 text-sm animate-fade-in-out transition-opacity">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-xs ${lastEdit.userColor}`}>{lastEdit.user}</span>
              <span>{lastEdit.action}</span>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setLastEdit(null)}>
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}