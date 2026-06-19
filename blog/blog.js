(function () {
  const article = document.querySelector(".article-body");
  const blogGrid = document.querySelector(".blog-grid");

  document.body.classList.add("blog-page");

  if (blogGrid) {
    blogGrid.querySelectorAll(".post-card").forEach((card, index) => {
      card.style.setProperty("--card-order", String(index));
    });
  }

  if (!article) return;

  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  const words = article.textContent.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  const readTime = document.createElement("p");
  readTime.className = "article-meta";
  readTime.textContent = `${minutes} min read`;
  article.querySelector("h1")?.after(readTime);

  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.min(percent, 100)}%`;
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
})();
