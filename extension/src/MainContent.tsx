import React, { useState } from 'react';
import { UploadIcon } from '@heroicons/react/outline';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/solid';
import './App.css';

const MainContent = ({ onSaveFavorite, onFetchBookmarks }) => {
    const [enabled, setEnabled] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [addBookmarks, setAddBookmarks] = useState(false);

    const toggleFavorite = () => {
      setIsFavorite(!isFavorite); 
      
      if (!isFavorite) {  
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          const currentTab = tabs[0];
          if (currentTab) {
            console.log("Saving URL:", currentTab.url);
            onSaveFavorite(currentTab.url);
          }
        });
      }}

    const fetchBookmarks = () => {
        setAddBookmarks(!addBookmarks);
        console.log("flag ", addBookmarks);
        if(!addBookmarks){
            console.log("calling")
            onFetchBookmarks();
        }
    }

    return (
        <div className="flex flex-col items-center py-5 sm:py-10 bg-white">
            <div className="flex space-x-4 items-center justify-center">
                <div className="flex items-center justify-center bg-blue-100 rounded-full w-24 h-24">
                    <button
                    className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 text-white"
                    title="Upload a file"
                    onClick={fetchBookmarks} // This retains the click event handler
                    >
                    <UploadIcon className="w-6 h-6" />
                    {/* You can still include an input if needed for other functionalities */}
                    </button>                
                    </div>
                <div className={`flex items-center justify-center rounded-full w-24 h-24 ${isFavorite ? 'bg-custom-blue' : 'bg-blue-100'}`}>
                    <button onClick={toggleFavorite} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        {isFavorite ? (
                            <SolidStarIcon className="w-12 h-12 text-yellow-400 btn-active" />
                        ) : (
                            <OutlineStarIcon className="w-12 h-12 btn" />
                        )}
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-center w-full mt-4">
                <label htmlFor="toggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            id="toggle"
                            type="checkbox"
                            className="sr-only"
                            checked={enabled}
                            onChange={() => setEnabled(!enabled)}
                        />
                        <div className={`block w-14 h-8 rounded-full transition-colors duration-300 ${enabled ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${enabled ? 'translate-x-full border-blue-500' : 'translate-x-0 border-gray-400'} border-2`}></div>
                    </div>
                    <div className="ml-3 text-gray-700 font-medium">
                        {enabled ? 'Enabled' : 'Disabled'}
                    </div>
                </label>
            </div>
        </div>
    );
};

export default MainContent;
