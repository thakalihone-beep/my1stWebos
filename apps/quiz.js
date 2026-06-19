(function () {
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
      button.addEventListener("click", () => chooseAnswer(button, option, item.answer));
      optionsEl.appendChild(button);
    });
  }

  function chooseAnswer(button, option, answer) {
    if (answered) return;
    answered = true;

    optionsEl.querySelectorAll("button").forEach((optionButton) => {
      optionButton.disabled = true;
      if (optionButton.dataset.answer === answer) {
        optionButton.classList.add("correct");
      }
    });

    if (option === answer) {
      score += 1;
      button.classList.add("selected");
      resultEl.textContent = "Correct answer";
    } else {
      button.classList.add("wrong");
      resultEl.textContent = `Correct answer: ${answer}`;
    }

    nextButton.disabled = false;
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
})();
