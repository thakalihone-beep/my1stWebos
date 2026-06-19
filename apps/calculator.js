(function () {
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
          if (!expression || !allowed.test(expression)) throw new Error("Invalid expression");
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
})();
