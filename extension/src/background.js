// Listen for messages from content script
console.log("hi from worker")
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const localStorageData = message.localStorageData;
    // Process the local storage data
    console.log("Local Storage Data:", localStorageData);
    chrome.runtime.sendMessage({ type: 'service_worker_message', data: message });
});