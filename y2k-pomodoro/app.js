// ==========================================================================
// 1. Timer State & Configuration
// ==========================================================================
let focusTime = 20 * 60; // 20 minutes default
let breakTime = 5 * 60;  // 5 minutes

let timerId = null;
let timeLeft = focusTime;
let isRunning = false;
let currentMode = 'focus'; // 'focus' or 'break'

// Saved stickers state (load from localStorage)
let placedStickers = JSON.parse(localStorage.getItem('pomo_stickers')) || [];

// Audio Context (Web Audio API)
let audioCtx = null;

// DOM Elements
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const tickerEl = document.getElementById('lcd-ticker');

const indicatorFocus = document.getElementById('indicator-focus');
const indicatorBreak = document.getElementById('indicator-break');
const alarmBell = document.getElementById('alarm-bell');

const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnReset = document.getElementById('btn-reset');

const btnModeFocus20 = document.getElementById('btn-mode-focus-20');
const btnModeFocus40 = document.getElementById('btn-mode-focus-40');
const btnModeFocus60 = document.getElementById('btn-mode-focus-60');
const btnModeBreak = document.getElementById('btn-mode-break');

const y2kDevice = document.getElementById('y2k-device');
const stickersContainer = document.getElementById('stickers-container');
const btnClearStickers = document.getElementById('btn-clear-stickers');

// ==========================================================================
// 2. Web Audio API Retro Sound Synthesizer
// ==========================================================================
function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// 8-bit Device Button Click Beep Sound
function playBeep(frequency = 1000, duration = 0.06, type = 'sine') {
  try {
    initAudioContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Quick attack and decay to sound like an old buzzer button
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("Audio Synthesizer is not initialized yet (user gesture required).", e);
  }
}

// Retro 8-bit alarm ring (Melodic digital sequence)
function playAlarmMelody() {
  try {
    initAudioContext();
    const now = audioCtx.currentTime;
    
    // Simple 8-bit melody sequence (Notes: E6, C6, G6, E6, C6, G6...)
    const notes = [1318.51, 1046.50, 1567.98, 1318.51, 1046.50, 1567.98];
    const tempo = 0.15; // note speed

    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'square'; // 8-bit retro sound texture
      osc.frequency.setValueAtTime(freq, now + index * tempo);
      
      gainNode.gain.setValueAtTime(0.08, now + index * tempo);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + index * tempo + 0.12);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now + index * tempo);
      osc.stop(now + index * tempo + 0.14);
    });
  } catch (e) {
    console.warn(e);
  }
}

// ==========================================================================
// 3. Timer State Machine Logic
// ==========================================================================
function updateDisplay() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  
  minutesEl.textContent = String(m).padStart(2, '0');
  secondsEl.textContent = String(s).padStart(2, '0');
}

function setTickerText(message) {
  // Reset ticker animation to trigger text scrolling
  tickerEl.textContent = message;
  tickerEl.style.animation = 'none';
  void tickerEl.offsetWidth; // trigger reflow
  tickerEl.style.animation = 'ticker 12s linear infinite';
}

function switchMode(mode, customTime = null) {
  currentMode = mode;
  
  // Update presets buttons visuals
  if (currentMode === 'focus') {
    if (customTime) {
      focusTime = customTime;
    }
    timeLeft = focusTime;
    
    // Remove active state from all preset buttons
    btnModeFocus20.classList.remove('active');
    btnModeFocus40.classList.remove('active');
    btnModeFocus60.classList.remove('active');
    btnModeBreak.classList.remove('active');
    
    // Set active depending on current focusTime
    if (focusTime === 20 * 60) btnModeFocus20.classList.add('active');
    else if (focusTime === 40 * 60) btnModeFocus40.classList.add('active');
    else if (focusTime === 60 * 60) btnModeFocus60.classList.add('active');
    
    indicatorFocus.classList.add('active');
    indicatorBreak.classList.remove('active');
    
    // LCD skin class for focus
    document.getElementById('lcd-display').className = "device-lcd state-focus";
    setTickerText(`FOCUS MODE ACTIVE (${focusTime / 60}m) — ACCELERATING CREATIVE ENERGY`);
  } else {
    timeLeft = breakTime;
    btnModeFocus20.classList.remove('active');
    btnModeFocus40.classList.remove('active');
    btnModeFocus60.classList.remove('active');
    btnModeBreak.classList.add('active');
    
    indicatorFocus.classList.remove('active');
    indicatorBreak.classList.add('active');
    
    // LCD skin class for break
    document.getElementById('lcd-display').className = "device-lcd state-break";
    setTickerText("REST AND RELAX — SYSTEM RESTORE IN PROGRESS");
  }
  
  updateDisplay();
}

function startTimer() {
  if (isRunning) return;
  
  initAudioContext();
  playBeep(1200, 0.08, 'triangle');
  
  isRunning = true;
  timerId = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      // Time is up!
      handleTimeUp();
    }
  }, 1000);

  btnStart.querySelector('.btn-top').style.filter = "brightness(0.9)";
  btnStop.querySelector('.btn-top').style.filter = "none";
  
  setTickerText(currentMode === 'focus' ? "FOCUS TIMER COUNTING DOWN... KEEP GOING!" : "BREAK COUNTING DOWN... ENJOY REST!");
}

function stopTimer() {
  if (!isRunning) return;
  
  playBeep(900, 0.08, 'triangle');
  
  isRunning = false;
  clearInterval(timerId);
  
  btnStart.querySelector('.btn-top').style.filter = "none";
  btnStop.querySelector('.btn-top').style.filter = "brightness(0.9)";
  
  setTickerText("TIMER PAUSED — PRESS START TO RESUME");
}

function resetTimer() {
  playBeep(600, 0.1, 'sawtooth');
  
  isRunning = false;
  clearInterval(timerId);
  
  btnStart.querySelector('.btn-top').style.filter = "none";
  btnStop.querySelector('.btn-top').style.filter = "none";
  
  // Re-switch mode to reset time
  switchMode(currentMode);
  alarmBell.classList.remove('ringing');
}

function handleTimeUp() {
  clearInterval(timerId);
  isRunning = false;
  
  // Trigger UI alert animations & melodies
  alarmBell.classList.add('ringing');
  playAlarmMelody();
  
  // Toggle states
  if (currentMode === 'focus') {
    showToast("집중 시간이 끝났습니다! 달콤한 휴식을 즐기세요.", "success");
    setTimeout(() => {
      alarmBell.classList.remove('ringing');
      switchMode('break');
      startTimer(); // Auto start break timer
    }, 1500);
  } else {
    showToast("휴식 시간이 완료되었습니다! 다시 집중해봅시다.", "success");
    setTimeout(() => {
      alarmBell.classList.remove('ringing');
      switchMode('focus');
      startTimer(); // Auto start focus timer
    }, 1500);
  }
}

// ==========================================================================
// 4. Skin Changer Controller
// ==========================================================================
function initSkins() {
  const savedSkin = localStorage.getItem('pomo_skin') || 'silver';
  applySkin(savedSkin);

  const skinButtons = document.querySelectorAll('.skin-btn');
  skinButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedSkin = e.currentTarget.getAttribute('data-skin');
      playBeep(1100, 0.05);
      
      // Update buttons visuals
      skinButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      applySkin(selectedSkin);
    });
  });
}

function applySkin(skinName) {
  // Reset all skin classes
  y2kDevice.className = "y2k-device";
  
  // Apply selected
  y2kDevice.classList.add(`skin-${skinName}`);
  localStorage.setItem('pomo_skin', skinName);

  // Sync skin button states if loaded from memory
  const targetBtn = document.getElementById(`skin-${skinName}`);
  if (targetBtn) {
    const skinButtons = document.querySelectorAll('.skin-btn');
    skinButtons.forEach(b => b.classList.remove('active'));
    targetBtn.classList.add('active');
  }
}

// ==========================================================================
// 5. Y2K Dakk-u Sticker Drag & Drop System
// ==========================================================================
let draggedStickerType = null;
let dragOffset = { x: 0, y: 0 };

function initStickers() {
  const stickers = document.querySelectorAll('.y2k-sticker');
  
  // Desktop Drag events
  stickers.forEach(sticker => {
    sticker.addEventListener('dragstart', (e) => {
      initAudioContext();
      draggedStickerType = e.target.getAttribute('data-type');
      
      // Save content symbol
      e.dataTransfer.setData('text/plain', e.target.textContent);
      
      // Slight transparency while dragging
      e.target.style.opacity = '0.4';
    });
    
    sticker.addEventListener('dragend', (e) => {
      e.target.style.opacity = '1';
    });
  });

  // Drop target (device frame body)
  y2kDevice.addEventListener('dragover', (e) => {
    e.preventDefault(); // enable drop
  });

  y2kDevice.addEventListener('drop', (e) => {
    e.preventDefault();
    
    const emojiText = e.dataTransfer.getData('text/plain');
    if (!emojiText) return;

    // Calculate mouse relative coordinates inside the device container bounding box
    const deviceRect = y2kDevice.getBoundingClientRect();
    const x = e.clientX - deviceRect.left;
    const y = e.clientY - deviceRect.top;

    // Convert pixels to relative percentages (%)
    const percentX = (x / deviceRect.width) * 100;
    const percentY = (y / deviceRect.height) * 100;

    // Generate random Y2K tilting rotation angle
    const rotation = Math.floor(Math.random() * 30) - 15; // -15deg ~ 15deg

    // Create sticker object
    const stickerData = {
      emoji: emojiText,
      left: percentX.toFixed(2),
      top: percentY.toFixed(2),
      rotate: rotation,
      id: Date.now()
    };

    // Save and render
    placedStickers.push(stickerData);
    saveStickersToMemory();
    createStickerDOM(stickerData);
    
    playBeep(1400, 0.08, 'triangle');
    showToast("스티커를 붙였습니다! (클릭 시 제거)", "success");
  });

  // Load existing stickers on init
  placedStickers.forEach(sticker => createStickerDOM(sticker));

  // Clear action trigger
  btnClearStickers.addEventListener('click', () => {
    playBeep(500, 0.15, 'sawtooth');
    
    // Clear all DOM and states
    const stickersEls = y2kDevice.querySelectorAll('.dropped-sticker');
    stickersEls.forEach(el => el.remove());
    
    placedStickers = [];
    saveStickersToMemory();
    showToast("모든 스티커가 깨끗이 청소되었습니다.", "info");
  });
}

function createStickerDOM(sticker) {
  const stickerEl = document.createElement('div');
  stickerEl.className = 'dropped-sticker';
  stickerEl.textContent = sticker.emoji;
  
  // Absolute layouts binding
  stickerEl.style.left = `${sticker.left}%`;
  stickerEl.style.top = `${sticker.top}%`;
  stickerEl.style.transform = `translate(-50%, -50%) rotate(${sticker.rotate}deg)`;
  stickerEl.style.setProperty('--rot', `${sticker.rotate}deg`);
  stickerEl.setAttribute('data-id', sticker.id);

  // Click on placed sticker to delete (peel off)
  stickerEl.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent parent clicks triggers
    playBeep(800, 0.06);
    
    const idToRemove = Number(e.target.getAttribute('data-id'));
    
    // Remove from memory state
    placedStickers = placedStickers.filter(s => s.id !== idToRemove);
    saveStickersToMemory();
    
    // Remove from DOM
    e.target.remove();
    showToast("스티커를 떼어냈습니다.", "info");
  });

  y2kDevice.appendChild(stickerEl);
}

function saveStickersToMemory() {
  localStorage.setItem('pomo_stickers', JSON.stringify(placedStickers));
}

// ==========================================================================
// 6. Toast System
// ==========================================================================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast`;
  
  const iconName = type === 'success' ? 'check-circle' : 'info';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
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
// 7. Event Listeners Setup & Launch
// ==========================================================================
function initApp() {
  // Core controls
  btnStart.addEventListener('click', startTimer);
  btnStop.addEventListener('click', stopTimer);
  btnReset.addEventListener('click', resetTimer);

  // Mode selectors
  btnModeFocus20.addEventListener('click', () => {
    playBeep(1000, 0.06);
    switchMode('focus', 20 * 60);
  });
  btnModeFocus40.addEventListener('click', () => {
    playBeep(1000, 0.06);
    switchMode('focus', 40 * 60);
  });
  btnModeFocus60.addEventListener('click', () => {
    playBeep(1000, 0.06);
    switchMode('focus', 60 * 60);
  });
  btnModeBreak.addEventListener('click', () => {
    playBeep(1000, 0.06);
    switchMode('break');
  });

  // Setup Systems
  initSkins();
  initStickers();
  
  // Set default initial state
  switchMode('focus');
}

// Initialize Application
initApp();
