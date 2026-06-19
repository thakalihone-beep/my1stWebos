(function () {
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
})();
