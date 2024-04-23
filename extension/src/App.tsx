import React, { useEffect, useState } from 'react';
import './App.css';

interface Bookmark {
  id: string;
  title: string;
  url?: string;
  children?: Bookmark[];
}

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const processBookmarks = (nodes:Bookmark[]) => {
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
      });
      return bookmarks;
    };

    if (typeof chrome.bookmarks !== 'undefined') {
      chrome.bookmarks.getTree((results) => {
        const processedBookmarks = processBookmarks(results);
        setBookmarks(processedBookmarks);
      });
    }
  }, []);

  return (
    <div className="App">
      <h1>Bookmarks</h1>
      <ul>
        {bookmarks.map(bookmark => (
          <li key={bookmark.id}>{bookmark.title} - {bookmark.url}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
