(function () {
  const notes = document.querySelector("[data-notes]");
  const status = document.querySelector("[data-notes-status]");
  if (!notes) return;

  notes.value = localStorage.getItem("devhub-notes") || "";
  notes.addEventListener("input", () => {
    localStorage.setItem("devhub-notes", notes.value);
    if (status) status.textContent = "Saved locally";
  });
})();
