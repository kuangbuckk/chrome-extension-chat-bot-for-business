//change the pages's body content (1)
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
  newChatLoaded()
  sendResponse("thank you"); //send response back to background (4)
});

const newChatLoaded = () => {
    var containers =
    document.getElementsByClassName("x4k7w5x x1h91t0o x1h9r5lt x1jfb8zj xv2umb2 x1beo9mf xaigb6o x12ejxvf x3igimt xarpa2k xedcshv x1lytzrv x1t2pt76 x7ja8zs x1qrby5j");
    var lastContainer1 = containers[containers.length - 1]
    
    console.log(lastContainer1)
    var buttonElementTest = document.createElement('button')
    buttonElementTest.id = 'btn-suggestion'
    buttonElementTest.textContent = 'Gợi ý tin nhắn'
    buttonElementTest.style.color = 'white'
    buttonElementTest.style.fontSize = '16px'
    buttonElementTest.style.backgroundColor = '#00B2FF'
    lastContainer1.appendChild(buttonElementTest)

    //var suggestionBtn = document.getElementById('btn-suggestion')
    var textInput = document.querySelector('p.xat24cr.xdj266r')
    console.log(textInput)

    buttonElementTest.addEventListener('click', () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer TOKEN-KEY");
        myHeaders.append("OpenAI-Beta", "assistants=v1");
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        
        fetch("https://api.openai.com/v1/threads/{THREAD_ID}/messages", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result.data[0].content[0].text.value)
            //textInput.innerHTML = `<span data-lexical-text="true">${result.data[0].content[0].text.value}</span>`
            textInput.classList.add('xdpxx8g')
            textInput.setAttribute('dir', 'ltr')
            setTimeout(() => {
                var span = document.createElement("span")
                span.textContent = `${result.data[0].content[0].text.value}`
                span.setAttribute('data-lexical-text', 'true')
                textInput.appendChild(span)
            }, 2000)
        })
          .catch(error => console.log('error', error));
})
};
