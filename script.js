const STORAGE_KEY = "portfolioDataV3";
const ADMIN_PIN_KEY = "portfolioAdminPinV1";
const ADMIN_UNLOCK_KEY = "portfolioAdminUnlockedV1";

const defaultData = {
  profile: {
    name: "Darmawan Kristiaji",
    role: "Business Data Analyst",
    heroHeadline: "mengubah data menjadi insight dan keputusan bisnis yang berdampak.",
    heroLead:
      "Business Data Analyst dengan pengalaman di dashboarding, CRM analytics, marketing analytics, serta enablement data & AI training.",
    stats: ["MAPCLUB Digital Asia", "RevoU Team Lead (Mentor)", "Python, SQL, BI & AI Automation"],
  },
  about: {
    heading: "Latar belakang profesional",
    description:
      "Saya adalah Business Data Analyst yang berpengalaman membangun dashboard, mengotomasi laporan, dan mendukung pengambilan keputusan bisnis lintas tim. Saya juga aktif sebagai mentor Data & AI, membantu peserta memahami analitik (Excel, SQL, Python, BI) hingga workflow automation (n8n, Zapier, LangChain).",
  },
  contact: {
    email: "darmawankristiaji28@gmail.com",
    social: "LinkedIn",
    phone: "+62 82260204998",
    location: "Tangerang, Banten, Indonesia",
  },
  projects: [
    {
      id: "p1",
      title: "MAPCLUB — Co-Brand Referral Credit Card Dashboard",
      summary:
        "Membangun dashboard program referral kartu kredit co-brand untuk mempermudah monitoring performa dan evaluasi campaign.",
      background:
        "Tim membutuhkan visibilitas data program referral yang lebih cepat dan terstruktur untuk pengambilan keputusan.",
      goal: "Menyediakan monitoring data yang konsisten dan actionable untuk tim campaign dan account manager.",
      tools: "SQL, Tableau/Power BI, CRM, Data Visualization",
      mediaType: "youtube",
      mediaUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    },
    {
      id: "p2",
      title: "MAPCLUB — Paid Ads Reporting Automation",
      summary:
        "Mengotomasi proses laporan paid ads dari Google Analytics dan Meta Business Suite.",
      background:
        "Proses update manual membutuhkan waktu lama dan rawan ketidakkonsistenan data antar channel.",
      goal: "Mengurangi pekerjaan manual dan mempercepat siklus pelaporan marketing.",
      tools: "Google Analytics, Meta Business Suite, SQL, Automation Workflow",
      mediaType: "youtube",
      mediaUrl: "https://www.youtube.com/watch?v=3fumBcKC6RE",
    },
    {
      id: "p3",
      title: "MAPCLUB — CRM Post-Campaign Analysis Dashboard",
      summary:
        "Membangun dashboard analisis pasca campaign dari channel CRM (Insider) untuk evaluasi performa campaign.",
      background:
        "Laporan campaign tersebar dan memakan waktu, sehingga evaluasi strategi sulit dilakukan cepat.",
      goal: "Membuat proses evaluasi lebih efisien dan menurunkan waktu proses manual >70%.",
      tools: "CRM (Insider), Tableau/Power BI, SQL, Business Intelligence",
      mediaType: "youtube",
      mediaUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
      id: "p4",
      title: "PukulEnam.AI — Pet Matchmaking Recommendation System",
      summary:
        "Capstone machine learning untuk membangun sistem rekomendasi adopsi hewan berbasis collaborative & content-based filtering.",
      background:
        "Diperlukan pendekatan data-driven untuk mencocokkan calon adopter dengan hewan secara berkelanjutan.",
      goal: "Menghasilkan sistem rekomendasi yang relevan untuk meningkatkan peluang adopsi yang tepat.",
      tools: "Python, Machine Learning, Recommendation System, t-SNE",
      mediaType: "youtube",
      mediaUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    },
  ],
};

let state = loadData();

const links = document.querySelectorAll('.nav-list a[href^="#"]');
const projectListEl = document.getElementById("projectList");
const projectAdminListEl = document.getElementById("projectAdminList");

const profileForm = document.getElementById("profileForm");
const aboutForm = document.getElementById("aboutForm");
const contactForm = document.getElementById("contactForm");
const projectForm = document.getElementById("projectForm");
const projectCancelBtn = document.getElementById("projectCancelBtn");
const resetDataBtn = document.getElementById("resetDataBtn");
const exportDataBtn = document.getElementById("exportDataBtn");
const importDataBtn = document.getElementById("importDataBtn");
const importDataInput = document.getElementById("importDataInput");
const toastEl = document.getElementById("toast");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const pageMode = document.body.dataset.page || "viewer";

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return JSON.parse(JSON.stringify(defaultData));
  }

  try {
    const parsed = JSON.parse(saved);
    return normalizeState(parsed);
  } catch {
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function normalizeState(data) {
  const normalized = {
    ...defaultData,
    ...data,
    profile: {
      ...defaultData.profile,
      ...(data.profile || {}),
    },
    about: {
      ...defaultData.about,
      ...(data.about || {}),
    },
    contact: {
      ...defaultData.contact,
      ...(data.contact || {}),
    },
    projects: (data.projects || []).map((project) => ({
      ...project,
      mediaType: project.mediaType || "youtube",
      mediaUrl: project.mediaUrl || project.videoUrl || "",
    })),
  };

  return normalized;
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showToast(message) {
  if (!toastEl) {
    return;
  }
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2200);
}

function requestAdminAccess() {
  if (pageMode !== "admin") {
    return true;
  }

  if (sessionStorage.getItem(ADMIN_UNLOCK_KEY) === "true") {
    return true;
  }

  let savedPin = localStorage.getItem(ADMIN_PIN_KEY);

  if (!savedPin) {
    const createdPin = window.prompt("Buat PIN admin baru (minimal 4 karakter):", "");
    if (!createdPin || createdPin.trim().length < 4) {
      window.alert("PIN tidak valid. Anda akan diarahkan ke halaman viewer.");
      window.location.href = "index.html";
      return false;
    }
    localStorage.setItem(ADMIN_PIN_KEY, createdPin.trim());
    savedPin = createdPin.trim();
    window.alert("PIN admin berhasil dibuat. Simpan PIN Anda baik-baik.");
  }

  const attempt = window.prompt("Masukkan PIN admin:", "");
  if (!attempt || attempt.trim() !== savedPin) {
    window.alert("PIN salah. Akses admin ditolak.");
    window.location.href = "index.html";
    return false;
  }

  sessionStorage.setItem(ADMIN_UNLOCK_KEY, "true");
  return true;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toEmbedUrl(url) {
  if (!url) return "";

  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const normalMatch = url.match(/[?&]v=([^&]+)/);
  if (normalMatch) {
    return `https://www.youtube.com/embed/${normalMatch[1]}`;
  }

  return url;
}

function toDriveFilePreviewUrl(url) {
  if (!url) return "";

  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  if (fileMatch) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  const openMatch = url.match(/[?&]id=([^&]+)/);
  if (openMatch) {
    return `https://drive.google.com/file/d/${openMatch[1]}/preview`;
  }

  return url;
}

function toGoogleDocsEmbedUrl(url) {
  if (!url) return "";

  const slideMatch = url.match(/docs\.google\.com\/presentation\/d\/([^/]+)/);
  if (slideMatch) {
    return `https://docs.google.com/presentation/d/${slideMatch[1]}/embed?start=false&loop=false&delayms=3000`;
  }

  const docMatch = url.match(/docs\.google\.com\/document\/d\/([^/]+)/);
  if (docMatch) {
    return `https://docs.google.com/document/d/${docMatch[1]}/preview`;
  }

  const sheetMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([^/]+)/);
  if (sheetMatch) {
    return `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}/preview`;
  }

  return url;
}

function getProjectEmbedUrl(project) {
  const mediaType = project.mediaType || "youtube";
  const mediaUrl = project.mediaUrl || project.videoUrl || "";

  if (mediaType === "youtube") {
    return toEmbedUrl(mediaUrl);
  }

  if (mediaType === "gdrive-video" || mediaType === "gdrive-file") {
    const docsEmbed = toGoogleDocsEmbedUrl(mediaUrl);
    if (docsEmbed !== mediaUrl) {
      return docsEmbed;
    }
    return toDriveFilePreviewUrl(mediaUrl);
  }

  return mediaUrl;
}

function renderProfile() {
  const logoNameEl = document.getElementById("logoName");
  const heroTitleEl = document.getElementById("heroTitle");
  const heroLeadEl = document.getElementById("heroLead");
  const heroStatsEl = document.getElementById("heroStats");

  if (logoNameEl) {
    logoNameEl.textContent = state.profile.name;
  }

  if (heroTitleEl) {
    heroTitleEl.innerHTML = `Saya <span class="highlight">${escapeHtml(
      state.profile.name
    )}</span>,<br />${escapeHtml(state.profile.heroHeadline.replace(`Saya ${state.profile.name},`, "").trim())}`;
  }

  if (heroLeadEl) {
    heroLeadEl.textContent = state.profile.heroLead;
  }

  const statsHtml = state.profile.stats
    .map((stat) => `<li>${escapeHtml(stat)}</li>`)
    .join("");
  if (heroStatsEl) {
    heroStatsEl.innerHTML = statsHtml;
  }
}

function renderAbout() {
  const aboutHeadingEl = document.getElementById("aboutHeading");
  const aboutTextEl = document.getElementById("aboutText");
  if (aboutHeadingEl) {
    aboutHeadingEl.textContent = state.about.heading;
  }
  if (aboutTextEl) {
    aboutTextEl.textContent = state.about.description;
  }
}

function renderContact() {
  const contactEmailEl = document.getElementById("contactEmail");
  const contactSocialEl = document.getElementById("contactSocial");
  const contactPhoneEl = document.getElementById("contactPhone");
  const contactLocationEl = document.getElementById("contactLocation");
  const contactButtonEl = document.getElementById("contactButton");

  if (contactEmailEl) {
    contactEmailEl.textContent = `Email: ${state.contact.email}`;
  }
  if (contactSocialEl) {
    contactSocialEl.textContent = `LinkedIn / Social: ${state.contact.social}`;
  }
  if (contactPhoneEl) {
    contactPhoneEl.textContent = `Telepon: ${state.contact.phone}`;
  }
  if (contactLocationEl) {
    contactLocationEl.textContent = `Lokasi: ${state.contact.location}`;
  }
  if (contactButtonEl) {
    contactButtonEl.href = `mailto:${state.contact.email}`;
  }
}

function renderProjects() {
  if (!projectListEl) {
    return;
  }
  projectListEl.innerHTML = state.projects
    .map(
      (project) => `
      <article class="project-card">
        <div class="project-media">
          <iframe
            src="${escapeHtml(getProjectEmbedUrl(project))}"
            title="${escapeHtml(project.title)}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="project-content">
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.summary)}</p>
          <dl class="project-meta">
            <div>
              <dt>Background</dt>
              <dd>${escapeHtml(project.background)}</dd>
            </div>
            <div>
              <dt>Tujuan</dt>
              <dd>${escapeHtml(project.goal)}</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>${escapeHtml(project.tools)}</dd>
            </div>
          </dl>
        </div>
      </article>
    `
    )
    .join("");
}

function renderProjectAdminList() {
  if (!projectAdminListEl) {
    return;
  }
  projectAdminListEl.innerHTML = state.projects
    .map(
      (project) => `
      <article class="project-admin-item">
        <div>
          <h4>${escapeHtml(project.title)}</h4>
          <p>${escapeHtml(project.tools)} • ${escapeHtml(project.mediaType || "youtube")}</p>
        </div>
        <div class="project-admin-actions">
          <button class="btn btn-ghost project-edit-btn" data-id="${escapeHtml(project.id)}" type="button">Edit</button>
          <button class="btn btn-ghost project-delete-btn" data-id="${escapeHtml(project.id)}" type="button">Hapus</button>
        </div>
      </article>
    `
    )
    .join("");
}

function fillForms() {
  if (!profileForm || !aboutForm || !contactForm) {
    return;
  }
  profileForm.name.value = state.profile.name;
  profileForm.role.value = state.profile.role;
  profileForm.heroHeadline.value = state.profile.heroHeadline;
  profileForm.heroLead.value = state.profile.heroLead;
  profileForm.stat1.value = state.profile.stats[0] || "";
  profileForm.stat2.value = state.profile.stats[1] || "";
  profileForm.stat3.value = state.profile.stats[2] || "";

  aboutForm.heading.value = state.about.heading;
  aboutForm.description.value = state.about.description;

  contactForm.email.value = state.contact.email;
  contactForm.social.value = state.contact.social;
  contactForm.phone.value = state.contact.phone;
  contactForm.location.value = state.contact.location;
}

function resetProjectForm() {
  if (!projectForm) {
    return;
  }
  projectForm.reset();
  projectForm.id.value = "";
}

function renderAll() {
  renderProfile();
  renderAbout();
  renderContact();
  renderProjects();
  renderProjectAdminList();
  fillForms();
}

if (profileForm) {
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.profile = {
      name: profileForm.name.value.trim(),
      role: profileForm.role.value.trim(),
      heroHeadline: profileForm.heroHeadline.value.trim(),
      heroLead: profileForm.heroLead.value.trim(),
      stats: [
        profileForm.stat1.value.trim(),
        profileForm.stat2.value.trim(),
        profileForm.stat3.value.trim(),
      ],
    };
    saveData();
    renderAll();
    showToast("Profil berhasil diperbarui");
  });
}

if (aboutForm) {
  aboutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.about = {
      heading: aboutForm.heading.value.trim(),
      description: aboutForm.description.value.trim(),
    };
    saveData();
    renderAll();
    showToast("Bagian Tentang berhasil diperbarui");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.contact = {
      email: contactForm.email.value.trim(),
      social: contactForm.social.value.trim(),
      phone: contactForm.phone.value.trim(),
      location: contactForm.location.value.trim(),
    };
    saveData();
    renderAll();
    showToast("Kontak berhasil diperbarui");
  });
}

if (projectForm) {
  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const id = projectForm.id.value.trim();
    const payload = {
      id: id || `p${Date.now()}`,
      title: projectForm.title.value.trim(),
      summary: projectForm.summary.value.trim(),
      background: projectForm.background.value.trim(),
      goal: projectForm.goal.value.trim(),
      tools: projectForm.tools.value.trim(),
      mediaType: projectForm.mediaType.value,
      mediaUrl: projectForm.mediaUrl.value.trim(),
    };

    if (id) {
      state.projects = state.projects.map((project) => (project.id === id ? payload : project));
    } else {
      state.projects.unshift(payload);
    }

    saveData();
    renderProjects();
    renderProjectAdminList();
    resetProjectForm();
    showToast(id ? "Project berhasil diperbarui" : "Project berhasil ditambahkan");
  });
}

if (projectAdminListEl && projectForm) {
  projectAdminListEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const id = target.dataset.id;
    if (!id) {
      return;
    }

    if (target.classList.contains("project-edit-btn")) {
      const selected = state.projects.find((project) => project.id === id);
      if (!selected) {
        return;
      }

      projectForm.id.value = selected.id;
      projectForm.title.value = selected.title;
      projectForm.summary.value = selected.summary;
      projectForm.background.value = selected.background;
      projectForm.goal.value = selected.goal;
      projectForm.tools.value = selected.tools;
      projectForm.mediaType.value = selected.mediaType || "youtube";
      projectForm.mediaUrl.value = selected.mediaUrl || selected.videoUrl || "";
      projectForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    if (target.classList.contains("project-delete-btn")) {
      const proceed = window.confirm("Hapus project ini?");
      if (!proceed) {
        return;
      }
      state.projects = state.projects.filter((project) => project.id !== id);
      saveData();
      renderProjects();
      renderProjectAdminList();
      if (projectForm.id.value === id) {
        resetProjectForm();
      }
      showToast("Project berhasil dihapus");
    }
  });
}

if (projectCancelBtn) {
  projectCancelBtn.addEventListener("click", () => {
    resetProjectForm();
    showToast("Edit project dibatalkan");
  });
}

if (resetDataBtn) {
  resetDataBtn.addEventListener("click", () => {
    const proceed = window.confirm("Reset semua data ke default?");
    if (!proceed) {
      return;
    }
    state = JSON.parse(JSON.stringify(defaultData));
    saveData();
    renderAll();
    resetProjectForm();
    showToast("Data berhasil di-reset ke default");
  });
}

if (exportDataBtn) {
  exportDataBtn.addEventListener("click", () => {
    const payload = JSON.stringify(state, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "portfolio-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("Data berhasil diexport");
  });
}

if (importDataBtn && importDataInput) {
  importDataBtn.addEventListener("click", () => {
    importDataInput.click();
  });
}

if (importDataInput) {
  importDataInput.addEventListener("change", async () => {
    const file = importDataInput.files?.[0];
    if (!file) {
      return;
    }

    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      state = normalizeState(parsed);
      saveData();
      renderAll();
      resetProjectForm();
      showToast("Data berhasil diimport");
    } catch {
      showToast("Import gagal: file JSON tidak valid");
    } finally {
      importDataInput.value = "";
    }
  });
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(ADMIN_UNLOCK_KEY);
    window.location.href = "index.html";
  });
}

if (requestAdminAccess()) {
  renderAll();
}
