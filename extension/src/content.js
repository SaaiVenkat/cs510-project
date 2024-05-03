console.log("content script is injected!")

// Retrieve data from local storage
const localStorageData = localStorage.getItem("token");
console.log(localStorageData)
chrome.runtime.sendMessage({ action: "open_extension_page" });
if (localStorageData) {
    console.log("sending data to extention")
    chrome.runtime.sendMessage({ localStorageData });
} else {
    console.log("sending empty state to extention")
    chrome.runtime.sendMessage({ localStorageData: '' });
}



