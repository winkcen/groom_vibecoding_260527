// ==========================================================================
// 1. Meme Templates & Random Captions Data
// ==========================================================================
const memeTemplates = [
  {
    name: "Drake Hotline Bling",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    top: "코딩 공부 3시간째 자료 검색만 함",
    bottom: "선 코드 작성 후 버그 때려잡기"
  },
  {
    name: "Distracted Boyfriend",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    top: "새로 나온 신기술 프레임워크",
    bottom: "작동은 하는 낡은 코드"
  },
  {
    name: "Success Kid",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
    top: "콘솔 에러 13개 떴는데",
    bottom: "새로고침 하니 그냥 됨"
  },
  {
    name: "Two Buttons (Decision)",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    top: "주석 다 지우고 넘기기",
    bottom: "주석에 미래의 나에게 반성문 쓰기"
  },
  {
    name: "Futurama Fry (Shut Up and Take My Money)",
    url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop",
    top: "이거 버그 아니고",
    bottom: "원래 의도된 이스터에그인데요?"
  },
  {
    name: "Change My Mind",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
    top: "코딩 공부는 눈으로 하는 게 아님",
    bottom: "진짜임. 타이핑 쳐봐야 늚."
  },
  {
    name: "Angry Cat (Grumpy Cat)",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop",
    top: "서버가 다운되었다고?",
    bottom: "난 코드를 건드린 적이 없다."
  }
];

// ==========================================================================
// 2. Application State Variables
// ==========================================================================
let currentTemplateIndex = 0;
let isDragging = false;
let activeTextElement = null;

// Drag coordinates helper
let dragStartPercentX = 50;
let dragStartPercentY = 10;

// DOM Elements
const memePreviewArea = document.getElementById('meme-preview-area');
const memeImage = document.getElementById('meme-image');

const textTop = document.getElementById('text-top');
const textBottom = document.getElementById('text-bottom');

const inputTopText = document.getElementById('input-top-text');
const inputBottomText = document.getElementById('input-bottom-text');

const sliderTopSize = document.getElementById('slider-top-size');
const sliderTopY = document.getElementById('slider-top-y');
const sliderBottomSize = document.getElementById('slider-bottom-size');
const sliderBottomY = document.getElementById('slider-bottom-y');

const valTopSize = document.getElementById('val-top-size');
const valTopY = document.getElementById('val-top-y');
const valBottomSize = document.getElementById('val-bottom-size');
const valBottomY = document.getElementById('val-bottom-y');

const colorPicker = document.getElementById('color-picker');
const colorHex = document.getElementById('color-hex');

const btnRandom = document.getElementById('btn-random');
const btnDownload = document.getElementById('btn-download');
const inputFile = document.getElementById('input-file');

const cssCodeDisplay = document.getElementById('css-code-display');
const toastContainer = document.getElementById('toast-container');

// ==========================================================================
// 3. UI Synchronization & Render
// ==========================================================================

// Update UI and styling values
function updateTextStyles() {
  const topSize = sliderTopSize.value;
  const topY = sliderTopY.value;
  const bottomSize = sliderBottomSize.value;
  const bottomY = sliderBottomY.value;
  const textColor = colorPicker.value;

  // Apply to top text style
  textTop.style.fontSize = `${topSize}rem`;
  textTop.style.top = `${topY}%`;
  textTop.style.color = textColor;

  // Apply to bottom text style
  textBottom.style.fontSize = `${bottomSize}rem`;
  textBottom.style.bottom = `${bottomY}%`;
  textBottom.style.color = textColor;

  // Update slider numeric text labels
  valTopSize.textContent = `${topSize}rem`;
  valTopY.textContent = `${topY}%`;
  valBottomSize.textContent = `${bottomSize}rem`;
  valBottomY.textContent = `${bottomY}%`;
  colorHex.textContent = textColor.toUpperCase();

  // Draw Code Box Inspector
  renderCssCodeDebugger();
}

// Generate Live Educational CSS Code Block
function renderCssCodeDebugger() {
  const topPctX = textTop.style.left || "50%";
  const bottomPctX = textBottom.style.left || "50%";

  cssCodeDisplay.innerHTML = `/* 부모 컨테이너: absolute 자식들의 기준이 됨 */
.meme-preview-area {
  position: relative;
  overflow: hidden;
}

/* 상단 텍스트 */
.top-text {
  position: absolute;
  top: <span class="css-val">${sliderTopY.value}%</span>;
  left: <span class="css-val">${topPctX}</span>;
  transform: translateX(-50%); /* 가로 정중앙 정렬 */
  font-size: <span class="css-val">${sliderTopSize.value}rem</span>;
  color: <span class="css-val">${colorPicker.value}</span>;
}

/* 하단 텍스트 */
.bottom-text {
  position: absolute;
  bottom: <span class="css-val">${sliderBottomY.value}%</span>;
  left: <span class="css-val">${bottomPctX}</span>;
  transform: translateX(-50%); /* 가로 정중앙 정렬 */
  font-size: <span class="css-val">${sliderBottomSize.value}rem</span>;
  color: <span class="css-val">${colorPicker.value}</span>;
}`;
}

// Load a specific meme template
function loadTemplate(template) {
  // Safe CORS attributes configuration for local capture
  memeImage.removeAttribute('crossorigin');
  if (template.url.includes('unsplash.com')) {
    memeImage.setAttribute('crossorigin', 'anonymous');
  }
  
  memeImage.src = template.url;
  
  // Update inputs
  inputTopText.value = template.top;
  inputBottomText.value = template.bottom;
  
  // Reset texts
  textTop.textContent = template.top;
  textBottom.textContent = template.bottom;

  // Reset text horizontal positions (absolute 50% left)
  textTop.style.left = '50%';
  textBottom.style.left = '50%';

  // Trigger Style Synced Recalculation
  updateTextStyles();
}

function loadRandomTemplate() {
  let nextIndex;
  do {
    nextIndex = Math.floor(Math.random() * memeTemplates.length);
  } while (nextIndex === currentTemplateIndex && memeTemplates.length > 1);
  
  currentTemplateIndex = nextIndex;
  loadTemplate(memeTemplates[currentTemplateIndex]);
  showToast("새로운 랜덤 밈 템플릿과 문구가 매칭되었습니다!", "success");
}

// ==========================================================================
// 4. Interactive Drag & Drop Position System (CSS absolute manipulation)
// ==========================================================================
function initDragEvents() {
  const elements = [textTop, textBottom];
  
  elements.forEach(element => {
    // Desktop Mouse Events
    element.addEventListener('mousedown', startDrag);
    // Mobile Touch Events
    element.addEventListener('touchstart', startDrag, { passive: false });
  });

  // Global Workspace Listeners (Tracking moves while holding click)
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('touchmove', dragMove, { passive: false });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);
}

function startDrag(e) {
  e.preventDefault();
  isDragging = true;
  activeTextElement = e.currentTarget;
  activeTextElement.classList.add('dragging');
  showToast("글자를 잡았습니다! 마우스나 터치로 위치를 옮기세요.", "info");
}

function dragMove(e) {
  if (!isDragging || !activeTextElement) return;
  e.preventDefault();

  // Get Client coordinates (handling touch differences)
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  // Calculate parent bounding box
  const parentRect = memePreviewArea.getBoundingClientRect();

  // Map coordinates into relative percentage points of the parent container
  let percentX = ((clientX - parentRect.left) / parentRect.width) * 100;
  let percentY = ((clientY - parentRect.top) / parentRect.height) * 100;

  // Keep within bounds safety checks (0% ~ 100%)
  percentX = Math.max(0, Math.min(100, percentX));
  percentY = Math.max(0, Math.min(100, percentY));

  // Update element horizontal position (left)
  activeTextElement.style.left = `${percentX.toFixed(0)}%`;

  // Update vertical position based on Top vs Bottom absolute direction
  if (activeTextElement.id === 'text-top') {
    // update top style & slider
    const valY = Math.round(percentY);
    sliderTopY.value = valY;
  } else {
    // update bottom style & slider (which goes inverse from the bottom edge)
    const valY = Math.round(100 - percentY);
    sliderBottomY.value = valY;
  }

  // Update layout and synchronize styles
  updateTextStyles();
}

function endDrag() {
  if (isDragging && activeTextElement) {
    activeTextElement.classList.remove('dragging');
    isDragging = false;
    activeTextElement = null;
  }
}

// ==========================================================================
// 5. Image Render Capturing & Download (html2canvas)
// ==========================================================================
function downloadMeme() {
  showToast("이미지를 변환하여 다운로드를 준비하는 중입니다...", "info");
  
  // Temporary remove outlines/hovers to print clean images
  textTop.classList.remove('dragging');
  textBottom.classList.remove('dragging');

  // Trigger html2canvas snapshot of the container DOM
  html2canvas(memePreviewArea, {
    useCORS: true,           // Allow remote images loading
    allowTaint: false,
    backgroundColor: null,   // Transparent bg if needed
    scale: 2                 // double size output resolution
  }).then(canvas => {
    // Create download link element
    const link = document.createElement('a');
    link.download = `groom-meme-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // Simulate Click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("밈이 성공적으로 다운로드 되었습니다!", "success");
  }).catch(err => {
    console.error("Meme download error:", err);
    showToast("다운로드 중 오류가 발생했습니다. 원격 서버 이미지 보안 제약일 수 있습니다.", "info");
  });
}

// ==========================================================================
// 6. User Custom Image Loader
// ==========================================================================
function handleCustomImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    memeImage.src = event.target.result;
    showToast("사용자 지정 이미지가 업로드 되었습니다. 텍스트를 배치해보세요!", "success");
  };
  reader.readAsDataURL(file);
}

// ==========================================================================
// 7. Toast Notifications
// ==========================================================================
function showToast(message, type = 'success') {
  // Limit to single toast on screen to avoid overlay spamming during drag
  const existingToasts = toastContainer.querySelectorAll('.toast');
  if (existingToasts.length > 0 && type === 'info') return; // skip drag logs duplicate

  const toast = document.createElement('div');
  toast.className = `toast`;
  
  const iconName = type === 'success' ? 'check-circle' : 'info';
  const iconClass = type === 'success' ? 'toast-icon success' : 'toast-icon info';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="${iconClass}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 2500);
}

// ==========================================================================
// 8. Event Listeners Setup & Initialization
// ==========================================================================
function setupEventListeners() {
  // Sync inputs
  inputTopText.addEventListener('input', (e) => {
    textTop.textContent = e.target.value;
  });
  inputBottomText.addEventListener('input', (e) => {
    textBottom.textContent = e.target.value;
  });

  // Sync sliders
  sliderTopSize.addEventListener('input', updateTextStyles);
  sliderTopY.addEventListener('input', updateTextStyles);
  sliderBottomSize.addEventListener('input', updateTextStyles);
  sliderBottomY.addEventListener('input', updateTextStyles);
  
  // Sync color picker
  colorPicker.addEventListener('input', updateTextStyles);

  // Buttons triggers
  btnRandom.addEventListener('click', loadRandomTemplate);
  btnDownload.addEventListener('click', downloadMeme);
  inputFile.addEventListener('change', handleCustomImageUpload);
}

function initApp() {
  setupEventListeners();
  initDragEvents();
  
  // Load first default template
  loadTemplate(memeTemplates[currentTemplateIndex]);
}

// Launch
initApp();
