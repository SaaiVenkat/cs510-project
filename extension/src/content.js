console.log("content script is executing")
// Retrieve data from local storage
const localStorageData = localStorage.getItem("token");
console.log(localStorageData)
// Send data to the background script
chrome.runtime.sendMessage({ localStorageData });