import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Tabs from './Tab';

interface Bookmark {
  id: string;
  title: string;
  url?: string;
}

const saveBookmark = async (url, token) => {
  try {
    console.log('In savebookmark');
    const response = await fetch('http://localhost:8000/bookmark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ link: url })
    });

    const result = await response.json();
    if (response.ok) {
      console.log('Bookmark saved successfully:', result);
    } else {
      console.error('Failed to save bookmark:', result.error);
    }
  } catch (error) {
    console.error('Error saving bookmark:', error);
  }
};


function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'service_worker_message') {
        const dataFromServiceWorker = message.data;
        setToken(message.data);
        console.log('Received message from service worker in App.tsx:', dataFromServiceWorker);
      }
  });

  }, []);

  // Other effects and code remain the same

  const handleSaveFavorite = async (url?: string) => {
    if (!token) {
      console.log("Token not available");
      return;
    }
    console.log("In handleSaveFavorite");
    await saveBookmark(url, token);
  };



// const saveBookmark = async (url?: string) => {
//   const [token, setToken] = useState('');
//   console.log("In Savebookmark ", localStorageData)
//     try {
//     chrome.runtime.sendMessage({type: 'getToken'}, response => {
//       setToken(response.token);
//       console.log('Token received in React:', response.token);
//   });
//     const response = await fetch('http://localhost:8000/bookmark', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorageData}`
//       },
//       body: JSON.stringify({ link: url })
//     });

//     const result = await response.json();
//     if (response.ok) {
//       console.log('Bookmark saved successfully:', result);
//     } else {
//       console.error('Failed to save bookmark:', result.error);
//     }
//   } catch (error) {
//     console.error('Error saving bookmark:', error);
//   }
// };

// function App() {
//   const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
//   useEffect(() => {
//     chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//       if (message.type === 'service_worker_message') {
//         const dataFromServiceWorker = message.data;
//         // Process the message from the service worker
//         console.log('Received message from service worker in App.tsx:', dataFromServiceWorker);
//         // Perform processing or trigger actions in App.tsx based on the message
//       }
//     });
//   }, []);

//   useEffect(() => {

//     if (chrome.bookmarks) {
//       chrome.bookmarks.getTree((results) => {
//         const processedBookmarks = processBookmarks(results);
//         setBookmarks(processedBookmarks);
//       });
//     }

//     const processBookmarks = (nodes: chrome.bookmarks.BookmarkTreeNode[]): Bookmark[] => {
//       const bookmarks: Bookmark[] = [];
//       nodes.forEach(node => {
//         if (node.url) {
//           bookmarks.push({
//             id: node.id,
//             title: node.title,
//             url: node.url
//           });
//         }
//         if (node.children) {
//           bookmarks.push(...processBookmarks(node.children));
//         }
//       })
//       return bookmarks;
//     };

//   }, []);

//   const handleSaveFavorite = async (url?: string) => {
//     try {
//       console.log("In handleSavebookmark")
//       await saveBookmark(url);
//     } catch (e) {
//     }
//   };

  return (
    <div className="container mx-auto max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
      <Navbar />
      <MainContent onSaveFavorite={handleSaveFavorite} />
      <Tabs />
      <h1>Bookmarks</h1>
      <ul>
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <div>
              <h3>{bookmark.title}</h3>
              <p>{bookmark.url}</p>
              {/* <button onClick={() => saveBookmark(bookmark.url as string)}>Save Bookmark</button>  */}
            </div>
          </li>
        ))}
      </ul>
    </div>

  );
}

export default App;
