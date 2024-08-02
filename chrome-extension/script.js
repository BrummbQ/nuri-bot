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

function readCookiesFromRewe() {
  chrome.cookies.getAll({ domain: ".rewe.de" }, (cookies) => {
    configureNuri(cookies);
  });
}

async function configureNuri(reweCookies) {
  // Get the tab with nuri app
  const tabs = await chrome.tabs.query({
    url: ["http://localhost:3000/*", "https://nuribot.de/*"],
    currentWindow: true,
  });
  const nuriTab = tabs[0];

  // Save data to page local storage
  if (nuriTab != null) {
    await chrome.scripting.executeScript({
      target: { tabId: nuriTab.id },
      func: saveToLocalStorage,
      args: [reweCookiesKey, reweCookies],
    });
  }
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
    readCookiesFromRewe();
    addNotification("Warenkorb konfiguriert! Gehe zur&uuml;ck zu nuribot.de");
  } else {
    addNotification(
      "Gehe zu https://shop.rewe.de, wähle einen Markt und rufe die Erweiterung erneut auf",
    );
  }
}

init();
