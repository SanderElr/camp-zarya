/* ==========================================================================
   ИГРОВОЙ ДВИЖОК: ТЕКСТОВАЯ RPG «ЛАГЕРЬ ЗАРЯ»
   ========================================================================== */

const Game = (() => {

  // --- ХРАНИЛИЩЕ БАЗЫ ПРЕДМЕТОВ ---
  const ITEMS = {
    clean_water: { id: 'clean_water', name: 'Чистая вода', type: 'food', icon: 'assets/images/water.png', weight: 0.5, desc: 'Кипячёная чистая вода в армейской фляге.', thirst: 45, rad: 0 },
    raw_water: { id: 'raw_water', name: 'Речная вода', type: 'food', icon: 'assets/images/water.png', weight: 0.5, desc: 'Мутная вода из реки Быстрянки. Опасно пить сырой!', thirst: 30, rad: 12 },
    raw_fish: { id: 'raw_fish', name: 'Сырая рыба', type: 'food', icon: 'assets/images/fish.png', weight: 0.4, desc: 'Свежепойманная речная рыба. Лучше зажарить на костре.', hunger: 15, rad: 8 },
    cooked_fish: { id: 'cooked_fish', name: 'Жареная рыба', type: 'food', icon: 'assets/images/fish.png', weight: 0.3, desc: 'Аппетитная рыба с хрустящей корочкой, запечённая на углях.', hunger: 45, rad: 0 },
    fish_soup: { id: 'fish_soup', name: 'Уха таёжная', type: 'food', icon: 'assets/images/bonfire.png', weight: 0.6, desc: 'Наваристая горячая уха с травами. Согревает и насыщает.', hunger: 60, thirst: 35, energy: 25 },
    raw_meat: { id: 'raw_meat', name: 'Сырое мясо', type: 'food', icon: 'assets/images/boar.png', weight: 0.6, desc: 'Свежая дичь. Сырой есть нельзя — риск паразитов.', hunger: 20, rad: 10 },
    cooked_meat: { id: 'cooked_meat', name: 'Жареное мясо', type: 'food', icon: 'assets/images/bonfire.png', weight: 0.5, desc: 'Сочный кусок мяса на вертеле. Прекрасно восстанавливает силы.', hunger: 55, energy: 10 },
    berries: { id: 'berries', name: 'Лесная брусника', type: 'food', icon: 'assets/images/bushes.png', weight: 0.2, desc: 'Спелые таёжные ягоды. Слегка утоляют голод и жажду.', hunger: 15, thirst: 12 },
    herbal_tea: { id: 'herbal_tea', name: 'Антирад-отвар', type: 'food', icon: 'assets/images/water.png', weight: 0.4, desc: 'Настой чабреца, полыни и хвои. Эффективно выводит радионуклиды.', thirst: 35, rad: -25, energy: 15 },
    antirad: { id: 'antirad', name: 'Цистамин (Антирад)', type: 'food', icon: 'assets/images/medicine.png', weight: 0.1, desc: 'Советский радиопротектор в таблетках.', rad: -50 },
    bandage: { id: 'bandage', name: 'Стерильный бинт', type: 'food', icon: 'assets/images/medicine.png', weight: 0.1, desc: 'Останавливает кровотечение и заживляет раны.', hp: 35 },

    // Ресурсы
    firewood: { id: 'firewood', name: 'Сухие дрова', type: 'resource', icon: 'assets/images/forest.png', weight: 1.0, desc: 'Сухой хворост для костра.' },
    herbs: { id: 'herbs', name: 'Целебные травы', type: 'resource', icon: 'assets/images/bushes.png', weight: 0.1, desc: 'Пучки душистой полыни и чабреца.' },
    scrap: { id: 'scrap', name: 'Металлолом', type: 'resource', icon: 'assets/images/boxes.png', weight: 0.8, desc: 'Болты, ржавые пластины и обрезки труб.' },
    wire: { id: 'wire', name: 'Моток проволоки', type: 'resource', icon: 'assets/images/trap.png', weight: 0.3, desc: 'Тонкая стальная струна для ловушек и ремонта.' },
    worms: { id: 'worms', name: 'Земляные черви', type: 'resource', icon: 'assets/images/forest.png', weight: 0.1, desc: 'Наживка для рыбалки.' },
    leather: { id: 'leather', name: 'Шкура зверя', type: 'resource', icon: 'assets/images/wolf.png', weight: 1.2, desc: 'Плотная шкура волка или кабана.' },

    // Инструменты и оружие
    rod: { id: 'rod', name: 'Самодельная удочка', type: 'tool', icon: 'assets/images/fish.png', weight: 0.8, desc: 'Гибкое удилище с леской и крючком из булавки.' },
    trap: { id: 'trap', name: 'Охотничий капкан', type: 'tool', icon: 'assets/images/trap.png', weight: 1.5, desc: 'Стальной капкан на мелкую и среднюю дичь.' },
    knife: { id: 'knife', name: 'Охотничий нож', type: 'tool', icon: 'assets/images/knife.png', weight: 0.4, desc: 'Острый нож из советской стали. Незаменим в лесу.' },
    toz: { id: 'toz', name: 'Ружьё ТОЗ-34', type: 'tool', icon: 'assets/images/toz.png', weight: 3.2, desc: 'Двуствольное охотничье ружье 12 калибра.' },
    ammo: { id: 'ammo', name: 'Патроны 12к (Валюта)', type: 'tool', icon: 'assets/images/ammo.png', weight: 0.05, desc: 'Ходовая валюта среди выживших и боеприпасы.' },
    filter_membrane: { id: 'filter_membrane', name: 'Керамическая мембрана', type: 'tool', icon: 'assets/images/boxes.png', weight: 1.5, desc: 'Ценнейший сменный элемент промышленного фильтра для воды.' },

    // Записки лора
    note_order: { id: 'note_order', name: 'Приказ об эвакуации', type: 'lore', icon: 'assets/images/cabin.png', weight: 0.0, desc: 'Пожелтевший бланк 1989 г. Упоминается секретный бункер НИИ «Сфера» в 8 км к северу.' },
    note_geologist: { id: 'note_geologist', name: 'Дневник геолога', type: 'lore', icon: 'assets/images/cabin.png', weight: 0.0, desc: 'Записи о странных спорах и аномальном поведении речной рыбы после взрыва на дамбе.' }
  };

  // --- РЕЦЕПТЫ КРАФТА ---
  const RECIPES = [
    {
      id: 'cook_fish', station: 'fire', name: 'Запечь рыбу на углях', icon: 'assets/images/fish.png',
      cost: { raw_fish: 1, firewood: 1 }, result: { cooked_fish: 1 }, energy: 5, timeMin: 15,
      desc: 'Превращает радиоактивную сырую рыбу в безопасную пищу.'
    },
    {
      id: 'cook_meat', station: 'fire', name: 'Зажарить кусок мяса', icon: 'assets/images/boar.png',
      cost: { raw_meat: 1, firewood: 1 }, result: { cooked_meat: 1 }, energy: 5, timeMin: 15,
      desc: 'Обеззараживает дичь на огне.'
    },
    {
      id: 'boil_water', station: 'fire', name: 'Вскипятить воду', icon: 'assets/images/water.png',
      cost: { raw_water: 1, firewood: 1 }, result: { clean_water: 1 }, energy: 5, timeMin: 10,
      desc: 'Убивает бактерии и делает речную воду пригодной для питья.'
    },
    {
      id: 'brew_tea', station: 'fire', name: 'Сварить антирад-отвар', icon: 'assets/images/water.png',
      cost: { clean_water: 1, herbs: 1, firewood: 1 }, result: { herbal_tea: 1 }, energy: 10, timeMin: 20,
      desc: 'Целебный чай от радиации по рецепту фельдшера Анны.'
    },
    {
      id: 'cook_soup', station: 'fire', name: 'Сварить уху в котелке', icon: 'assets/images/bonfire.png',
      cost: { raw_fish: 2, clean_water: 1, herbs: 1, firewood: 2 }, result: { fish_soup: 1 }, energy: 10, timeMin: 30,
      desc: 'Питательное блюдо для восстановления сил всего организма.'
    },
    {
      id: 'craft_rod', station: 'bench', name: 'Собрать удочку', icon: 'assets/images/fish.png',
      cost: { firewood: 2, wire: 1 }, result: { rod: 1 }, energy: 15, timeMin: 30,
      desc: 'Простая удочка для ловли рыбы на реке Быстрянке.'
    },
    {
      id: 'craft_trap', station: 'bench', name: 'Сколотить капкан', icon: 'assets/images/trap.png',
      cost: { scrap: 2, wire: 1 }, result: { trap: 1 }, energy: 20, timeMin: 45,
      desc: 'Ловушка для добычи мяса и ценных шкур в тайге.'
    },
    {
      id: 'craft_bandage', station: 'bench', name: 'Скрутить стерильный бинт', icon: 'assets/images/medicine.png',
      cost: { herbs: 1, wire: 0 }, result: { bandage: 1 }, energy: 5, timeMin: 10,
      desc: 'Травяная повязка для остановки кровотечений.'
    }
  ];

  // --- ЛОКАЦИИ КАРТЫ ---
  const LOCATIONS = [
    {
      id: 'river', name: 'Река Быстрянка', tier: 1, icon: 'assets/images/water.png', rad: 5, energyCost: 10, timePass: 1,
      desc: 'Бурная таёжная река. Здесь ловят рыбу, собирают тростник и набирают воду.',
      unlocked: true,
      actions: ['fish', 'gather_water', 'dig_worms']
    },
    {
      id: 'forest', name: 'Ближний лесок', tier: 1, icon: 'assets/images/forest.png', rad: 10, energyCost: 10, timePass: 1,
      desc: 'Опушка тайги вокруг лагеря. Место сбора хвороста, брусники и лекарственных трав.',
      unlocked: true,
      actions: ['gather_wood', 'gather_herbs', 'hunt_birds']
    },
    {
      id: 'pump_station', name: 'Насосная станция №4', tier: 2, icon: 'assets/images/boxes.png', rad: 25, energyCost: 20, timePass: 2,
      desc: 'Полузатопленный бетонный комплекс очистки воды. Здесь можно найти фильтры и трубы.',
      unlocked: false, reqRep: 100,
      actions: ['scavenge_station']
    },
    {
      id: 'hunting_grounds', name: 'Охотничьи угодья', tier: 2, icon: 'assets/images/trap.png', rad: 20, energyCost: 25, timePass: 2,
      desc: 'Глухой бурелом. Водятся кабаны, зайцы и волки. Нужна осторожность и оружие.',
      unlocked: false, reqRep: 150,
      actions: ['place_trap', 'hunt_big_game']
    },
    {
      id: 'radio_tower', name: 'Радиовышка на утесе', tier: 3, icon: 'assets/images/tower.png', rad: 35, energyCost: 30, timePass: 3,
      desc: 'Старая советская вышка связи. Отсюда открывается вид на всю закрытую зону.',
      unlocked: false, reqRep: 300,
      actions: ['repair_antenna']
    },
    {
      id: 'bunker', name: 'Бункер НИИ «Сфера»', tier: 3, icon: 'assets/images/hatch.png', rad: 60, energyCost: 40, timePass: 4,
      desc: 'Запечатанный подземный научный центр, ставший источником Каскада.',
      unlocked: false, reqRep: 500,
      actions: ['enter_bunker']
    }
  ];

  // --- НПС ЛАГЕРЯ ---
  const NPCS = {
    batya: {
      id: 'batya', name: 'Майор Дмитрий (Батя)', role: 'Комендант лагеря', avatar: 'assets/images/batya.png',
      desc: 'Руководит обороной лагеря и распределением припасов. Бывший военный.'
    },
    anna: {
      id: 'anna', name: 'Анна Павловна', role: 'Фельдшер-травница', avatar: 'assets/images/anna.png',
      desc: 'Лечит раненых, готовит настойки и скупает таёжные травы.'
    },
    prokhor: {
      id: 'prokhor', name: 'Прохор Кузьмич', role: 'Механик лагеря', avatar: 'assets/images/prokhor.png',
      desc: 'Заведует верстаком. Из консервной банки и проволоки соберет капкан.'
    },
    egor: {
      id: 'egor', name: 'Егор Лесник', role: 'Охотник и следопыт', avatar: 'assets/images/egor.png',
      desc: 'Знает каждый овраг в тайге. Учит ловить рыбу и ставить силки.'
    }
  };

  // --- ИГРОВОЕ СОСТОЯНИЕ (STATE) ---
  const INITIAL_STATE = {
    hp: 100,
    hunger: 80,
    thirst: 75,
    rad: 5,
    energy: 100,
    day: 1,
    timeOfDay: 0, // 0: Утро, 1: День, 2: Вечер, 3: Ночь
    reputation: 15, // Репутация в лагере
    invFilter: 'all',
    craftStation: 'fire',
    questView: 'main',
    inventory: {
      clean_water: 1,
      firewood: 2,
      knife: 1,
      ammo: 5
    },
    maxWeight: 20.0,
    trapsSet: 0,
    mainQuestStep: 0,
    questFlags: {
      met_batya: false,
      met_anna: false,
      met_egor: false,
      met_prokhor: false,
      has_membrane: false,
      pump_repaired: false,
      radio_repaired: false,
      bunker_completed: false
    },
    dailyQuests: [],
    loreNotes: ['note_order'],
    unlockedLocations: ['river', 'forest'],
    introSeen: false
  };

  let state = JSON.parse(JSON.stringify(INITIAL_STATE));

  const TIME_NAMES = ['Утро', 'День', 'Вечер', 'Ночь'];

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

  // --- ИНИЦИАЛИЗАЦИЯ И ОБНОВЛЕНИЕ UI ---
  function init() {
    initAudio();
    loadSavedState();
    generateDailyQuestsIfNeeded();
    updateHUD();
    renderNPCs();
    renderLocations();
    renderInventory();
    renderRecipes();
    renderQuests();

    if (!state.introSeen) {
      showIntroScreen();
    } else {
      hideIntroScreen();
      toast('🏕️ Добро пожаловать обратно в Лагерь «Заря»!');
    }
  }

  function getReputationTitle(rep) {
    if (rep < 100) return `Чужак (${rep})`;
    if (rep < 300) return `Свой (${rep})`;
    if (rep < 600) return `Уважаемый (${rep})`;
    return `Опора лагеря (${rep})`;
  }

  function updateHUD() {
    // Числовые показатели
    document.getElementById('statHp').textContent = Math.round(state.hp);
    document.getElementById('statHunger').textContent = Math.round(state.hunger) + '%';
    document.getElementById('statThirst').textContent = Math.round(state.thirst) + '%';
    document.getElementById('statRad').textContent = Math.round(state.rad) + ' Р';
    document.getElementById('statEnergy').textContent = Math.round(state.energy) + '%';
    document.getElementById('statRep').textContent = getReputationTitle(state.reputation);
    document.getElementById('hudTime').textContent = `День ${state.day}, ${TIME_NAMES[state.timeOfDay]}`;

    // Прогресс-бары
    document.getElementById('barHp').style.width = Math.max(0, state.hp) + '%';
    document.getElementById('barHunger').style.width = Math.max(0, state.hunger) + '%';
    document.getElementById('barThirst').style.width = Math.max(0, state.thirst) + '%';
    document.getElementById('barRad').style.width = Math.min(100, (state.rad / 80) * 100) + '%';
    document.getElementById('barEnergy').style.width = Math.max(0, state.energy) + '%';

    // Подсчет веса
    let currentWeight = 0;
    for (const [itemId, count] of Object.entries(state.inventory)) {
      if (ITEMS[itemId] && count > 0) {
        currentWeight += ITEMS[itemId].weight * count;
      }
    }
    const weightEl = document.getElementById('weightBadge');
    if (weightEl) {
      weightEl.textContent = `Вес: ${currentWeight.toFixed(1)} / ${state.maxWeight.toFixed(1)} кг`;
      if (currentWeight > state.maxWeight) {
        weightEl.style.color = 'var(--accent-danger)';
        weightEl.textContent += ' [ПЕРЕГРУЗ!]';
      } else {
        weightEl.style.color = 'var(--text-dim)';
      }
    }

    saveState();
  }

  // Переход времени и естественная трата ресурсов
  function passTime(steps = 1, hungerCost = 5, thirstCost = 8) {
    state.timeOfDay += steps;
    while (state.timeOfDay >= 4) {
      state.timeOfDay -= 4;
      state.day += 1;
      onNewDay();
    }

    state.hunger = Math.max(0, state.hunger - hungerCost * steps);
    state.thirst = Math.max(0, state.thirst - thirstCost * steps);

    // Урон от истощения или сильной радиации
    if (state.hunger === 0) {
      state.hp = Math.max(0, state.hp - 8 * steps);
      toast('⚠️ Вы умираете от голода!');
    }
    if (state.thirst === 0) {
      state.hp = Math.max(0, state.hp - 12 * steps);
      toast('⚠️ Обезвоживание отнимает здоровье!');
    }
    if (state.rad >= 70) {
      state.hp = Math.max(0, state.hp - 6 * steps);
      toast('☢️ Острая лучевая болезнь сжигает тело!');
    }

    // Проверка гибели
    if (state.hp <= 0) {
      showDeathModal();
      return;
    }

    updateHUD();
  }

  function onNewDay() {
    toast(`🌅 Наступил День ${state.day}. Лагерь просыпается.`);
    generateDailyQuestsIfNeeded(true);
    // Проверка ловушек
    if (state.trapsSet > 0) {
      const caughtMeat = Math.floor(Math.random() * state.trapsSet * 2) + 1;
      addItem('raw_meat', caughtMeat);
      addItem('leather', Math.floor(caughtMeat / 2));
      toast(`🏹 В установленные капканы попалась дичь (+${caughtMeat} мяса)!`);
    }
  }

  function showDeathModal() {
    openModal(
      'СМЕРТЬ В ТАЙГЕ',
      'Жизненные показатели на нуле',
      'assets/images/rad_icon.png',
      `<p>Ваше тело не выдержало суровых законов постапокалиптической тайги. Вы погибли от истощения или ран.</p>
       <p>Лагерь «Заря» продолжит борьбу за выживание, но уже без вас...</p>`,
      [{ text: 'Начать заново', action: resetGame, primary: true }]
    );
  }

  // --- УПРАВЛЕНИЕ ИНВЕНТАРЕМ ---
  function addItem(itemId, count = 1) {
    if (!ITEMS[itemId]) return;
    state.inventory[itemId] = (state.inventory[itemId] || 0) + count;
    renderInventory();
    updateHUD();
  }

  function removeItem(itemId, count = 1) {
    if (!state.inventory[itemId]) return false;
    if (state.inventory[itemId] < count) return false;
    state.inventory[itemId] -= count;
    if (state.inventory[itemId] <= 0) {
      delete state.inventory[itemId];
    }
    renderInventory();
    updateHUD();
    return true;
  }

  function getItemCount(itemId) {
    return state.inventory[itemId] || 0;
  }

  function useItem(itemId) {
    sfx.init();
    sfx.playClick();
    const item = ITEMS[itemId];
    if (!item) return;

    if (item.type === 'food') {
      if (item.hunger) state.hunger = Math.min(100, state.hunger + item.hunger);
      if (item.thirst) state.thirst = Math.min(100, state.thirst + item.thirst);
      if (item.hp) state.hp = Math.min(100, state.hp + item.hp);
      if (item.rad) state.rad = Math.max(0, state.rad + item.rad);
      if (item.energy) state.energy = Math.min(100, state.energy + item.energy);

      removeItem(itemId, 1);
      toast(`Использовано: ${item.name}`);
      updateHUD();
      closeModal();
    } else if (item.type === 'lore') {
      openModal(item.name, 'Запись из прошлого', item.icon, `<p>${item.desc}</p>`);
    }
  }

  function renderInventory() {
    const grid = document.getElementById('inventoryGrid');
    grid.innerHTML = '';

    const entries = Object.entries(state.inventory).filter(([id, count]) => count > 0);
    if (entries.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color:var(--text-dim); padding:20px;">Вещмешок пуст</div>';
      return;
    }

    entries.forEach(([id, count]) => {
      const item = ITEMS[id];
      if (!item) return;

      // Фильтр
      if (state.invFilter !== 'all' && item.type !== state.invFilter) return;

      const card = document.createElement('div');
      card.className = 'inv-item-card';
      card.innerHTML = `
        <img src="${item.icon}" class="inv-item-icon pixel-art" alt="">
        <span class="inv-item-name">${item.name}</span>
        <span class="inv-item-count">× ${count}</span>
      `;
      card.onclick = () => showItemModal(item, count);
      grid.appendChild(card);
    });
  }

  function showItemModal(item, count) {
    sfx.init();
    sfx.playClick();
    let body = `<p>${item.desc}</p>`;
    body += `<p style="font-size:11px; color:var(--text-dim); margin-top:6px;">Вес 1 шт: ${item.weight} кг | Всего в сумке: ${count} шт.</p>`;

    const actions = [];
    if (item.type === 'food') {
      actions.push({ text: 'Использовать / Съесть', action: () => useItem(item.id), primary: true });
    }
    if (item.type === 'lore') {
      actions.push({ text: 'Прочесть внимательнее', action: () => {}, primary: true });
    }

    openModal(item.name, 'Снаряжение', item.icon, body, actions);
  }

  function filterInv(type) {
    sfx.init();
    sfx.playClick();
    state.invFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderInventory();
  }

  // --- ЛАГЕРЬ И НПС ---
  function renderNPCs() {
    const list = document.getElementById('npcList');
    list.innerHTML = '';

    Object.values(NPCS).forEach(npc => {
      const card = document.createElement('div');
      card.className = 'npc-card';
      card.innerHTML = `
        <img src="${npc.avatar}" class="npc-avatar pixel-art" alt="">
        <div class="npc-info">
          <div class="npc-header-row">
            <span class="npc-name">${npc.name}</span>
            <span class="npc-role">${npc.role}</span>
          </div>
          <p class="npc-desc">${npc.desc}</p>
        </div>
      `;
      card.onclick = () => talkToNPC(npc.id);
      list.appendChild(card);
    });
  }

  function talkToNPC(npcId) {
    sfx.init();
    sfx.playClick();
    const npc = NPCS[npcId];
    if (!npc) return;

    if (!state.questFlags) {
      state.questFlags = {
        met_batya: false,
        met_anna: false,
        met_egor: false,
        met_prokhor: false,
        has_membrane: false,
        pump_repaired: false,
        radio_repaired: false,
        bunker_completed: false
      };
    }
    state.questFlags['met_' + npcId] = true;

    if (npcId === 'batya') {
      talkBatya();
    } else if (npcId === 'anna') {
      talkAnna();
    } else if (npcId === 'prokhor') {
      talkProkhor();
    } else if (npcId === 'egor') {
      talkEgor();
    }
  }

  function checkStarterQuestProgress() {
    if (state.mainQuestStep === 1 && state.questFlags.met_anna && state.questFlags.met_egor) {
      toast('⭐ Вы познакомились с жителями лагеря! Вернитесь к Бате для доклада.');
      sfx.playSuccess();
      renderQuests();
    }
  }

  function talkBatya() {
    const npc = NPCS.batya;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_batya = true;

    let body = `<p>Майор стоит у карты района, скрестив руки на груди. В глазах читается усталость, но голос звенит металлом.</p>`;
    body += `<p><i>«Ну что, боец. Лагерь "Заря" — последнее место, где люди живут по-человечески. Если готов помогать общине, работа всегда найдётся.»</i></p>`;

    const actions = [];

    // Шаг 0: Стартовый инструктаж
    if (state.mainQuestStep === 0) {
      const alreadyMetOthers = state.questFlags.met_anna || state.questFlags.met_egor || state.questFlags.met_prokhor;
      if (alreadyMetOthers) {
        body += `<p style="color:var(--accent-gold);"><i>«Вижу, ты парень расторопный — уже успел перекинуться парой слов с нашими. Это похвально. Держись общины, и тайга тебя не сломит.»</i></p>`;
      }
      body += `<p style="color:var(--accent-gold);"><b>[СЮЖЕТНОЕ ЗАДАНИЕ]:</b> Батя предлагает пройти инструктаж, получить стартовый паёк и официально вступить в общину «Заря».</p>`;
      actions.push({
        text: '«Я готов служить лагерю. С чего начать?»',
        action: () => {
          state.mainQuestStep = 1;
          state.reputation += 10;
          addItem('clean_water', 1);
          addItem('ammo', 3);
          toast('⭐ Задание начато: «Знакомство с общиной» (+10 репутации, фляга воды, 3 патрона)!');
          sfx.playSuccess();
          updateHUD();
          closeModal();
          renderQuests();
          if (state.questFlags.met_anna && state.questFlags.met_egor) {
            setTimeout(() => {
              toast('⭐ Вы уже знакомы с Анной и Егором! Можете сразу доложить Бате.');
            }, 1000);
          }
        },
        primary: true
      });
    }
    // Шаг 1: Знакомство с общиной
    else if (state.mainQuestStep === 1) {
      const annaDone = !!state.questFlags.met_anna;
      const egorDone = !!state.questFlags.met_egor;
      const allDone = annaDone && egorDone;

      body += `<div style="background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px; margin:8px 0; border:1px solid rgba(255,255,255,0.12);">`;
      body += `<b style="color:var(--accent-gold); font-size:12px;">📋 Задачи инструктажа:</b><br>`;
      body += `• Фельдшер Анна (лазарет): ${annaDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}<br>`;
      body += `• Охотник Егор (река): ${egorDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}`;
      body += `</div>`;

      if (allDone) {
        body += `<p style="color:var(--accent-green);"><i>«Анна и Егор уже передали, что ты надёжный человек. Осмотр лагеря окончен. Теперь пора переходить к настоящему делу!»</i></p>`;
        actions.push({
          text: '⭐ «Доложить об осмотре лагеря (Завершить квест)»',
          action: () => {
            state.mainQuestStep = 2;
            state.reputation += 15;
            addItem('ammo', 3);
            if (!state.unlockedLocations.includes('pump_station')) {
              state.unlockedLocations.push('pump_station');
            }
            toast('⭐ Квест завершён: «Знакомство с общиной» (+15 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            renderLocations();
            renderQuests();
            closeModal();
            setTimeout(() => talkBatya(), 300);
          },
          primary: true
        });
      } else {
        body += `<p><i>«Обойди лагерь, боец. Загляни к Анне в лазарет за наставлением по медицине и к Егору на берег реки — он покажет, как добывать рыбу.»</i></p>`;
        actions.push({
          text: '«Батя, я уже знаю всех жителей и готов к делу!»',
          action: () => {
            state.questFlags.met_anna = true;
            state.questFlags.met_egor = true;
            state.mainQuestStep = 2;
            state.reputation += 15;
            addItem('ammo', 3);
            if (!state.unlockedLocations.includes('pump_station')) {
              state.unlockedLocations.push('pump_station');
            }
            toast('⭐ Зачтено: Знакомство с общиной (+15 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            renderLocations();
            renderQuests();
            closeModal();
            setTimeout(() => talkBatya(), 300);
          }
        });
      }
    }
    // Шаг 2: Кризис чистой воды (поиск мембраны)
    else if (state.mainQuestStep === 2) {
      const hasMembrane = getItemCount('filter_membrane') > 0 || state.questFlags.has_membrane;

      if (!hasMembrane) {
        body += `<p style="color:var(--accent-gold);"><b>[СЮЖЕТНОЕ ЗАДАНИЕ: «Кризис чистой воды»]:</b></p>`;
        body += `<p><i>«У нас чрезвычайное положение. Колодцы лагеря тянут глину и радиоактивный ил. Сходи на Насосную станцию №4 (на карте) и принеси запасную керамическую мембрану очистки.»</i></p>`;
        actions.push({
          text: '🗺️ «Я отправляюсь на Насосную станцию №4»',
          action: () => {
            if (!state.unlockedLocations.includes('pump_station')) {
              state.unlockedLocations.push('pump_station');
            }
            closeModal();
            switchTab('tabMap');
            renderLocations();
          },
          primary: true
        });
      } else {
        body += `<p style="color:var(--accent-green);"><b>[МЕМБРАНА ДОБЫТА!]:</b></p>`;
        body += `<p><i>«Ты нашёл её! С этой мембраной Прохор запустит станцию тонкой очистки. Лагерь спасён от жажды и лучевой болезни!»</i></p>`;
        actions.push({
          text: '⭐ «Сдать керамическую мембрану Бате (Завершить квест)»',
          action: () => {
            if (getItemCount('filter_membrane') > 0) {
              removeItem('filter_membrane', 1);
            }
            state.questFlags.pump_repaired = true;
            state.mainQuestStep = 3;
            state.reputation += 30;
            addItem('ammo', 5);
            addItem('clean_water', 2);
            if (!state.unlockedLocations.includes('radio_tower')) {
              state.unlockedLocations.push('radio_tower');
            }
            if (!state.unlockedLocations.includes('hunting_grounds')) {
              state.unlockedLocations.push('hunting_grounds');
            }
            toast('⭐ Квест выполнен: «Кризис чистой воды» (+30 репутации, +5 патронов, +2 воды)!');
            sfx.playSuccess();
            updateHUD();
            renderLocations();
            renderQuests();
            closeModal();
            setTimeout(() => talkBatya(), 300);
          },
          primary: true
        });
      }
    }
    // Шаг 3: Эхо в эфире (ремонт радиовышки)
    else if (state.mainQuestStep === 3) {
      const radioOk = !!(state.questFlags && state.questFlags.radio_repaired);
      const scrapCount = getItemCount('scrap');
      const wireCount = getItemCount('wire');

      if (!radioOk) {
        body += `<p style="color:var(--accent-gold);"><b>[СЮЖЕТНОЕ ЗАДАНИЕ: «Эхо в эфире»]:</b></p>`;
        body += `<p><i>«Вода теперь есть, но мы слепы и глухи в тайге. На скальном утесе стоит старая Радиовышка. Почини её антенну (требуется 3 металлолома и 2 проволоки). Мы обязаны перехватить частоты других выживших!»</i></p>`;
        body += `<div style="background:rgba(0,0,0,0.3); padding:8px 10px; border-radius:6px; margin:8px 0; font-size:12px;">`;
        body += `<b style="color:var(--accent-gold);">Необходимые материалы:</b><br>`;
        body += `• Металлолом: <b>${scrapCount} / 3</b> ${scrapCount >= 3 ? '✅' : '❌ (ищите на Насосной станции №4)'}<br>`;
        body += `• Моток проволоки: <b>${wireCount} / 2</b> ${wireCount >= 2 ? '✅' : '❌ (купите у Прохора или найдите на станции)'}`;
        body += `</div>`;

        if (scrapCount >= 3 && wireCount >= 2) {
          actions.push({
            text: '📡 «Батя, у меня с собой проволока и лом. Смонтировать антенну!»',
            action: () => {
              removeItem('scrap', 3);
              removeItem('wire', 2);
              if (!state.questFlags) state.questFlags = {};
              state.questFlags.radio_repaired = true;
              toast('⭐ Антенна радиовышки восстановлена! Принят сигнал выживших!');
              sfx.playSuccess();
              updateHUD();
              saveState();
              renderQuests();
              closeModal();
              setTimeout(() => talkBatya(), 300);
            },
            primary: true
          });
        }

        actions.push({
          text: '🗺️ «Выдвигаюсь к Радиовышке на утесе»',
          action: () => {
            if (!state.unlockedLocations.includes('radio_tower')) {
              state.unlockedLocations.push('radio_tower');
            }
            closeModal();
            switchTab('tabMap');
            renderLocations();
          },
          primary: !(scrapCount >= 3 && wireCount >= 2)
        });
      } else {
        body += `<p style="color:var(--accent-green);"><b>[СИГНАЛ ПЕРЕХВАЧЕН!]:</b></p>`;
        body += `<p><i>«Эфир заговорил! Антенна перехватила аварийный радиомаяк из запечатанного Бункера НИИ «Сфера»! Там хранится автономный генератор, архив исследований и медикаменты. Вот ключ-карта от гермодвери и охотничий ТОЗ-34 для защиты.»</i></p>`;
        actions.push({
          text: '⭐ «Принять координаты Бункера «Сфера» (Завершить квест)»',
          action: () => {
            state.mainQuestStep = 4;
            state.reputation += 50;
            addItem('ammo', 10);
            if (getItemCount('toz') === 0) {
              addItem('toz', 1);
            }
            if (!state.unlockedLocations.includes('bunker')) {
              state.unlockedLocations.push('bunker');
            }
            toast('⭐ Квест выполнен: «Эхо в эфире» (+50 репутации, +10 патронов, ТОЗ-34)!');
            sfx.playSuccess();
            updateHUD();
            renderLocations();
            renderQuests();
            closeModal();
            setTimeout(() => talkBatya(), 300);
          },
          primary: true
        });
      }
    }
    // Шаг 4: Секрет Бункера «Сфера»
    else if (state.mainQuestStep === 4) {
      const bunkerOk = !!state.questFlags.bunker_completed;

      if (!bunkerOk) {
        body += `<p style="color:var(--accent-gold);"><b>[СЮЖЕТНОЕ ЗАДАНИЕ: «Секрет Бункера «Сфера»»]:</b></p>`;
        body += `<p><i>«Бункер «Сфера» открыт, но радиационный фон там чудовищный. Запасись цистамином у Анны, заряди ТОЗ-34 патронами и проникни вглубь комплекса. Раскрой тайну Катастрофы!»</i></p>`;
        actions.push({
          text: '🗺️ «Выдвигаюсь на штурм Бункера «Сфера»»',
          action: () => {
            if (!state.unlockedLocations.includes('bunker')) {
              state.unlockedLocations.push('bunker');
            }
            closeModal();
            switchTab('tabMap');
            renderLocations();
          },
          primary: true
        });
      } else {
        body += `<p style="color:var(--accent-green);"><b>[ТРИУМФ «ЗАРИ»!]:</b></p>`;
        body += `<p><i>«ТЫ ВЕРНУЛСЯ ЖИВЫМ! Научные архивы спасены, фильтрационные узлы подключены к резервному питанию. Отныне лагерь "Заря" — неприступный оплот жизни в мёртвой тайге! Ты — наш герой!»</i></p>`;
        actions.push({
          text: '🏆 «Принять почести Героя лагеря «Заря» (Финал сюжета)»',
          action: () => {
            state.mainQuestStep = 5;
            state.reputation += 100;
            addItem('ammo', 20);
            toast('🏆 СЮЖЕТНАЯ ЛИНИЯ ПОЛНОСТЬЮ ЗАВЕРШЕНА! ВЫ — ГЕРОЙ ЗАРЯ!');
            sfx.playSuccess();
            updateHUD();
            renderQuests();
            closeModal();
            showVictoryScreen();
          },
          primary: true
        });
      }
    }
    // Шаг 5+: Финал и свободная игра
    else {
      body += `<p style="color:var(--accent-gold);"><b>[ГЕРОЙ ЛАГЕРЯ «ЗАРЯ»]:</b></p>`;
      body += `<p><i>«Здравствуй, легенда! О твоих подвигах у каждого костра говорят. Лагерь в безопасности благодаря тебе. Тайга всегда рада храбрецам — продолжай вылазки и держи порох сухим.»</i></p>`;
    }

    body += `<p style="font-size:11px; color:var(--text-dim); margin-top:10px;">Ваша репутация у Бати: ${getReputationTitle(state.reputation)} (${state.reputation} очков)</p>`;
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  function talkAnna() {
    const npc = NPCS.anna;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_anna = true;

    let body = `<p>В медицинском вагончике приятно пахнет сушеной мятой и спиртом. Анна перевязывает жгут и тепло улыбается.</p>`;
    body += `<p><i>«Здравствуй! Главное в тайге — не пей сырую воду из реки и не хватай фонящие ягоды. Если накопишь радиацию — я сварю тебе отвар или дам цистамин.»</i></p>`;

    const actions = [];

    // Квестовая ветка шага 1
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[СЮЖЕТ]:</b> Анна осматривает вас с ног до головы: <i>«Батя предупредил, что ты новенький. В тайге береги здоровье — радиация не прощает беспечности.»</i></p>`;
      actions.push({
        text: '«Батя велел познакомиться с лазаретом. Рад встрече, Анна Павловна!»',
        action: () => {
          state.questFlags.met_anna = true;
          toast('⭐ Знакомство с фельдшером Анной зачтено!');
          sfx.playSuccess();
          checkStarterQuestProgress();
          talkAnna();
        },
        primary: true
      });
    }

    actions.push(
      {
        text: 'Перевязать раны (Восстановить HP до 100 за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            state.hp = 100;
            toast('Анна обработала ваши раны (+100% HP)');
            sfx.playSuccess();
            updateHUD();
            closeModal();
          } else {
            toast('Недостаточно патронов (нужно 2 шт.)');
          }
        }
      },
      {
        text: 'Купить цистамин от радиации (за 3 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 3) {
            removeItem('ammo', 3);
            addItem('antirad', 1);
            toast('Куплен цистамин');
            sfx.playSuccess();
            closeModal();
          } else {
            toast('Недостаточно патронов (нужно 3 шт.)');
          }
        }
      },
      {
        text: 'Сдать пучок трав в лазарет (+5 репутации, +1 патрон)',
        action: () => {
          if (getItemCount('herbs') >= 1) {
            removeItem('herbs', 1);
            addItem('ammo', 1);
            state.reputation += 5;
            toast('Анна поблагодарила за травы (+5 репутации, +1 патрон)');
            sfx.playSuccess();
            closeModal();
          } else {
            toast('У вас нет целебных трав в рюкзаке.');
          }
        }
      }
    );

    checkStarterQuestProgress();
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  function talkProkhor() {
    const npc = NPCS.prokhor;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_prokhor = true;

    let body = `<p>Кузьмич орудует напильником над куском рельса. Под ногами гора стружки и шестеренок.</p>`;
    body += `<p><i>«Чего стоишь как чужой? Если руки из нужного места — подходи к верстаку, делай капканы да удочки. Принесешь металлолом — по рукам ударим.»</i></p>`;

    const actions = [];

    if (state.mainQuestStep === 3) {
      body += `<p style="color:var(--accent-gold);"><b>[СОВЕТ МЕХАНИКА]:</b> <i>«Батя велел тебе антенну починить? Возьми 3 металлолома и 2 мотка проволоки. Если не хватает — могу продать проволоку.»</i></p>`;
    }

    actions.push(
      {
        text: 'Улучшить вещмешок до 25 кг (за 5 металлолома)',
        action: () => {
          if (state.maxWeight >= 25) {
            toast('Вещмешок уже улучшен!');
          } else if (getItemCount('scrap') >= 5) {
            removeItem('scrap', 5);
            state.maxWeight = 25.0;
            toast('Кузьмич расширил ваш вещмешок до 25 кг!');
            sfx.playSuccess();
            updateHUD();
            closeModal();
          } else {
            toast('Нужно 5 ед. металлолома.');
          }
        }
      },
      {
        text: 'Купить моток сталистой проволоки (за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            addItem('wire', 1);
            toast('Куплена проволока');
            sfx.playSuccess();
            closeModal();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      }
    );

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  function talkEgor() {
    const npc = NPCS.egor;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_egor = true;

    let body = `<p>Егор чистит шкуру зайца за деревянным столом. Рядом лежит старая двустволка и плетёные верши.</p>`;
    body += `<p><i>«Тайга любит терпеливых. У реки червей накопай, удочку сооруди — голодным никогда не останешься. А будешь в чаще — смотри под ноги, волчьих следов полно.»</i></p>`;

    const actions = [];

    // Квестовая ветка шага 1
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[СЮЖЕТ]:</b> Егор кивает вам: <i>«Батя говорил про тебя. Держись ближе к реке, учись ловить рыбу — тогда не пропадёшь.»</i></p>`;
      actions.push({
        text: '«Батя велел перенять таёжный опыт. Рад знакомству, Егор!»',
        action: () => {
          state.questFlags.met_egor = true;
          toast('⭐ Знакомство с охотником Егором зачтено!');
          sfx.playSuccess();
          checkStarterQuestProgress();
          talkEgor();
        },
        primary: true
      });
    }

    actions.push(
      {
        text: 'Взять горсть червей для рыбалки (бесплатно)',
        action: () => {
          addItem('worms', 3);
          toast('Егор отсыпал 3 червя для наживки.');
          sfx.playSuccess();
          closeModal();
        }
      },
      {
        text: 'Сдать 2 сырые рыбы для общего котла (+10 репутации, +2 патрона)',
        action: () => {
          if (getItemCount('raw_fish') >= 2) {
            removeItem('raw_fish', 2);
            addItem('ammo', 2);
            state.reputation += 10;
            toast('Егор принял рыбу в общую кухню (+10 репутации)');
            sfx.playSuccess();
            closeModal();
          } else {
            toast('Нужно минимум 2 рыбы.');
          }
        }
      }
    );

    checkStarterQuestProgress();
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // --- ДЕЙСТВИЯ В ЛАГЕРЕ ---
  function restAtCamp() {
    sfx.init();
    sfx.playClick();
    if (state.energy >= 95) {
      toast('Вы полны сил и не хотите спать!');
      return;
    }

    state.energy = Math.min(100, state.energy + 50);
    state.hp = Math.min(100, state.hp + 10);
    passTime(1, 8, 12);
    toast('💤 Вы отдохнули в бараке (+50% энергии, прошло время).');
  }

  function openCampFire() {
    sfx.init();
    sfx.playClick();
    switchTab('tabCraft');
    switchCraftStation('fire');
    toast('Вы подошли к лагерному костру.');
  }

  // --- ЛОКАЦИИ И АКТИВНОСТИ ВЫЛАЗКИ ---
  function renderLocations() {
    const grid = document.getElementById('locationsGrid');
    grid.innerHTML = '';

    LOCATIONS.forEach(loc => {
      // Проверка открытия
      const isUnlocked = loc.unlocked || state.unlockedLocations.includes(loc.id) || (loc.reqRep && state.reputation >= loc.reqRep);
      if (isUnlocked && !state.unlockedLocations.includes(loc.id)) {
        state.unlockedLocations.push(loc.id);
      }

      const item = document.createElement('div');
      item.className = `location-item ${isUnlocked ? 'unlocked' : 'locked'}`;
      item.innerHTML = `
        <div class="loc-icon-box">
          <img src="${loc.icon}" class="pixel-art" alt="">
        </div>
        <div class="loc-details">
          <div class="loc-title">
            <span>${loc.name}</span>
            <span class="loc-rad-tag">☢️ ${loc.rad} Р/ч</span>
          </div>
          <p class="loc-desc">${isUnlocked ? loc.desc : `🔒 Закрыто. Требуется репутация ${loc.reqRep || 'по сюжету'}`}</p>
          <div class="loc-features">
            <span class="feat-pill">Тир ${loc.tier}</span>
            <span class="feat-pill">⚡ -${loc.energyCost}% энергии</span>
          </div>
        </div>
      `;

      if (isUnlocked) {
        item.onclick = () => openLocationModal(loc);
      }
      grid.appendChild(item);
    });
  }

  function openLocationModal(loc) {
    sfx.init();
    sfx.playClick();
    let body = `<p>${loc.desc}</p>`;
    body += `<p style="font-size:11px; color:var(--text-dim); margin-top:6px;">Радиационный фон: ${loc.rad} Р/ч | Затраты сил: ${loc.energyCost}%</p>`;

    const actions = [];

    // Действия на реке
    if (loc.id === 'river') {
      actions.push({
        text: '🎣 Рыбачить на удочку (нужна удочка и наживка)',
        action: () => doFishing(loc),
        primary: true
      });
      actions.push({
        text: '💧 Набрать речной воды во флягу',
        action: () => doGatherWater(loc)
      });
      actions.push({
        text: '🪱 Накопать земляных червей во влажном иле',
        action: () => doDigWorms(loc)
      });
    }

    // Действия в лесу
    if (loc.id === 'forest') {
      actions.push({
        text: '🌲 Заготовить сухие дрова',
        action: () => doGatherWood(loc),
        primary: true
      });
      actions.push({
        text: '🌿 Собрать травы и бруснику',
        action: () => doGatherHerbs(loc)
      });
      actions.push({
        text: '🏹 Поставить силок на куропаток',
        action: () => doPlaceSnare(loc)
      });
    }

    // Насосная станция
    if (loc.id === 'pump_station') {
      actions.push({
        text: '🔍 Обыскать цех фильтрации (поиск мембраны)',
        action: () => doScavengeStation(loc),
        primary: true
      });
    }

    // Охотничьи угодья
    if (loc.id === 'hunting_grounds') {
      actions.push({
        text: '🪤 Установить капкан на крупного зверя',
        action: () => doSetBigTrap(loc),
        primary: true
      });
      actions.push({
        text: '🐗 Активная охота в тайге',
        action: () => doActiveHunt(loc)
      });
    }

    // Радиовышка
    if (loc.id === 'radio_tower') {
      const isRepaired = !!(state.questFlags && state.questFlags.radio_repaired);
      const scrapCount = getItemCount('scrap');
      const wireCount = getItemCount('wire');
      const hasEnough = scrapCount >= 3 && wireCount >= 2 && state.energy >= loc.energyCost;

      if (!isRepaired) {
        body += `
          <div style="background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:8px 10px; margin:8px 0; font-size:12px;">
            <b style="color:var(--accent-gold);">📡 Материалы для ремонта антенны:</b>
            <div style="margin-top:5px; display:flex; flex-direction:column; gap:4px;">
              <div style="color:${scrapCount >= 3 ? 'var(--accent-green)' : 'var(--accent-danger)'};">
                ${scrapCount >= 3 ? '✅' : '❌'} Металлолом: <b>${scrapCount} / 3</b> ${scrapCount < 3 ? '<span style="font-size:10px; opacity:0.8;">(ищите на Насосной станции №4)</span>' : ''}
              </div>
              <div style="color:${wireCount >= 2 ? 'var(--accent-green)' : 'var(--accent-danger)'};">
                ${wireCount >= 2 ? '✅' : '❌'} Моток проволоки: <b>${wireCount} / 2</b> ${wireCount < 2 ? '<span style="font-size:10px; opacity:0.8;">(купите у Прохора или найдите на станции)</span>' : ''}
              </div>
              <div style="color:${state.energy >= loc.energyCost ? 'var(--accent-green)' : 'var(--accent-danger)'};">
                ${state.energy >= loc.energyCost ? '✅' : '❌'} Энергия: <b>${Math.round(state.energy)}% / ${loc.energyCost}%</b> ${state.energy < loc.energyCost ? '<span style="font-size:10px; opacity:0.8;">(отдохните в бараке)</span>' : ''}
              </div>
            </div>
          </div>
        `;

        actions.push({
          text: hasEnough 
            ? '📡 Восстановить антенну (3 лома, 2 проволоки)' 
            : '⚠️ Починить антенну (не хватает ресурсов)',
          action: () => doRepairAntenna(loc),
          primary: hasEnough
        });

        if (wireCount < 2) {
          actions.push({
            text: '🔧 Купить проволоку у Прохора в лагере (2 патрона/шт)',
            action: () => {
              closeModal();
              switchTab('tabCamp');
              talkToNPC('prokhor');
            }
          });
        }
      } else {
        body += `<div style="background:rgba(30,50,35,0.5); border:1px solid var(--accent-green); border-radius:6px; padding:6px 10px; margin:8px 0; color:var(--accent-green); font-size:12px;">
          ✓ Антенна связи восстановлена! Принят аварийный сигнал НИИ «Сфера».
        </div>`;
        actions.push({
          text: '📻 Прослушать радиоэфир',
          action: () => {
            sfx.init();
            sfx.playSuccess();
            toast('📻 «...всем выжившим... аварийный маяк НИИ Сфера активен... сектор 7...»');
          }
        });
      }
      actions.push({
        text: '🔭 Осмотреть таёжные просторы с высоты',
        action: () => doLookoutRadioTower(loc)
      });
    }

    // Бункер
    if (loc.id === 'bunker') {
      if (!state.questFlags || !state.questFlags.bunker_completed) {
        actions.push({
          text: '🚪 Вскрыть гермодверь и зачистить Бункер',
          action: () => doEnterBunker(loc),
          primary: true
        });
      } else {
        actions.push({
          text: '📦 Осмотреть склады Бункера',
          action: () => doScavengeBunker(loc),
          primary: true
        });
      }
    }

    openModal(loc.name, `Вылазка в Тир ${loc.tier}`, loc.icon, body, actions);
  }

  // --- КОНКРЕТНЫЕ АКТИВНОСТИ ---
  function doFishing(loc) {
    if (state.energy < loc.energyCost) {
      toast('Недостаточно сил для рыбалки!');
      return;
    }
    if (getItemCount('rod') < 1) {
      toast('У вас нет удочки! Скрафтите её на верстаке.');
      return;
    }
    if (getItemCount('worms') < 1) {
      toast('Нет наживки! Накопайте червей у берега.');
      return;
    }

    sfx.init();
    sfx.playSplash();
    removeItem('worms', 1);
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    passTime(1);

    const roll = Math.random();
    if (roll > 0.3) {
      addItem('raw_fish', 1);
      toast('🐟 Отличный клёв! Вы поймали крупную речную рыбу.');
      sfx.playSuccess();
    } else if (roll > 0.1) {
      addItem('scrap', 1);
      toast('👢 Со дна выловлен ржавый металлолом.');
    } else {
      toast('Рыба сорвалась с крючка.');
    }

    checkDailyProgress('fish', 1);
    closeModal();
  }

  function doGatherWater(loc) {
    if (state.energy < 5) {
      toast('Слишком устали.');
      return;
    }
    sfx.init();
    sfx.playSplash();
    state.energy -= 5;
    addItem('raw_water', 1);
    toast('💧 Набрана фляга речной воды (требует кипячения!).');
    passTime(0.5);
    closeModal();
  }

  function doDigWorms(loc) {
    sfx.init();
    sfx.playClick();
    state.energy -= 5;
    addItem('worms', 2);
    toast('🪱 Найдено 2 земляных червя.');
    passTime(0.5);
    closeModal();
  }

  function doGatherWood(loc) {
    if (state.energy < loc.energyCost) {
      toast('Недостаточно сил!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    addItem('firewood', 2);
    toast('🪵 Заготовлено 2 охапки сушняка для костра.');
    passTime(1);
    checkDailyProgress('wood', 2);
    closeModal();
  }

  function doGatherHerbs(loc) {
    if (state.energy < loc.energyCost) {
      toast('Недостаточно сил!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    addItem('herbs', 2);
    addItem('berries', 1);
    toast('🌿 Нарвано 2 пучка целебных трав и горсть брусники.');
    passTime(1);
    checkDailyProgress('herbs', 2);
    closeModal();
  }

  function doPlaceSnare(loc) {
    if (getItemCount('wire') < 1) {
      toast('Нужна проволока для силка!');
      return;
    }
    sfx.init();
    sfx.playClick();
    removeItem('wire', 1);
    state.trapsSet += 1;
    toast('🪤 Силок установлен в малиннике. Проверьте утром.');
    passTime(0.5);
    closeModal();
  }

  function doScavengeStation(loc) {
    if (state.energy < loc.energyCost) {
      toast(`Недостаточно сил для обыска! Нужно ${loc.energyCost}% энергии.`);
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    passTime(2);

    if (!state.questFlags) state.questFlags = {};

    if ((state.mainQuestStep === 2 || !state.questFlags?.has_membrane) && getItemCount('filter_membrane') === 0) {
      addItem('filter_membrane', 1);
      addItem('scrap', 3);
      addItem('wire', 1);
      state.questFlags.has_membrane = true;
      toast('⭐ НАЙДЕНА КЕРАМИЧЕСКАЯ МЕМБРАНА, лом и проволока! Вернитесь к Бате.');
      sfx.playSuccess();
    } else {
      addItem('scrap', 2);
      if (Math.random() > 0.4) {
        addItem('wire', 1);
        toast('Насосная станция: найдено 2 металлолома и 1 моток проволоки.');
      } else {
        toast('Насосная станция: найдено 2 ед. металлолома.');
      }
    }
    updateHUD();
    saveState();
    renderQuests();
    closeModal();
  }

  function doSetBigTrap(loc) {
    if (getItemCount('trap') < 1) {
      toast('У вас нет готового капкана в рюкзаке.');
      return;
    }
    sfx.init();
    sfx.playClick();
    removeItem('trap', 1);
    state.trapsSet += 2;
    toast('Стальной капкан взведен на звериной тропе.');
    passTime(1);
    closeModal();
  }

  function doActiveHunt(loc) {
    if (state.energy < loc.energyCost) {
      toast('Недостаточно сил!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    passTime(2);

    const hasGun = getItemCount('toz') > 0 && getItemCount('ammo') > 0;
    const roll = Math.random();

    if (hasGun && roll > 0.4) {
      removeItem('ammo', 1);
      addItem('raw_meat', 2);
      addItem('leather', 1);
      toast('💥 Удачный выстрел из ТОЗ! Добыт таёжный кабан (+2 мяса, +1 шкура).');
      sfx.playSuccess();
    } else if (roll > 0.6) {
      addItem('raw_meat', 1);
      toast('🏹 Охота ножом: подстрелен заяц (+1 мясо).');
    } else {
      state.hp -= 15;
      toast('🐺 Нападение стаи диких собак! Вы отбились, но ранены (-15% HP).');
    }
    closeModal();
  }

  function doRepairAntenna(loc) {
    if (state.questFlags && state.questFlags.radio_repaired) {
      toast('Антенна уже починена и принимает радиоволны!');
      return;
    }
    const scrapCount = getItemCount('scrap');
    const wireCount = getItemCount('wire');

    if (state.energy < loc.energyCost) {
      toast(`Недостаточно сил для ремонта антенны! Нужно ${loc.energyCost}% энергии (у вас ${Math.round(state.energy)}%). Отдохните в бараке.`);
      return;
    }

    if (scrapCount < 3 || wireCount < 2) {
      toast(`Не хватает деталей! Нужно: 3 металлолома (у вас ${scrapCount}) и 2 проволоки (у вас ${wireCount}).`);
      return;
    }

    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    removeItem('scrap', 3);
    removeItem('wire', 2);
    passTime(2);

    if (!state.questFlags) state.questFlags = {};
    state.questFlags.radio_repaired = true;
    toast('⭐ АНТЕННА ВОССТАНОВЛЕНА! Пойман сигнал из Бункера «Сфера». Доложите Бате!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    renderQuests();
    closeModal();
  }

  function doLookoutRadioTower(loc) {
    if (state.energy < 10) {
      toast('Слишком устали.');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= 10;
    passTime(1);
    toast('🔭 С вышки виден дым костров «Зари» и бетонный купол Бункера «Сфера» на горизонте.');
    closeModal();
  }

  function doEnterBunker(loc) {
    if (state.energy < loc.energyCost) {
      toast('Слишком мало сил для опасного штурма бункера!');
      return;
    }
    if (state.rad > 60) {
      toast('Опасный уровень радиации! Примите цистамин перед спуском в гермоблок.');
      return;
    }

    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += 30;
    passTime(3);

    const hasWeapon = getItemCount('toz') > 0 && getItemCount('ammo') >= 2;
    const hasKnife = getItemCount('knife') > 0;

    if (hasWeapon) {
      removeItem('ammo', 2);
      if (!state.questFlags) state.questFlags = {};
      state.questFlags.bunker_completed = true;
      addItem('antirad', 2);
      addItem('clean_water', 3);
      addItem('ammo', 10);
      toast('⭐ БУНКЕР ЗАЧИЩЕН! Вы нейтрализовали турели и спасли архив проекта «Каскад»!');
      sfx.playSuccess();
    } else if (hasKnife && state.hp >= 50) {
      state.hp -= 35;
      if (!state.questFlags) state.questFlags = {};
      state.questFlags.bunker_completed = true;
      addItem('antirad', 1);
      addItem('clean_water', 2);
      toast('⚡ Прорыв с боем! Вы ранены (-35 HP), но спасли архив проекта «Каскад»!');
      sfx.playSuccess();
    } else {
      state.hp -= 40;
      toast('Охранные роботы Бункера слишком сильны! Вы отступили с ранениями (-40 HP). Вооружитесь ружьём и патронами!');
    }

    updateHUD();
    renderQuests();
    closeModal();
  }

  function doScavengeBunker(loc) {
    if (state.energy < loc.energyCost) {
      toast('Недостаточно сил!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    passTime(2);
    addItem('scrap', 3);
    if (Math.random() > 0.5) addItem('antirad', 1);
    toast('В Бункере найден металлолом и ценные медикаменты.');
    closeModal();
  }

  function showVictoryScreen() {
    const title = '🏆 ПОБЕДА! ВЫ СПАСЛИ ЛАГЕРЬ «ЗАРЯ»!';
    const sub = 'Сюжетная кампания успешно завершена';
    const body = `
      <p style="color:var(--accent-gold); font-size:14px; font-weight:bold;">Майор Дмитрий и вся община салютуют вам!</p>
      <p>Вы прошли путь от истощённого путника до легендарного защитника лагеря «Заря». Колодцы снабжены чистой водой, в эфире найдены союзники, а архивы НИИ «Сфера» помогут восстановить нормальную жизнь в тайге.</p>
      <div style="background:rgba(0,0,0,0.4); padding:10px; border-radius:8px; margin:12px 0; border:1px solid rgba(255,255,255,0.15);">
        <b>Ваши достижения:</b><br>
        • Финальная репутация: <b>${state.reputation}</b> (${getReputationTitle(state.reputation)})<br>
        • Прожито дней: <b>${state.day}</b><br>
        • Все локации тайги открыты и исследованы!
      </div>
      <p style="font-size:12px; color:var(--text-dim);">Вы можете продолжить выживание в режиме свободной игры: улучшать снаряжение, охотиться, рыбачить и выполнять ежедневные контракты.</p>
    `;
    const actions = [
      {
        text: '🌲 Продолжить свободное выживание',
        action: closeModal,
        primary: true
      }
    ];
    openModal(title, sub, 'assets/images/batya.png', body, actions);
  }

  // --- КРАФТ И КУЛИНАРИЯ ---
  function switchCraftStation(station) {
    sfx.init();
    sfx.playClick();
    state.craftStation = station;
    document.querySelectorAll('.craft-tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderRecipes();
  }

  function renderRecipes() {
    const list = document.getElementById('recipesList');
    list.innerHTML = '';

    const currentRecipes = RECIPES.filter(r => r.station === state.craftStation);
    currentRecipes.forEach(r => {
      let canCraft = true;
      let costText = [];
      for (const [resId, reqCount] of Object.entries(r.cost)) {
        const have = getItemCount(resId);
        const resName = ITEMS[resId]?.name || resId;
        costText.push(`${resName}: ${have}/${reqCount}`);
        if (have < reqCount) canCraft = false;
      }

      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <div class="recipe-header">
          <img src="${r.icon}" class="recipe-icon pixel-art" alt="">
          <div>
            <div class="recipe-title">${r.name}</div>
            <div class="recipe-ingredients">${costText.join(' • ')}</div>
          </div>
        </div>
        <p style="font-size:11px; color:var(--text-dim);">${r.desc}</p>
        <button class="recipe-btn ${canCraft ? 'can-craft' : ''}" onclick="Game.craftRecipe('${r.id}')" ${!canCraft ? 'disabled style="opacity:0.4;"' : ''}>
          ${canCraft ? 'Изготовить' : 'Не хватает сырья'}
        </button>
      `;
      list.appendChild(card);
    });
  }

  function craftRecipe(recipeId) {
    sfx.init();
    const r = RECIPES.find(x => x.id === recipeId);
    if (!r) return;

    // Проверка ингредиентов
    for (const [resId, reqCount] of Object.entries(r.cost)) {
      if (getItemCount(resId) < reqCount) {
        toast('Недостаточно материалов!');
        return;
      }
    }

    // Списание
    for (const [resId, reqCount] of Object.entries(r.cost)) {
      removeItem(resId, reqCount);
    }
    // Выдача
    for (const [resId, addCount] of Object.entries(r.result)) {
      addItem(resId, addCount);
    }

    state.energy = Math.max(0, state.energy - r.energy);
    passTime(0.5);
    sfx.playSuccess();
    toast(`🔨 Изготовлено: ${r.name}`);
    renderRecipes();
  }

  // --- СИСТЕМА КВЕСТОВ И ЕЖЕДНЕВНЫХ ЗАДАНИЙ ---
  function generateDailyQuestsIfNeeded(force = false) {
    if (state.dailyQuests.length > 0 && !force) return;

    state.dailyQuests = [
      { id: 'daily_fish', type: 'fish', title: 'Рыбный день', desc: 'Поймать 2 рыбы на реке Быстрянке.', goal: 2, current: 0, rewardRep: 15, rewardAmmo: 2, completed: false },
      { id: 'daily_wood', type: 'wood', title: 'Дрова для костра', desc: 'Заготовить 2 охапки сухих дров.', goal: 2, current: 0, rewardRep: 10, rewardAmmo: 1, completed: false },
      { id: 'daily_herbs', type: 'herbs', title: 'Аптечный сбор', desc: 'Собрать 2 пучка полыни для лазарета Анны.', goal: 2, current: 0, rewardRep: 15, rewardAmmo: 2, completed: false }
    ];
  }

  function checkDailyProgress(type, amount) {
    state.dailyQuests.forEach(q => {
      if (!q.completed && q.type === type) {
        q.current += amount;
        if (q.current >= q.goal) {
          q.completed = true;
          state.reputation += q.rewardRep;
          addItem('ammo', q.rewardAmmo);
          toast(`⭐ ВЫПОЛНЕНО: «${q.title}» (+${q.rewardRep} репутации, +${q.rewardAmmo} патрона)!`);
          sfx.playSuccess();
          updateHUD();
        }
      }
    });
    renderQuests();
  }

  function switchQuestView(view) {
    sfx.init();
    sfx.playClick();
    state.questView = view;
    document.querySelectorAll('.quest-subtab').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderQuests();
  }

  function renderQuests() {
    const area = document.getElementById('questContentArea');
    area.innerHTML = '';

    if (!state.questFlags) {
      state.questFlags = {
        met_batya: false,
        met_anna: false,
        met_egor: false,
        met_prokhor: false,
        has_membrane: false,
        pump_repaired: false,
        radio_repaired: false,
        bunker_completed: false
      };
    }

    if (state.questView === 'main') {
      const quests = [
        {
          step: 0,
          title: '1. Прибытие в лагерь «Заря»',
          desc: 'Поговорите с майором Дмитрием (Батей) в штабе лагеря, чтобы узнать порядки общины и получить стартовое снаряжение.',
          checklist: [
            { text: 'Поговорить с Батей в штабе', done: state.mainQuestStep > 0 || state.questFlags.met_batya }
          ]
        },
        {
          step: 1,
          title: '2. Знакомство с общиной',
          desc: 'Батя поручил познакомиться с фельдшером Анной и охотником Егором перед получением боевых задач.',
          checklist: [
            { text: 'Познакомиться с фельдшером Анной в лазарете', done: state.mainQuestStep > 1 || state.questFlags.met_anna },
            { text: 'Познакомиться с охотником Егором на реке', done: state.mainQuestStep > 1 || state.questFlags.met_egor },
            { text: 'Доложить Бате об осмотре лагеря', done: state.mainQuestStep > 1 }
          ]
        },
        {
          step: 2,
          title: '3. Кризис чистой воды',
          desc: 'Фильтр главного колодца вышел из строя. Найдите керамическую мембрану в цехе Насосной станции №4 на карте.',
          checklist: [
            { text: 'Обыскать Насосную станцию №4 на карте', done: state.mainQuestStep > 2 || state.questFlags.has_membrane || getItemCount('filter_membrane') > 0 },
            { text: 'Сдать керамическую мембрану Бате', done: state.mainQuestStep > 2 || state.questFlags.pump_repaired }
          ]
        },
        {
          step: 3,
          title: '4. Эхо в эфире',
          desc: 'Восстановите антенну на Радиовышке (нужно: Металлолом 3 шт., Проволока 2 шт.), чтобы поймать радиосигнал выживших.',
          checklist: [
            { text: 'Собрать материалы (Металлолом 3 шт., Проволока 2 шт.)', done: state.questFlags.radio_repaired || (getItemCount('scrap') >= 3 && getItemCount('wire') >= 2) },
            { text: 'Починить антенну на Радиовышке на карте', done: state.mainQuestStep > 3 || state.questFlags.radio_repaired },
            { text: 'Доложить Бате о перехваченном сигнале', done: state.mainQuestStep > 3 }
          ]
        },
        {
          step: 4,
          title: '5. Секрет Бункера «Сфера»',
          desc: 'Финальный прорыв в запечатанный подземный научный комплекс НИИ «Сфера», ставший источником Каскада.',
          checklist: [
            { text: 'Спуститься в Бункер НИИ «Сфера» на карте', done: state.questFlags.bunker_completed },
            { text: 'Вскрыть гермоблок и спасти данные проекта «Каскад»', done: state.questFlags.bunker_completed },
            { text: 'Вернуться героем в лагерь «Заря»', done: state.mainQuestStep >= 5 }
          ]
        }
      ];

      quests.forEach(q => {
        const isDone = state.mainQuestStep > q.step;
        const isCurrent = state.mainQuestStep === q.step;
        const isLocked = state.mainQuestStep < q.step;

        const card = document.createElement('div');
        card.className = `quest-item-card ${isDone ? 'completed' : (isCurrent ? 'active-quest' : '')}`;

        let checklistHtml = '';
        if (!isLocked) {
          checklistHtml = `
            <div class="quest-checklist" style="margin-top:8px; font-size:12px; display:flex; flex-direction:column; gap:4px;">
              ${q.checklist.map(item => `
                <div style="color:${item.done ? 'var(--accent-green)' : 'var(--text-main)'}; display:flex; align-items:center; gap:6px;">
                  <span>${item.done ? '☑' : '☐'}</span>
                  <span style="${item.done ? 'text-decoration:line-through; opacity:0.8;' : ''}">${item.text}</span>
                </div>
              `).join('')}
            </div>
          `;
        }

        card.innerHTML = `
          <div class="quest-title-row">
            <span style="font-weight:700;">${q.title}</span>
            <span style="font-size:11px; font-weight:600; color:${isDone ? 'var(--accent-green)' : (isCurrent ? 'var(--accent-gold)' : 'var(--text-dim)')}">
              ${isDone ? '✓ Выполнено' : (isCurrent ? '● В процессе' : '🔒 Закрыто')}
            </span>
          </div>
          <p class="quest-desc" style="margin-top:4px;">${isLocked ? 'Станет доступно по мере развития истории.' : q.desc}</p>
          ${checklistHtml}
        `;
        area.appendChild(card);
      });
    } else if (state.questView === 'daily') {
      state.dailyQuests.forEach(q => {
        const card = document.createElement('div');
        card.className = `quest-item-card ${q.completed ? 'completed' : ''}`;
        card.innerHTML = `
          <div class="quest-title-row">
            <span>${q.title}</span>
            <span style="font-size:11px; color:${q.completed ? 'var(--accent-green)' : 'var(--accent-gold)'}">
              ${q.completed ? '✓ Награда получена' : `${q.current} / ${q.goal}`}
            </span>
          </div>
          <p class="quest-desc">${q.desc}</p>
          <div class="quest-progress-bar">Награда: +${q.rewardRep} репутации, +${q.rewardAmmo} патрона</div>
        `;
        area.appendChild(card);
      });
    } else if (state.questView === 'lore') {
      area.innerHTML = `
        <div class="quest-item-card">
          <div class="quest-title-row"><span>📻 История Катастрофы («Каскад»)</span></div>
          <p class="quest-desc">В 1989 году в результате сбоя системы охлаждения на химкомбинате «Сфера» произошёл выброс аномальных реагентов. Дамба на реке была разрушена, а близлежащие города эвакуированы.</p>
        </div>
        <div class="quest-item-card">
          <div class="quest-title-row"><span>🏕️ Основание лагеря «Заря»</span></div>
          <p class="quest-desc">Майор Дмитрий собрал уцелевших рабочих и семьи у старой лесопилки. Благодаря возвышенности лагерь не затопило ядовитыми осадками.</p>
        </div>
      `;
    }
  }

  // --- НАВИГАЦИЯ ПО ВКЛАДКАМ ---
  function switchTab(tabId) {
    sfx.init();
    sfx.playClick();
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const btnIndex = ['tabCamp', 'tabMap', 'tabInventory', 'tabCraft', 'tabQuests'].indexOf(tabId);
    const navButtons = document.querySelectorAll('.nav-btn');
    if (navButtons[btnIndex]) navButtons[btnIndex].classList.add('active');
  }

  // --- МОДАЛЬНОЕ ОКНО ---
  function openModal(title, subtitle, avatar, bodyHtml, actions = []) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalSubtitle').textContent = subtitle;
    document.getElementById('modalAvatar').src = avatar || 'assets/images/cabin.png';
    document.getElementById('modalBody').innerHTML = bodyHtml;

    const footer = document.getElementById('modalFooter');
    footer.innerHTML = '';

    actions.forEach(act => {
      const btn = document.createElement('button');
      btn.className = `modal-btn ${act.primary ? 'primary' : ''} ${act.danger ? 'danger' : ''}`;
      btn.innerHTML = act.text;
      btn.onclick = act.action;
      footer.appendChild(btn);
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-btn';
    closeBtn.textContent = 'Закрыть';
    closeBtn.onclick = closeModal;
    footer.appendChild(closeBtn);

    document.getElementById('modalOverlay').classList.add('active');
  }

  function closeModal() {
    sfx.init();
    sfx.playClick();
    document.getElementById('modalOverlay').classList.remove('active');
  }

  // --- МЕНЮ СИСТЕМЫ И НАСТРОЕК ---
  function openSystemMenu() {
    sfx.init();
    sfx.playClick();

    const title = '⚙️ МЕНЮ ВЫЖИВАНИЯ';
    const sub = 'Управление игрой и настройками';
    let body = `
      <div style="display:flex; flex-direction:column; gap:10px; margin:4px 0;">
        <!-- Секция аудио -->
        <div style="background:rgba(0,0,0,0.35); border:1px solid var(--border-dim); border-radius:6px; padding:10px;">
          <b style="color:var(--accent-gold); font-size:12.5px;">🎵 Фоновая музыка («Fate 2»)</b>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
            <span style="font-size:12px;">Воспроизведение:</span>
            <button class="modal-btn" style="margin:0; padding:4px 12px; min-height:32px; font-weight:bold;" onclick="Game.toggleMusic(); Game.openSystemMenu();">
              ${musicEnabled ? '🔊 ВКЛЮЧЕНА' : '🔇 ВЫКЛЮЧЕНА'}
            </button>
          </div>
          <div style="margin-top:10px;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-dim); margin-bottom:4px;">
              <span>Громкость музыки:</span>
              <span id="musicVolDisplay" style="color:var(--accent-gold); font-weight:bold;">${Math.round(musicVolume * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value="${musicVolume}" 
                   style="width:100%; accent-color:var(--accent-gold); cursor:pointer;" 
                   oninput="Game.setMusicVolume(this.value)">
          </div>
        </div>

        <!-- Секция информации -->
        <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px 10px; font-size:11.5px; color:var(--text-dim); line-height:1.6;">
          <div>🏕️ <b>Лагерь «Заря»</b> v1.2</div>
          <div>👤 Репутация: <b>${state.reputation}</b> (${getReputationTitle(state.reputation)})</div>
          <div>📅 День: <b>${state.day}</b> | Время: <b>${TIME_NAMES[state.timeOfDay]}</b></div>
        </div>
      </div>
    `;

    const actions = [
      {
        text: '📜 Вводная история и памятка (Пролог)',
        action: () => {
          closeModal();
          showIntroScreen();
        }
      },
      {
        text: '📱 Как запускать игру на телефоне',
        action: () => showMobileHelp()
      },
      {
        text: '🔄 Начать игру заново (Сбросить прогресс)',
        action: () => confirmResetGame(),
        danger: true
      }
    ];

    openModal(title, sub, 'assets/images/cabin.png', body, actions);
  }

  function confirmResetGame() {
    const title = '⚠️ СБРОС ИГРЫ';
    const sub = 'Подтверждение очистки сохранения';
    const body = `
      <p style="color:var(--accent-danger); font-weight:bold; font-size:13px;">Внимание! Весь текущий прогресс будет удалён!</p>
      <p>Вы потеряете инвентарь, оружие, патроны, репутацию у выживших и выполненные сюжетные задания.</p>
      <p>Игра начнётся с чистого листа с Дня 1 у костра лагеря «Заря».</p>
    `;
    const actions = [
      {
        text: '💀 Да, удалить всё и начать заново',
        action: () => {
          resetGame();
          toast('🔄 Игра сброшена. Добро пожаловать обратно в Зарю!');
        },
        danger: true
      },
      {
        text: '↩️ Отмена (вернуться)',
        action: () => openSystemMenu()
      }
    ];
    openModal(title, sub, 'assets/images/cabin.png', body, actions);
  }

  function showMobileHelp() {
    const title = '📱 ИГРА НА ТЕЛЕФОНЕ';
    const sub = 'Как играть без проводов';
    const body = `
      <div style="font-size:12px; line-height:1.5;">
        <p><b>1. Домашний Wi-Fi (самый быстрый способ):</b><br>
        Запустите на ПК файл <code>start_mobile.bat</code>. Подключите телефон к тому же Wi-Fi и введите в браузере адрес <code>http://192.168.1.91:8080</code>.</p>
        <p><b>2. GitHub Pages (вечная ссылка в интернет):</b><br>
        Выложите репозиторий на GitHub и включите Pages — игра станет доступна через мобильный интернет отовсюду.</p>
        <p style="color:var(--accent-gold); margin-top:6px;">💡 В браузере телефона нажмите <b>«Добавить на главный экран»</b>, чтобы играть во весь экран как в приложении!</p>
      </div>
    `;
    const actions = [
      {
        text: '↩️ Назад в меню',
        action: () => openSystemMenu()
      }
    ];
    openModal(title, sub, 'assets/images/cabin.png', body, actions);
  }

  // --- ТОСТ-УВЕДОМЛЕНИЯ ---
  function toast(message) {
    const container = document.getElementById('toastLog');
    const toastEl = document.createElement('div');
    toastEl.className = 'toast-msg';
    toastEl.textContent = message;
    container.appendChild(toastEl);
    setTimeout(() => {
      if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 2500);
  }

  // --- СОХРАНЕНИЕ И СБРОС ---
  function saveState() {
    try {
      localStorage.setItem('camp_zarya_save', JSON.stringify(state));
    } catch(e) {}
  }

  function loadSavedState() {
    try {
      const saved = localStorage.getItem('camp_zarya_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.questFlags) {
          parsed.questFlags = {
            met_batya: false,
            met_anna: false,
            met_egor: false,
            met_prokhor: false,
            has_membrane: false,
            pump_repaired: false,
            radio_repaired: false,
            bunker_completed: false
          };
        }
        if (parsed.mainQuestStep >= 1) parsed.questFlags.met_batya = true;
        if (parsed.mainQuestStep >= 2) {
          parsed.questFlags.met_anna = true;
          parsed.questFlags.met_egor = true;
          parsed.questFlags.met_prokhor = true;
        }
        if (parsed.mainQuestStep >= 3) {
          parsed.questFlags.has_membrane = true;
          parsed.questFlags.pump_repaired = true;
        }
        if (parsed.mainQuestStep >= 4) {
          parsed.questFlags.radio_repaired = true;
        }
        if (parsed.mainQuestStep >= 5) {
          parsed.questFlags.bunker_completed = true;
        }
        if (parsed.introSeen === undefined) {
          parsed.introSeen = (parsed.mainQuestStep > 0 || parsed.day > 1);
        }
        state = Object.assign(state, parsed);
      }
    } catch(e) {}
  }

  function resetGame() {
    try {
      localStorage.removeItem('camp_zarya_save');
    } catch(e) {}
    state = JSON.parse(JSON.stringify(INITIAL_STATE));
    state.introSeen = false;
    closeModal();
    init();
  }

  // --- УПРАВЛЕНИЕ СТАРТОВЫМ ЭКРАНОМ ---
  function showIntroScreen() {
    const el = document.getElementById('introScreen');
    if (el) el.classList.add('active');
    const chk = document.getElementById('introMusicCheckbox');
    if (chk) chk.checked = musicEnabled;
  }

  function hideIntroScreen() {
    const el = document.getElementById('introScreen');
    if (el) el.classList.remove('active');
  }

  function setMusicFromIntro(enabled) {
    musicEnabled = enabled;
    try {
      localStorage.setItem('camp_music_enabled', musicEnabled);
    } catch(e) {}
    updateMusicUI();
  }

  function startGameFromIntro() {
    sfx.init();
    sfx.playSuccess();
    state.introSeen = true;
    saveState();
    hideIntroScreen();

    const chk = document.getElementById('introMusicCheckbox');
    if (chk) {
      musicEnabled = chk.checked;
      try {
        localStorage.setItem('camp_music_enabled', musicEnabled);
      } catch(e) {}
    }
    if (musicEnabled && bgMusicEl) {
      bgMusicEl.volume = musicVolume;
      bgMusicEl.play().catch(() => {});
    }
    updateMusicUI();

    toast('🏕️ Вы прибыли в лагерь «Заря»! Поговорите с Батей в штабе.');
    if (state.mainQuestStep === 0) {
      setTimeout(() => talkToNPC('batya'), 350);
    }
  }

  // Запуск при загрузке страницы
  window.addEventListener('DOMContentLoaded', init);

  return {
    switchTab,
    filterInv,
    switchCraftStation,
    craftRecipe,
    switchQuestView,
    restAtCamp,
    openCampFire,
    closeModal,
    toggleMusic,
    setMusicVolume,
    openSystemMenu,
    resetGame,
    showIntroScreen,
    hideIntroScreen,
    setMusicFromIntro,
    startGameFromIntro
  };

})();
