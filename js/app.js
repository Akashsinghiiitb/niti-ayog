/**
 * Akash & Nitisha (Nitu) - Love Story & Memories Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingCanvas();
  initTimeCounter();
  initMusicPlayer();
  initLudoDice();
  initWheelGame();
  initLoveQuiz();
  initHeartCatcher();
  initPhotoGallery();
  initVideoPlayer();
  initLoveCoupons();
  initOpenWhenLetters();
  initWaxSealLetter();
  initIntroScreen();
});

/* =========================================================
   1. INTRO SCREEN & UNLOCK
   ========================================================= */
function initIntroScreen() {
  const enterBtn = document.getElementById('enter-btn');
  const introScreen = document.getElementById('intro-screen');

  if (enterBtn && introScreen) {
    enterBtn.addEventListener('click', () => {
      // Trigger music
      playMusicTrack(0);
      
      // Confetti burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff4d6d', '#ff758f', '#ffd166', '#ffffff']
        });
      }

      introScreen.classList.add('fade-out');
      setTimeout(() => {
        introScreen.style.display = 'none';
      }, 800);
    });
  }
}

/* =========================================================
   2. FLOATING HEARTS & PARTICLES CANVAS
   ========================================================= */
function initFloatingCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const hearts = [];
  const heartIcons = ['❤️', '💖', '✨', '🌸', '💕', '🌹'];

  class FloatingItem {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 16 + 12;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
      this.char = heartIcons[Math.floor(Math.random() * heartIcons.length)];
      this.opacity = Math.random() * 0.6 + 0.2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 1.5;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      if (this.y < -40) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.size}px serif`;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillText(this.char, -this.size / 2, this.size / 2);
      ctx.restore();
    }
  }

  for (let i = 0; i < 24; i++) {
    hearts.push(new FloatingItem());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    hearts.forEach((h) => {
      h.update();
      h.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* =========================================================
   3. LIVE TIME COUNTER (Since 12 Dec 2025)
   ========================================================= */
function initTimeCounter() {
  // Last met date: 12 Dec 2025
  const metDate = new Date('2025-12-12T00:00:00');

  function update() {
    const now = new Date();
    const diff = Math.max(0, now - metDate);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const daysEl = document.getElementById('timer-days');
    const hoursEl = document.getElementById('timer-hours');
    const minutesEl = document.getElementById('timer-minutes');
    const secondsEl = document.getElementById('timer-seconds');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* =========================================================
   4. ROMANTIC HINDI MUSIC PLAYER
   ========================================================= */
const playlist = [
  {
    title: 'Tum Se Hi',
    artist: 'Mohit Chauhan • Jab We Met',
    ytId: 'gkCKTuR-ECI'
  },
  {
    title: 'Kesariya',
    artist: 'Arijit Singh • Brahmāstra',
    ytId: 'BddP6PYo2gs'
  },
  {
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal & Asees Kaur • Shershaah',
    ytId: 'gvyUuxdRdR4'
  },
  {
    title: 'Apna Bana Le',
    artist: 'Arijit Singh & Sachin-Jigar • Bhediya',
    ytId: 'ElZfdU54Cp8'
  },
  {
    title: 'Pehle Bhi Main',
    artist: 'Vishal Mishra • Animal',
    ytId: 'f6vYpPzK1qM'
  },
  {
    title: 'Ve Kamleya',
    artist: 'Arijit Singh & Shreya Ghoshal',
    ytId: 'CA7i_i2eRzE'
  }
];

let currentTrackIndex = 0;
let isPlaying = false;
let ytPlayer = null;
let synthAudio = null; // Fallback Web Audio Synthesizer

function initMusicPlayer() {
  const playBtn = document.getElementById('play-toggle-btn');
  const prevBtn = document.getElementById('prev-track-btn');
  const nextBtn = document.getElementById('next-track-btn');
  const songSelect = document.getElementById('song-selector');

  if (songSelect) {
    songSelect.innerHTML = playlist
      .map((s, idx) => `<option value="${idx}">${s.title} (${s.artist.split('•')[0].trim()})</option>`)
      .join('');

    songSelect.addEventListener('change', (e) => {
      playMusicTrack(parseInt(e.target.value));
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', toggleMusic);
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      playMusicTrack(currentTrackIndex);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      playMusicTrack(currentTrackIndex);
    });
  }

  // Load YouTube Iframe API
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player('yt-hidden-player', {
      height: '0',
      width: '0',
      videoId: playlist[0].ytId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.ENDED) {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            playMusicTrack(currentTrackIndex);
          }
        }
      }
    });
  };
}

function playMusicTrack(index) {
  currentTrackIndex = index;
  const track = playlist[index];
  const titleEl = document.getElementById('track-title');
  const artistEl = document.getElementById('track-artist');
  const playIcon = document.getElementById('play-icon');
  const disc = document.getElementById('spinning-disc');
  const songSelect = document.getElementById('song-selector');

  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist;
  if (songSelect) songSelect.value = index;

  if (ytPlayer && ytPlayer.loadVideoById) {
    try {
      ytPlayer.loadVideoById(track.ytId);
      ytPlayer.playVideo();
      isPlaying = true;
    } catch (e) {
      startSynthMelody();
    }
  } else {
    startSynthMelody();
  }

  if (playIcon) playIcon.className = 'fas fa-pause';
  if (disc) disc.classList.add('animate-spin');
}

function toggleMusic() {
  const playIcon = document.getElementById('play-icon');
  const disc = document.getElementById('spinning-disc');

  if (isPlaying) {
    if (ytPlayer && ytPlayer.pauseVideo) {
      try { ytPlayer.pauseVideo(); } catch(e){}
    }
    stopSynthMelody();
    isPlaying = false;
    if (playIcon) playIcon.className = 'fas fa-play';
    if (disc) disc.classList.remove('animate-spin');
  } else {
    playMusicTrack(currentTrackIndex);
  }
}

// Romantic Piano Chime Synthesizer Fallback
let synthInterval = null;
function startSynthMelody() {
  isPlaying = true;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66]; // C E G C A G E D
    let noteIdx = 0;

    clearInterval(synthInterval);
    synthInterval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(synthInterval);
        return;
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIdx % notes.length], ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
      noteIdx++;
    }, 900);
  } catch (err) {}
}

function stopSynthMelody() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

/* =========================================================
   5. THE GREAT LUDO SHOWDOWN & 3D DICE ROLLER
   ========================================================= */
function initLudoDice() {
  const rollBtn = document.getElementById('roll-dice-btn');
  const diceCube = document.getElementById('dice-cube');
  const diceResultText = document.getElementById('dice-result-text');
  const cheatToggle = document.getElementById('nitu-cheat-toggle');

  const diceRotations = {
    1: 'rotateY(0deg) rotateX(0deg)',
    2: 'rotateY(-90deg) rotateX(0deg)',
    3: 'rotateY(-180deg) rotateX(0deg)',
    4: 'rotateY(90deg) rotateX(0deg)',
    5: 'rotateX(-90deg) rotateY(0deg)',
    6: 'rotateX(90deg) rotateY(0deg)'
  };

  if (!rollBtn || !diceCube) return;

  let isRolling = false;

  rollBtn.addEventListener('click', () => {
    if (isRolling) return;
    isRolling = true;
    rollBtn.disabled = true;

    // Random fast spinning
    diceCube.style.transform = `rotateX(${Math.random() * 720 + 720}deg) rotateY(${Math.random() * 720 + 720}deg)`;
    if (diceResultText) diceResultText.textContent = 'Rolling for Nitu... 🎲✨';

    setTimeout(() => {
      let finalRoll;
      if (cheatToggle && cheatToggle.checked) {
        // Nitu's Queen Cheat Mode: Always rolls 6!
        finalRoll = 6;
      } else {
        // Standard roll (favoring 6 for fun 40% of the time)
        finalRoll = Math.random() < 0.4 ? 6 : Math.floor(Math.random() * 6) + 1;
      }

      diceCube.style.transform = diceRotations[finalRoll];

      if (diceResultText) {
        if (finalRoll === 6) {
          diceResultText.innerHTML = `<span class="text-pink-600 font-bold text-lg">🎉 YOU ROLLED A 6! Queen Nitu strikes again!</span>`;
          if (typeof confetti === 'function') {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
          }
        } else {
          diceResultText.innerHTML = `You rolled a <strong class="text-pink-600 text-lg">${finalRoll}</strong>! Ready to beat Akash? 😉`;
        }
      }

      isRolling = false;
      rollBtn.disabled = false;
    }, 1200);
  });
}

/* =========================================================
   6. FORTUNE WHEEL MINI-GAME ("What Akash Owes Nitu")
   ========================================================= */
const wheelOptions = [
  { text: 'Unlimited Warm Hugs 🫂', color: '#ff4d6d' },
  { text: 'Midnight Ice Cream 🍦', color: '#ff758f' },
  { text: '1 Guaranteed Ludo Win 🎲', color: '#ffb3c1' },
  { text: 'Akash Cooks For You 🍝', color: '#ff4d6d' },
  { text: '100 Sweet Forehead Kisses 💋', color: '#c9184a' },
  { text: 'Late Night Gossip Session 🌙', color: '#ff758f' },
  { text: 'Shopping Spree Treat 🛍️', color: '#a4133c' },
  { text: '1 "Nitu is 100% Right" Pass 👑', color: '#590d22' }
];

function initWheelGame() {
  const canvas = document.getElementById('wheel-canvas');
  const spinBtn = document.getElementById('spin-wheel-btn');
  const resultEl = document.getElementById('wheel-result');

  if (!canvas || !spinBtn) return;
  const ctx = canvas.getContext('2d');
  const size = (canvas.width = canvas.height = 300);
  const center = size / 2;
  const numSlices = wheelOptions.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  function drawWheel() {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i < numSlices; i++) {
      const angle = i * sliceAngle;
      ctx.beginPath();
      ctx.fillStyle = wheelOptions[i].color;
      ctx.moveTo(center, center);
      ctx.arc(center, center, center - 6, angle, angle + sliceAngle);
      ctx.lineTo(center, center);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.fillText(wheelOptions[i].text, center - 20, 4);
      ctx.restore();
    }

    // Center Gold Pin
    ctx.beginPath();
    ctx.arc(center, center, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffd166';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  drawWheel();

  let currentRotation = 0;
  let isSpinning = false;

  spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    if (resultEl) resultEl.textContent = 'Spinning the wheel of love... ✨';

    const randomDegrees = Math.floor(Math.random() * 360) + 1800; // 5 full rotations + random
    currentRotation += randomDegrees;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
      isSpinning = false;
      spinBtn.disabled = false;

      // Calculate winning slice (pointer is at top: 270 deg / -90 deg)
      const actualDegrees = (currentRotation % 360);
      // pointer is at top (270 deg)
      const adjustedDegrees = (360 - actualDegrees + 270) % 360;
      const winningIndex = Math.floor(adjustedDegrees / (360 / numSlices)) % numSlices;
      const winner = wheelOptions[winningIndex];

      if (resultEl) {
        resultEl.innerHTML = `
          <div class="p-3 bg-pink-100 border border-pink-300 rounded-xl text-wine font-medium">
            🎉 <strong class="text-primary-dark">You Won:</strong> ${winner.text}!<br>
            <span class="text-xs text-gray-600">Akash must honor this immediately! ❤️</span>
          </div>
        `;
      }

      if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }
    }, 4000);
  });
}

/* =========================================================
   7. AKASH & NITU LOVE QUIZ
   ========================================================= */
const quizQuestions = [
  {
    q: 'Who is the official boss in this relationship? 👑',
    options: ['Nitu Singh (obviously)', 'Her Royal Highness Nitisha', 'The Queen herself', 'All of the above! ❤️'],
    correct: 3,
    note: 'Spot on! There was never any doubt who rules Akash\'s heart.'
  },
  {
    q: 'When Akash and Nitu play Ludo, what actually happens? 🎲',
    options: ['Akash wins 19 times', 'Nitu complains about bad dice rolls', 'Nitu\'s 11 wins feel like 100 wins', 'All of the above! 😂'],
    correct: 3,
    note: 'Haha! Akash may have 19 wins, but Nitu wins the whole game of life.'
  },
  {
    q: 'What is Akash\'s absolute favorite view in the universe? ✨',
    options: ['A mountain sunset', 'A galaxy of stars', 'Nitisha\'s gorgeous smile 🥰', 'Paris at night'],
    correct: 2,
    note: 'Nothing in this entire world compares to your smile, Nitu!'
  },
  {
    q: 'Where does Akash wish he was right this very second? 📍',
    options: ['Right beside Nitu holding her hand 🤝', 'In her arms', 'Eating food together with her', 'All three together forever! 💕'],
    correct: 3,
    note: 'Every single second since 12 Dec 2025 has been counting down to seeing you again.'
  }
];

let quizIndex = 0;
let quizScore = 0;

function initLoveQuiz() {
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  if (quizIndex >= quizQuestions.length) {
    // Show completion certificate
    container.innerHTML = `
      <div class="text-center p-6 bg-gradient-to-br from-pink-50 to-white rounded-2xl border-2 border-pink-300 shadow-xl">
        <div class="text-5xl mb-3">🏆💖</div>
        <h3 class="text-2xl font-bold font-serif-title text-wine mb-2">Quiz Completed with 100% Love!</h3>
        <p class="text-sm text-gray-700 mb-4">Official Certificate of Being the Most Perfect Girlfriend in the Entire Galaxy.</p>
        <div class="bg-white p-4 rounded-xl border border-pink-200 inline-block text-left mb-4 shadow-sm">
          <p class="font-script text-2xl text-primary mb-1">Awarded to: Nitisha Singh (Nitu)</p>
          <p class="text-xs text-gray-500">Issued by: Akash Singh • Valid For: Lifetime & Eternity</p>
        </div>
        <div>
          <button id="reset-quiz-btn" class="px-5 py-2.5 bg-primary text-white rounded-full font-medium shadow-md hover:bg-primary-dark transition">
            Retake Quiz 🔄
          </button>
        </div>
      </div>
    `;
    const resetBtn = document.getElementById('reset-quiz-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        quizIndex = 0;
        quizScore = 0;
        renderQuizQuestion();
      });
    }
    if (typeof confetti === 'function') {
      confetti({ particleCount: 90, spread: 100, origin: { y: 0.5 } });
    }
    return;
  }

  const q = quizQuestions[quizIndex];
  container.innerHTML = `
    <div class="p-6 bg-white/80 rounded-2xl border border-pink-200 shadow-md">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-semibold px-3 py-1 bg-pink-100 text-pink-700 rounded-full">Question ${quizIndex + 1} of ${quizQuestions.length}</span>
        <span class="text-xs text-gray-500 font-medium">Love Score: ${quizScore * 25}%</span>
      </div>
      <h4 class="text-lg font-bold text-wine mb-4">${q.q}</h4>
      <div class="space-y-2.5">
        ${q.options
          .map(
            (opt, i) => `
          <button onclick="handleQuizAnswer(${i})" class="quiz-option-btn w-full text-left px-4 py-3 rounded-xl border border-pink-200 hover:border-pink-500 hover:bg-pink-50 transition font-medium text-sm flex items-center justify-between text-gray-800">
            <span>${opt}</span>
            <i class="far fa-heart text-pink-400"></i>
          </button>
        `
          )
          .join('')}
      </div>
      <div id="quiz-feedback" class="mt-3 text-sm hidden"></div>
    </div>
  `;
}

window.handleQuizAnswer = function (selectedIndex) {
  const q = quizQuestions[quizIndex];
  const feedback = document.getElementById('quiz-feedback');
  const buttons = document.querySelectorAll('.quiz-option-btn');

  buttons.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === q.correct || selectedIndex === 3) {
    quizScore++;
    if (feedback) {
      feedback.className = 'mt-3 text-sm p-3 bg-pink-100 text-pink-800 rounded-xl block';
      feedback.innerHTML = `✅ <strong>Awww!</strong> ${q.note}`;
    }
  } else {
    if (feedback) {
      feedback.className = 'mt-3 text-sm p-3 bg-rose-50 text-rose-800 rounded-xl block';
      feedback.innerHTML = `✨ Every answer you pick is right, but here's why: ${q.note}`;
    }
  }

  if (typeof confetti === 'function') {
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
  }

  setTimeout(() => {
    quizIndex++;
    renderQuizQuestion();
  }, 1600);
};

/* =========================================================
   8. HEART CATCHER MINI-GAME (Tap to fill meter)
   ========================================================= */
let heartPoints = 0;
function initHeartCatcher() {
  const gameArea = document.getElementById('heart-game-area');
  const scoreEl = document.getElementById('heart-score');
  const secretEl = document.getElementById('secret-love-message');

  if (!gameArea) return;

  function spawnFloatingHeart() {
    if (heartPoints >= 100) return;
    const heart = document.createElement('div');
    heart.className = 'absolute cursor-pointer text-2xl select-none transition-transform hover:scale-125';
    heart.style.left = `${Math.random() * 85 + 5}%`;
    heart.style.top = `${Math.random() * 75 + 10}%`;
    const emojis = ['💖', '❤️', '💕', '🥰', '🌸'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    heart.addEventListener('click', () => {
      heartPoints = Math.min(100, heartPoints + 10);
      if (scoreEl) scoreEl.textContent = `${heartPoints}%`;
      const meter = document.getElementById('love-progress-bar');
      if (meter) meter.style.width = `${heartPoints}%`;

      // Sparkle effect
      heart.textContent = '✨';
      heart.style.transform = 'scale(1.8)';
      heart.style.opacity = '0';
      setTimeout(() => heart.remove(), 300);

      if (heartPoints >= 100 && secretEl) {
        secretEl.classList.remove('hidden');
        if (typeof confetti === 'function') {
          confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
        }
      }
    });

    gameArea.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) heart.remove();
    }, 3500);
  }

  setInterval(spawnFloatingHeart, 1200);
}

/* =========================================================
   9. MEMORIES PHOTO VAULT & LIGHTBOX (All 17 Photos)
   ========================================================= */
const photoData = [
  { src: 'assets/images/photo1.jpeg', tag: 'gorgeous', caption: 'The smile that completely stole my heart ❤️' },
  { src: 'assets/images/photo2.jpeg', tag: 'vibes', caption: 'Effortlessly stunning every single second 🌸' },
  { src: 'assets/images/photo3.jpeg', tag: 'smiles', caption: 'My absolute favorite human in this world ✨' },
  { src: 'assets/images/photo4.jpeg', tag: 'gorgeous', caption: 'Queen Nitisha looking like royalty 👑' },
  { src: 'assets/images/photo5.jpeg', tag: 'vibes', caption: 'That glow though! Nobody compares to you 🥺' },
  { src: 'assets/images/photo6.jpeg', tag: 'smiles', caption: 'A smile so bright it solves all my problems 💖' },
  { src: 'assets/images/photo7.jpeg', tag: 'gorgeous', caption: 'My Nitu, forever and always 🌹' },
  { src: 'assets/images/photo8.jpeg', tag: 'vibes', caption: 'The prettiest girl in every room she enters 🌺' },
  { src: 'assets/images/photo9.jpeg', tag: 'smiles', caption: 'The cutest face in the universe 🥰' },
  { src: 'assets/images/photo10.jpeg', tag: 'aesthetic', caption: 'Pure perfection captured in a frame 📸' },
  { src: 'assets/images/photo11.jpeg', tag: 'gorgeous', caption: 'How lucky am I to call you mine? 💕' },
  { src: 'assets/images/photo12.jpeg', tag: 'vibes', caption: 'Graceful, sweet, and wonderfully you 🕊️' },
  { src: 'assets/images/photo13.jpeg', tag: 'smiles', caption: 'You make life so vibrant and warm ☀️' },
  { src: 'assets/images/photo14.jpeg', tag: 'aesthetic', caption: 'A snapshot of my favorite dream ✨' },
  { src: 'assets/images/photo15.jpeg', tag: 'gorgeous', caption: 'Eyes that speak directly to my soul 💫' },
  { src: 'assets/images/photo16.jpeg', tag: 'smiles', caption: 'Nitu, you are my happiest thought 🌷' },
  { src: 'assets/images/photo17.jpeg', tag: 'aesthetic', caption: 'Unforgettable moments of my favorite girl ❤️' }
];

let activeLightboxIndex = 0;

function initPhotoGallery() {
  const grid = document.getElementById('photo-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderPhotos(filter = 'all') {
    if (!grid) return;
    grid.innerHTML = photoData
      .map((item, idx) => {
        if (filter !== 'all' && item.tag !== filter) return '';
        // Subtle random rotation for realistic polaroid feel (-2 to 2 deg)
        const rot = (Math.random() * 4 - 2).toFixed(1);
        return `
          <div class="polaroid cursor-pointer group" style="transform: rotate(${rot}deg);" onclick="openLightbox(${idx})">
            <div class="w-full aspect-[3/4] overflow-hidden rounded bg-pink-50 relative">
              <img src="${item.src}" alt="Nitisha" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span class="text-white text-xs font-medium"><i class="fas fa-expand mr-1"></i> Tap to view</span>
              </div>
            </div>
            <div class="mt-3 flex items-center justify-between">
              <p class="text-xs text-wine font-medium truncate pr-2">${item.caption}</p>
              <button onclick="event.stopPropagation(); likePhoto(this)" class="text-pink-400 hover:text-pink-600 transition">
                <i class="far fa-heart"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join('');
  }

  renderPhotos();

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('bg-primary', 'text-white'));
      filterBtns.forEach((b) => b.classList.add('bg-white', 'text-wine'));
      btn.classList.add('bg-primary', 'text-white');
      btn.classList.remove('bg-white', 'text-wine');
      renderPhotos(btn.dataset.filter);
    });
  });
}

window.likePhoto = function (btn) {
  const icon = btn.querySelector('i');
  if (icon.classList.contains('far')) {
    icon.className = 'fas fa-heart text-primary animate-ping';
    setTimeout(() => {
      icon.className = 'fas fa-heart text-primary';
    }, 300);
    if (typeof confetti === 'function') {
      confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
    }
  } else {
    icon.className = 'far fa-heart text-pink-400';
  }
};

window.openLightbox = function (index) {
  activeLightboxIndex = index;
  const overlay = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (overlay && img && caption) {
    img.src = photoData[index].src;
    caption.textContent = photoData[index].caption;
    overlay.classList.add('active');
  }
};

window.closeLightbox = function () {
  const overlay = document.getElementById('lightbox-modal');
  if (overlay) overlay.classList.remove('active');
};

window.nextLightbox = function () {
  activeLightboxIndex = (activeLightboxIndex + 1) % photoData.length;
  window.openLightbox(activeLightboxIndex);
};

window.prevLightbox = function () {
  activeLightboxIndex = (activeLightboxIndex - 1 + photoData.length) % photoData.length;
  window.openLightbox(activeLightboxIndex);
};

/* =========================================================
   10. CINEMA OF NITU (Video Section)
   ========================================================= */
function initVideoPlayer() {
  const videoCards = document.querySelectorAll('.reel-video-container');

  videoCards.forEach((card) => {
    const video = card.querySelector('video');
    const playOverlay = card.querySelector('.video-play-overlay');
    const muteBtn = card.querySelector('.video-mute-btn');

    if (!video) return;

    if (playOverlay) {
      playOverlay.addEventListener('click', () => {
        if (video.paused) {
          // Pause other videos
          document.querySelectorAll('video').forEach((v) => {
            if (v !== video) v.pause();
          });
          video.play();
          playOverlay.style.opacity = '0';
        } else {
          video.pause();
          playOverlay.style.opacity = '1';
        }
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        const icon = muteBtn.querySelector('i');
        if (icon) {
          icon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        }
      });
    }

    video.addEventListener('ended', () => {
      if (playOverlay) playOverlay.style.opacity = '1';
    });
  });
}

/* =========================================================
   11. LOVE COUPONS (Scratch / Claim)
   ========================================================= */
function initLoveCoupons() {
  const claimBtns = document.querySelectorAll('.claim-coupon-btn');

  claimBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.coupon-card');
      const title = card.querySelector('h4').textContent;

      btn.textContent = 'Claimed with Love! ❤️';
      btn.classList.add('bg-green-600', 'text-white');
      btn.disabled = true;
      card.classList.add('claimed');

      if (typeof confetti === 'function') {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }

      // Pre-fill WhatsApp message
      const msg = encodeURIComponent(`Hey Akash! ❤️ I just claimed this coupon on our website: "${title}". You must fulfill it soon! 😉`);
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    });
  });
}

/* =========================================================
   12. "OPEN WHEN..." LETTERS
   ========================================================= */
const letterMessages = {
  miss: {
    title: 'Open When You Miss Me... 💌',
    content: `
      <p class="mb-3 font-serif-title text-base text-wine">My Dearest Nitu,</p>
      <p class="mb-3">Whenever distance feels heavy or you miss my voice, close your eyes and take a deep breath. Know that under the very same sky, my heart is beating solely for you.</p>
      <p class="mb-3">Ever since we last met on <strong>12th December 2025</strong>, not an hour goes by where you don't cross my mind. I am carrying you with me in every thought, every dream, and every prayer.</p>
      <p class="mb-3">Call me or message me right this instant, and let me remind you how deeply and unconditionally you are loved.</p>
      <p class="text-right font-script text-2xl text-primary mt-4">Forever your Akash ❤️</p>
    `
  },
  angry: {
    title: 'Open When You Are Mad At Akash... 🥺',
    content: `
      <p class="mb-3 font-serif-title text-base text-wine">My Sweet Nitu,</p>
      <p class="mb-3">First of all: <strong>I am so sorry!</strong> You are 100% right, and I surrender completely! 🏳️</p>
      <p class="mb-3">No ego, no silly arguments, and no pride could ever be worth more than your peaceful smile. If I made you upset, please forgive your silly Akash.</p>
      <p class="mb-3">You have 1 free "Get Out of Trouble" pass on me right now. Let me make it up to you with unlimited treats, sweet hugs, and listening to you vent for as long as you need.</p>
      <p class="text-right font-script text-2xl text-primary mt-4">Always yours, Akash 🌸</p>
    `
  },
  stressed: {
    title: 'Open When You Have Had A Tough Day... 🫂',
    content: `
      <p class="mb-3 font-serif-title text-base text-wine">My Strong Queen Nitisha,</p>
      <p class="mb-3">Take off the weight of the world from your shoulders for a moment. You don't have to carry everything alone.</p>
      <p class="mb-3">You are one of the most resilient, hard-working, and brilliant people I know. Bad days are just temporary clouds, but your light shines forever.</p>
      <p class="mb-3">Lie down, drink some water, play your favorite song, and imagine my arms wrapped tightly around you. I am so proud of you, today and every day.</p>
      <p class="text-right font-script text-2xl text-primary mt-4">Your biggest cheerleader, Akash 💖</p>
    `
  },
  beauty: {
    title: 'Open When You Need A Reminder of Your Beauty... ✨',
    content: `
      <p class="mb-3 font-serif-title text-base text-wine">To the Prettiest Girl in the World,</p>
      <p class="mb-3">Have you looked in the mirror today? Because you genuinely take my breath away every single time I look at your photos.</p>
      <p class="mb-3">It's not just your gorgeous eyes, that enchanting smile, or your radiant elegance—it's the pure kindness in your heart that makes you the most beautiful person alive.</p>
      <p class="mb-3">Never doubt how magical you are. You are the poetry Akash wants to read for the rest of his life.</p>
      <p class="text-right font-script text-2xl text-primary mt-4">Endlessly in love with you, Akash 🌹</p>
    `
  }
};

function initOpenWhenLetters() {
  const letterCards = document.querySelectorAll('.open-when-card');
  const modal = document.getElementById('letter-modal');
  const modalTitle = document.getElementById('letter-modal-title');
  const modalBody = document.getElementById('letter-modal-body');

  letterCards.forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.dataset.letter;
      const data = letterMessages[type];
      if (data && modal && modalTitle && modalBody) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modal.classList.add('active');
        if (typeof confetti === 'function') {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
        }
      }
    });
  });
}

window.closeLetterModal = function () {
  const modal = document.getElementById('letter-modal');
  if (modal) modal.classList.remove('active');
};

/* =========================================================
   13. WAX SEAL LOVE LETTER FROM AKASH
   ========================================================= */
function initWaxSealLetter() {
  const seal = document.getElementById('wax-seal-btn');
  const letterContent = document.getElementById('grand-letter-content');

  if (seal && letterContent) {
    seal.addEventListener('click', () => {
      seal.style.transform = 'scale(0.8) rotate(45deg)';
      seal.style.opacity = '0';
      setTimeout(() => {
        seal.style.display = 'none';
        letterContent.classList.remove('hidden');
        letterContent.classList.add('animate-fade-in');
        if (typeof confetti === 'function') {
          confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
        }
      }, 400);
    });
  }
}

