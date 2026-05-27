// ==========================================================================
// 1. Quote Data (20 Quotes from quotes.md)
// ==========================================================================
const quotes = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "스티브 잡스 (Steve Jobs)",
    lifespan: "1955 ~ 2011",
    lang: "en"
  },
  {
    id: 2,
    text: "Believe you can and you're halfway there.",
    author: "시어도어 루스벨트 (Theodore Roosevelt)",
    lifespan: "1858 ~ 1919",
    lang: "en"
  },
  {
    id: 3,
    text: "It always seems impossible until it's done.",
    author: "넬슨 만델라 (Nelson Mandela)",
    lifespan: "1918 ~ 2013",
    lang: "en"
  },
  {
    id: 4,
    text: "Learning never exhausts the mind.",
    author: "레오나르도 다 빈치 (Leonardo da Vinci)",
    lifespan: "1452 ~ 1519",
    lang: "en"
  },
  {
    id: 5,
    text: "인내할 수 있는 사람은 그가 바라는 무엇이든 손에 넣을 수 있다.",
    author: "백범 김구",
    lifespan: "1876 ~ 1948",
    lang: "ko"
  },
  {
    id: 6,
    text: "Act as if what you do makes a difference. It does.",
    author: "윌리엄 제임스 (William James)",
    lifespan: "1842 ~ 1910",
    lang: "en"
  },
  {
    id: 7,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "윈스턴 처칠 (Winston Churchill)",
    lifespan: "1874 ~ 1965",
    lang: "en"
  },
  {
    id: 8,
    text: "Progress is impossible without change.",
    author: "조지 버나드 쇼 (George Bernard Shaw)",
    lifespan: "1856 ~ 1950",
    lang: "en"
  },
  {
    id: 9,
    text: "도중에 포기하지 말라. 망설이지 말라. 최후의 성공을 거둘 때까지 밀고 나가자.",
    author: "도산 안창호",
    lifespan: "1878 ~ 1938",
    lang: "ko"
  },
  {
    id: 10,
    text: "The secret of getting ahead is getting started.",
    author: "마크 트웨인 (Mark Twain)",
    lifespan: "1835 ~ 1910",
    lang: "en"
  },
  {
    id: 11,
    text: "Don't judge each day by the harvest you reap but by the seeds that you plant.",
    author: "로버트 루이스 스티븐슨 (Robert Louis Stevenson)",
    lifespan: "1850 ~ 1894",
    lang: "en"
  },
  {
    id: 12,
    text: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "프랭클린 D. 루스벨트 (Franklin D. Roosevelt)",
    lifespan: "1882 ~ 1945",
    lang: "en"
  },
  {
    id: 13,
    text: "껍질에 주저앉아 있는 자는 결코 날 수 없다.",
    author: "한용운",
    lifespan: "1879 ~ 1944",
    lang: "ko"
  },
  {
    id: 14,
    text: "Quality is not an act, it is a habit.",
    author: "아리스토텔레스 (Aristotle)",
    lifespan: "기원전 384 ~ 기원전 322",
    lang: "en"
  },
  {
    id: 15,
    text: "It is not the strongest of the species that survives, but the most adaptable to change.",
    author: "찰스 다윈 (Charles Darwin)",
    lifespan: "1809 ~ 1882",
    lang: "en"
  },
  {
    id: 16,
    text: "If you want to fly, you have to give up the things that weigh you down.",
    author: "토니 모리슨 (Toni Morrison)",
    lifespan: "1931 ~ 2019",
    lang: "en"
  },
  {
    id: 17,
    text: "날마다 성실하게 살아가는 일, 그것이 곧 위대한 삶으로 향하는 지름길이다.",
    author: "방정환",
    lifespan: "1899 ~ 1931",
    lang: "ko"
  },
  {
    id: 18,
    text: "Change your thoughts and you change your world.",
    author: "노먼 빈센트 필 (Norman Vincent Peale)",
    lifespan: "1898 ~ 1993",
    lang: "en"
  },
  {
    id: 19,
    text: "Mastery is a product of consistently going the extra mile.",
    author: "로빈 샤르마 (Robin Sharma)",
    lifespan: "1965 ~ 현재",
    lang: "en"
  },
  {
    id: 20,
    text: "Heavy pillars are needed to support a big house, and great strength is required to fulfill a great task.",
    author: "정약용 (정약용의 영문 번역 격언)",
    lifespan: "1762 ~ 1836",
    lang: "en"
  }
];

// ==========================================================================
// 2. Application State Variables
// ==========================================================================
let currentQuote = null;
let favoriteQuoteIds = JSON.parse(localStorage.getItem('fav_quotes')) || [];
let recentQuoteIds = []; // History to prevent duplicates (max 5)
const MAX_HISTORY_SIZE = 5;

// TTS Settings
let ttsSynth = window.speechSynthesis;
let ttsUtterance = null;
let isSpeaking = false;

// DOM Elements
const quoteCardContainer = document.getElementById('quote-card-container');
const quoteTextEl = document.getElementById('quote-text');
const quoteAuthorEl = document.getElementById('quote-author');
const quoteLifespanEl = document.getElementById('quote-lifespan');

const btnNext = document.getElementById('btn-next');
const btnFavorite = document.getElementById('btn-favorite');
const btnSpeak = document.getElementById('btn-speak');
const btnCopy = document.getElementById('btn-copy');
const btnThemeToggle = document.getElementById('btn-theme-toggle');

const btnListToggle = document.getElementById('btn-list-toggle');
const btnFavToggle = document.getElementById('btn-fav-toggle');
const favCountBadge = document.getElementById('fav-count-badge');

const modalList = document.getElementById('modal-list');
const btnCloseList = document.getElementById('btn-close-list');
const searchInput = document.getElementById('search-input');
const entireQuoteListEl = document.getElementById('entire-quote-list');

const modalFavorites = document.getElementById('modal-favorites');
const btnCloseFav = document.getElementById('btn-close-fav');
const favoritesQuoteListEl = document.getElementById('favorites-quote-list');
const favEmptyState = document.getElementById('fav-empty-state');

const toastContainer = document.getElementById('toast-container');

// ==========================================================================
// 3. Theme System Logic
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  showToast(newTheme === 'dark' ? '다크 모드로 전환되었습니다.' : '라이트 모드로 전환되었습니다.', 'info');
}

// ==========================================================================
// 4. Quote Selection & Render Logic
// ==========================================================================
function getRandomQuote() {
  // Filter out recent quotes to avoid duplicates
  let availableQuotes = quotes.filter(q => !recentQuoteIds.includes(q.id));
  
  // Safety fallback if history filled all quotes somehow
  if (availableQuotes.length === 0) {
    recentQuoteIds = [];
    availableQuotes = quotes;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  const selectedQuote = availableQuotes[randomIndex];
  
  // Track history
  recentQuoteIds.push(selectedQuote.id);
  if (recentQuoteIds.length > MAX_HISTORY_SIZE) {
    recentQuoteIds.shift();
  }
  
  return selectedQuote;
}

function renderQuote(quote, isInitial = false) {
  if (isSpeaking) {
    stopSpeech();
  }

  currentQuote = quote;
  
  // Update Favorite Button visual state
  updateFavoriteButtonState();

  if (isInitial) {
    quoteTextEl.textContent = quote.text;
    quoteAuthorEl.textContent = quote.author;
    quoteLifespanEl.textContent = quote.lifespan;
  } else {
    // Add fading out effect
    quoteCardContainer.classList.add('changing');
    
    setTimeout(() => {
      quoteTextEl.textContent = quote.text;
      quoteAuthorEl.textContent = quote.author;
      quoteLifespanEl.textContent = quote.lifespan;
      
      // Fade back in
      quoteCardContainer.classList.remove('changing');
    }, 300); // match standard transitions duration in CSS
  }
}

function displayNewRandomQuote() {
  const nextQuote = getRandomQuote();
  renderQuote(nextQuote);
}

// ==========================================================================
// 5. Bookmark / Favorites Logic
// ==========================================================================
function toggleFavorite() {
  if (!currentQuote) return;
  
  const index = favoriteQuoteIds.indexOf(currentQuote.id);
  
  if (index === -1) {
    // Add to favorites
    favoriteQuoteIds.push(currentQuote.id);
    showToast('보관함에 저장되었습니다.', 'success');
  } else {
    // Remove from favorites
    favoriteQuoteIds.splice(index, 1);
    showToast('보관함에서 제거되었습니다.', 'info');
  }
  
  // Save to localStorage
  localStorage.setItem('fav_quotes', JSON.stringify(favoriteQuoteIds));
  
  // Update state UI
  updateFavoriteButtonState();
  updateFavoritesCountBadge();
  renderFavoritesList();
}

function updateFavoriteButtonState() {
  if (currentQuote && favoriteQuoteIds.includes(currentQuote.id)) {
    btnFavorite.classList.add('active');
    btnFavorite.setAttribute('aria-label', '즐겨찾기 해제');
  } else {
    btnFavorite.classList.remove('active');
    btnFavorite.setAttribute('aria-label', '즐겨찾기 추가');
  }
}

function updateFavoritesCountBadge() {
  const count = favoriteQuoteIds.length;
  favCountBadge.textContent = count;
  
  // Trigger pop micro-animation on badge update
  favCountBadge.classList.remove('pop');
  void favCountBadge.offsetWidth; // Trigger reflow to restart animation
  favCountBadge.classList.add('pop');
}

// ==========================================================================
// 6. Audio Synthesizer (TTS - Web Speech API)
// ==========================================================================
function speakQuote() {
  if (!currentQuote) return;
  
  if (isSpeaking) {
    stopSpeech();
    return;
  }
  
  // Create Speech Utterance
  ttsUtterance = new SpeechSynthesisUtterance(currentQuote.text);
  
  // Detect language and find appropriate voice
  ttsUtterance.lang = currentQuote.lang === 'ko' ? 'ko-KR' : 'en-US';
  
  // Get system voices
  const voices = ttsSynth.getVoices();
  const matchingVoice = voices.find(voice => voice.lang.startsWith(ttsUtterance.lang));
  if (matchingVoice) {
    ttsUtterance.voice = matchingVoice;
  }
  
  // Utterance Event Listeners
  ttsUtterance.onstart = () => {
    isSpeaking = true;
    btnSpeak.classList.add('speaking-active');
    btnSpeak.querySelector('span').textContent = '정지';
    // Change speaker icon to square (stop icon)
    btnSpeak.querySelector('i').setAttribute('data-lucide', 'square');
    lucide.createIcons();
  };
  
  ttsUtterance.onend = () => {
    resetSpeakBtn();
  };
  
  ttsUtterance.onerror = () => {
    resetSpeakBtn();
  };
  
  // Speak!
  ttsSynth.speak(ttsUtterance);
}

function stopSpeech() {
  if (ttsSynth) {
    ttsSynth.cancel();
  }
  resetSpeakBtn();
}

function resetSpeakBtn() {
  isSpeaking = false;
  btnSpeak.classList.remove('speaking-active');
  btnSpeak.querySelector('span').textContent = '듣기';
  btnSpeak.querySelector('i').setAttribute('data-lucide', 'volume-2');
  lucide.createIcons();
}

// ==========================================================================
// 7. Clipboard Copy
// ==========================================================================
function copyQuote() {
  if (!currentQuote) return;
  
  const textToCopy = `"${currentQuote.text}" - ${currentQuote.author} (${currentQuote.lifespan})`;
  
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      showToast('명언이 클립보드에 복사되었습니다.', 'success');
    })
    .catch(() => {
      // Fallback
      showToast('복사에 실패했습니다. 직접 복사해주세요.', 'info');
    });
}

// ==========================================================================
// 8. Toast Notifications Creator
// ==========================================================================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast`;
  
  // Icon settings based on type
  const iconName = type === 'success' ? 'check-circle' : 'info';
  const iconClass = type === 'success' ? 'toast-icon success' : 'toast-icon info';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="${iconClass}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  lucide.createIcons();
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}

// ==========================================================================
// 9. Modal Lists Rendering
// ==========================================================================

// Render the entire list of quotes in modal
function renderEntireQuoteList(filterText = '') {
  entireQuoteListEl.innerHTML = '';
  
  const query = filterText.toLowerCase().trim();
  const filteredQuotes = quotes.filter(q => 
    q.text.toLowerCase().includes(query) || 
    q.author.toLowerCase().includes(query)
  );
  
  filteredQuotes.forEach(q => {
    const li = document.createElement('li');
    li.className = 'quote-list-item';
    li.innerHTML = `
      <p class="list-item-text">"${q.text}"</p>
      <div class="list-item-meta">
        <div>
          <span class="list-item-author">${q.author}</span>
          <span class="list-item-lifespan">(${q.lifespan})</span>
        </div>
        <div class="list-item-actions">
          <button class="list-action-btn view-btn" data-id="${q.id}" title="메인 화면에서 보기">
            <i data-lucide="external-link"></i>
          </button>
        </div>
      </div>
    `;
    
    // External link handler inside modal list item
    li.querySelector('.view-btn').addEventListener('click', () => {
      renderQuote(q);
      modalList.close();
    });
    
    entireQuoteListEl.appendChild(li);
  });
  
  lucide.createIcons();
}

// Render the favorites list in modal
function renderFavoritesList() {
  favoritesQuoteListEl.innerHTML = '';
  
  if (favoriteQuoteIds.length === 0) {
    favEmptyState.style.display = 'flex';
    return;
  }
  
  favEmptyState.style.display = 'none';
  
  // Fetch full quote object for each favorited ID
  const favQuotes = quotes.filter(q => favoriteQuoteIds.includes(q.id));
  
  favQuotes.forEach(q => {
    const li = document.createElement('li');
    li.className = 'quote-list-item';
    li.innerHTML = `
      <p class="list-item-text">"${q.text}"</p>
      <div class="list-item-meta">
        <div>
          <span class="list-item-author">${q.author}</span>
          <span class="list-item-lifespan">(${q.lifespan})</span>
        </div>
        <div class="list-item-actions">
          <button class="list-action-btn view-btn" data-id="${q.id}" title="메인 화면에서 보기">
            <i data-lucide="external-link"></i>
          </button>
          <button class="list-action-btn delete-fav" data-id="${q.id}" title="보관함에서 제거">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </div>
    `;
    
    // Action: View on main card
    li.querySelector('.view-btn').addEventListener('click', () => {
      renderQuote(q);
      modalFavorites.close();
    });
    
    // Action: Remove from favorites
    li.querySelector('.delete-fav').addEventListener('click', () => {
      const idx = favoriteQuoteIds.indexOf(q.id);
      if (idx !== -1) {
        favoriteQuoteIds.splice(idx, 1);
        localStorage.setItem('fav_quotes', JSON.stringify(favoriteQuoteIds));
        updateFavoriteButtonState();
        updateFavoritesCountBadge();
        renderFavoritesList();
        showToast('보관함에서 제거되었습니다.', 'info');
      }
    });
    
    favoritesQuoteListEl.appendChild(li);
  });
  
  lucide.createIcons();
}

// ==========================================================================
// 10. Event Listeners Setup & Init
// ==========================================================================

// Card Dynamic Glowing Background Coordinates Tracker
quoteCardContainer.addEventListener('mousemove', (e) => {
  const rect = quoteCardContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  quoteCardContainer.style.setProperty('--mouse-x', `${x}px`);
  quoteCardContainer.style.setProperty('--mouse-y', `${y}px`);
});

// App Controls
btnNext.addEventListener('click', displayNewRandomQuote);
btnFavorite.addEventListener('click', toggleFavorite);
btnSpeak.addEventListener('click', speakQuote);
btnCopy.addEventListener('click', copyQuote);
btnThemeToggle.addEventListener('click', toggleTheme);

// Dialogs Open
btnListToggle.addEventListener('click', () => {
  renderEntireQuoteList();
  searchInput.value = '';
  modalList.showModal();
});

btnFavToggle.addEventListener('click', () => {
  renderFavoritesList();
  modalFavorites.showModal();
});

// Dialogs Close
btnCloseList.addEventListener('click', () => modalList.close());
btnCloseFav.addEventListener('click', () => modalFavorites.close());

// Close modals when clicking on backdrop
window.addEventListener('click', (e) => {
  if (e.target === modalList) modalList.close();
  if (e.target === modalFavorites) modalFavorites.close();
});

// Search input keyup
searchInput.addEventListener('input', (e) => {
  renderEntireQuoteList(e.target.value);
});

// Chrome Web Speech voice loading fix
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    // Refresh voices internally
  };
}

// Initialize Application
function initApp() {
  initTheme();
  updateFavoritesCountBadge();
  
  // Set first initial quote
  const initialQuote = getRandomQuote();
  renderQuote(initialQuote, true);
}

// Launch
initApp();
