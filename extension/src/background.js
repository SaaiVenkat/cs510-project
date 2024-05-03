// Listen for messages from content script
console.log("hi from worker")
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Local Storage Data:", message.localStorageData);
    chrome.runtime.sendMessage({ type: 'service_worker_message', data: message });
});