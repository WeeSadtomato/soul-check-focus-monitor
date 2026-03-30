# Soul Check — Focus Monitor

> A Chrome extension that randomly interrupts you to ask: *"Are you actually working right now?"*

---

## What it does

While you browse, **Soul Check** silently runs a background timer.  At a random moment — somewhere between your chosen minimum and maximum interval — a card pops up in the centre of whatever page you are on:

- 🚀 **Target** — the task you said you were doing
- 👀 **Current** — the title of the active tab

You then click one honest button:

| Button | Meaning |
|---|---|
| **Yes, Focusing** | You were on task — counts as a focus point |
| **No, Drifting** | You got distracted — counts as a drift point |

The popup disappears immediately and the next random check is scheduled.

---

## Screenshot

*Popup card injected into any webpage:*



---

## Installation (Developer Mode)

1. Download or clone this repository
2. Open Chrome and navigate to 
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the  folder
6. The 🧠 icon appears in your toolbar — click it to configure

---

## Usage

Click the toolbar icon to open the settings popup:

| Setting | Default | Description |
|---|---|---|
| **Current Task** | Deep Work | What you *should* be doing right now |
| **Min interval** | 20 min | Earliest the next check fires |
| **Max interval** | 40 min | Latest the next check fires |

Click **Save & Start** to apply.  The extension picks a random delay between Min and Max and schedules the next check.

The **Focus / Drift** counters at the top track your honest answers for the session.  Click **Reset Counts** to start fresh.

---

## How it works



- **Manifest v3** service worker  
- Uses  (survives browser restart, not affected by tab sleep)  
- Overlay is injected via  — no persistent content script  

---

## Permissions explained

| Permission | Why it is needed |
|---|---|
|  | Schedule the random focus checks |
| [3g
H        H        H        H        H        H        H        H        H        H        H 
 | Get the title of the currently active tab |
|  | Inject the popup card into the active page |
|  | Save your task, interval settings and counters |
|  | Access the focused tab when an alarm fires |
|  | Allow card injection on any website |

---

## Files



---

## License

MIT — free to use, fork and modify.
