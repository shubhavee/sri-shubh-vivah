(() => {
  const W = window.WEDDING;
  const SCRIPT_URL = document.currentScript.src; // asset paths resolve relative to this script
  // Which of the four invitations this page is (set on <html> by tools/build-variants.sh).
  const HOST = document.documentElement.dataset.side === "bride" ? "bride" : "groom";
  const INVITE = document.documentElement.dataset.invite === "day" ? "day" : "full";
  const host = W.hosts[HOST], invite = W.invites[INVITE];
  W.displayDate = invite.displayDate;
  W.invocation = host.invocation;
  // Keep events meant for this family and this invitation; drop days left empty.
  const showEvent = (e) => (!e.side || e.side === HOST) && (INVITE === "full" || e.day);
  const days = W.days.map((d) => ({ ...d, events: d.events.filter(showEvent) })).filter((d) => d.events.length);
  const rsvpDays = days.filter((d) => d.rsvp);
  const $ = (s, el = document) => el.querySelector(s);
  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), W);
  const digits = (s) => String(s || "").replace(/\D/g, "");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const waLink = (number, text) => `https://wa.me/${digits(number)}?text=${encodeURIComponent(text)}`;

  /* ---------- Fill in text from config ---------- */
  document.querySelectorAll("[data-bind]").forEach((el) => { el.textContent = get(el.dataset.bind) ?? ""; });
  document.title = `${W.bride.name} & ${W.groom.name} · Wedding Invitation`;
  // "Daughter of / Mrs. … / & / Mr. …", one name per line.
  document.querySelectorAll("[data-parents]").forEach((el) => {
    const p = W[el.dataset.parents];
    const names = HOST === "bride" ? p.parentsOnBrideSide : p.parents;
    el.innerHTML = `<span class="rel">${esc(p.relation)}</span>` + names.map((n) => `<span>${esc(n)}</span>`).join('<span class="amp">&amp;</span>');
  });
  $("#mapFrame").src = W.venue.mapsEmbed;
  $("#mapsLink").href = W.venue.mapsLink;

  $("#eventList").innerHTML = days.map((day) => `
    <article class="day">
      <header class="day-head">
        <p class="day-label">${esc(INVITE === "day" && day.dayOnlyLabel ? day.dayOnlyLabel : day.label)}</p>
        <h3>${esc(day.date)}</h3>
      </header>
      <ol class="timeline">
        ${day.events.map((e) => `
        <li>
          <div class="t-when"><span class="t-time">${esc(e.time)}</span></div>
          <div class="t-what">
            ${e.hindi ? `<p class="hindi">${esc(e.hindi)}</p>` : ""}
            <h4>${esc(e.name)}</h4>
            ${e.dress ? `<p class="dress"><span>Dress code</span> ${esc(e.dress)}</p>` : ""}
          </div>
        </li>`).join("")}
      </ol>
    </article>`).join("");

  // Only ask "which days" when there's more than one day to choose from.
  $("#eventChecks").innerHTML = rsvpDays.map((day) =>
    `<label title="${esc(day.events.map((e) => e.name).join(", "))}"><input type="checkbox" name="days" value="${esc(day.key)}" checked /> ${esc(day.short)}</label>`).join("");
  $("#daysField").hidden = rsvpDays.length < 2;
  const sideNumber = (side) => (digits(side.whatsapp).length >= 10 ? side.whatsapp : W.rsvp.fallbackNumber);

  $("#contactList").innerHTML = W.contacts.filter((g) => !g.host || g.host === HOST).map((g) => `
    <div class="contact-group">
      <p class="role">${esc(g.side)}</p>
      ${g.people.map((c) => `
      <div class="contact">
        <h3>${esc(c.name)}</h3>
        <p class="relation">${esc(c.relation)}</p>
        <p class="contact-links">
          <a href="tel:+${esc(digits(c.phone))}">📞 ${esc(c.phone)}</a>
          ${digits(c.phone).length >= 10 ? `<a href="https://wa.me/${esc(digits(c.phone))}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
        </p>
      </div>`).join("")}
    </div>`).join("");

  /* ---------- Hero mandala (fine gold line-art, built from repeated petals) ---------- */
  (() => {
    const ring = (n, make) => Array.from({ length: n }, (_, i) => `<g transform="rotate(${(i * 360) / n})">${make(i)}</g>`).join("");
    const art = `<g fill="none" stroke="currentColor" stroke-width=".5">
      <circle r="98" /><circle r="93" stroke-dasharray="1 3" /><circle r="62" /><circle r="41" /><circle r="17" />
      ${ring(36, () => '<path d="M0 -91 C6 -82 6 -72 0 -64 C-6 -72 -6 -82 0 -91 Z" />')}
      ${ring(18, () => '<path d="M0 -60 C11 -54 11 -46 0 -42 C-11 -46 -11 -54 0 -60 Z" /><path d="M0 -58 V-44" />')}
      ${ring(12, () => '<path d="M0 -39 C9 -31 9 -23 0 -19 C-9 -23 -9 -31 0 -39 Z" />')}
      ${ring(8, () => '<path d="M0 -16 C5 -11 5 -6 0 -3 C-5 -6 -5 -11 0 -16 Z" />')}
    </g><g fill="currentColor">${ring(72, () => '<circle cy="-95.5" r=".8" />')}${ring(18, () => '<circle cy="-66" r="1.3" />')}</g>`;
    document.querySelectorAll(".mandala").forEach((svg) => { svg.innerHTML = art; });
  })();

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll(".day, .family-card").forEach((el) => io.observe(el));

  /* ---------- Countdown ---------- */
  const target = new Date(invite.countdownTo).getTime();
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const ms = Math.max(0, target - Date.now());
    $("#cd-d").textContent = Math.floor(ms / 864e5);
    $("#cd-h").textContent = pad(Math.floor(ms / 36e5) % 24);
    $("#cd-m").textContent = pad(Math.floor(ms / 6e4) % 60);
    $("#cd-s").textContent = pad(Math.floor(ms / 1e3) % 60);
  };
  tick(); setInterval(tick, 1000);

  /* ---------- Petals ---------- */
  const petals = $("#petals");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function dropPetal() {
    const p = document.createElement("span");
    p.className = "petal" + (Math.random() < 0.3 ? " rose" : "");
    p.style.left = Math.random() * 100 + "vw";
    p.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
    p.style.setProperty("--spin", (Math.random() * 720 - 360) + "deg");
    p.style.animationDuration = 6 + Math.random() * 6 + "s";
    petals.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
  function burst(n) { for (let i = 0; i < n; i++) setTimeout(dropPetal, i * 60); }

  /* ---------- Music (starts on "Open Invitation" tap; browsers block autoplay) ---------- */
  const audio = $("#bgm"), musicBtn = $("#musicBtn");
  const start = W.musicStart || 0;
  const setPlaying = (on) => musicBtn.classList.toggle("playing", on);
  // Music is on whenever the page loads; the button only pauses it for this visit.
  let musicOn = true;
  function setMusicOn(on) {
    musicOn = on;
    musicBtn.setAttribute("aria-pressed", on);
    $(".music-label", musicBtn).textContent = on ? "Music On" : "Music Off";
    on ? player.play() : player.pause();
  }
  const ytId = (W.musicYouTube || "").match(/(?:v=|youtu\.be\/|embed\/|shorts\/)?([\w-]{11})(?:[?&#]|$)/)?.[1];
  let yt = null, useYt = false, opened = false;
  const player = {
    play: () => (useYt ? yt?.playVideo?.() : audio.play().catch(() => {})),
    pause: () => (useYt ? yt?.pauseVideo?.() : audio.pause()),
    paused: () => (useYt ? yt?.getPlayerState?.() !== 1 : audio.paused),
  };
  audio.preload = "metadata"; // so a missing file errors early and we can fall back
  audio.src = new URL(W.music, SCRIPT_URL).href;
  audio.addEventListener("play", () => setPlaying(true));
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("loadedmetadata", () => { if (audio.currentTime < start) audio.currentTime = start; });
  audio.addEventListener("ended", () => { audio.currentTime = start; audio.play().catch(() => {}); });
  audio.addEventListener("error", () => {
    if (!ytId) return (musicBtn.hidden = true);
    useYt = true; loadYouTube();
  });
  audio.load();
  musicBtn.addEventListener("click", () => setMusicOn(!musicOn));
  // If the browser blocked playback (e.g. the player wasn't ready yet), start on the next tap anywhere.
  const resume = (e) => { if (opened && musicOn && player.paused() && !musicBtn.contains(e.target)) player.play(); };
  document.addEventListener("pointerdown", resume, true);
  document.addEventListener("keydown", resume, true);

  // YouTube fallback: the player is kept invisible so only the audio comes through.
  function loadYouTube() {
    const box = document.createElement("div");
    box.id = "ytBox"; box.className = "yt-box";
    box.innerHTML = '<div id="ytPlayer"></div>';
    document.body.append(box);
    window.onYouTubeIframeAPIReady = () => {
      yt = new YT.Player("ytPlayer", {
        width: 120, height: 68, videoId: ytId,
        playerVars: { start, controls: 0, playsinline: 1, modestbranding: 1 },
        events: {
          onReady: () => { yt.setVolume(60); if (opened && musicOn) yt.playVideo(); },
          onStateChange: (e) => {
            setPlaying(e.data === 1);
            // Loop ourselves so every repeat also starts at musicStart.
            if (e.data === 0) { yt.seekTo(start, true); yt.playVideo(); }
          },
        },
      });
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.append(s);
  }

  /* ---------- Intro ---------- */
  // Always start from the top: stop the browser restoring the old scroll position on reload.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  toTop();
  window.addEventListener("pageshow", toTop); // also when coming back via the Back button
  // In-page links scroll without adding #section to the address, so a reload still starts at the top.
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
  }));
  document.body.classList.add("locked");
  $("#openInvite").addEventListener("click", () => {
    toTop();
    $("#intro").classList.add("gone");
    document.body.classList.remove("locked");
    opened = true;
    musicBtn.hidden = false;
    audio.volume = 0.6;
    setMusicOn(musicOn);
    if (!reduced) { burst(40); setInterval(dropPetal, 900); }
  });

  /* ---------- Sending to Google Sheet ---------- */
  async function sendToSheet(payload) {
    // text/plain keeps it a "simple" request so Apps Script accepts it without CORS preflight.
    await fetch(W.rsvp.sheetEndpoint, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  }
  const formData = (form) => {
    const fd = new FormData(form), out = {};
    for (const [k, v] of fd) out[k] = out[k] ? `${out[k]}, ${v}` : v;
    return out;
  };

  /* ---------- RSVP (saved straight to the Google Sheet) ---------- */
  const rsvpForm = $("#rsvpForm");

  // "Chat with Srishti" (bride's side) or "Chat with Shubham" (groom's side) for guests with questions.
  const chatButtons = (cls) => W.rsvp.sides.filter((side) => side.host === HOST).map((side) =>
    linkBtn(`Chat with ${side.name} on WhatsApp`, waLink(sideNumber(side), `Hi ${side.name}! I have a question about the wedding:`), cls));
  $("#coupleChat").append(...chatButtons("btn-wa"));

  // Number of guests and a name for each extra guest.
  $("#guestCount").innerHTML = Array.from({ length: W.rsvp.maxGuests }, (_, i) => `<option>${i + 1}</option>`).join("");
  function renderPeople() {
    const keep = (name) => rsvpForm.elements[name]?.value || "";
    const n = Number($("#guestCount").value) || 1;
    $("#guestNames").innerHTML = Array.from({ length: n - 1 }, (_, i) =>
      `<label>Guest ${i + 2}'s name<input name="guest${i + 2}" value="${esc(keep(`guest${i + 2}`))}" placeholder="Full name" /></label>`).join("");
  }
  renderPeople();
  $("#guestCount").addEventListener("change", renderPeople);

  // Arrival / departure: tap-to-pick date and mode (data-pills="fieldName:listInConfig").
  document.querySelectorAll("[data-pills]").forEach((box) => {
    const [name, list] = box.dataset.pills.split(":");
    box.innerHTML = W.rsvp.travel[list].map((o) =>
      `<label><input type="radio" name="${name}" value="${esc(o.key)}" /><span>${esc(o.label)}</span></label>`).join("");
  });
  // "14:30" → "2:30 PM"
  const time12 = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  };

  rsvpForm.addEventListener("change", (e) => {
    if (e.target.name === "attending") rsvpForm.classList.toggle("attending-yes", e.target.value === "Yes");
  });

  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $("#rsvpStatus");
    const d = formData(rsvpForm);
    if (!d.attending) return (status.textContent = "Please choose Yes or No.");
    if (!d.name?.trim()) return (status.textContent = "Please enter your name.");
    d.phone = digits(d.phone).slice(-10);
    if (d.phone.length !== 10) return (status.textContent = "Please enter your 10-digit WhatsApp number.");
    // Days attending, so the Sheet can show Yes/No per day. Single-day invitations attend that day.
    const picked = rsvpDays.length < 2 ? rsvpDays.map((day) => day.key)
      : [...rsvpForm.querySelectorAll('input[name="days"]:checked')].map((c) => c.value);
    d.days = d.attending === "Yes" ? picked : [];
    d.invite = invite.label;
    d.side = host.label;
    d.name = d.name.trim();
    d.arrivalTime = time12(d.arrivalTime);
    d.departureTime = time12(d.departureTime);
    if (d.attending === "No") for (const k of Object.keys(d)) if (!["attending", "name", "phone", "message", "days", "invite", "side"].includes(k)) delete d[k];

    const btn = $("#rsvpSubmit");
    btn.disabled = true; status.textContent = "Sending…";
    try {
      await sendToSheet({ type: "rsvp", ...d });
    } catch {
      btn.disabled = false;
      return (status.textContent = "Couldn't send. Please check your internet connection and try again.");
    }
    showDone(d);
  });

  function showDone(d) {
    rsvpForm.hidden = true;
    const done = $("#rsvpDone"); done.hidden = false;
    const first = esc(d.name.split(" ")[0]);
    $("#doneActions").replaceChildren(...chatButtons("btn-outline"));

    if (d.attending === "No") {
      $("#doneTitle").textContent = "We'll miss you 🙏";
      $("#doneText").innerHTML = `Thank you for letting us know, ${first}. Your blessings mean the world to us.`;
    } else {
      $("#doneTitle").textContent = "Yay! See you in Bengaluru 🎉";
      $("#doneText").innerHTML = `Thank you, ${first}! We've received your RSVP. ${INVITE === "full" ? "Our wedding planner will get in touch closer to the date about your travel and stay." : "We can't wait to celebrate with you."}`;
      if (!reduced) burst(60);
    }
    $("#doneText").insertAdjacentHTML("beforeend", "<br><br>Need to change your answer? Just submit the form again with the same number.");
    done.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function linkBtn(label, href, cls, newTab = true) {
    const a = document.createElement("a");
    a.className = `btn ${cls}`; a.textContent = label; a.href = href;
    if (newTab) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }


})();
