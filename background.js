// --- Alarm Logic ---
chrome.runtime.onInstalled.addListener(() => scheduleNextCheck());
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "soulCheck") {
    checkFocusStatus();
    scheduleNextCheck();
  }
});

function scheduleNextCheck() {
  chrome.storage.local.get({ minTime: 20, maxTime: 40 }, (config) => {
    const delay = Math.random() * (config.maxTime - config.minTime) + config.minTime;
    chrome.alarms.create("soulCheck", { delayInMinutes: delay });
  });
}

// --- Interaction Logic ---
async function checkFocusStatus() {
  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.url.startsWith("http")) return;

    chrome.storage.local.get({ currentTask: "Working" }, async (data) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectInquiry,
        args: [tab.title || "this tab", data.currentTask]
      });
    });
  } catch (err) { console.error(err); }
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "recordResult") {
    chrome.storage.local.get({ focusCount: 0, distractCount: 0 }, (data) => {
      const update = request.focused 
        ? { focusCount: data.focusCount + 1 } 
        : { distractCount: data.distractCount + 1 };
      chrome.storage.local.set(update);
    });
  }
  if (request.action === "updateConfig") {
    chrome.alarms.clear("soulCheck", () => scheduleNextCheck());
  }
});

// --- UI Injection ---
function injectInquiry(pageTitle, targetTask) {
  if (document.getElementById('focus-monitor-overlay')) return;

  const iconUrl = chrome.runtime.getURL('icon48.png'); 
  const overlay = document.createElement('div');
  overlay.id = 'focus-monitor-overlay';
  Object.assign(overlay.style, {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '300px', zIndex: '2147483647', pointerEvents: 'auto'
  });

  overlay.innerHTML = `
    <div style="background:white; padding:20px; border-radius:16px; border:1px solid #ddd; box-shadow: 0 10px 40px rgba(0,0,0,0.2); font-family: -apple-system, sans-serif; text-align: center;">
      <img src="${iconUrl}" style="width:40px; margin-bottom:10px; margin-left:auto; margin-right:auto; display:block;">
      <div style="font-size:16px; font-weight:bold; color:#111; margin-bottom:15px;">Reality Check</div>
      <div style="font-size:12px; color:#555; line-height:1.5; margin-bottom:20px; text-align:left; background:#f9f9f9; padding:10px; border-radius:8px;">
        🚀 <b style="color:#27ae60;">Target:</b> ${targetTask}<br>
        👀 <b style="color:#e74c3c;">Current:</b> ${pageTitle.substring(0,35)}...
      </div>
      <div style="display:flex; gap:10px;">
        <button id="btn-focus" style="flex:1.2; padding:10px; background:#27ae60; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:600; font-size:12px;">Yes, Focusing</button>
        <button id="btn-fish" style="flex:1; padding:10px; background:#fff; color:#666; border:1px solid #ccc; border-radius:6px; cursor:pointer; font-size:12px;">No, Drifting</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('btn-focus').onclick = () => {
    chrome.runtime.sendMessage({ action: "recordResult", focused: true });
    overlay.remove();
  };
  document.getElementById('btn-fish').onclick = () => {
    chrome.runtime.sendMessage({ action: "recordResult", focused: false });
    overlay.remove();
  };
}