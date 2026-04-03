// ================= AGE =================
const dob = new Date(document.getElementById("dob").innerText);
const today = new Date();

let age = today.getFullYear() - dob.getFullYear();
const m = today.getMonth() - dob.getMonth();

if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
  age--;
}

document.getElementById("age").innerText = `${age} yrs`;


// ================= TABS =================
function showTab(tab, el) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");

  document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));
  el.classList.add("active");
}


// ================= MODAL BASE =================
const modal = document.getElementById("modal");
const content = document.getElementById("modalContent");

function closeModal() {
  const video = content.querySelector("video");
  if (video) {
    video.pause();
    video.currentTime = 0;
  }

  content.innerHTML = "";
  modal.style.display = "none";
}

// click outside to close
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});


// ================= MODAL WITH INFO =================
function openModalWithInfo(src, caption = "") {
  content.innerHTML = "";

  if (src.includes(".mp4")) {
    content.innerHTML = `<video id="popupVideo" src="${src}" autoplay controls playsinline></video>`;
  } else {
    content.innerHTML = `<img src="${src}">`;
  }

  // Info button
  const infoBtn = document.createElement("div");
  infoBtn.className = "modal-info-btn";
  infoBtn.innerText = "i";

  const captionDiv = document.createElement("div");
  captionDiv.className = "modal-caption";
  captionDiv.innerText = caption;

  content.appendChild(infoBtn);
  content.appendChild(captionDiv);

  infoBtn.onclick = (e) => {
    e.stopPropagation();
    captionDiv.style.display =
      captionDiv.style.display === "block" ? "none" : "block";
  };

  modal.style.display = "block";

  // autoplay fix
  const video = document.getElementById("popupVideo");
  if (video) {
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play();
    });
  }
}


// ================= IMAGE SLIDER =================
let currentIndex = 0;
let images = [];

// dynamic loader (important fix)
function getImagesFromBox(box) {
  const imgs = box.querySelectorAll("#hiddenImages img");
  return Array.from(imgs).map(img => img.src);
}

function openImageSliderFromElement(el, startIndex = 0) {
  images = getImagesFromBox(el);
  currentIndex = startIndex;

  const title = el.dataset.title || "";
  const desc = el.dataset.desc || "";
  const url = el.dataset.url || "";

  renderSlider(title, desc, url);
  modal.style.display = "block";
}

function renderSlider(title = "", desc = "", url = "") {
  content.innerHTML = `
    <div class="modal-slider">

      <h3 class="modal-title">${title}</h3>

      <img id="modalMainImg" src="${images[currentIndex]}">

      <p class="modal-desc">${desc}</p>

      ${url ? `<a href="${url}" target="_blank" class="model-link"><i class="fa-solid fa-up-right-from-square"></i> View Model</a>` : ""}

      <div class="modal-thumbs">
        ${images.map((img, i) =>
          `<img src="${img}" onclick="changeModalImage(${i})"
          class="${i === currentIndex ? "active" : ""}">`
        ).join("")}
      </div>

    </div>
  `;

  initZoom();
  initSwipe();
}

function changeModalImage(index) {
  currentIndex = index;
  updateSlider();
}

function updateSlider() {
  const modalImg = document.getElementById("modalMainImg");
  const thumbs = document.querySelectorAll(".modal-thumbs img");

  modalImg.src = images[currentIndex];

  thumbs.forEach((img, i) => {
    img.classList.toggle("active", i === currentIndex);
  });
}


// ================= SWIPE =================
function initSwipe() {
  const modalImg = document.getElementById("modalMainImg");
  let startX = 0;

  modalImg.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  modalImg.addEventListener("touchend", e => {
    let diff = startX - e.changedTouches[0].clientX;

    if (diff > 50) currentIndex = (currentIndex + 1) % images.length;
    else if (diff < -50) currentIndex = (currentIndex - 1 + images.length) % images.length;

    updateSlider();
  });
}


// ================= PINCH ZOOM (🔥 ADVANCED) =================
function initZoom() {
  const img = document.getElementById("modalMainImg");

  let scale = 1;
  let startDist = 0;

  img.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      startDist = getDistance(e.touches);
    }
  });

  img.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      let newDist = getDistance(e.touches);
      let zoom = newDist / startDist;

      scale = Math.min(Math.max(1, zoom), 3); // limit zoom
      img.style.transform = `scale(${scale})`;
    }
  });

  img.addEventListener("touchend", () => {
    if (scale < 1.1) {
      img.style.transform = "scale(1)";
      scale = 1;
    }
  });
}

function getDistance(touches) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
}

// OPEN WEBSITE
function openProject(url) {
  window.open(url, "_blank");
}

// DOWNLOAD APP
function downloadApp(file) {
  window.location.href = file;
}

let igIndex = 0;
let igSlides = document.querySelectorAll(".ig-slide");
let igInterval;

// SHOW SLIDE
function showIGSlide(index) {
  igSlides.forEach(slide => slide.classList.remove("active"));
  igSlides[index].classList.add("active");
}

// NEXT
function igNext() {
  igIndex = (igIndex + 1) % igSlides.length;
  showIGSlide(igIndex);
  resetAutoSlide();
}

// PREV
function igPrev() {
  igIndex = (igIndex - 1 + igSlides.length) % igSlides.length;
  showIGSlide(igIndex);
  resetAutoSlide();
}

// AUTO SLIDE START
function startAutoSlide() {
  igInterval = setInterval(() => {
    igNext();
  }, 3000); // change speed (3000 = 3 sec)
}

// RESET TIMER AFTER CLICK
function resetAutoSlide() {
  clearInterval(igInterval);
  startAutoSlide();
}

// START ON LOAD
window.addEventListener("load", () => {
  igSlides = document.querySelectorAll(".ig-slide");
  showIGSlide(igIndex);
  startAutoSlide();
});

