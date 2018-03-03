var update = function(tab, lastIndex) {
  var id = tab.id;
  var index = tab.index + 1;
  var title = tab.title;

  if (!title) {
    return;
  }
  
  // Remove the old index from the title
  title = title.replace(/^([1-9]\.\s)*/, "");

  // Chrome allows to go to a specific tab using shortcut: CTRL/CMD + N, where N is a number between 1 and 8. 
  // Unfortunately, you can't go past 8, and the last tab is 9.
  if (index < 9) {
    title = index + '. ' + title;
  } else if (index === lastIndex) {
    title = '9. ' + title;
  }

  try {
    chrome.tabs.executeScript(
      id,
      {
        code : "document.title = '" + title + "';"
      }
    );
    console.log("executed: " + id);
  } catch(e) {}
};

function updateAll() {
  chrome.tabs.query({}, function(tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      update(tab, tabs.length);
    }
  });
}

chrome.tabs.onCreated.addListener(function(tab){
  updateAll();
});

chrome.tabs.onMoved.addListener(function(tabId, moveInfo) {
  updateAll();
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  updateAll();
});

chrome.tabs.onAttached.addListener(function(tabId, attachInfo) {
  updateAll();
});

chrome.tabs.onDetached.addListener(function(tabId, detachInfo) {
  updateAll();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    update(tab);
  }
});

updateAll();
