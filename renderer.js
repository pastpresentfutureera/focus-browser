// ╔══════════════════════════════════════════════════════════╗
// ║  CHALLENGE PARAGRAPHS — each ≈ 150-180 words            ║
// ║  The user must type one of these perfectly to proceed    ║
// ╚══════════════════════════════════════════════════════════╝
const CHALLENGE_TEXTS = [

`The art of discipline is not about restricting freedom but about channeling energy toward meaningful goals. When we choose to focus on what truly matters, we discover that the distractions we once craved were merely shadows of fulfillment. Every moment spent scrolling through endless feeds is a moment stolen from creation, learning, and genuine human connection. The most successful individuals throughout history have been those who mastered the ability to say no to immediate gratification in pursuit of lasting achievement. Consider how many hours you have already lost to mindless browsing, and ask yourself whether those hours brought you closer to the person you aspire to become. True freedom is not the ability to do anything at any time, but the power to do what is right and necessary when it matters most. This challenge exists not as punishment, but as a mirror reflecting your own priorities back at you. If this website is truly important, prove it with patience.`,

`In the vast expanse of human knowledge, the ability to concentrate deeply on a single subject has become increasingly rare and increasingly valuable. The digital age has brought us unprecedented access to information, yet paradoxically, it has also fragmented our attention into countless tiny pieces scattered across websites, notifications, and social media platforms. Research consistently shows that it takes an average of twenty three minutes to fully regain focus after a distraction. When you consider how many times you are distracted in a single hour, you begin to understand the true cost of unfocused browsing. The brain is not designed for constant task switching. It performs best when given sustained periods of uninterrupted concentration. By choosing to complete this typing challenge, you are making a conscious decision about how to spend your time, and that decision itself is an exercise in the very discipline that leads to excellence in any field of human endeavor.`,

`Procrastination is the thief of time, and the internet is often its most powerful accomplice. Every click that leads you away from your intended purpose is a small surrender to the path of least resistance. The websites you seek to visit may offer momentary entertainment or comfort, but they rarely contribute to your long term growth, happiness, or success. History remembers those who built, created, and persevered, not those who consumed content passively while their dreams gathered dust. If you truly need to access this website, then this typing exercise should be a small price to pay. If however you find yourself unwilling to complete this challenge, perhaps that reluctance reveals something important about how necessary this distraction truly is. Use this moment to reflect on your goals, your ambitions, and the finite nature of your time on this earth. Every second is a gift, and how you choose to spend it defines who you are becoming as a person.`,

`The human mind is a remarkable instrument capable of extraordinary feats of creativity, problem solving, and innovation. Yet like any powerful tool, it requires careful maintenance and intentional direction to function at its best. When we allow ourselves to be pulled in every direction by the whims of digital distraction, we are essentially running the most sophisticated computer ever created on the lowest possible settings. Deep work, the state of focused concentration on cognitively demanding tasks, is where true breakthroughs happen. It is in these periods of sustained attention that scientists make discoveries, artists create masterpieces, and entrepreneurs build world changing companies. The shallow work of browsing, scrolling, and clicking may feel productive, but it rarely produces anything of lasting value. By completing this typing challenge, you are proving to yourself that you have the patience and determination to pursue difficult tasks. That skill will serve you far better than whatever website you were attempting to visit just now.`,

`Consider for a moment the incredible privilege of living in an age where nearly all of human knowledge is available at your fingertips. Our ancestors would have marveled at the ability to learn any subject, communicate with anyone across the globe, and access entire libraries worth of information from a single device. Yet instead of using this remarkable tool to its fullest potential, many of us spend our digital lives jumping between social media feeds, news sites, and entertainment platforms, consuming content that we will forget within minutes of reading it. The irony is profound. The very technology designed to make us more productive and connected has for many people become the primary obstacle to both productivity and genuine connection. This typing challenge is a deliberate speed bump on the road to distraction, a moment of pause that asks you to consider whether your next click is truly worth the time and attention it will cost you. If it is, then type on with confidence.`

];

// ═══════════ DOM ELEMENTS ═══════════
const urlBar              = document.getElementById('url-bar');
const goBtn               = document.getElementById('go-btn');
const pdfBtn              = document.getElementById('pdf-btn');
const homeBtn             = document.getElementById('home-btn');
const backBtn             = document.getElementById('back-btn');
const forwardBtn          = document.getElementById('forward-btn');
const refreshBtn          = document.getElementById('refresh-btn');
const challengeContainer  = document.getElementById('challenge-container');
const challengeDisplay    = document.getElementById('challenge-text-display');
const challengeInput      = document.getElementById('challenge-input');
const progressBar         = document.getElementById('progress-bar');
const progressText        = document.getElementById('progress-text');
const challengeStatus     = document.getElementById('challenge-status');
const giveUpBtn           = document.getElementById('give-up-btn');
const submitBtn           = document.getElementById('submit-btn');
const blockedUrlSpan      = document.getElementById('blocked-url');

let currentChallengeURL  = '';
let currentChallengeText = '';
let previousInputLength  = 0;

// ═══════════ INIT ═══════════
window.electronAPI.getAllowedSite().then(site => { urlBar.value = site; });

// ═══════════ TOOLBAR ACTIONS ═══════════
function handleGo() {
  let url = urlBar.value.trim();
  if (!url) return;
  if (!/^https?:\/\//i.test(url) && !url.startsWith('file://')) url = 'https://' + url;
  urlBar.value = url;

  window.electronAPI.navigateTo(url).then(result => {
    if (!result.allowed) showChallenge(result.url || url);
  });
}

goBtn.addEventListener('click', handleGo);
urlBar.addEventListener('keydown', e => { if (e.key === 'Enter') handleGo(); });

homeBtn.addEventListener('click', () => {
  hideChallenge();
  window.electronAPI.goHome();
  window.electronAPI.getAllowedSite().then(s => { urlBar.value = s; });
});

backBtn.addEventListener('click',    () => window.electronAPI.goBack());
forwardBtn.addEventListener('click', () => window.electronAPI.goForward());
refreshBtn.addEventListener('click', () => window.electronAPI.refreshPage());

pdfBtn.addEventListener('click', () => {
  hideChallenge();
  window.electronAPI.openPDF();
});

// ═══════════ IPC LISTENERS ═══════════
window.electronAPI.onShowChallenge(url => showChallenge(url));
window.electronAPI.onURLChanged(url    => { urlBar.value = url; });

// ═══════════ CHALLENGE LOGIC ═══════════

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showChallenge(url) {
  currentChallengeURL  = url;
  currentChallengeText = CHALLENGE_TEXTS[Math.floor(Math.random() * CHALLENGE_TEXTS.length)];
  previousInputLength  = 0;

  blockedUrlSpan.textContent = url;
  challengeDisplay.textContent = currentChallengeText;   // initial plain render
  challengeInput.value = '';
  progressBar.style.width = '0%';
  progressText.textContent = '0 %';
  challengeStatus.textContent = '';
  challengeStatus.className = '';
  submitBtn.disabled = true;

  challengeContainer.style.display = 'block';
  window.electronAPI.hideContentView();
  challengeInput.focus();
}

function hideChallenge() {
  challengeContainer.style.display = 'none';
  window.electronAPI.showContentView();
}

// ── Highlight characters in the reference text ──
function updateHighlight(typed) {
  const target = currentChallengeText;
  let html = '';
  for (let i = 0; i < target.length; i++) {
    const ch = escapeHTML(target[i]);
    if (i < typed.length) {
      html += typed[i] === target[i]
        ? `<span class="char-correct">${ch}</span>`
        : `<span class="char-wrong">${ch}</span>`;
    } else if (i === typed.length) {
      html += `<span class="char-current">${ch}</span>`;
    } else {
      html += ch;
    }
  }
  challengeDisplay.innerHTML = html;
}

// ── Live comparison ──
challengeInput.addEventListener('input', () => {
  const typed  = challengeInput.value;
  const target = currentChallengeText;

  // --- Anti-paste: if more than 3 chars appeared at once, revert ---
  if (typed.length - previousInputLength > 3) {
    challengeInput.value = challengeInput.value.substring(0, previousInputLength);
    challengeStatus.textContent = '🚫  Paste detected and removed! Type it yourself.';
    challengeStatus.className = 'status-error';
    previousInputLength = challengeInput.value.length;
    updateHighlight(challengeInput.value);
    return;
  }
  previousInputLength = typed.length;

  // Count consecutive correct chars from the start
  let correct = 0;
  for (let i = 0; i < typed.length && i < target.length; i++) {
    if (typed[i] === target[i]) correct++;
    else break;
  }

  const pct = Math.min(100, Math.floor((correct / target.length) * 100));
  progressBar.style.width = pct + '%';
  progressText.textContent = pct + ' %';

  updateHighlight(typed);

  if (correct === target.length && typed.length === target.length) {
    challengeStatus.textContent = '✅  Perfect! You may now access the website.';
    challengeStatus.className = 'status-success';
    submitBtn.disabled = false;
  } else if (typed.length > 0 && correct < typed.length) {
    challengeStatus.textContent =
      `❌  Mismatch at character ${correct + 1}. Fix it to continue.`;
    challengeStatus.className = 'status-error';
    submitBtn.disabled = true;
  } else {
    challengeStatus.textContent =
      `⌨️  ${correct} / ${target.length} characters correct`;
    challengeStatus.className = '';
    submitBtn.disabled = true;
  }
});

// ═══════════ BLOCK ALL PASTE / DROP VECTORS ═══════════

// Block Ctrl+V / Cmd+V
challengeInput.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
    e.preventDefault();
    challengeStatus.textContent = '🚫  Keyboard paste is disabled!';
    challengeStatus.className = 'status-error';
  }
  // Block Ctrl+Shift+V too
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'v' || e.key === 'V')) {
    e.preventDefault();
  }
});

// Block right-click context menu paste
challengeInput.addEventListener('contextmenu', e => {
  e.preventDefault();
  challengeStatus.textContent = '🚫  Right-click is disabled!';
  challengeStatus.className = 'status-error';
});

// Block clipboard paste event
challengeInput.addEventListener('paste', e => {
  e.preventDefault();
  challengeStatus.textContent = '🚫  Paste is not allowed! Type it manually.';
  challengeStatus.className = 'status-error';
});

// Block drag-and-drop text
challengeInput.addEventListener('drop', e => {
  e.preventDefault();
  challengeStatus.textContent = '🚫  Drag & drop is disabled!';
  challengeStatus.className = 'status-error';
});

// Block selecting the reference text (extra safety)
challengeDisplay.addEventListener('copy', e => e.preventDefault());

// ═══════════ CHALLENGE BUTTONS ═══════════

giveUpBtn.addEventListener('click', () => {
  hideChallenge();
  window.electronAPI.goHome();
  window.electronAPI.getAllowedSite().then(s => { urlBar.value = s; });
});

submitBtn.addEventListener('click', () => {
  if (submitBtn.disabled) return;
  window.electronAPI.loadAfterChallenge(currentChallengeURL);
  hideChallenge();
  urlBar.value = currentChallengeURL;
});
