function saveToLocalStorage(cookies, marketId) {
  const reweCookiesKey = "rewe-cookies";
  const reweMarketKey = "rewe-market";

  localStorage.setItem(reweCookiesKey, JSON.stringify(cookies));
  localStorage.setItem(reweMarketKey, marketId);
  window.postMessage(
    {
      type: "REWE_CONFIGURED",
      text: "",
    },
    "*"
  );
}

async function readCookiesFromRewe(reweTabId) {
  // extract market id from page
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: reweTabId },
    func: () => {
      const marketIdElement = document.querySelector("[data-wwident]");

      if (marketIdElement == null) {
        return window.ReweBasket.sessionMarketInformation.marketCode;
      }

      return marketIdElement.getAttribute("data-wwident");
    },
  });

  chrome.cookies.getAll({ domain: ".rewe.de" }, (cookies) => {
    configureNuri(cookies, result);
  });
}

async function configureNuri(reweCookies, marketId) {
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
      args: [reweCookies, marketId],
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
    await readCookiesFromRewe(tab.id);
    addNotification("Warenkorb konfiguriert! Gehe zur&uuml;ck zu nuribot.de");
  } else {
    addNotification(
      "Gehe zu https://shop.rewe.de, wähle einen Markt und rufe die Erweiterung erneut auf"
    );
  }
}

init();
