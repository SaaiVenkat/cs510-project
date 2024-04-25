import React, { useEffect, useState } from 'react';
import './App.css';

interface Bookmark {
  id: string;
  title: string;
  url?: string;
}

const saveBookmark = async (url?: string) => {
  try {
    const response = await fetch('http://localhost:8000/save_bookmark', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

  useEffect(() => {

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
        }
      })
      return bookmarks;
    };

    if (chrome.bookmarks) {
      chrome.bookmarks.getTree((results) => {
        const processedBookmarks = processBookmarks(results);
        setBookmarks(processedBookmarks);
      });
    }

    // const onBookmarkCreated = (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    //   setBookmarks((prevBookmarks) => {
    //     if (prevBookmarks.some((b) => b.id === id)) return prevBookmarks;

    //     if (bookmark.url) {
    //       return [...prevBookmarks, {
    //         id: bookmark.id,
    //         title: bookmark.title,
    //         url: bookmark.url
    //       }];
    //     }
    //     return prevBookmarks;
    //   });
    // }

    const onBookmarkCreated = (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => {
      // Check if the new bookmark has a URL and is not already in the state
      if (bookmark.url) {
        saveBookmark(bookmark.url);  // Save the new bookmark via backend call
      }
    };

    if (chrome.bookmarks) {
      chrome.bookmarks.onCreated.addListener(onBookmarkCreated);
    }

    return () => {
      if (chrome.bookmarks && chrome.bookmarks.onCreated) {
        chrome.bookmarks.onCreated.removeListener(onBookmarkCreated);
      }
    };

  }, []);

  return (
    <div className="App">
      <h1>Bookmarks</h1>
      <ul>
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <div>
              <h3>{bookmark.title}</h3>
              <p>{bookmark.url}</p>
              {/* <button onClick={() => saveBookmark(bookmark.url as string)}>Save Bookmark</button> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
    
  );
}

export default App;
