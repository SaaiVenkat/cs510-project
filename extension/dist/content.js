console.log("content script is executing");const localStorageData=localStorage.getItem("token");console.log(localStorageData),chrome.runtime.sendMessage({localStorageData});