document.addEventListener('DOMContentLoaded', () => {
  const fields = ['focusCount', 'distractCount', 'minTime', 'maxTime', 'currentTask'];
  
  // Load data
  chrome.storage.local.get({ 
    focusCount: 0, 
    distractCount: 0, 
    minTime: 20, 
    maxTime: 40,
    currentTask: "Deep Work"
  }, (data) => {
    document.getElementById('focusCount').textContent = data.focusCount;
    document.getElementById('distractCount').textContent = data.distractCount;
    document.getElementById('minTime').value = data.minTime;
    document.getElementById('maxTime').value = data.maxTime;
    document.getElementById('taskInput').value = data.currentTask;
  });

  // Save Settings
  document.getElementById('saveBtn').onclick = () => {
    const min = parseFloat(document.getElementById('minTime').value);
    const max = parseFloat(document.getElementById('maxTime').value);
    const task = document.getElementById('taskInput').value;

    if (min > 0 && max >= min) {
      chrome.storage.local.set({ minTime: min, maxTime: max, currentTask: task }, () => {
        chrome.runtime.sendMessage({ action: "updateConfig" });
        window.close(); // Close popup after saving
      });
    }
  };

  // Reset Counts
  document.getElementById('resetBtn').onclick = () => {
    if(confirm("Reset today's stats?")) {
      chrome.storage.local.set({ focusCount: 0, distractCount: 0 }, () => {
        location.reload(); 
      });
    }
  };
});