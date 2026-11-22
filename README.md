# Gut Gyaan — website

Bilingual (Hindi + English) patient-education site by Dr Ravi Kumar, MD:
28 gut and liver conditions, 19 Indian diet charts, a "how long do I take my
medicine?" FAQ, red-flag symptoms and an interactive breathing guide.

It is a plain static website: no build step, no server code, no database.
Any free static host can serve it.

## Files

| File | What it is | Edit it? |
|---|---|---|
| `index.html` | Page layout: header, hero, section titles, red flags, About, footer | Yes, for fixed text |
| `assets/js/content.js` | **All conditions, diets and medicine FAQs** | Yes — this is where content lives |
| `assets/css/style.css` | Colours, fonts, layout | Only to change the look |
| `assets/js/app.js` | Search, page switching, language toggle, breathing guide | Normally no |
| `assets/img/favicon.svg` | Browser-tab icon | Optional |
| `404.html` | "Page not found" page | Optional |

## See it on your computer

Double-click `index.html` — it opens in your browser and works offline
(fonts need internet). After editing a file, save and press reload.

## Editing content (`assets/js/content.js`)

Every bilingual piece of text is a pair: `["English", "हिंदी"]`.

### Change a condition's text
Search the file for the condition's name (for example `"Hepatitis B"`) and
edit the words inside the quotes.

### Add a new condition
Copy an existing condition block `{ "id": ..., ... }`, paste it after the last
one in `"conditions"` (put a comma between blocks) and change it:

```js
{
 "id": "liver-abscess",              // web address: yoursite/#liver-abscess (lowercase, dashes, unique)
 "organ": "liver",                   // one of: food-pipe-stomach, intestine, liver, gb-pancreas
 "en": "Liver abscess",
 "hi": "लिवर में मवाद",
 "tag": ["Pus collection in the liver", "लिवर में मवाद जमा होना"],   // short line under the title on the card
 "sections": [
  ["What is it?", "यह क्या है?", "list", [
    ["English point", "हिंदी बिंदु"],
    ["Another point", "दूसरा बिंदु"]
  ]],
  ["When to see a doctor", "डॉक्टर को कब दिखाएं", "warn", [ ... ]],   // "warn" = red heading
  ["How long is treatment?", "इलाज कितने समय?", "dur", [ ... ]]        // "dur" = shaded box
 ]
}
```

It appears automatically in the right organ group, in search, and in the
previous/next links. Update the "28 … conditions" number in `index.html`.

### Link a diet to a condition
In `"cdiets"`, add `"condition-id": ["diet-id", "another-diet-id"]`.

### Add a diet chart
Copy a block from `"diets"`. `"group"` must be one of the ids in `"dgroups"`.
A diet's `"blocks"` can be any of:

```js
["rules",   [["English", "हिंदी"], ...]]                          // shaded "Key rules" box
["caution", [["English", "हिंदी"], ...]]                          // red "Caution" box
["list",    "Heading", "शीर्षक", [["English", "हिंदी"], ...]]
["foods",   "Heading", "शीर्षक", [eat...], [limit...], [avoid...]]  // three coloured columns; limit may be []
["table",   "Heading", "शीर्षक", ["Col 1", "Col 2"], [["row", "cells"], ["Total", "..."]], "optional footnote"]
```

### Add a medicine FAQ
In `"meds"`, add `["Question", "प्रश्न", "Answer", "उत्तर"]`.

### If the page goes blank after editing
A comma or quote is missing. Open the browser console (F12) to see the line
number, or paste everything after `window.DATA =` into https://jsonlint.com.

## Publishing the website (free)

### Option A — GitHub Pages (this repository)
1. Merge this branch into `main`.
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`, **Save**.
3. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.
   Every later push to `main` updates it automatically.

### Option B — Netlify Drop (no GitHub needed)
Go to https://app.netlify.com/drop and drag this whole folder onto the page.

### Your own domain (e.g. gutgyaan.in)
Buy the domain from any registrar, then add it under GitHub **Settings → Pages →
Custom domain** (or Netlify **Domain settings**) and follow the DNS steps shown there.
HTTPS is free on both.

## Disclaimer
The footer disclaimer states that the site is general health education and not
individual medical advice. Keep it on every page.
