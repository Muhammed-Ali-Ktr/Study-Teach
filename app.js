/* ============================================================
   STUDYTRACK PLATFORM CORE LOGIC (APP.JS)
   ============================================================ */

// ---- Global State Refs ----
// Note: currentUser, activeExamId, progressState are defined in shared.js

/* ============================================================
   1. DASHBOARD CONTROLLER
   ============================================================ */
function initDashboard() {
  if (!currentUser) return;

  // Render general progress banner
  updateDashboardProgressBanner();

  // Load and render checklist targets
  initDashboardTargets();

  // Render course-by-course status
  renderDashboardCourseProgress();

  // Render weekly study chart
  renderWeeklyChart();

  // Render AI Coach Widget
  renderAICoachWidget();

  // Render mock exam list preview
  renderDashboardMocks();

  // Render suggestion list
  renderDashboardSuggestions();

  // Load last studied topics
  renderDashboardLastStudied();

  // Motivation Quote selection
  renderDashboardMotivation();
}

function updateDashboardProgressBanner() {
  const stats = calculateExamStats(activeExamId);
  
  const pctVal = document.getElementById("general-pct-val");
  const countVal = document.getElementById("general-count-val");
  const fillBar = document.getElementById("general-bar-fill");
  const targetVal = document.getElementById("general-target-val");
  
  if (pctVal) pctVal.textContent = `%${stats.pct}`;
  if (countVal) countVal.textContent = `Toplam ${stats.total} konudan ${stats.done} tanesini tamamladın.`;
  if (fillBar) fillBar.style.width = `${stats.pct}%`;
  if (targetVal) targetVal.textContent = `🎯 Hedefin: ${currentUser.targetRanking || 'İlk 30.000'}`;
}

function initDashboardTargets() {
  const container = document.getElementById("targets-list-container");
  if (!container) return;

  const key = `studytrack_targets_${currentUser.email}`;
  let targets = [];
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      targets = JSON.parse(saved);
    } else {
      // Default mock targets from Mockup 2
      targets = [
        { id: 1, title: "Matematik - Fonksiyonlar", desc: "8 alt konu çalışılacak", completed: true },
        { id: 2, title: "Kimya - Maddenin Halleri", desc: "5 konu çalışılacak", completed: true },
        { id: 3, title: "Fizik - Basınç", desc: "6 konu çalışılacak", completed: false }
      ];
      localStorage.setItem(key, JSON.stringify(targets));
    }
  } catch(e) { console.error(e); }

  renderTargetsList(targets, container, key);
}

function renderTargetsList(targets, container, storageKey) {
  container.innerHTML = "";
  if (targets.length === 0) {
    container.innerHTML = `<div style="text-align:center; font-size:0.85rem; color:var(--text-muted); padding:1rem">Henüz hedef eklenmemiş.</div>`;
    return;
  }

  targets.forEach(t => {
    const item = document.createElement("div");
    item.className = `target-item ${t.completed ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="target-checkbox-custom">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div class="target-text-container">
        <span class="target-title">${t.title}</span>
        <span class="target-meta">${t.desc}</span>
      </div>
      <button style="background:none; border:none; margin-left:auto; cursor:pointer; color:var(--text-muted)" onclick="deleteTarget(${t.id}, event)">✕</button>
    `;
    item.addEventListener("click", () => {
      t.completed = !t.completed;
      localStorage.setItem(storageKey, JSON.stringify(targets));
      renderTargetsList(targets, container, storageKey);
      
      // Update small stats card count for "Today completed"
      const todayCount = document.getElementById("stat-card-today-count");
      if (todayCount) {
        const completedCount = targets.filter(tr => tr.completed).length;
        todayCount.textContent = completedCount;
      }
    });
    container.appendChild(item);
  });

  // Render small stat cards count as well
  const totalCount = document.getElementById("stat-card-total-count");
  const completedCount = targets.filter(tr => tr.completed).length;
  const todayCount = document.getElementById("stat-card-today-count");
  if (todayCount) todayCount.textContent = completedCount;
}

function addNewTargetPrompt() {
  const title = prompt("Hedef Başlığı (Örn: Türkçe Paragraf):");
  if (!title) return;
  const desc = prompt("Hedef Detayı (Örn: 20 soru çözülecek):") || "Çalışma Hedefi";
  
  const key = `studytrack_targets_${currentUser.email}`;
  let targets = [];
  try {
    targets = JSON.parse(localStorage.getItem(key)) || [];
  } catch(e) {}
  
  targets.push({
    id: Date.now(),
    title: title,
    desc: desc,
    completed: false
  });
  
  localStorage.setItem(key, JSON.stringify(targets));
  const container = document.getElementById("targets-list-container");
  if (container) renderTargetsList(targets, container, key);
  showToast("📌 Yeni hedef eklendi.");
}

function deleteTarget(id, event) {
  event.stopPropagation();
  const key = `studytrack_targets_${currentUser.email}`;
  let targets = [];
  try {
    targets = JSON.parse(localStorage.getItem(key)) || [];
  } catch(e) {}
  
  targets = targets.filter(t => t.id !== id);
  localStorage.setItem(key, JSON.stringify(targets));
  const container = document.getElementById("targets-list-container");
  if (container) renderTargetsList(targets, container, key);
  showToast("🗑️ Hedef silindi.");
}

function renderDashboardCourseProgress() {
  const container = document.getElementById("course-progress-container");
  if (!container) return;

  container.innerHTML = "";
  const subjects = getAllExamSubjects(activeExamId);
  
  if (subjects.length === 0) {
    container.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted)">Seçili sınav dersi bulunamadı.</p>`;
    return;
  }

  // Display top 5 subjects
  subjects.slice(0, 5).forEach(subj => {
    const stats = calculateSubjectStats(activeExamId, subj.id, subj);
    const row = document.createElement("div");
    row.className = "course-prog-row";
    row.innerHTML = `
      <span class="course-prog-icon">${subj.icon || '📚'}</span>
      <span class="course-prog-name">${subj.label}</span>
      <div class="course-prog-bar-container">
        <div class="course-prog-bar-fill" style="background:${subj.color || 'var(--accent)'}; width:${stats.pct}%"></div>
      </div>
      <span class="course-prog-count">${stats.done}/${stats.total}</span>
      <span class="course-prog-pct" style="color:${subj.color || 'var(--accent)'}">%${stats.pct}</span>
    `;
    container.appendChild(row);
  });
}

function renderWeeklyChart() {
  const container = document.getElementById("weekly-bars-container");
  if (!container) return;

  container.innerHTML = "";

  const key = `studyteach_weekly_hours_${currentUser.email}`;
  let hours = [2.5, 3.0, 1.8, 4.2, 3.5, 5.0, 2.0];
  const saved = localStorage.getItem(key);
  if (saved) {
    try { hours = JSON.parse(saved); } catch(e) {}
  } else {
    localStorage.setItem(key, JSON.stringify(hours));
  }

  const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const max = Math.max(...hours) || 1;

  hours.forEach((h, i) => {
    const heightPct = (h / max) * 100;
    const col = document.createElement("div");
    col.className = "chart-bar-col";
    col.innerHTML = `
      <span class="chart-bar-val-hint">${h}sa</span>
      <div class="chart-bar-pill filled" style="height:${heightPct}%"></div>
      <span class="chart-bar-day">${days[i]}</span>
    `;
    container.appendChild(col);
  });

  // Dynamic calculations for Total Study Time & Average per Day
  const totalHoursFloat = hours.reduce((a, b) => a + b, 0);
  const totalMinutesTotal = Math.round(totalHoursFloat * 60);
  const totalH = Math.floor(totalMinutesTotal / 60);
  const totalM = totalMinutesTotal % 60;

  const avgMinutesPerDay = Math.round(totalMinutesTotal / 7);
  const avgH = Math.floor(avgMinutesPerDay / 60);
  const avgM = avgMinutesPerDay % 60;

  const totalEl = document.getElementById("total-study-time");
  const avgEl = document.getElementById("avg-study-time");

  if (totalEl) totalEl.textContent = `${totalH}sa ${totalM}dk`;
  if (avgEl) avgEl.textContent = `${avgH}sa ${avgM}dk`;
}

function renderDashboardMocks() {
  const container = document.getElementById("mocks-list-container");
  if (!container) return;

  container.innerHTML = "";
  const key = `studytrack_scores_${currentUser.email}`;
  let scores = [];
  try {
    scores = JSON.parse(localStorage.getItem(key)) || [];
  } catch(e) {}

  if (scores.length === 0) {
    // Initial mock denemeler based on Mockup 2
    scores = [
      { id: 1, name: "TYT Deneme - 12", date: "24 Mayıs 2027", correct: 95, wrong: 20, empty: 5, type: "TYT" },
      { id: 2, name: "AYT Deneme - 08", date: "31 Mayıs 2027", correct: 62, wrong: 14, empty: 4, type: "AYT" },
      { id: 3, name: "Genel Deneme - 05", date: "07 Haziran 2027", correct: 102, wrong: 15, empty: 3, type: "TYT+AYT" }
    ];
    localStorage.setItem(key, JSON.stringify(scores));
  }

  // Display top 3 upcoming or recent mocks
  scores.slice(0, 3).forEach(sc => {
    const parts = sc.date.split(" ");
    const day = parts[0] || "15";
    const month = (parts[1] || "Haz").substring(0, 3);
    
    const card = document.createElement("div");
    card.className = "mock-card";
    card.innerHTML = `
      <div class="mock-date-badge">
        <span class="mock-date-day">${day}</span>
        <span class="mock-date-month">${month}</span>
      </div>
      <div class="mock-info">
        <span class="mock-title">${sc.name}</span>
        <span class="mock-time">Başarı: ${sc.correct} Doğru / ${sc.wrong} Yanlış</span>
      </div>
      <span class="mock-tag">${sc.type || 'LGS'}</span>
    `;
    container.appendChild(card);
  });
}

function renderDashboardSuggestions() {
  const container = document.getElementById("suggestions-container");
  if (!container) return;

  container.innerHTML = "";
  const list = getSuggestionTopicsList(3);
  
  if (list.length === 0) {
    container.innerHTML = `<div style="font-size:0.85rem; color:var(--text-muted); text-align:center; padding:1rem">Tebrikler! Eksik konunuz kalmadı.</div>`;
    return;
  }

  list.forEach(item => {
    const row = document.createElement("div");
    row.className = "suggestion-row";
    row.innerHTML = `
      <div class="suggestion-info">
        <span class="suggestion-title">${item.topicTitle}</span>
        <span class="suggestion-subject">${item.subjName} - ${item.unitTitle}</span>
      </div>
      <span class="suggestion-pct" style="background-color:var(--status-warning-bg); color:var(--status-warning-text)">%${item.progressPct}</span>
    `;
    container.appendChild(row);
  });
}

function renderDashboardLastStudied() {
  const container = document.getElementById("last-studied-container");
  if (!container) return;

  container.innerHTML = "";
  const completedKeys = Object.keys(progressState.completed).filter(k => progressState.completed[k]);
  
  if (completedKeys.length === 0) {
    container.innerHTML = `<div style="font-size:0.85rem; color:var(--text-muted); padding:1rem; text-align:center">Henüz tamamlanan konu bulunmuyor. Konular sekmesinden konuları işaretleyin!</div>`;
    return;
  }

  // Display last 3 completed
  const last3 = completedKeys.slice(-3).reverse();
  last3.forEach(key => {
    // Key format: examId__subjectId__unitTitle__topicTitle
    const parts = key.split("__");
    if (parts.length < 4) return;
    
    const subjectId = parts[1];
    const unitTitle = parts[2];
    const topicTitle = parts[3];
    
    const examModule = EXAMS_DATA[activeExamId];
    let icon = "📝";
    let color = "#e2e8f0";
    let subjName = "";
    
    if (examModule) {
      // Find subject
      let foundSubj = null;
      Object.keys(examModule.modules).forEach(modKey => {
        const match = examModule.modules[modKey].subjects.find(s => s.id === subjectId);
        if (match) foundSubj = match;
      });
      if (foundSubj) {
        icon = foundSubj.icon || "📝";
        color = foundSubj.color || "#e2e8f0";
        subjName = foundSubj.label;
      }
    }

    const row = document.createElement("div");
    row.className = "studied-row";
    row.innerHTML = `
      <div class="studied-left">
        <div class="studied-icon-box" style="background-color:${color}20; color:${color}">${icon}</div>
        <div class="studied-info">
          <span class="studied-title">${topicTitle}</span>
          <span class="studied-meta">${subjName} &bull; ${unitTitle}</span>
        </div>
      </div>
      <span class="studied-pct-badge">%100</span>
    `;
    container.appendChild(row);
  });
}

function renderDashboardMotivation() {
  const textEl = document.getElementById("motivation-text");
  const authorEl = document.getElementById("motivation-author");
  const dayLblEl = document.getElementById("motivation-day-lbl");
  if (!textEl || !authorEl) return;

  const dayQuotes = [
    { day: "Pazar", text: "İmkânsız gibi görünen şeyler, yapılana kadar her zaman imkânsız görünür.", author: "Nelson Mandela" },
    { day: "Pazartesi", text: "Hayatta en hakiki mürşit ilimdir, fendir.", author: "Mustafa Kemal Atatürk" },
    { day: "Salı", text: "Mantık sizi A noktasından B noktasına götürür. Hayal gücü ise her yere.", author: "Albert Einstein" },
    { day: "Çarşamba", text: "Harika bir iş yapmanın tek yolu, yaptığınız işi sevmektir.", author: "Steve Jobs" },
    { day: "Perşembe", text: "Gelecek, hedeflerinin güzelliğine inananlarındır.", author: "Eleanor Roosevelt" },
    { day: "Cuma", text: "Dünün yenilgisi, bugünün zaferinin hazırlığıdır.", author: "Seneca" },
    { day: "Cumartesi", text: "Hiç başarısız olmadım, sadece çalışmayan 10.000 yol buldum.", author: "Thomas Edison" }
  ];

  const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const quoteObj = dayQuotes[todayIndex] || dayQuotes[1];

  if (dayLblEl) dayLblEl.textContent = `📅 ${quoteObj.day} Motivasyonu`;
  textEl.textContent = `"${quoteObj.text}"`;
  authorEl.textContent = `- ${quoteObj.author}`;
}

/* ============================================================
   2. SUBJECTS PAGE CONTROLLER
   ============================================================ */
let activeSubjectId = "all";
let currentLayoutView = "list";
let activeModalTopic = null; // { key, title, unitTitle, subjectId }

function initSubjectsPage() {
  // Render Subject horizontal Tabs
  renderSubjectsTabs();

  // Render course progress banner details
  updateSubjectsProgressBanner();

  // Populate module filtering options
  populateModuleFilters();

  // Render subject list accordions
  renderSubjectsAccordions();
}

function renderSubjectsTabs() {
  const container = document.getElementById("subject-tabs-container");
  if (!container) return;

  container.innerHTML = "";
  
  // Add an "All subjects" tab
  const allTab = document.createElement("div");
  allTab.className = `subject-tab-item ${activeSubjectId === "all" ? "active" : ""}`;
  allTab.innerHTML = `
    <span class="subject-tab-icon">📚</span>
    <span>Tümü</span>
  `;
  allTab.addEventListener("click", () => {
    activeSubjectId = "all";
    setSelectedTabActive(allTab);
    renderSubjectsAccordions();
  });
  container.appendChild(allTab);

  const subjects = getAllExamSubjects(activeExamId);
  subjects.forEach(subj => {
    const stats = calculateSubjectStats(activeExamId, subj.id, subj);
    const tab = document.createElement("div");
    tab.className = `subject-tab-item ${activeSubjectId === subj.id ? "active" : ""}`;
    tab.innerHTML = `
      <span class="subject-tab-icon">${subj.icon || '📖'}</span>
      <span>${subj.label}</span>
      <span class="subject-tab-count">${stats.total} Konu</span>
    `;
    tab.addEventListener("click", () => {
      activeSubjectId = subj.id;
      setSelectedTabActive(tab);
      renderSubjectsAccordions();
    });
    container.appendChild(tab);
  });
}

function setSelectedTabActive(selectedTab) {
  const tabs = document.querySelectorAll(".subject-tab-item");
  tabs.forEach(t => t.classList.remove("active"));
  selectedTab.classList.add("active");
}

function scrollTabs(amount) {
  const scrollContainer = document.getElementById("subject-tabs-container");
  if (scrollContainer) {
    scrollContainer.scrollBy({ left: amount, behavior: "smooth" });
  }
}

function updateSubjectsProgressBanner() {
  const stats = calculateExamStats(activeExamId);
  
  const labelEl = document.getElementById("course-progress-header-lbl");
  const pctEl = document.getElementById("course-progress-header-pct");
  const barFill = document.getElementById("course-progress-header-bar");
  
  const doneEl = document.getElementById("stats-done");
  const missingEl = document.getElementById("stats-missing");
  const totalEl = document.getElementById("stats-total");

  const examInfo = EXAMS_DATA[activeExamId] || EXAMS_DATA.yks;

  if (labelEl) labelEl.textContent = `${examInfo.title} Genel İlerleme Durumu`;
  if (pctEl) pctEl.textContent = `%${stats.pct}`;
  if (barFill) barFill.style.width = `${stats.pct}%`;
  
  if (doneEl) doneEl.innerHTML = `${stats.done} <span class="filter-stat-badge" style="background-color:var(--status-success-bg); color:var(--status-success-text)">✓</span>`;
  if (missingEl) missingEl.innerHTML = `${stats.total - stats.done} <span class="filter-stat-badge" style="background-color:var(--status-warning-bg); color:var(--status-warning-text)">!</span>`;
  if (totalEl) totalEl.textContent = stats.total;
}

function populateModuleFilters() {
  const select = document.getElementById("module-filter");
  if (!select) return;

  select.innerHTML = `<option value="all">Bölüm: Tümü</option>`;
  const exam = EXAMS_DATA[activeExamId];
  if (!exam || !exam.modules) return;

  Object.keys(exam.modules).forEach(modKey => {
    const option = document.createElement("option");
    option.value = modKey;
    option.textContent = exam.modules[modKey].label;
    select.appendChild(option);
  });
}

function renderSubjectsAccordions() {
  const container = document.getElementById("subjects-accordions-list");
  if (!container) return;

  container.innerHTML = "";
  
  const searchQuery = (document.getElementById("search-box")?.value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("status-filter")?.value || "all";
  const moduleFilter = document.getElementById("module-filter")?.value || "all";

  const exam = EXAMS_DATA[activeExamId];
  if (!exam || !exam.modules) return;

  Object.keys(exam.modules).forEach(modKey => {
    // Apply module filter
    if (moduleFilter !== "all" && moduleFilter !== modKey) return;

    const subjects = exam.modules[modKey].subjects;
    subjects.forEach(subj => {
      // Apply subject filter tab
      if (activeSubjectId !== "all" && activeSubjectId !== subj.id) return;

      const subStats = calculateSubjectStats(activeExamId, subj.id, subj);
      
      // Filter units and topics according to searches
      const filteredUnits = [];
      
      subj.units.forEach(unit => {
        const matchingTopics = unit.topics.filter(topic => {
          // Apply search query
          const matchSearch = topic.toLowerCase().includes(searchQuery) || unit.title.toLowerCase().includes(searchQuery);
          if (!matchSearch) return false;

          // Apply status filter
          const key = getTopicKey(activeExamId, subj.id, unit.title, topic);
          const isDone = !!progressState.completed[key];
          const hasStars = (progressState.stars[key] || 0) > 0;

          if (statusFilter === "done" && !isDone) return false;
          if (statusFilter === "missing" && isDone) return false;
          if (statusFilter === "stars" && !hasStars) return false;

          return true;
        });

        if (matchingTopics.length > 0) {
          filteredUnits.push({
            title: unit.title,
            topics: matchingTopics
          });
        }
      });

      if (filteredUnits.length === 0) return; // Hide subjects with no matching results

      // Render Subject Accordion Card
      const accordionCard = document.createElement("div");
      accordionCard.className = "subject-accordion-card";
      accordionCard.id = `accordion-${subj.id}`;
      
      // Create Header
      accordionCard.innerHTML = `
        <div class="subject-accordion-header" onclick="toggleAccordion('${subj.id}')">
          <div class="subject-accordion-left">
            <div class="subject-accordion-icon-box" style="background-color:${subj.color}20; color:${subj.color}">
              ${subj.icon || '📚'}
            </div>
            <div class="subject-accordion-meta">
              <span class="subject-accordion-title">${subj.label}</span>
              <span class="subject-accordion-sub">${subStats.done} / ${subStats.total} konu tamamlandı</span>
            </div>
          </div>
          
          <div class="subject-accordion-progress-wrapper">
            <div class="subject-accordion-bar">
              <div class="subject-accordion-bar-fill" style="background:${subj.color}; width:${subStats.pct}%"></div>
            </div>
            <span class="subject-accordion-percentage" style="background-color:${subj.color}15; color:${subj.color}">%${subStats.pct}</span>
          </div>

          <div class="subject-accordion-chevron">
            <svg style="width:20px;height:20px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
        
        <div class="subject-accordion-content">
          ${currentLayoutView === "list" 
            ? renderTopicsTable(subj.id, filteredUnits, subj.color) 
            : renderTopicsGrid(subj.id, filteredUnits, subj.color)
          }
        </div>
      `;

      container.appendChild(accordionCard);
    });
  });
}

function toggleAccordion(subjId) {
  const card = document.getElementById(`accordion-${subjId}`);
  if (card) {
    card.classList.toggle("open");
  }
}

function toggleLayoutView(view) {
  currentLayoutView = view;
  document.getElementById("view-list-btn").classList.toggle("active", view === "list");
  document.getElementById("view-grid-btn").classList.toggle("active", view === "grid");
  renderSubjectsAccordions();
}

function handleSearchFilter() {
  renderSubjectsAccordions();
}

function renderTopicsTable(subjId, units, color) {
  let rowsHtml = "";
  units.forEach(unit => {
    unit.topics.forEach(topic => {
      const key = getTopicKey(activeExamId, subjId, unit.title, topic);
      const isDone = !!progressState.completed[key];
      const starCount = progressState.stars[key] || 0;
      
      const starIcons = [1,2,3,4,5].map(n => 
        `<span style="color:${n <= starCount ? '#f59e0b' : 'var(--text-muted)'}; font-size:0.9rem">★</span>`
      ).join('');

      const statusText = isDone ? "Tamamlandı" : "Tamamlanmadı";
      const statusClass = isDone ? "completed" : "not-started";

      rowsHtml += `
        <tr>
          <td>
            <div class="topic-row-drag-handle">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/></svg>
              <div class="topic-row-title-wrap">
                <span class="topic-row-name">${topic}</span>
                <span class="topic-row-subcount">${unit.title}</span>
              </div>
            </div>
          </td>
          <td>
            <div class="status-pill ${statusClass}" onclick="toggleTopicComplete('${key}'); event.stopPropagation();">
              <span>${statusText}</span>
            </div>
          </td>
          <td>
            <div class="modal-stars-row">${starIcons}</div>
          </td>
          <td>
            <div class="resource-icons-wrapper">
              <button class="resource-icon-btn" title="YouTube Konu Anlatımı" onclick="openTopicModal('${key}', '${escapeQuote(topic)}', '${escapeQuote(unit.title)}', '${subjId}'); event.stopPropagation();">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </button>
              <button class="resource-icon-btn" title="Özet PDF" onclick="openTopicModal('${key}', '${escapeQuote(topic)}', '${escapeQuote(unit.title)}', '${subjId}'); event.stopPropagation();">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              </button>
            </div>
          </td>
          <td>
            <button class="action-cell-btn" onclick="openTopicModal('${key}', '${escapeQuote(topic)}', '${escapeQuote(unit.title)}', '${subjId}'); event.stopPropagation();">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </td>
        </tr>
      `;
    });
  });

  return `
    <table class="topics-table">
      <thead>
        <tr>
          <th>Konu Adı</th>
          <th>Durum</th>
          <th>Seviye</th>
          <th>Kaynaklar</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

function renderTopicsGrid(subjId, units, color) {
  let cardsHtml = "";
  units.forEach(unit => {
    unit.topics.forEach(topic => {
      const key = getTopicKey(activeExamId, subjId, unit.title, topic);
      const isDone = !!progressState.completed[key];
      const starCount = progressState.stars[key] || 0;
      
      const starIcons = [1,2,3,4,5].map(n => 
        `<span style="color:${n <= starCount ? '#f59e0b' : 'var(--text-muted)'}; font-size:0.9rem">★</span>`
      ).join('');

      const statusText = isDone ? "Tamamlandı" : "Tamamlanmadı";
      const statusClass = isDone ? "completed" : "not-started";

      cardsHtml += `
        <div class="topic-grid-card">
          <div class="topic-grid-header">
            <div style="display:flex; flex-direction:column; gap:2px">
              <span style="font-weight:700; font-size:0.875rem; color:var(--text-primary)">${topic}</span>
              <span style="font-size:0.7rem; color:var(--text-muted)">${unit.title}</span>
            </div>
          </div>
          <div class="modal-stars-row">${starIcons}</div>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem">
            <div class="status-pill ${statusClass}" onclick="toggleTopicComplete('${key}'); event.stopPropagation();">
              <span>${statusText}</span>
            </div>
            
            <div class="resource-icons-wrapper">
              <button class="resource-icon-btn" onclick="openTopicModal('${key}', '${escapeQuote(topic)}', '${escapeQuote(unit.title)}', '${subjId}')">📺</button>
              <button class="resource-icon-btn" onclick="openTopicModal('${key}', '${escapeQuote(topic)}', '${escapeQuote(unit.title)}', '${subjId}')">📄</button>
            </div>
          </div>
        </div>
      `;
    });
  });

  return `<div class="topics-grid-view">${cardsHtml}</div>`;
}

function toggleTopicComplete(key) {
  const isDone = !!progressState.completed[key];
  if (isDone) {
    delete progressState.completed[key];
    showToast("↩ Konu tamamlanmadı olarak işaretlendi.", "warning");
  } else {
    progressState.completed[key] = true;
    showToast("✅ Konu başarıyla tamamlandı!");
  }
  saveProgress();
  
  // Refresh UI
  updateSubjectsProgressBanner();
  renderSubjectsAccordions();
}

/* Modal Functions for subjects */
function openTopicModal(key, title, unitTitle, subjectId) {
  activeModalTopic = { key, title, unitTitle, subjectId };
  
  const modal = document.getElementById("topic-modal-overlay");
  const titleEl = document.getElementById("modal-topic-title");
  const toggleBtn = document.getElementById("modal-toggle-complete-btn");

  if (titleEl) titleEl.textContent = `${unitTitle} — ${title}`;
  
  // Set up stars
  const starCount = progressState.stars[key] || 0;
  renderModalStars(starCount);

  // Set up video link
  const searchQueryVideo = encodeURIComponent(`${title} konu anlatımı`);
  const videoLink = document.getElementById("modal-video-link");
  if (videoLink) videoLink.href = `https://www.youtube.com/results?search_query=${searchQueryVideo}`;

  // Set up PDF link
  const searchQueryPDF = encodeURIComponent(`${title} konu özeti pdf`);
  const pdfLink = document.getElementById("modal-pdf-link");
  if (pdfLink) pdfLink.href = `https://www.google.com/search?q=${searchQueryPDF}`;

  // Update complete button status
  const isDone = !!progressState.completed[key];
  updateModalToggleBtnUI(isDone);

  if (modal) modal.classList.add("open");
}

function closeTopicModal() {
  const modal = document.getElementById("topic-modal-overlay");
  if (modal) modal.classList.remove("open");
  activeModalTopic = null;
}

function renderModalStars(activeCount) {
  const wrapper = document.getElementById("modal-stars-wrapper");
  if (!wrapper) return;

  wrapper.innerHTML = "";
  [1,2,3,4,5].forEach(n => {
    const star = document.createElement("span");
    star.className = `modal-star ${n <= activeCount ? 'active' : ''}`;
    star.textContent = "★";
    star.addEventListener("click", () => {
      setTopicStars(activeModalTopic.key, n);
      renderModalStars(n);
    });
    wrapper.appendChild(star);
  });
}

function setTopicStars(key, starRating) {
  progressState.stars[key] = starRating;
  saveProgress();
  renderSubjectsAccordions();
}

function updateModalToggleBtnUI(isDone) {
  const btn = document.getElementById("modal-toggle-complete-btn");
  if (!btn) return;

  if (isDone) {
    btn.textContent = "☐ Kaldır (Geri Al)";
    btn.style.background = "var(--bg-input)";
    btn.style.color = "var(--text-primary)";
    btn.style.border = "1px solid var(--border-color)";
  } else {
    btn.textContent = "✅ Tamamlandı İşaretle";
    btn.style.background = "var(--accent-gradient)";
    btn.style.color = "#fff";
    btn.style.border = "none";
  }
}

function toggleTopicModalComplete() {
  if (!activeModalTopic) return;
  
  const key = activeModalTopic.key;
  const isDone = !!progressState.completed[key];
  
  if (isDone) {
    delete progressState.completed[key];
    showToast("↩ Konu tamamlanmadı olarak işaretlendi.", "warning");
  } else {
    progressState.completed[key] = true;
    showToast("✅ Konu başarıyla tamamlandı!");
  }
  
  saveProgress();
  updateModalToggleBtnUI(!isDone);
  updateSubjectsProgressBanner();
  renderSubjectsAccordions();
}

/* ============================================================
   3. ANALIZ PAGE CONTROLLER
   ============================================================ */
function initAnalizPage() {
  const stats = calculateExamStats(activeExamId);

  // Populate counters
  const pctEl = document.getElementById("analiz-total-pct");
  const doneEl = document.getElementById("analiz-done-count");
  const remEl = document.getElementById("analiz-rem-count");
  const avgStarsEl = document.getElementById("analiz-avg-stars");

  if (pctEl) pctEl.textContent = `%${stats.pct}`;
  if (doneEl) doneEl.textContent = stats.done;
  if (remEl) remEl.textContent = stats.total - stats.done;
  if (avgStarsEl) avgStarsEl.textContent = calculateAverageStars().toFixed(1);

  // Populate course list stats
  renderAnalizCourses();

  // Populate weak topics recommendations
  renderAnalizSuggestions();

  // Populate predictive score card
  renderPredictiveAnalizWidget();
}

function renderAnalizCourses() {
  const container = document.getElementById("analiz-courses-container");
  if (!container) return;

  container.innerHTML = "";
  const subjects = getAllExamSubjects(activeExamId);

  subjects.forEach(subj => {
    const stats = calculateSubjectStats(activeExamId, subj.id, subj);
    const row = document.createElement("div");
    row.className = "course-prog-row";
    row.innerHTML = `
      <span class="course-prog-icon">${subj.icon || '📚'}</span>
      <span class="course-prog-name" style="width:130px">${subj.label}</span>
      <div class="course-prog-bar-container">
        <div class="course-prog-bar-fill" style="background:${subj.color || 'var(--accent)'}; width:${stats.pct}%"></div>
      </div>
      <span class="course-prog-count">${stats.done}/${stats.total}</span>
      <span class="course-prog-pct" style="color:${subj.color || 'var(--accent)'}">%${stats.pct}</span>
    `;
    container.appendChild(row);
  });
}

function renderAnalizSuggestions() {
  const container = document.getElementById("analiz-weak-container");
  if (!container) return;

  container.innerHTML = "";
  const weakList = getSuggestionTopicsList(6);

  if (weakList.length === 0) {
    container.innerHTML = `<div style="font-size:0.85rem; color:var(--text-muted); text-align:center; padding:1.5rem">Tebrikler, tüm zayıf konularınızı tamamladınız!</div>`;
    return;
  }

  weakList.forEach(item => {
    const row = document.createElement("div");
    row.className = "suggestion-row";
    row.innerHTML = `
      <div class="suggestion-info">
        <span class="suggestion-title">${item.topicTitle}</span>
        <span class="suggestion-subject">${item.subjName} - ${item.unitTitle}</span>
      </div>
      <span class="suggestion-pct" style="background-color:var(--status-danger-bg); color:var(--status-danger-text)">Seviye: ${item.stars}★</span>
    `;
    container.appendChild(row);
  });
}

function calculateAverageStars() {
  const starsArray = Object.values(progressState.stars).filter(s => typeof s === 'number');
  if (starsArray.length === 0) return 0.0;
  const sum = starsArray.reduce((a, b) => a + b, 0);
  return sum / starsArray.length;
}

/* ============================================================
   4. SINAVLAR PAGE CONTROLLER
   ============================================================ */
function initSınavlarPage() {
  const exam = EXAMS_DATA[activeExamId] || EXAMS_DATA.yks;
  
  // Set Exam description and list details
  const nameEl = document.getElementById("info-exam-name");
  const descEl = document.getElementById("info-exam-desc");
  const listEl = document.getElementById("info-exam-list");
  const bannerTitle = document.getElementById("countdown-banner-title");

  if (bannerTitle) bannerTitle.textContent = `${exam.title} Sınavına Kalan Süre`;
  if (nameEl) nameEl.textContent = `${exam.title} (${exam.subTitle || ''})`;
  if (descEl) descEl.textContent = getExamExplanationText(activeExamId);

  // Populate sections list
  if (listEl) {
    listEl.innerHTML = "";
    Object.keys(exam.modules).forEach(modKey => {
      const module = exam.modules[modKey];
      const subjectsCount = module.subjects.length;
      
      const item = document.createElement("li");
      item.innerHTML = `<strong>${module.label}:</strong> Bu oturumda toplam <strong>${subjectsCount} ders</strong> takip edilmektedir.`;
      listEl.appendChild(item);
    });
  }

  // Large timer tick
  startLargeCountdownTimer(exam.countdownTarget);

  // Render mock test scores lists
  renderMockScores();
}

function getExamExplanationText(examId) {
  const texts = {
    yks: "Yükseköğretim Kurumları Sınavı (YKS), Türkiye'de üniversite eğitimi almak isteyen öğrencilerin girmesi gereken sınavdır. TYT ve AYT olmak üzere iki ana aşamadan oluşur.",
    kpss: "Kamu Personeli Seçme Sınavı (KPSS), devlet dairelerine memur alımlarını düzenlemek amacıyla yapılır. Genel Yetenek ve Genel Kültür oturumlarını kapsar.",
    dgs: "Dikey Geçiş Sınavı (DGS), meslek yüksekokulları ile açıköğretim önlisans programlarından mezun olan öğrencilerin lisans programlarına geçişini sağlar.",
    mebags: "Milli Eğitim Bakanlığı Akademi Giriş Sınavı (MEB-AGS), eğitim kurumu yöneticiliği ve öğretmenlik atamalarında mesleki bilgiyi ölçmek amacıyla düzenlenir.",
    ales: "Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı (ALES), lisansüstü eğitime başvurularda ve akademik kadro alımlarında kullanılır.",
    yokdil: "YÖKDİL, akademik kariyer hedefleyenlerin dil yeterliliğini ölçen, Fen, Sosyal ve Sağlık olmak üzere üç ayrı branşta yapılan dil sınavıdır.",
    yds2: "Yabancı Dil Bilgisi Seviye Tespit Sınavı (YDS/2), sonbahar döneminde yapılan, kamu kurumlarında dil tazminatı ve akademik kadro için dil yeterliliğini ölçen sınavdır.",
    msu: "Milli Savunma Üniversitesi Askeri Öğrenci Belirleme Sınavı (MSÜ), askeri okullarda eğitim görmek isteyen adayların katıldığı sınavdır.",
    yds1: "Yabancı Dil Bilgisi Seviye Tespit Sınavı (YDS/1), ilkbahar döneminde yapılan yabancı dil yeterliliğini belirleyen ulusal sınavdır.",
    yds: "YDS, yabancı dil tazminatı almak isteyen kamu personeli ve lisansüstü eğitim adayları için dil bilgisini ölçen merkezi sınavdır.",
    lgs: "Liselere Geçiş Sistemi Sınavı (LGS), ortaokul son sınıf öğrencilerinin nitelikli liselere yerleşebilmek amacıyla girdikleri merkezi sınavdır."
  };
  return texts[examId] || "Seçili sınava ait hazırlık müfredatı detayları.";
}

function startLargeCountdownTimer(targetStr) {
  const daysEl = document.getElementById("timer-days");
  const hoursEl = document.getElementById("timer-hours");
  const minutesEl = document.getElementById("timer-minutes");
  const secondsEl = document.getElementById("timer-seconds");
  const dateEl = document.getElementById("timer-target-date");

  const targetDate = new Date(targetStr);
  
  if (dateEl) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' };
    dateEl.textContent = `Sınav Tarihi: ${targetDate.toLocaleDateString('tr-TR', options)}`;
  }

  function tick() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = d.toString().padStart(2, '0');
    if (hoursEl) hoursEl.textContent = h.toString().padStart(2, '0');
    if (minutesEl) minutesEl.textContent = m.toString().padStart(2, '0');
    if (secondsEl) secondsEl.textContent = s.toString().padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

// Mock Score Log Manager
function renderMockScores() {
  const container = document.getElementById("scores-container");
  if (!container) return;

  container.innerHTML = "";
  const key = `studytrack_scores_${currentUser.email}`;
  let scores = [];
  try {
    scores = JSON.parse(localStorage.getItem(key)) || [];
  } catch(e) {}

  if (scores.length === 0) {
    container.innerHTML = `<div style="text-align:center; font-size:0.85rem; color:var(--text-muted); padding:2rem">Henüz eklenmiş deneme sonucu yok.</div>`;
    return;
  }

  scores.forEach(sc => {
    const net = sc.correct - (sc.wrong * 0.25);
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `
      <div class="score-meta">
        <span class="score-title">${sc.name}</span>
        <span class="score-date">${sc.date} &bull; Tip: ${sc.type || 'Deneme'}</span>
      </div>
      <div class="score-results">
        <div>D: <span class="score-num correct">${sc.correct}</span></div>
        <div>Y: <span class="score-num wrong">${sc.wrong}</span></div>
        <div>B: <span class="score-num empty">${sc.empty}</span></div>
        <div style="border-left:1px solid var(--border-color); padding-left:0.5rem">Net: <span class="score-num net">${net.toFixed(2)}</span></div>
      </div>
      <button style="background:none; border:none; margin-left:1rem; cursor:pointer; color:var(--status-danger-text); font-weight:700" onclick="deleteScore(${sc.id})">🗑️</button>
    `;
    container.appendChild(row);
  });
}

function openAddScoreModal() {
  const modal = document.getElementById("score-modal-overlay");
  if (modal) modal.classList.add("open");
}

function closeScoreModal() {
  const modal = document.getElementById("score-modal-overlay");
  if (modal) modal.classList.remove("open");
}

function saveNewScore() {
  const name = document.getElementById("score-name").value.trim();
  const correct = parseInt(document.getElementById("score-correct").value) || 0;
  const wrong = parseInt(document.getElementById("score-wrong").value) || 0;
  const empty = parseInt(document.getElementById("score-empty").value) || 0;

  if (!name) {
    alert("Lütfen deneme adını girin.");
    return;
  }

  const key = `studytrack_scores_${currentUser.email}`;
  let scores = [];
  try {
    scores = JSON.parse(localStorage.getItem(key)) || [];
  } catch(e) {}

  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('tr-TR', dateOptions);

  const examInfo = EXAMS_DATA[activeExamId] || EXAMS_DATA.yks;

  scores.unshift({
    id: Date.now(),
    name: name,
    correct: correct,
    wrong: wrong,
    empty: empty,
    date: formattedDate,
    type: examInfo.title.split(" ")[0]
  });

  localStorage.setItem(key, JSON.stringify(scores));
  closeScoreModal();
  renderMockScores();
  showToast("📈 Deneme skoru başarıyla eklendi.");
}

function deleteScore(id) {
  if (!confirm("Bu deneme skorunu silmek istediğinize emin misiniz?")) return;
  const key = `studytrack_scores_${currentUser.email}`;
  let scores = [];
  try {
    scores = JSON.parse(localStorage.getItem(key)) || [];
  } catch(e) {}

  scores = scores.filter(s => s.id !== id);
  localStorage.setItem(key, JSON.stringify(scores));
  renderMockScores();
  showToast("🗑️ Deneme skoru silindi.");
}

/* ============================================================
   5. PROFIL PAGE CONTROLLER
   ============================================================ */
let activeProfileAvatarBase64 = "";

function initProfilPage() {
  if (!currentUser) return;

  activeProfileAvatarBase64 = currentUser.avatar || "";

  // Populate preview card
  const imgEl = document.getElementById("profile-avatar-img");
  const nameEl = document.getElementById("profile-full-name");
  const examTagEl = document.getElementById("profile-exam-tag");
  
  const lblExam = document.getElementById("profile-lbl-exam");
  const lblAge = document.getElementById("profile-lbl-age");
  const lblGrade = document.getElementById("profile-lbl-grade");
  const lblEmail = document.getElementById("profile-lbl-email");
  const lblTarget = document.getElementById("profile-lbl-target");

  const examInfo = EXAMS_DATA[activeExamId] || EXAMS_DATA.yks;

  if (imgEl) imgEl.src = activeProfileAvatarBase64 || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-8 4-8 4h16s-1.9-4-8-4z'/></svg>";
  if (nameEl) nameEl.textContent = `${currentUser.name} ${currentUser.surname || ''}`;
  if (examTagEl) examTagEl.textContent = `${examInfo.title} Adayı`;

  if (lblExam) lblExam.textContent = examInfo.title;
  if (lblAge) lblAge.textContent = currentUser.age;
  if (lblGrade) lblGrade.textContent = currentUser.grade;
  if (lblEmail) lblEmail.textContent = currentUser.email;
  if (lblTarget) lblTarget.textContent = currentUser.targetRanking || "İlk 30.000";

  renderProfilePremiumStatus();
  loadSiteSettingsToUI();

  // Populate edit inputs
  const editName = document.getElementById("edit-name");
  const editSurname = document.getElementById("edit-surname");
  const editAge = document.getElementById("edit-age");
  const editGrade = document.getElementById("edit-grade");
  const editTargetRanking = document.getElementById("edit-target-ranking");
  const editEmail = document.getElementById("edit-email");
  const editPassword = document.getElementById("edit-password");
  const editExam = document.getElementById("edit-exam");

  if (editName) editName.value = currentUser.name;
  if (editSurname) editSurname.value = currentUser.surname || "";
  if (editAge) editAge.value = currentUser.age;
  if (editGrade) editGrade.value = currentUser.grade;
  if (editTargetRanking) editTargetRanking.value = currentUser.targetRanking || "İlk 30.000";
  if (editEmail) editEmail.value = currentUser.email;
  if (editPassword) editPassword.value = currentUser.password;
  if (editExam) editExam.value = activeExamId;

  // Set up avatar upload zone change
  const fileInput = document.getElementById("profile-file-input");
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          activeProfileAvatarBase64 = event.target.result;
          if (imgEl) imgEl.src = activeProfileAvatarBase64;
          // Update header avatar in real-time as well
          const headerAvatar = document.getElementById("header-avatar");
          if (headerAvatar) headerAvatar.src = activeProfileAvatarBase64;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Form submit update
  const form = document.getElementById("edit-profile-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      currentUser.name = editName.value;
      currentUser.surname = editSurname.value;
      currentUser.age = editAge.value;
      currentUser.grade = editGrade.value;
      currentUser.targetRanking = editTargetRanking.value || "İlk 30.000";
      currentUser.password = editPassword.value;
      currentUser.avatar = activeProfileAvatarBase64;

      const nextExam = editExam.value;
      
      // Save profile
      localStorage.setItem("studyteach_profile", JSON.stringify(currentUser));
      localStorage.setItem("studyteach_active_exam", nextExam);
      localStorage.setItem("studytrack_profile", JSON.stringify(currentUser));
      localStorage.setItem("studytrack_active_exam", nextExam);
      
      // Update top header displays
      const headerName = document.getElementById("header-user-name");
      const headerFull = document.getElementById("header-user-fullname");
      if (headerName) headerName.textContent = currentUser.name;
      if (headerFull) headerFull.textContent = `${currentUser.name} ${currentUser.surname || ''}`;

      showToast("⚙️ Profil bilgileri güncellendi.");
      
      // Reload profile dashboard elements
      initProfilPage();
    });
  }
}

// Reset curriculum progress
function confirmResetProgress() {
  const overlay = document.getElementById("reset-confirm-overlay");
  const lbl = document.getElementById("reset-modal-exam-name");
  
  const exam = EXAMS_DATA[activeExamId] || EXAMS_DATA.yks;
  if (lbl) lbl.textContent = exam.title;

  if (overlay) overlay.classList.add("open");
}

function closeResetModal() {
  const overlay = document.getElementById("reset-confirm-overlay");
  if (overlay) overlay.classList.remove("open");
}

function executeResetProgress() {
  const key = `studytrack_progress_${currentUser.email}`;
  
  // Wipe out completion logs
  progressState = { completed: {}, stars: {} };
  localStorage.setItem(key, JSON.stringify(progressState));
  
  closeResetModal();
  showToast("🗑️ Sınav ilerleme durumunuz sıfırlandı.", "warning");
}

/* ============================================================
   COMMON UTILITY MATH CALCULATIONS
   ============================================================ */
function calculateSubjectStats(examId, subjectId, subj) {
  let total = 0;
  let done = 0;

  subj.units.forEach(u => {
    u.topics.forEach(t => {
      total++;
      const key = getTopicKey(examId, subjectId, u.title, t);
      if (progressState.completed[key]) done++;
    });
  });

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

function calculateExamStats(examId) {
  let total = 0;
  let done = 0;
  
  const exam = EXAMS_DATA[examId];
  if (!exam || !exam.modules) return { total, done, pct: 0 };

  Object.keys(exam.modules).forEach(modKey => {
    exam.modules[modKey].subjects.forEach(subj => {
      subj.units.forEach(u => {
        u.topics.forEach(t => {
          total++;
          const key = getTopicKey(examId, subj.id, u.title, t);
          if (progressState.completed[key]) done++;
        });
      });
    });
  });

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

function getAllExamSubjects(examId) {
  const list = [];
  const exam = EXAMS_DATA[examId];
  if (!exam || !exam.modules) return list;

  Object.keys(exam.modules).forEach(modKey => {
    exam.modules[modKey].subjects.forEach(s => list.push(s));
  });
  return list;
}

function getSuggestionTopicsList(limit = 3) {
  const suggestions = [];
  const exam = EXAMS_DATA[activeExamId];
  if (!exam || !exam.modules) return suggestions;

  Object.keys(exam.modules).forEach(modKey => {
    exam.modules[modKey].subjects.forEach(subj => {
      subj.units.forEach(u => {
        u.topics.forEach(t => {
          const key = getTopicKey(activeExamId, subj.id, u.title, t);
          const isDone = !!progressState.completed[key];
          const stars = progressState.stars[key] || 0;
          
          if (!isDone || stars < 3) {
            suggestions.push({
              topicTitle: t,
              unitTitle: u.title,
              subjName: subj.label,
              subjColor: subj.color,
              stars: stars,
              isDone: isDone,
              progressPct: isDone ? 100 : (stars * 20), // mock representation
              key: key
            });
          }
        });
      });
    });
  });

  // Sort by star count ascending (lowest first) so weaker ones pop up
  suggestions.sort((a, b) => a.stars - b.stars);
  return suggestions.slice(0, limit);
}

function getTopicKey(examId, subjectId, unitTitle, topicTitle) {
  return `${examId}__${subjectId}__${unitTitle}__${topicTitle}`;
}

function escapeQuote(str) {
  return str.replace(/'/g, "\\'");
}

/* ============================================================
   6. NOTES SYSTEM CONTROLLER
   ============================================================ */
let notesList = [];
let activeNoteId = null;

function initNotesPage() {
  if (!currentUser) return;
  const key = `studytrack_notes_${currentUser.email}`;
  
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      notesList = JSON.parse(saved);
    } else {
      // Seed initial note
      notesList = [{
        id: Date.now(),
        title: "Hoş Geldiniz Notu",
        content: "Bu bölüm ders notlarınızı, formüllerinizi ve çalışma notlarınızı düzenli olarak saklayabilmeniz için tasarlanmıştır. Sol üstteki 'Yeni Not Ekle' butonuna basarak yeni bir not defteri oluşturabilirsiniz.",
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
      }];
      localStorage.setItem(key, JSON.stringify(notesList));
    }
  } catch(e) { console.error(e); }

  if (notesList.length > 0) {
    activeNoteId = notesList[0].id;
  }
  
  renderNotesList();
  loadActiveNoteIntoEditor();
}

function renderNotesList() {
  const container = document.getElementById("notes-list-container");
  if (!container) return;

  const searchQuery = (document.getElementById("note-search")?.value || "").toLowerCase().trim();
  container.innerHTML = "";

  const filtered = notesList.filter(n => 
    n.title.toLowerCase().includes(searchQuery) || 
    n.content.toLowerCase().includes(searchQuery)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p style="font-size:0.8rem; text-align:center; color:var(--text-muted); padding:1rem">Not bulunamadı.</p>`;
    return;
  }

  filtered.forEach(note => {
    const item = document.createElement("div");
    item.className = `note-item ${note.id === activeNoteId ? 'active' : ''}`;
    
    const previewText = note.content.substring(0, 35) + (note.content.length > 35 ? '...' : '');
    
    item.innerHTML = `
      <span class="note-item-title">${note.title || 'Başlıksız Not'}</span>
      <span class="note-item-date">${note.date}</span>
      <span class="note-item-preview">${previewText || 'Metin girilmedi...'}</span>
    `;

    item.addEventListener("click", () => {
      activeNoteId = note.id;
      // Highlight in list
      document.querySelectorAll(".note-item").forEach(el => el.classList.remove("active"));
      item.classList.add("active");
      loadActiveNoteIntoEditor();
    });

    container.appendChild(item);
  });
}

function loadActiveNoteIntoEditor() {
  const titleField = document.getElementById("note-title");
  const dateField = document.getElementById("note-date");
  const contentField = document.getElementById("note-content");
  const editor = document.getElementById("editor-container");

  const activeNote = notesList.find(n => n.id === activeNoteId);

  if (!activeNote) {
    if (editor) editor.style.opacity = "0.5";
    if (titleField) { titleField.value = ""; titleField.disabled = true; }
    if (contentField) { contentField.value = ""; contentField.disabled = true; }
    if (dateField) dateField.textContent = "--/--/----";
    return;
  }

  if (editor) editor.style.opacity = "1";
  if (titleField) { titleField.value = activeNote.title; titleField.disabled = false; }
  if (contentField) { contentField.value = activeNote.content; contentField.disabled = false; }
  if (dateField) dateField.textContent = activeNote.date;
}

function createNewNote() {
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Date().toLocaleDateString('tr-TR', dateOptions);

  const newNote = {
    id: Date.now(),
    title: "Yeni Not Dosyası",
    content: "",
    date: formattedDate
  };

  notesList.unshift(newNote);
  activeNoteId = newNote.id;
  
  saveNotesToStorage();
  renderNotesList();
  loadActiveNoteIntoEditor();
  
  const searchInput = document.getElementById("note-search");
  if (searchInput) searchInput.value = "";

  showToast("📝 Yeni not dosyası oluşturuldu.");
}

function autoSaveActiveNote() {
  if (!activeNoteId) return;

  const titleVal = document.getElementById("note-title").value;
  const contentVal = document.getElementById("note-content").value;

  const note = notesList.find(n => n.id === activeNoteId);
  if (note) {
    note.title = titleVal;
    note.content = contentVal;
    
    saveNotesToStorage();

    // Update previews in sidebar list without fully re-rendering to prevent scroll/focus resets
    const activeItem = document.querySelector(".note-item.active");
    if (activeItem) {
      const titleSpan = activeItem.querySelector(".note-item-title");
      const previewSpan = activeItem.querySelector(".note-item-preview");
      
      if (titleSpan) titleSpan.textContent = titleVal || "Başlıksız Not";
      if (previewSpan) {
        const previewText = contentVal.substring(0, 35) + (contentVal.length > 35 ? '...' : '');
        previewSpan.textContent = previewText || "Metin girilmedi...";
      }
    }
  }
}

function saveActiveNoteForce() {
  autoSaveActiveNote();
  showToast("💾 Not kaydedildi.");
}

function deleteActiveNote() {
  if (!activeNoteId) return;
  if (!confirm("Bu not dosyasını kalıcı olarak silmek istediğinize emin misiniz?")) return;

  notesList = notesList.filter(n => n.id !== activeNoteId);
  saveNotesToStorage();

  if (notesList.length > 0) {
    activeNoteId = notesList[0].id;
  } else {
    activeNoteId = null;
  }

  renderNotesList();
  loadActiveNoteIntoEditor();
  showToast("🗑️ Not dosyası silindi.", "warning");
}

function saveNotesToStorage() {
  if (currentUser) {
    const key = `studytrack_notes_${currentUser.email}`;
    localStorage.setItem(key, JSON.stringify(notesList));
  }
}


/* ============================================================
   7. CALENDAR SYSTEM CONTROLLER
   ============================================================ */
let calendarData = {}; // Format: { "YYYY-MM-DD": { reminder: "...", todo: [ { id, text, completed } ] } }
let calendarYear = 2026;
let calendarMonth = 7; // August (0-indexed: 0 = Jan, 7 = Aug)
let selectedCalendarDateStr = "2026-08-04"; // Initial mock active day

const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", 
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

function initCalendarPage() {
  if (!currentUser) return;

  // Set initial year and month to match current date
  const now = new Date("2026-08-04");
  calendarYear = now.getFullYear();
  calendarMonth = now.getMonth();
  selectedCalendarDateStr = "2026-08-04";

  // Load store
  const key = `studytrack_calendar_${currentUser.email}`;
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      calendarData = JSON.parse(saved);
    } else {
      // Seed some calendar mock data
      calendarData = {
        "2026-08-04": {
          reminder: "Matematik Fonksiyonlar tekrarı yapılacak.",
          todo: [
            { id: 1, text: "Fonksiyon grafikleri testini çöz", completed: true },
            { id: 2, text: "Kimya maddenin halleri özeti oku", completed: false }
          ]
        },
        "2026-08-15": {
          reminder: "TYT Deneme sınavına girilecek.",
          todo: [
            { id: 3, text: "Deneme sonrası yanlış analizlerini yap", completed: false }
          ]
        }
      };
      localStorage.setItem(key, JSON.stringify(calendarData));
    }
  } catch(e) { console.error(e); }

  renderCalendarGrid();
  selectCalendarDate(selectedCalendarDateStr);
}

function renderCalendarGrid() {
  const monthTitle = document.getElementById("calendar-month-title");
  const grid = document.getElementById("calendar-days-grid");
  if (!grid || !monthTitle) return;

  monthTitle.textContent = `${MONTH_NAMES[calendarMonth]} ${calendarYear}`;
  grid.innerHTML = "";

  // Day Headers
  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  dayNames.forEach(name => {
    const lbl = document.createElement("div");
    lbl.className = "calendar-day-label";
    lbl.textContent = name;
    grid.appendChild(lbl);
  });

  // Calculate days details
  const firstDay = new Date(calendarYear, calendarMonth, 1);
  // getDay() yields 0 for Sunday, 1 for Monday... adjust for starting week on Monday
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6; // Sunday becomes index 6

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const prevDaysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();

  // 1. Previous month trailing days
  for (let i = startOffset - 1; i >= 0; i--) {
    const dateNum = prevDaysInMonth - i;
    const prevMonthIdx = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const prevYear = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
    const dateStr = `${prevYear}-${(prevMonthIdx + 1).toString().padStart(2, '0')}-${dateNum.toString().padStart(2, '0')}`;
    
    renderCalendarCell(grid, dateNum, dateStr, true);
  }

  // 2. Selected month days
  for (let dateNum = 1; dateNum <= daysInMonth; dateNum++) {
    const dateStr = `${calendarYear}-${(calendarMonth + 1).toString().padStart(2, '0')}-${dateNum.toString().padStart(2, '0')}`;
    renderCalendarCell(grid, dateNum, dateStr, false);
  }

  // 3. Next month leading days (to fill grid to multiple of 7)
  const totalRendered = startOffset + daysInMonth;
  const trailingCells = (7 - (totalRendered % 7)) % 7;
  for (let dateNum = 1; dateNum <= trailingCells; dateNum++) {
    const nextMonthIdx = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const nextYear = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
    const dateStr = `${nextYear}-${(nextMonthIdx + 1).toString().padStart(2, '0')}-${dateNum.toString().padStart(2, '0')}`;
    
    renderCalendarCell(grid, dateNum, dateStr, true);
  }
}

function renderCalendarCell(grid, dateNum, dateStr, isOtherMonth) {
  const cell = document.createElement("div");
  cell.className = `calendar-cell ${isOtherMonth ? 'other-month' : ''}`;
  
  if (dateStr === "2026-08-04") {
    cell.classList.add("today");
  }
  if (dateStr === selectedCalendarDateStr) {
    cell.classList.add("selected");
  }

  cell.innerHTML = `
    <span class="calendar-date-number">${dateNum}</span>
    <div class="calendar-cell-indicator-row" id="indicators-${dateStr}"></div>
  `;

  // Draw indicator dots if entries exist
  setTimeout(() => {
    const indicators = document.getElementById(`indicators-${dateStr}`);
    if (indicators && calendarData[dateStr]) {
      const data = calendarData[dateStr];
      if (data.reminder && data.reminder.trim() !== "") {
        const dot = document.createElement("span");
        dot.className = "calendar-dot reminder";
        indicators.appendChild(dot);
      }
      if (data.todo && data.todo.length > 0) {
        const dot = document.createElement("span");
        dot.className = "calendar-dot todo";
        indicators.appendChild(dot);
      }
    }
  }, 0);

  cell.addEventListener("click", () => {
    selectCalendarDate(dateStr);
  });

  grid.appendChild(cell);
}

function navigateMonth(direction) {
  calendarMonth += direction;
  if (calendarMonth > 11) {
    calendarMonth = 0;
    calendarYear++;
  } else if (calendarMonth < 0) {
    calendarMonth = 11;
    calendarYear--;
  }

  renderCalendarGrid();
}

function selectCalendarDate(dateStr) {
  selectedCalendarDateStr = dateStr;
  
  // Highlight selection in calendar cells
  document.querySelectorAll(".calendar-cell").forEach(el => el.classList.remove("selected"));
  // Re-render grid is cleaner to sync dates between months
  renderCalendarGrid();

  renderCalendarDayDetails();
}

function windowWidthCheck() {
  // layout fix helpers
}

function renderCalendarDayDetails() {
  const dateLbl = document.getElementById("selected-date-lbl");
  const cdLbl = document.getElementById("selected-date-countdown");
  const reminderInput = document.getElementById("reminder-input");
  
  const parsedDate = new Date(selectedCalendarDateStr);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  if (dateLbl) dateLbl.textContent = parsedDate.toLocaleDateString('tr-TR', options);

  // Calculate countdown to active exam
  const exam = EXAMS_DATA[activeExamId] || EXAMS_DATA.yks;
  const examTime = new Date(exam.countdownTarget).getTime();
  const selTime = parsedDate.getTime();
  const diff = examTime - selTime;

  if (cdLbl) {
    if (diff <= 0) {
      cdLbl.textContent = "Sınav Günü Geçti veya Bugün!";
    } else {
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      cdLbl.textContent = `Sınava Kalan Gün: ${days} Gün`;
    }
  }

  const dayData = calendarData[selectedCalendarDateStr] || { reminder: "", todo: [] };
  
  if (reminderInput) {
    reminderInput.value = dayData.reminder || "";
  }

  renderCalendarTodoList(dayData.todo);
}

function saveDayReminder() {
  const text = document.getElementById("reminder-input").value;
  
  if (!calendarData[selectedCalendarDateStr]) {
    calendarData[selectedCalendarDateStr] = { reminder: "", todo: [] };
  }

  calendarData[selectedCalendarDateStr].reminder = text;
  saveCalendarToStorage();

  // Update dots in cell without full re-render
  const indicators = document.getElementById(`indicators-${selectedCalendarDateStr}`);
  if (indicators) {
    indicators.innerHTML = "";
    if (text.trim() !== "") {
      const dot = document.createElement("span");
      dot.className = "calendar-dot reminder";
      indicators.appendChild(dot);
    }
    const todoList = calendarData[selectedCalendarDateStr].todo;
    if (todoList && todoList.length > 0) {
      const dot = document.createElement("span");
      dot.className = "calendar-dot todo";
      indicators.appendChild(dot);
    }
  }
}

function renderCalendarTodoList(todoList = []) {
  const container = document.getElementById("calendar-todo-list-container");
  if (!container) return;

  container.innerHTML = "";
  if (todoList.length === 0) {
    container.innerHTML = `<p style="font-size:0.775rem; color:var(--text-muted); text-align:center; padding:1rem">Bugün için planlanan iş yok.</p>`;
    return;
  }

  todoList.forEach(item => {
    const node = document.createElement("div");
    node.className = `calendar-todo-item ${item.completed ? 'completed' : ''}`;
    node.innerHTML = `
      <input type="checkbox" class="calendar-todo-checkbox" ${item.completed ? 'checked' : ''} onclick="toggleCalendarTodo(${item.id})">
      <span class="calendar-todo-text">${item.text}</span>
      <button class="calendar-todo-delete-btn" onclick="deleteCalendarTodo(${item.id})">Sil</button>
    `;
    container.appendChild(node);
  });
}

function handleCalendarTodoKeyDown(e) {
  if (e.key === "Enter") {
    addCalendarTodoItem();
  }
}

function addCalendarTodoItem() {
  const input = document.getElementById("calendar-todo-input");
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  if (!calendarData[selectedCalendarDateStr]) {
    calendarData[selectedCalendarDateStr] = { reminder: "", todo: [] };
  }

  calendarData[selectedCalendarDateStr].todo.push({
    id: Date.now(),
    text: text,
    completed: false
  });

  saveCalendarToStorage();
  input.value = "";

  renderCalendarDayDetails();
  
  // Re-draw grid to update indicators
  renderCalendarGrid();
  showToast("📝 Görev eklendi.");
}

function toggleCalendarTodo(todoId) {
  const dayData = calendarData[selectedCalendarDateStr];
  if (dayData && dayData.todo) {
    const item = dayData.todo.find(t => t.id === todoId);
    if (item) {
      item.completed = !item.completed;
      saveCalendarToStorage();
      renderCalendarDayDetails();
    }
  }
}

function deleteCalendarTodo(todoId) {
  const dayData = calendarData[selectedCalendarDateStr];
  if (dayData && dayData.todo) {
    dayData.todo = dayData.todo.filter(t => t.id !== todoId);
    saveCalendarToStorage();
    renderCalendarDayDetails();
    
    // Re-draw grid indicators
    renderCalendarGrid();
    showToast("🗑️ Görev silindi.", "warning");
  }
}

function saveCalendarToStorage() {
  if (currentUser) {
    const key = `studytrack_calendar_${currentUser.email}`;
    localStorage.setItem(key, JSON.stringify(calendarData));
  }
}

/* ============================================================
   8. PREMIUM FEATURES ENGINE
   ============================================================ */

// 1. Dashboard VIP Special Themes Widget Renderer (No AI)
function renderAICoachWidget() {
  const container = document.getElementById("ai-coach-container");
  if (!container) return;

  const isPrem = isUserPremium();

  if (!isPrem) {
    container.innerHTML = `
      <div style="text-align:center; padding:1.25rem 0.5rem; display:flex; flex-direction:column; align-items:center; gap:0.65rem">
        <div style="font-size:2.2rem">🔒 VIP</div>
        <strong style="font-size:0.875rem; color:var(--text-primary)">Özel VIP Temalar & Editör Kilitli</strong>
        <p style="font-size:0.775rem; color:var(--text-muted); line-height:1.4">Gün Batımı, Okyanus Derinliği, Cyber Neon ve Tam Ayarlanabilir Renk Paleti Tasarımcısını açmak için VIP Plan'a geçin.</p>
        <button class="btn-primary" style="font-size:0.8rem; padding:0.45rem 1.15rem; margin-top:0.25rem" onclick="openPremiumModal()">👑 VIP Plan'a Yükselt</button>
      </div>
    `;
    return;
  }

  // Active VIP user options
  const activeTheme = localStorage.getItem("studyteach_theme") || "light";

  container.innerHTML = `
    <div style="padding:0.5rem 0; display:flex; flex-direction:column; gap:0.75rem">
      <div style="font-size:0.8rem; color:var(--text-secondary)">
        👑 <strong>VIP Üye Ayrıcalığı:</strong> İstediğiniz özel temayı tek tıkla seçin:
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem">
        <button class="btn-secondary" style="font-size:0.75rem; padding:0.4rem; ${activeTheme === 'sunset' ? 'border-color:var(--accent); font-weight:700;' : ''}" onclick="applyThemeFromWidget('sunset')">🌅 Gün Batımı</button>
        <button class="btn-secondary" style="font-size:0.75rem; padding:0.4rem; ${activeTheme === 'ocean' ? 'border-color:var(--accent); font-weight:700;' : ''}" onclick="applyThemeFromWidget('ocean')">🌊 Okyanus</button>
        <button class="btn-secondary" style="font-size:0.75rem; padding:0.4rem; ${activeTheme === 'cyber' ? 'border-color:var(--accent); font-weight:700;' : ''}" onclick="applyThemeFromWidget('cyber')">⚡ Cyber Neon</button>
        <button class="btn-secondary" style="font-size:0.75rem; padding:0.4rem; ${activeTheme === 'custom' ? 'border-color:var(--accent); font-weight:700;' : ''}" onclick="window.location.href='profil.html'">🎛️ Özel Palet</button>
      </div>
      <div style="padding:0.6rem 0.75rem; background:var(--bg-hover); border-radius:10px; font-size:0.725rem; border-left:3px solid var(--accent); color:var(--text-muted)">
        💡 Dilediğiniz zaman Profil & Ayarlar sayfasından kendi özel renk kombinasyonlarınızı ve fontlarınızı tasarlayabilirsiniz.
      </div>
    </div>
  `;
}

function applyThemeFromWidget(themeName) {
  if (!isUserPremium()) {
    openPremiumModal();
    return;
  }
  localStorage.setItem("studyteach_theme", themeName);
  localStorage.setItem("studytrack_theme", themeName);
  applySavedSiteSettings();
  renderAICoachWidget();
  showToast(`🎨 ${themeName.toUpperCase()} teması uygulandı!`);
}

// 2. Analiz Predictive Ranking & Net Simulator Widget Renderer
function renderPredictiveAnalizWidget() {
  const container = document.getElementById("analiz-predictive-container");
  if (!container) return;

  const isPrem = isUserPremium();
  const stats = calculateExamStats(activeExamId);

  if (!isPrem) {
    container.innerHTML = `
      <div style="text-align:center; padding:1.5rem 1rem; display:flex; flex-direction:column; align-items:center; gap:0.65rem">
        <div style="font-size:2.2rem">🔒 VIP</div>
        <strong style="font-size:0.9rem; color:var(--text-primary)">Sınav Net & Sıralama Simülasyonu Kilitli</strong>
        <p style="font-size:0.8rem; color:var(--text-muted); max-width:420px; line-height:1.4">Mevcut ilerleme haritanıza ve yıldız oranlarınıza göre tahmini net ve Türkiye başarı sırası simülasyonunu açmak için VIP üye olun.</p>
        <button class="btn-primary" style="font-size:0.8rem; padding:0.5rem 1.25rem; margin-top:0.25rem" onclick="openPremiumModal()">👑 VIP Simülasyonu Aç</button>
      </div>
    `;
    return;
  }

  // Predictive calculations
  const totalTopics = stats.total || 100;
  const doneTopics = stats.done || 0;
  const estimatedNet = Math.round((doneTopics / totalTopics) * 110 * 10) / 10;
  
  let rankingBand = "";
  if (estimatedNet > 90) rankingBand = "İlk 5.000 - 15.000";
  else if (estimatedNet > 70) rankingBand = "İlk 15.000 - 40.000";
  else if (estimatedNet > 50) rankingBand = "İlk 40.000 - 90.000";
  else rankingBand = "İlk 90.000 - 180.000";

  container.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; padding:0.5rem 0">
      <div style="background:var(--bg-hover); padding:1rem; border-radius:12px; border:1px solid var(--border-color); text-align:center">
        <span style="font-size:0.725rem; color:var(--text-muted); font-weight:600">TAHMİNİ BAŞARI NETİ</span>
        <h4 style="font-family:'Outfit',sans-serif; font-size:1.6rem; font-weight:800; color:var(--accent); margin-top:4px">${estimatedNet} <span style="font-size:0.8rem">Net</span></h4>
      </div>

      <div style="background:var(--bg-hover); padding:1rem; border-radius:12px; border:1px solid var(--border-color); text-align:center">
        <span style="font-size:0.725rem; color:var(--text-muted); font-weight:600">ÖNGÖRÜLEN DERECE ARALIĞI</span>
        <h4 style="font-family:'Outfit',sans-serif; font-size:1.15rem; font-weight:800; color:var(--status-success-text); margin-top:8px">${rankingBand}</h4>
      </div>

      <div style="background:var(--bg-hover); padding:1rem; border-radius:12px; border:1px solid var(--border-color); text-align:center">
        <span style="font-size:0.725rem; color:var(--text-muted); font-weight:600">DÜZENLİ ÇALIŞMA ENDEKSİ</span>
        <h4 style="font-family:'Outfit',sans-serif; font-size:1.6rem; font-weight:800; color:#f59e0b; margin-top:4px">%94 <span style="font-size:0.8rem">Yüksek</span></h4>
      </div>
    </div>
  `;
}

// 3. Export Active Note (Text File Download)
function exportActiveNote() {
  if (!isUserPremium()) {
    openPremiumModal();
    showToast("🔒 Not indirme özelliği sadece VIP üyeler içindir.", "warning");
    return;
  }

  if (!activeNoteId) {
    showToast("⚠️ İndirilecek aktif not seçilmedi.", "warning");
    return;
  }

  const note = notesList.find(n => n.id === activeNoteId);
  if (!note) return;

  const content = `=========================================
STUDY TEACH DERS NOTU: ${note.title || 'Başlıksız Not'}
Tarih: ${note.date}
=========================================\n\n${note.content || ''}\n\n-----------------------------------------
Study Teach Multi-Exam Prep Platform
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(note.title || 'not').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("📄 Not metin dosyası olarak indirildi!");
}

// 4. Render Profile Premium Status Card
function renderProfilePremiumStatus() {
  const container = document.getElementById("profile-premium-status-box");
  if (!container) return;

  const isPrem = isUserPremium();

  if (isPrem) {
    container.innerHTML = `
      <div style="background:linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%); border:1px solid #10b981; padding:1rem; border-radius:14px; text-align:center">
        <h4 style="font-size:0.95rem; font-weight:700; color:#10b981; display:flex; align-items:center; justify-content:center; gap:0.4rem">👑 VIP Plan Üyeliği Aktif</h4>
        <p style="font-size:0.775rem; color:var(--text-secondary); margin:4px 0 10px 0">3 Özel VIP Tema ve Kişisel Tema Editör Erişimi Mevcut.</p>
        <span style="font-size:0.7rem; font-weight:700; color:var(--text-muted)">Abonelik Durumu: Süresiz Aktif</span>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="background:var(--bg-hover); border:1px solid var(--border-color); padding:1rem; border-radius:14px; text-align:center">
        <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); display:flex; align-items:center; justify-content:center; gap:0.4rem">⭐ Üyelik Tipi: Standart</h4>
        <p style="font-size:0.775rem; color:var(--text-muted); margin:4px 0 10px 0">Özel VIP Temalar ve Görünüm Tasarımcısı için yükseltin.</p>
        <button class="btn-primary" style="font-size:0.8rem; padding:0.45rem 1rem; width:100%" onclick="openPremiumModal()">👑 VIP Plan'a Yükselt</button>
      </div>
    `;
  }
}

// 5. Site Settings UI Handlers (Profil & Ayarlar Page)
function loadSiteSettingsToUI() {
  const fontSel = document.getElementById("setting-font-family");
  const cardSel = document.getElementById("setting-card-style");
  const sizeSel = document.getElementById("setting-font-size");
  const themeSel = document.getElementById("setting-theme");
  const animSel = document.getElementById("setting-anim-speed");
  const borderSel = document.getElementById("setting-border-width");
  const lineSel = document.getElementById("setting-line-height");
  const soundSel = document.getElementById("setting-sound-enabled");

  if (fontSel) fontSel.value = localStorage.getItem("studyteach_font_family") || "Inter";
  if (cardSel) cardSel.value = localStorage.getItem("studyteach_card_style") || "modern";
  if (sizeSel) sizeSel.value = localStorage.getItem("studyteach_font_size") || "normal";
  if (animSel) animSel.value = localStorage.getItem("studyteach_anim_speed") || "normal";
  if (borderSel) borderSel.value = localStorage.getItem("studyteach_border_width") || "thin";
  if (lineSel) lineSel.value = localStorage.getItem("studyteach_line_height") || "normal";
  if (soundSel) soundSel.value = localStorage.getItem("studyteach_sound_enabled") || "false";

  const savedTheme = localStorage.getItem("studyteach_theme") || localStorage.getItem("studytrack_theme") || "light";
  if (themeSel) themeSel.value = savedTheme;

  const customControls = document.getElementById("custom-theme-controls");
  if (customControls) {
    customControls.style.display = (savedTheme === "custom") ? "block" : "none";
  }

  // Load color pickers if custom
  const cAccent = document.getElementById("custom-color-accent");
  const cBg = document.getElementById("custom-color-bg");
  const cCard = document.getElementById("custom-color-card");
  const cText = document.getElementById("custom-color-text");

  if (cAccent) cAccent.value = localStorage.getItem("studyteach_custom_accent") || "#8b5cf6";
  if (cBg) cBg.value = localStorage.getItem("studyteach_custom_bg") || "#0f172a";
  if (cCard) cCard.value = localStorage.getItem("studyteach_custom_card") || "#1e293b";
  if (cText) cText.value = localStorage.getItem("studyteach_custom_text") || "#f8fafc";
}

function saveSiteSettingsFromUI() {
  const fontSel = document.getElementById("setting-font-family");
  const cardSel = document.getElementById("setting-card-style");
  const sizeSel = document.getElementById("setting-font-size");
  const animSel = document.getElementById("setting-anim-speed");
  const borderSel = document.getElementById("setting-border-width");
  const lineSel = document.getElementById("setting-line-height");
  const soundSel = document.getElementById("setting-sound-enabled");

  if (fontSel) localStorage.setItem("studyteach_font_family", fontSel.value);
  if (cardSel) localStorage.setItem("studyteach_card_style", cardSel.value);
  if (sizeSel) localStorage.setItem("studyteach_font_size", sizeSel.value);
  if (animSel) localStorage.setItem("studyteach_anim_speed", animSel.value);
  if (borderSel) localStorage.setItem("studyteach_border_width", borderSel.value);
  if (lineSel) localStorage.setItem("studyteach_line_height", lineSel.value);
  if (soundSel) localStorage.setItem("studyteach_sound_enabled", soundSel.value);

  applySavedSiteSettings();
  showToast("⚙️ Site ayarları güncellendi ve uygulandı!");
}

function handleThemeSelectChange(themeVal) {
  const vipThemes = ["sunset", "ocean", "cyber", "custom"];
  if (vipThemes.includes(themeVal) && !isUserPremium()) {
    openPremiumModal();
    showToast("🔒 Bu özel VIP temayı seçmek için VIP Plan'a geçmelisiniz.", "warning");
    const themeSel = document.getElementById("setting-theme");
    if (themeSel) themeSel.value = localStorage.getItem("studyteach_theme") || "light";
    return;
  }

  localStorage.setItem("studyteach_theme", themeVal);
  localStorage.setItem("studytrack_theme", themeVal);

  const customControls = document.getElementById("custom-theme-controls");
  if (customControls) {
    customControls.style.display = (themeVal === "custom") ? "block" : "none";
  }

  applySavedSiteSettings();
  showToast(`🎨 Tema güncellendi: ${themeVal}`);
}

function saveCustomThemeColors() {
  if (!isUserPremium()) {
    openPremiumModal();
    return;
  }

  const cAccent = document.getElementById("custom-color-accent")?.value || "#8b5cf6";
  const cBg = document.getElementById("custom-color-bg")?.value || "#0f172a";
  const cCard = document.getElementById("custom-color-card")?.value || "#1e293b";
  const cText = document.getElementById("custom-color-text")?.value || "#f8fafc";

  localStorage.setItem("studyteach_custom_accent", cAccent);
  localStorage.setItem("studyteach_custom_bg", cBg);
  localStorage.setItem("studyteach_custom_card", cCard);
  localStorage.setItem("studyteach_custom_text", cText);

  applySavedSiteSettings();
  showToast("🎨 Özel renk paletiniz uygulandı!");
}
