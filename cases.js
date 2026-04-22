let allCases = [];

// LOAD DATA
fetch("allCases.json")
  .then(res => res.json())
  .then(data => {
    allCases = data;
    renderCases(data);
  });

/* RENDER CARDS */
function renderCases(cases) {
  const container = document.getElementById("casesContainer");
  container.innerHTML = "";

  cases.forEach(c => {

    const category = getCategory(c.case_type);

    const card = `
      <article class="case-card" data-category="${category}" role="listitem">

        <span class="case-badge badge-${category}">
          ${category.toUpperCase()}
        </span>

        <h3 class="case-title">
          ${c.case_type}/${c.case_number}/${c.case_year}
        </h3>

        <p style="font-size:0.85rem;color:var(--mid-gray);line-height:1.6;">
          ${formatParties(c.parties)}
        </p>

        <div class="case-meta">
          <span class="case-court">📍 ${c.court}</span>
          <span class="case-outcome outcome-won">✔ Case</span>
        </div>

        <div class="case-year">Year: ${c.case_year}</div>

      </article>
    `;

    container.innerHTML += card;
  });
}

/* CATEGORY LOGIC */
function getCategory(type) {
  type = type.toLowerCase();

  if (type.includes("arb")) return "msmed";
  if (type.includes("civil") || type === "ca") return "civil";
  if (type.includes("ndps") || type.includes("crm")) return "criminal";
  if (type.includes("coma")) return "consumer";
  if (type.includes("exe") || type.includes("property")) return "property";

  return "civil";
}

/* FORMAT TEXT */
function formatParties(text) {
  return text
    .replace(/Vs/gi, " vs ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
}

/* ========================= */
/* 🔥 FILTER BUTTON LOGIC */
/* ========================= */

const filterBtns = document.querySelectorAll(".filter-btn");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {

    // ACTIVE BUTTON UI
    filterBtns.forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });

    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    const filter = btn.dataset.filter;

    if (filter === "all") {
      renderCases(allCases);
    } else {
      const filtered = allCases.filter(c => {
        return getCategory(c.case_type) === filter;
      });

      renderCases(filtered);
    }
  });
});