/* ==========================================================================
   ИГРОВОЙ ДВИЖОК: ТЕКСТОВАЯ RPG «ЛАГЕРЬ ЗАРЯ»
   ========================================================================== */

const Game = (() => {

  // --- ХРАНИЛИЩЕ БАЗЫ ПРЕДМЕТОВ ---
  const ITEMS = {
    clean_water: { id: 'clean_water', name: 'Чистая вода', type: 'food', icon: 'assets/images/bottled_water.png', weight: 0.5, desc: 'Кипячёная чистая вода в армейской фляге.', thirst: 45, rad: 0 },
    raw_water: { id: 'raw_water', name: 'Речная вода', type: 'food', icon: 'assets/images/polluted_water.png', weight: 0.5, desc: 'Мутная вода из реки Быстрянки. Опасно пить сырой!', thirst: 30, rad: 12 },
    raw_fish: { id: 'raw_fish', name: 'Сырая рыба', type: 'food', icon: 'assets/images/fish_corpse.png?v=2.3', weight: 0.4, desc: 'Свежепойманная речная рыба. Зубастый таёжный хищник. Лучше зажарить на костре.', hunger: 15, rad: 8 },
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
    note_geologist: { id: 'note_geologist', name: 'Дневник геолога', type: 'lore', icon: 'assets/images/stash_map.png', weight: 0.0, desc: 'Записи о странных спорах и аномальном поведении речной рыбы после взрыва на дамбе.' },
// Новые предметы расширения: Алхимия, Электроника, Артефакты
    amanita: { id: 'amanita', name: 'Красный мухомор', type: 'resource', icon: 'assets/images/amanita.png', weight: 0.1, desc: 'Ядовитый таёжный мухомор в белую крапинку. Основа для древних снадобий староверов.' },
    alcohol: { id: 'alcohol', name: 'Медицинский спирт', type: 'resource', icon: 'assets/images/alcohol.png', weight: 0.3, desc: 'Флакон чистого 96% спирта из полевой армейской аптечки. Незаменим в алхимии.' },
    spiridon_vodka: { id: 'spiridon_vodka', name: '«Спиридоновка»', type: 'food', icon: 'assets/images/hw_potion.png', weight: 0.4, desc: 'Ядрёная настойка деда Спиридона на мухоморах. Даёт мощный прилив сил (+40 энергии, -15 усталости).', energy: 40 },
    tar_salve: { id: 'tar_salve', name: 'Дегтярный бальзам', type: 'med', icon: 'assets/images/hw_potion.png', weight: 0.2, desc: 'Густая мазь из берёзового дегтя и сфагнума. Заживляет раны (+40 HP) и даёт бафф защиты от зверей.', hp: 40 },
    lynx_eye: { id: 'lynx_eye', name: 'Эликсир «Око рыси»', type: 'med', icon: 'assets/images/hw_potion.png', weight: 0.2, desc: 'Особый сбор Спиридона. Обостряет зрение во тьме: ночные вылазки проходят без штрафов к энергии!' },
    batteryaaa: { id: 'batteryaaa', name: 'Батарейки 1.5В', type: 'resource', icon: 'assets/images/batteryaaa.png', weight: 0.1, desc: 'Сухие элементы питания советского стандарта. Нужны для дозиметра и полевого электрофонаря.' },
    geiger_counter: { id: 'geiger_counter', name: 'Счётчик Гейгера ДП-5', type: 'tool', icon: 'assets/images/geiger_counter.png', weight: 1.0, desc: 'Надёжный армейский дозиметр. Пассивно снижает накопление радиации на 30% во всех вылазках!' },
    electric_torch: { id: 'electric_torch', name: 'Полевой электрофонарь', type: 'tool', icon: 'assets/images/electric_torch.png?v=2.3', weight: 0.5, desc: 'Электрический фонарь с мощным отражателем и аккумулятором. Освещает ночной путь без расхода дров и спичек.' },
    geo_compass: { id: 'geo_compass', name: 'Компас «Енисей»', type: 'tool', icon: 'assets/images/stash_map.png', weight: 0.3, desc: 'Точный геодезический инструмент экспедиции «Енисей-3». Снижает расход энергии в вылазках на 5.' },
    toz_scope: { id: 'toz_scope', name: 'Охотничий прицел ТОЗ', type: 'tool', icon: 'assets/images/handmade_tools.png', weight: 0.3, desc: 'Трофейный коллиматорный прицел мародёров (+30% к шансу критического выстрела на охоте).' },
    wolf_fang: { id: 'wolf_fang', name: 'Амулет «Волчий клык»', type: 'tool', icon: 'assets/images/wolf_tooth.png', weight: 0.1, desc: 'Клык вожака лесной стаи на сыромятном ремешке (+5 к урону в ближнем бою).' },
    glowing_moss: { id: 'glowing_moss', name: 'Светящийся сфагнум', type: 'resource', icon: 'assets/images/moss.png', weight: 0.2, desc: 'Редкий болотный мох, излучающий в темноте призрачное изумрудное сияние.' },
    stimulator_m: { id: 'stimulator_m', name: '«Стимулятор-М»', type: 'med', icon: 'assets/images/antirad.png', weight: 0.2, desc: 'Секретная разработка «Био-4». Навсегда увеличивает максимальный запас энергии на 25 единиц!', hp: 50, energy: 50 },
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
    },
    {
      id: 'brew_spiridon_vodka', station: 'fire', name: 'Сварить настойку «Спиридоновка»', icon: 'assets/images/hw_potion.png',
      cost: { amanita: 1, alcohol: 1, clean_water: 1 }, result: { spiridon_vodka: 1 }, energy: 5, timeMin: 20,
      desc: 'Ядрёное снадобье староверов. Мгновенно даёт +40% энергии и прогоняет сонливость.'
    },
    {
      id: 'brew_tar_salve', station: 'fire', name: 'Сварить дегтярный бальзам', icon: 'assets/images/hw_potion.png',
      cost: { swamp_moss: 1, firewood: 1, herbs: 1 }, result: { tar_salve: 1 }, energy: 5, timeMin: 20,
      desc: 'Смолистая мазь от рваных ран (+40 HP). Защищает от укусов хищников и снижает урон на 3 вылазки.'
    },
    {
      id: 'brew_lynx_eye', station: 'fire', name: 'Сварить эликсир «Око рыси»', icon: 'assets/images/hw_potion.png',
      cost: { berries: 2, herbs: 1, clean_water: 1 }, result: { lynx_eye: 1 }, energy: 5, timeMin: 15,
      desc: 'Таёжный отвар обостряет зрение во тьме: ночные вылазки проходят без штрафов к энергии!'
    },
    {
      id: 'craft_geiger', station: 'bench', name: 'Собрать Счётчик Гейгера ДП-5', icon: 'assets/images/geiger_counter.png',
      cost: { scrap: 2, wire: 2, batteryaaa: 1 }, result: { geiger_counter: 1 }, energy: 10, timeMin: 30,
      desc: 'Армейский дозиметр. Пассивно снижает накопление радиации на 30% во всех вылазках!'
    },
    {
      id: 'craft_electric_torch', station: 'bench', name: 'Собрать полевой электрофонарь', icon: 'assets/images/electric_torch.png?v=2.3',
      cost: { wire: 1, batteryaaa: 1, scrap: 1 }, result: { electric_torch: 1 }, energy: 5, timeMin: 15,
      desc: 'Электрический фонарь с вечным светодиодом. Освещает ночной путь без расхода дров.'
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
      id: 'batya', name: 'Майор Дмитрий (Батя)', role: 'Комендант лагеря', avatar: 'assets/images/npc_leader.png?v=2.1',
      desc: 'Руководит обороной лагеря и распределением припасов. Бывший военный.'
    },
    anna: {
      id: 'anna', name: 'Анна Павловна', role: 'Фельдшер-травница', avatar: 'assets/images/npc_default_woman.png?v=2.1',
      desc: 'Лечит раненых, готовит настойки и скупает таёжные травы.'
    },
    prokhor: {
      id: 'prokhor', name: 'Прохор Кузьмич', role: 'Механик лагеря', avatar: 'assets/images/npc_engineer.png?v=2.1',
      desc: 'Заведует верстаком. Из консервной банки и проволоки соберет капкан.'
    },
    egor: {
      id: 'egor', name: 'Егор Лесник', role: 'Охотник и следопыт', avatar: 'assets/images/npc_def_male.png?v=2.1',
      desc: 'Знает каждый овраг в тайге. Учит ловить рыбу и ставить силки.'
    },
spiridon: {
      id: 'spiridon', name: 'Дед Спиридон', role: 'Знахарь-старовер', avatar: 'assets/images/npc_spiridon.png?v=2.2',
      desc: 'Отшельник из глубины Гнилой гати. Хранит секреты таёжной алхимии и древних снадобий.'
    },
    sasha: {
      id: 'sasha', name: 'Саша «Связист»', role: 'Радиотехник НИИ', avatar: 'assets/images/npc_sasha.png?v=2.2',
      desc: 'Спасённый лаборант «Сферы». Сканирует радиоэфир и собирает сложную электронику.'
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
      bunker_completed: false,
met_spiridon: false,
      met_sasha: false,
      pup_rescued: false,
      dog_house_built: false,
      dog_trained: false,
      brdm_searched: false,
      brdm_reported: false,
      drain_cleared: false,
      safe_cracked: false,
      safe_reported: false,
      stove_searched: false,
      logger_extracted: false,
      wolves_defeated: false,
      wolves_reported: false,
      boar_defeated: false,
      boar_reported: false,
      bio4_cleared: false,
      geo1_done: false,
      geo2_done: false,
      geo3_done: false,
      caravan1_done: false,
      caravan2_done: false,
      caravan3_done: false,
      river_container_looted: false
    },
    maxEnergy: 100,
    hasDog: false,
    dogName: 'Буран',
    hasGeoCompass: false,
    hasGeiger: false,
    hasElectricTorch: false,
    hasTozScope: false,
    spiridonBuff: 0,
    lynxEyeBuff: 0,
    pumpWaterActive: false,
    activeStashLocation: null,
    sashaRadioUsedToday: false,
    sideQuests: {},
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
    // Водозабор с насосной станции
    if (state.pumpWaterActive) {
      addItem('clean_water', 1);
      toast('🚰 Лагерная колонка накачала +1 флягу чистой воды из восстановленной системы станции.');
    }
    // Сброс ежедневного сканирования радиоэфира
    state.sashaRadioUsedToday = false;
    // Подарок от Бурана
    if (state.hasDog && Math.random() < 0.35) {
      const dogGifts = ['raw_meat', 'leather', 'scrap', 'herbs'];
      const gift = dogGifts[Math.floor(Math.random() * dogGifts.length)];
      addItem(gift, 1);
      toast(`🐕 Буран прибежал на рассвете и положил к ногам добычу: ${ITEMS[gift]?.name || gift}!`);
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

    if (item.type === 'food' || item.type === 'med') {
      const maxEng = state.maxEnergy || 100;
      if (item.hunger) state.hunger = Math.min(100, state.hunger + item.hunger);
      if (item.thirst) state.thirst = Math.min(100, state.thirst + item.thirst);
      if (item.hp) state.hp = Math.min(100, state.hp + item.hp);
      if (item.rad) state.rad = Math.max(0, state.rad + item.rad);
      if (item.energy) state.energy = Math.min(maxEng, state.energy + item.energy);

      if (itemId === 'spiridon_vodka') {
        toast('🧪 Огненная «Спиридоновка» обжигает горло! Усталость снята как рукой (+40% энергии)!');
      } else if (itemId === 'tar_salve') {
        state.spiridonBuff = 3;
        toast('🍯 Дегтярный бальзам заживляет раны (+40 HP) и даёт защиту от зверей на 3 вылазки!');
      } else if (itemId === 'lynx_eye') {
        state.lynxEyeBuff = 4;
        toast('👁️ Эликсир «Око рыси»: зрачки расширяются во тьме! Ночные вылазки проходят без штрафов к энергии.');
      } else if (itemId === 'stimulator_m') {
        state.maxEnergy = (state.maxEnergy || 100) + 25;
        state.energy = state.maxEnergy;
        toast('🧬 «Стимулятор-М» введён! Максимальный запас энергии повышен до ' + state.maxEnergy + '%!');
      } else {
        toast(`Использовано: ${item.name}`);
      }

      removeItem(itemId, 1);
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
      // Спиридон виден после обнаружения его заимки на болоте
      if (npc.id === 'spiridon' && !state.questFlags?.met_spiridon) return;
      // Саша виден после спасения у Радиовышки
      if (npc.id === 'sasha' && !state.questFlags?.met_sasha) return;

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

    // Карточка верного пса Бурана
    if (state.hasDog) {
      const dogCard = document.createElement('div');
      dogCard.className = 'npc-card';
      dogCard.style.border = '1px solid var(--accent-gold)';
      dogCard.style.background = 'linear-gradient(135deg, rgba(218,165,32,0.12), rgba(0,0,0,0.4))';
      dogCard.innerHTML = `
        <img src="assets/images/dog.png?v=2.2" class="npc-avatar pixel-art" alt="">
        <div class="npc-info">
          <div class="npc-header-row">
            <span class="npc-name">🐕 Буран (Верный пёс)</span>
            <span class="npc-role" style="color:var(--accent-gold);">Боевой спутник</span>
          </div>
          <p class="npc-desc">Белоснежная таёжная лайка. Охраняет лагерь, даёт +25% к урону в боях и вынюхивает дичь.</p>
        </div>
      `;
      dogCard.onclick = interactWithDog;
      list.appendChild(dogCard);
    }
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
    } else if (npcId === 'spiridon') {
      talkSpiridon();
    } else if (npcId === 'sasha') {
      talkSasha();
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

    
    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ БАТИ ---
    // «Чистый глоток» (вода в резерв штаба)
    if (!state.sideQuests?.sq_water_batya?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '💧 «Батя, нужно пополнить штабной резерв воды? Я помогу»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_water_batya = { status: 'active' };
          toast('📜 Взято поручение: «Чистый глоток» (Вскипятить и сдать 3 фляги воды Бате)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkBatya();
        }
      });
    } else if (state.sideQuests?.sq_water_batya?.status === 'active') {
      const hasWater = getItemCount('clean_water') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ШТАБНОЙ РЕЗЕРВ]:</b> <i>«Ты вскипятил три фляги чистой воды? Если мутанты отсекут нас от реки, лагерь без воды не протянет.»</i></p>`;
      if (hasWater) {
        actions.push({
          text: '💧 «Так точно, Батя! Вот 3 фляги чистой кипячёной воды»',
          action: () => {
            removeItem('clean_water', 3);
            state.sideQuests.sq_water_batya.status = 'completed';
            addItem('ammo', 4);
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Чистый глоток» (+15 репутации, +4 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkBatya();
          },
          primary: true
        });
      }
    }

    // «Ночной дозор»
    if (!state.sideQuests?.sq_watch_batya?.status && state.mainQuestStep >= 3) {
      actions.push({
        text: '🏮 «Батя, могу заступить в ночной караул на смотровой вышке»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_watch_batya = { status: 'active' };
          toast('📜 Взято поручение: «Ночной дозор» (Заступить на вышку в фазу Ночи с факелом)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkBatya();
        }
      });
    } else if (state.sideQuests?.sq_watch_batya?.status === 'active') {
      const isNight = state.timeOfDay === 3;
      const hasTorch = getItemCount('torch') > 0 || getItemCount('electric_torch') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[НОЧНОЙ ДОЗОР]:</b> <i>«В темноте твари жмутся к частоколу. Бери факел и заступай на вышку у ворот, покуда луна стоит.»</i></p>`;
      if (isNight && hasTorch) {
        actions.push({
          text: '🏮 «Отстоять ночную смену на смотровой вышке до рассвета»',
          action: () => {
            state.sideQuests.sq_watch_batya.status = 'completed';
            passTime(1);
            addItem('ammo', 5);
            addItem('canned_food', 1);
            state.reputation += 20;
            toast('⭐ Ночной караул сдан! Батя пожал вам руку (+20 репутации, 5 патронов, тушенка)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkBatya();
          },
          primary: true
        });
      }
    }

    // Жетоны разведгруппы «Север» (сержанта Гурова)
    if (state.questFlags.brdm_searched && !state.questFlags.brdm_reported) {
      actions.push({
        text: '🎖️ «Батя... я нашёл в трясине БРДМ-2. Вот жетоны сержанта Гурова...»',
        action: () => {
          state.questFlags.brdm_reported = true;
          addItem('ammo', 8);
          state.reputation += 40;
          toast('⭐ Жетоны сержанта Гурова переданы Бате (+40 репутации, командирский бинокль, 8 патронов)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkBatya();
        },
        primary: true
      });
    }

    // Финал «Эхо чёрного каравана»
    if (state.questFlags.caravan_cache_found && !state.questFlags.caravan_completed) {
      actions.push({
        text: '🏴‍☠️ «Батя, схрон банды «Хлыща» уничтожен! Вот украденные медикаменты»',
        action: () => {
          state.questFlags.caravan_completed = true;
          addItem('ammo', 15);
          state.reputation += 50;
          toast('🏆 Дело «Чёрного каравана» закрыто! Справедливость свершилась (+50 репутации, 15 патронов)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkBatya();
        },
        primary: true
      });
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

    
    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ АННЫ ---
    // «Дрова для лазарета»
    if (!state.sideQuests?.sq_wood_anna?.status && state.mainQuestStep >= 1) {
      actions.push({
        text: '🪵 «Анна Павловна, не холодно в лазарете? Могу натаскать березовых дров»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_wood_anna = { status: 'active' };
          toast('📜 Взято поручение: «Дрова для лазарета» (Собрать 4 охапки дров в лесу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkAnna();
        }
      });
    } else if (state.sideQuests?.sq_wood_anna?.status === 'active') {
      const hasWood = getItemCount('firewood') >= 4;
      body += `<p style="color:var(--accent-gold);"><b>[ДРОВА ДЛЯ РАНЕНЫХ]:</b> <i>«Печка почти остыла, соколик. Нашел в лесу четыре охапки сушняка?»</i></p>`;
      if (hasWood) {
        actions.push({
          text: '🪵 «Вот 4 охапки сухих берёзовых дров, Анна Павловна»',
          action: () => {
            removeItem('firewood', 4);
            state.sideQuests.sq_wood_anna.status = 'completed';
            addItem('bandage', 2);
            state.reputation += 10;
            toast('⭐ Поручение выполнено: «Дрова для лазарета» (+10 репутации, +2 бинта)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkAnna();
          },
          primary: true
        });
      }
    }

    // «Таёжные витамины» (брусника)
    if (!state.sideQuests?.sq_berries_anna?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '🫐 «Анна Павловна, нужны лесные ягоды для противоцинготного взвара?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_berries_anna = { status: 'active' };
          toast('📜 Взято поручение: «Таёжные витамины» (Собрать 3 порции брусники в лесу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkAnna();
        }
      });
    } else if (state.sideQuests?.sq_berries_anna?.status === 'active') {
      const hasBerries = getItemCount('berries') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ПРОТИВОЦИНГОТНЫЙ СБОР]:</b> <i>«У ребят на карауле силы тают. Набрал спелой брусники в распадках?»</i></p>`;
      if (hasBerries) {
        actions.push({
          text: '🫐 «Принёс 3 порции спелой лесной брусники из сосняка»',
          action: () => {
            removeItem('berries', 3);
            state.sideQuests.sq_berries_anna.status = 'completed';
            addItem('antirad', 1);
            state.reputation += 10;
            toast('⭐ Поручение выполнено: «Таёжные витамины» (+10 репутации, +1 цистамин)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkAnna();
          },
          primary: true
        });
      }
    }

    // «Полевая перевязка»
    if (!state.sideQuests?.sq_medkit_anna?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '🩹 «Анна Павловна, помочь с подготовкой перевязочных пакетов?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_medkit_anna = { status: 'active' };
          toast('📜 Взято поручение: «Полевая перевязка» (Принести 2 бинта и 1 пучок трав)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkAnna();
        }
      });
    } else if (state.sideQuests?.sq_medkit_anna?.status === 'active') {
      const hasKits = getItemCount('bandage') >= 2 && getItemCount('herbs') >= 1;
      body += `<p style="color:var(--accent-gold);"><b>[ПЕРЕВЯЗОЧНЫЙ ЗАПАС]:</b> <i>«Бойцы из дозоров все исполосованные ветками возвращаются. Собрал два бинта и чабрец?»</i></p>`;
      if (hasKits) {
        actions.push({
          text: '🩹 «Вот 2 стерильных бинта и пучок душистого чабреца, Анна Павловна»',
          action: () => {
            removeItem('bandage', 2);
            removeItem('herbs', 1);
            state.sideQuests.sq_medkit_anna.status = 'completed';
            state.hp = 100;
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Полевая перевязка» (+15 репутации, HP полностью восстановлено)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkAnna();
          },
          primary: true
        });
      }
    }

    // «Светящийся реликтовый сфагнум»
    if (getItemCount('glowing_moss') > 0 && !state.questFlags.glowing_moss_reported) {
      actions.push({
        text: '✨ «Анна Павловна, я нашёл на болотах светящийся сфагнум!»',
        action: () => {
          state.questFlags.glowing_moss_reported = true;
          removeItem('glowing_moss', 1);
          addItem('stabilizer_nectar', 1);
          state.reputation += 30;
          toast('⭐ Анна сварила экстракт «Живая вода» (+30 репутации, редкий биостабилизатор)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAnna();
        },
        primary: true
      });
    }

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

    
    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ ПРОХОРА ---
    // «Уголь для горна»
    if (!state.sideQuests?.sq_coal_prokhor?.status && state.mainQuestStep >= 3) {
      actions.push({
        text: '🔨 «Кузьмич, подсобить металлом или углем для горна?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_coal_prokhor = { status: 'active' };
          toast('📜 Взято поручение: «Уголь для горна» (Принести 2 лома Прохору)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkProkhor();
        }
      });
    } else if (state.sideQuests?.sq_coal_prokhor?.status === 'active') {
      const hasScrap = getItemCount('scrap') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[УГОЛЬ И МЕТАЛЛ]:</b> <i>«Притащил пару кусков металлолома для горна? Жар стынет!»</i></p>`;
      if (hasScrap) {
        actions.push({
          text: '🔨 «Кузьмич, держи 2 куска металлолома для наковальни!»',
          action: () => {
            removeItem('scrap', 2);
            state.sideQuests.sq_coal_prokhor.status = 'completed';
            addItem('wire', 3);
            addItem('ammo', 2);
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Уголь для горна» (+15 репутации, 3 проволоки, 2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkProkhor();
          },
          primary: true
        });
      }
    }

    // «Кованые скобы»
    if (!state.sideQuests?.sq_nails_prokhor?.status && state.mainQuestStep >= 3) {
      actions.push({
        text: '⛓️ «Кузьмич, давай кувалду! Нарубим скоб для частокола (-25% энергии)»',
        action: () => {
          if (state.energy < 25) {
            toast('Нужно 25% энергии для тяжелой работы у наковальни!');
            return;
          }
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_nails_prokhor = { status: 'completed' };
          state.energy -= 25;
          addItem('trap', 1);
          state.reputation += 15;
          toast('⭐ Скобы выкованы! Прохор вручил новенький стальной капкан (+15 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkProkhor();
        }
      });
    }

    // Сейф инженера Кузьмина
    if (state.questFlags.safe_cracked && !state.questFlags.safe_reported) {
      actions.push({
        text: '📐 «Кузьмич, в сейфе на станции были чертежи инженера Кузьмина!»',
        action: () => {
          state.questFlags.safe_reported = true;
          state.reputation += 35;
          toast('⭐ Прохор модернизировал ваш рюкзак по чертежам Кузьмина (+35 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkProkhor();
        },
        primary: true
      });
    }

    // Геологоразведка «Енисей-3»: минерал
    if (state.questFlags.geo2_done && !state.hasGeoCompass) {
      actions.push({
        text: '🧭 «Прохор, я достал аномальный минерал из скважины №7!»',
        action: () => {
          state.hasGeoCompass = true;
          addItem('geo_compass', 1);
          state.reputation += 40;
          toast('🏆 Прохор собрал Компас «Енисей» (-5 энергии на все вылазки, +40 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkProkhor();
        },
        primary: true
      });
    }

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

    
    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ ЕГОРА ---
    // «Копчёная щука»
    if (!state.sideQuests?.sq_fish_egor?.status && state.mainQuestStep >= 3) {
      actions.push({
        text: '🎣 «Егор, помочь заготовить рыбу для лагерной коптильни?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_fish_egor = { status: 'active' };
          toast('📜 Взято поручение: «Копчёная щука» (Поймать 3 рыбы и принести 2 дров)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkEgor();
        }
      });
    } else if (state.sideQuests?.sq_fish_egor?.status === 'active') {
      const hasFishMeal = getItemCount('raw_fish') >= 3 && getItemCount('firewood') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[ЛАГЕРНАЯ КОПТИЛЬНЯ]:</b> <i>«Быстрянка сегодня щедрая. Наловил три щуки да пару сухих поленьев принёс?»</i></p>`;
      if (hasFishMeal) {
        actions.push({
          text: '🎣 «Вот 3 свежих рыбы и сухие ольховые дрова для коптильни»',
          action: () => {
            removeItem('raw_fish', 3);
            removeItem('firewood', 2);
            state.sideQuests.sq_fish_egor.status = 'completed';
            addItem('fish_soup', 2);
            addItem('ammo', 2);
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Копчёная щука» (+15 репутации, 2 ухи, 2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkEgor();
          },
          primary: true
        });
      }
    }

    // «Силки на глухаря»
    if (!state.sideQuests?.sq_snare_egor?.status && state.mainQuestStep >= 4) {
      actions.push({
        text: '🦃 «Егор, покажи, как ставить силки на глухаря в подлеске?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_snare_egor = { status: 'active' };
          toast('📜 Взято поручение: «Силки на глухаря» (Добыть мясо птицы)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkEgor();
        }
      });
    } else if (state.sideQuests?.sq_snare_egor?.status === 'active') {
      const hasMeat = getItemCount('raw_meat') >= 1;
      body += `<p style="color:var(--accent-gold);"><b>[ОХОТА НА ГЛУХАРЯ]:</b> <i>«Попалась боровая птица в проволочную петлю?»</i></p>`;
      if (hasMeat) {
        actions.push({
          text: '🦃 «Добыл дичь в силок, как ты учил! Вот свежее мясо»',
          action: () => {
            removeItem('raw_meat', 1);
            state.sideQuests.sq_snare_egor.status = 'completed';
            addItem('cooked_meat', 2);
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Силки на глухаря» (+15 репутации, 2 вяленых мяса)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkEgor();
          },
          primary: true
        });
      }
    }

    // «Расчистка мостков»
    if (!state.sideQuests?.sq_pier_egor?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '🪵 «Помогу багром и топором отжать топляк от мостков (-15% энергии)»',
        action: () => {
          if (state.energy < 15) {
            toast('Слишком устали для тяжелой работы у реки!');
            return;
          }
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_pier_egor = { status: 'completed' };
          state.energy -= 15;
          addItem('worms', 6);
          state.reputation += 15;
          toast('⭐ Мостки у причала расчищены! Егор отсыпал отборных червей (+15 репутации, 6 червей)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkEgor();
        }
      });
    }

    // Буран: сколотить конуру
    if (state.questFlags.pup_rescued && !state.hasDog) {
      const canBuild = getItemCount('firewood') >= 3 && getItemCount('wire') >= 1 && getItemCount('leather') >= 1 && (getItemCount('cooked_meat') > 0 || getItemCount('cooked_fish') > 0);
      body += `<p style="color:var(--accent-gold);"><b>[ЩЕНОК БУРАН]:</b> Егор гладит щенка за ухом: <i>«Лайка чистейших кровей! Сколоти ему тёплую конуру у костра (3 дров, 1 проволока, 1 кожа) и накорми жареным мясом — лучшего друга в тайге не найдёшь!»</i></p>`;
      if (canBuild) {
        actions.push({
          text: '🐕 Сколотить тёплую конуру для Бурана (3 дров, 1 проволока, 1 кожа, мясо)',
          action: () => {
            removeItem('firewood', 3);
            removeItem('wire', 1);
            removeItem('leather', 1);
            if (getItemCount('cooked_meat') > 0) removeItem('cooked_meat', 1);
            else removeItem('cooked_fish', 1);
            state.hasDog = true;
            state.reputation += 35;
            toast('🐶 БУРАН ВЫРОС И СТАЛ ВАШИМ ВЕРНЫМ СПУТНИКОМ! (+25% урона в боях, +35 репутации)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderNPCs();
            renderQuests();
            interactWithDog();
          },
          primary: true
        });
      }
    }

    checkStarterQuestProgress();
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // --- ДЕЙСТВИЯ В ЛАГЕРЕ ---
  
  // --- ПИТОМЕЦ БУРАН (ВЕРНАЯ ЛАЙКА) ---
  function interactWithDog() {
    sfx.init();
    sfx.playSuccess();
    let body = `<p>Буран радостно взвизгивает, заметив вас! Пёс упирается передними лапами вам в колени, энергично виляет пушистым хвостом и тычется мокрым холодным носом в ладонь.</p>`;
    body += `<p><i>«Густой подшёрсток лайки пахнет таёжным снегом, сосновой хвоей и костровым дымом. В умных янтарных глазах читается абсолютная, беззаветная преданность. С таким другом никакие волки и шатуны не страшны!»</i></p>`;
    body += `<div style="background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px; margin:8px 0; border:1px solid rgba(255,255,255,0.12);">
      <b style="color:var(--accent-gold); font-size:12px;">🐾 Бонусы верного компаньона:</b><br>
      • <b>+25% к урону</b> в любых таёжных схватках (волчьи стаи, вепрь, медведь-шатун)<br>
      • <b>Таёжное чутьё:</b> 35% шанс каждое утро получить ценную дичь или патроны, найденные Бураном
    </div>`;

    const actions = [
      {
        text: '🦴 Потрепать Бурана за ухом (+10 энергии)',
        action: () => {
          state.energy = Math.min(state.maxEnergy || 100, state.energy + 10);
          toast('🐶 Буран довольно жмурится и виляет хвостом (+10% энергии).');
          sfx.playClick();
          updateHUD();
          closeModal();
        },
        primary: true
      }
    ];

    if (getItemCount('cooked_meat') > 0 || getItemCount('cooked_fish') > 0) {
      actions.push({
        text: '🥩 Угостить Бурана куском жареной рыбы или мяса',
        action: () => {
          if (getItemCount('cooked_meat') > 0) removeItem('cooked_meat', 1);
          else removeItem('cooked_fish', 1);
          state.reputation += 5;
          toast('🐕 Буран с урчанием проглатывает угощение и благодарно лижет вам пальцы (+5 репутации)!');
          sfx.playSuccess();
          updateHUD();
          interactWithDog();
        }
      });
    }

    openModal('Буран (Западносибирская лайка)', 'Верный четвероногий друг', 'assets/images/dog.png?v=2.2', body, actions);
  }

  // --- ДЕД СПИРИДОН (СТАРОВЕР-ЗНАХАРЬ) ---
  function talkSpiridon() {
    const npc = NPCS.spiridon;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_spiridon = true;

    let body = `<p>Дед Спиридон сидит на лавке у бревенчатой стены своей заимки, чистит деревянной ложкой сушеные травы и неспешно подкладывает лучину в чугунную плошку. В избе пахнет сухим чабрецом, воском и ладаном.</p>`;
    body += `<p><i>«Мир избе твоей, чадо. Слышу по дыханию — тяжёл твой путь был сквозь трясину. В тайге суета — первый враг. Сядь, отдышись у огня. Земля наша хоть и покалечена железной бедой, а силу живую в травах хранит. Коли с уважением к лесу придёшь — всё отдаст.»</i></p>`;

    const actions = [];

    // Квест 2 Спиридона: Ведьмин гриб
    if (state.sideQuests?.spiridon_mushrooms?.status === 'active') {
      const hasMushrooms = getItemCount('amanita') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ЗНАХАРСКИЙ СБОР]:</b> <i>«Набрал мухоморов с красной шляпкой в белую крапинку? Они в чаще под старыми березами прячутся.»</i></p>`;
      if (hasMushrooms) {
        actions.push({
          text: '🍄 «Вот три ядрёных мухомора, дедушка (Сдать Спиридону)»',
          action: () => {
            removeItem('amanita', 3);
            state.sideQuests.spiridon_mushrooms.status = 'completed';
            addItem('spiridon_vodka', 2);
            state.reputation += 30;
            toast('⭐ Дед Спиридон сварил первую партию «Спиридоновки» (+2 настойки, +30 репутации)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkSpiridon();
          },
          primary: true
        });
      }
    } else if (!state.sideQuests?.spiridon_mushrooms?.status) {
      actions.push({
        text: '🍄 «Дед Спиридон, научи меня варить таёжную настойку от усталости!»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.spiridon_mushrooms = { status: 'active' };
          toast('📜 Взято задание: «Ведьмин гриб» (Собрать 3 мухомора в лесу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkSpiridon();
        },
        primary: true
      });
    }

    // Рецепты алхимии Спиридона
    actions.push(
      {
        text: '🧪 Сварить «Спиридоновку» (1 мухомор, 1 спирт, 1 чистая вода)',
        action: () => {
          if (getItemCount('amanita') >= 1 && getItemCount('alcohol') >= 1 && getItemCount('clean_water') >= 1) {
            removeItem('amanita', 1);
            removeItem('alcohol', 1);
            removeItem('clean_water', 1);
            addItem('spiridon_vodka', 1);
            toast('🧪 Сварен флакон крепкой «Спиридоновки» (+40 энергии при приеме)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSpiridon();
          } else {
            toast('Нужно: 1 мухомор, 1 спирт и 1 чистая вода.');
          }
        }
      },
      {
        text: '🍯 Сварить «Дегтярный бальзам» (1 сфагнум, 1 дрова, 1 травы)',
        action: () => {
          if (getItemCount('swamp_moss') >= 1 && getItemCount('firewood') >= 1 && getItemCount('herbs') >= 1) {
            removeItem('swamp_moss', 1);
            removeItem('firewood', 1);
            removeItem('herbs', 1);
            addItem('tar_salve', 1);
            toast('🍯 Приготовлен «Дегтярный бальзам» (+40 HP, защита от урона на 3 вылазки)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSpiridon();
          } else {
            toast('Нужно: 1 сфагнум, 1 дрова и 1 травы.');
          }
        }
      },
      {
        text: '👁️ Сварить эликсир «Око рыси» (2 брусники, 1 травы, 1 чистая вода)',
        action: () => {
          if (getItemCount('berries') >= 2 && getItemCount('herbs') >= 1 && getItemCount('clean_water') >= 1) {
            removeItem('berries', 2);
            removeItem('herbs', 1);
            removeItem('clean_water', 1);
            addItem('lynx_eye', 1);
            toast('👁️ Приготовлен эликсир «Око рыси» (ночные вылазки без штрафов к энергии)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSpiridon();
          } else {
            toast('Нужно: 2 брусники, 1 травы и 1 чистая вода.');
          }
        }
      },
      {
        text: '🌿 Купить спирт за 2 патрона',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            addItem('alcohol', 1);
            toast('Куплен флакон чистого медицинского спирта.');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSpiridon();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      }
    );

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // --- САША «СВЯЗИСТ» (РАДИОТЕХНИК НИИ) ---
  function talkSasha() {
    const npc = NPCS.sasha;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_sasha = true;

    let body = `<p>Александр сидит за верстаком в радиорубке, поправив перемотанные синей изолентой очки. Из динамика лампового приёмника Р-326 доносится тихое атмосферное шипение и далёкие щелчки морзянки.</p>`;
    body += `<p><i>«Привет! Знаешь, после того ада в реакторном зале я думал, что радиоэфир навсегда мёртв. Но нет! Если правильно согласовать антенну и отфильтровать помехи от ионизированных облаков — в эфире можно поймать радиомаяки старых аварийных сбросов. Раз в сутки я могу проводить пеленгацию для тебя!»</i></p>`;

    const actions = [];

    // Ежедневное сканирование радиоэфира
    if (!state.sashaRadioUsedToday) {
      actions.push({
        text: '📡 «Саша, включи радиосканер: найди аварийный контейнер на сегодня»',
        action: () => {
          state.sashaRadioUsedToday = true;
          const locs = ['river', 'forest', 'swamp', 'pump_station'];
          state.activeStashLocation = locs[Math.floor(Math.random() * locs.length)];
          const locNames = { river: 'Реке Быстрянке', forest: 'Ближнем лесу', swamp: 'Гнилой гати', pump_station: 'Насосной станции' };
          toast(`📡 СИГНАЛ ЗАПЕЛЕНГОВАН! Саша поймал радиомаяк аварийного контейнера на ${locNames[state.activeStashLocation]}!`);
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkSasha();
        },
        primary: true
      });
    } else {
      const locNames = { river: 'Реке Быстрянке', forest: 'Ближнем лесу', swamp: 'Гнилой гати', pump_station: 'Насосной станции' };
      body += `<p style="color:var(--accent-green);">📡 <b>Пеленг активен:</b> Радиомаяк сброса ждет вас на <u>${locNames[state.activeStashLocation] || 'локации'}</u>! Заберите контейнер во вкладке «Вылазка».</p>`;
    }

    // Сборка Дозиметра ДП-5
    if (getItemCount('geiger_counter') === 0 && !state.hasGeiger) {
      actions.push({
        text: '☢️ Собрать армейский Счётчик Гейгера ДП-5 (2 лома, 2 проволоки, 1 батарейка)',
        action: () => {
          if (getItemCount('scrap') >= 2 && getItemCount('wire') >= 2 && getItemCount('batteryaaa') >= 1) {
            removeItem('scrap', 2);
            removeItem('wire', 2);
            removeItem('batteryaaa', 1);
            addItem('geiger_counter', 1);
            state.hasGeiger = true;
            toast('☢️ Счётчик Гейгера ДП-5 собран! Пассивно снижает накопление радиации во всех вылазках на 30%!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSasha();
          } else {
            toast('Нужно: 2 металлолома, 2 проволоки и 1 батарейка.');
          }
        }
      });
    }

    // Сборка Электрофонаря
    if (getItemCount('electric_torch') === 0 && !state.hasElectricTorch) {
      actions.push({
        text: '🔦 Собрать полевой электрофонарь (1 проволока, 1 батарейка, 1 лом)',
        action: () => {
          if (getItemCount('wire') >= 1 && getItemCount('batteryaaa') >= 1 && getItemCount('scrap') >= 1) {
            removeItem('wire', 1);
            removeItem('batteryaaa', 1);
            removeItem('scrap', 1);
            addItem('electric_torch', 1);
            state.hasElectricTorch = true;
            toast('🔦 Полевой электрофонарь готов! Вечный источник света для ночных вылазок.');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSasha();
          } else {
            toast('Нужно: 1 проволока, 1 батарейка и 1 металлолом.');
          }
        }
      });
    }

    // Покупка батареек
    actions.push({
      text: '🔋 Купить батарейки 1.5В (за 2 патрона)',
      action: () => {
        if (getItemCount('ammo') >= 2) {
          removeItem('ammo', 2);
          addItem('batteryaaa', 1);
          toast('Куплен комплект сухих батареек стандарта ААА.');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkSasha();
        } else {
          toast('Недостаточно патронов.');
        }
      }
    });

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // --- ЛОКАЦИОННЫЕ И ДОПОЛНИТЕЛЬНЫЕ АКТИВНОСТИ ---
  function doDiveContainer(loc) {
    if (state.energy < 20) {
      toast('Недостаточно сил для глубокого погружения! Нужно 20% энергии.');
      return;
    }
    sfx.init();
    sfx.playSplash();
    state.energy -= 20;
    state.rad += 5;
    passTime(1);
    state.questFlags.river_container_looted = true;
    addItem('canned_food', 3);
    addItem('ammo', 10);
    state.reputation += 25;
    toast('📦 ТЕРМОБОКС ПОДНЯТ СО ДНА! Найдено 3 банки армейской тушенки и 10 патронов (+25 репутации)!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
  }

  function doFightWolves(loc) {
    if (getItemCount('spear') < 1 && getItemCount('toz') < 1) {
      toast('Лезть в волчье логово без оружия — самоубийство! Вооружитесь копьём или ружьём.');
      return;
    }
    if (state.hp < 35) {
      toast('Вы слишком ранены для боя со стаей!');
      return;
    }
    sfx.init();
    sfx.playDanger();
    const damage = state.hasDog ? 10 : 20;
    state.hp = Math.max(10, state.hp - damage);
    state.energy = Math.max(0, state.energy - 25);
    state.questFlags.wolves_defeated = true;
    passTime(1.5);
    addItem('leather', 2);
    addItem('wolf_fang', 1);
    state.reputation += 30;
    toast(`🐺 ВОЛЧЬЕ ЛОГОВО РАЗГРОМЛЕНО! Вожак повержен! Получен амулет «Волчий клык» (+5 к урону), 2 шкуры (${damage} урона)!`);
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
  }

  function doRescuePup(loc) {
    sfx.init();
    sfx.playClick();
    if (getItemCount('bandage') < 1) {
      toast('Щенок тяжело ранен зубьями капкана! Нужен хотя бы 1 стерильный бинт, чтобы перевязать лапку.');
      return;
    }
    removeItem('bandage', 1);
    state.questFlags.pup_rescued = true;
    passTime(1);
    state.reputation += 20;
    toast('🐾 ЩЕНОК СПАСЕН! Вы аккуратно разжали дуги ржавого капкана, промыли рану и перевязали щенка. Отнесите его Егору в лагерь!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
  }

  function doVisitSpiridon(loc) {
    sfx.init();
    sfx.playClick();
    state.questFlags.met_spiridon = true;
    toast('🛖 Вы пробрались по замшелым кочкам к затерянной Заимке деда Спиридона!');
    closeModal();
    talkSpiridon();
  }

  function doSearchBrdm(loc) {
    if (state.energy < 20) {
      toast('Нужно минимум 20% энергии для исследования затопленного броневика!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= 20;
    state.rad += 15;
    passTime(1.5);
    state.questFlags.brdm_searched = true;
    addItem('ammo', 8);
    state.reputation += 35;
    toast('🚜 БРДМ-2 ОБСЛЕДОВАН! Найдены жетоны сержанта Гурова, патроны и офицерский планшет! Отнесите Бате.');
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
  }

  function doGatherGlowingMoss(loc) {
    sfx.init();
    sfx.playClick();
    state.energy -= 15;
    state.rad += 20;
    passTime(1);
    state.questFlags.glowing_moss_found = true;
    addItem('glowing_moss', 1);
    addItem('stabilizer_nectar', 1);
    state.reputation += 30;
    toast('✨ СВЕТЯЩИЙСЯ СФАГНУМ СОБРАН! Чистый экстракт спасет от любых ран и радиации! Отнесите Анне.');
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
  }

  function doClearDrainValve(loc) {
    if (state.energy < 25) {
      toast('Нужно 25% энергии, чтобы провернуть многопудовый чугунный вентиль!');
      return;
    }
    if (getItemCount('scrap') < 1) {
      toast('Нужен кусок металлолома или монтировка в качестве рычага.');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= 25;
    state.pumpWaterActive = true;
    state.reputation += 35;
    passTime(1);
    toast('🚰 ДОННЫЙ ВЕНТИЛЬ ПОВЕРНУТ! Шлам сброшен! Теперь каждое утро лагерная колонка выдает +1 флягу чистой воды!');
    updateHUD();
    saveState();
    closeModal();
  }

  function doCrackEngineerSafe(loc) {
    if (state.energy < 15) {
      toast('Недостаточно сил.');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= 15;
    state.questFlags.safe_cracked = true;
    state.maxWeight += 2.5;
    addItem('ammo', 12);
    addItem('wire', 2);
    state.reputation += 35;
    passTime(1);
    toast('🔐 СЕЙФ ВЗЛОМАН! Найдены чертежи разгрузки Кузьмина (+2.5 кг к вместимости), 12 патронов и проволока!');
    updateHUD();
    saveState();
    closeModal();
  }

  function doSearchStove(loc) {
    if (state.energy < 15) {
      toast('Недостаточно сил для разбора кирпичной кладки.');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= 15;
    state.questFlags.stove_searched = true;
    state.maxWeight += 2.5;
    addItem('ammo', 6);
    state.reputation += 30;
    passTime(1);
    toast('🏚️ ТАЙНИК В ПЕЧИ ОБНАРУЖЕН! Найден кожаный патронташ лесничего (+2.5 кг к весу) и 6 патронов ТОЗ!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
  }

  function doRescueSasha(loc) {
    sfx.init();
    sfx.playClick();
    if (getItemCount('bandage') < 2 || getItemCount('clean_water') < 1) {
      toast('Саша истекает кровью в расщелине! Нужно: 2 стерильных бинта и 1 фляга чистой воды.');
      return;
    }
    removeItem('bandage', 2);
    removeItem('clean_water', 1);
    state.questFlags.met_sasha = true;
    state.reputation += 40;
    passTime(2);
    toast('🆘 САША СПАСЕН! Вы перевязали раненого радиста и помогли ему дойти до лагеря! Теперь Саша наладит связь в «Заре»!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
    talkSasha();
  }

  function doExtractLogger(loc) {
    if (state.energy < 30) {
      toast('Подъем на шпиль мачты требует 30% энергии!');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= 30;
    state.rad += 20;
    state.questFlags.logger_extracted = true;
    addItem('scrap', 3);
    addItem('wire', 2);
    state.reputation += 50;
    passTime(2);
    toast('📊 САМОПИСЕЦ ИЗВЛЕЧЕН! Архивные данные аварии и ценные радиодетали сняты со шпиля вышки (+50 репутации)!');
    updateHUD();
    saveState();
    closeModal();
  }

  function doHuntBoar(loc) {
    if (getItemCount('toz') < 1 || getItemCount('ammo') < 2) {
      toast('Идти на закостеневшего вепря без ружья и патронов — гибель! Нужно: ТОЗ-34 и 2 патрона.');
      return;
    }
    if (state.hp < 40) {
      toast('Вы слишком ранены для охоты на вепря!');
      return;
    }
    sfx.init();
    sfx.playDanger();
    removeItem('ammo', 2);
    const damage = state.hasDog ? 10 : 20;
    state.hp = Math.max(15, state.hp - damage);
    state.energy = Math.max(0, state.energy - 30);
    state.questFlags.boar_defeated = true;
    addItem('raw_meat', 4);
    addItem('leather', 2);
    state.reputation += 45;
    passTime(2);
    toast(`🐗 ВЕПРЬ-СЕКАЧ ПОВЕРЖЕН! Двустволка свалила гиганта (+4 мяса, +2 толстые шкуры, получено ${damage} урона)!`);
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
  }

  function doCrackBio4(loc) {
    if (getItemCount('respirator') < 1 && !state.questFlags.respirator_crafted) {
      toast('В отсеке «Био-4» ядовитый консервант! Наденьте респиратор Р-2 перед взломом.');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy = Math.max(0, state.energy - 20);
    state.rad += 15;
    state.questFlags.bio4_cleared = true;
    addItem('stimulator_m', 1);
    state.reputation += 60;
    passTime(2);
    toast('🧬 СПЕЦХРАН «БИО-4» ВСКРЫТ! Извлечен армейский биостимулятор «Стимулятор-М» (+25 постоянной максимальной энергии)!');
    updateHUD();
    saveState();
    closeModal();
  }

  function doSearchTriangulator(loc) {
    sfx.init();
    sfx.playClick();
    state.energy -= 10;
    state.questFlags.geo1_done = true;
    state.reputation += 15;
    toast('📍 ТРИАНГУЛЯТОР ОБСЛЕДОВАН! В металлическом тубусе найдена карта геологоразведки «Енисей-3» с координатами скважины №7 на Быстрянке!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
  }

  function doSearchBorehole(loc) {
    if (state.energy < 20) {
      toast('Откачка ила из шурфа требует 20% энергии!');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= 20;
    state.questFlags.geo2_done = true;
    state.reputation += 25;
    toast('⛏️ СКВАЖИНА №7 РАСЧИЩЕНА! Со дна шурфа поднят запечатанный геологический керн с черным аномальным минералом! Покажите Прохору.');
    updateHUD();
    saveState();
    closeModal();
  }

  function doSearchCaravanFord(loc) {
    sfx.init();
    sfx.playClick();
    state.energy -= 10;
    state.questFlags.caravan1_done = true;
    state.reputation += 20;
    toast('👣 СЛЕДЫ БАНДЫ «ХЛЫЩА» ОБНАРУЖЕНЫ! Найдены гильзы и нацарапанная на камне стрелка в сторону штольни на Скалистом утёсе!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
  }

  function doSearchCaravanMine(loc) {
    if (getItemCount('knife') < 1 && getItemCount('wire') < 1) {
      toast('Вход в штольню заминирован растяжкой! Нужен охотничий нож, чтобы аккуратно перерезать леску.');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= 20;
    state.questFlags.caravan2_done = true;
    state.questFlags.caravan_cache_found = true;
    addItem('toz_scope', 1);
    addItem('ammo', 25);
    state.hasTozScope = true;
    state.reputation += 50;
    toast('🏴‍☠️ СХРОН МАРОДЕРОВ ВЗЯТ! Растяжка обезврежена! Найден коллиматорный прицел ТОЗ (+30% крит) и 25 патронов! Доложите Бате.');
    updateHUD();
    saveState();
    closeModal();
  }

  function doCollectRadioStash(loc) {
    sfx.init();
    sfx.playSuccess();
    state.energy = Math.max(0, state.energy - 10);
    state.activeStashLocation = null;
    addItem('canned_food', 2);
    addItem('ammo', 8);
    addItem('batteryaaa', 1);
    state.reputation += 20;
    toast('📦 ПАРАШЮТНЫЙ КОНТЕЙНЕР НАЙДЕН! Забрано: 2 банки тушёнки, 8 патронов и комплект батареек ААА (+20 репутации)!');
    updateHUD();
    saveState();
    closeModal();
  }

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
      } else {
        item.onclick = () => {
          toast(`Локация закрыта! Требуется: ${loc.reqRep ? `репутация ${loc.reqRep}+` : 'продвижение по сюжету'}.`, 'warning');
        };
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

    // Сброшенный на парашюте контейнер (по наводке радиосканера Саши)
    if (state.activeStashLocation === loc.id) {
      actions.unshift({
        text: '📡 Забрать обнаруженный Сашей парашютный контейнер снабжения!',
        action: () => doCollectRadioStash(loc),
        primary: true
      });
    }

    // Действия на реке
    if (loc.id === 'river') {
      if (state.mainQuestStep === 5 && !state.questFlags.water_sample_given && getItemCount('water_sample') === 0) {
        actions.push({
          text: '🧪 Набрать пробу токсичной воды для Анны (Квест 6)',
          action: () => doGatherToxicWater(loc),
          primary: true
        });
      }
      if (!state.questFlags.river_container_looted) {
        actions.push({
          text: '📦 Нырнуть на стремнине у баржи (Армейский термобокс)',
          action: () => doDiveContainer(loc)
        });
      }
      if (state.questFlags.geo1_done && !state.questFlags.geo2_done) {
        actions.push({
          text: '⛏️ Отыскать скважину №7 в пойме Быстрянки (Квест геологов)',
          action: () => doSearchBorehole(loc),
          primary: true
        });
      }
      if (state.reputation >= 50 && !state.questFlags.caravan1_done) {
        actions.push({
          text: '👣 Осмотреть кострище у брода (Стреляные гильзы «Хлыща»)',
          action: () => doSearchCaravanFord(loc)
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
      if (!state.questFlags.wolves_defeated && state.mainQuestStep >= 4) {
        actions.push({
          text: '🐺 Выследить волчье логово в буреломе (Квест вожака)',
          action: () => doFightWolves(loc)
        });
      }
      if (!state.questFlags.pup_rescued) {
        actions.push({
          text: '🐾 Пойти на жалобный скулёж в малиннике (Спасти щенка)',
          action: () => doRescuePup(loc),
          primary: true
        });
      }
      if (!state.questFlags.geo1_done) {
        actions.push({
          text: '📍 Осмотреть геодезический триангулятор на скале (Квест геологов)',
          action: () => doSearchTriangulator(loc)
        });
      }
      actions.push({
        text: '🌲 Заготовить сухие дрова',
        action: () => doGatherWood(loc),
        primary: state.mainQuestStep !== 4
      });
      actions.push({
        text: '🌿 Собрать травы, бруснику и мухоморы',
        action: () => doGatherHerbs(loc)
      });
    }

    // Болота: Гнилая гать
    if (loc.id === 'swamp') {
      actions.push({
        text: '🛖 Пробраться по гати к Заимке старовера (Дед Спиридон)',
        action: () => doVisitSpiridon(loc),
        primary: !state.questFlags.met_spiridon
      });
      if (!state.questFlags.brdm_searched) {
        actions.push({
          text: '🚜 Обследовать затопленный БРДМ разведгруппы «Север»',
          action: () => doSearchBrdm(loc)
        });
      }
      if (state.timeOfDay === 3 && !state.questFlags.glowing_moss_found) {
        actions.push({
          text: '✨ Собрать светящийся сфагнум (Ночное свечение топи)',
          action: () => doGatherGlowingMoss(loc),
          primary: true
        });
      }
      actions.push({
        text: '🌿 Собрать болотный сфагнум (нужен для квестов и мази)',
        action: () => doGatherMoss(loc)
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
        if (state.questFlags.pump_repaired && !state.pumpWaterActive) {
          actions.push({
            text: '🚰 Спуститься в коллектор и открыть донный дренажный клапан',
            action: () => doClearDrainValve(loc),
            primary: true
          });
        }
        if (state.questFlags.pump_repaired && !state.questFlags.safe_cracked) {
          actions.push({
            text: '🔐 Вскрыть несгораемый сейф главного инженера',
            action: () => doCrackEngineerSafe(loc)
          });
        }
        actions.push({
          text: '🔍 Обыскать цех фильтрации (поиск мембраны)',
          action: () => doScavengeStation(loc)
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
      if (!state.questFlags.boar_defeated && getItemCount('toz') > 0) {
        actions.push({
          text: '🐗 Выследить бронированного вепря-секача',
          action: () => doHuntBoar(loc)
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
      if (!state.questFlags.stove_searched) {
        actions.push({
          text: '🏚️ Разобрать кирпичную кладку печи (Тайник лесничего)',
          action: () => doSearchStove(loc)
        });
      }
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
      if (state.mainQuestStep >= 11 && !state.questFlags.met_sasha) {
        actions.push({
          text: '🆘 Осмотреть расщелину под утесом (Стоны о помощи)',
          action: () => doRescueSasha(loc),
          primary: true
        });
      }
      if (state.questFlags.radio_repaired && !state.questFlags.logger_extracted) {
        actions.push({
          text: '📊 Снять блок аварийного самописца со шпиля мачты',
          action: () => doExtractLogger(loc)
        });
      }
      if (state.questFlags.caravan1_done && !state.questFlags.caravan2_done) {
        actions.push({
          text: '⛏️ Отыскать заваленную штольню под Скалистым утёсом',
          action: () => doSearchCaravanMine(loc)
        });
      }

      const isRepaired = !!(state.questFlags && state.questFlags.radio_repaired);
      const scrapCount = getItemCount('scrap');
      const wireCount = getItemCount('wire');
      const hasEnough = scrapCount >= 3 && wireCount >= 2 && state.energy >= loc.energyCost;

      if (!isRepaired) {
        actions.push({
          text: hasEnough 
            ? '📡 Восстановить антенну (3 лома, 2 проволоки)' 
            : '⚠️ Починить антенну (не хватает ресурсов)',
          action: () => doRepairAntenna(loc),
          primary: hasEnough
        });
      } else {
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
        if (state.questFlags.bunker_entered && !state.questFlags.bio4_cleared) {
          actions.push({
            text: '🧬 Взломать спецхран криолаборатории «Био-4» («Стимулятор-М»)',
            action: () => doCrackBio4(loc)
          });
        }
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

  
  // --- ДОПОЛНИТЕЛЬНЫЕ И НЕОСНОВНЫЕ КВЕСТЫ (EXPANSION) ---
  const SIDE_QUESTS = [
    // Лагерные поручения (10)
    { id: 'sq_wood_anna', category: 'camp', title: 'Дрова для лазарета', giver: 'Анна Павловна', desc: 'Собрать 4 охапки сухих дров для обогрева медицинского вагончика.', reward: '2 стерильных бинта, +10 репутации', isDone: (s) => s.sideQuests?.sq_wood_anna?.status === 'completed' },
    { id: 'sq_fish_egor', category: 'camp', title: 'Копчёная щука', giver: 'Егор Лесник', desc: 'Поймать 3 свежих рыбы и заготовить 2 полена для лагерной коптильни.', reward: '2 порции ухи, 2 патрона, +15 репутации', isDone: (s) => s.sideQuests?.sq_fish_egor?.status === 'completed' },
    { id: 'sq_water_batya', category: 'camp', title: 'Чистый глоток', giver: 'Майор Дмитрий (Батя)', desc: 'Вскипятить 3 фляги воды для штабного резерва общины.', reward: '4 патрона, +15 репутации', isDone: (s) => s.sideQuests?.sq_water_batya?.status === 'completed' },
    { id: 'sq_berries_anna', category: 'camp', title: 'Таёжные витамины', giver: 'Анна Павловна', desc: 'Собрать 3 порции брусники для противоцинготного взвара.', reward: '1 цистамин (антирад), +10 репутации', isDone: (s) => s.sideQuests?.sq_berries_anna?.status === 'completed' },
    { id: 'sq_coal_prokhor', category: 'camp', title: 'Уголь для горна', giver: 'Прохор Кузьмич', desc: 'Принести 2 металлолома для кузнечного горна.', reward: '3 мотка сталистой проволоки, 2 патрона, +15 репутации', isDone: (s) => s.sideQuests?.sq_coal_prokhor?.status === 'completed' },
    { id: 'sq_snare_egor', category: 'camp', title: 'Силки на глухаря', giver: 'Егор Лесник', desc: 'Добыть мясо боровой дичи в проволочный силок.', reward: '2 вяленых мяса, +15 репутации', isDone: (s) => s.sideQuests?.sq_snare_egor?.status === 'completed' },
    { id: 'sq_watch_batya', category: 'camp', title: 'Ночной дозор', giver: 'Майор Дмитрий (Батя)', desc: 'Отстоять караульную смену на смотровой вышке в ночную пору с факелом.', reward: '5 патронов, тушенка, +20 репутации', isDone: (s) => s.sideQuests?.sq_watch_batya?.status === 'completed' },
    { id: 'sq_medkit_anna', category: 'camp', title: 'Полевая перевязка', giver: 'Анна Павловна', desc: 'Сдать 2 стерильных бинта и пучок целебных трав.', reward: 'Полное исцеление HP, +15 репутации', isDone: (s) => s.sideQuests?.sq_medkit_anna?.status === 'completed' },
    { id: 'sq_nails_prokhor', category: 'camp', title: 'Кованые скобы', giver: 'Прохор Кузьмич', desc: 'Поработать у наковальни для укрепления ворот лагеря.', reward: 'Стальной капкан, +15 репутации', isDone: (s) => s.sideQuests?.sq_nails_prokhor?.status === 'completed' },
    { id: 'sq_pier_egor', category: 'camp', title: 'Расчистка мостков', giver: 'Егор Лесник', desc: 'Расчистить причал Быстрянки от радиоактивного топляка.', reward: 'Земляные черви ×6, +15 репутации', isDone: (s) => s.sideQuests?.sq_pier_egor?.status === 'completed' },

    // Тайны локаций (10)
    { id: 'lq_river_container', category: 'location', title: 'Утопленный контейнер', giver: 'Река Быстрянка', desc: 'Нырнуть на стремнине у затопленной баржи за армейским термобоксом.', reward: '3 тушенки, 10 патронов, +25 репутации', isDone: (s) => s.questFlags.river_container_looted },
    { id: 'lq_forest_wolves', category: 'location', title: 'Волчье логово в буреломе', giver: 'Ближний лесок', desc: 'Выследить и одолеть вожака стаи хищников под корнями кедра.', reward: 'Волчий клык (+5 к урону), 2 шкуры, +30 репутации', isDone: (s) => s.questFlags.wolves_defeated },
    { id: 'lq_swamp_brdm', category: 'location', title: 'Останки группы «Север»', giver: 'Гнилая гать', desc: 'Обследовать затонувший БРДМ-2 и вернуть жетоны сержанта Гурова.', reward: 'Командирский бинокль, 8 патронов, +40 репутации', isDone: (s) => s.questFlags.brdm_reported },
    { id: 'lq_swamp_moss', category: 'location', title: 'Светящийся сфагнум', giver: 'Гнилая гать', desc: 'Собрать образцы биолюминесцентного мха в ночную пору.', reward: 'Экстракт «Живая вода», +30 репутации', isDone: (s) => s.questFlags.glowing_moss_reported },
    { id: 'lq_pump_drain', category: 'location', title: 'Дренаж машинного зала', giver: 'Насосная станция №4', desc: 'Открыть заклинивший донный клапан для промывки водовода.', reward: '+1 чистая вода каждое утро бесплатно!', isDone: (s) => s.pumpWaterActive },
    { id: 'lq_pump_safe', category: 'location', title: 'Сейф инженера Кузьмина', giver: 'Насосная станция №4', desc: 'Вскрыть несгораемый стальной шкаф начальника станции.', reward: '+2.5 кг к вещмешку, 12 патронов, +35 репутации', isDone: (s) => s.questFlags.safe_reported },
    { id: 'lq_cordon_stove', category: 'location', title: 'Тайник в печи', giver: 'Заброшенный кордон', desc: 'Разобрать кладку дымохода русской печи.', reward: '+2.5 кг к вещмешку, 6 патронов ТОЗ, +30 репутации', isDone: (s) => s.questFlags.stove_searched },
    { id: 'lq_tower_logger', category: 'location', title: 'Самописец аварии', giver: 'Радиовышка', desc: 'Снять блок регистратора параметров радиационного выброса со шпиля.', reward: 'Архив аварии, радиодетали, +50 репутации', isDone: (s) => s.questFlags.logger_extracted },
    { id: 'lq_hunt_boar', category: 'location', title: 'Железный вепрь-секач', giver: 'Охотничьи угодья', desc: 'Одолеть гигантского секача с закостеневшей шкурой.', reward: '4 мяса вепря, 2 толстые шкуры, +45 репутации', isDone: (s) => s.questFlags.boar_defeated },
    { id: 'lq_bunker_bio4', category: 'location', title: 'Спецхран «Био-4»', giver: 'Бункер НИИ «Сфера»', desc: 'Вскрыть криогенный бокс и забрать армейский стимулятор.', reward: '«Стимулятор-М» (+25 постоянной энергии!), +60 репутации', isDone: (s) => s.questFlags.bio4_cleared },

    // Сюжетные цепочки и персонажи
    { id: 'chain_dog', category: 'story', title: 'Друг тайги — Лайка Буран', giver: 'Лес / Егор', desc: 'Спасти раненого щенка из капкана и вырастить боевого компаньона.', reward: 'Верный пёс Буран: +25% урона, утренние подарки', isDone: (s) => s.hasDog },
    { id: 'chain_geo', category: 'story', title: 'Геологоразведка «Енисей-3»', giver: 'Триангулятор / Скважина №7', desc: 'Раскрыть тайну предвоенного бурения и найти аномальный минерал.', reward: 'Компас «Енисей»: -5 энергии на все вылазки', isDone: (s) => s.hasGeoCompass },
    { id: 'chain_caravan', category: 'story', title: 'Эхо чёрного каравана', giver: 'Река / Штольня', desc: 'Выследить схрон мародёров «Хлыща» и вернуть украденное.', reward: 'Прицел ТОЗ (+30% крит), 25 патронов, +50 репутации', isDone: (s) => s.questFlags.caravan_completed },
    { id: 'spiridon_line', category: 'npc', title: 'Таёжное знахарство Спиридона', giver: 'Дед Спиридон (Болота)', desc: 'Освоить древние рецепты настоек староверов.', reward: 'Крафт «Спиридоновки», Дегтярного бальзама и Ока рыси', isDone: (s) => s.sideQuests?.spiridon_mushrooms?.status === 'completed' },
    { id: 'sasha_line', category: 'npc', title: 'Радиопост Саши Связиста', giver: 'Саша Связист (Вышка)', desc: 'Спасти радиста и восстановить приемник Р-326.', reward: 'Ежедневный радиопеленг контейнеров, крафт ДП-5 и фонаря', isDone: (s) => s.questFlags.met_sasha }
  ];

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
        } else if (state.questView === 'side') {
      const completedCount = SIDE_QUESTS.filter(q => q.isDone(state)).length;
      const progressPct = Math.round((completedCount / SIDE_QUESTS.length) * 100);

      const headerDiv = document.createElement('div');
      headerDiv.className = 'quest-campaign-header';
      headerDiv.style.cssText = 'background:var(--bg-card); border:1px solid var(--border-color); border-radius:6px; padding:10px 12px; margin-bottom:12px;';
      headerDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:700; font-size:13px; color:var(--accent-gold);">📜 Дополнительные задания и тайны Зоны</span>
          <span style="font-weight:700; font-size:12px; color:var(--text-main);">${completedCount} / ${SIDE_QUESTS.length} (${progressPct}%)</span>
        </div>
        <div style="background:rgba(0,0,0,0.4); border-radius:4px; height:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
          <div style="background:linear-gradient(90deg, #3498db, var(--accent-green)); height:100%; width:${progressPct}%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:11px; color:var(--text-dim); margin-top:6px;">
          Поручения лагеря, исследования отдалённых локаций, цепочки историй и союзники.
        </div>
      `;
      area.appendChild(headerDiv);

      const categories = [
        { id: 'camp', name: '⛺ Поручения жителей лагеря' },
        { id: 'location', name: '🗺️ Тайны открытых локаций' },
        { id: 'story', name: '📖 Сюжетные цепочки историй' },
        { id: 'npc', name: '🤝 Союзники и новые механики' }
      ];

      categories.forEach(cat => {
        const catQuests = SIDE_QUESTS.filter(q => q.category === cat.id);
        const catCompleted = catQuests.filter(q => q.isDone(state)).length;

        const catTitle = document.createElement('div');
        catTitle.style.cssText = 'font-family:Russo One,sans-serif; font-size:12px; color:var(--accent-gold); margin:12px 0 6px 2px; display:flex; justify-content:space-between;';
        catTitle.innerHTML = `<span>${cat.name}</span> <span style="font-size:11px; color:var(--text-dim);">${catCompleted} / ${catQuests.length}</span>`;
        area.appendChild(catTitle);

        catQuests.forEach(q => {
          const isCompleted = q.isDone(state);
          const card = document.createElement('div');
          card.className = `quest-item-card ${isCompleted ? 'completed' : ''}`;
          card.style.cssText = `border-left: 3px solid ${isCompleted ? 'var(--accent-green)' : 'var(--accent-blue)'}; margin-bottom:8px;`;
          card.innerHTML = `
            <div class="quest-title-row" style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; font-size:13px; color:${isCompleted ? 'var(--accent-green)' : 'var(--text-main)'};">${q.title}</span>
              <span style="font-size:11px; font-weight:700; color:${isCompleted ? 'var(--accent-green)' : 'var(--accent-gold)'};">
                ${isCompleted ? '✓ Выполнено' : '⏳ Доступно'}
              </span>
            </div>
            <div style="font-size:11px; color:var(--accent-blue); margin:2px 0 4px;">Квестодатель: <b>${q.giver}</b></div>
            <p class="quest-desc" style="font-size:12px; margin-bottom:6px;">${q.desc}</p>
            <div style="font-size:11px; color:var(--accent-gold); background:rgba(0,0,0,0.25); padding:4px 8px; border-radius:4px;">
              🎁 Награда: ${q.reward}
            </div>
          `;
          area.appendChild(card);
        });
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
  function toast(message, type = 'auto') {
    const container = document.getElementById('toastLog');
    if (!container) return;
    const toastEl = document.createElement('div');

    const isWarning = type === 'warning' || (type === 'auto' && /недостаточно|слишком|не хватает|заперт|закрыт|требуется|ранен|гибель|яд|опасн|самоубийство|отсутствует|нужен|нужно|⚠️|❌|⛔|🔒/i.test(message));
    const isSuccess = type === 'success' || (type === 'auto' && /выполнен|завершен|получен|наград|добыт|побежд|открыт|запущен|починен|спасен|найден|⭐|🏆|🎉|✓/i.test(message));

    let prefix = '';
    if (isWarning && !message.startsWith('⚠️') && !message.startsWith('❌') && !message.startsWith('🔒') && !message.startsWith('⛔')) {
      prefix = '⚠️ ';
    }

    toastEl.className = `toast-msg ${isWarning ? 'toast-warning' : (isSuccess ? 'toast-success' : '')}`;
    toastEl.textContent = prefix + message;

    if (isWarning) {
      sfx.init();
      sfx.playDanger();
    }

    toastEl.onclick = () => {
      if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    };

    container.appendChild(toastEl);
    setTimeout(() => {
      if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 2800);
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
        parsed.maxEnergy = parsed.maxEnergy || 100;
        parsed.sideQuests = Object.assign({}, INITIAL_STATE.sideQuests, parsed.sideQuests || {});
        if (parsed.hasDog === undefined) parsed.hasDog = false;
        if (parsed.pumpWaterActive === undefined) parsed.pumpWaterActive = false;
        if (parsed.hasGeoCompass === undefined) parsed.hasGeoCompass = false;
        if (parsed.hasGeiger === undefined) parsed.hasGeiger = false;
        if (parsed.hasElectricTorch === undefined) parsed.hasElectricTorch = false;
        if (parsed.hasTozScope === undefined) parsed.hasTozScope = false;
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
