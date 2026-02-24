# 🔒 Focus Browser

A locked-down desktop browser that only allows **one website** + **PDF reading**.  
Trying to visit any other site? You'll have to **type a full paragraph by hand** first.

## Features
- ✅ One allowed website (configurable)
- 📄 Built-in PDF reader (open local PDF files)
- ⛔ All other websites are blocked behind a typing challenge
- 🚫 Copy-paste completely disabled during challenge
- 🎯 Real-time character highlighting & progress bar

## How to Get the App (No Coding Tools Needed)

### 1. Create the Repository
- Go to **github.com/new** and create a repo named `focus-browser`
- Upload / create all the files from this project

### 2. Wait for the Build
- Go to the **Actions** tab in your repo
- The build starts automatically on push
- Wait ~5 minutes for it to finish (green check ✅)

### 3. Download Your App
- Click the completed workflow run
- Scroll to **Artifacts**
- Download for your OS:
  - `FocusBrowser-Windows` → `.exe` installer
  - `FocusBrowser-macOS` → `.dmg` file
  - `FocusBrowser-Linux` → `.AppImage` file

### 4. Install & Run
- **Windows:** Double-click the `.exe` → Install → Run
- **Mac:** Open `.dmg` → Drag to Applications → Run
- **Linux:** `chmod +x *.AppImage` → Double-click to run

## How to Change the Allowed Website

Open `main.js` and edit the top section:

```js
const ALLOWED_WEBSITES = [
  'https://chat.openai.com',
  // add more:
  // 'https://docs.google.com',
];
