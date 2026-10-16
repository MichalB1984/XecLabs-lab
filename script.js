const grid = document.querySelector("#project-grid");
const count = document.querySelector("#project-count");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
}

async function loadPortfolio() {
  try {
    const response = await fetch("projects.json");
    if (!response.ok) throw new Error("Portfolio data could not be loaded");
    const data = await response.json();
    const projects = data.portfolio;
    grid.innerHTML = projects.map((project, index) => `
      <article class="project-card">
        <div class="project-top"><span class="project-number">${String(index + 1).padStart(2, "0")} / ${escapeHtml(project.company)}</span><span class="project-category">${escapeHtml(project.category)}</span></div>
        <h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p>
        <div class="project-tags">${project.outcomes.map(item => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        ${project.caseStudy ? `<details class="project-details"><summary>Explore case study</summary><div class="case-study-content">${project.company === "AB InBev" ? '<img class="client-logo" src="assets/abinbev.png" alt="AB InBev" loading="lazy">' : project.company === "EMCO" ? '<img class="client-logo client-logo-emco" src="assets/emco.svg" alt="EMCO" loading="lazy">' : ""}${project.caseStudy.platforms?.length ? `<div class="platform-list"><span class="platform-label">PLATFORMS</span>${project.caseStudy.platforms.map(platform => `<span class="platform-chip">${escapeHtml(platform)}</span>`).join("")}</div>` : ""}<div class="case-study-sections">${project.caseStudy.sections.map(section => `<section class="case-study-section"><h4>${escapeHtml(section.heading)}</h4><ul>${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`).join("")}</div></div></details>` : ""}
      </article>`).join("");
    count.textContent = `${String(projects.length).padStart(2, "0")} CASE STUDIES`;
  } catch {
    count.textContent = "PORTFOLIO DATA UNAVAILABLE";
    grid.innerHTML = '<p class="portfolio-error">Please open this page from a web server so the structured portfolio data can load.</p>';
  }
}

loadPortfolio();

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#primary-nav");
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("open", open);
});
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

const metricObserver = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  document.querySelectorAll(".metric-value").forEach(el => {
    const target = Number(el.dataset.value);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const started = performance.now();
    const duration = 1100;
    function tick(now) {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = `${prefix}${Math.floor(eased * target)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
  metricObserver.disconnect();
}, {threshold: 0.35});

const metrics = document.querySelector("#metrics");
if (metrics && "IntersectionObserver" in window) metricObserver.observe(metrics);
