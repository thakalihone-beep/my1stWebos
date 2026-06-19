# Roshan Dev Hub

A static personal developer website that combines a portfolio, a developer blog, and a mini web apps collection.

## Folder structure

```text
my1stWebos/
  index.html
  style.css
  script.js
  blog/
    index.html
    my-first-webos-project.html
    how-i-learned-javascript.html
    building-my-amazon-clone.html
  apps/
    index.html
    calculator.html
    notes.html
    quiz.html
    password.html
```

## How it connects

- `index.html` is the portfolio home page.
- `blog/index.html` lists blog cards, and each blog post has its own HTML page.
- `apps/index.html` lists the mini apps, and each app opens on its own page.
- `style.css` contains the full responsive design, light theme, dark theme, cards, layout, and animations.
- `script.js` powers the mobile menu, theme toggle, typing animation, reveal animations, localStorage notes, quiz, calculator, and password generator.

## Run locally

Open `index.html` in your browser, or run a local server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```
