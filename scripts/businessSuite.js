chrome.runtime.sendMessage(
  "Hello, sending from content script to background script", //message //send message to the background script page (1)
  (response) => {
    //receive response from the background.js and display to the CURRENT TAB ONLY, receive response (2)
    console.log(response);
  }
);

//listening from (3)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  console.log("Sender details from background script: ");
  console.log(sender);
  newChatLoaded();
  sendResponse("thank you"); //send response back to background (4)
});

const newChatLoaded = () => {
  var buttonElementTest = document.createElement("button");
  buttonElementTest.id = "btn-suggestion";
  buttonElementTest.textContent = "Gợi ý tin nhắn";
  buttonElementTest.style.color = "white";
  buttonElementTest.style.fontSize = "16px";
  buttonElementTest.style.backgroundColor = "#00B2FF";

  //var suggestionBtn = document.getElementById('btn-suggestion')
  var textInput = document.getElementsByClassName(
    "xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1qx5ct2 x37zpob xtt52l0 xctk3hg xxymvpz xh8yej3 x1ejq31n xd10rxx x1sy0etr x17r0tee x1f6kntn x7whbhp x1j61x8r _58al uiTextareaAutogrow xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd x1qx5ct2 x37zpob xtt52l0 xctk3hg xxymvpz xh8yej3 x1ejq31n xd10rxx x1sy0etr x17r0tee x1f6kntn x7whbhp x1j61x8r"
  )[0];
  textInput.parentNode.insertBefore(buttonElementTest, textInput.nextSibling);
  //console.log(textInput);

  buttonElementTest.addEventListener("click", () => {
    generateResponse(textInput, buttonElementTest);
  });
};

async function generateResponse(textInput, buttonElementTest) {
  NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
  var messagesContainers = document.getElementsByClassName(
    "x1y1aw1k xn6708d xwib8y2 x1ye3gou x13faqbe x1eied1y xca6lcq x1pdtjp8 xpctjk2 xogfrqt x1slwz57 xt0e3qv"
  );
  var lastestMessage;
  Array.from(messagesContainers).forEach(function (item, index) {
    if (index === messagesContainers.length - 1) {
      lastestMessage = item.getElementsByTagName("span")[1].textContent;
      console.log(lastestMessage);
    }
  });

  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer TOKEN-KEY"
  );
  myHeaders.append("OpenAI-Beta", "assistants=v1");
  myHeaders.append("Content-Type", "application/json");

  //SEND THE MESSAGE TO THE ASSISTANT'S THREAD
  const messageDataToSend = {
    role: "user",
    content: `${lastestMessage}`,
  };

  var sendMessageRequestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(messageDataToSend), //Convert
  };

  //SEND THE REQUEST FOR MESSAGE EXECUTION
  const threadRunCommand = {
    assistant_id: "{assistant_id}",
    instructions: "",
  };

  var sendExecutionCommandOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(threadRunCommand), //Convert
  };

  //Generate the response to the Input
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  makeRequest(
    "https://api.openai.com/v1/threads/{THREAD_ID}/messages",
    sendMessageRequestOptions,
    buttonElementTest
  )
    .then((response1) => {
      return makeRequest(
        "https://api.openai.com/v1/threads/{THREAD_ID}/runs",
        sendExecutionCommandOptions,
        buttonElementTest
      );
    })
    .then((response2) => {
      return new Promise((resolve) => setTimeout(resolve, 4000));
    })
    .then(() => {
      return generateMessageToTheInput(
        "https://api.openai.com/v1/threads/{THREAD_ID}/messages",
        requestOptions,
        textInput,
        buttonElementTest
      );
    })
    .then((response3) => {
      console.log("Response 3:", response3);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function makeRequest(url, options, buttonElementTest) {
  return fetch(url, options)
    .then((response) => {
      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response);
      buttonElementTest.textContent = "Đang tạo tin nhắn...";
      // Parse the JSON response
      return response.json();
    })
    .catch((err) => console.log(err));
}

function generateMessageToTheInput(url, options, textInput, buttonElementTest) {
  return fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      if (
        result.data[0].content[0] == undefined ||
        result.data[0].role == "user"
      ) {
        console.log(
          "Response from the assistance is still generating..waiting.."
        );
        generateMessageToTheInput(url, options, textInput, buttonElementTest);
        buttonElementTest.textContent = "Đợi 1 chút...";
      } else {
        textInput.value = result.data[0].content[0].text.value.split("【")[0];
        buttonElementTest.textContent = "Gợi ý tin nhắn";
        var event = new Event("input", {
          bubbles: true,
          cancelable: true,
        });
        textInput.dispatchEvent(event);
        return result;
      }
    })
    .catch((error) => console.log("error", error));
}
