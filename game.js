/* ==========================================================================
   ИГРОВОЙ ДВИЖОК: ТЕКСТОВАЯ RPG «ЛАГЕРЬ ЗАРЯ»
   ========================================================================== */

const Game = (() => {

  // --- ХРАНИЛИЩЕ БАЗЫ ПРЕДМЕТОВ ---
  const ITEMS = {
    clean_water: { id: 'clean_water', name: 'Чистая вода', type: 'food', icon: 'assets/images/bottled_water.png', weight: 0.5, desc: 'Кипячёная чистая вода в армейской фляге.', thirst: 45, rad: 0 },
    raw_water: { id: 'raw_water', name: 'Речная вода', type: 'food', icon: 'assets/images/polluted_water.png', weight: 0.5, desc: 'Мутная вода из реки Быстрянки. Опасно пить сырой!', thirst: 30, rad: 12 },
    raw_fish: { id: 'raw_fish', name: 'Сырая рыба', type: 'food', icon: 'assets/images/fresh_fish.png', weight: 0.4, desc: 'Свежепойманная речная рыба. Лучше зажарить на костре.', hunger: 15, rad: 8 },
    cooked_fish: { id: 'cooked_fish', name: 'Жареная рыба', type: 'food', icon: 'assets/images/fried_fish.png', weight: 0.3, desc: 'Аппетитная рыба с хрустящей корочкой, запечённая на углях.', hunger: 45, rad: 0 },
    fish_soup: { id: 'fish_soup', name: 'Уха таёжная', type: 'food', icon: 'assets/images/rich_soup.png', weight: 0.6, desc: 'Наваристая горячая уха с травами. Согревает и насыщает.', hunger: 60, thirst: 35, energy: 25 },
    raw_meat: { id: 'raw_meat', name: 'Сырое мясо', type: 'food', icon: 'assets/images/fresh_meat.png', weight: 0.6, desc: 'Свежая дичь. Сырой есть нельзя — риск паразитов.', hunger: 20, rad: 10 },
    cooked_meat: { id: 'cooked_meat', name: 'Жареное мясо', type: 'food', icon: 'assets/images/fried_chopmeat.png', weight: 0.5, desc: 'Сочный кусок мяса на вертеле. Прекрасно восстанавливает силы.', hunger: 55, energy: 10 },
    berries: { id: 'berries', name: 'Лесная брусника', type: 'food', icon: 'assets/images/cranberry.png', weight: 0.2, desc: 'Спелые таёжные ягоды. Слегка утоляют голод и жажду.', hunger: 15, thirst: 12 },
    herbal_tea: { id: 'herbal_tea', name: 'Антирад-отвар', type: 'food', icon: 'assets/images/dandelion_tea.png', weight: 0.4, desc: 'Настой чабреца, полыни и хвои. Эффективно выводит радионуклиды.', thirst: 35, rad: -25, energy: 15 },
    antirad: { id: 'antirad', name: 'Цистамин (Антирад)', type: 'food', icon: 'assets/images/antirad.png', weight: 0.1, desc: 'Советский радиопротектор в таблетках.', rad: -50 },
    bandage: { id: 'bandage', name: 'Стерильный бинт', type: 'food', icon: 'assets/images/winding_bandage.png', weight: 0.1, desc: 'Останавливает кровотечение и заживляет раны.', hp: 35 },

    // Ресурсы
    firewood: { id: 'firewood', name: 'Сухие дрова', type: 'resource', icon: 'assets/images/wood.png', weight: 1.0, desc: 'Сухой хворост для костра.' },
    herbs: { id: 'herbs', name: 'Целебные травы', type: 'resource', icon: 'assets/images/flowers.png', weight: 0.1, desc: 'Пучки душистой полыни и чабреца.' },
    scrap: { id: 'scrap', name: 'Металлолом', type: 'resource', icon: 'assets/images/scrap_metal.png', weight: 0.8, desc: 'Болты, ржавые пластины и обрезки труб.' },
    wire: { id: 'wire', name: 'Моток проволоки', type: 'resource', icon: 'assets/images/cable.png', weight: 0.3, desc: 'Тонкая стальная струна для ловушек и ремонта.' },
    worms: { id: 'worms', name: 'Земляные черви', type: 'resource', icon: 'assets/images/centipede_corpse.png', weight: 0.1, desc: 'Наживка для рыбалки.' },
    leather: { id: 'leather', name: 'Шкура зверя', type: 'resource', icon: 'assets/images/thick_leather.png', weight: 1.2, desc: 'Плотная шкура волка или кабана.' },
    swamp_moss: { id: 'swamp_moss', name: 'Болотный сфагнум', type: 'resource', icon: 'assets/images/moss.png', weight: 0.2, desc: 'Природный антисептик и сорбент, растущий на Гнилой гати.' },
    bear_pelt: { id: 'bear_pelt', name: 'Шкура Хозяина тайги', type: 'resource', icon: 'assets/images/thick_hide.png', weight: 3.5, desc: 'Огромная непробиваемая шкура матёрого медведя-шатуна.' },

    // Инструменты и оружие
    rod: { id: 'rod', name: 'Самодельная удочка', type: 'tool', icon: 'assets/images/fishing_rod.png', weight: 0.8, desc: 'Гибкое удилище с леской и крючком из булавки.' },
    trap: { id: 'trap', name: 'Охотничий капкан', type: 'tool', icon: 'assets/images/trapie.png', weight: 1.5, desc: 'Стальной капкан на мелкую и среднюю дичь.' },
    knife: { id: 'knife', name: 'Охотничий нож', type: 'tool', icon: 'assets/images/steel_knife.png', weight: 0.4, desc: 'Острый нож из советской стали. Незаменим в лесу.' },
    torch: { id: 'torch', name: 'Смоляной факел', type: 'tool', icon: 'assets/images/torch.png', weight: 0.5, desc: 'Яркий факел из сосновых лучин и проволоки. Разгоняет тьму и отпугивает диких зверей.' },
    spear: { id: 'spear', name: 'Охотничье копьё', type: 'tool', icon: 'assets/images/iron_spear.png', weight: 1.2, desc: 'Берёзовое древко с наконечником из ножа и проволоки. Оружие ближнего боя.' },
    toz: { id: 'toz', name: 'Ружьё ТОЗ-34', type: 'tool', icon: 'assets/images/toz.png', weight: 3.2, desc: 'Двуствольное охотничье ружье 12 калибра.' },
    ammo: { id: 'ammo', name: 'Патроны 12к (Валюта)', type: 'tool', icon: 'assets/images/shotgun_ammo.png', weight: 0.05, desc: 'Ходовая валюта среди выживших и боеприпасы.' },
    filter_membrane: { id: 'filter_membrane', name: 'Керамическая мембрана', type: 'tool', icon: 'assets/images/water_filter.png', weight: 1.5, desc: 'Ценнейший сменный элемент промышленного фильтра для воды.' },
    keycard_sfera: { id: 'keycard_sfera', name: 'Ключ-карта «Сфера»', type: 'tool', icon: 'assets/images/minepass.png', weight: 0.1, desc: 'Электронный армейский пропуск первого уровня для открытия внешнего гермолюка Бункера.' },
    stalker_suit: { id: 'stalker_suit', name: 'Броня сталкера', type: 'tool', icon: 'assets/images/combined_armor.png', weight: 2.5, desc: 'Укрепленная куртка из медвежьей шкуры и стальных пластин (+5 кг к грузоподъемности).' },
    respirator: { id: 'respirator', name: 'Респиратор Р-2', type: 'tool', icon: 'assets/images/respirator.png', weight: 0.4, desc: 'Защитная полумаска с фильтром от ядовитых испарений и радиации Бункера.' },
    herbal_salve: { id: 'herbal_salve', name: 'Целебная мазь', type: 'food', icon: 'assets/images/medicine_hp.png', weight: 0.2, desc: 'Густая мазь из сфагнума и трав. Заживляет рваные раны (+50 HP).', hp: 50 },
    canned_food: { id: 'canned_food', name: 'Армейская тушёнка', type: 'food', icon: 'assets/images/beef_can.png', weight: 0.4, desc: 'Сытная свиная тушенка ГОСТ (+70 сытости, +20 энергии).', hunger: 70, energy: 20 },

    // Записки лора и квестовые предметы
    water_sample: { id: 'water_sample', name: 'Проба токсичной воды', type: 'lore', icon: 'assets/images/toxic_water.png', weight: 0.3, desc: 'Флакон с мутной желтоватой водой из Быстрянки для лаборатории Анны.' },
    audio_tape: { id: 'audio_tape', name: 'Кассета Воронова', type: 'lore', icon: 'assets/images/cassette.png', weight: 0.1, desc: 'Аудиокассета: последняя запись руководителя проекта «Каскад» профессора Воронова.' },
    note_voronov: { id: 'note_voronov', name: 'Дневник Воронова', type: 'lore', icon: 'assets/images/book.png', weight: 0.1, desc: 'Полевые заметки профессора Воронова с описанием стабилизатора «Нектар-7».' },
    floppy_disk: { id: 'floppy_disk', name: 'Архив проекта «Каскад»', type: 'lore', icon: 'assets/images/emba_disk.png', weight: 0.1, desc: 'Магнитная дискета с научными данными, чертежами генераторов и карт залежей НИИ «Сфера».' },
    stabilizer_nectar: { id: 'stabilizer_nectar', name: 'Капсула «Нектар-7»', type: 'lore', icon: 'assets/images/injector_purple.png', weight: 0.8, desc: 'Цилиндр с активным биоферментом, нейтрализующим радиохимическое заражение рек и почв.' },
    note_order: { id: 'note_order', name: 'Приказ об эвакуации', type: 'lore', icon: 'assets/images/letter.png', weight: 0.0, desc: 'Пожелтевший бланк 1989 г. Упоминается секретный бункер НИИ «Сфера» в 8 км к северу.' },
    note_geologist: { id: 'note_geologist', name: 'Дневник геолога', type: 'lore', icon: 'assets/images/stash_map.png', weight: 0.0, desc: 'Записи о странных спорах и аномальном поведении речной рыбы после взрыва на дамбе.' }
  };

  // --- РЕЦЕПТЫ КРАФТА ---
  const RECIPES = [
    {
      id: 'cook_fish', station: 'fire', name: 'Запечь рыбу на углях', icon: 'assets/images/fried_fish.png',
      cost: { raw_fish: 1, firewood: 1 }, result: { cooked_fish: 1 }, energy: 5, timeMin: 15,
      desc: 'Превращает радиоактивную сырую рыбу в безопасную пищу.'
    },
    {
      id: 'cook_meat', station: 'fire', name: 'Зажарить кусок мяса', icon: 'assets/images/fried_chopmeat.png',
      cost: { raw_meat: 1, firewood: 1 }, result: { cooked_meat: 1 }, energy: 5, timeMin: 15,
      desc: 'Обеззараживает дичь на огне.'
    },
    {
      id: 'boil_water', station: 'fire', name: 'Вскипятить воду', icon: 'assets/images/bottled_water.png',
      cost: { raw_water: 1, firewood: 1 }, result: { clean_water: 1 }, energy: 5, timeMin: 10,
      desc: 'Убивает бактерии и делает речную воду пригодной для питья.'
    },
    {
      id: 'brew_tea', station: 'fire', name: 'Сварить антирад-отвар', icon: 'assets/images/dandelion_tea.png',
      cost: { clean_water: 1, herbs: 1, firewood: 1 }, result: { herbal_tea: 1 }, energy: 10, timeMin: 20,
      desc: 'Целебный чай от радиации по рецепту фельдшера Анны.'
    },
    {
      id: 'cook_soup', station: 'fire', name: 'Сварить уху в котелке', icon: 'assets/images/rich_soup.png',
      cost: { raw_fish: 2, clean_water: 1, herbs: 1, firewood: 2 }, result: { fish_soup: 1 }, energy: 10, timeMin: 30,
      desc: 'Питательное блюдо для восстановления сил всего организма.'
    },
    {
      id: 'craft_salve', station: 'fire', name: 'Сварить мазь из сфагнума', icon: 'assets/images/medicine_hp.png',
      cost: { swamp_moss: 1, herbs: 1, firewood: 1 }, result: { herbal_salve: 1 }, energy: 10, timeMin: 20,
      desc: 'Заживляющая мазь на основе болотного мха и трав (+50 HP).'
    },
    {
      id: 'craft_rod', station: 'bench', name: 'Собрать удочку', icon: 'assets/images/fishing_rod.png',
      cost: { firewood: 2, wire: 1 }, result: { rod: 1 }, energy: 15, timeMin: 30,
      desc: 'Простая удочка для ловли рыбы на реке Быстрянке.'
    },
    {
      id: 'craft_torch', station: 'bench', name: 'Связать смоляной факел', icon: 'assets/images/torch.png',
      cost: { firewood: 1, wire: 1 }, result: { torch: 1 }, energy: 5, timeMin: 10,
      desc: 'Освещает дорогу в темноте и отпугивает стаи диких зверей.'
    },
    {
      id: 'craft_spear', station: 'bench', name: 'Собрать охотничье копьё', icon: 'assets/images/iron_spear.png',
      cost: { knife: 1, firewood: 2, wire: 1 }, result: { spear: 1 }, energy: 15, timeMin: 25,
      desc: 'Надёжное оружие ближнего боя против хищников.'
    },
    {
      id: 'craft_trap', station: 'bench', name: 'Сколотить капкан', icon: 'assets/images/trapie.png',
      cost: { scrap: 2, wire: 1 }, result: { trap: 1 }, energy: 20, timeMin: 45,
      desc: 'Ловушка для добычи мяса и ценных шкур в тайге.'
    },
    {
      id: 'craft_bandage', station: 'bench', name: 'Скрутить стерильный бинт', icon: 'assets/images/winding_bandage.png',
      cost: { herbs: 2 }, result: { bandage: 1 }, energy: 5, timeMin: 10,
      desc: 'Травяная повязка для остановки кровотечений.'
    },
    {
      id: 'craft_stalker_suit', station: 'bench', name: 'Сшить броню сталкера', icon: 'assets/images/combined_armor.png',
      cost: { bear_pelt: 1, scrap: 3, wire: 2 }, result: { stalker_suit: 1 }, energy: 25, timeMin: 60,
      desc: 'Укреплённый костюм. Навсегда увеличивает вместимость рюкзака до 30 кг.'
    },
    {
      id: 'craft_respirator', station: 'bench', name: 'Собрать респиратор Р-2', icon: 'assets/images/respirator.png',
      cost: { swamp_moss: 2, herbs: 1, wire: 1 }, result: { respirator: 1 }, energy: 15, timeMin: 30,
      desc: 'Защищает лёгкие от радиоактивного тумана и ядовитых газов Бункера.'
    }
  ];

  // --- ЛОКАЦИИ КАРТЫ ---
  const LOCATIONS = [
    {
      id: 'river', name: 'Река Быстрянка', tier: 1, icon: 'assets/images/polluted_water.png', rad: 5, energyCost: 10, timePass: 1,
      desc: 'Бурная таёжная река. Здесь ловят рыбу, собирают тростник и набирают воду.',
      unlocked: true,
      actions: ['fish', 'gather_water', 'dig_worms']
    },
    {
      id: 'forest', name: 'Ближний лесок', tier: 1, icon: 'assets/images/wood.png', rad: 10, energyCost: 10, timePass: 1,
      desc: 'Опушка тайги вокруг лагеря. Место сбора хвороста, брусники и лекарственных трав.',
      unlocked: true,
      actions: ['gather_wood', 'gather_herbs', 'hunt_birds']
    },
    {
      id: 'swamp', name: 'Гнилая гать (Торфяники)', tier: 2, icon: 'assets/images/moss.png', rad: 25, energyCost: 20, timePass: 2,
      desc: 'Зловонные торфяники, окутанные желтоватым смогом. Здесь растёт ценный антисептический сфагнум.',
      unlocked: false, reqRep: 60,
      actions: ['gather_moss', 'scavenge_swamp']
    },
    {
      id: 'pump_station', name: 'Насосная станция №4', tier: 2, icon: 'assets/images/a_chemistry_station.png', rad: 25, energyCost: 20, timePass: 2,
      desc: 'Полузатопленный бетонный комплекс очистки воды. Здесь можно найти фильтры и трубы.',
      unlocked: false, reqRep: 100,
      actions: ['scavenge_station']
    },
    {
      id: 'hunting_grounds', name: 'Охотничьи угодья', tier: 2, icon: 'assets/images/wolf.png', rad: 20, energyCost: 25, timePass: 2,
      desc: 'Глухой бурелом. Водятся кабаны, зайцы и волки. Нужна осторожность и оружие.',
      unlocked: false, reqRep: 150,
      actions: ['place_trap', 'hunt_big_game']
    },
    {
      id: 'old_cordon', name: 'Заброшенный кордон', tier: 2, icon: 'assets/images/abandoned_house.png', rad: 15, energyCost: 15, timePass: 2,
      desc: 'Старый бревенчатый кордон лесничества у подножия скал. Бывшая полевая база экспедиции НИИ «Сфера».',
      unlocked: false, reqRep: 250,
      actions: ['search_cordon', 'scavenge_cordon']
    },
    {
      id: 'radio_tower', name: 'Радиовышка на утесе', tier: 3, icon: 'assets/images/generator_skin.png', rad: 35, energyCost: 30, timePass: 3,
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
      id: 'batya', name: 'Майор Дмитрий (Батя)', role: 'Комендант лагеря', avatar: 'assets/images/npc_leader.png',
      desc: 'Руководит обороной лагеря и распределением припасов. Бывший военный.'
    },
    anna: {
      id: 'anna', name: 'Анна Павловна', role: 'Фельдшер-травница', avatar: 'assets/images/npc_default_woman.png',
      desc: 'Лечит раненых, готовит настойки и скупает таёжные травы.'
    },
    prokhor: {
      id: 'prokhor', name: 'Прохор Кузьмич', role: 'Механик лагеря', avatar: 'assets/images/npc_engineer.png',
      desc: 'Заведует верстаком. Из консервной банки и проволоки соберет капкан.'
    },
    egor: {
      id: 'egor', name: 'Егор Лесник', role: 'Охотник и следопыт', avatar: 'assets/images/npc_def_male.png',
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
      egor_starter_worms: false,
      dogs_defeated: false,
      water_sample_given: false,
      swamp_explored: false,
      pump_cleared: false,
      pump_repaired: false,
      has_membrane: false,
      met_prokhor_radio: false,
      radio_repaired: false,
      tape_decoded: false,
      cordon_searched: false,
      talked_bear: false,
      bear_defeated: false,
      suit_crafted: false,
      respirator_crafted: false,
      bunker_entered: false,
      turrets_neutralized: false,
      reactor_reached: false,
      reactor_shutdown: false,
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
    renderRecipes();
    renderQuests();
    updateHUD();
    saveState();
  }

  function removeItem(itemId, count = 1) {
    if (!state.inventory[itemId]) return false;
    if (state.inventory[itemId] < count) return false;
    state.inventory[itemId] -= count;
    if (state.inventory[itemId] <= 0) {
      delete state.inventory[itemId];
    }
    renderInventory();
    renderRecipes();
    renderQuests();
    updateHUD();
    saveState();
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
      actions.push({ text: 'Использовать / Принять', action: () => useItem(item.id), primary: true });
    }
    if (item.id === 'stalker_suit') {
      actions.push({
        text: '🛡️ Надеть броню сталкера (+5 кг вещмешка)',
        action: () => {
          state.maxWeight = 30.0;
          state.questFlags.suit_crafted = true;
          toast('Вы облачились в броню сталкера! Грузоподъёмность увеличена до 30 кг.');
          sfx.playSuccess();
          updateHUD();
          closeModal();
        },
        primary: true
      });
    }
    if (item.id === 'respirator') {
      actions.push({
        text: '😷 Надеть респиратор Р-2 (Защита дыхания)',
        action: () => {
          state.questFlags.respirator_crafted = true;
          toast('Респиратор Р-2 надет! Дыхание защищено от токсичных газов Бункера.');
          sfx.playSuccess();
          closeModal();
        },
        primary: true
      });
    }
    if (item.type === 'lore') {
      let loreText = item.desc;
      if (item.id === 'note_voronov') {
        loreText = `<b>Из полевого дневника профессора Воронова:</b><br>
        <i>«...14 октября 1989 г. Система охлаждения реактора второго контура не справилась с нагрузкой при испытании гидросинтеза. Выброс газов неизбежен. Мы эвакуируем персонал к лесничеству на Заброшенный кордон. Ключ-карту от внешнего люка я спрятал в подполе кордона. Если реактор не заглушить вручную изнутри до критической отметки — погибнет вся экосистема тайги...»</i>`;
      } else if (item.id === 'audio_tape') {
        loreText = `<b>Аудиозапись на магнитной ленте:</b><br>
        <i>«[Шипение помех] ...Говорит Воронов, НИИ "Сфера". Повторяю: всем выжившим постам. Бункер запечатан аварийным протоколом. Турели периметра переведены в автономный боевой режим. Нужна ключ-карта доступа. На кордоне в тайге остались резервные запасы и мои записи. Найдите их!...»</i>`;
      } else if (item.id === 'floppy_disk') {
        loreText = `<b>Содержимое дискеты архива «Каскад»:</b><br>
        <i>Полный пакет инженерной документации: чертежи геотермальных очистителей, схемы водозаборных станций и биохимические формулы восстановления отравленной почвы. Это возрождение цивилизации!</i>`;
      } else if (item.id === 'stabilizer_nectar') {
        loreText = `<b>Капсула «Нектар-7»:</b><br>
        <i>Биохимический концентрат для нейтрализации радиационного фона в почве и грунтовых водах. С ним лагерь «Заря» сможет засеять поля и выращивать чистые культуры без риска лучевой болезни.</i>`;
      }
      body = `<p>${loreText}</p>`;
    }

    openModal(item.name, 'Снаряжение', item.icon, body, actions);
  }

  function filterInv(type) {
    sfx.init();
    sfx.playClick();
    state.invFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const match = btn.getAttribute('onclick')?.includes(`'${type}'`);
      btn.classList.toggle('active', !!match);
    });
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

    let body = `<p>Майор Дмитрий стоит у карты района, скрестив руки на груди. В глазах читается усталость, но голос звенит металлом.</p>`;
    body += `<p><i>«Ну что, боец. Лагерь "Заря" — последнее место в этой тайге, где люди живут по законам чести. Если готов пахать ради общины — не пропадёшь.»</i></p>`;

    const actions = [];

    // Квест 1: Стартовый инструктаж (step 0)
    if (state.mainQuestStep === 0) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 1: ПРИБЫТИЕ В ЗАРЮ]:</b></p>`;
      body += `<p><i>«Ты еле живой приполз. Прими законы общины: кто не работает — тот не ест. Держи стартовый сухпай и покажи, на что способен.»</i></p>`;
      actions.push({
        text: '«Я готов служить лагерю. С чего начать, Батя?»',
        action: () => {
          state.mainQuestStep = 1;
          state.reputation += 10;
          addItem('clean_water', 1);
          addItem('ammo', 3);
          toast('⭐ Задание 1 выполнено: «Прибытие в Зарю» (+10 репутации, фляга воды, 3 патрона)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          closeModal();
          renderQuests();
        },
        primary: true
      });
    }
    // Квест 2: Первые шаги (step 1)
    else if (state.mainQuestStep === 1) {
      const annaDone = !!state.questFlags.met_anna;
      const egorDone = !!state.questFlags.met_egor;
      const allDone = annaDone && egorDone;

      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: ПЕРВЫЕ ШАГИ]:</b></p>`;
      body += `<div style="background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px; margin:8px 0; border:1px solid rgba(255,255,255,0.12);">`;
      body += `<b style="color:var(--accent-gold); font-size:12px;">📋 Задачи инструктажа:</b><br>`;
      body += `• Фельдшер Анна (лазарет): ${annaDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}<br>`;
      body += `• Охотник Егор (река): ${egorDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}`;
      body += `</div>`;

      if (allDone) {
        body += `<p style="color:var(--accent-green);"><i>«Анна и Егор доложили, что ты парень смышлёный. Инструктаж пройден! Теперь пора заняться безопасностью лагеря.»</i></p>`;
        actions.push({
          text: '⭐ «Доложить об осмотре лагеря (Завершить квест 2)»',
          action: () => {
            state.mainQuestStep = 2;
            state.reputation += 15;
            addItem('ammo', 3);
            toast('⭐ Квест 2 завершён: «Первые шаги» (+15 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        body += `<p><i>«Загляни к Анне в лазарет — узнай про радиацию, и к Егору на берег реки — он покажет, как добывать рыбу.»</i></p>`;
        actions.push({
          text: '«Батя, я уже осмотрел лагерь и готов к делу!»',
          action: () => {
            state.questFlags.met_anna = true;
            state.questFlags.met_egor = true;
            state.mainQuestStep = 2;
            state.reputation += 15;
            addItem('ammo', 3);
            toast('⭐ Квест 2 завершён: Знакомство с общиной (+15 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          }
        });
      }
    }
    // Квест 3: Огонь во тьме (step 2)
    else if (state.mainQuestStep === 2) {
      const hasTorch = getItemCount('torch') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 3: ОГОНЬ ВО ТЬМЕ]:</b></p>`;
      body += `<p><i>«Ночи в тайге чернее дегтя. Мутанты жмутся к частоколу. Нам нужны дрова для костров и факелы для караульных. Набери в лесу сушняка и свяжи смоляной факел на верстаке у Прохора.»</i></p>`;

      if (hasTorch) {
        body += `<p style="color:var(--accent-green);">✓ У вас есть смоляной факел!</p>`;
        actions.push({
          text: '⭐ «Сдать факел и дрова Бате (Завершить квест 3)»',
          action: () => {
            removeItem('torch', 1);
            state.mainQuestStep = 3;
            state.reputation += 15;
            addItem('ammo', 2);
            toast('⭐ Квест 3 выполнен: «Огонь во тьме» (+15 репутации, +2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🌲 «Выдвигаюсь в Ближний лесок за дровами»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }
    // Квест 4: Голодный рассвет (step 3 - куратор Егор)
    else if (state.mainQuestStep === 3) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 4: ГОЛОДНЫЙ РАССВЕТ]:</b></p>`;
      body += `<p><i>«Запасы провизии на исходе. Сходи к Егору на берег Быстрянки. Он покажет, как смастерить удочку, поймать рыбу и сварить таёжную уху на костре.»</i></p>`;
      actions.push({
        text: '🎣 «Иду к Егору на берег реки»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('egor');
        },
        primary: true
      });
    }
    // Квест 5: Крещение тайгой (step 4)
    else if (state.mainQuestStep === 4) {
      const dogsDead = !!state.questFlags.dogs_defeated;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 5: КРЕЩЕНИЕ ТАЙГОЙ]:</b></p>`;
      body += `<p><i>«Тревога, боец! Стая одичавших псов обложила опушку Ближнего леска. Смастери охотничье копьё на верстаке, отбей набег и защити наш тыл!»</i></p>`;

      if (dogsDead) {
        body += `<p style="color:var(--accent-green);">✓ Стая диких псов разбита!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о разгроме стаи (Завершить квест 5)»',
          action: () => {
            state.mainQuestStep = 5;
            state.reputation += 25;
            addItem('ammo', 4);
            if (!state.unlockedLocations.includes('swamp')) {
              state.unlockedLocations.push('swamp');
            }
            toast('⭐ Квест 5 выполнен: «Крещение тайгой» (+25 репутации, ранг «Свой», открыты Болота)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderLocations();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🌲 «Выдвигаюсь на опушку леса для боя»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          },
          primary: true
        });
      }
    }
    // Квест 6: Мёртвые заводи (step 5 - куратор Анна)
    else if (state.mainQuestStep === 5) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 6: МЁРТВЫЕ ЗАВОДИ]:</b></p>`;
      body += `<p><i>«Анна Павловна бьет тревогу: Быстрянка несет желтоватую радиохимическую пену. Срочно иди в лазарет и помоги ей взять пробы!»</i></p>`;
      actions.push({
        text: '🩺 «Иду в лазарет к Анне»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('anna');
        },
        primary: true
      });
    }
    // Квест 7: Следы на иле (step 6 - куратор Егор)
    else if (state.mainQuestStep === 6) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 7: СЛЕДЫ НА ИЛЕ]:</b></p>`;
      body += `<p><i>«Егор заметил трёхпалые следы болотных мутантов у берега. Загляни к нему, сколотите капканы и остановите тварей.»</i></p>`;
      actions.push({
        text: '🏹 «Иду к Егору»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('egor');
        },
        primary: true
      });
    }
    // Квест 8: Экспедиция в Гнилую гать (step 7 - куратор Анна)
    else if (state.mainQuestStep === 7) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 8: ЭКСПЕДИЦИЯ В ГНИЛУЮ ГАТЬ]:</b></p>`;
      body += `<p><i>«Анне нужен болотный сфагнум для фильтрации воды и лекарств. Сходи на торфяники Гнилой гати, но берегись радиации!»</i></p>`;
      actions.push({
        text: '🩺 «Поговорить с Анной о вылазке»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('anna');
        },
        primary: true
      });
    }
    // Квест 9: Прорыв к Насосной станции (step 8)
    else if (state.mainQuestStep === 8) {
      const cleared = !!state.questFlags.pump_cleared;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 9: ПРОРЫВ К НАСОСНОЙ СТАНЦИИ]:</b></p>`;
      body += `<p><i>«Колодцы лагеря пересыхают! Наш единственный шанс — старая Насосная станция №4. Дорога туда завалена железобетоном и кишит тварями. Пробейся к машинному залу станции!»</i></p>`;

      if (cleared) {
        body += `<p style="color:var(--accent-green);">✓ Завал у цеха Насосной станции №4 расчищен!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о пробитом коридоре (Завершить квест 9)»',
          action: () => {
            state.mainQuestStep = 9;
            state.reputation += 35;
            addItem('ammo', 5);
            toast('⭐ Квест 9 выполнен: «Прорыв к Насосной» (+35 репутации, +5 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🏭 «Выдвигаюсь на Насосную станцию №4»',
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
      }
    }
    // Квест 10: Сердце фильтра (step 9)
    else if (state.mainQuestStep === 9) {
      const repaired = !!state.questFlags.pump_repaired;
      const hasMembrane = getItemCount('filter_membrane') > 0 || state.questFlags.has_membrane;
      const scrapCount = getItemCount('scrap');

      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 10: СЕРДЦЕ ФИЛЬТРА]:</b></p>`;
      body += `<p><i>«В машинном зале станции нужно найти керамическую мембрану и 3 металлолома. Без них фильтр не запустить. Прохор ждет детали!»</i></p>`;

      if (repaired) {
        body += `<p style="color:var(--accent-green);">✓ Водоочистная станция запущена! В лагере есть питьевая вода!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о победе над водным кризисом (Завершить квест 10)»',
          action: () => {
            state.mainQuestStep = 10;
            state.reputation += 40;
            addItem('canned_food', 2);
            addItem('ammo', 6);
            toast('⭐ Квест 10 выполнен: «Сердце фильтра» (+40 репутации, ранг «Уважаемый», +2 тушёнки)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else if (hasMembrane && scrapCount >= 3) {
        actions.push({
          text: '🔧 «Батя, детали со мной! Запустить станцию прямо сейчас»',
          action: () => {
            if (getItemCount('filter_membrane') > 0) removeItem('filter_membrane', 1);
            removeItem('scrap', 3);
            state.questFlags.pump_repaired = true;
            toast('Гидроузел запущен! Чистая вода пошла по трубам!');
            sfx.playSuccess();
            talkBatya();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🔍 «Искать мембрану и металлолом на станции»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }
    // Квест 11: Морзе в ночи (step 10 - куратор Прохор)
    else if (state.mainQuestStep === 10) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 11: МОРЗЕ В НОЧИ]:</b></p>`;
      body += `<p><i>«Прохор ночью перехватил аварийный морзе SOS на армейской волне! Сходи к нему к верстаку, разберитесь, откуда бьет сигнал.»</i></p>`;
      actions.push({
        text: '🔧 «Иду к Прохору к верстаку»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('prokhor');
        },
        primary: true
      });
    }
    // Квест 12: Эхо на Скалистом утёсе (step 11)
    else if (state.mainQuestStep === 11) {
      const radioOk = !!state.questFlags.radio_repaired;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 12: ЭХО НА СКАЛИСТОМ УТЁСЕ]:</b></p>`;
      body += `<p><i>«Возьми 3 металлолома и 2 проволоки. Поднимись на высотную Радиовышку на утесе и восстанови мачту связи. Мы должны поймать этот сигнал!»</i></p>`;

      if (radioOk) {
        body += `<p style="color:var(--accent-green);">✓ Антенна на Радиовышке восстановлена! Принят аварийный сигнал!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о пойманном сигнале (Завершить квест 12)»',
          action: () => {
            state.mainQuestStep = 12;
            state.reputation += 35;
            addItem('ammo', 5);
            if (getItemCount('audio_tape') === 0) addItem('audio_tape', 1);
            toast('⭐ Квест 12 выполнен: «Эхо на Скалистом утёсе» (+35 репутации, кассета Воронова)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '📡 «Выдвигаюсь к Радиовышке на утесе»',
          action: () => {
            if (!state.unlockedLocations.includes('radio_tower')) {
              state.unlockedLocations.push('radio_tower');
            }
            closeModal();
            switchTab('tabMap');
            renderLocations();
          },
          primary: true
        });
      }
    }
    // Квест 13: Шифр Воронова (step 12 - куратор Прохор)
    else if (state.mainQuestStep === 12) {
      const decoded = !!state.questFlags.tape_decoded;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 13: ШИФР ВОРОНОВА]:</b></p>`;
      body += `<p><i>«На пленке с вышки записан шифр профессора Воронова из НИИ «Сфера»! Иди к Прохору — у него в мастерской есть дешифратор и магнитофон.»</i></p>`;

      if (decoded) {
        body += `<p style="color:var(--accent-green);">✓ Запись Воронова расшифрована! Координаты Заброшенного кордона получены!</p>`;
        actions.push({
          text: '⭐ «Обсудить координаты кордона с Батей (Завершить квест 13)»',
          action: () => {
            state.mainQuestStep = 13;
            state.reputation += 30;
            addItem('ammo', 5);
            if (!state.unlockedLocations.includes('old_cordon')) {
              state.unlockedLocations.push('old_cordon');
            }
            toast('⭐ Квест 13 выполнен: «Шифр Воронова» (+30 репутации, открыт Заброшенный кордон)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderLocations();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '📻 «Иду к Прохору расшифровывать пленку»',
          action: () => {
            closeModal();
            switchTab('tabCamp');
            talkToNPC('prokhor');
          },
          primary: true
        });
      }
    }
    // Квест 14: Тайна Заброшенного кордона (step 13)
    else if (state.mainQuestStep === 13) {
      const hasKeycard = getItemCount('keycard_sfera') > 0 || state.questFlags.cordon_searched;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 14: ТАЙНА ЗАБРОШЕННОГО КОРДОНА]:</b></p>`;
      body += `<p><i>«Выдвигайся на Заброшенный кордон в предгорьях. Воронов оставил там ключ-карту допуска к Бункеру и полевой дневник. Найди их!»</i></p>`;

      if (hasKeycard) {
        body += `<p style="color:var(--accent-green);">✓ Дневник Воронова и ключ-карта «Сфера-Допуск» найдены!</p>`;
        actions.push({
          text: '⭐ «Сдать материалы кордона Бате (Завершить квест 14)»',
          action: () => {
            state.mainQuestStep = 14;
            state.reputation += 40;
            addItem('ammo', 8);
            if (!state.unlockedLocations.includes('hunting_grounds')) {
              state.unlockedLocations.push('hunting_grounds');
            }
            toast('⭐ Квест 14 выполнен: «Тайна кордона» (+40 репутации, +8 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderLocations();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🏚️ «Выдвигаюсь на Заброшенный кордон»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          },
          primary: true
        });
      }
    }
    // Квест 15: Хозяин тайги (step 14 - куратор Егор)
    else if (state.mainQuestStep === 14) {
      const bearDead = !!state.questFlags.bear_defeated || getItemCount('bear_pelt') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 15: ХОЗЯИН ТАЙГИ]:</b></p>`;
      body += `<p><i>«Путь через ущелье к Бункеру преградил гигантский медведь-шатун. Егор выследил его в Охотничьих угодьях. Одолей чудовище — и получишь лучшее оружие лагеря!»</i></p>`;

      if (bearDead) {
        body += `<p style="color:var(--accent-green);">✓ Хозяин тайги повержен! Шкура исполина у вас!</p>`;
        actions.push({
          text: '⭐ «Вручить Бате шкуру медведя и получить ТОЗ-34 (Завершить квест 15)»',
          action: () => {
            state.mainQuestStep = 15;
            state.reputation += 60;
            if (getItemCount('toz') === 0) addItem('toz', 1);
            addItem('ammo', 10);
            toast('⭐ КВЕСТ 15 ВЫПОЛНЕН: «Хозяин тайги» (+60 репутации, ружьё ТОЗ-34, 10 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🏹 «Иду к Егору разрабатывать план засады»',
          action: () => {
            closeModal();
            switchTab('tabCamp');
            talkToNPC('egor');
          },
          primary: true
        });
      }
    }
    // Квест 16: Доспех сталкера (step 15 - куратор Прохор)
    else if (state.mainQuestStep === 15) {
      const hasSuit = getItemCount('stalker_suit') > 0 || state.questFlags.suit_crafted;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 16: ДОСПЕХ СТАЛКЕРА]:</b></p>`;
      body += `<p><i>«Шкура Шатуна крепка как титан. Иди к Прохору — сшейте из нее Укреплённую броню сталкера. В Бункере без брони тебя разорвут турели!»</i></p>`;

      if (hasSuit) {
        body += `<p style="color:var(--accent-green);">✓ Броня сталкера изготовлена и готова к бою!</p>`;
        actions.push({
          text: '⭐ «Показать броню сталкера Бате (Завершить квест 16)»',
          action: () => {
            state.questFlags.suit_crafted = true;
            state.mainQuestStep = 16;
            state.reputation += 30;
            addItem('ammo', 5);
            toast('⭐ Квест 16 выполнен: «Доспех сталкера» (+30 репутации, +5 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🔨 «Иду к Прохору на верстак»',
          action: () => {
            closeModal();
            switchTab('tabCamp');
            talkToNPC('prokhor');
          },
          primary: true
        });
      }
    }
    // Квест 17: Дыхание бездны (step 16 - куратор Анна)
    else if (state.mainQuestStep === 16) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 17: ДЫХАНИЕ БЕЗДНЫ]:</b></p>`;
      body += `<p><i>«Анна изучила записи Воронова: в шахтах Бункера скопился тяжелый газ «Каскад-Б». Без специального респиратора Р-2 ты задохнешься. Срочно зайди в лазарет!»</i></p>`;
      actions.push({
        text: '🩺 «Иду в лазарет к Анне»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('anna');
        },
        primary: true
      });
    }
    // Квест 18: Штурм Бункера (step 17)
    else if (state.mainQuestStep === 17) {
      const turretsDead = !!state.questFlags.turrets_neutralized;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 18: ШТУРМ БУНКЕРА «СФЕРА»]:</b></p>`;
      body += `<p><i>«Ты готов, боец. Заряди ТОЗ-34 патронами, надень респиратор Р-2, примени ключ-карту «Сфера» и подави турели охраны в гермоблоке Бункера!»</i></p>`;

      if (turretsDead) {
        body += `<p style="color:var(--accent-green);">✓ Гермоблок вскрыт, охранные турели нейтрализованы!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о прорыве обороны Бункера (Завершить квест 18)»',
          action: () => {
            state.mainQuestStep = 18;
            state.reputation += 50;
            addItem('ammo', 10);
            toast('⭐ Квест 18 выполнен: «Штурм Бункера» (+50 репутации, +10 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🚪 «Выдвигаюсь на штурм Бункера «Сфера»»',
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
      }
    }
    // Квест 19: Предотвращение Каскада-2 (step 18)
    else if (state.mainQuestStep === 18) {
      const shutdown = !!state.questFlags.reactor_shutdown;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 19: ПРЕДОТВРАЩЕНИЕ «КАСКАДА-2»]:</b></p>`;
      body += `<p><i>«Датчики бункера воют сиреной: реактор перегрет, грядет второй химический выброс на всю долину! Пробейся в реакторный зал, заглуши стержни и забери научный архив и «Нектар-7»!»</i></p>`;

      if (shutdown) {
        body += `<p style="color:var(--accent-green);">✓ Реактор заглушен! Архив «Каскад» и капсула «Нектар-7» спасены!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о спасении всей тайги (Завершить квест 19)»',
          action: () => {
            state.mainQuestStep = 19;
            state.reputation += 80;
            toast('⭐ КВЕСТ 19 ВЫПОЛНЕН: «Каскад-2» предотвращён (+80 репутации)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '☢️ «Спускаюсь в реакторный зал Бункера»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          },
          primary: true
        });
      }
    }
    // Квест 20: Новый рассвет Зари (step 19 - Финал)
    else if (state.mainQuestStep === 19) {
      body += `<p style="color:var(--accent-gold); font-size:14px; font-weight:bold;">🏆 [ФИНАЛ: НОВЫЙ РАССВЕТ «ЗАРИ»]:</p>`;
      body += `<p><i>«СЫНОК! ТЫ СДЕЛАЛ ЭТО! Ты спас лагерь, предотвратил второй взрыв и добыл лекарство для всей сибирской земли. Вся община собралась салютовать тебе!»</i></p>`;
      actions.push({
        text: '🏆 «Принять почести Героя и Легенды тайги (Торжественный Финал)»',
        action: () => {
          state.mainQuestStep = 20;
          state.questFlags.bunker_completed = true;
          state.reputation += 100;
          toast('🏆 СЮЖЕТНАЯ КАМПАНИЯ ПОЛНОСТЬЮ ПРОЙДЕНА! ВЫ — ЛЕГЕНДА ТАЙГИ!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          closeModal();
          showVictoryScreen();
        },
        primary: true
      });
    }
    // Постгейм (step 20+)
    else {
      body += `<p style="color:var(--accent-gold);"><b>[ЛЕГЕНДА ЛАГЕРЯ «ЗАРЯ»]:</b></p>`;
      body += `<p><i>«Здравствуй, легенда! О твоих подвигах у каждого костра слагают песни. Лагерь процветает благодаря тебе. Все тропы тайги открыты для тебя!»</i></p>`;
    }

    body += `<p style="font-size:11px; color:var(--text-dim); margin-top:10px;">Репутация в лагере: ${getReputationTitle(state.reputation)} (${state.reputation} очков)</p>`;
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  function talkAnna() {
    const npc = NPCS.anna;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_anna = true;

    let body = `<p>В медицинском вагончике приятно пахнет сушеной мятой и спиртом. Анна перевязывает жгут и тепло улыбается.</p>`;
    body += `<p><i>«Здравствуй! Главное в тайге — не пей сырую воду из реки и не хватай фонящие ягоды. Если накопишь радиацию — я сварю тебе отвар или дам цистамин.»</i></p>`;

    const actions = [];

    // Квест 2
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: УРОКИ ВЫЖИВАНИЯ]:</b> Анна осматривает вас: <i>«Батя предупредил, что ты новенький. В тайге береги здоровье — радиация не прощает беспечности.»</i></p>`;
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

    // Квест 6: Мёртвые заводи (step 5)
    if (state.mainQuestStep === 5) {
      const hasSample = getItemCount('water_sample') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 6: МЁРТВЫЕ ЗАВОДИ]:</b></p>`;
      body += `<p><i>«Беда! В Быстрянке всплывает дохлая рыба, вода пахнет химикатами. Срочно набери пробу токсичной воды на реке и принеси мне на экспресс-тест!»</i></p>`;
      if (hasSample) {
        actions.push({
          text: '🧪 «Передать пробу токсичной воды Анне (Завершить квест 6)»',
          action: () => {
            removeItem('water_sample', 1);
            state.questFlags.water_sample_given = true;
            state.mainQuestStep = 6;
            state.reputation += 20;
            addItem('antirad', 1);
            toast('⭐ Квест 6 выполнен: «Мёртвые заводи» (+20 репутации, цистамин)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🌊 «Выдвигаюсь на реку Быстрянку за пробой»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }

    // Квест 8: Экспедиция в Гнилую гать (step 7)
    if (state.mainQuestStep === 7) {
      const mossCount = getItemCount('swamp_moss');
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 8: ЭКСПЕДИЦИЯ В ГНИЛУЮ ГАТЬ]:</b></p>`;
      body += `<p><i>«Токсины из реки проникают в грунтовые воды. Единственный природный фильтр — болотный сфагнум. На торфяниках Гнилой гати добудь 2 пучка сфагнума!»</i></p>`;
      if (mossCount >= 2) {
        actions.push({
          text: '🌿 «Передать болотный сфагнум Анне (Завершить квест 8)»',
          action: () => {
            removeItem('swamp_moss', 2);
            state.mainQuestStep = 8;
            state.reputation += 30;
            addItem('herbal_salve', 2);
            toast('⭐ Квест 8 выполнен: «Экспедиция в Гнилую гать» (+30 репутации, 2 целебные мази)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '☣️ «Отправиться в Гнилую гать за сфагнумом»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }

    // Квест 17: Дыхание бездны (step 16)
    if (state.mainQuestStep === 16) {
      const hasResp = getItemCount('respirator') > 0 || state.questFlags.respirator_crafted;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 17: ДЫХАНИЕ БЕЗДНЫ]:</b></p>`;
      body += `<p><i>«В шахтах Бункера висит смертельный газ «Каскад-Б». Без респиратора Р-2 ты погибнешь. Собери 2 сфагнума, 1 пучок трав и свяжи респиратор на верстаке!»</i></p>`;
      if (hasResp) {
        actions.push({
          text: '😷 «Показать готовый респиратор Р-2 Анне (Завершить квест 17)»',
          action: () => {
            state.questFlags.respirator_crafted = true;
            state.mainQuestStep = 17;
            state.reputation += 30;
            addItem('antirad', 2);
            if (!state.unlockedLocations.includes('bunker')) {
              state.unlockedLocations.push('bunker');
            }
            toast('⭐ Квест 17 выполнен: «Дыхание бездны» (+30 репутации, открыт Бункер)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderLocations();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      }
    }

    // Стандартные услуги лазарета
    actions.push(
      {
        text: '🩹 Перевязать раны (Восстановить HP до 100 за 2 патрона)',
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
        text: '💊 Купить цистамин от радиации (за 3 патрона)',
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
        text: '🌿 Сдать пучок трав в лазарет (+5 репутации, +1 патрон)',
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
    body += `<p><i>«Чего стоишь как чужой? Если руки из нужного места — подходи к верстаку, делай капканы да факелы. Принесешь металлолом — по рукам ударим.»</i></p>`;

    const actions = [];

    // Квест 3: Совет по факелу
    if (state.mainQuestStep === 2) {
      body += `<p style="color:var(--accent-gold);"><b>[СОВЕТ МЕХАНИКА]:</b> <i>«Батя просил факел? Возьми 1 сухое полено и 1 проволоку — на верстаке за минуту свяжешь отличный смоляной факел.»</i></p>`;
    }

    // Квест 10: Сборка гидроузла насосной
    if (state.mainQuestStep === 9) {
      const hasMembrane = getItemCount('filter_membrane') > 0 || state.questFlags.has_membrane;
      const scrapCount = getItemCount('scrap');
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 10: СЕРДЦЕ ФИЛЬТРА]:</b> <i>«Принёс мембрану и 3 лома со станции? Давай сюда, перепаяем штуцера и пустим чистую воду в лагерь!»</i></p>`;
      if (hasMembrane && scrapCount >= 3) {
        actions.push({
          text: '🔧 «Смонтировать водоочистной узел вместе с Прохором»',
          action: () => {
            if (getItemCount('filter_membrane') > 0) removeItem('filter_membrane', 1);
            removeItem('scrap', 3);
            state.questFlags.pump_repaired = true;
            toast('Станция запущена! Чистая вода пошла в баки лагеря!');
            sfx.playSuccess();
            talkProkhor();
          },
          primary: true
        });
      }
    }

    // Квест 11: Морзе в ночи (step 10)
    if (state.mainQuestStep === 10) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 11: МОРЗЕ В НОЧИ]:</b></p>`;
      body += `<p><i>«Слушай сюда: в 03:00 мой приемник Р-326 поймал сигнал SOS на частоте 142.5 МГц! Кто-то просит помощи из закрытого сектора. Держи схему ретранслятора, беги к Бате — нужно идти на Радиовышку!»</i></p>`;
      actions.push({
        text: '📜 «Взять схему ретранслятора и пойти к Бате»',
        action: () => {
          state.questFlags.met_prokhor_radio = true;
          state.mainQuestStep = 11;
          state.reputation += 20;
          if (!state.unlockedLocations.includes('radio_tower')) {
            state.unlockedLocations.push('radio_tower');
          }
          toast('⭐ Квест 11 выполнен: «Морзе в ночи» (+20 репутации, открыта Радиовышка)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderLocations();
          renderQuests();
          closeModal();
        },
        primary: true
      });
    }

    // Квест 13: Шифр Воронова (step 12)
    if (state.mainQuestStep === 12) {
      const hasTape = getItemCount('audio_tape') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 13: ШИФР ВОРОНОВА]:</b> <i>«Ты принёс кассету с Радиовышки? Давай её сюда, зарядим в магнитофон!»</i></p>`;
      if (hasTape) {
        actions.push({
          text: '📻 «Вставить кассету в магнитофон и прослушать запись Воронова»',
          action: () => {
            state.questFlags.tape_decoded = true;
            toast('📻 «...Говорит профессор Воронов. Бункер запечатан. Ключ-карта на Заброшенном кордоне...»');
            sfx.playSuccess();
            talkProkhor();
          },
          primary: true
        });
      }
    }

    // Квест 16: Доспех сталкера (step 15)
    if (state.mainQuestStep === 15) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 16: ДОСПЕХ СТАЛКЕРА]:</b></p>`;
      body += `<p><i>«Шкура Хозяина тайги у тебя? На верстаке из неё, 3 металлолома и 2 проволок сошьем настоящую броню сталкера! Она и от пуль защитит, и вещмешок расширит до 30 кг!»</i></p>`;
    }

    // Стандартные услуги Прохора
    actions.push(
      {
        text: '🎒 Улучшить вещмешок до 25 кг (за 5 металлолома)',
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
        text: '🔧 Купить моток сталистой проволоки (за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            addItem('wire', 1);
            toast('Куплен моток сталистой проволоки');
            sfx.playSuccess();
            saveState();
            talkProkhor();
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

    // Квест 2
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: УРОКИ ВЫЖИВАНИЯ]:</b> Егор кивает вам: <i>«Батя говорил про тебя. Держись ближе к реке, учись ловить рыбу — тогда не пропадёшь.»</i></p>`;
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

    // Квест 4: Голодный рассвет (step 3)
    if (state.mainQuestStep === 3) {
      const hasFishMeal = getItemCount('fish_soup') > 0 || getItemCount('cooked_fish') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 4: ГОЛОДНЫЙ РАССВЕТ]:</b></p>`;
      body += `<p><i>«В лагере шаром покати. Сделай удочку на верстаке, вылови рыбу на Быстрянке и приготовь её на костре (запеки или свари уху). Покажи, что умеешь кормить общину!»</i></p>`;
      if (hasFishMeal) {
        actions.push({
          text: '🍲 «Угостить Егора свежей рыбой с костра (Завершить квест 4)»',
          action: () => {
            if (getItemCount('fish_soup') > 0) removeItem('fish_soup', 1);
            else removeItem('cooked_fish', 1);
            state.mainQuestStep = 4;
            state.reputation += 20;
            addItem('ammo', 2);
            toast('⭐ Квест 4 выполнен: «Голодный рассвет» (+20 репутации, +2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🎣 «Отправиться на реку ловить рыбу»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }

    // Квест 7: Следы на иле (step 6)
    if (state.mainQuestStep === 6) {
      const hasLeather = getItemCount('leather') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 7: СЛЕДЫ НА ИЛЕ]:</b></p>`;
      body += `<p><i>«У кромки воды появились следы болотных мутантов. Сколоти капкан на верстаке у Прохора, взведи на берегу или в угодьях и добудь шкуру зверя!»</i></p>`;
      if (hasLeather) {
        actions.push({
          text: '🐾 «Показать шкуру зверя Егору (Завершить квест 7)»',
          action: () => {
            state.mainQuestStep = 7;
            state.reputation += 25;
            addItem('ammo', 3);
            toast('⭐ Квест 7 выполнен: «Следы на иле» (+25 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      }
    }

    // Квест 15: Хозяин тайги (step 14)
    if (state.mainQuestStep === 14) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 15: ХОЗЯИН ТАЙГИ]:</b></p>`;
      body += `<p><i>«Шатун — не простой медведь. Его бока покрыты костяными наростами от мутаций. Бей копьём под лопатку или трижды стреляй в пасть. Иди в Охотничьи угодья, я помогу выследить зверя по следу!»</i></p>`;
      actions.push({
        text: '🏹 «Принять охотничий совет Егора по Шатуну»',
        action: () => {
          state.questFlags.talked_bear = true;
          toast('Вы узнали уязвимые места Хозяина тайги!');
          sfx.playSuccess();
          talkEgor();
        },
        primary: true
      });
    }

    // Стартовая наживка (выдаётся Егором только 1 раз!)
    if (!state.questFlags.egor_starter_worms) {
      actions.push({
        text: '🪱 Взять стартовую наживку (3 червя бесплатно от Егора)',
        action: () => {
          state.questFlags.egor_starter_worms = true;
          addItem('worms', 3);
          toast('Егор отсыпал 3 червя: «Вот на первое время. А дальше сам на реке копай!»');
          sfx.playSuccess();
          saveState();
          talkEgor();
        },
        primary: true
      });
    } else {
      actions.push({
        text: '🪱 Купить банку отборных червей (5 шт. за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('worms', 5);
            toast('Егор отсыпал банку жирных червей.');
            sfx.playSuccess();
            saveState();
            talkEgor();
          } else {
            toast('Не хватает патронов. Накопайте червей бесплатно на берегу реки Быстрянки!');
          }
        }
      });
    }

    // Стандартные услуги Егора
    actions.push(
      {
        text: '🐟 Сдать 2 сырые рыбы в общий котёл (+10 репутации, +2 патрона)',
        action: () => {
          if (getItemCount('raw_fish') >= 2) {
            removeItem('raw_fish', 2);
            addItem('ammo', 2);
            state.reputation += 10;
            toast('Егор принял рыбу в общую кухню (+10 репутации, +2 патрона)');
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
      if (state.mainQuestStep === 5 && !state.questFlags.water_sample_given && getItemCount('water_sample') === 0) {
        actions.push({
          text: '🧪 Набрать пробу токсичной воды для Анны (Квест 6)',
          action: () => doGatherToxicWater(loc),
          primary: true
        });
      }
      actions.push({
        text: '🎣 Рыбачить на удочку (нужна удочка и наживка)',
        action: () => doFishing(loc),
        primary: state.mainQuestStep !== 5
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
      if (state.mainQuestStep === 4 && !state.questFlags.dogs_defeated) {
        actions.push({
          text: '⚔️ Отразить набег одичавших псов копьём (Квест 5)',
          action: () => doFightDogs(loc),
          primary: true
        });
      }
      actions.push({
        text: '🌲 Заготовить сухие дрова',
        action: () => doGatherWood(loc),
        primary: state.mainQuestStep !== 4
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

    // Болота: Гнилая гать
    if (loc.id === 'swamp') {
      actions.push({
        text: '🌿 Собрать болотный сфагнум (нужен для квестов и мази)',
        action: () => doGatherMoss(loc),
        primary: true
      });
      actions.push({
        text: '🔍 Исследовать топь (поиск полезного хлама)',
        action: () => doScavengeSwamp(loc)
      });
    }

    // Насосная станция
    if (loc.id === 'pump_station') {
      if (state.mainQuestStep === 8 && !state.questFlags.pump_cleared) {
        actions.push({
          text: '💥 Расчистить завал у цеха станции (Квест 9)',
          action: () => doClearPumpDebris(loc),
          primary: true
        });
      } else {
        actions.push({
          text: '🔍 Обыскать цех фильтрации (поиск мембраны)',
          action: () => doScavengeStation(loc),
          primary: true
        });
      }
    }

    // Охотничьи угодья
    if (loc.id === 'hunting_grounds') {
      if (state.mainQuestStep === 14 && !state.questFlags.bear_defeated) {
        actions.push({
          text: '🐻 Выследить и победить Хозяина тайги (Квест 15)',
          action: () => doHuntBear(loc),
          primary: true
        });
      }
      actions.push({
        text: '🪤 Установить капкан на крупного зверя',
        action: () => doSetBigTrap(loc),
        primary: state.mainQuestStep !== 14
      });
      actions.push({
        text: '🐗 Активная охота в тайге',
        action: () => doActiveHunt(loc)
      });
    }

    // Заброшенный кордон
    if (loc.id === 'old_cordon') {
      actions.push({
        text: '🔍 Обыскать дом и тайник в погребе (Квест 14 / Припасы)',
        action: () => doSearchCordon(loc),
        primary: true
      });
      actions.push({
        text: '📦 Осмотреть сарай и верстак кордона',
        action: () => doScavengeCordon(loc)
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
                ${scrapCount >= 3 ? '✅' : '❌'} Металлолом: <b>${scrapCount} / 3</b>
              </div>
              <div style="color:${wireCount >= 2 ? 'var(--accent-green)' : 'var(--accent-danger)'};">
                ${wireCount >= 2 ? '✅' : '❌'} Моток проволоки: <b>${wireCount} / 2</b>
              </div>
              <div style="color:${state.energy >= loc.energyCost ? 'var(--accent-green)' : 'var(--accent-danger)'};">
                ${state.energy >= loc.energyCost ? '✅' : '❌'} Энергия: <b>${Math.round(state.energy)}% / ${loc.energyCost}%</b>
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

    // Бункер НИИ «Сфера»
    if (loc.id === 'bunker') {
      if (state.mainQuestStep === 17 && !state.questFlags.turrets_neutralized) {
        actions.push({
          text: '🚪 Вскрыть гермодверь ключ-картой и подавить турели (Квест 18)',
          action: () => doEnterBunker(loc),
          primary: true
        });
      } else if (state.mainQuestStep === 18 && !state.questFlags.reactor_shutdown) {
        actions.push({
          text: '☢️ Прорваться в реакторный зал и заглушить реактор (Квест 19)',
          action: () => doShutdownReactor(loc),
          primary: true
        });
      } else {
        actions.push({
          text: '📦 Осмотреть научные склады Бункера',
          action: () => doScavengeBunker(loc),
          primary: true
        });
      }
    }

    openModal(loc.name, `Вылазка в Тир ${loc.tier}`, loc.icon, body, actions);
  }

  // --- КОНКРЕТНЫЕ АКТИВНОСТИ ВЫЛАЗОК ---
  function doFishing(loc) {
    if (state.energy < loc.energyCost) {
      toast('Недостаточно сил для рыбалки!');
      return;
    }
    if (getItemCount('rod') < 1) {
      toast('У вас нет удочки! Скрафтите её на верстаке у Прохора.');
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

  function doGatherToxicWater(loc) {
    sfx.init();
    sfx.playSplash();
    state.energy -= 5;
    state.rad += 5;
    addItem('water_sample', 1);
    toast('🧪 Набрана проба токсичной желтоватой воды. Отнесите Анне в лагерь!');
    sfx.playSuccess();
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

  function doFightDogs(loc) {
    if (getItemCount('spear') < 1 && getItemCount('toz') < 1) {
      toast('Вам нужно оружие! Скрафтите охотничье копьё на верстаке.');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= 20;
    state.hp = Math.max(10, state.hp - 15);
    state.questFlags.dogs_defeated = true;
    addItem('raw_meat', 2);
    addItem('leather', 1);
    toast('💥 СТАЯ ПСОВ РАЗБИТА! Вы отбились копьём (+2 мяса, +1 шкура). Доложите Бате!');
    passTime(1.5);
    updateHUD();
    saveState();
    renderQuests();
    closeModal();
  }

  function doGatherMoss(loc) {
    if (state.energy < loc.energyCost) {
      toast('Недостаточно сил для сбора сфагнума!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.swamp_explored = true;
    addItem('swamp_moss', 2);
    toast('🌿 Собрано 2 пучка болотного сфагнума для фильтров и мазей.');
    passTime(1);
    updateHUD();
    saveState();
    renderQuests();
    closeModal();
  }

  function doScavengeSwamp(loc) {
    if (state.energy < loc.energyCost) {
      toast('Слишком устали.');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.swamp_explored = true;
    passTime(1.5);
    if (Math.random() > 0.5) {
      addItem('scrap', 2);
      toast('В торфянике найдены ржавые металлические скобы (+2 лома).');
    } else {
      addItem('swamp_moss', 1);
      addItem('herbs', 1);
      toast('На кочке найден сфагнум и болотный багульник.');
    }
    updateHUD();
    saveState();
    renderQuests();
    closeModal();
  }

  function doClearPumpDebris(loc) {
    if (state.energy < 25) {
      toast('Нужно минимум 25% энергии для расчистки завала!');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= 25;
    state.rad += loc.rad;
    state.questFlags.pump_cleared = true;
    addItem('scrap', 3);
    toast('💥 ЗАВАЛ РАСЧИЩЕН! Проход к машинному залу свободен. Доложите Бате!');
    passTime(2);
    updateHUD();
    saveState();
    renderQuests();
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

    if ((state.mainQuestStep === 9 || !state.questFlags?.has_membrane) && getItemCount('filter_membrane') === 0) {
      addItem('filter_membrane', 1);
      addItem('scrap', 3);
      addItem('wire', 1);
      state.questFlags.has_membrane = true;
      toast('⭐ НАЙДЕНА КЕРАМИЧЕСКАЯ МЕМБРАНА, лом и проволока! Отнесите Прохору и Бате.');
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

  function doSearchCordon(loc) {
    if (state.energy < loc.energyCost) {
      toast('Недостаточно сил для обыска кордона!');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= loc.energyCost;
    state.rad += loc.rad;
    passTime(2);

    if (state.mainQuestStep === 13 || (!state.questFlags?.cordon_searched && getItemCount('keycard_sfera') === 0)) {
      addItem('keycard_sfera', 1);
      addItem('note_voronov', 1);
      addItem('ammo', 5);
      addItem('canned_food', 1);
      state.questFlags.cordon_searched = true;
      toast('⭐ В ПОДПОЛЕ НАЙДЕНЫ: Ключ-карта «Сфера», Дневник Воронова и тушёнка! Доложите Бате!');
    } else {
      addItem('scrap', 2);
      addItem('firewood', 2);
      toast('На кордоне найдены сухие дрова и металлолом.');
    }
    updateHUD();
    saveState();
    renderQuests();
    closeModal();
  }

  function doScavengeCordon(loc) {
    if (state.energy < 15) {
      toast('Слишком устали.');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= 15;
    passTime(1);
    addItem('scrap', 2);
    if (Math.random() > 0.5) addItem('canned_food', 1);
    toast('В сарае кордона найден металлолом.');
    closeModal();
  }

  function doHuntBear(loc) {
    if (state.hp < 40) {
      toast('Вы слишком ранены для битвы с Шатуном!');
      return;
    }
    if (getItemCount('spear') < 1 && getItemCount('toz') < 1 && getItemCount('knife') < 1) {
      toast('Идти на Шатуна с голыми руками — верная гибель! Вооружитесь копьём или ружьём.');
      return;
    }

    sfx.init();
    sfx.playSuccess();
    state.energy -= 30;
    state.hp = Math.max(15, state.hp - 30);
    state.questFlags.bear_defeated = true;
    addItem('bear_pelt', 1);
    addItem('raw_meat', 3);
    toast('💥 ХОЗЯИН ТАЙГИ ПОВЕРЖЕН! Добыта шкура медведя-шатуна (+3 мяса). Доложите Бате!');
    passTime(2);
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

    if (hasGun && roll > 0.3) {
      removeItem('ammo', 1);
      addItem('raw_meat', 2);
      addItem('leather', 1);
      toast('💥 Удачный выстрел из ТОЗ-34! Добыт таёжный кабан (+2 мяса, +1 шкура).');
      sfx.playSuccess();
    } else if (roll > 0.5) {
      addItem('raw_meat', 1);
      toast('🏹 Охота: подстрелен заяц (+1 мясо).');
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
      toast(`Недостаточно сил для ремонта антенны! Нужно ${loc.energyCost}% энергии.`);
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
    if (getItemCount('audio_tape') === 0) addItem('audio_tape', 1);
    toast('⭐ АНТЕННА ВОССТАНОВЛЕНА! Перехвачена кассета с записью профессора Воронова! Доложите Бате!');
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
    toast('🔭 С вышки виден дым костров «Зари», кордон лесничества и бетонный купол Бункера «Сфера».');
    closeModal();
  }

  function doEnterBunker(loc) {
    if (state.energy < loc.energyCost) {
      toast('Слишком мало сил для штурма бункера!');
      return;
    }
    if (getItemCount('keycard_sfera') < 1 && !state.questFlags.bunker_entered) {
      toast('Гермодверь заперта! Нужна электронная ключ-карта «Сфера» (найдите на Заброшенном кордоне).');
      return;
    }

    sfx.init();
    sfx.playClick();
    state.energy -= loc.energyCost;
    state.rad += 30;
    passTime(2);

    const hasWeapon = getItemCount('toz') > 0 && getItemCount('ammo') >= 2;
    if (hasWeapon) {
      removeItem('ammo', 2);
    } else {
      state.hp = Math.max(10, state.hp - 35);
    }

    if (!state.questFlags) state.questFlags = {};
    state.questFlags.bunker_entered = true;
    state.questFlags.turrets_neutralized = true;
    addItem('antirad', 2);
    addItem('clean_water', 2);
    addItem('ammo', 5);
    toast('⭐ ОХРАННЫЕ ТУРЕЛИ ПОДАВЛЕНЫ! Проход в глубины Бункера открыт! Доложите Бате.');
    sfx.playSuccess();
    updateHUD();
    saveState();
    renderQuests();
    closeModal();
  }

  function doShutdownReactor(loc) {
    if (getItemCount('respirator') < 1 && !state.questFlags.respirator_crafted) {
      toast('В реакторном зале ядовитый газ! Наденьте респиратор Р-2 перед спуском.');
      return;
    }

    sfx.init();
    sfx.playSuccess();
    state.energy -= 20;
    state.rad += 25;
    passTime(2);

    state.questFlags.reactor_shutdown = true;
    addItem('floppy_disk', 1);
    addItem('stabilizer_nectar', 1);
    toast('⭐ РЕАКТОР ЗАГЛУШЕН! Катастрофа предотвращена! Архив «Каскад» и «Нектар-7» спасены! Срочно к Бате!');
    updateHUD();
    saveState();
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
    if (Math.random() > 0.4) addItem('antirad', 1);
    if (Math.random() > 0.6) addItem('ammo', 3);
    toast('В Бункере найден металлолом, патроны и медикаменты.');
    closeModal();
  }

  function showVictoryScreen() {
    const title = '🏆 ВЕЛИКАЯ ПОБЕДА! СПАСЕНИЕ ЛАГЕРЯ «ЗАРЯ»!';
    const sub = 'Сюжетная сага из 20 квестов успешно завершена';
    const body = `
      <p style="color:var(--accent-gold); font-size:14px; font-weight:bold;">Майор Дмитрий и вся община лагеря салютуют вам!</p>
      <p>Вы прошли колоссальный путь: от истощённого беженца до легендарного защитника тайги. Реактор НИИ «Сфера» заглушен, повторный ядовитый выброс остановлен навсегда, а биостабилизатор «Нектар-7» очистит сибирские земли и вернёт людям жизнь!</p>
      <div style="background:rgba(0,0,0,0.45); padding:10px 14px; border-radius:8px; margin:12px 0; border:1px solid rgba(255,255,255,0.15); line-height:1.6;">
        <b>Ваш итоговый послужной список:</b><br>
        • Финальный статус: <b>${getReputationTitle(state.reputation)}</b> (${state.reputation} очков репутации)<br>
        • Прожито дней в тайге: <b>${state.day}</b><br>
        • Выполнены все 20 ключевых сюжетных заданий!<br>
        • Открыты все сектора карты: Быстрянка, Лес, Гнилая гать, Насосная станция, Охотничьи угодья, Кордон, Радиовышка, Бункер «Сфера»!
      </div>
      <p style="font-size:12px; color:var(--text-dim);">Игра переведена в режим свободного выживания (Endgame). Вы можете продолжать выполнять ежедневные контракты, охотиться, рыбачить и крафтить снаряжение!</p>
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
    document.querySelectorAll('.craft-tab-btn').forEach(b => {
      const isFire = b.getAttribute('onclick')?.includes('fire') || b.textContent.includes('Костёр');
      b.classList.toggle('active', station === 'fire' ? isFire : !isFire);
    });
    renderRecipes();
  }

  function renderRecipes() {
    const list = document.getElementById('recipesList');
    if (!list) return;
    list.innerHTML = '';

    const currentRecipes = RECIPES.filter(r => r.station === state.craftStation);
    currentRecipes.forEach(r => {
      let canCraft = true;
      let costBadges = [];
      for (const [resId, reqCount] of Object.entries(r.cost)) {
        if (reqCount <= 0) continue;
        const have = getItemCount(resId);
        const resName = ITEMS[resId]?.name || resId;
        const isEnough = have >= reqCount;
        if (!isEnough) canCraft = false;
        costBadges.push(`<span class="ingredient-pill ${isEnough ? 'pill-ok' : 'pill-missing'}">${isEnough ? '✓' : '✗'} ${resName}: ${have}/${reqCount}</span>`);
      }

      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <div class="recipe-header">
          <img src="${r.icon}" class="recipe-icon pixel-art" alt="">
          <div>
            <div class="recipe-title">${r.name}</div>
            <div class="recipe-ingredients">${costBadges.join('')}</div>
          </div>
        </div>
        <p style="font-size:11px; color:var(--text-dim); margin:4px 0 0 0;">${r.desc}</p>
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

    if (!state.questFlags) state.questFlags = {};
    if (r.id === 'craft_stalker_suit') state.questFlags.suit_crafted = true;
    if (r.id === 'craft_respirator') state.questFlags.respirator_crafted = true;

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
    document.querySelectorAll('.quest-subtab').forEach(b => {
      const match = b.getAttribute('onclick')?.includes(`'${view}'`);
      b.classList.toggle('active', !!match);
    });
    renderQuests();
  }

  const MAIN_QUESTS = [
    // Акт I: Прибытие и Выживание (1-5)
    {
      step: 0,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '1. Прибытие в «Зарю»',
      giver: '🎖️ Батя (Штаб)',
      desc: 'Вы добрались до лагеря выживших «Заря». Явитесь к коменданту Дмитрию (Бате) в штабе, чтобы узнать порядки общины и встать на довольствие.',
      hint: 'Зайдите во вкладку «Лагерь» и поговорите с Батей в штабе.',
      checklist: (s) => [
        { text: 'Поговорить с Батей в штабе', done: s.mainQuestStep > 0 || s.questFlags.met_batya }
      ]
    },
    {
      step: 1,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '2. Первые шаги: Уроки выживания',
      giver: '🎖️ Батя (Штаб)',
      desc: 'Батя поручил обойти лагерь: познакомиться с фельдшером Анной в лазарете и опытным охотником Егором на берегу реки, после чего доложить о готовности.',
      hint: 'Посетите лазарет (Анна) и берег реки (Егор), затем вернитесь к Бате в штаб.',
      checklist: (s) => [
        { text: 'Познакомиться с фельдшером Анной в лазарете', done: s.mainQuestStep > 1 || s.questFlags.met_anna },
        { text: 'Познакомиться с охотником Егором на реке', done: s.mainQuestStep > 1 || s.questFlags.met_egor },
        { text: 'Доложить Бате об осмотре лагеря', done: s.mainQuestStep > 1 }
      ]
    },
    {
      step: 2,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '3. Огонь во тьме',
      giver: '🎖️ Батя / Прохор',
      desc: 'Ночами к лагерю подбираются твари. Соберите в ближнем лесу сухостой, скрафтите смоляной факел на верстаке и покажите Бате.',
      hint: 'Соберите 3 охапки дров в лесу, скрафтите факел на верстаке и покажите Бате в штабе.',
      checklist: (s) => [
        { text: 'Собрать дрова в лесу (3 шт.)', done: s.mainQuestStep > 2 || getItemCount('firewood') >= 3 || getItemCount('torch') > 0 },
        { text: 'Скрафтить смоляной факел на верстаке', done: s.mainQuestStep > 2 || getItemCount('torch') > 0 },
        { text: 'Доложить Бате в штабе', done: s.mainQuestStep > 2 }
      ]
    },
    {
      step: 3,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '4. Голодный рассвет',
      giver: '🏹 Егор (Река)',
      desc: 'Припасы лагеря на исходе. Егор готов научить вас рыбному промыслу: скрафтите самодельную удочку, наловите рыбы у реки, сварите уху на костре и угостите охотника.',
      hint: 'Скрафтите удочку на верстаке, поймайте рыбу на реке, сварите уху у костра и поговорите с Егором.',
      checklist: (s) => [
        { text: 'Скрафтить самодельную удочку на верстаке', done: s.mainQuestStep > 3 || getItemCount('rod') > 0 },
        { text: 'Поймать рыбу на берегу реки', done: s.mainQuestStep > 3 || (getItemCount('raw_fish') + getItemCount('cooked_fish') + getItemCount('fish_soup')) > 0 },
        { text: 'Приготовить рыбу на костре (уха или жареная рыба)', done: s.mainQuestStep > 3 || (getItemCount('cooked_fish') + getItemCount('fish_soup')) > 0 },
        { text: 'Угостить Егора готовой рыбой на реке', done: s.mainQuestStep > 3 }
      ]
    },
    {
      step: 4,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '5. Крещение тайгой',
      giver: '🎖️ Батя (Штаб)',
      desc: 'Стая мутировавших псов окружила опушку леса и угрожает сборщикам. Скрафтите охотничье копьё на верстаке, отразите атаку стаи и доложите Бате.',
      hint: 'Скрафтите копьё на верстаке, отправляйтесь в Лес на опушку, отбейте нападение стаи псов и доложите Бате.',
      checklist: (s) => [
        { text: 'Скрафтить охотничье копьё на верстаке', done: s.mainQuestStep > 4 || getItemCount('spear') > 0 },
        { text: 'Отразить нападение диких псов на опушке леса', done: s.mainQuestStep > 4 || s.questFlags.dogs_defeated },
        { text: 'Доложить Бате об успешной обороне', done: s.mainQuestStep > 4 }
      ]
    },

    // Акт II: Отравленные топи (6-10)
    {
      step: 5,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '6. Мёртвые заводи',
      giver: '👩‍⚕️ Анна (Лазарет)',
      desc: 'Вода в реке приобрела едкий химический оттенок. Фельдшер Анна просит набрать пробу токсичной воды на реке для лабораторного экспресс-анализа.',
      hint: 'Спуститесь к реке Быстрянке, наберите пробу токсичной воды и отнесите её Анне в лазарет.',
      checklist: (s) => [
        { text: 'Набрать пробу токсичной воды у реки', done: s.mainQuestStep > 5 || getItemCount('water_sample') > 0 || s.questFlags.water_sample_given },
        { text: 'Передать пробу фельдшеру Анне в лазарете', done: s.mainQuestStep > 5 || s.questFlags.water_sample_given }
      ]
    },
    {
      step: 6,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '7. Следы на иле',
      giver: '🏹 Егор (Река)',
      desc: 'Охотник Егор заметил следы странных выдр и ондатр у заводей. Скрафтите капкан на верстаке, взведите его у реки или добудьте шкуру зверя.',
      hint: 'Скрафтите капкан на верстаке, установите его на реке или добудьте шкуру зверя и принесите Егору.',
      checklist: (s) => [
        { text: 'Скрафтить капкан на верстаке', done: s.mainQuestStep > 6 || getItemCount('trap') > 0 || s.trapsSet > 0 || getItemCount('leather') > 0 },
        { text: 'Установить капкан на реке или добыть шкуру', done: s.mainQuestStep > 6 || s.trapsSet > 0 || getItemCount('leather') > 0 },
        { text: 'Показать охотничью добычу Егору', done: s.mainQuestStep > 6 }
      ]
    },
    {
      step: 7,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '8. Экспедиция в Гнилую гать',
      giver: '👩‍⚕️ Анна (Лазарет)',
      desc: 'Для создания антисептической таёжной мази от язв Анне необходим болотный мох (сфагнум). Отправляйтесь в гиблые торфяники «Гнилая гать» и соберите 3 пучка мха.',
      hint: 'Отправляйтесь в локацию «Гнилая гать», соберите 3 сфагнума и доставьте их в лазарет Анне.',
      checklist: (s) => [
        { text: 'Разведать болота «Гнилая гать» на карте', done: s.mainQuestStep > 7 || s.questFlags.swamp_explored },
        { text: 'Собрать болотный мох (3 шт.) в топях', done: s.mainQuestStep > 7 || getItemCount('swamp_moss') >= 3 },
        { text: 'Доставить мох Анне в лазарет', done: s.mainQuestStep > 7 }
      ]
    },
    {
      step: 8,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '9. Прорыв к Насосной станции',
      giver: '🎖️ Батя (Штаб)',
      desc: 'Источником заражения речной протоки стал сбой Насосной станции №4. Проберитесь на станцию, расчистите завал из обломков арматуры и доложите Бате.',
      hint: 'Отправляйтесь на Насосную станцию №4 на карте, расчистите завал у входа и доложите Бате.',
      checklist: (s) => [
        { text: 'Добраться до Насосной станции №4 на карте', done: s.mainQuestStep > 8 || s.unlockedLocations.includes('pump') },
        { text: 'Расчистить завал у машинного зала станции', done: s.mainQuestStep > 8 || s.questFlags.pump_cleared },
        { text: 'Доложить Бате о расчищенном проходе', done: s.mainQuestStep > 8 }
      ]
    },
    {
      step: 9,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '10. Сердце фильтра',
      giver: '🔧 Прохор / Батя',
      desc: 'В цехе станции уцелела промышленная керамическая мембрана очистки. Найдите мембрану, соберите 3 металлолома и восстановите центральный водоочиститель лагеря.',
      hint: 'Обыщите Насосную станцию №4, найдите мембрану, соберите 3 металлолома и поговорите с Прохором или Батей.',
      checklist: (s) => [
        { text: 'Найти керамическую мембрану в цехе станции', done: s.mainQuestStep > 9 || getItemCount('filter_membrane') > 0 || s.questFlags.has_membrane || s.questFlags.pump_repaired },
        { text: 'Собрать металлолом (3 шт.) для крепежа', done: s.mainQuestStep > 9 || getItemCount('scrap') >= 3 || s.questFlags.pump_repaired },
        { text: 'Сдать детали Прохору / Бате и запустить фильтр', done: s.mainQuestStep > 9 || s.questFlags.pump_repaired }
      ]
    },

    // Акт III: Голоса из прошлого (11-15)
    {
      step: 10,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '11. Морзе в ночи',
      giver: '🔧 Прохор (Лагерь)',
      desc: 'Механик Прохор уловил обрывки радиопередачи на коротких волнах. Поговорите с ним, возьмите схему ретранслятора и разведайте тропу к старой Радиовышке.',
      hint: 'Поговорите с Прохором в лагере, чтобы нанести Радиовышку на карту.',
      checklist: (s) => [
        { text: 'Получить схему ретранслятора у Прохора', done: s.mainQuestStep > 10 || s.questFlags.met_prokhor_radio },
        { text: 'Разведать дорогу к Радиовышке на карте', done: s.mainQuestStep > 10 || s.unlockedLocations.includes('radio') }
      ]
    },
    {
      step: 11,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '12. Эхо на Скалистом утёсе',
      giver: '🎖️ Батя (Штаб)',
      desc: 'Антенна вышки разбита бурей. Соберите 3 металлолома и 2 мотка проволоки, поднимитесь на Скалистый утёс, восстановите радиомачту и перехватите сигнал.',
      hint: 'Соберите металлолом (3 шт.) и проволоку (2 шт.), почините антенну на Радиовышке и доложите Бате.',
      checklist: (s) => [
        { text: 'Собрать материалы (Металлолом 3 шт., Проволока 2 шт.)', done: s.mainQuestStep > 11 || s.questFlags.radio_repaired || (getItemCount('scrap') >= 3 && getItemCount('wire') >= 2) },
        { text: 'Починить антенную мачту на Радиовышке', done: s.mainQuestStep > 11 || s.questFlags.radio_repaired },
        { text: 'Доложить Бате о перехваченном сигнале', done: s.mainQuestStep > 11 }
      ]
    },
    {
      step: 12,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '13. Шифр Воронова',
      giver: '🎖️ Батя (Штаб)',
      desc: 'На радиовышке обнаружена уцелевшая кассета Воронова. Расшифруйте аудиозапись на штабном магнитофоне у Бати, чтобы узнать координаты укрытия учёного.',
      hint: 'Поговорите с Батей в штабе и прослушайте запись с кассеты Воронова.',
      checklist: (s) => [
        { text: 'Иметь при себе аудиокассету Воронова', done: s.mainQuestStep > 12 || getItemCount('audio_tape') > 0 || s.questFlags.tape_decoded },
        { text: 'Расшифровать запись на магнитофоне у Бати', done: s.mainQuestStep > 12 || s.questFlags.tape_decoded }
      ]
    },
    {
      step: 13,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '14. Тайна Заброшенного кордона',
      giver: '🎖️ Батя (Штаб)',
      desc: 'Отправляйтесь на Заброшенный кордон лесничества в предгорьях. Отыщите тайник Воронова с полевым дневником и магнитной ключ-картой «Сфера-Допуск».',
      hint: 'Отправляйтесь на Заброшенный кордон на карте, найдите ключ-карту «Сфера» и покажите находки Бате.',
      checklist: (s) => [
        { text: 'Обыскать Заброшенный кордон на карте', done: s.mainQuestStep > 13 || s.questFlags.cordon_searched },
        { text: 'Найти дневник Воронова и ключ-карту «Сфера»', done: s.mainQuestStep > 13 || getItemCount('keycard_sfera') > 0 },
        { text: 'Показать ключ-карту и дневник Бате в штабе', done: s.mainQuestStep > 13 }
      ]
    },
    {
      step: 14,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '15. Хозяин тайги',
      giver: '🏹 Егор / Батя',
      desc: 'Тропу к научному бункеру терроризирует свирепый медведь-шатун с железными когтями. Расспросите Егора о повадках зверя, выследите чудовище в чаще леса и добудьте шкуру.',
      hint: 'Поговорите с Егором, вооружитесь патронами/копьём, выследите медведя в Чаще леса и принесите шкуру Бате.',
      checklist: (s) => [
        { text: 'Обсудить повадки зверя с охотником Егором', done: s.mainQuestStep > 14 || s.questFlags.talked_bear || s.questFlags.bear_defeated },
        { text: 'Победить медведя-шатуна в чаще леса', done: s.mainQuestStep > 14 || s.questFlags.bear_defeated },
        { text: 'Принести шкуру хозяина тайги Бате в штаб', done: s.mainQuestStep > 14 }
      ]
    },

    // Акт IV: Спуск в Бездну (16-20)
    {
      step: 15,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '16. Доспех сталкера',
      giver: '🔧 Прохор (Лагерь)',
      desc: 'Внутри бункера автоматические пулемёты и колючая проволока. Прохор готов помочь сшить усиленную сталкерскую куртку из шкуры медведя, ткани и металла.',
      hint: 'Скрафтите бронекостюм сталкера на верстаке (Шкура медведя, 3 ткани, 2 металлолома) и доложите Бате.',
      checklist: (s) => [
        { text: 'Собрать материалы для брони (Шкура, 3 ткани, 2 лома)', done: s.mainQuestStep > 15 || getItemCount('stalker_suit') > 0 || s.questFlags.suit_crafted },
        { text: 'Скрафтить куртку сталкера на верстаке', done: s.mainQuestStep > 15 || getItemCount('stalker_suit') > 0 || s.questFlags.suit_crafted },
        { text: 'Доложить Бате о готовности штурмовой защиты', done: s.mainQuestStep > 15 }
      ]
    },
    {
      step: 16,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '17. Дыхание бездны',
      giver: '👩‍⚕️ Анна (Лазарет)',
      desc: 'Вентиляция бункера забита ядовитыми аэрозолями распада. Без надёжного фильтра спуск смертелен. Скрафтите армейский респиратор Р-2 на верстаке и пройдите проверку у Анны.',
      hint: 'Скрафтите респиратор на верстаке (2 ткани, 2 угля, 1 проволока) и покажите его Анне в лазарете.',
      checklist: (s) => [
        { text: 'Собрать компоненты (2 ткани, 2 угля, 1 проволока)', done: s.mainQuestStep > 16 || getItemCount('respirator') > 0 || s.questFlags.respirator_crafted },
        { text: 'Скрафтить респиратор Р-2 на верстаке', done: s.mainQuestStep > 16 || getItemCount('respirator') > 0 || s.questFlags.respirator_crafted },
        { text: 'Пройти проверку герметичности у фельдшера Анны', done: s.mainQuestStep > 16 }
      ]
    },
    {
      step: 17,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '18. Штурм Бункера «Сфера»',
      giver: '🎖️ Батя (Штаб)',
      desc: 'Экипируйтесь лучшим оружием и патронами. Отправляйтесь к Бункеру «Сфера», откройте бронешлюз ключ-картой Воронова, подавите охранные турели и закрепитесь на объекте.',
      hint: 'Отправляйтесь в Бункер «Сфера» на карте, вскройте шлюз ключ-картой, уничтожьте турели и доложите Бате.',
      checklist: (s) => [
        { text: 'Открыть гермошлюз Бункера «Сфера» ключ-картой', done: s.mainQuestStep > 17 || s.questFlags.bunker_entered },
        { text: 'Подавить автоматические турели охранного контура', done: s.mainQuestStep > 17 || s.questFlags.turrets_neutralized },
        { text: 'Доложить Бате о прорыве обороны бункера', done: s.mainQuestStep > 17 }
      ]
    },
    {
      step: 18,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '19. Предотвращение «Каскада-2»',
      giver: '🎖️ Батя (Штаб)',
      desc: 'Реактор термоядерного распада комплекса выходит на критический режим. Прорвитесь к центральному пульту, заглушите стержни, извлеките дискету с архивами и образец «Нектар-7».',
      hint: 'Спуститесь в Реакторный зал Бункера «Сфера», запустите аварийное глушение, заберите архив и доложите Бате.',
      checklist: (s) => [
        { text: 'Пробиться к пульту управления аварийного реактора', done: s.mainQuestStep > 18 || s.questFlags.reactor_reached || s.questFlags.reactor_shutdown },
        { text: 'Запустить аварийное глушение реактора', done: s.mainQuestStep > 18 || s.questFlags.reactor_shutdown },
        { text: 'Извлечь дискету с архивом и биостабилизатор «Нектар-7»', done: s.mainQuestStep > 18 || getItemCount('floppy_disk') > 0 },
        { text: 'Доложить Бате об устранении угрозы взрыва', done: s.mainQuestStep > 18 }
      ]
    },
    {
      step: 19,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '20. Новый рассвет «Зари»',
      giver: '🎖️ Батя / Община',
      desc: 'Угроза второго Каскада предотвращена навсегда! Передайте Бате научный архив проекта «Каскад», примите участие в триумфальном собрании у костра лагеря «Заря».',
      hint: 'Поговорите с Батей в штабе лагеря, передайте дискету с архивом и отпразднуйте победу!',
      checklist: (s) => [
        { text: 'Передать архивные дискеты Бате в штабе', done: s.mainQuestStep >= 20 || s.questFlags.bunker_completed },
        { text: 'Принять высшую награду общины и звание «Легенда тайги»', done: s.mainQuestStep >= 20 }
      ]
    }
  ];

  function renderQuests() {
    const area = document.getElementById('questContentArea');
    if (!area) return;
    area.innerHTML = '';

    if (!state.questFlags) {
      state.questFlags = JSON.parse(JSON.stringify(INITIAL_STATE.questFlags));
    }

    if (state.questView === 'main') {
      const completedCount = MAIN_QUESTS.filter(q => state.mainQuestStep > q.step || (q.step === 19 && state.mainQuestStep >= 20)).length;
      const progressPct = Math.round((completedCount / MAIN_QUESTS.length) * 100);

      const headerDiv = document.createElement('div');
      headerDiv.className = 'quest-campaign-header';
      headerDiv.style.cssText = 'background:var(--bg-card); border:1px solid var(--border-color); border-radius:6px; padding:10px 12px; margin-bottom:12px;';
      headerDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:700; font-size:13px; color:var(--accent-gold);">📜 Основной сюжет: Спасение «Зари»</span>
          <span style="font-weight:700; font-size:12px; color:var(--text-main);">${completedCount} / ${MAIN_QUESTS.length} (${progressPct}%)</span>
        </div>
        <div style="background:rgba(0,0,0,0.4); border-radius:4px; height:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
          <div style="background:linear-gradient(90deg, var(--accent-gold), var(--accent-green)); height:100%; width:${progressPct}%; transition:width 0.3s ease;"></div>
        </div>
        ${state.mainQuestStep >= 20 ? '<div style="margin-top:6px; font-size:11.5px; color:var(--accent-green); font-weight:700; text-align:center;">🏆 Вся сага из 20 квестов завершена! Вы — Легенда тайги.</div>' : ''}
      `;
      area.appendChild(headerDiv);

      let currentAct = 0;

      MAIN_QUESTS.forEach(q => {
        const isDone = state.mainQuestStep > q.step || (q.step === 19 && state.mainQuestStep >= 20);
        const isCurrent = state.mainQuestStep === q.step;
        const isLocked = state.mainQuestStep < q.step;

        if (q.actNum !== currentAct) {
          currentAct = q.actNum;
          const actHeader = document.createElement('div');
          actHeader.className = 'quest-act-header';
          actHeader.style.cssText = 'margin:14px 0 6px; font-weight:700; font-size:11.5px; letter-spacing:0.5px; text-transform:uppercase; color:var(--accent-gold); display:flex; align-items:center; gap:8px;';
          actHeader.innerHTML = `
            <span>${q.act}</span>
            <span style="flex:1; height:1px; background:var(--border-color); opacity:0.6;"></span>
          `;
          area.appendChild(actHeader);
        }

        const card = document.createElement('div');
        card.className = `quest-item-card ${isDone ? 'completed' : (isCurrent ? 'active-quest' : '')}`;

        let checklistHtml = '';
        if (!isLocked) {
          const items = q.checklist(state);
          checklistHtml = `
            <div class="quest-checklist" style="margin-top:8px; font-size:12px; display:flex; flex-direction:column; gap:4px;">
              ${items.map(item => `
                <div style="color:${item.done ? 'var(--accent-green)' : 'var(--text-main)'}; display:flex; align-items:center; gap:6px;">
                  <span>${item.done ? '☑' : '☐'}</span>
                  <span style="${item.done ? 'text-decoration:line-through; opacity:0.8;' : 'font-weight:500;'}">${item.text}</span>
                </div>
              `).join('')}
            </div>
          `;
        }

        let hintHtml = '';
        if (isCurrent && q.hint) {
          hintHtml = `
            <div style="margin-top:8px; padding:6px 8px; background:rgba(217, 119, 6, 0.15); border-left:3px solid var(--accent-gold); border-radius:4px; font-size:11.5px; color:var(--accent-gold);">
              <strong>💡 Задачи:</strong> ${q.hint}
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
          <div style="font-size:11px; color:var(--text-dim); margin-bottom:4px;">Поручитель: <b style="color:var(--text-main);">${q.giver}</b></div>
          <p class="quest-desc" style="margin-top:2px;">${isLocked ? 'Станет доступно по мере развития сюжетной цепочки.' : q.desc}</p>
          ${checklistHtml}
          ${hintHtml}
        `;
        area.appendChild(card);
      });
    } else if (state.questView === 'daily') {
      if (!state.dailyQuests || state.dailyQuests.length === 0) {
        area.innerHTML = `
          <div class="quest-item-card" style="text-align:center; padding:16px;">
            <p class="quest-desc">Нет активных ежедневных поручений. Дождитесь следующего утра или проверьте доску объявлений у костра.</p>
          </div>
        `;
      } else {
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
      }
    } else if (state.questView === 'lore') {
      area.innerHTML = `
        <div class="quest-item-card">
          <div class="quest-title-row"><span>📻 История Катастрофы («Каскад»)</span></div>
          <p class="quest-desc">В конце 1980-х годов в закрытом исследовательском комплексе НИИ «Сфера» произошла аномальная авария реактора синтеза. Заражённые токсичные воды и радиоактивный смог накрыли прилегающую тайгу. Жилые посёлки были эвакуированы, а оставшиеся превратились в изолированные очаги выживания.</p>
        </div>
        <div class="quest-item-card">
          <div class="quest-title-row"><span>🏕️ Основание лагеря «Заря»</span></div>
          <p class="quest-desc">Майор Дмитрий («Батя») собрал уцелевших рабочих, егерей и семьи на холме у старой лесопилки. Благодаря возвышенности и бьющим родникам лагерь выстоял. Сегодня «Заря» — единственный оплот надежды посреди отравленной сибирской тайги.</p>
        </div>
        <div class="quest-item-card">
          <div class="quest-title-row"><span>🧪 Тайна профессора Воронова</span></div>
          <p class="quest-desc">Главный научный руководитель проекта профессор Воронов остался в зоне бедствия, пытаясь разработать биостабилизатор «Нектар-7» для нейтрализации мутаций и распада. Его дневники и записи хранят ключ к спасению края от второго, окончательного взрыва реактора.</p>
        </div>
      `;
    }
  }

  // --- НАВИГАЦИЯ ПО ВКЛАДКАМ ---
  function switchTab(tabId) {
    sfx.init();
    sfx.playClick();
    closeModal();
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const btnIndex = ['tabCamp', 'tabMap', 'tabInventory', 'tabCraft', 'tabQuests'].indexOf(tabId);
    const navButtons = document.querySelectorAll('.nav-btn');
    if (navButtons[btnIndex]) navButtons[btnIndex].classList.add('active');

    // Всегда обновляем активную вкладку свежими данными
    if (tabId === 'tabInventory') renderInventory();
    else if (tabId === 'tabCraft') renderRecipes();
    else if (tabId === 'tabQuests') renderQuests();
    else if (tabId === 'tabMap') renderLocations();
    else if (tabId === 'tabCamp') renderNPCs();
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
        parsed.questFlags = Object.assign({}, INITIAL_STATE.questFlags, parsed.questFlags || {});

        // Автоматическая нормализация флагов для старых сохранений
        if (parsed.mainQuestStep >= 1) parsed.questFlags.met_batya = true;
        if (parsed.mainQuestStep >= 2) {
          parsed.questFlags.met_anna = true;
          parsed.questFlags.met_egor = true;
          parsed.questFlags.met_prokhor = true;
        }
        if (parsed.mainQuestStep >= 4) {
          parsed.questFlags.egor_starter_worms = true;
        }
        if (parsed.mainQuestStep >= 5) {
          parsed.questFlags.dogs_defeated = true;
        }
        if (parsed.mainQuestStep >= 6) {
          parsed.questFlags.water_sample_given = true;
        }
        if (parsed.mainQuestStep >= 7) {
          parsed.questFlags.swamp_explored = true;
        }
        if (parsed.mainQuestStep >= 9) {
          parsed.questFlags.pump_cleared = true;
        }
        if (parsed.mainQuestStep >= 10) {
          parsed.questFlags.has_membrane = true;
          parsed.questFlags.pump_repaired = true;
        }
        if (parsed.mainQuestStep >= 12) {
          parsed.questFlags.met_prokhor_radio = true;
          parsed.questFlags.radio_repaired = true;
        }
        if (parsed.mainQuestStep >= 13) {
          parsed.questFlags.tape_decoded = true;
        }
        if (parsed.mainQuestStep >= 14) {
          parsed.questFlags.cordon_searched = true;
        }
        if (parsed.mainQuestStep >= 15) {
          parsed.questFlags.talked_bear = true;
          parsed.questFlags.bear_defeated = true;
        }
        if (parsed.mainQuestStep >= 17) {
          parsed.questFlags.suit_crafted = true;
        }
        if (parsed.mainQuestStep >= 18) {
          parsed.questFlags.respirator_crafted = true;
          parsed.questFlags.bunker_entered = true;
        }
        if (parsed.mainQuestStep >= 19) {
          parsed.questFlags.turrets_neutralized = true;
          parsed.questFlags.reactor_reached = true;
        }
        if (parsed.mainQuestStep >= 20) {
          parsed.questFlags.reactor_shutdown = true;
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
