//whenever open a new tab or when shift focus on another tab from current tab -> first loaded tab
//chrome.runtime.onInstalled.addListener(function () {
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url !== undefined && changeInfo.status === "complete") {
    console.log("new tab created....waiting...");
    console.log(tab);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTabData = tabs[0];
      console.log("The current tab is: " + currentTabData.url);

      //For Facebook Messenger
      if (currentTabData.url.includes("facebook.com/messages")) {
        //inject content script into the current tab (1)
        chrome.scripting.executeScript({
          target: { tabId: currentTabData.id },
          files: ["scripts/facebookMessenger.js"],
        });
      }

      //For Meta Business Suite
      if (currentTabData.url.includes("business.facebook.com/latest/inbox")){
        //inject content script into the current tab (1)
        chrome.scripting.executeScript({
          target: { tabId: currentTabData.id },
          files: ["scripts/businessSuite.js"],
        });
      }

      //For Shopee -> upcoming
      if (currentTabData.url.includes("shopee.com")){
        //inject content script into the current tab (1)
        // chrome.scripting.executeScript({
        //   target: { tabId: currentTabData.id },
        //   files: ["scripts/shopee.js"],
        // });
      }


      setTimeout(() => {
        chrome.tabs.sendMessage(
          tabId,
          "Hello, sending from background script to content script, tab: " +
            tabId, //message //send message and display to the CURRENT TAB ONLY (3)
          (response) => {
            //receive response from the content script (4)
            console.log(response);
          }
        );
      }, 1000);
    });
  }
});

//listening from (1)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  console.log("Sender details: ");
  console.log(sender);
  sendResponse("hi"); //send response back to content script (2)
});
//});
