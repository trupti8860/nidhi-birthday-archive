const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const welcome = $("#welcome");
const desktop = $("#desktop");
const layer = $("#windowLayer");
const toast = $("#toast");
let secretsFound = new Set();
let activeWindows = [];
let complimentIndex = -1;
let predictionIndex = -1;

const compliments = [
  "You can turn a blank page into something beautiful. Please remember that includes the pages of your own life.",
  "Your brain, your creativity and that slightly dramatic personality? A very rare combination.",
  "You are proof that someone can be pretty, clever, talented and still be an absolute menace. Respectfully.",
  "The world needs more people who make things, feel things and care in their own quiet ways. Keep being you.",
  "Future doctor energy, artist hands, main-character levels of drama. The range is honestly impressive.",
  "You don't have to be at your best every day to be someone worth celebrating.",
  "You have a way of making a friendship feel familiar even after a long pause. That's a special kind of magic.",
  "I hope you see yourself with even a little of the fondness people who love you see you with.",
  "Your existence is a very good plot twist in my life. No edits requested.",
  "Nidhiiiii, you are not replaceable. There is no second edition."
];

const predictions = [
  "Your art will find new places to go, and your confidence will catch up with your talent.",
  "One day, someone will call you doctor and you will have to pretend to be normal about it.",
  "A new chapter will ask you to be brave. You will be more ready than you think.",
  "There will be a day when you look back and realise how far the girl with all those plans has come.",
  "You will make something with your own hands that reminds you how capable you are.",
  "A random conversation will become a core memory. Your life does enjoy its plot twists.",
  "You will collect new people, new places and stories you haven't even imagined yet.",
  "You will keep being dramatic, talented and loved. Some things are simply constants."
];

const windowTemplates = {
  cake: {
    title:"BIRTHDAY_CAKE.exe", icon:"🎂",
    body: `
      <span class="window-eyebrow">SPECIAL EVENT • 30 NOVEMBER 2026</span>
      <h3>A tiny cake for<br><em>your big nineteen.</em></h3>
      <p>Make a wish, birthday girl. The archive is legally required to provide one tiny cake and an unreasonable amount of cheering.</p>
      <div class="cake-scene">
        <div class="cake-candles" id="cakeCandles"><span>♨</span><span>♨</span><span>♨</span></div>
        <div class="cake-top"></div><div class="cake-middle"></div><div class="cake-base"></div>
        <div class="cake-plate"></div>
      </div>
      <div class="paper-panel"><p id="cakeWish" class="handwritten">Three candles. One birthday girl. Infinite possibilities.</p></div>
      <button class="action-button" id="blowCandles">BLOW OUT THE CANDLES ✨</button>`
  },
  badday: {
    title:"BAD_DAY_BASKET.txt", icon:"☁",
    body: `
      <span class="window-eyebrow">EMERGENCY COMFORT KIT • NO QUESTIONS ASKED</span>
      <h3>For the days that<br><em>feel a little too much.</em></h3>
      <p>This file is not here to fix everything. It's just a soft place to land for a minute.</p>
      <div class="paper-panel">
        <p class="handwritten">First: unclench your jaw. Drop your shoulders. Take one slow breath. You do not have to solve your entire life today.</p>
        <p class="handwritten">Second: drink some water, eat something if you haven't, and give yourself permission to pause. Rest is not a reward you have to earn.</p>
        <p class="handwritten">Third: remember that one difficult day is not a verdict on your future. You have made it through days you once thought would stay heavy forever.</p>
      </div>
      <div class="comfort-card" id="comfortNote">You are allowed to begin again tomorrow. Or after a nap. The archive supports both.</div>
      <button class="action-button" id="comfortButton">GIVE ME ANOTHER REMINDER ♡</button>`
  },

  readme: {
    title:"READ_ME_FIRST.txt", icon:"▤",
    body: `
      <span class="window-eyebrow">A NOTE FROM THE ARCHIVIST</span>
      <h3>A tiny instruction<br><em>manual.</em></h3>
      <p>Hello, birthday girl.</p>
      <div class="paper-panel">
        <p class="handwritten">This archive was made for the girl who can turn a simple story into a full three-season drama, make something beautiful out of a blank page, and somehow remain one of my favourite people through every version of life.</p>
        <p class="handwritten">Inside: a very unofficial biography, some friendship evidence, a few memories that refused to leave my head, predictions for your doctor-era future and one letter I couldn't fit into an ordinary message.</p>
        <p class="handwritten">Explore in any order. Click suspicious things. Be nosy. This is the one place where opening every file is encouraged.</p>
      </div>
      <span class="sticker-chip">MADE FOR NIDHI</span><span class="sticker-chip">19 & UNREAL</span>
      <p><b>Archivist's advice:</b> The mascot knows things. The desktop stickers are not just decoration. And save the final file for when you're ready.</p>
      <button class="action-button" data-action="close">GOT IT, DETECTIVE ↗</button>`
  },
  dossier: {
    title:"BIRTHDAY_DOSSIER.pdf", icon:"✿",
    body: `
      <span class="window-eyebrow">CLASSIFIED PERSONNEL RECORD • 001</span>
      <h3>Subject profile:<br><em>Nidhi.</em></h3>
      <p>A highly unofficial report compiled after years of observation, tuition-era evidence and a frankly excessive number of conversations.</p>
      <div class="dossier-grid">
        <div class="dossier-field"><span>Subject name</span><strong>Nidhi (Nidhiiiii)</strong></div>
        <div class="dossier-field"><span>Current edition</span><strong>19.0 · 30 Nov 2026</strong></div>
        <div class="dossier-field"><span>Known abilities</span><strong>Sketching, dancing, creating</strong></div>
        <div class="dossier-field"><span>Secondary skill</span><strong>Turning life into a drama</strong></div>
        <div class="dossier-field"><span>Academic status</span><strong>Bright mind, big plans</strong></div>
        <div class="dossier-field"><span>Future designation</span><strong>Doctor in the making ♡</strong></div>
      </div>
      <div class="paper-panel"><span class="small-label">Official evaluation</span><p class="handwritten">Subject displays a curious combination of artistic hands, a sharp mind, confidence, sarcasm and a heart that sometimes says more through actions than words. Can be difficult to decode. Still very easy to care about.</p></div>
      <span class="sticker-chip">ONE OF ONE</span><span class="sticker-chip">PERMANENTLY IMPORTANT</span>
      <p class="small-label">Final verdict: no improvements required. Just keep giving yourself the same belief you give your dreams.</p>`
  },
  evidence: {
    title:"EVIDENCE_LOCKER", icon:"✦",
    body: `
      <span class="window-eyebrow">EXHIBITS • OPEN TO INSPECTION</span>
      <h3>Evidence that you're<br><em>one of a kind.</em></h3>
      <p>Four pieces of evidence. Years of friendship. Absolutely no chance of an acquittal.</p>
      <div class="evidence-board">
        <button class="evidence-note" style="--tilt:-2deg" data-evidence="0"><i class="pin"></i><strong>EXHIBIT A</strong><span>The girl from tuition days.</span></button>
        <button class="evidence-note" style="--tilt:2deg" data-evidence="1"><i class="pin"></i><strong>EXHIBIT B</strong><span>The apology marathon.</span></button>
        <button class="evidence-note" style="--tilt:1deg" data-evidence="2"><i class="pin"></i><strong>EXHIBIT C</strong><span>Showing up when it mattered.</span></button>
        <button class="evidence-note" style="--tilt:-2deg" data-evidence="3"><i class="pin"></i><strong>EXHIBIT D</strong><span>The home-like kind of friendship.</span></button>
      </div>
      <div id="evidenceReveal" class="paper-panel"><p class="handwritten">Choose an exhibit. The evidence speaks for itself.</p></div>
      <p class="small-label">Case status: permanently fond. No appeal will be considered.</p>`
  },
  compliments: {
    title:"COMPLIMENTS.exe", icon:"♡",
    body: `
      <span class="window-eyebrow">APPLICATION RUNNING • MOOD SUPPORT UTILITY</span>
      <h3>Compliment<br><em>dispensing machine.</em></h3>
      <p>Feeling underappreciated? This application has been designed to correct that immediately.</p>
      <div class="compliment-box"><div id="complimentText" class="compliment-text">Press the button. Your daily reminder is waiting.</div></div>
      <button class="action-button" id="generateCompliment">GENERATE COMPLIMENT ✧</button>
      <span class="sticker-chip">UNLIMITED SUPPLY</span>
      <p class="small-label">Side effects may include smiling at your screen.</p>`
  },
  memories: {
    title:"MEMORY_LOGS", icon:"⌁",
    body: `
      <span class="window-eyebrow">PERSONAL ARCHIVE • FRAGMENTS WORTH KEEPING</span>
      <h3>Little moments,<br><em>big feelings.</em></h3>
      <p>Some friendships have a highlight reel. Ours has a whole archive of tiny things that somehow became important.</p>
      <div class="memory-list">
        <article class="memory-entry"><small>LOG 001 • THE TUITION ORIGIN STORY</small><h4>From pens and notes to life updates</h4><p>We started with the very serious business of sharing pens and notes. Who knew that the girl from tuition would become someone I would share so many versions of life with? The stationery was just the beginning.</p></article>
        <article class="memory-entry"><small>LOG 002 • THE APOLOGY MARATHON</small><h4>Approximately one hundred sorrys</h4><p>I may not remember the exact count or every detail, but I remember you writing “sorry” again and again — around a hundred times, if my memory is being dramatic. It wasn't the number. It was the effort to make things okay. I kept that.</p></article>
        <article class="memory-entry"><small>LOG 003 • THE GOSSIP DEPARTMENT</small><h4>Other people's love stories, obviously</h4><p>Our commentary on other people's love lives deserves its own research paper. The analysis, the updates, the theories — an entire department, and somehow never enough time.</p></article>
        <article class="memory-entry"><small>LOG 004 • THE SHOWING-UP FILE</small><h4>When life stopped being funny for a bit</h4><p>We've both had days when things felt heavy. I remember being able to sit with you through yours, and how you were there when my own heart needed a little help. We didn't need perfect words every time. We just needed each other to stay.</p></article>
        <article class="memory-entry"><small>LOG 005 • THE HOME FREQUENCY</small><h4>Even after the pause</h4><p>There have been stretches when life got busy and we didn't meet or talk the way we wanted to. But then we meet again, and the familiarity comes back so naturally. Like no awkward restart was needed. Some connections know their way back.</p></article>
      </div>`
  },
  future: {
    title:"FUTURE_PREDICTIONS.app", icon:"✧",
    body: `
      <span class="window-eyebrow">PREDICTION ENGINE • ABSOLUTELY NOT SCIENTIFIC</span>
      <h3>Your future, according<br><em>to this little crystal ball.</em></h3>
      <p>Predictions generated by a source with zero qualifications and unlimited confidence in you.</p>
      <div class="prediction-card"><div class="crystal">✧</div><div id="predictionText" class="prediction-text">Your next little plot twist is waiting...</div></div>
      <button class="action-button" id="generatePrediction">REVEAL MY FUTURE ✦</button>
      <p class="small-label">Disclaimer: the future is yours to make. This is just a little encouragement.</p>`
  },
  secret: {
    title:"SECRET_STASH.lock", icon:"🔒",
    body: `
      <span class="window-eyebrow">RESTRICTED AREA • CURIOUS PEOPLE ONLY</span>
      <h3>Okay, so you found<br><em>the secret stash.</em></h3>
      <p>There are tiny hidden notes tucked away in this archive. Find them all to earn a very official title.</p>
      <div class="secret-grid">
        <button class="secret-item" data-secret="0"><span>🎀</span><small>THE BOW FILE</small></button>
        <button class="secret-item" data-secret="1"><span>🍒</span><small>THE CHERRY FILE</small></button>
        <button class="secret-item" data-secret="2"><span>⭐</span><small>THE STAR FILE</small></button>
        <button class="secret-item" data-secret="3"><span>🧸</span><small>THE TEDDY FILE</small></button>
        <button class="secret-item" data-secret="4"><span>💌</span><small>THE LOVE NOTE</small></button>
        <div class="secret-item"><span>?</span><small>MORE OUT THERE...</small></div>
      </div>
      <div id="secretReveal" class="paper-panel"><p class="handwritten">Find the little secrets around the desktop. Some are hiding in plain sight.</p></div>
      <div class="secret-found">✧ <span id="secretProgress">0</span>/5 secrets discovered</div>`
  },
  final: {
    title:"THE_FINAL_FILE.letter", icon:"✉",
    body: `
      <span class="window-eyebrow">FINAL DOCUMENT • PLEASE READ SLOWLY</span>
      <h3>One last thing,<br><em>birthday girl.</em></h3>
      <p>You've made it to the file that isn't really a file. It's just me trying to put a few feelings somewhere they can stay.</p>
      <button class="action-button" id="openLetter">OPEN THE LETTER ♡</button>
      <div id="letterReveal" class="letter-paper hidden">
        <p>Dear Nidhiiiii,</p>
        <p>Happy 19th birthday, drama department. ♡</p>
        <p>It's a little funny to think that we began with something as ordinary as tuition, pens and notes. Back then, we obviously didn't know that we'd collect this many years, stories, conversations and versions of ourselves together. Somewhere between those small beginnings and all the life that happened afterwards, you became one of my people.</p>
        <p>And you are such a character, honestly. You have your own kind of drama, your sarcasm, your expressions, your way of making a simple situation feel like a whole episode. You're also the girl who can sketch something beautiful, dance, create, study hard and still somehow have enough energy to be confusing. I hope you never underestimate how much talent and possibility you carry.</p>
        <p>We've had different phases. Times when we were all caught up in our own lives, times when we didn't get to meet or talk much, and days when things weren't as easy as we wanted them to be. But one thing I keep coming back to is how, whenever we find our way into the same room again, it doesn't feel like starting from zero. We pick up the thread. The comfort is still there. And that means more to me than I can explain neatly.</p>
        <p>I also hope you know that you don't have to be the cheerful, sorted, talented, confident version of yourself all the time. You can have messy days. You can be unsure. You can take your time. I hope this year gives you people who understand you without making you explain every little thing, and moments that make you feel proud of the person you're becoming.</p>
        <p>And about that future-doctor plan: I genuinely hope you get there. I hope you keep drawing, dancing, learning, dreaming and making space for all the parts of you that make you Nidhi. I hope you get the opportunities you've worked for, the courage for the ones that scare you, and the kind of happiness that feels peaceful instead of temporary.</p>
        <p>Thank you for the gossip department, the random conversations, the support, the laughter, the sorry-marathon evidence and all the ordinary things that have quietly become memories. Thank you for being a friend I can go a while without seeing and still feel close to when we meet again.</p>
        <p>Nineteen is a new chapter. I hope it's full of beautiful surprises, good people, big wins, soft days, ridiculous laughter and stories we'll get to talk about later. And please, for the love of everything, continue being a little dramatic. It would be strange if you suddenly became normal.</p>
        <p>Happy birthday, Nidhi. I'm really glad our paths crossed all those tuition days ago. Here's to you, exactly as you are, and to all the versions of you still waiting to happen. ♡</p>
        <p class="signature">With so much love,<br>Your forever archivist ✿</p>
      </div>
      <p class="small-label">A document that cannot be unsent, unsaid or un-loved.</p>`
  }
};

function openWindow(key) {
  const data = windowTemplates[key];
  if (!data) return;
  const existing = $(`[data-window-id="${key}"]`, layer);
  if (existing) { existing.style.zIndex = 20 + activeWindows.length; return; }
  const win = document.createElement("section");
  win.className = "archive-window";
  win.dataset.windowId = key;
  win.style.zIndex = 20 + activeWindows.length;
  win.innerHTML = `
    <div class="window-bar">
      <div class="window-title"><span class="window-title-icon">${data.icon}</span>${data.title}</div>
      <div class="window-controls"><button aria-label="Minimise" data-action="minimise">−</button><button aria-label="Close" data-action="close">×</button></div>
    </div>
    <div class="window-content">${data.body}</div>`;
  layer.appendChild(win);
  activeWindows.push(key);
  win.addEventListener("mousedown", () => { win.style.zIndex = 30 + activeWindows.length++; });
  if (key === "secret") updateSecretCount();
  if (key === "compliments") $("#complimentText", win).textContent = "Press the button. Your daily reminder is waiting.";
  showToast(`${data.title} opened ✧`);
}
function closeWindow(win) {
  const key = win.dataset.windowId;
  win.style.animation = "none";
  win.style.opacity = "0";
  win.style.transform = "translate(-50%,-48%) scale(.95)";
  setTimeout(() => win.remove(), 130);
  activeWindows = activeWindows.filter(k => k !== key);
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
}
function updateSecretCount() {
  $("#secretCount").textContent = secretsFound.size;
  const progress = $("#secretProgress");
  if (progress) progress.textContent = secretsFound.size;
}
function findSecret(id) {
  const messages = [
    "A reminder for the artist: keep making things, even when you don't know where they'll lead. Your creativity deserves room. 🎀",
    "A certified fact: your life is already dramatic enough. Please accept a little extra joy as compensation. 🍒",
    "For every day you doubt yourself: someone who knows you sees your talent, your effort and your potential. ⭐",
    "You don't have to carry every hard day gracefully. Rest, ask for help and be kind to yourself. 🧸",
    "I am glad that the girl I met over tuition notes is still part of my life. Different chapters, same soft spot. 💌"
  ];
  if (secretsFound.has(id)) {
    showToast("You've already discovered this one, little detective.");
  } else {
    secretsFound.add(id);
    const reveal = $("#secretReveal");
    if (reveal) reveal.innerHTML = `<p class="handwritten">${messages[id]}</p><span class="secret-found">✧ SECRET UNLOCKED</span>`;
    const btn = $(`[data-secret="${id}"]`);
    if (btn) btn.style.background = "#e9f1e6";
    updateSecretCount();
    showToast("Secret discovered! +1 nosiness point ♡");
    if (secretsFound.size === 5) {
      showToast("ACHIEVEMENT UNLOCKED: PROFESSIONAL NOSY PERSON 🏆");
      confetti();
    }
  }
}
function confetti() {
  const layer = $("#confettiLayer");
  const bits = ["✦","♡","✿","✧","🎀"];
  for (let i=0;i<32;i++) {
    const bit = document.createElement("span");
    bit.className = "confetti";
    bit.textContent = bits[Math.floor(Math.random()*bits.length)];
    bit.style.left = Math.random()*100 + "%";
    bit.style.animationDelay = Math.random()*.7 + "s";
    bit.style.color = ["#c58c96","#b8a9d3","#d6b75e","#91ad91"][i%4];
    layer.appendChild(bit);
    setTimeout(()=>bit.remove(),3400);
  }
}

$("#enterArchive").addEventListener("click", () => {
  welcome.classList.add("hidden");
  desktop.classList.remove("hidden");
  showToast("Welcome to your archive, Nidhi ♡");
  setTimeout(()=>openWindow("readme"),500);
});
$("#iconGrid").addEventListener("click", e => {
  const btn = e.target.closest("[data-window]");
  if (btn) openWindow(btn.dataset.window);
});
$$(".dock-app").forEach(btn => btn.addEventListener("click",()=>openWindow(btn.dataset.window)));
$("#homeButton").addEventListener("click",()=>{ $$(".archive-window",layer).forEach(w=>closeWindow(w)); showToast("Back to your little desktop ✿"); });
$("#trashButton").addEventListener("click",()=> {
  openWindow("badday");
  showToast("A little comfort file, just in case. ♡");
});
layer.addEventListener("click", e => {
  const close = e.target.closest('[data-action="close"],[data-action="minimise"]');
  if (close) { closeWindow(e.target.closest(".archive-window")); return; }
  const evidence = e.target.closest("[data-evidence]");
  if (evidence) {
    const messages = [
      "Exhibit A: tuition classes, shared pens, borrowed notes. We had no idea that those tiny beginnings would turn into years of stories, growing up and knowing each other in so many different versions.",
      "Exhibit B: the time you wrote sorry over and over — around a hundred times, as I remember it. I don't remember the exact situation as clearly as I remember the gesture. You wanted to make things right, and that stayed with me.",
      "Exhibit C: we have both had our low chapters. I remember being there when you needed someone, and I remember you being there when I did. Sometimes care isn't a grand speech. Sometimes it's simply not letting someone feel alone in a hard moment.",
      "Exhibit D: life can put months, distance and a hundred distractions between conversations. Yet when we meet again, it still feels familiar. That's what I mean when I say this friendship feels like home."
    ];
    $("#evidenceReveal").innerHTML = `<p class="handwritten">${messages[Number(evidence.dataset.evidence)]}</p>`;
  }
  const secret = e.target.closest("[data-secret]");
  if (secret) findSecret(Number(secret.dataset.secret));
  if (e.target.id === "generateCompliment") {
    complimentIndex = (complimentIndex + 1 + Math.floor(Math.random()*3)) % compliments.length;
    $("#complimentText").textContent = compliments[complimentIndex];
    $("#complimentText").animate([{opacity:0,transform:"translateY(7px)"},{opacity:1,transform:"translateY(0)"}],{duration:260});
  }
  if (e.target.id === "generatePrediction") {
    predictionIndex = (predictionIndex + 1 + Math.floor(Math.random()*2)) % predictions.length;
    $("#predictionText").textContent = predictions[predictionIndex];
  }
  if (e.target.id === "blowCandles") {
    const candles = $("#cakeCandles");
    if (candles) candles.classList.add("candles-out");
    $("#cakeWish").textContent = "Wish made. Now go make the year yours, Nidhiiiii. Happy 19th! ♡";
    e.target.textContent = "WISH SENT INTO THE UNIVERSE ✨";
    e.target.disabled = true;
    confetti();
  }
  if (e.target.id === "comfortButton") {
    const notes = [
      "You don't need to have the perfect response to everything. Sometimes getting through today is enough.",
      "You are more than one result, one mistake, one bad conversation or one difficult week.",
      "If you need company, reach out. You deserve support in real time, not just when you've figured everything out.",
      "The version of you who is still trying deserves kindness, not criticism.",
      "Pause. Breathe. Eat something. Put on a song. One small thing at a time."
    ];
    const box = $("#comfortNote");
    box.textContent = notes[Math.floor(Math.random()*notes.length)];
  }
  if (e.target.id === "openLetter") {
    $("#letterReveal").classList.remove("hidden");
    e.target.classList.add("hidden");
    confetti();
  }
});
// Clickable desktop stickers reveal hidden notes.
desktop.addEventListener("click", e => {
  const sticker = e.target.closest(".secret-hotspot");
  if (sticker) {
    const id = Number(sticker.dataset.secret);
    openWindow("secret");
    setTimeout(() => findSecret(id), 140);
  }
});

$("#mascot").addEventListener("click", () => {
  const lines = [
    "Psst. Your archivist has known you since the pen-and-notes era. That is a long-running investigation.",
    "I know where the good files are. Keep looking. ♡",
    "Official mascot report: Nidhi is talented, dramatic and very, very loved.",
    "You found me. That means you're an excellent detective.",
    "Reminder from a tiny desktop creature: you're doing great."
  ];
  showToast(lines[Math.floor(Math.random()*lines.length)]);
  if (!secretsFound.has(0)) findSecret(0);
});
function updateBirthdayCountdown() {
  const target = new Date("2026-11-30T00:00:00+05:30");
  const now = new Date();
  const ms = target - now;
  const el = $("#birthdayCountdown");
  if (!el) return;
  if (ms <= 0) {
    el.textContent = "IT'S YOUR DAY · HAPPY 19TH ♡";
    return;
  }
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  el.textContent = `${days} DAYS · ${hours} HOURS UNTIL YOUR DAY`;
}

function updateClock() {
  const now = new Date();
  $("#clock").textContent = now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
}
updateClock();
setInterval(updateClock,30000);
updateBirthdayCountdown();
setInterval(updateBirthdayCountdown,60000);

// Small keyboard shortcut: Escape closes the topmost open archive window.
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const windows = $$(".archive-window",layer);
    if (windows.length) closeWindow(windows[windows.length-1]);
  }
});
