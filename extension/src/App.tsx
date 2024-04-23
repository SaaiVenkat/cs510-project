import React, { useEffect, useState } from 'react';
import './App.css';

interface Bookmark {
  id: string;
  title: string;
  url?: string;
}

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

    const onBookmarkCreated = (id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => {
      setBookmarks((prevBookmarks) => {
        if (prevBookmarks.some((b) => b.id === id)) return prevBookmarks;

        if (bookmark.url) {
          return [...prevBookmarks, {
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url
          }];
        }
        return prevBookmarks;
      });
    };

    if (chrome.bookmarks && chrome.bookmarks.onCreated) {
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
          <li key={bookmark.id}>{bookmark.title} - {bookmark.url}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
