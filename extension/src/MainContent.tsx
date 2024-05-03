import React, { useState } from 'react';
import { UploadIcon } from '@heroicons/react/outline';

import './App.css';

const MainContent = ({ setAlertData, onSaveFavorite, onBulkUploadBookmarks }) => {
    const [enabled, setEnabled] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [addBookmarks, setAddBookmarks] = useState(false);

    const favouritesHandler = () => {

        let token = localStorage.getItem("token")
        if (token) {
            setIsFavorite(!isFavorite);
            if (!isFavorite) {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    const currentTab = tabs[0];
                    if (currentTab) {
                        console.log("Saving URL:", currentTab.url);
                        onSaveFavorite(currentTab.url);

                    }
                });
            }
        } else {
            setAlertData({ message: "Please login to the dashboard before saving!", type: "error" })
        }
    }


    const bulkUploadBookmarkHandler = () => {
        let token = localStorage.getItem("token")
        if (token) {
            setAddBookmarks(!addBookmarks);
            console.log("flag ", addBookmarks);
            if (!addBookmarks) {
                console.log("calling")
                let res = onBulkUploadBookmarks();
                if (!res) {
                    setAddBookmarks(!addBookmarks);
                }
            }
        } else {
            setAlertData({ message: "Please login to the dashboard before saving!", type: "error" })
        }
    }

    return (
        <div className="flex flex-col items-center py-5 sm:py-10 bg-white w-full">
            <div className="flex space-x-4 items-center justify-center">
                <div className="flex items-center justify-center bg-blue-100 rounded-full w-24 h-24">
                    <button
                        className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 text-white"
                        title="Upload a file"
                        onClick={bulkUploadBookmarkHandler} // This retains the click event handler
                    >
                        <UploadIcon className="w-6 h-6" />
                        {/* You can still include an input if needed for other functionalities */}
                    </button>
                </div>
                <div className={`flex items-center justify-center rounded-full w-24 h-24 ${isFavorite ? 'bg-custom-blue' : 'bg-blue-100'}`}>
                    <button onClick={favouritesHandler} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                        {isFavorite ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-yellow-400 btn-active border-none">
                                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd" />
                            </svg>

                        ) : (

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12 border-none outline-none">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                            </svg>

                        )}
                    </button>
                </div>
            </div>
            <div className="flex items-center justify-center w-full mt-4">
                <label htmlFor="toggle" className="flex items-center cursor-pointer">
                    <div className="ml-3 text-gray-700 font-medium">
                        {'Tracking'}
                    </div>
                    <div className="relative ml-2">
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

                </label>
            </div>
        </div>
    );
};

export default MainContent;
