// ===================== EMAILJS INITIALIZATION =====================
(function() {
  emailjs.init({
    publicKey: "k0zULqG8DbDVDF8rJ",   // Your public key
  });
})();

// ===================== 1. TYPING ANIMATION =====================
const roles = [
  "Business Systems Engineer",
  "Java Developer",
  "Web Creator",
  "Snooker Strategist",
  "Problem Solver"
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedRoleSpan = document.getElementById("typed-role");

function typeEffect() {
  if (!typedRoleSpan) return;
  const currentRole = roles[roleIndex];
  if (isDeleting) {
    typedRoleSpan.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedRoleSpan.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }
  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    setTimeout(typeEffect, 2000);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeEffect, 500);
    return;
  }
  const speed = isDeleting ? 50 : 100;
  setTimeout(typeEffect, speed);
}
if (typedRoleSpan) typeEffect();

// ===================== 2. DARK/LIGHT MODE TOGGLE =====================
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-theme", currentTheme);
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    let theme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeToggle.innerHTML = theme === "dark" ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  });
  themeToggle.innerHTML = currentTheme === "dark" ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// ===================== 3. PROJECT VISIT COUNTERS =====================
function initVisitCounters() {
  document.querySelectorAll(".project-link").forEach(link => {
    const projectId = link.getAttribute("data-project-id");
    if (!projectId) return;
    const stored = localStorage.getItem(`visit_${projectId}`);
    const parentCard = link.closest(".card");
    const counterSpan = parentCard?.querySelector(".counter-value");
    if (stored && counterSpan) counterSpan.textContent = stored;
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("data-project-id");
      let count = parseInt(localStorage.getItem(`visit_${id}`) || "0");
      count++;
      localStorage.setItem(`visit_${id}`, count);
      const card = link.closest(".card");
      const span = card?.querySelector(".counter-value");
      if (span) span.textContent = count;
    });
  });
}
initVisitCounters();

// ===================== 4. GITHUB STATS WIDGET =====================
async function fetchGitHubRepos() {
  const repoCountSpan = document.getElementById("github-repo-count");
  if (!repoCountSpan) return;
  const username = "thatodesmond"; // 🔁 CHANGE TO YOUR REAL GITHUB USERNAME
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (response.ok) {
      const data = await response.json();
      repoCountSpan.textContent = data.public_repos ?? "?";
    } else {
      repoCountSpan.textContent = "?";
    }
  } catch {
    repoCountSpan.textContent = "?";
  }
}
fetchGitHubRepos();

// ===================== 5. TOAST NOTIFICATION =====================
function showToast(message, duration = 3000) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast hidden";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, duration);
}

// ===================== EMAILJS CONTACT FORM HANDLER =====================
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const submitBtn = document.getElementById("contact-submit");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...';
    submitBtn.disabled = true;

    const templateParams = {
      user_name: document.getElementById("user_name").value,
      user_email: document.getElementById("user_email").value,
      message: document.getElementById("message").value,
      to_name: "Thato Modjadji",
    };

    // Using your actual Service ID and Template ID
    emailjs.send("service_gg2w6gp", "template_ti7vg6m", templateParams)
      .then(function(response) {
        showToast("✓ Message sent successfully! I'll reply within 24h.", 4000);
        contactForm.reset();
        // Optional: log to local display
        const logDiv = document.getElementById("contact-log");
        const entry = document.createElement("div");
        entry.style.background = "#0e1a24";
        entry.style.padding = "10px";
        entry.style.borderRadius = "16px";
        entry.style.marginTop = "8px";
        entry.innerHTML = `<strong><i class="fas fa-check-circle"></i> Message sent to my email</strong>`;
        logDiv.prepend(entry);
      })
      .catch(function(error) {
        console.error("EmailJS error:", error);
        showToast("❌ Failed to send. Please try again later or contact directly via LinkedIn.", 4000);
      })
      .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  });
}

// ===================== OTHER EXISTING FUNCTIONS =====================
function toggleExtraSection(id) {
  const contactSec = document.getElementById('contact');
  const commentSec = document.getElementById('comments');
  if (id === 'contact') {
    contactSec.classList.toggle('hidden-section');
    if (!commentSec.classList.contains('hidden-section')) commentSec.classList.add('hidden-section');
  } else if (id === 'comments') {
    commentSec.classList.toggle('hidden-section');
    if (!contactSec.classList.contains('hidden-section')) contactSec.classList.add('hidden-section');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const contactSec = document.getElementById('contact');
  const commentSec = document.getElementById('comments');
  if (contactSec) contactSec.classList.remove('hidden-section');
  if (commentSec) commentSec.classList.add('hidden-section');
});

let commentCount = 0;
function submitComment(event) {
  event.preventDefault();
  const name = document.getElementById('comment-name').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  if (!name || !text) return;
  const list = document.getElementById('comment-list');
  const countSpan = document.getElementById('comment-count');
  const li = document.createElement('li');
  li.innerHTML = `<i class="fas fa-comment"></i> <strong>${escapeHtml(name)}</strong>: ${escapeHtml(text)}`;
  list.prepend(li);
  commentCount++;
  countSpan.innerText = `📌 Total messages: ${commentCount}`;
  document.getElementById('comment-name').value = '';
  document.getElementById('comment-text').value = '';
}

function openModal(src, title) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const downloadBtn = document.getElementById('modalDownloadBtn');
  modal.style.display = "flex";
  modalImg.src = src;
  downloadBtn.href = src;
  downloadBtn.download = title || "certificate";
}
function closeModal() {
  document.getElementById('imageModal').style.display = "none";
}
window.onclick = function(e) {
  const modal = document.getElementById('imageModal');
  if (e.target === modal) closeModal();
};
function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
if (menuToggle) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
}
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('show'));
});

// Active link highlight
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  const scrollPos = window.scrollY + 150;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// Show contact section when hero button clicked
const showContactBtn = document.getElementById('showContactBtn');
if (showContactBtn) {
  showContactBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const contactSec = document.getElementById('contact');
    const commentSec = document.getElementById('comments');
    if (contactSec.classList.contains('hidden-section')) contactSec.classList.remove('hidden-section');
    if (!commentSec.classList.contains('hidden-section')) commentSec.classList.add('hidden-section');
    contactSec.scrollIntoView({ behavior: 'smooth' });
  });
}