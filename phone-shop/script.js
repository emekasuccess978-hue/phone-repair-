 /* ===== Settings ===== */
// Used ONLY if the backend can't be reached. Country code + number, digits only.
// Example (Nigeria): 08012345678 -> 2348012345678
const FALLBACK_WHATSAPP = "2349049465038";
const SHOP_NAME = "Phone Repair Service";
const SLIDE_INTERVAL_MS = 5000;

/* ===== Slider ===== */
(function initSlider() {
  const slider = document.getElementById("slider");
  const slides = Array.from(slider.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("dots");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => { show(i); restart(); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      s.classList.toggle("active", n === index);
      s.setAttribute("aria-hidden", n === index ? "false" : "true");
    });
    dots.forEach((d, n) => {
      d.classList.toggle("active", n === index);
      d.setAttribute("aria-selected", n === index ? "true" : "false");
    });
  }

  function start() {
    if (reduceMotion) return;
    timer = setInterval(() => show(index + 1), SLIDE_INTERVAL_MS);
  }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  document.getElementById("prevBtn").addEventListener("click", () => { show(index - 1); restart(); });
  document.getElementById("nextBtn").addEventListener("click", () => { show(index + 1); restart(); });

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", start);
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { show(index - 1); restart(); }
    if (e.key === "ArrowRight") { show(index + 1); restart(); }
  });

  show(0);
  start();
})();

/* ===== Form ===== */
(function initForm() {
  const form = document.getElementById("repairForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  const rules = {
    brand: (v) => (v ? "" : "Enter your phone brand."),
    model: (v) => (v ? "" : "Enter your phone model."),
    problem: (v) => (v ? "" : "Choose a problem."),
    started: (v) => (v ? "" : "Choose when it started."),
    description: (v) => (v.length >= 5 ? "" : "Describe the problem in a few words."),
  };

  function setError(name, message) {
    const field = form.elements[name].closest(".field");
    const errorEl = document.getElementById(`${name}-error`);
    field.classList.toggle("invalid", Boolean(message));
    errorEl.textContent = message;
  }

  function validate() {
    let firstBad = null;
    for (const name of Object.keys(rules)) {
      const message = rules[name](form.elements[name].value.trim());
      setError(name, message);
      if (message && !firstBad) firstBad = form.elements[name];
    }
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // Clear an error as soon as the user fixes the field
  Object.keys(rules).forEach((name) => {
    form.elements[name].addEventListener("input", () => {
      if (!rules[name](form.elements[name].value.trim())) setError(name, "");
    });
  });

  function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = "form-status" + (type ? ` ${type}-text` : "");
  }

  function localWhatsappUrl(d) {
    const lines = [
      `*New repair request - ${SHOP_NAME}*`,
      "",
      d.name ? `*Name:* ${d.name}` : null,
      `*Phone:* ${d.brand}`,
      `*Model:* ${d.model}`,
      `*Problem:* ${d.problem}`,
      `*Started:* ${d.started}`,
      `*Details:* ${d.description}`,
    ].filter((l) => l !== null);
    return `https://wa.me/${FALLBACK_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    Object.keys(data).forEach((k) => (data[k] = String(data[k]).trim()));

    submitBtn.disabled = true;
    setStatus("Sending your request...");

    let url;
    try {
      const res = await fetch("/api/repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.status === 400 && result.errors) {
        Object.entries(result.errors).forEach(([name, msg]) => form.elements[name] && setError(name, msg));
        setStatus("Please fix the highlighted fields.", "error");
        submitBtn.disabled = false;
        return;
      }
      if (res.status === 429) {
        setStatus(result.error || "Too many requests. Try again later.", "error");
        submitBtn.disabled = false;
        return;
      }
      if (!res.ok || !result.whatsappUrl) throw new Error(result.error || "Server error");
      url = result.whatsappUrl;
    } catch (err) {
      // Backend unreachable: still send the customer to WhatsApp
      url = localWhatsappUrl(data);
    }

    setStatus("Request saved. Opening WhatsApp...", "ok");
    form.reset();
    // Same-tab redirect avoids popup blockers on phones
    window.location.href = url;
    setTimeout(() => { submitBtn.disabled = false; }, 2500);
  });
})();
