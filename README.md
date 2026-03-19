# Sourav Mishra Portfolio

A modern static portfolio site built with HTML, CSS, and vanilla JavaScript modules.

## Tech Stack

- HTML5
- CSS3 (modular stylesheets)
- JavaScript (ES modules)
- Three.js (CDN)

## Project Structure

- index.html
- css/
  - variables.css
  - base.css
  - components.css
  - sections.css
  - responsive.css
- js/
  - main.js
  - loader.js
  - cursor.js
  - navbar.js
  - scrollReveal.js
  - tilt.js
  - sceneBackground.js
  - sceneHero.js
  - pong.js
  - contactForm.js

## Run Locally

### Option 1: VS Code Live Server

1. Open this folder in VS Code.
2. Install the Live Server extension.
3. Right-click index.html and select Open with Live Server.

### Option 2: Node static server

```powershell
cd portfolio
npx serve .
```

Then open the localhost URL shown in terminal.

## Production Notes

- Uses Three.js from a CDN.
- JS includes guards so the site still works if Three.js fails to load.
- Contact form uses a mailto handoff (no backend required).

## GitHub Push

```powershell
cd portfolio
git init
git add .
git commit -m "Initial production-ready portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy

This is a static website and can be deployed on GitHub Pages, Netlify, or Vercel.
