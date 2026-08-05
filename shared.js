/* ============================================================
   STUDY TEACH PLATFORM SHARED CORE ENGINE (SHARED.JS)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initSharedEngine();
});

// ---- Global State ----
let currentUser = null;
let activeExamId = "yks";
let progressState = { completed: {}, stars: {} };

function isUserPremium() {
  if (!currentUser) return false;
  return currentUser.isPremium === true ||
         localStorage.getItem("studyteach_is_premium") === "true" ||
         localStorage.getItem("studytrack_is_premium") === "true";
}

function initSharedEngine() {
  // 1. Theme and Site Settings initialization
  applySavedSiteSettings();

  // 2. Auth checking
  const profileJSON = localStorage.getItem("studyteach_profile") || localStorage.getItem("studytrack_profile");
  const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/");

  if (!profileJSON) {
    if (!isIndexPage) {
      window.location.href = "index.html";
      return;
    }
  } else {
    currentUser = JSON.parse(profileJSON);
    activeExamId = localStorage.getItem("studyteach_active_exam") || localStorage.getItem("studytrack_active_exam") || "yks";
    loadProgress();
    
    if (isIndexPage) {
      window.location.href = "dashboard.html";
      return;
    }
  }

  // 3. Render common components (Sidebar, Header) if layout container is present
  const layoutContainer = document.getElementById("app-layout");
  if (layoutContainer && currentUser) {
    injectSidebarAndHeader(layoutContainer);
    injectPremiumModal();
    setupLayoutEvents();
    startCountdownTimer();
  }
}

/* ---- Theme Manager & Site Settings Applicator ---- */
function applySavedSiteSettings() {
  // 1. Theme
  const savedTheme = localStorage.getItem("studyteach_theme") || localStorage.getItem("studytrack_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (savedTheme === "custom") {
    const customAccent = localStorage.getItem("studyteach_custom_accent") || "#8b5cf6";
    const customBg = localStorage.getItem("studyteach_custom_bg") || "#0f172a";
    const customCard = localStorage.getItem("studyteach_custom_card") || "#1e293b";
    const customText = localStorage.getItem("studyteach_custom_text") || "#f8fafc";

    document.documentElement.style.setProperty("--bg-app", customBg);
    document.documentElement.style.setProperty("--bg-sidebar", customCard);
    document.documentElement.style.setProperty("--bg-card", customCard);
    document.documentElement.style.setProperty("--bg-input", customBg);
    document.documentElement.style.setProperty("--accent", customAccent);
    document.documentElement.style.setProperty("--accent-gradient", `linear-gradient(135deg, ${customAccent} 0%, #06b6d4 100%)`);
    document.documentElement.style.setProperty("--text-primary", customText);
  }

  // 2. Font Family
  const savedFont = localStorage.getItem("studyteach_font_family") || "Inter";
  document.documentElement.style.setProperty("--app-font-family", `'${savedFont}', sans-serif`);

  // 3. Font Size
  const savedSize = localStorage.getItem("studyteach_font_size") || "normal";
  if (savedSize === "small") {
    document.documentElement.style.fontSize = "14px";
  } else if (savedSize === "large") {
    document.documentElement.style.fontSize = "18px";
  } else if (savedSize === "xlarge") {
    document.documentElement.style.fontSize = "20px";
  } else {
    document.documentElement.style.fontSize = "16px";
  }

  // 4. Card Design Style
  const savedCardStyle = localStorage.getItem("studyteach_card_style") || "modern";
  if (savedCardStyle === "sharp") {
    document.documentElement.style.setProperty("--card-radius", "4px");
    document.documentElement.style.setProperty("--card-shadow", "none");
    document.documentElement.style.setProperty("--card-backdrop", "none");
  } else if (savedCardStyle === "rounded") {
    document.documentElement.style.setProperty("--card-radius", "26px");
    document.documentElement.style.setProperty("--card-shadow", "0 10px 25px -5px rgba(0, 0, 0, 0.1)");
    document.documentElement.style.setProperty("--card-backdrop", "none");
  } else if (savedCardStyle === "glass") {
    document.documentElement.style.setProperty("--card-radius", "18px");
    document.documentElement.style.setProperty("--card-shadow", "0 8px 32px 0 rgba(31, 38, 135, 0.15)");
    document.documentElement.style.setProperty("--card-backdrop", "blur(12px)");
  } else {
    // modern default
    document.documentElement.style.setProperty("--card-radius", "20px");
    document.documentElement.style.setProperty("--card-shadow", "var(--shadow-sm)");
    document.documentElement.style.setProperty("--card-backdrop", "none");
  }

  // 5. Animation Speed
  const animSpeed = localStorage.getItem("studyteach_anim_speed") || "normal";
  if (animSpeed === "fast") {
    document.documentElement.style.setProperty("--transition-speed", "0.12s");
  } else if (animSpeed === "slow") {
    document.documentElement.style.setProperty("--transition-speed", "0.4s");
  } else if (animSpeed === "none") {
    document.documentElement.style.setProperty("--transition-speed", "0s");
  } else {
    document.documentElement.style.setProperty("--transition-speed", "0.25s");
  }

  // 6. Border Width
  const borderWidth = localStorage.getItem("studyteach_border_width") || "thin";
  if (borderWidth === "thick") {
    document.documentElement.style.setProperty("--card-border-width", "2px");
  } else if (borderWidth === "none") {
    document.documentElement.style.setProperty("--card-border-width", "0px");
  } else {
    document.documentElement.style.setProperty("--card-border-width", "1px");
  }

  // 7. Line Height
  const lineHeight = localStorage.getItem("studyteach_line_height") || "normal";
  if (lineHeight === "compact") {
    document.documentElement.style.setProperty("--line-height", "1.35");
  } else if (lineHeight === "relaxed") {
    document.documentElement.style.setProperty("--line-height", "1.75");
  } else {
    document.documentElement.style.setProperty("--line-height", "1.5");
  }
}

function initTheme() {
  applySavedSiteSettings();
}

/* ---- Web Audio Sound Effects Engine ---- */
function playAppSound(type = "click") {
  const soundEnabled = localStorage.getItem("studyteach_sound_enabled") === "true";
  if (!soundEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "success") {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.22);
    } else {
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.07);
    }
  } catch(e) {}
}

/* ---- KVKK Summary Modal Engine ---- */
function openKvkkModal(e) {
  if (e) e.preventDefault();
  let modal = document.getElementById("kvkk-summary-modal");
  if (!modal) {
    const modalHtml = `
      <div class="modal-overlay open" id="kvkk-summary-modal">
        <div class="modal-box" style="max-width: 600px; max-height: 85vh; overflow-y: auto;">
          <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); color: #fff;">
            <h3 style="color:#fff">📜 KVKK & Gizlilik Sözleşmesi Özet</h3>
            <button class="modal-close-btn" onclick="closeKvkkModal()" style="color:#fff">✕</button>
          </div>
          <div class="modal-body" style="font-size: 0.85rem; line-height: 1.6; gap: 0.85rem;">
            <p><strong>Study Teach Platformu</strong> olarak 6698 sayılı KVKK gereğince kişisel verilerinizin güvenliğini azami düzeyde sağlıyoruz.</p>
            <ul style="padding-left:1.25rem">
              <li>Verileriniz (hedef, not, deneme istatistikleri) cihazınızdaki <strong>Yerel Depolama (LocalStorage)</strong> üzerinde tutulur.</li>
              <li>E-posta ve kimlik bilgileriniz asla reklam şirketleri veya 3. şahıslara aktarılmaz.</li>
              <li>Profil Ayarları altındaki tehlikeli alandan verilerinizi dilediğiniz an sıfırlayabilirsiniz.</li>
            </ul>
            <div style="background:var(--bg-hover); padding:0.75rem; border-radius:10px; border-left:3px solid var(--accent); margin-top:0.4rem">
              Detaylı hukuki maddeleri incelemek için <a href="kvkk.html" target="_blank" style="color:var(--accent); font-weight:700; text-decoration:underline">Tam KVKK ve Gizlilik Politikası Sayfasına</a> göz atabilirsiniz.
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary" onclick="closeKvkkModal()">Okudum, Anladım</button>
          </div>
        </div>
      </div>
    `;
    const div = document.createElement("div");
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);
  } else {
    modal.classList.add("open");
  }
}

function closeKvkkModal() {
  const modal = document.getElementById("kvkk-summary-modal");
  if (modal) modal.classList.remove("open");
}

/* ---- Sidebar & Header Injection ---- */
function injectSidebarAndHeader(container) {
  // Identify active page
  const path = window.location.pathname;
  const isDashboard = path.includes("dashboard.html");
  const isSınavlar = path.includes("sinavlar.html");
  const isKonular = path.includes("konular.html");
  const isAnaliz = path.includes("analiz.html");
  const isTakvim = path.includes("takvim.html");
  const isNotlar = path.includes("notlar.html");
  const isProfil = path.includes("profil.html");

  const avatarSrc = currentUser.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-8 4-8 4h16s-1.9-4-8-4z'/></svg>";
  const examInfo = EXAMS_DATA[activeExamId] || EXAMS_DATA.yks;
  const examTitle = examInfo.title;
  const isPrem = isUserPremium();

  // 1. Sidebar HTML
  const sidebarHtml = `
    <aside class="sidebar" id="app-sidebar">
      <a href="dashboard.html" class="sidebar-logo">
        <img src="image/studyteach-logo.png" alt="Study Teach Logo" class="sidebar-logo-img">
        <span class="sidebar-logo-text">Study Teach ${isPrem ? '<span style="font-size:0.65rem; background:gold; color:#000; padding:1px 5px; border-radius:4px; margin-left:4px; font-weight:800">VIP</span>' : ''}</span>
      </a>
      
      <nav class="sidebar-nav">
        <a href="dashboard.html" class="sidebar-link ${isDashboard ? 'active' : ''}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"/></svg>
          Dashboard
        </a>
        <a href="sinavlar.html" class="sidebar-link ${isSınavlar ? 'active' : ''}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
          Sınavlar
        </a>
        <a href="konular.html" class="sidebar-link ${isKonular ? 'active' : ''}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          Konular
        </a>
        <a href="analiz.html" class="sidebar-link ${isAnaliz ? 'active' : ''}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          Analiz
        </a>
        <a href="takvim.html" class="sidebar-link ${isTakvim ? 'active' : ''}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Takvim
        </a>
        <a href="notlar.html" class="sidebar-link ${isNotlar ? 'active' : ''}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Notlar
        </a>
        <a href="profil.html" class="sidebar-link ${isProfil ? 'active' : ''}">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Profil ve Ayarlar
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <div class="selected-exam-widget" onclick="window.location.href='profil.html'">
          <div class="selected-exam-info">
            <h4>Seçili Sınav</h4>
            <p>${examTitle}</p>
          </div>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
        
        ${isPrem ? `
          <div class="premium-widget active-premium" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            <div class="premium-widget-glow"></div>
            <h4>👑 VIP Plan Aktif</h4>
            <p>Tüm Özel VIP Temalar ve Sınırsız Özellikler Açık.</p>
            <button style="background:rgba(255,255,255,0.25); cursor:default">✓ VIP Sınırsız Erişim</button>
          </div>
        ` : `
          <div class="premium-widget">
            <div class="premium-widget-glow"></div>
            <h4>👑 VIP Plan</h4>
            <p>Özel 3 VIP Tema, Ayarlanabilir Tema Tasarımcısı ve Ekstra Özellikler.</p>
            <button onclick="openPremiumModal()">VIP'e Yükselt</button>
          </div>
        `}
        
        <div class="theme-toggle-row">
          <span class="theme-toggle-label">Hızlı Karanlık Tema</span>
          <label class="theme-switch">
            <input type="checkbox" id="theme-toggle-input">
            <span class="slider-switch"></span>
          </label>
        </div>
      </div>
    </aside>
  `;

  // 2. Header HTML
  const headerHtml = `
    <header class="app-header">
      <button class="hamburger-btn" id="sidebar-toggle-btn" aria-label="Menü">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      
      <div class="header-welcome">
        <h2>👋 Hoş geldin, <span id="header-user-name">${currentUser.name}</span>! ${isPrem ? '👑 VIP' : ''}</h2>
        <p>Bugün hedeflerine bir adım daha yaklaştığın harika bir gün!</p>
      </div>
      
      <div class="header-controls">
        <div class="exam-selector-header">
          <button class="exam-selector-btn" onclick="window.location.href='profil.html'">
            <span>🎯 ${examTitle}</span>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
        </div>
        
        <div class="countdown-widget">
          <span class="countdown-icon">📅</span>
          <div class="countdown-info">
            <span class="countdown-lbl">Sınava Kalan Süre</span>
            <span class="countdown-val" id="header-countdown">Yükleniyor...</span>
          </div>
        </div>
        
        <button class="notification-bell" onclick="showNotificationsMenu(event)">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <span class="bell-badge"></span>
        </button>
        
        <div class="profile-dropdown-container">
          <button class="profile-btn" id="header-profile-btn">
            <img class="profile-avatar" id="header-avatar" src="${avatarSrc}" alt="Avatar" style="${isPrem ? 'border: 2px solid gold;' : ''}">
            <div class="profile-info-header">
              <span class="profile-name-header" id="header-user-fullname">${isPrem ? '👑 ' : ''}${currentUser.name} ${currentUser.surname || ''}</span>
              <span class="profile-role-header">${isPrem ? 'VIP Üye' : (currentUser.grade || 'Öğrenci')}</span>
            </div>
            <svg style="width:14px;height:14px;color:var(--text-muted);margin-left:4px" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          
          <div class="dropdown-menu" id="header-profile-menu">
            <a href="profil.html" class="dropdown-item">⚙️ Profil & Site Ayarları</a>
            <a href="profil.html" class="dropdown-item">🎯 Sınav Değiştir</a>
            <a href="kvkk.html" target="_blank" onclick="openKvkkModal(event)" class="dropdown-item">📜 KVKK & Gizlilik Metni</a>
            ${!isPrem ? '<button class="dropdown-item" onclick="openPremiumModal()">👑 VIP Plan\'a Yükselt</button>' : ''}
            <button class="dropdown-item" onclick="logoutUser()">🚪 Çıkış Yap</button>
          </div>
        </div>
      </div>
    </header>
  `;

  // Insert components
  const wrap = document.createElement("div");
  wrap.innerHTML = sidebarHtml;
  container.insertBefore(wrap.firstElementChild, container.firstChild);

  const mainCol = container.querySelector(".main-content");
  if (mainCol) {
    const headWrap = document.createElement("div");
    headWrap.innerHTML = headerHtml;
    mainCol.insertBefore(headWrap.firstElementChild, mainCol.firstChild);
  }
}

/* ---- Premium / VIP Upgrade Modal Injection ---- */
function injectPremiumModal() {
  if (document.getElementById("premium-upgrade-modal")) return;

  const modalHtml = `
    <div class="modal-overlay" id="premium-upgrade-modal">
      <div class="modal-box" style="max-width: 560px">
        <div class="modal-header" style="background: linear-gradient(135deg, #4f46e5 0%, #d946ef 100%); color: #fff;">
          <h3 style="display:flex; align-items:center; gap:0.5rem; color:#fff">👑 Study Teach VIP Plan'a Geçin</h3>
          <button class="modal-close-btn" onclick="closePremiumModal()" style="color:#fff">✕</button>
        </div>
        
        <div class="modal-body" style="gap:1.15rem">
          <div style="text-align:center; margin-bottom:0.25rem">
            <p style="font-size:0.875rem; color:var(--text-secondary)">Sınav hazırlığınızı özel VIP renk temaları, kişiselleştirilebilir görünüm editörü ve gelişmiş araçlarla taçlandırın.</p>
          </div>

          <!-- VIP Features list (No AI) -->
          <div style="display:flex; flex-direction:column; gap:0.65rem; font-size:0.85rem">
            <div style="display:flex; align-items:center; gap:0.75rem; background:var(--bg-hover); padding:0.65rem 0.85rem; border-radius:12px; border:1px solid var(--border-color)">
              <span style="font-size:1.35rem">🎨</span>
              <div>
                <strong style="color:var(--text-primary)">3 Ekstra Büyüleyici VIP Tema</strong>
                <p style="font-size:0.725rem; color:var(--text-muted)">Gün Batımı (Sunset Gold), Okyanus Derinliği (Deep Ocean) ve Cyber Neon temaları kilitli olmaktan çıkar.</p>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:0.75rem; background:var(--bg-hover); padding:0.65rem 0.85rem; border-radius:12px; border:1px solid var(--border-color)">
              <span style="font-size:1.35rem">🎛️</span>
              <div>
                <strong style="color:var(--text-primary)">Kişiselleştirilebilir Özel Tema Editörü</strong>
                <p style="font-size:0.725rem; color:var(--text-muted)">Kendi arka plan, kart, vurgu ve yazı renklerinizi özgürce tasarlayın.</p>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:0.75rem; background:var(--bg-hover); padding:0.65rem 0.85rem; border-radius:12px; border:1px solid var(--border-color)">
              <span style="font-size:1.35rem">📄</span>
              <div>
                <strong style="color:var(--text-primary)">Ders Notlarını Sınırsız Dışa Aktarma</strong>
                <p style="font-size:0.725rem; color:var(--text-muted)">Hazırladığınız notları cihazınıza metin dokümanı olarak tek tıkla indirin.</p>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:0.75rem; background:var(--bg-hover); padding:0.65rem 0.85rem; border-radius:12px; border:1px solid var(--border-color)">
              <span style="font-size:1.35rem">🚫</span>
              <div>
                <strong style="color:var(--text-primary)">%100 Reklamsız & Özel VIP Rozeti</strong>
                <p style="font-size:0.725rem; color:var(--text-muted)">Profilinizde özel altın kral tacı rozeti ve kesintisiz odaklanma deneyimi.</p>
              </div>
            </div>
          </div>

          <!-- Pricing Plans -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:0.25rem">
            <div style="border:2px solid var(--accent); background:var(--accent-light); padding:0.85rem; border-radius:14px; text-align:center; cursor:pointer">
              <span style="font-size:0.65rem; font-weight:800; color:var(--accent); text-transform:uppercase">Yıllık Avantaj</span>
              <h4 style="font-size:1.2rem; font-weight:800; color:var(--text-primary); margin:2px 0">₺399 <span style="font-size:0.75rem; font-weight:500">/yıl</span></h4>
              <span style="font-size:0.68rem; color:var(--text-muted)">%35 İndirimli</span>
            </div>

            <div style="border:1px solid var(--border-color); background:var(--bg-hover); padding:0.85rem; border-radius:14px; text-align:center; cursor:pointer">
              <span style="font-size:0.65rem; font-weight:800; color:var(--text-muted); text-transform:uppercase">Aylık VIP</span>
              <h4 style="font-size:1.2rem; font-weight:800; color:var(--text-primary); margin:2px 0">₺49 <span style="font-size:0.75rem; font-weight:500">/ay</span></h4>
              <span style="font-size:0.68rem; color:var(--text-muted)">İstediğin an iptal et</span>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="justify-content:space-between">
          <span style="font-size:0.725rem; color:var(--text-muted)">🔒 Güvenli VIP Aktivasyon Simülasyonu</span>
          <button class="btn-primary" style="background:linear-gradient(135deg, #4f46e5 0%, #d946ef 100%); font-size:0.9rem; padding:0.65rem 1.25rem" onclick="activatePremiumMembership()">👑 Şimdi VIP Plan'a Yükselt (Simülasyon)</button>
        </div>
      </div>
    </div>
  `;

  const div = document.createElement("div");
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstElementChild);
}

function openPremiumModal() {
  const modal = document.getElementById("premium-upgrade-modal");
  if (modal) modal.classList.add("open");
}

function closePremiumModal() {
  const modal = document.getElementById("premium-upgrade-modal");
  if (modal) modal.classList.remove("open");
}

function activatePremiumMembership() {
  if (!currentUser) return;

  currentUser.isPremium = true;
  localStorage.setItem("studyteach_profile", JSON.stringify(currentUser));
  localStorage.setItem("studyteach_is_premium", "true");
  localStorage.setItem("studytrack_profile", JSON.stringify(currentUser));
  localStorage.setItem("studytrack_is_premium", "true");

  playAppSound("success");
  closePremiumModal();
  showToast("🎉 VIP üyelik aktifleşti! Tüm VIP temalar ve özelleştirmeler açıldı.", "success");

  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

function setupLayoutEvents() {
  // Mobile Hamburger Toggle
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const sidebar = document.getElementById("app-sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("open");
      playAppSound("click");
    });
    
    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    });
  }

  // Profile Dropdown Toggle
  const profileBtn = document.getElementById("header-profile-btn");
  const profileMenu = document.getElementById("header-profile-menu");
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("open");
      playAppSound("click");
    });

    document.addEventListener("click", () => {
      profileMenu.classList.remove("open");
    });
  }

  // Theme Switch Toggle
  const themeToggleCheckbox = document.getElementById("theme-toggle-input");
  if (themeToggleCheckbox) {
    const savedTheme = localStorage.getItem("studyteach_theme") || localStorage.getItem("studytrack_theme") || "light";
    themeToggleCheckbox.checked = (savedTheme === "dark" || savedTheme === "cyber" || savedTheme === "ocean" || savedTheme === "sunset");
    themeToggleCheckbox.addEventListener("change", (e) => {
      const nextTheme = e.target.checked ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("studyteach_theme", nextTheme);
      localStorage.setItem("studytrack_theme", nextTheme);
      playAppSound("click");
      showToast(nextTheme === "dark" ? "🌙 Karanlık tema aktif" : "☀️ Aydınlık tema aktif");
    });
  }
}

/* ---- Countdown Engine ---- */
function startCountdownTimer() {
  const cdVal = document.getElementById("header-countdown");
  const exam = EXAMS_DATA[activeExamId] || EXAMS_DATA.yks;
  const targetTime = new Date(exam.countdownTarget).getTime();

  function update() {
    const now = new Date().getTime();
    const diff = targetTime - now;

    if (!cdVal) return;

    if (diff <= 0) {
      cdVal.textContent = "Sınav Günü! 🎉";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    cdVal.textContent = `${days} Gün ${hours} Saat`;
  }

  update();
  setInterval(update, 60000);
}

/* ---- Toast Component ---- */
function showToast(message, type = "success") {
  let toastEl = document.getElementById("app-toast");
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.id = "app-toast";
    document.body.appendChild(toastEl);
  }

  const icon = type === "success" ? "✅" : type === "warning" ? "⚠️" : "❌";
  toastEl.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-text">${message}</span>
  `;
  
  toastEl.classList.add("show");
  playAppSound(type === "success" ? "success" : "click");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2500);
}

function showNotificationsMenu(e) {
  e.stopPropagation();
  playAppSound("click");
  showToast("🔔 Bildirimleriniz güncel.");
}

/* ---- Progress Session Manager ---- */
function loadProgress() {
  const key = `studyteach_progress_${currentUser.email}`;
  const fallbackKey = `studytrack_progress_${currentUser.email}`;
  const saved = localStorage.getItem(key) || localStorage.getItem(fallbackKey);
  if (saved) {
    progressState = JSON.parse(saved);
  } else {
    const oldSaved = localStorage.getItem("yks_tracker_v2");
    if (oldSaved) {
      progressState = JSON.parse(oldSaved);
      saveProgress();
    } else {
      progressState = { completed: {}, stars: {} };
    }
  }
}

function saveProgress() {
  if (currentUser) {
    const key = `studyteach_progress_${currentUser.email}`;
    localStorage.setItem(key, JSON.stringify(progressState));
    localStorage.setItem(`studytrack_progress_${currentUser.email}`, JSON.stringify(progressState));
  }
}

/* ---- Log out ---- */
function logoutUser() {
  playAppSound("click");
  localStorage.removeItem("studyteach_profile");
  localStorage.removeItem("studyteach_active_exam");
  localStorage.removeItem("studyteach_is_premium");
  localStorage.removeItem("studytrack_profile");
  localStorage.removeItem("studytrack_active_exam");
  localStorage.removeItem("studytrack_is_premium");
  window.location.href = "index.html";
}
