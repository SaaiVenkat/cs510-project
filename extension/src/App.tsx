import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Tabs from './Tab';

interface Bookmark {
  id: string;
  title: string;
  url?: string;
}

const saveBookmark = async (url) => {

  let token = localStorage.getItem("token")
  if (token) {
    try {
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
  }

};

const fetchBookmarks = (bookmarks) => {
  let token = localStorage.getItem("token")
  console.log(" fetch bookmarks")
  if(token){
    try{
      console.log("Adding bookmarks")
      const response = fetch('http://localhost:8000/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookmarks),
      })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => {
      console.error('Error:', error);
      });
    }
    catch(error){
      console.error('Error adding bookmarks:', error);
    }
  }
};

const processBookmarks = (nodes: chrome.bookmarks.BookmarkTreeNode[]): Bookmark[] => {
  const bookmarks: Bookmark[] = [];
  nodes.forEach(node => {
  if (node.url) {
    bookmarks.push({
      id: node.id,
      title: node.title,
      url: node.url
    });
  }

  if (node.children) {
    bookmarks.push(...processBookmarks(node.children));
  }}
  )

  return bookmarks;
};


function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [token, setToken] = useState('');
  const tokenref = useRef("")
  
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'service_worker_message') {
        const dataFromServiceWorker = message.data;
        setToken(message.data);
        tokenref.current = message.data
        localStorage.setItem("token", message.data.localStorageData)
        console.log('Received message from service worker in App.tsx:', dataFromServiceWorker);
      }
    });

  }, []);

  const handleFetchBookmarks = () => {
    console.log("Inside fetchbookmark")
    if (chrome.bookmarks) {
      chrome.bookmarks.getTree((results) => {
        const processedBookmarks = processBookmarks(results);
        setBookmarks(processedBookmarks);
        fetchBookmarks(processedBookmarks);
      });
    }
  };
  
  const handleSaveFavorite = async (url?: string) => {

    await saveBookmark(url);
  };

  
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
      <MainContent onSaveFavorite={handleSaveFavorite} onFetchBookmarks = {handleFetchBookmarks} />
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
