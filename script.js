(function () {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.dataset.theme = savedTheme || preferredTheme;

  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", root.dataset.theme);
    });
  });

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const currentPath = location.pathname.replace(/\/index\.html$/, "/");
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/index\.html$/, "/");
    if (currentPath === linkPath || (link.hash && location.hash === link.hash)) {
      link.classList.add("active");
    }
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  const typingTarget = document.querySelector(".typing-text");
  if (typingTarget) {
    const words = typingTarget.dataset.words.split(",");
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const word = words[wordIndex];
      typingTarget.textContent = word.slice(0, charIndex);

      if (!deleting && charIndex < word.length) {
        charIndex += 1;
        setTimeout(typeLoop, 80);
      } else if (!deleting) {
        deleting = true;
        setTimeout(typeLoop, 1200);
      } else if (charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeLoop, 40);
      } else {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeLoop, 240);
      }
    }

    typeLoop();
  }

  initCalculator();
  initNotes();
  initQuiz();
  initPasswordGenerator();
})();

function initCalculator() {
  const display = document.querySelector("[data-calculator-display]");
  const keys = document.querySelectorAll("[data-calculator-key]");
  if (!display || !keys.length) return;

  let expression = "";
  const allowed = /^[0-9+\-*/().\s%]+$/;

  keys.forEach((key) => {
    key.addEventListener("click", () => {
      const value = key.dataset.calculatorKey;
      if (value === "clear") {
        expression = "";
      } else if (value === "backspace") {
        expression = expression.slice(0, -1);
      } else if (value === "=") {
        try {
          if (!allowed.test(expression)) throw new Error("Invalid expression");
          expression = String(Function(`"use strict"; return (${expression})`)());
        } catch {
          expression = "Error";
        }
      } else {
        expression = expression === "Error" ? value : expression + value;
      }
      display.textContent = expression || "0";
    });
  });
}

function initNotes() {
  const notes = document.querySelector("[data-notes]");
  const status = document.querySelector("[data-notes-status]");
  if (!notes) return;

  notes.value = localStorage.getItem("devhub-notes") || "";
  notes.addEventListener("input", () => {
    localStorage.setItem("devhub-notes", notes.value);
    if (status) status.textContent = "Saved locally";
  });
}

function initQuiz() {
  const questionEl = document.querySelector("[data-quiz-question]");
  const optionsEl = document.querySelector("[data-quiz-options]");
  const resultEl = document.querySelector("[data-quiz-result]");
  const nextButton = document.querySelector("[data-quiz-next]");
  if (!questionEl || !optionsEl || !resultEl || !nextButton) return;

  const questions = [
    {
      question: "Which language controls the structure of a webpage?",
      options: ["HTML", "CSS", "JavaScript", "Git"],
      answer: "HTML"
    },
    {
      question: "Which browser API stores small data locally?",
      options: ["Canvas", "localStorage", "Flexbox", "Media Query"],
      answer: "localStorage"
    },
    {
      question: "Which CSS feature is best for responsive two-dimensional layouts?",
      options: ["Grid", "Alert", "Prompt", "Console"],
      answer: "Grid"
    }
  ];

  let index = 0;
  let score = 0;
  let answered = false;
  let completed = false;

  function renderQuestion() {
    answered = false;
    completed = false;
    const item = questions[index];
    questionEl.textContent = item.question;
    optionsEl.innerHTML = "";
    resultEl.textContent = `Question ${index + 1} of ${questions.length}: choose an answer`;
    nextButton.textContent = index === questions.length - 1 ? "Finish" : "Next";
    nextButton.disabled = true;

    item.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.dataset.answer = option;
      button.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const optionButtons = optionsEl.querySelectorAll("button");
        optionButtons.forEach((optionButton) => {
          optionButton.disabled = true;
          if (optionButton.dataset.answer === item.answer) {
            optionButton.classList.add("correct");
          }
        });

        if (option === item.answer) {
          score += 1;
          button.classList.add("selected");
          resultEl.textContent = "Correct answer";
        } else {
          button.classList.add("wrong");
          resultEl.textContent = `Correct answer: ${item.answer}`;
        }
        nextButton.disabled = false;
      });
      optionsEl.appendChild(button);
    });
  }

  nextButton.addEventListener("click", () => {
    if (completed) {
      index = 0;
      score = 0;
      renderQuestion();
      return;
    }

    if (!answered) return;

    if (index < questions.length - 1) {
      index += 1;
      renderQuestion();
    } else {
      questionEl.textContent = `Your score is ${score}/${questions.length}`;
      optionsEl.innerHTML = "";
      resultEl.textContent = "Press restart to try again.";
      nextButton.textContent = "Restart";
      nextButton.disabled = false;
      completed = true;
    }
  });

  renderQuestion();
}

function initPasswordGenerator() {
  const output = document.querySelector("[data-password-output]");
  const lengthInput = document.querySelector("[data-password-length]");
  const generateButton = document.querySelector("[data-password-generate]");
  const copyButton = document.querySelector("[data-password-copy]");
  if (!output || !lengthInput || !generateButton || !copyButton) return;

  const sets = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{};:,.<>?"
  };

  function generatePassword() {
    const length = Math.min(Math.max(Number(lengthInput.value) || 12, 6), 32);
    const enabled = Array.from(document.querySelectorAll("[data-password-set]:checked")).map((item) => item.dataset.passwordSet);
    const pool = enabled.map((key) => sets[key]).join("") || sets.lower + sets.numbers;
    let password = "";

    for (let i = 0; i < length; i += 1) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      password += pool[randomIndex];
    }

    output.textContent = password;
  }

  generateButton.addEventListener("click", generatePassword);
  copyButton.addEventListener("click", async () => {
    const password = output.textContent.trim();
    if (!password || password === "Click generate") return;
    try {
      await navigator.clipboard.writeText(password);
      copyButton.textContent = "Copied";
    } catch {
      copyButton.textContent = "Copy failed";
    }
    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1200);
  });

  generatePassword();
}
