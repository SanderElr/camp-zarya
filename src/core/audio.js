  // --- АУДИОСИСТЕМА (МУЗЫКА И ЗВУКИ) ---
  let bgMusicEl = null;
  let musicEnabled = true;
  let musicVolume = 0.35;
  let sfxEnabled = true;

  class SoundFX {
    constructor() {
      this.ctx = null;
    }
    init() {
      if (!sfxEnabled) return;
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    playClick() {
      if (!sfxEnabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch(e) {}
    }
    playSuccess() {
      if (!sfxEnabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.setValueAtTime(660, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
      } catch(e) {}
    }
    playSplash() {
      if (!sfxEnabled || !this.ctx) return;
      try {
        const bufferSize = this.ctx.sampleRate * 0.1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        const gain = this.ctx.createGain();
        gain.gain.value = 0.25;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start();
      } catch(e) {}
    }
    playDanger() {
      if (!sfxEnabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
      } catch(e) {}
    }
  }

  const sfx = new SoundFX();

  function initAudio() {
    bgMusicEl = document.getElementById('bgMusic');
    try {
      const savedM = localStorage.getItem('camp_music_enabled');
      if (savedM !== null) musicEnabled = (savedM === 'true');
      const savedV = localStorage.getItem('camp_music_vol');
      if (savedV !== null) musicVolume = parseFloat(savedV) || 0.35;
      const savedSfx = localStorage.getItem('camp_sfx_enabled');
      if (savedSfx !== null) sfxEnabled = (savedSfx === 'true');
    } catch(e) {}

    if (bgMusicEl) {
      bgMusicEl.volume = musicVolume;
    }
    updateMusicUI();

    const startAudio = () => {
      if (musicEnabled && bgMusicEl && bgMusicEl.paused) {
        bgMusicEl.volume = musicVolume;
        bgMusicEl.play().catch(() => {});
      }
      document.removeEventListener('click', startAudio);
      document.removeEventListener('touchstart', startAudio);
      document.removeEventListener('keydown', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
    document.addEventListener('keydown', startAudio);
  }

  function toggleMusic() {
    musicEnabled = !musicEnabled;
    try {
      localStorage.setItem('camp_music_enabled', musicEnabled);
    } catch(e) {}

    if (bgMusicEl) {
      if (musicEnabled) {
        bgMusicEl.volume = musicVolume;
        bgMusicEl.play().then(() => {
          toast('🎵 Фоновая музыка включена');
        }).catch(() => {
          toast('🎵 Нажмите на экран для старта музыки');
        });
      } else {
        bgMusicEl.pause();
        toast('🔇 Фоновая музыка выключена');
      }
    }
    updateMusicUI();
  }

  function setMusicVolume(val) {
    musicVolume = Math.max(0, Math.min(1, parseFloat(val)));
    if (bgMusicEl) bgMusicEl.volume = musicVolume;
    try {
      localStorage.setItem('camp_music_vol', musicVolume);
    } catch(e) {}
    const volDisplay = document.getElementById('musicVolDisplay');
    if (volDisplay) volDisplay.textContent = Math.round(musicVolume * 100) + '%';
  }

  function updateMusicUI() {
    const icon = document.getElementById('musicIcon');
    const btn = document.getElementById('btnMusic');
    if (icon) {
      icon.textContent = musicEnabled ? '🎵' : '🔇';
    }
    if (btn) {
      if (musicEnabled) btn.classList.add('active');
      else btn.classList.remove('active');
      btn.title = musicEnabled ? 'Музыка играет (нажмите для паузы)' : 'Музыка выключена (нажмите для включения)';
    }
  }
