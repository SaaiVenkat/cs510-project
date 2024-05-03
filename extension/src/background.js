// Listen for messages from content script
console.log("hi from worker")

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "open_extension_page") {
        // chrome.tabs.create({ url: chrome.runtime.getURL('js/index.html') });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Local Storage Data:", message.localStorageData);
    chrome.runtime.sendMessage({ type: 'service_worker_message', data: message });
});