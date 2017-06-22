async function get_pocket_count(url) {
  const pocketUrl = encodeURIComponent(`https://widgets.getpocket.com/v1/button?v=1&count=horizontal&url=${url}&src=${url}`);
  const response = await fetch(`http://query.yahooapis.com/v1/public/yql?q=select * from xml where url%3D%22${pocketUrl}%22&format=xml`)
  const str = await response.text();
  const doc = await new window.DOMParser().parseFromString(str, "text/xml")
  return doc.querySelector('#cnt').innerHTML;
}

const updateCount = () => {
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, (tabs) => {
    const url = tabs[0].url;
    if(!url) {
      return;
    }
    get_pocket_count(url).then((data) => {
      chrome.browserAction.setBadgeText({text: data});
    });
  });
}

chrome.tabs.onActivated.addListener(updateCount);
chrome.tabs.onUpdated.addListener(updateCount);