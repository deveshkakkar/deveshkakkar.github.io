const knowledge = [
  {
    topics: ["scale", "scaled", "traffic", "recommendation", "recommendations", "inference", "requests", "volume", "system", "systems", "build"],
    answer: "Devesh works on high-scale search, recommendation, machine-learning, and data systems. His focus is designing services that stay reliable and understandable as traffic, data volume, and system complexity grow.",
    link: "#work",
    linkText: "See the selected impact"
  },
  {
    topics: ["ai", "ml", "machine", "learning", "sagemaker", "model", "models", "test", "testing"],
    answer: "His applied AI work spans customer-facing ML systems and developer productivity. He is especially interested in the engineering required to make AI dependable: evaluation, serving, observability, testing, and responsible rollout.",
    link: "#work",
    linkText: "Review the AI and ML work"
  },
  {
    topics: ["business", "revenue", "profit", "customer", "impact", "outcome", "outcomes", "money"],
    answer: "Devesh evaluates engineering work through customer and business outcomes, not technical delivery alone. His experience includes experimentation, relevance improvements, and customer-facing product development in Amazon Private Brands.",
    link: "#experience",
    linkText: "View the experience timeline"
  },
  {
    topics: ["reliable", "reliability", "availability", "memory", "leak", "operational", "operations", "incident"],
    answer: "Reliability is part of Devesh's design process rather than a follow-up task. He considers failure modes, observability, data safeguards, performance, and operational ownership when taking systems into production.",
    link: "#work",
    linkText: "See reliability outcomes"
  },
  {
    topics: ["lead", "leader", "leadership", "ownership", "architecture", "architect", "cross-team", "ambiguity", "senior"],
    answer: "As an SDE II, Devesh operates across architecture, delivery, and production operations. His portfolio shows end-to-end ownership of ambiguous systems problems, cross-team execution, and decisions evaluated against customer and business outcomes—not only technical completion.",
    link: "#experience",
    linkText: "See role progression"
  },
  {
    topics: ["data", "etl", "spark", "java", "quality", "pipeline", "pipelines", "tb"],
    answer: "Devesh has worked on large-scale data pipelines that support search and recommendation experiences. His interests include clear data contracts, quality controls, efficient processing, and making downstream behavior easier to trust.",
    link: "#work",
    linkText: "See the data-platform work"
  },
  {
    topics: ["startup", "founder", "venture", "marketplace", "mobile", "react", "native", "project", "projects"],
    answer: "Outside Amazon, Devesh co-founded and engineered a mobile jobs marketplace. The project gave him end-to-end experience across product thinking, React Native development, cloud services, and backend performance.",
    link: "#experience",
    linkText: "View the venture"
  },
  {
    topics: ["role", "current", "job", "amazon", "experience", "work", "background"],
    answer: "Devesh is a Software Development Engineer II on Amazon Private Brands Search, a role he has held since May 2025. He previously worked as an SDE I on Private Brands Detail Page from August 2023 to May 2025.",
    link: "#experience",
    linkText: "View the full timeline"
  },
  {
    topics: ["contact", "email", "reach", "linkedin", "hire", "connect"],
    answer: "You can reach Devesh at devesh.kakkar@hotmail.com or connect with him on LinkedIn. His GitHub is also linked at the bottom of this page.",
    link: "mailto:devesh.kakkar@hotmail.com",
    linkText: "Email Devesh"
  },
  {
    topics: ["reading", "read", "book", "books", "angels", "demons", "dan", "brown"],
    answer: "Devesh is currently reading Angels & Demons by Dan Brown.",
    link: "#now",
    linkText: "See what has his attention"
  },
  {
    topics: ["building", "build", "floating", "brain", "dashboard", "personal", "project"],
    answer: "Devesh is currently building Floating Brain, a personal capture system that brings unfinished thoughts back into view through an ambient daily dashboard.",
    link: "#now",
    linkText: "View the current project"
  },
  {
    topics: ["language", "languages", "stack", "technology", "technologies", "java", "python", "typescript", "javascript"],
    answer: "Devesh works mostly with Java, Python, and TypeScript. His broader technical interests include distributed systems, cloud infrastructure, production ML, and practical AI products.",
    link: "#work",
    linkText: "See what he works on"
  },
  {
    topics: ["hobby", "hobbies", "outside", "fun", "personal", "basketball", "workout", "working", "cooking", "interests"],
    answer: "Outside work, Devesh enjoys reading, basketball, working out, and cooking. He also likes building personal tools that connect software with everyday routines.",
    link: "#notes",
    linkText: "Read the current log"
  }
];

const fallback = {
  answer: "I can answer questions about Devesh's engineering scale, AI and ML work, reliability, data platforms, leadership, business impact, role history, or selected venture. Try asking, “What systems has Devesh scaled?”",
  link: "#work",
  linkText: "Browse selected work"
};

const transcript = document.querySelector("#assistantTranscript");
const form = document.querySelector("#assistantForm");
const input = document.querySelector("#assistantInput");

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;"
  })[character]);
}

function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9$+.-]/g, " ")
    .split(/\s+/)
    .filter(token => token.length > 1);
}

function selectAnswer(question) {
  const tokens = tokenize(question);
  let best = null;
  let bestScore = 0;

  knowledge.forEach(entry => {
    const score = entry.topics.reduce((total, topic) => {
      const exact = tokens.includes(topic) ? 3 : 0;
      const partial = tokens.some(token => token.startsWith(topic) || topic.startsWith(token)) ? 1 : 0;
      return total + Math.max(exact, partial);
    }, 0);

    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  });

  return bestScore >= 2 ? best : fallback;
}

function addMessage(type, content) {
  const wrapper = document.createElement("div");
  wrapper.className = `message message-${type}`;
  wrapper.innerHTML = content;
  transcript.appendChild(wrapper);
  transcript.scrollTo({ top: transcript.scrollHeight, behavior: "smooth" });
}

function ask(question) {
  const trimmed = question.trim();
  if (!trimmed) return;

  addMessage("user", `<span class="message-label">You</span><p>${escapeHtml(trimmed)}</p>`);
  input.value = "";
  input.disabled = true;

  window.setTimeout(() => {
    const result = selectAnswer(trimmed);
    const safeLink = result.link.startsWith("#") || result.link.startsWith("mailto:") ? result.link : "#work";
    addMessage("assistant", `<span class="message-label">Assistant</span><p>${escapeHtml(result.answer)}</p><p style="margin-top:9px"><a href="${safeLink}">${escapeHtml(result.linkText)} →</a></p>`);
    input.disabled = false;
    input.focus();
  }, 260);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  ask(input.value);
});

document.querySelectorAll("[data-question]").forEach(button => {
  button.addEventListener("click", () => ask(button.dataset.question));
});

const systemDetails = {
  product: {
    code: "00 / PRODUCT",
    title: "Useful product",
    text: "The center of the map: technology is useful when it produces a clear customer or human outcome."
  },
  search: {
    code: "01 / SEARCH",
    title: "Search & relevance",
    text: "Translate intent and context into discovery experiences that help people reach a useful result faster."
  },
  ml: {
    code: "02 / ML",
    title: "Production ML",
    text: "Connect models to evaluation, serving, observability, and rollout paths so predictions remain dependable."
  },
  systems: {
    code: "03 / SYSTEMS",
    title: "Distributed systems",
    text: "Shape services, data flows, and failure boundaries that stay understandable as scale and complexity grow."
  },
  ai: {
    code: "04 / AI TOOLS",
    title: "AI for workflows",
    text: "Use AI to reduce repetitive work and improve decisions while keeping people in control of the outcome."
  }
};

const systemNodes = document.querySelectorAll("[data-system]");
const systemTitle = document.querySelector("#systemDetailTitle");
const systemText = document.querySelector("#systemDetailText");
const systemCode = document.querySelector("#systemCode");

systemNodes.forEach(node => {
  node.addEventListener("click", () => {
    const selected = node.dataset.system;
    const detail = systemDetails[selected];
    systemNodes.forEach(item => {
      const active = item === node;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll("[data-link]").forEach(link => {
      link.classList.toggle("is-active", link.dataset.link === selected);
    });
    systemCode.textContent = detail.code;
    systemTitle.textContent = detail.title;
    systemText.textContent = detail.text;
    document.dispatchEvent(new CustomEvent("systemchange", { detail: { selected } }));
  });
});

const seattleTime = document.querySelector("#seattleTime");
const seattleDate = document.querySelector("#seattleDate");

function updateSeattleClock() {
  const now = new Date();
  seattleTime.textContent = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit"
  }).format(now);
  seattleDate.textContent = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(now) + " · Seattle";
}

updateSeattleClock();
window.setInterval(updateSeattleClock, 30000);

const motionToggle = document.querySelector("#motionToggle");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  motionToggle.setAttribute("aria-pressed", "false");
  motionToggle.querySelector("strong").textContent = "Reduced";
  motionToggle.disabled = true;
  document.documentElement.classList.add("motion-paused");
} else {
  motionToggle.addEventListener("click", () => {
    const enabled = motionToggle.getAttribute("aria-pressed") !== "true";
    motionToggle.setAttribute("aria-pressed", String(enabled));
    motionToggle.querySelector("strong").textContent = enabled ? "On" : "Off";
    document.documentElement.classList.toggle("motion-paused", !enabled);
  });
}

document.querySelector("#year").textContent = new Date().getFullYear();
