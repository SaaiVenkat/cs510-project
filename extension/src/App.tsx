import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Tabs from './Tab';
import Card from './Card';

interface Bookmark {
  id: string;
  title: string;
  url?: string;
}
interface Reco {
  preview_image: string;
  title: string;
  url?: string;
  description?: string
}

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [reco, setReco] = useState<Reco[]>([]);
  // {
  //   description: "No description found",
  //   preview_image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/640px-Flag_of_California.svg.png",
  //   title: "California - Wikipedia",
  //   url: "https://en.wikipedia.org/wiki/California",
  // }
  const [token, setToken] = useState('');
  const [alertData, setAlertData] = useState({ message: "", type: "" });

  const tokenref = useRef("")

  //connection between extension and the frontend 
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'service_worker_message') {
        const dataFromServiceWorker = message.data;
        console.log(dataFromServiceWorker)
        if (message.data.localStorageData) {
          setToken(message.data);
          tokenref.current = message.data.localStorageData
          localStorage.setItem("token", message.data.localStorageData)
          console.log('Received message from service worker in App.tsx:', dataFromServiceWorker);
        } else {
          localStorage.removeItem("token")
        }
      }
    });
  }, []);
  useEffect(() => {
    let tokenFromStorage = localStorage.getItem("token")
    console.log(tokenFromStorage)
    if (tokenFromStorage && !token) {
      setToken(tokenFromStorage);
      tokenref.current = tokenFromStorage
    }
    fetchReco()
  }, [])



  const uploadBookmark = async (url) => {
    let token = localStorage.getItem("token")
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
        setAlertData({ message: "Bookmark saved sucessfully!", type: "success" })
      } else {
        console.error('Failed to save bookmark:', result.error);
        setAlertData({ message: "Errored while saving bookmark", type: "error" })
      }
    } catch (error) {
      setAlertData({ message: "Errored while saving bookmark", type: "error" })
      console.error('Error saving bookmark:', error);
    }
  };

  const fetchReco = () => {
    let link = ""
    let token = localStorage.getItem("token")
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      if (currentTab) {
        link = currentTab.url!
        fetch(`http://127.0.0.1:8000/query?q=${link}&type=link`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log('Response:', data);
            if (!data?.msg) {
              setReco(data)
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });


  }
  const bulkUploadBookmarks = (bookmarks) => {
    let token = localStorage.getItem("token")
    try {
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
        .then(data => {
          console.log('Success:', data)
          setAlertData({ message: "Bookmarks saved sucessfully!", type: "success" })
        })
        .catch((error) => {
          setAlertData({ message: "Errored while saving bookmark", type: "error" })
          console.error('Error:', error);
        });
    }
    catch (error) {
      setAlertData({ message: "Errored while saving bookmark", type: "error" })
      console.error('Error adding bookmarks:', error);
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
      }
    }
    )

    return bookmarks;
  };


  const handleBulkUploadBookmarks = () => {
    console.log("Inside fetchbookmark")
    if (chrome.bookmarks) {
      chrome.bookmarks.getTree((results) => {
        const processedBookmarks = processBookmarks(results);
        setBookmarks(processedBookmarks);
        bulkUploadBookmarks(processedBookmarks);
      });
    }
  };

  const handleSaveFavorite = async (url?: string) => {
    let result = await uploadBookmark(url);
    return result
  };

  return (
    <div style={{ width: "300px" }} className="container mx-auto max-w-sm bg-white shadow-lg rounded-lg overflow-hidden">
      <Navbar token={token} />
      {alertData.message && (
        <div className={`flex items-center justify-between p-3 rounded-md ${alertData.type == "error" ? 'bg-red-100' : 'bg-green-100'} gap-4 w-full`} role="alert">
          <div>{alertData.message}</div>
          <button type="button" onClick={() => setAlertData({ message: "", type: "" })} className="flex items-center justify-center rounded-full transition-all duration-300 p-1.5 hover:bg-black/10" data-dismiss="alert" aria-label="Close"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg></button>
        </div>
      )}
      <MainContent setAlertData={setAlertData} onSaveFavorite={handleSaveFavorite} onBulkUploadBookmarks={handleBulkUploadBookmarks} />
      {/* <Tabs /> */}
      {/* <h1>Bookmarks</h1>
      <ul>
        {bookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <div>
              <h3>{bookmark.title}</h3>
              <p>{bookmark.url}</p>
            </div>
          </li>
        ))}
      </ul> */}
      {reco.length > 0 && (<div className='mb-4'>
        <h1 className="text-md sm:text-sm font-bold font-marker text-center">Recommendations</h1>
        <ul className='overflow-y-scroll max-h-64'>
          {reco.length > 0 && reco.map((result) => (
            <Card title={result.title} summary={result.description} url={result.url} preview_image={result.preview_image} />
          ))}
        </ul>
      </div>)}
    </div>

  );
}

export default App;
