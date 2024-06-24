const reweCookiesKey = "rewe-cookies";

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  window.postMessage(
    {
      type: "REWE_CONFIGURED",
      text: "",
    },
    "*",
  );
}

function saveReweData() {
  chrome.cookies.getAll({ domain: "rewe.de" }, (cookies) => {
    chrome.storage.local.set({ [reweCookiesKey]: cookies });
  });
}

function readReweData() {
  chrome.storage.local.get([reweCookiesKey], async function (result) {
    const cookies = result[reweCookiesKey];
    // Get the current tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];

    // Save data to page local storage
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: saveToLocalStorage,
      args: [reweCookiesKey, cookies],
    });
  });
}

function addNotification(text) {
  const note = document.createElement("p");
  note.innerHTML = text;
  document.getElementById("infoContainer").appendChild(note);
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab == null) {
    return;
  }

  if (tab.url.includes("shop.rewe.de")) {
    saveReweData();
    addNotification("Warenkorb ausgelesen!");
  } else {
    readReweData();
    addNotification("Warenkorb konfiguriert!");
  }
}

init();
