/* ==========================================================================
   ИГРОВОЙ ДВИЖОК: ТЕКСТОВАЯ RPG «ЛАГЕРЬ ЗАРЯ»
   Собрано автоматически из src/ (2026-11-05T19:52:57.589Z)
   Не редактируйте этот файл вручную — вносите изменения в файлы src/
   ========================================================================== */

const Game = (() => {

  // >>> MODULE: data/items.js (79 строк)
  // --- ХРАНИЛИЩЕ БАЗЫ ПРЕДМЕТОВ ---
  const ITEMS = {
    clean_water: { id: 'clean_water', name: 'Чистая вода', type: 'food', icon: 'assets/images/bottled_water.png', weight: 0.5, desc: 'Кипячёная чистая вода в армейской фляге.', thirst: 45, rad: 0 },
    raw_water: { id: 'raw_water', name: 'Речная вода', type: 'food', icon: 'assets/images/polluted_water.png', weight: 0.5, desc: 'Мутная вода из реки Быстрянки. Опасно пить сырой!', thirst: 30, rad: 12 },
    raw_fish: { id: 'raw_fish', name: 'Сырая рыба', type: 'food', icon: 'assets/images/fresh_fish.png?v=3.2', weight: 0.4, desc: 'Свежепойманная речная рыба. Лучше зажарить на костре.', hunger: 15, rad: 8 },
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
    
    // Новые предметы расширения v4.0: Погода, Статусы, Базостроение
    charcoal: { id: 'charcoal', name: 'Берёзовый уголь', type: 'med', icon: 'assets/images/activated_carbon.png', weight: 0.1, desc: 'Пористый древесный уголь из костра. Отличный абсорбент: нейтрализует пищевое отравление (-токсины).' },
    hot_tea: { id: 'hot_tea', name: 'Горячий таёжный чай', type: 'food', icon: 'assets/images/dandelion_tea.png', weight: 0.3, desc: 'Крепкий настой чабреца и брусники на кипятке. Снимает переохлаждение (+40 жажды, бафф «Таёжное тепло»).', thirst: 40, energy: 15 },
    dried_fish: { id: 'dried_fish', name: 'Вяленая таёжная рыба', type: 'food', icon: 'assets/images/fried_fish.png', weight: 0.15, desc: 'Сушёная на ветру рыба длительного хранения (+35 сытости, бафф «Сытость»).', hunger: 35 },
    dried_berries: { id: 'dried_berries', name: 'Сушёная брусника', type: 'food', icon: 'assets/images/cranberry.png', weight: 0.05, desc: 'Витаминный таёжный сухпаёк (+15 сытости, +10 жажды, бодрость).', hunger: 15, thirst: 10, energy: 10 },
    smoked_meat: { id: 'smoked_meat', name: 'Копчёный таёжный окорок', type: 'food', icon: 'assets/images/fried_chopmeat.png', weight: 0.3, desc: 'Ароматный окорок холодного копчения. Дарует мощный бафф «Сытость» на 6 ходов (+65 сытости, +15 энергии).', hunger: 65, energy: 15 },
    stimulator_m: { id: 'stimulator_m', name: '«Стимулятор-М»', type: 'med', icon: 'assets/images/antirad.png', weight: 0.2, desc: 'Секретная разработка «Био-4». Навсегда увеличивает максимальный запас энергии на 25 единиц!', hp: 50, energy: 50 },

    // Новые предметы: Кухня Вари, Альянсы жителей и Награды высокой репутации
    varya_stew: { id: 'varya_stew', name: 'Лагерная похлёбка Вари', type: 'food', icon: 'assets/images/rich_soup.png', weight: 0.5, desc: 'Горячая наваристая похлёбка из общего котла. Восстанавливает силы всего тела (+40 сытости, +30 жажды, +15 энергии).', hunger: 40, thirst: 30, energy: 15 },
    royal_soup: { id: 'royal_soup', name: 'Праздничный таёжный борщ', type: 'food', icon: 'assets/images/rich_soup.png', weight: 0.6, desc: 'Шедевр кулинарии Вари с тушёнкой, брусникой и кореньями. Дарует +80 сытости, +50 жажды и бафф «Сытость 3x»!', hunger: 80, thirst: 50, energy: 30 },
    taiga_balsam: { id: 'taiga_balsam', name: 'Бальзам Вари и Спиридона', type: 'med', icon: 'assets/images/hw_potion.png', weight: 0.3, desc: 'Секретный медово-ягодный эликсир. Полностью исцеляет (+60 HP, +50 энергии, снимает отравление и переохлаждение).', hp: 60, energy: 50 },
    smoked_feast: { id: 'smoked_feast', name: 'Окорок по-лесному', type: 'food', icon: 'assets/images/fried_chopmeat.png', weight: 0.4, desc: 'Особый охотничий окорок от Егора и Вари, вымоченный в брусничном взваре (+75 сытости, +25 энергии, бафф «Сытость 2x»).', hunger: 75, energy: 25 },
    gravel_filter: { id: 'gravel_filter', name: 'Гравийный фильтр Вари', type: 'tool', icon: 'assets/images/water_filter.png', weight: 0.8, desc: 'Кухонный многослойный фильтр тонкой очистки. Варя теперь может бесплатно очищать 1 флягу воды каждый день!' },
    autoclave_unit: { id: 'autoclave_unit', name: 'Полевой автоклав-дистиллятор', type: 'tool', icon: 'assets/images/a_chemistry_station.png', weight: 2.0, desc: 'Совместное творение Прохора, Анны и Вари. Позволяет мгновенно производить дистиллированную воду и стерилизовать припасы!' },
    army_ration_box: { id: 'army_ration_box', name: 'Спецпаёк штабного резерва', type: 'tool', icon: 'assets/images/boxes.png', weight: 1.5, desc: 'Опечатанный армейский ящик Бати: армейские патроны, тушёнка ГОСТ и радиопротекторы.' }
  };

  // >>> MODULE: data/recipes.js (160 строк)
  // --- РЕЦЕПТЫ КРАФТА ---
  const RECIPES = [
    {
      id: 'burn_charcoal', station: 'fire', name: 'Обжечь берёзовые угли', icon: 'assets/images/activated_carbon.png',
      cost: { firewood: 1 }, result: { charcoal: 2 }, energy: 5, timeMin: 15,
      desc: 'Получение чистого древесного угля от отравлений и для фильтрации.'
    },
    {
      id: 'brew_hot_tea', station: 'fire', name: 'Заварить горячий таёжный чай', icon: 'assets/images/dandelion_tea.png',
      cost: { clean_water: 1, berries: 1, firewood: 1 }, result: { hot_tea: 1 }, energy: 5, timeMin: 10,
      desc: 'Ароматный ягодный взвар. Снимает переохлаждение и дарит таёжное тепло.'
    },
    {
      id: 'cure_fish', station: 'fire', name: 'Завялить рыбу на углях', icon: 'assets/images/fried_fish.png',
      cost: { raw_fish: 2, charcoal: 1 }, result: { dried_fish: 2 }, energy: 5, timeMin: 30,
      desc: 'Питательная вяленая рыба длительного хранения. Дарует бафф «Сытость».'
    },
    {
      id: 'smoke_meat', station: 'fire', name: 'Закоптить таёжный окорок', icon: 'assets/images/fried_chopmeat.png',
      cost: { raw_meat: 1, firewood: 1, charcoal: 1 }, result: { smoked_meat: 1 }, energy: 10, timeMin: 45,
      desc: 'Копчение на ольховом дыму. Дает долгий бафф сытости на 6 ходов.'
    },

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
      desc: 'Простая удочка для ловли рыбы на реке Быстрянке.',
      oneTime: true,
      isCrafted: (s) => getItemCount('rod') > 0 || !!s.questFlags?.rod_crafted || s.mainQuestStep > 3
    },
    {
      id: 'craft_torch', station: 'bench', name: 'Связать смоляной факел', icon: 'assets/images/torch.png',
      cost: { firewood: 1, wire: 1 }, result: { torch: 1 }, energy: 5, timeMin: 10,
      desc: 'Освещает дорогу в темноте и отпугивает стаи диких зверей.'
    },
    {
      id: 'craft_spear', station: 'bench', name: 'Собрать охотничье копьё', icon: 'assets/images/iron_spear.png',
      cost: { scrap: 2, firewood: 2, wire: 1 }, result: { spear: 1 }, energy: 15, timeMin: 25,
      desc: 'Надёжное оружие ближнего боя против хищников.',
      oneTime: true,
      isCrafted: (s) => getItemCount('spear') > 0 || !!s.questFlags?.spear_crafted
    },
    {
      id: 'craft_doghouse', station: 'bench', name: 'Сколотить тёплую конуру для Бурана', icon: 'assets/images/cabin.png',
      cost: { firewood: 3, wire: 1, leather: 1 }, result: {}, energy: 15, timeMin: 30,
      desc: 'Тёплая конура из досок и шкур у лагерного костра. Буран вырастет верным боевым спутником (+25% к урону в боях и утренние подарки)!',
      oneTime: true,
      unlocked: (s) => !!s.questFlags?.pup_rescued && !s.hasDog && !s.questFlags?.dog_house_built,
      isCrafted: (s) => !!s.hasDog || !!s.questFlags?.dog_house_built
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
      desc: 'Укреплённый костюм. Навсегда увеличивает вместимость рюкзака до 30 кг.',
      oneTime: true,
      unlocked: (s) => s.mainQuestStep >= 15 || !!s.questFlags?.suit_crafted,
      isCrafted: (s) => !!s.questFlags?.suit_crafted || getItemCount('stalker_suit') > 0
    },
    {
      id: 'craft_respirator', station: 'bench', name: 'Собрать респиратор Р-2', icon: 'assets/images/respirator.png',
      cost: { swamp_moss: 2, herbs: 1, wire: 1 }, result: { respirator: 1 }, energy: 15, timeMin: 30,
      desc: 'Защищает лёгкие от радиоактивного тумана и ядовитых газов Бункера.',
      oneTime: true,
      unlocked: (s) => s.mainQuestStep >= 16 || !!s.questFlags?.respirator_crafted,
      isCrafted: (s) => !!s.questFlags?.respirator_crafted || getItemCount('respirator') > 0
    },
    {
      id: 'brew_spiridon_vodka', station: 'fire', name: 'Сварить настойку «Спиридоновка»', icon: 'assets/images/hw_potion.png',
      cost: { amanita: 1, alcohol: 1, clean_water: 1 }, result: { spiridon_vodka: 1 }, energy: 5, timeMin: 20,
      desc: 'Ядрёное снадобье староверов. Мгновенно даёт +40% энергии и прогоняет сонливость.',
      unlocked: (s) => s.sideQuests?.spiridon_mushrooms?.status === 'completed'
    },
    {
      id: 'brew_tar_salve', station: 'fire', name: 'Сварить дегтярный бальзам', icon: 'assets/images/hw_potion.png',
      cost: { swamp_moss: 1, firewood: 1, herbs: 1 }, result: { tar_salve: 1 }, energy: 5, timeMin: 20,
      desc: 'Смолистая мазь от рваных ран (+40 HP). Защищает от укусов хищников и снижает урон на 3 вылазки.',
      unlocked: (s) => s.sideQuests?.spiridon_mushrooms?.status === 'completed'
    },
    {
      id: 'brew_lynx_eye', station: 'fire', name: 'Сварить эликсир «Око рыси»', icon: 'assets/images/hw_potion.png',
      cost: { berries: 2, herbs: 1, clean_water: 1 }, result: { lynx_eye: 1 }, energy: 5, timeMin: 15,
      desc: 'Таёжный отвар обостряет зрение во тьме: ночные вылазки проходят без штрафов к энергии!',
      unlocked: (s) => s.sideQuests?.spiridon_mushrooms?.status === 'completed'
    },
    {
      id: 'craft_geiger', station: 'bench', name: 'Собрать Счётчик Гейгера ДП-5', icon: 'assets/images/geiger_counter.png',
      cost: { scrap: 2, wire: 2, batteryaaa: 1 }, result: { geiger_counter: 1 }, energy: 10, timeMin: 30,
      desc: 'Армейский дозиметр. Пассивно снижает накопление радиации на 30% во всех вылазках!',
      oneTime: true,
      unlocked: (s) => !!s.questFlags?.met_sasha,
      isCrafted: (s) => !!s.hasGeiger || getItemCount('geiger_counter') > 0 || !!s.questFlags?.geiger_crafted
    },
    {
      id: 'craft_electric_torch', station: 'bench', name: 'Собрать полевой электрофонарь', icon: 'assets/images/electric_torch.png?v=2.3',
      cost: { wire: 1, batteryaaa: 1, scrap: 1 }, result: { electric_torch: 1 }, energy: 5, timeMin: 15,
      desc: 'Электрический фонарь с вечным светодиодом. Освещает ночной путь без расхода дров.',
      oneTime: true,
      unlocked: (s) => !!s.questFlags?.met_sasha,
      isCrafted: (s) => !!s.hasElectricTorch || getItemCount('electric_torch') > 0 || !!s.questFlags?.electric_torch_crafted
    },
    {
      id: 'cook_royal_soup', station: 'fire', name: 'Праздничный таёжный борщ', icon: 'assets/images/rich_soup.png',
      cost: { canned_food: 1, berries: 2, clean_water: 1, firewood: 1 }, result: { royal_soup: 1 }, energy: 10, timeMin: 35,
      desc: 'Кулинарный шедевр Вари. Дарует +80 сытости, +50 жажды и мощный бафф «Сытость 3x»!',
      unlocked: (s) => s.sideQuests?.varya_royal_soup?.status === 'completed'
    },
    {
      id: 'brew_balsam', station: 'fire', name: 'Бальзам Вари и Спиридона', icon: 'assets/images/hw_potion.png',
      cost: { alcohol: 1, berries: 2, herbs: 2, swamp_moss: 1 }, result: { taiga_balsam: 1 }, energy: 10, timeMin: 25,
      desc: 'Целебный медово-ягодный эликсир. Полностью исцеляет (+60 HP, +50 энергии, снимает отравление и холод).',
      unlocked: (s) => s.crossQuests?.cross_balsam?.status === 'completed'
    },
    {
      id: 'cook_smoked_feast', station: 'fire', name: 'Окорок по-лесному', icon: 'assets/images/fried_chopmeat.png',
      cost: { raw_meat: 1, berries: 2, charcoal: 1, firewood: 1 }, result: { smoked_feast: 1 }, energy: 10, timeMin: 40,
      desc: 'Особый охотничий окорок от Егора и Вари, вымоченный в брусничном взваре (+75 сытости, +25 энергии, бафф «Сытость 2x»).',
      unlocked: (s) => s.crossQuests?.cross_feast?.status === 'completed'
    }
  ];

  // >>> MODULE: data/locations.js (52 строк)
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
      unlocked: false, reqRep: 40,
      actions: ['gather_moss', 'scavenge_swamp']
    },
    {
      id: 'pump_station', name: 'Насосная станция №4', tier: 2, icon: 'assets/images/a_chemistry_station.png', rad: 25, energyCost: 20, timePass: 2,
      desc: 'Полузатопленный бетонный комплекс очистки воды. Здесь можно найти фильтры и трубы.',
      unlocked: false, reqRep: 70,
      actions: ['scavenge_station']
    },
    {
      id: 'hunting_grounds', name: 'Охотничьи угодья', tier: 2, icon: 'assets/images/wolf.png', rad: 20, energyCost: 25, timePass: 2,
      desc: 'Глухой бурелом. Водятся кабаны, зайцы и волки. Нужна осторожность и оружие.',
      unlocked: false, reqRep: 110,
      actions: ['place_trap', 'hunt_big_game']
    },
    {
      id: 'old_cordon', name: 'Заброшенный кордон', tier: 2, icon: 'assets/images/abandoned_house.png', rad: 15, energyCost: 15, timePass: 2,
      desc: 'Старый бревенчатый кордон лесничества у подножия скал. Бывшая полевая база экспедиции НИИ «Сфера».',
      unlocked: false, reqRep: 160,
      actions: ['search_cordon', 'scavenge_cordon']
    },
    {
      id: 'radio_tower', name: 'Радиовышка на утесе', tier: 3, icon: 'assets/images/generator_skin.png', rad: 35, energyCost: 30, timePass: 3,
      desc: 'Старая советская вышка связи. Отсюда открывается вид на всю закрытую зону.',
      unlocked: false, reqRep: 200,
      actions: ['repair_antenna']
    },
    {
      id: 'bunker', name: 'Бункер НИИ «Сфера»', tier: 3, icon: 'assets/images/hatch.png', rad: 60, energyCost: 40, timePass: 4,
      desc: 'Запечатанный подземный научный центр, ставший источником Каскада.',
      unlocked: false, reqRep: 320,
      actions: ['enter_bunker']
    }
  ];

  // >>> MODULE: data/npcs.js (69 строк)
  // --- НПС ЛАГЕРЯ «ВСЕМ ПОХ»: СОВЕТ ОСНОВАТЕЛЕЙ И ЖИТЕЛИ ---
  const NPCS = {
    sanych: {
      id: 'sanych',
      name: 'Александр Александрович (Саныч)',
      role: 'Глава лагеря «Всем ПОХ»',
      avatar: 'assets/images/npc_leader.png?v=2.2',
      desc: 'Основатель поселения, верховный дипломат и мотиватор. Собрал уцелевших на старой продуваемой лесопилке посреди мёртвой тайги. Для него оптимизм — это не блажь, а железная воинская дисциплина.'
    },
    ataron: {
      id: 'ataron',
      name: 'Андрей «Атарон»',
      role: 'Комендант периметра и безопасности',
      avatar: 'assets/images/npc_male2.png?v=2.2',
      desc: 'Отвечает за оборону и строгий учет. Частокол у него стоит строго под 45 градусов, факелы горят по уставу. Коллекционирует пивные крышечки — твердую валюту порядка.'
    },
    sky: {
      id: 'sky',
      name: 'Николай «Скай»',
      role: 'Главный врач и токсиколог',
      avatar: 'assets/images/npc_vet.png?v=2.2',
      desc: 'Полевой хирург с чернейшим юмором и усталыми глазами. Лечит раненых, ворчит на речную воду («Наука проиграла реке!»), варит «Адское варево» и спасает от радиации.'
    },
    bob: {
      id: 'bob',
      name: 'Вова «Боб» («Бобчонок»)',
      role: 'Главный инженер и механик',
      avatar: 'assets/images/npc_engineer.png?v=2.2',
      desc: 'Кудесник кустарных технологий. Рассуждает строго по пунктам: «Пункт первый, пункт второй...». Перебирает водоочистители, кует снаряжение и варит крафтовое пиво.'
    },
    chagron: {
      id: 'chagron',
      name: 'Чагрон («Глыба»)',
      role: 'Снайпер и таёжный следопыт',
      avatar: 'assets/images/npc_def_male.png?v=2.2',
      desc: 'Двухметровый богатырь с ладонями-лопатами. Немногословен, виртуозно бьет калибром 7.62x54R. Втайне не выносит пустоты и одиночества, поэтому любит греться у костра с новичками.'
    },
    varya: {
      id: 'varya',
      name: 'Варя (Варвара)',
      role: 'Полевой повар лагеря',
      avatar: 'assets/images/npc_varya.png?v=2.2',
      desc: 'Молодая девушка родом из Брянска, спасённая на мосту неизвестным снайпером. Заведует общим котлом, варит наваристые супы и выспрашивает у всех калибр 7.62x54R.'
    },
    margo: {
      id: 'margo',
      name: 'Марго (Марья Моревна)',
      role: 'Лесная травница Пустоши',
      avatar: 'assets/images/npc_default_woman.png?v=2.2',
      desc: 'Травница с фиолетовыми волосами в кедах «Два мяча». Знает все секреты болот, берёзового дёгтя и целебных трав. Главный лесной философ Пустоши.',
      marker: 'swamp'
    },
    strong: {
      id: 'strong',
      name: 'Стронг',
      role: 'Аналитик и радио-статист',
      avatar: 'assets/images/npc_sasha.png?v=2.2',
      desc: 'Человек с антрацитовым глазом и потертым блокнотом. Ведет «Реестр Всходов», сканирует радиоэфир на Скалистом утёсе и точно вычисляет вероятности.'
    }
  };

  // Неперечислимые псевдонимы для 100% обратной совместимости со старыми сохранениями и кодом
  Object.defineProperty(NPCS, 'batya', { value: NPCS.sanych, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'anna', { value: NPCS.sky, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'prokhor', { value: NPCS.bob, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'egor', { value: NPCS.chagron, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'spiridon', { value: NPCS.margo, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'sasha', { value: NPCS.strong, enumerable: false, writable: true, configurable: true });

  // >>> MODULE: data/weather.js (189 строк)
  // ==========================================================================
  // ДИНАМИЧЕСКАЯ СИСТЕМА ПОГОДЫ И КЛИМАТА ТАЙГИ
  // ==========================================================================

  const WEATHER_TYPES = {
    clear: {
      id: 'clear',
      name: 'Ясно',
      icon: '☀️',
      desc: 'Чистое таёжное небо. Сил тратится меньше (-10%), сбор трав и видимость эффективнее.',
      energyMod: -10,
      radMod: 0,
      thirstMod: 0,
      color: '#f59e0b'
    },
    rain: {
      id: 'rain',
      name: 'Затяжной дождь',
      icon: '🌧️',
      desc: 'Осенний ливень хлещет по кронам. Клёв рыбы лучше (+1 улов), водосборник наполняется, но сырость грозит простудой (+15% к расходу сил).',
      energyMod: 15,
      radMod: 0,
      thirstMod: -10,
      color: '#38bdf8'
    },
    fog: {
      id: 'fog',
      name: 'Радиоактивный туман',
      icon: '☢️',
      desc: 'Жёлтый едкий смог с низины у Бункера. Повышенный радиационный фон повсюду (+12 Р). В тумане сложно ориентироваться, но распускаются люминесцентные мхи.',
      energyMod: 5,
      radMod: 12,
      thirstMod: 0,
      color: '#c084fc'
    },
    freeze: {
      id: 'freeze',
      name: 'Северные заморозки',
      icon: '❄️',
      desc: 'Дыхание севера, лужи скованы льдом. Сил и тепла уходит больше (+20%), механизмы замерзают, но дичь жмётся к лагерю.',
      energyMod: 20,
      radMod: 0,
      thirstMod: 0,
      color: '#93c5fd'
    },
    storm: {
      id: 'storm',
      name: 'Шквалистая буря',
      icon: '⛈️',
      desc: 'Ветер валит сухостой, река шумит. Добыча дров и бурелома выше (+2 полена), но в тайге крайне опасно (+25% сил).',
      energyMod: 25,
      radMod: 0,
      thirstMod: 0,
      color: '#e74c3c'
    },
    toxic_rain: {
      id: 'toxic_rain',
      name: 'Кислотная морось',
      icon: '☣️',
      desc: 'Едкие испарения химкомплекса выпали с осадками. Разъедает металл и брезент (+8 Р радиации), но питает редкие токсичные травы.',
      energyMod: 15,
      radMod: 8,
      thirstMod: 0,
      color: '#a3e635'
    },
    aurora: {
      id: 'aurora',
      name: 'Аномальное сияние',
      icon: '🌌',
      desc: 'Призрачные изумрудно-фиолетовые сполохи ионизированного неба. Эфир гудит, отличная ночная видимость (-10% сил), открывается дальний радиоволновод.',
      energyMod: -10,
      radMod: 4,
      thirstMod: 0,
      color: '#818cf8'
    },
    heat: {
      id: 'heat',
      name: 'Знойное марево',
      icon: '🌡️',
      desc: 'Удушливая неподвижная сушь над тайгой. Жажда нарастает быстрее (+40%), но сосны сохнут на корню — идеальное время для заготовки сухих дров и копчения.',
      energyMod: 10,
      radMod: 0,
      thirstMod: 40,
      color: '#fb923c'
    }
  };

  // --- УНИКАЛЬНЫЕ РЕПЛИКИ ЖИТЕЛЕЙ ЛАГЕРЯ В РАЗНУЮ ПОГОДУ ---
  const NPC_WEATHER_QUOTES = {
    sanych: {
      clear: '«Солнце над соснами, дым столбом — отличная примета! В такой день надо не сопли жевать, а брёвна таскать. Тайга любит тех, кто по солнцу успевает закрома набить.»',
      rain: '«Хлещет как из брандспойта... Брезент на штабных ящиках натянули? А Короб №42? Смотри мне, если семена подмокнут — лично будешь над каждым помидором дыханием сушить!»',
      fog: '«Мгла наползает, радиоактивная гадость с низины... Все дозоры удвоить, дозиметры на грудь! В такой пелене твари бесшумно к самому частоколу подобраться могут. Бдительность — закон лагеря!»',
      freeze: '«Морозец ударил, борода инеем берётся! Ничего, сибирский мужик от холода только крепчает! Костры в бочках разжечь, караульным выдавать чай со смородиной. Главное — в оцепенение не впадать!»',
      storm: '«Ветер сосны гнёт к самой земле! Штормовое предупреждение по лагерю! Крыши на складах подпереть, трубу в пекарне закрыть заслонкой. Держись за землю крепче, боец, тайга сегодня сердитая!»',
      toxic_rain: '«Желтизна с неба льёт... Бункерные остатки химкомбината испарились и нам на голову сыплются. Все фляги прикрыть, респираторы на морду! Кто без надобности из-под навеса выйдет — сам себе злобный буратино.»',
      aurora: '«Глянь на небо... Сполохи во все стороны, как на крайнем севере! Красота жуткая. Говорят, перед Катастрофой такие же огни над полигоном горели. Завораживает... но расслабляться не смей — приборы с ума сходят.»',
      heat: '«Духота, словно в бане по-чёрному сидим... Сосны смолой плачут, воздух звенит. Воду беречь, к реке лишний раз без нужды не бегать. В такую сушь любая искра — и тайга факелом займётся.»'
    },
    ataron: {
      clear: '«Видимость предельная. Сектор сорок пять градусов просматривается до дальних кустов. Но расслабляться нельзя: по ясной погоде и вражеский снайпер видит на километр. Чисти оптику.»',
      rain: '«Сырость — главный враг боеприпаса. Капсюль окислится — и в решающий момент вместо выстрела пшик получишь. Все патроны держать в герметичных цинках! И лужи у караулки вычерпать, сапоги раскиснут.»',
      fog: '«Нулевая видимость. Метры меряем шагами, ориентиры — только по вешкам и на слух. Чуть шорох за проволокой — сразу доклад. В тумане мутанты крадутся по ветру. Палец с предохранителя не снимать.»',
      freeze: '«Замки на карабинах перемёрзли! Смазку на затворах менять на сухую графитовую, иначе при выстреле пружину сорвёт. Караулы меняем каждые сорок минут, обмороженных бойцов в карауле мне не надо.»',
      storm: '«Шквал шумит так, что сигнальные колокольчики на проволоке не услышишь. Поэтому усиливаем визуальный контроль. В бурю ветер валит сухостой прямо на ограждение — если столб треснет, завалит весь фланг.»',
      toxic_rain: '«Едкая морось жрёт смазку и металл стволов! После каждого выхода — чистка ветошью с керосином. Плащи застегнуть на все пуговицы. Солдат должен быть сухим и боеготовым.»',
      aurora: '«Компас крутит как сумасшедший, магнитная аномалия от этих сполохов. На стрелку не надейся, ориентируйся по геодезическим зарубкам. И глаза щиплет от ионизации. Держи периметр!»',
      heat: '«Сушь. Самая опасная пора для укреплений — деревянный частокол сухой как порох. Курение на постах карается нарядом вне очереди! Заметишь дымок на вырубке — поднимай тревогу мгновенно.»'
    },
    sky: {
      clear: '«Солнце, ультрафиолет... Хоть раны быстрее подсыхают. Вынесите матрасы из изолятора на просушку, пока сырость не съела бинты. А вообще, ясное небо в этих широтах — подозрительная аномалия.»',
      rain: '«Идеальная погода для пневмонии, плеврита и гнилостных инфекций! Ко мне уже двое с хрипами в легких пришли. Промокнешь на вылазке — сразу глотай барсучий жир или настойку чабреца, а то легкие в таз выплюнешь.»',
      fog: '«Дыши через раз и только через плотный фильтр! В этом тумане взвесь радиоактивного аэрозоля. Вдохнешь глубоко — через неделю слизистая бронхов начнет слезать чулком. Держи порошок цистамина наготове.»',
      freeze: '«Холод собачий! Отморозить пальцы в тайге — дело пяти минут. А я пальцы пришивать в антисанитарных условиях устал. Рукавицы не снимай, мажь нос жиром и не вздумай пить спирт на морозе — сосуды расширит и замерзнешь насмерть.»',
      storm: '«В эфире сплошной треск и белый шум, статика от молний чуть входной каскад радиостанции не выжгла! Заземление на мачте проверь, а то шарахнет так, что лазарет ослепнет.»',
      toxic_rain: '«О, кислотные осадки! pH воды зашкаливает, щелочной раствор наготове держите. Если капли на кожу попали — смывать содовой водой немедленно, иначе химический ожог второй степени гарантирован.»',
      aurora: '«Фантастика... Ионизация стратосферы пробила ионосферу! Радиоприемник ловит сигналы за тысячи километров — морзянка с дальнего востока, обрывки переговоров полярников... Редчайший шанс послушать, кто еще жив на этой планете.»',
      heat: '«Обезвоживание — скрытый убийца. Кровь густеет, сердце колотится как бешеное. Пейте подсоленную воду, дурни, а не ледяную сырую из омута! И на голову панаму натяни, солнечный удар лечить нечем.»'
    },
    bob: {
      clear: '«Погодка — шепчет! Сварка на солнце сохнет быстрее, нихромовая нить в генераторе не коротит. Я сегодня на верстаке три новых редуктора перебрал. Тащи железки, пока пальцы не закоченели!»',
      rain: '«Капает за шиворот, крыша мастерской течет... Пункт первый: на верстак брезент натянуть! Пункт второй: если сварочный трансформатор зальет — шарахнет так, что до Бункера долетим без вертолета!»',
      fog: '«Сырость такая, что напильники ржавеют прямо на полке за два часа! Смазываю весь инструмент отработанным маслом. Ни зги не видно, лампу накаливания вплотную к тискам придвинул.»',
      freeze: '«Металл на морозе хрупкий становится, как стекло! Зубилом ударишь — осколок летит прямо в лоб. Газовую горелку отогреваю у печи, иначе баллон давление не держит. Греемся, братуха!»',
      storm: '«Ветер такой, что трубу у кузницы чуть не вывернуло с корнем! Зато ветрогенератор крутит как бешеный — аккумуляторы зарядились под завязку! Хоть какая-то польза от этого светопреставления.»',
      toxic_rain: '«Едкая гадость с неба капает — краску на кожухах вспучило, жесть разъедает. Весь инструмент в закрытые ящики попрятал. Если найдешь свинец или резину — тащи, будем гидроизоляцию ладить.»',
      aurora: '«Слушай, от этих зеленых сполохов в воздухе даже искры от статики на пальцах проскакивают! Я на контур заземления лампочку повесил — она без батарейки тускло тлеет! Тесла бы от зависти локти кусал!»',
      heat: '«Жарища адская! В кузнице вообще дышать нечем — как внутри мартеновской печи. Зато заготовки остывают медленно, ковкость идеальная. Ты мне воды похолоднее занеси, а то спекусь тут на наковальне.»'
    },
    chagron: {
      clear: '«Светло... Река прозрачная, каждый камешек на перекате виден. Рыба ушла на глубину, под коряги. Зато на уток охотиться сподручно. Тишина хорошая, мирная.»',
      rain: '«Дождь по воде шлёпает... Самое уловистое время. Крупный хариус и налим со дна поднимаются, мошку сбитую ловят. Одежду сукном пропитай, чтобы не промокала. Посидим на берегу, послушаем воду.»',
      fog: '«Мгла над водой стоит сплошной стеной. Лодку не спускай — кругом завертит, берег потеряешь. На том берегу ветка хрустнула... Зверь к водопою крадется вслепую. Патрон в патроннике держи.»',
      freeze: '«Закраины на реке льдом затянуло. Шуга пошла по Быстрянке. Скоро зимнюю снасть доставать придется. Снег следы зверя четко держит — охотиться легче, но пальцы на спусковом крючке коченеют мгновенно.»',
      storm: '«Волна на реке с барашками, топляк несет как щепки. Ловушки мои прибрежные сорвало, надо переставлять. В тайгу в такую бурю соваться — безумие, падающая сосна костей не пожалеет.»',
      toxic_rain: '«Вода в реке помутнела, радужная пленка поверху плывет. Из такой воды уху варить нельзя — нутро выжжет. Рыбу перед готовкой вымачивать в трех чистых водах надо. Тяжелые времена.»',
      aurora: '«Зеленое пламя в воде отражается... Красиво и жутко. Старики говорили, когда небо огнем горит — духи тайги выходят на сопки. Зверь в такие ночи не спит, волчьи стаи на луну воют.»',
      heat: '«Река обмелела, перекаты обнажились. Рыба вялая, на дно в ямы забилась, где ключи холодные бьют. Сам в полдень на солнцепек не суйся — иди в тень кедров, там хоть какой-то вздох есть.»'
    },
    varya: {
      clear: '«Красота на улице! На солнце котел быстро закипает, сухари на свежем воздухе до хруста подсыхают. Я сегодня пирог с брусникой затеяла — заходи на запах, первому кусок достанется!»',
      rain: '«Опять льет! Дрова у очага отсырели, дым коромыслом, глаза ест... Но зато водосборник полнехонек! Вода дождевая мягкая, чай на ней — одно объедение. Подставляй кружку, мяты свежей брошу.»',
      fog: '«Ой, туманище какой наполз... В пяти шагах казана не видать! Я крышку поварёшкой стучу, чтоб наши караульные на звук кухни шли и в потемках мимо лагеря не убрели. Садись скорее, похлебка согреет.»',
      freeze: '«Зуб на зуб не попадает! Масло в куске замерзло — ножом не отколешь. Я печь сосновыми смоляными плашками растопила, жар до самого потолка! Кашу сытную сварю с топленым салом — в мороз без жира нельзя.»',
      storm: '«Ой, у меня шатер чуть ветром не унесло! Казан на цепях качается, искры во все стороны летят! Помоги мешки с мукой в сухой угол перетащить, а то промочит — пропадет весь запас хлеба!»',
      toxic_rain: '«Ой, мамочки, опять эта желтая морось! Я всю посуду полотенцами накрыла, чаны запечатала крышками. Ни капли этой гадости в пищу попасть не должно! Береги себя, заходи внутрь палатки.»',
      aurora: '«Ты небо видел?! Как будто шелк зеленый с фиолетовым над нами развевается! Я даже про кашу забыла, рот разинула... В Брянске дедушка про северные сполохи сказки рассказывал, а тут наяву... Чудеса, да и только.»',
      heat: '«Ох, у плиты стоять в такую жарищу — сущее мучение! Лицо горит, пот ручьями. Зато квас на сухарях за полдня подошел — ядреный, холодный, из погреба достала! Хлебни, сразу оживешь!»'
    },
    margo: {
      clear: '«Солнце в зените — самое время собирать полынь, чабрец и зверобой! В ясный полдень в травах самая целебная сила копится, эфирные масла аж звенят в воздухе. Не топчи поляну, с умом срывай!»',
      rain: '«Дождь шумит, земля пьет... Грибница просыпается! Завтра маслята и подберезовики ковром пойдут вдоль старой просеки. А пока дома сидим, чаи настаиваем да корень лопуха для суставов сушим.»',
      fog: '«Вот он, мой любимый туманчик! В такой влажной мгле только и можно найти ночные светящиеся мхи и споры спорыньи. Обычные сталкеры боятся, а для знахарки туман — родная мать. Глаза открой — тайга секреты открывает.»',
      freeze: '«Мороз кору сковал. Зато брусника и рябина после первых заморозков горечь теряют и становятся сладкими, как мед! Я рябиновый настой на меду ставлю — ни одна хворь за зиму к лагерю не подступится.»',
      storm: '«Буря деревья ломает, а мне на радость — свежий березовый деготь и чагу с поваленных берез собирать вдвое легче! Ветер старое ломает, новому дорогу дает. Трави бобров, спасай деревья!»',
      toxic_rain: '«Кислотный дождичек... Для людей яд, а для некоторых аномальных трав — лучший прикорм! Смотри, как папоротник фиолетовым светиться начал! Я в перчатках из толстой резины пойду корешки копать. Смерть и жизнь в одном флаконе.»',
      aurora: '«Небесные сполохи... Энергия через макушку прямо в пятки уходит! В такие ночи настои настаиваются с утроенной силой. Лунные циклы отдыхают, когда космос с нами говорит. Чувствуешь, как воздух звенит?»',
      heat: '«Сушь стоит великая. Травы на корню сохнут, смола на стволах закипает. Помоги полить мои грядки с мятой у ручья, а то сгорят на солнцепеке. В такую пору огонь — лютый враг всего живого.»'
    },
    strong: {
      clear: '«Освещенность: максимальная. Солнечная радиация в норме. Коэффициент оптического обнаружения целей возрос на семьдесят два процента. Занес в журнал метеонаблюдений: стабильный антициклон.»',
      rain: '«Осадки: девятнадцать миллиметров ртутного столба. Гидрологический режим Быстрянки повышен на полметра. Водосборные системы эффективны. Коррозия незащищенных сплавов ускорена на сорок процентов.»',
      fog: '«Плотность аэрозоля: критическая. Оптическая дальность: три метра. Радиоактивный фон повышен на двенадцать рентген. Мутагенная активность в низинах возле бункера возросла. Рекомендуется герметизация дыхательных путей.»',
      freeze: '«Температура: минус четырнадцать по Цельсию. Вязкость горюче-смазочных материалов повышена втрое. Вероятность заклинивания автоматического оружия: двадцать восемь процентов. Сохраняйте кинетическую активность.»',
      storm: '«Скорость порывов ветра: двадцать четыре метра в секунду. Аэродинамическая нагрузка на строения лагеря на пределе. Фиксирую падение трех сухостойных сосен в третьем квадрате. Буран зафиксирован на цепи.»',
      toxic_rain: '«Спектральный анализ осадков: серная и азотистая кислоты в аэрозольной фазе. Источник — испарения химрезервуаров завода "Сфера". Органические ткани подвержены химической деструкции. Всем оставаться в укрытиях.»',
      aurora: '«Аномалия: магнитосферный плазменный резонанс. Частота пульсаций: восемь целых три десятых герца — резонанс Шумана нарушен. Радиоэфир перегружен спорадическими сигналами. Фиксирую сигналы выживших в квадрате сорок два.»',
      heat: '«Температура плюс тридцать три градуса при относительной влажности двенадцать процентов. Риск самовозгорания торфяников: восемьдесят четыре процента. Потребление жидкости организмом увеличено в одна целая шесть десятых раза.»'
    }
  };

  function getNpcWeatherQuote(npcId, weatherId) {
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    const w = weatherId || (typeof state !== 'undefined' && state.weather) || 'clear';
    const quotes = NPC_WEATHER_QUOTES[id];
    if (quotes && quotes[w]) {
      return quotes[w];
    }
    return quotes?.clear || '«Тайга переменчива, держи ухо востро.»';
  }

  // >>> MODULE: data/statuses.js (60 строк)
  // --- КАТАЛОГ СТАТУСОВ (БАФФЫ И ДЕБАФФЫ) ---
  const STATUS_EFFECTS_DEF = {
    well_fed: {
      id: 'well_fed',
      name: 'Сытость',
      icon: '🍲',
      type: 'buff',
      desc: 'Организм полон сил: восстанавливает +2 HP за каждый ход.'
    },
    spiridon_vigor: {
      id: 'spiridon_vigor',
      name: 'Тонус Спиридоновки',
      icon: '🍄',
      type: 'buff',
      desc: 'Ядрёная настойка: снижение расхода энергии в вылазках на -15%.'
    },
    rad_shield: {
      id: 'rad_shield',
      name: 'Радиозащита',
      icon: '🛡️',
      type: 'buff',
      desc: 'Травяной барьер: снижает всё накопление радиации на 50%.'
    },
    lynx_vision: {
      id: 'lynx_vision',
      name: 'Око рыси',
      icon: '👁️',
      type: 'buff',
      desc: 'Обострённые чувства: ночные вылазки проходят без штрафов к энергии.'
    },
    body_warmth: {
      id: 'body_warmth',
      name: 'Таёжное тепло',
      icon: '☕',
      type: 'buff',
      desc: 'Защита от простуды и дождя, комфорт в любую непогоду.'
    },
    bleeding: {
      id: 'bleeding',
      name: 'Рваная рана',
      icon: '🩸',
      type: 'debuff',
      desc: 'Кровотечение: отнимает -4 HP за ход. Перевяжите бинтом или нанесите мазь!'
    },
    hypothermia: {
      id: 'hypothermia',
      name: 'Переохлаждение',
      icon: '🥶',
      type: 'debuff',
      desc: 'Трясёт от холода: расход энергии +25%. Отогрейтесь у костра или выпейте горячий чай.'
    },
    poisoning: {
      id: 'poisoning',
      name: 'Отравление',
      icon: '🤢',
      type: 'debuff',
      desc: 'Токсины в желудке: теряется -3 HP за ход. Примите берёзовый уголь!'
    }
  };

  // >>> MODULE: data/upgrades.js (46 строк)
  // --- УЛУЧШЕНИЯ ЛАГЕРЯ ---
  const CAMP_UPGRADES = {
    kennel: {
      id: 'kennel',
      name: 'Утеплённая конура Бурана',
      icon: 'assets/images/wood_house.png',
      cost: { firewood: 4, leather: 2, wire: 3 },
      desc: 'Тёплый угол для верного пса. Буран охраняет лагерь, даёт +10 сил при ласке и помогает на охоте.'
    },
    drying_rack: {
      id: 'drying_rack',
      name: 'Таёжная сушилка рыбы и ягод',
      icon: 'assets/images/cabin.png',
      cost: { firewood: 5, wire: 3, swamp_moss: 2 },
      desc: 'Ветвистые жерди с навесом. Каждое утро автоматически завяливает +1 рыбу или сушит порцию ягод.'
    },
    storage_chest: {
      id: 'storage_chest',
      name: 'Лагерный сундук (Склад)',
      icon: 'assets/images/food_box.png',
      cost: { firewood: 6, scrap: 3, wire: 4 },
      desc: 'Вместительный армейский рундук. Позволяет разгрузить рюкзак и хранить тяжелые материалы в лагере.'
    },
    rain_collector: {
      id: 'rain_collector',
      name: 'Навес-водосборник',
      icon: 'assets/images/barrel.png',
      cost: { leather: 2, firewood: 3, scrap: 2 },
      desc: 'Натянутый брезент и бочка. В дождливую погоду и туман каждое утро наполняет +2 фляги чистой воды.'
    },
    perimeter_alarm: {
      id: 'perimeter_alarm',
      name: 'Сигнальный периметр',
      icon: 'assets/images/cable.png',
      cost: { wire: 3, scrap: 3 },
      desc: 'Растяжки из стальной проволоки и гильз вокруг лагеря. Защищает от ночных набегов зверей и воров.'
    },
    smokehouse: {
      id: 'smokehouse',
      name: 'Коптильня «Тайга»',
      icon: 'assets/images/fireplace.png',
      cost: { scrap: 4, firewood: 4 },
      desc: 'Кирпичный очаг с дымоходом. Открывает рецепт копчёного окорока с долгим баффом «Сытость» на 6 ходов.'
    }
  };

  // >>> MODULE: data/quests_side.js (104 строк)
  // --- ДОПОЛНИТЕЛЬНЫЕ И НЕОСНОВНЫЕ КВЕСТЫ (EXPANSION) ---
  const SIDE_QUESTS = [
    // Лагерные поручения (10)
    { id: 'sq_wood_anna', category: 'camp', title: 'Дрова для лазарета', giver: 'Николай «Скай» (Лазарет)', desc: 'Собрать 4 охапки сухих дров для обогрева медицинского вагончика Ская.', reward: '2 стерильных бинта, +8 репутации', isDone: (s) => s.sideQuests?.sq_wood_anna?.status === 'completed' },
    { id: 'sq_fish_egor', category: 'camp', title: 'Копчёная щука', giver: 'Чагрон («Глыба»)', desc: 'Поймать 3 свежих рыбы и заготовить 2 полена для лагерной коптильни Чагрона.', reward: '2 порции ухи, 2 патрона, +10 репутации', isDone: (s) => s.sideQuests?.sq_fish_egor?.status === 'completed' },
    { id: 'sq_water_batya', category: 'camp', title: 'Чистый глоток', giver: 'Саныч (Штаб)', desc: 'Вскипятить 3 фляги воды для штабного резерва общины.', reward: '3 патрона, +10 репутации', isDone: (s) => s.sideQuests?.sq_water_batya?.status === 'completed' },
    { id: 'sq_berries_anna', category: 'camp', title: 'Таёжные витамины', giver: 'Николай «Скай» (Лазарет)', desc: 'Собрать 3 порции брусники для противоцинготного взвара Ская.', reward: '1 цистамин (антирад), +8 репутации', isDone: (s) => s.sideQuests?.sq_berries_anna?.status === 'completed' },
    { id: 'sq_coal_prokhor', category: 'camp', title: 'Уголь для горна', giver: 'Вова «Боб» (Мастерская)', desc: 'Принести 2 металлолома для кузнечного горна Бобчонка.', reward: '2 мотка проволоки, 2 патрона, +10 репутации', isDone: (s) => s.sideQuests?.sq_coal_prokhor?.status === 'completed' },
    { id: 'sq_snare_egor', category: 'camp', title: 'Силки на глухаря', giver: 'Чагрон («Глыба»)', desc: 'Добыть мясо боровой дичи в проволочный силок.', reward: '2 вяленых мяса, +10 репутации', isDone: (s) => s.sideQuests?.sq_snare_egor?.status === 'completed' },
    { id: 'sq_watch_batya', category: 'camp', title: 'Ночной дозор', giver: 'Андрей «Атарон» (Периметр)', desc: 'Отстоять караульную смену на вышке с факелом и проверить наклон забора под 45 градусов.', reward: '4 патрона, тушенка, +14 репутации', isDone: (s) => s.sideQuests?.sq_watch_batya?.status === 'completed' },
    { id: 'sq_medkit_anna', category: 'camp', title: 'Полевая перевязка', giver: 'Николай «Скай» (Лазарет)', desc: 'Сдать 2 стерильных бинта и пучок целебных трав доктору Скаю.', reward: 'Исцеление HP, +10 репутации', isDone: (s) => s.sideQuests?.sq_medkit_anna?.status === 'completed' },
    { id: 'sq_nails_prokhor', category: 'camp', title: 'Кованые скобы', giver: 'Вова «Боб» (Мастерская)', desc: 'Поработать у наковальни для укрепления ворот лагеря у Боба.', reward: 'Стальной капкан, +10 репутации', isDone: (s) => s.sideQuests?.sq_nails_prokhor?.status === 'completed' },
    { id: 'sq_pier_egor', category: 'camp', title: 'Расчистка мостков', giver: 'Чагрон («Глыба»)', desc: 'Расчистить причал Быстрянки от радиоактивного топляка.', reward: 'Земляные черви ×6, +10 репутации', isDone: (s) => s.sideQuests?.sq_pier_egor?.status === 'completed' },

    // Тайны локаций (10)
    { id: 'lq_river_container', category: 'location', title: 'Утопленный контейнер', giver: 'Река Быстрянка', desc: 'Нырнуть на стремнине у затопленной баржи за армейским термобоксом.', reward: '3 тушенки, 8 патронов, +15 репутации', isDone: (s) => !!s.questFlags?.river_container_looted },
    { id: 'lq_forest_wolves', category: 'location', title: 'Волчье логово в буреломе', giver: 'Ближний лесок', desc: 'Выследить и одолеть вожака стаи хищников под корнями кедра.', reward: 'Волчий клык (+5 к урону), 2 шкуры, +18 репутации', isDone: (s) => !!s.questFlags?.wolves_defeated },
    { id: 'lq_swamp_brdm', category: 'location', title: 'Останки группы «Север»', giver: 'Гнилая гать (Атарон)', desc: 'Обследовать затонувший БРДМ-2 и вернуть жетоны сержанта Гурова Атарону.', reward: 'Командирский бинокль, 6 патронов, +20 репутации', isDone: (s) => !!s.questFlags?.brdm_reported },
    { id: 'lq_swamp_moss', category: 'location', title: 'Светящийся сфагнум', giver: 'Гнилая гать (Марго)', desc: 'Собрать образцы биолюминесцентного мха в ночную пору.', reward: 'Экстракт «Живая вода», +16 репутации', isDone: (s) => !!s.questFlags?.glowing_moss_reported },
    { id: 'lq_pump_drain', category: 'location', title: 'Дренаж машинного зала', giver: 'Насосная станция №4', desc: 'Открыть заклинивший донный клапан для промывки водовода.', reward: '+1 чистая вода каждое утро бесплатно, +20 репутации', isDone: (s) => !!s.pumpWaterActive },
    { id: 'lq_pump_safe', category: 'location', title: 'Сейф инженера Кузьмина', giver: 'Насосная станция №4', desc: 'Вскрыть несгораемый стальной шкаф начальника станции.', reward: '+2.5 кг к вещмешку, 10 патронов, +20 репутации', isDone: (s) => !!s.questFlags?.safe_reported },
    { id: 'lq_cordon_stove', category: 'location', title: 'Тайник в печи', giver: 'Заброшенный кордон', desc: 'Разобрать кладку дымохода русской печи.', reward: '+2.5 кг к вещмешку, 6 патронов ТОЗ, +16 репутации', isDone: (s) => !!s.questFlags?.stove_searched },
    { id: 'lq_tower_logger', category: 'location', title: 'Самописец аварии', giver: 'Радиовышка', desc: 'Снять блок регистратора параметров радиационного выброса со шпиля.', reward: 'Архив аварии, радиодетали, +25 репутации', isDone: (s) => !!s.questFlags?.logger_extracted },
    { id: 'lq_hunt_boar', category: 'location', title: 'Железный вепрь-секач', giver: 'Охотничьи угодья', desc: 'Одолеть гигантского секача с закостеневшей шкурой.', reward: '4 мяса вепря, 2 толстые шкуры, +24 репутации', isDone: (s) => !!s.questFlags?.boar_defeated },
    { id: 'lq_bunker_bio4', category: 'location', title: 'Спецхран «Био-4»', giver: 'Бункер НИИ «Сфера»', desc: 'Вскрыть криогенный бокс и забрать армейский стимулятор.', reward: '«Стимулятор-М» (+25 энергии), +30 репутации', isDone: (s) => !!s.questFlags?.bio4_cleared },

    // Сюжетные цепочки и персонажи
    { id: 'chain_dog', category: 'story', title: 'Друг тайги — Лайка Буран', giver: 'Лес / Чагрон', desc: 'Спасти раненого щенка из капкана и вырастить боевого компаньона.', reward: 'Верный пёс Буран: +25% урона, утренние подарки', isDone: (s) => !!s.hasDog },
    { id: 'chain_geo', category: 'story', title: 'Геологоразведка «Енисей-3»', giver: 'Марго (Болота)', desc: 'По наводке травницы Марго обследовать триангулятор на скале в лесу и вскрыть скважину №7 геологов.', reward: 'Компас «Енисей»: -5 энергии на все вылазки', isDone: (s) => !!s.hasGeoCompass },
    { id: 'chain_caravan', category: 'story', title: 'Эхо чёрного каравана', giver: 'Река / Атарон', desc: 'Выследить схрон мародёров «Хлыща» и вернуть украденное оружие Атарону.', reward: 'Прицел ТОЗ (+30% крит), 20 патронов, +25 репутации', isDone: (s) => !!s.questFlags?.caravan_completed },
    { id: 'spiridon_line', category: 'npc', title: 'Таёжное знахарство Марго', giver: 'Марго (Болота)', desc: 'Освоить древние рецепты настоек, березового дегтя и целебных трав у Марго.', reward: 'Крафт бальзамов Марго, Дегтярного снадобья и Ока рыси', isDone: (s) => s.sideQuests?.spiridon_mushrooms?.status === 'completed' || s.sideQuests?.margo_mushrooms?.status === 'completed' },
    { id: 'sasha_line', category: 'npc', title: 'Радиопост Стронга', giver: 'Стронг (Вышка)', desc: 'Спасти аналитика Стронга и восстановить радиостанцию на Скалистом утёсе.', reward: 'Ежедневный радиопеленг контейнеров, крафт ДП-5 и фонаря', isDone: (s) => !!s.questFlags?.met_strong || !!s.questFlags?.met_sasha },
    { id: 'varya_fire', category: 'npc', title: 'Огонь и котелок', giver: 'Варя (Полевая кухня)', desc: 'Заготовить сухие дрова и хворост для растопки полевой кухни общины.', reward: 'Таёжная похлёбка, +10 репутации у Вари', isDone: (s) => s.sideQuests?.varya_fire?.status === 'completed' },
    { id: 'varya_filter', category: 'npc', title: 'Чистый исток', giver: 'Варя (Полевая кухня)', desc: 'Собрать уголь и сфагнум для сооружения кухонного гравийного фильтра.', reward: 'Гравийный фильтр Вари: бесплатная очистка воды раз в день', isDone: (s) => s.sideQuests?.varya_filter?.status === 'completed' },
    { id: 'varya_royal_soup', category: 'npc', title: 'Вкус прежнего мира', giver: 'Варя (Полевая кухня, 70+)', desc: 'Сварить настоящий праздничный таёжный борщ по брянскому рецепту для лагеря «Всем ПОХ».', reward: 'Рецепт «Праздничный таёжный борщ», титул Мастера Очага', isDone: (s) => s.sideQuests?.varya_royal_soup?.status === 'completed' },

    // Пересекающиеся цепочки квестов (Союзы жителей)
    { id: 'cross_feast', category: 'cross', title: 'Большой таёжный пир', giver: 'Варя & Чагрон (Реп 50+)', desc: 'Добыть дичь и отборную рыбу, чтобы устроить общелагерный праздник у костра лагеря «Всем ПОХ».', reward: 'Статус «Дух единства» (+5% к энергии), Окорок по-лесному, +25 репутации', isDone: (s) => s.crossQuests?.cross_feast?.status === 'completed' },
    { id: 'cross_autoclave', category: 'cross', title: 'Полевой автоклав и дистиллятор', giver: 'Варя, Боб & Скай (Реп 50+)', desc: 'Собрать из мембраны и металлолома паровой автоклав для кухни и лазарета.', reward: 'Автоклав в лагере: мгновенная дезинфекция и чистая вода, +14 реп каждому', isDone: (s) => s.crossQuests?.cross_autoclave?.status === 'completed' },
    { id: 'cross_balsam', category: 'cross', title: 'Таёжный бальзам долголетия', giver: 'Варя & Марго (Реп 50+)', desc: 'Объединить знания болотной травницы и кулинарные секреты для создания целебного бальзама.', reward: 'Рецепт «Бальзам Вари и Марго» (+60 HP, +50 энергии), +15 реп каждому', isDone: (s) => s.crossQuests?.cross_balsam?.status === 'completed' },
    { id: 'cross_arsenal', category: 'cross', title: 'Штабной перехват: Секретный арсенал', giver: 'Саныч, Стронг, Боб & Атарон (Реп 60+)', desc: 'Расшифровать военную частоту и вскрыть законсервированный спецхран на Кордоне.', reward: '20 патронов, Охотничий прицел ТОЗ, +18 репутации каждому', isDone: (s) => s.crossQuests?.cross_arsenal?.status === 'completed' },

    // Уникальные квесты высокой репутации (70+)
    { id: 'high_sanych_seed', category: 'high_rep', title: 'Короб №42: Семена надежды', giver: 'Саныч (Репутация 80+)', desc: 'Помочь Санычу заложить тепличные грядки лагеря «Всем ПОХ» семенами из легендарного Короба №42.', reward: 'Спецпаёк Основателя, свежие овощи каждое утро, +25 репутации', isDone: (s) => s.highRepQuests?.sanych?.status === 'completed' || !!s.questFlags?.sanych_seeds_given },
    { id: 'high_batya_cache', category: 'high_rep', title: 'Спецрезерв коменданта: Крышечка с якорем', giver: 'Атарон (Репутация 80+)', desc: 'Получить высшее доверие Атарона, доступ к армейскому цинку патронов и памятную крышечку с якорем.', reward: 'Цинк патронов (+15 шт.), тушёнка, антирад и жетон-крышечка', isDone: (s) => s.highRepQuests?.ataron?.status === 'completed' || s.highRepQuests?.batya?.status === 'completed' },
    { id: 'high_anna_vaccine', category: 'high_rep', title: 'Адское варево Ская', giver: 'Николай «Скай» (Репутация 70+)', desc: 'Помочь доктору Скаю создать мощный детоксикационный эликсир против тяжелой лучевой болезни.', reward: '«Адское варево» (-80 Р, +40 HP) и постоянная скидка в лазарете', isDone: (s) => s.highRepQuests?.sky?.status === 'completed' || s.highRepQuests?.anna?.status === 'completed' },
    { id: 'high_prokhor_tuning', category: 'high_rep', title: 'Особая заточка Бобчонка', giver: 'Вова «Боб» (Репутация 70+)', desc: 'Мастерская доводка охотничьего ножа и оружия на горне Боба.', reward: '+10 постоянного урона в боях и скидка на верстаке', isDone: (s) => s.highRepQuests?.bob?.status === 'completed' || s.highRepQuests?.prokhor?.status === 'completed' },
    { id: 'high_egor_whirlpool', category: 'high_rep', title: 'Тайный омут Чагрона', giver: 'Чагрон (Репутация 70+)', desc: 'Освоить секретный омут на Быстрянке для ловли царской рыбы.', reward: 'Шанс поймать Золотистого хариуса (+60 сытости, +10 энергии)', isDone: (s) => s.highRepQuests?.chagron?.status === 'completed' || s.highRepQuests?.egor?.status === 'completed' },
    { id: 'high_spiridon_blessing', category: 'high_rep', title: 'Философия Добра: Трави бобров!', giver: 'Марго (Репутация 70+)', desc: 'Пройти обряд очищения в святилище травницы Марго на Гнилой гати.', reward: 'Бесплатное снятие радиации и отравлений у Марго', isDone: (s) => s.highRepQuests?.margo?.status === 'completed' || s.highRepQuests?.spiridon?.status === 'completed' },
    { id: 'high_sasha_scanner', category: 'high_rep', title: 'Глубокий радиопеленг энтропии', giver: 'Стронг (Репутация 70+)', desc: 'Установить дополнительный каскад ламп в радиостанцию Стронга на вышке.', reward: 'Сканирование 2 тайников в день вместо одного', isDone: (s) => s.highRepQuests?.strong?.status === 'completed' || s.highRepQuests?.sasha?.status === 'completed' },

    // Погодные испытания и сезонные аномалии (Weather Quests)
    {
      id: 'wq_river_flood',
      category: 'weather',
      title: 'Бурный паводок на Быстрянке',
      giver: 'Река Быстрянка (Ливень / Шквалистая буря)',
      desc: 'Из-за бури и ливня река вздулась, топляк грозит разбить причал и уносит рыбацкие снасти. Закрепите мостки и спасите снасти.',
      reward: 'Спасённые снасти, улов хариуса, +10 к репутации Чагрона и Боба, +12 общей репутации',
      weatherReq: ['rain', 'storm'],
      isDone: (s) => !!s.questFlags?.wq_river_flood_done
    },
    {
      id: 'wq_swamp_lights',
      category: 'weather',
      title: 'Блуждающие огни Гнилой гати',
      giver: 'Гнилая гать (Радиоактивный туман / Кислотная морось)',
      desc: 'В едком желтом тумане над торфяниками мерцают фосфоресцирующие огни. Отыщите источник — реликтовый люминесцентный мох для Марго.',
      reward: 'Люминесцентный мох, экстракт, +12 репутации Марго, +12 общей репутации',
      weatherReq: ['fog', 'toxic_rain'],
      isDone: (s) => !!s.questFlags?.wq_swamp_lights_done
    },
    {
      id: 'wq_tower_aurora',
      category: 'weather',
      title: 'Зов ночной авроры',
      giver: 'Радиовышка на утесе (Аномальное сияние)',
      desc: 'Ионизация неба открыла дальний волновод связи. Поднимитесь к мачте вышки и помогите Скаю и Стронгу перехватить аварийный сигнал геологов.',
      reward: 'Координаты схрона геологов, радиодетали, +12 репутации Ская и Стронга, +14 общей репутации',
      weatherReq: ['aurora'],
      isDone: (s) => !!s.questFlags?.wq_tower_aurora_done
    },
    {
      id: 'wq_perimeter_frost',
      category: 'weather',
      title: 'Ледяной капкан на периметре',
      giver: 'Периметр / Дальний кордон (Северные заморозки)',
      desc: 'Мороз сковал механизмы сигнализации, а голодные таёжные волки чуют тепло кухни. Помогите Атарону отогреть датчики и укрепить ледяной вал.',
      reward: 'Волчьи шкуры, мясо, патроны, +12 репутации Атарона, +12 общей репутации',
      weatherReq: ['freeze'],
      isDone: (s) => !!s.questFlags?.wq_perimeter_frost_done
    },
    {
      id: 'wq_peat_fire',
      category: 'weather',
      title: 'Тлеющий торфяник в сушь',
      giver: 'Ближний лесок (Знойное марево)',
      desc: 'В удушливую сушь тлеет пласт торфа у кромки леса. Потушите очаг водой и песком, пока пламя не перекинулось на частокол лагеря.',
      reward: 'Древесный уголь, спасение сектора, +12 репутации Саныча, +12 общей репутации',
      weatherReq: ['heat'],
      isDone: (s) => !!s.questFlags?.wq_peat_fire_done
    }
  ];

  // >>> MODULE: data/quests_main.js (286 строк)
  const MAIN_QUESTS = [
    // Акт I: Прибытие и Выживание (1-5)
    {
      step: 0,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '1. Прибытие в «Всем ПОХ»',
      giver: '🎖️ Саныч (Штаб / Совет Основателей)',
      desc: 'Вы добрались до лагеря выживших «Всем ПОХ». Явитесь к главе лагеря Александру Александровичу (Санычу) в штабе, чтобы встать на довольствие и услышать законы жизни общины.',
      hint: 'Зайдите во вкладку «Лагерь» и поговорите с Санычем в штабе.',
      checklist: (s) => [
        { text: 'Поговорить с Санычем в штабе', done: s.mainQuestStep > 0 || s.questFlags.met_sanych || s.questFlags.met_batya }
      ]
    },
    {
      step: 1,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '2. Первые шаги: Уроки выживания',
      giver: '🎖️ Саныч (Штаб)',
      desc: 'Саныч поручил обойти лагерь: познакомиться с главврачом Николаем Скаем в лазарете и следопытом-снайпером Чагроном на берегу Быстрянки, после чего доложить о готовности.',
      hint: 'Посетите лазарет (Скай) и берег реки (Чагрон), затем вернитесь к Санычу в штаб.',
      checklist: (s) => [
        { text: 'Познакомиться с главврачом Скаем в лазарете', done: s.mainQuestStep > 1 || s.questFlags.met_sky || s.questFlags.met_anna },
        { text: 'Познакомиться со следопытом Чагроном на реке', done: s.mainQuestStep > 1 || s.questFlags.met_chagron || s.questFlags.met_egor },
        { text: 'Доложить Санычу об осмотре лагеря', done: s.mainQuestStep > 1 }
      ]
    },
    {
      step: 2,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '3. Огонь во тьме',
      giver: '🛡️ Атарон (Комендатура периметра)',
      desc: 'Комендант Атарон укрепляет частокол строго под 45 градусов. Ночами к периметру жмутся твари. Соберите в лесу сухостой, скрафтите смоляной факел на верстаке у Боба и покажите Атарону.',
      hint: 'Соберите 3 охапки дров в лесу, скрафтите факел на верстаке и покажите Атарону на посту периметра.',
      checklist: (s) => [
        { text: 'Собрать дрова в лесу (3 шт.)', done: s.mainQuestStep > 2 || getItemCount('firewood') >= 3 || getItemCount('torch') > 0 },
        { text: 'Скрафтить смоляной факел на верстаке', done: s.mainQuestStep > 2 || getItemCount('torch') > 0 },
        { text: 'Доложить Атарону на посту периметра', done: s.mainQuestStep > 2 }
      ]
    },
    {
      step: 3,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '4. Голодный рассвет',
      giver: '🏹 Чагрон (Река Быстрянка)',
      desc: 'Припасы лагеря на исходе. Чагрон готов научить вас рыбному промыслу: скрафтите самодельную удочку, наловите рыбы у реки, сварите уху на костре и угостите молчаливого богатыря.',
      hint: 'Скрафтите удочку на верстаке, поймайте рыбу на реке, сварите уху у костра и поговорите с Чагроном.',
      checklist: (s) => [
        { text: 'Скрафтить самодельную удочку на верстаке', done: s.mainQuestStep > 3 || getItemCount('rod') > 0 },
        { text: 'Поймать рыбу на берегу реки', done: s.mainQuestStep > 3 || (getItemCount('raw_fish') + getItemCount('cooked_fish') + getItemCount('fish_soup')) > 0 },
        { text: 'Приготовить рыбу на костре (уха или жареная рыба)', done: s.mainQuestStep > 3 || (getItemCount('cooked_fish') + getItemCount('fish_soup')) > 0 },
        { text: 'Угостить Чагрона готовой рыбой на реке', done: s.mainQuestStep > 3 }
      ]
    },
    {
      step: 4,
      act: 'Акт I: Прибытие и Выживание',
      actNum: 1,
      title: '5. Крещение тайгой',
      giver: '🛡️ Атарон (Периметр)',
      desc: 'Стая мутировавших псов окружила опушку леса и угрожает сборщикам. Скрафтите охотничье копьё на верстаке, отразите атаку стаи и доложите Атарону.',
      hint: 'Скрафтите копьё на верстаке, отправляйтесь в Лес на опушку, отбейте нападение стаи псов и доложите Атарону.',
      checklist: (s) => [
        { text: 'Скрафтить охотничье копьё на верстаке', done: s.mainQuestStep > 4 || getItemCount('spear') > 0 },
        { text: 'Отразить нападение диких псов на опушке леса', done: s.mainQuestStep > 4 || s.questFlags.dogs_defeated },
        { text: 'Доложить Атарону об успешной зачистке сектора', done: s.mainQuestStep > 4 }
      ]
    },

    // Акт II: Отравленные топи (6-10)
    {
      step: 5,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '6. Мёртвые заводи',
      giver: '🧪 Николай «Скай» (Лазарет)',
      desc: 'Вода в реке приобрела едкий химический оттенок. Токсиколог Николай Скай требует пробу воды на реке для лабораторного экспресс-анализа.',
      hint: 'Спуститесь к реке Быстрянке, наберите пробу токсичной воды и отнесите её Скаю в лазарет.',
      checklist: (s) => [
        { text: 'Набрать пробу токсичной воды у реки', done: s.mainQuestStep > 5 || getItemCount('water_sample') > 0 || s.questFlags.water_sample_given },
        { text: 'Передать пробу доктору Скаю в лазарете', done: s.mainQuestStep > 5 || s.questFlags.water_sample_given }
      ]
    },
    {
      step: 6,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '7. Следы на иле',
      giver: '🏹 Чагрон (Река Быстрянка)',
      desc: 'Чагрон заметил следы странных выдр и ондатр у заводей. Скрафтите капкан на верстаке, взведите его у реки или добудьте шкуру зверя.',
      hint: 'Скрафтите капкан на верстаке, установите его на реке или добудьте шкуру зверя и принесите Чагрону.',
      checklist: (s) => [
        { text: 'Скрафтить капкан на верстаке', done: s.mainQuestStep > 6 || getItemCount('trap') > 0 || s.trapsSet > 0 || getItemCount('leather') > 0 },
        { text: 'Установить капкан на реке или добыть шкуру', done: s.mainQuestStep > 6 || s.trapsSet > 0 || getItemCount('leather') > 0 },
        { text: 'Показать охотничью добычу Чагрону', done: s.mainQuestStep > 6 }
      ]
    },
    {
      step: 7,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '8. Экспедиция в Гнилую гать',
      giver: '🧪 Николай «Скай» (Лазарет)',
      desc: 'Для создания антисептической мази Скаю необходим болотный мох (сфагнум). Отправляйтесь в гиблые торфяники «Гнилая гать» и соберите 3 пучка мха.',
      hint: 'Отправляйтесь в локацию «Гнилая гать», соберите 3 сфагнума и доставьте их в лазарет Скаю.',
      checklist: (s) => [
        { text: 'Разведать болота «Гнилая гать» на карте', done: s.mainQuestStep > 7 || s.questFlags.swamp_explored },
        { text: 'Собрать болотный мох (3 шт.) в топях', done: s.mainQuestStep > 7 || getItemCount('swamp_moss') >= 3 },
        { text: 'Доставить мох Скаю в лазарет', done: s.mainQuestStep > 7 }
      ]
    },
    {
      step: 8,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '9. Прорыв к Насосной станции',
      giver: '🛡️ Атарон (Комендатура)',
      desc: 'Источником заражения протоки стал сбой Насосной станции №4. Проберитесь на станцию, расчистите завал из обломков арматуры и доложите Атарону.',
      hint: 'Отправляйтесь на Насосную станцию №4 на карте, расчистите завал у входа и доложите Атарону.',
      checklist: (s) => [
        { text: 'Добраться до Насосной станции №4 на карте', done: s.mainQuestStep > 8 || s.unlockedLocations.includes('pump') },
        { text: 'Расчистить завал у машинного зала станции', done: s.mainQuestStep > 8 || s.questFlags.pump_cleared },
        { text: 'Доложить Атарону о расчищенном проходе', done: s.mainQuestStep > 8 }
      ]
    },
    {
      step: 9,
      act: 'Акт II: Отравленные топи',
      actNum: 2,
      title: '10. Сердце фильтра',
      giver: '🔧 Боб («Бобчонок») (Мастерская)',
      desc: 'В цехе станции уцелела промышленная керамическая мембрана очистки. Найдите мембрану, соберите 3 металлолома и восстановите центральный водоочиститель у инженера Боба.',
      hint: 'Обыщите Насосную станцию №4, найдите мембрану, соберите 3 металлолома и поговорите с Бобом в мастерской.',
      checklist: (s) => [
        { text: 'Найти керамическую мембрану в цехе станции', done: s.mainQuestStep > 9 || getItemCount('filter_membrane') > 0 || s.questFlags.has_membrane || s.questFlags.pump_repaired },
        { text: 'Собрать металлолом (3 шт.) для крепежа', done: s.mainQuestStep > 9 || getItemCount('scrap') >= 3 || s.questFlags.pump_repaired },
        { text: 'Сдать детали Бобу в мастерскую и запустить фильтр', done: s.mainQuestStep > 9 || s.questFlags.pump_repaired }
      ]
    },

    // Акт III: Голоса из прошлого (11-15)
    {
      step: 10,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '11. Морзе в ночи',
      giver: '🔧 Боб & Стронг',
      desc: 'Инженер Боб уловил обрывки радиопередачи на коротких волнах. Поговорите с ним, возьмите схему ретранслятора и разведайте тропу к старой Радиовышке на Скалистом утёсе.',
      hint: 'Поговорите с Бобом в мастерской лагеря, чтобы нанести Радиовышку на карту.',
      checklist: (s) => [
        { text: 'Получить схему ретранслятора у Боба', done: s.mainQuestStep > 10 || s.questFlags.met_prokhor_radio },
        { text: 'Разведать дорогу к Радиовышке на карте', done: s.mainQuestStep > 10 || s.unlockedLocations.includes('radio') }
      ]
    },
    {
      step: 11,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '12. Эхо на Скалистом утёсе',
      giver: '🛡️ Атарон & Стронг',
      desc: 'Антенна вышки разбита бурей. Соберите 3 металлолома и 2 мотка проволоки, поднимитесь на Скалистый утёс, восстановите радиомачту и перехватите сигнал.',
      hint: 'Соберите металлолом (3 шт.) и проволоку (2 шт.), почините антенну на Радиовышке и доложите Атарону.',
      checklist: (s) => [
        { text: 'Собрать материалы (Металлолом 3 шт., Проволока 2 шт.)', done: s.mainQuestStep > 11 || s.questFlags.radio_repaired || (getItemCount('scrap') >= 3 && getItemCount('wire') >= 2) },
        { text: 'Починить антенную мачту на Радиовышке', done: s.mainQuestStep > 11 || s.questFlags.radio_repaired },
        { text: 'Доложить Атарону и Стронгу о перехваченном сигнале', done: s.mainQuestStep > 11 }
      ]
    },
    {
      step: 12,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '13. Шифр Воронова',
      giver: '🎖️ Саныч (Штаб)',
      desc: 'На радиовышке обнаружена уцелевшая кассета Воронова. Расшифруйте аудиозапись на стареньком магнитофоне у Саныча в штабе, чтобы узнать координаты укрытия учёного.',
      hint: 'Поговорите с Санычем в штабе и прослушайте запись с кассеты Воронова.',
      checklist: (s) => [
        { text: 'Иметь при себе аудиокассету Воронова', done: s.mainQuestStep > 12 || getItemCount('audio_tape') > 0 || s.questFlags.tape_decoded },
        { text: 'Расшифровать запись на магнитофоне у Саныча', done: s.mainQuestStep > 12 || s.questFlags.tape_decoded }
      ]
    },
    {
      step: 13,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '14. Тайна Заброшенного кордона',
      giver: '🎖️ Саныч & Атарон',
      desc: 'Отправляйтесь на Заброшенный кордон лесничества в предгорьях. Отыщите тайник Воронова с полевым дневником и магнитной ключ-картой «Сфера-Допуск».',
      hint: 'Отправляйтесь на Заброшенный кордон на карте, найдите ключ-карту «Сфера» и покажите находки в штабе.',
      checklist: (s) => [
        { text: 'Обыскать Заброшенный кордон на карте', done: s.mainQuestStep > 13 || s.questFlags.cordon_searched },
        { text: 'Найти дневник Воронова и ключ-карту «Сфера»', done: s.mainQuestStep > 13 || getItemCount('keycard_sfera') > 0 },
        { text: 'Показать ключ-карту и дневник в штабе', done: s.mainQuestStep > 13 }
      ]
    },
    {
      step: 14,
      act: 'Акт III: Голоса из прошлого',
      actNum: 3,
      title: '15. Хозяин тайги',
      giver: '🏹 Чагрон & Атарон',
      desc: 'Тропу к научному бункеру терроризирует свирепый медведь-шатун с железными когтями. Расспросите Чагрона о повадках зверя, выследите чудовище в чаще леса и добудьте шкуру.',
      hint: 'Поговорите с Чагроном, вооружитесь патронами/копьём, одолейте медведя в Чаще леса и принесите шкуру Атарону.',
      checklist: (s) => [
        { text: 'Обсудить повадки зверя со следопытом Чагроном', done: s.mainQuestStep > 14 || s.questFlags.talked_bear || s.questFlags.bear_defeated },
        { text: 'Победить медведя-шатуна в чаще леса', done: s.mainQuestStep > 14 || s.questFlags.bear_defeated },
        { text: 'Принести шкуру хозяина тайги Атарону на пост', done: s.mainQuestStep > 14 }
      ]
    },

    // Акт IV: Спуск в Бездну (16-20)
    {
      step: 15,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '16. Доспех сталкера',
      giver: '🔧 Боб («Бобчонок») (Мастерская)',
      desc: 'Внутри бункера автоматические пулемёты и колючая проволока. Инженер Боб готов помочь сшить усиленную сталкерскую куртку из шкуры медведя, ткани и металла.',
      hint: 'Скрафтите бронекостюм сталкера на верстаке у Боба (Шкура медведя, 3 ткани, 2 металлолома) и доложите в штаб.',
      checklist: (s) => [
        { text: 'Собрать материалы для брони (Шкура, 3 ткани, 2 лома)', done: s.mainQuestStep > 15 || getItemCount('stalker_suit') > 0 || s.questFlags.suit_crafted },
        { text: 'Скрафтить куртку сталкера на верстаке у Боба', done: s.mainQuestStep > 15 || getItemCount('stalker_suit') > 0 || s.questFlags.suit_crafted },
        { text: 'Доложить о готовности штурмовой брони', done: s.mainQuestStep > 15 }
      ]
    },
    {
      step: 16,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '17. Дыхание бездны',
      giver: '🧪 Николай «Скай» (Лазарет)',
      desc: 'Вентиляция бункера забита ядовитыми аэрозолями распада. Без надёжного фильтра спуск смертелен. Скрафтите армейский респиратор Р-2 на верстаке и пройдите проверку герметичности у Ская.',
      hint: 'Скрафтите респиратор на верстаке (2 ткани, 2 угля, 1 проволока) и покажите его Скаю в лазарете.',
      checklist: (s) => [
        { text: 'Собрать компоненты (2 ткани, 2 угля, 1 проволока)', done: s.mainQuestStep > 16 || getItemCount('respirator') > 0 || s.questFlags.respirator_crafted },
        { text: 'Скрафтить респиратор Р-2 на верстаке', done: s.mainQuestStep > 16 || getItemCount('respirator') > 0 || s.questFlags.respirator_crafted },
        { text: 'Пройти проверку герметичности у доктора Ская', done: s.mainQuestStep > 16 }
      ]
    },
    {
      step: 17,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '18. Штурм Бункера «Сфера»',
      giver: '🛡️ Атарон (Штаб обороны)',
      desc: 'Экипируйтесь лучшим оружием и патронами. Отправляйтесь к Бункеру «Сфера», откройте бронешлюз ключ-картой Воронова, подавите охранные турели и закрепитесь на объекте.',
      hint: 'Отправляйтесь в Бункер «Сфера» на карте, вскройте шлюз ключ-картой, уничтожьте турели и доложите Атарону.',
      checklist: (s) => [
        { text: 'Открыть гермошлюз Бункера «Сфера» ключ-картой', done: s.mainQuestStep > 17 || s.questFlags.bunker_entered },
        { text: 'Подавить автоматические турели охранного контура', done: s.mainQuestStep > 17 || s.questFlags.turrets_neutralized },
        { text: 'Доложить Атарону о прорыве обороны бункера', done: s.mainQuestStep > 17 }
      ]
    },
    {
      step: 18,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '19. Предотвращение «Каскада-2»',
      giver: '🎖️ Саныч (Совет Основателей)',
      desc: 'Реактор термоядерного распада комплекса выходит на критический режим. Прорвитесь к центральному пульту, заглушите стержни, извлеките дискету с архивами и образец «Нектар-7».',
      hint: 'Спуститесь в Реакторный зал Бункера «Сфера», запустите аварийное глушение, заберите архив и доложите Санычу.',
      checklist: (s) => [
        { text: 'Пробиться к пульту управления аварийного реактора', done: s.mainQuestStep > 18 || s.questFlags.reactor_reached || s.questFlags.reactor_shutdown },
        { text: 'Запустить аварийное глушение реактора', done: s.mainQuestStep > 18 || s.questFlags.reactor_shutdown },
        { text: 'Извлечь дискету с архивом и биостабилизатор «Нектар-7»', done: s.mainQuestStep > 18 || getItemCount('floppy_disk') > 0 },
        { text: 'Доложить Санычу об устранении угрозы взрыва', done: s.mainQuestStep > 18 }
      ]
    },
    {
      step: 19,
      act: 'Акт IV: Спуск в Бездну',
      actNum: 4,
      title: '20. Новый рассвет «Всем ПОХ»',
      giver: '🎖️ Саныч, Атарон & Совет Основателей',
      desc: 'Угроза второго Каскада предотвращена навсегда! Передайте Санычу и Совету научный архив проекта «Каскад», примите участие в триумфальном собрании у костра лагеря «Всем ПОХ».',
      hint: 'Поговорите с Санычем в штабе лагеря, передайте дискету с архивом и отпразднуйте победу!',
      checklist: (s) => [
        { text: 'Передать архивные дискеты Санычу в штабе', done: s.mainQuestStep >= 20 || s.questFlags.bunker_completed },
        { text: 'Принять высшую награду общины и звание «Легенда тайги»', done: s.mainQuestStep >= 20 }
      ]
    }
  ];

  // >>> MODULE: core/state.js (145 строк)
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
      met_sanych: false,
      met_ataron: false,
      met_sky: false,
      met_bob: false,
      met_chagron: false,
      met_varya: false,
      met_margo: false,
      met_strong: false,
      met_batya: false,
      met_anna: false,
      met_egor: false,
      met_prokhor: false,
      sanych_seeds_given: false,
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
    margoBuff: 0,
    lynxEyeBuff: 0,
    pumpWaterActive: false,
    activeStashLocation: null,
    sashaRadioUsedToday: false,
    strongRadioUsedToday: false,
    sideQuests: {},
    dailyQuests: [],
    
    // Индивидуальная репутация у каждого жителя (НПС)
    npcRep: {
      sanych: 15,
      ataron: 15,
      sky: 15,
      bob: 15,
      chagron: 15,
      varya: 15,
      margo: 5,
      strong: 0,
      batya: 15,
      anna: 15,
      prokhor: 15,
      egor: 15,
      spiridon: 5,
      sasha: 0
    },
    varyaStewClaimedDay: -1,
    varyaWaterClaimedDay: -1,
    dogPetClaimedDay: -1,
    crossQuests: {},
    highRepQuests: {},
    npcChatDay: {},

    weather: 'clear',
    statusEffects: {},
    campUpgrades: {
      kennel: false,
      drying_rack: false,
      storage_chest: false,
      rain_collector: false,
      perimeter_alarm: false,
      smokehouse: false
    },
    campStorage: {},
    eventLog: [
      { id: 1, day: 1, time: 0, text: 'Вы очнулись на окраине лагеря «Всем ПОХ». Потрескивает костёр.', category: 'story' }
    ],
    loreNotes: ['note_order'],
    unlockedLocations: ['river', 'forest'],
    introSeen: false
  };

  let state = JSON.parse(JSON.stringify(INITIAL_STATE));

  const TIME_NAMES = ['Утро', 'День', 'Вечер', 'Ночь'];

  // >>> MODULE: core/events.js (53 строк)
  // --- СИСТЕМА ЛОГИРОВАНИЯ И СТАТУСОВ ---
  function logEvent(text, category = 'camp') {
    state.eventLog = state.eventLog || [];
    state.eventLog.unshift({
      id: Date.now() + Math.random(),
      day: Number(state.day) || 1,
      time: Number(state.timeOfDay) || 0,
      text: String(text),
      category: String(category)
    });
    if (state.eventLog.length > 50) state.eventLog.pop();
  }

  function addStatusEffect(id, duration = 4) {
    const def = STATUS_EFFECTS_DEF[id];
    if (!def) return;
    state.statusEffects = state.statusEffects || {};
    state.statusEffects[id] = {
      id: def.id,
      name: def.name,
      icon: def.icon,
      type: def.type,
      desc: def.desc,
      duration: Number(duration) || 4
    };
    logEvent(`Получен статус: ${def.icon} ${def.name} (${duration}х)`, 'status');
    updateHUD();
  }

  function removeStatusEffect(id) {
    if (state.statusEffects && state.statusEffects[id]) {
      const name = state.statusEffects[id].name;
      delete state.statusEffects[id];
      logEvent(`Статус «${name}» снят.`, 'status');
      updateHUD();
    }
  }

  function hasStatusEffect(id) {
    return !!(state.statusEffects && state.statusEffects[id]);
  }


  function getTimeName(time = state?.timeOfDay) {
    const idx = Math.floor(Number(time) || 0) % 4;
    return TIME_NAMES[(idx + 4) % 4] || 'Утро';
  }

  function isNightTime(time = state?.timeOfDay) {
    const idx = Math.floor(Number(time) || 0) % 4;
    return ((idx + 4) % 4) === 3;
  }

  // >>> MODULE: core/audio.js (208 строк)
  // --- АУДИОСИСТЕМА (МУЗЫКА И ЗВУКИ) ---
  const MUSIC_TRACKS = [
    { id: 'fate2', title: 'Fate 2 (Основная тема)', src: 'assets/audio/fate2.mp3' },
    { id: 'track2', title: 'Таёжный мотив (Тема 2)', src: 'assets/audio/track2.mp3' },
    { id: 'track3', title: 'Сумерки «Всем ПОХ» (Тема 3)', src: 'assets/audio/track3.mp3' }
  ];
  let currentTrackIndex = 0;
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
      const savedT = localStorage.getItem('camp_music_track');
      if (savedT !== null) currentTrackIndex = parseInt(savedT, 10) || 0;
      if (currentTrackIndex < 0 || currentTrackIndex >= MUSIC_TRACKS.length) currentTrackIndex = 0;
      const savedSfx = localStorage.getItem('camp_sfx_enabled');
      if (savedSfx !== null) sfxEnabled = (savedSfx === 'true');
    } catch(e) {}

    if (bgMusicEl) {
      bgMusicEl.volume = musicVolume;
      const curSrc = MUSIC_TRACKS[currentTrackIndex].src;
      if (!bgMusicEl.src || !bgMusicEl.src.includes(curSrc)) {
        bgMusicEl.src = curSrc;
      }
      bgMusicEl.onended = () => {
        nextMusicTrack(false);
      };
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

  function nextMusicTrack(notify = true) {
    currentTrackIndex = (currentTrackIndex + 1) % MUSIC_TRACKS.length;
    try {
      localStorage.setItem('camp_music_track', currentTrackIndex);
    } catch(e) {}

    if (bgMusicEl) {
      bgMusicEl.src = MUSIC_TRACKS[currentTrackIndex].src;
      bgMusicEl.volume = musicVolume;
      if (musicEnabled) {
        bgMusicEl.play().catch(() => {});
      }
    }
    updateMusicUI();
    if (notify) {
      toast(`🎵 Играет: ${MUSIC_TRACKS[currentTrackIndex].title}`);
    }
  }

  function toggleMusic() {
    musicEnabled = !musicEnabled;
    try {
      localStorage.setItem('camp_music_enabled', musicEnabled);
    } catch(e) {}

    if (bgMusicEl) {
      if (musicEnabled) {
        const curSrc = MUSIC_TRACKS[currentTrackIndex].src;
        if (!bgMusicEl.src || !bgMusicEl.src.includes(curSrc)) {
          bgMusicEl.src = curSrc;
        }
        bgMusicEl.volume = musicVolume;
        bgMusicEl.play().then(() => {
          toast(`🎵 Играет: ${MUSIC_TRACKS[currentTrackIndex].title}`);
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
      btn.title = musicEnabled 
        ? `Музыка: ${MUSIC_TRACKS[currentTrackIndex].title} (нажмите для паузы)` 
        : 'Музыка выключена (нажмите для включения)';
    }
  }

  // >>> MODULE: core/time.js (170 строк)

  // Переход времени и естественная трата ресурсов с учётом климата
  function passTime(steps = 1, hungerCost = 5, thirstCost = 8) {
    const numSteps = (typeof steps === 'number' && !isNaN(steps)) ? steps : 1;
    state.timeOfDay = (Number(state.timeOfDay) || 0) + numSteps;
    while (state.timeOfDay >= 4) {
      state.timeOfDay -= 4;
      state.day = (Number(state.day) || 1) + 1;
      onNewDay();
    }
    state.timeOfDay = Math.round(state.timeOfDay * 10) / 10;

    const weather = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const effectiveThirstCost = (weather && weather.thirstMod) 
      ? thirstCost * (1 + weather.thirstMod / 100) 
      : thirstCost;

    state.hunger = Math.max(0, state.hunger - hungerCost * numSteps);
    state.thirst = Math.max(0, state.thirst - effectiveThirstCost * numSteps);

    // Обработка активных статусов
    if (state.statusEffects) {
      for (const [id, eff] of Object.entries(state.statusEffects)) {
        if (id === 'well_fed') {
          state.hp = Math.min(100, state.hp + 2 * numSteps);
        } else if (id === 'bleeding') {
          state.hp = Math.max(0, state.hp - 4 * numSteps);
          toast(`🩸 Кровотечение отнимает -${4 * numSteps} HP! Перевяжите рану.`, 'warning');
        } else if (id === 'poisoning') {
          state.hp = Math.max(0, state.hp - 3 * numSteps);
          state.hunger = Math.max(0, state.hunger - 3 * numSteps);
          state.thirst = Math.max(0, state.thirst - 4 * numSteps);
          toast(`🤢 Пищевое отравление истощает тело! Примите берёзовый уголь.`, 'warning');
        } else if (id === 'hypothermia') {
          state.energy = Math.max(0, state.energy - 5 * numSteps);
          state.thirst = Math.max(0, state.thirst - 3 * numSteps);
        }

        eff.duration -= numSteps;
        if (eff.duration <= 0) {
          delete state.statusEffects[id];
          toast(`⏳ Действие статуса «${eff.name}» закончилось.`);
          logEvent(`Действие статуса «${eff.name}» закончилось`, 'status');
        }
      }
    }

    // Урон от истощения или сильной радиации
    if (state.hunger === 0) {
      state.hp = Math.max(0, state.hp - 8 * numSteps);
      toast('⚠️ Вы умираете от голода!');
    }
    if (state.thirst === 0) {
      state.hp = Math.max(0, state.hp - 12 * numSteps);
      toast('⚠️ Обезвоживание отнимает здоровье!');
    }
    if (state.rad >= 70) {
      state.hp = Math.max(0, state.hp - 6 * numSteps);
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
    // Генерация погоды на день (8 таёжных типов)
    const weatherRoll = Math.random();
    let newWeather = 'clear';
    if (weatherRoll < 0.22) newWeather = 'clear';
    else if (weatherRoll < 0.40) newWeather = 'rain';
    else if (weatherRoll < 0.52) newWeather = 'fog';
    else if (weatherRoll < 0.64) newWeather = 'freeze';
    else if (weatherRoll < 0.76) newWeather = 'storm';
    else if (weatherRoll < 0.85) newWeather = 'toxic_rain';
    else if (weatherRoll < 0.93) newWeather = 'heat';
    else newWeather = 'aurora';
    state.weather = newWeather;
    const wInfo = WEATHER_TYPES[newWeather] || WEATHER_TYPES.clear;

    toast(`🌅 Наступил День ${state.day}. Погода: ${wInfo.icon} ${wInfo.name}`);
    logEvent(`🌅 Наступил День ${state.day}. Погода: ${wInfo.icon} ${wInfo.name}. ${wInfo.desc}`, 'camp');

    generateDailyQuestsIfNeeded(true);

    // Проверка охотничьих ловушек
    if (state.trapsSet > 0) {
      let caughtMeat = Math.floor(Math.random() * state.trapsSet * 2) + 1;
      if (newWeather === 'freeze' || newWeather === 'storm') {
        caughtMeat += 1; // Зверь жмётся к теплу
      }
      addItem('raw_meat', caughtMeat);
      addItem('leather', Math.floor(caughtMeat / 2));
      toast(`🏹 В установленные капканы попалась дичь (+${caughtMeat} мяса)!`);
      logEvent(`🏹 В капканы попалась дичь (+${caughtMeat} мяса)`, 'camp');
    }

    // Водозабор с насосной станции
    if (state.pumpWaterActive) {
      addItem('clean_water', 1);
      toast('🚰 Лагерная колонка накачала +1 флягу чистой воды из восстановленной системы станции.');
    }

    // Лагерный навес-водосборник (rain_collector)
    if (state.campUpgrades?.rain_collector) {
      if (newWeather === 'rain' || newWeather === 'storm') {
        addItem('clean_water', 2);
        toast('🪣 Навес-водосборник наполнил +2 фляги чистой дождевой воды!');
        logEvent('🪣 Навес-водосборник собрал +2 фляги чистой дождевой воды', 'camp');
      } else if (newWeather === 'toxic_rain') {
        if (state.crossQuests?.cross_autoclave?.status === 'completed' || state.pumpWaterActive) {
          addItem('clean_water', 2);
          toast('🪣 В кислотную морось навес собрал воду, а лагерный автоклав очистил её (+2 фляги чистой воды)!');
        } else {
          addItem('raw_water', 2);
          toast('☣️ В кислотную морось навес наполнил +2 фляги едкой сырой воды (требуется кипячение)!', 'warning');
        }
      } else if (newWeather === 'fog') {
        addItem('clean_water', 1);
        toast('🌫️ Из плотного тумана навес сконденсировал +1 флягу чистой воды.');
      } else if (newWeather === 'heat') {
        toast('🌡️ В знойное марево навес-водосборник сух.');
      }
    }

    // Лагерная таёжная сушилка (drying_rack)
    if (state.campUpgrades?.drying_rack) {
      const dryLimit = (newWeather === 'heat' || newWeather === 'clear') ? 2 : 1;
      let driedFishCount = 0;
      let driedBerriesCount = 0;

      for (let i = 0; i < dryLimit; i++) {
        if (getItemCount('raw_fish') >= 1) {
          removeItem('raw_fish', 1);
          addItem('dried_fish', 1);
          driedFishCount++;
        } else if (getItemCount('herbs') >= 1) {
          removeItem('herbs', 1);
          addItem('dried_berries', 1);
          driedBerriesCount++;
        }
      }

      if (driedFishCount > 0) {
        toast(`🐟 Таёжная сушилка завялила +${driedFishCount} рыбы!`);
        logEvent(`🐟 Таёжная сушилка завялила +${driedFishCount} рыбы`, 'camp');
      } else if (driedBerriesCount > 0) {
        toast(`🫐 Таёжная сушилка высушила +${driedBerriesCount} порций лесных ягод!`);
        logEvent(`🫐 Таёжная сушилка высушила +${driedBerriesCount} порций лесных ягод`, 'camp');
      }
    }

    // Сброс ежедневного сканирования радиоэфира
    state.sashaRadioUsedToday = false;

    // Подарок от Бурана
    if (state.hasDog && Math.random() < 0.35) {
      const dogGifts = ['raw_meat', 'leather', 'scrap', 'herbs'];
      const gift = dogGifts[Math.floor(Math.random() * dogGifts.length)];
      addItem(gift, 1);
      toast(`🐕 Буран прибежал на рассвете и положил к ногам добычу: ${ITEMS[gift]?.name || gift}!`);
      logEvent(`🐕 Буран принёс в лагерь добычу: ${ITEMS[gift]?.name || gift}`, 'camp');
    }
  }

  // >>> MODULE: ui/hud.js (148 строк)
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
    document.getElementById('hudTime').textContent = `День ${state.day}, ${getTimeName(state.timeOfDay)}`;

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

    // Отображение погоды в HUD
    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const weatherEl = document.getElementById('hudWeather');
    if (weatherEl) {
      weatherEl.textContent = `${wInfo.icon} ${wInfo.name}`;
      weatherEl.title = `Погода: ${wInfo.name}. ${wInfo.desc} (Кликните для метеосводки)`;
    }

    // Бейджи активных статусов под статус-баром
    const pillsContainer = document.getElementById('hudStatusPills');
    if (pillsContainer) {
      const activeEffects = Object.entries(state.statusEffects || {});
      if (activeEffects.length === 0) {
        pillsContainer.style.display = 'none';
        pillsContainer.innerHTML = '';
      } else {
        pillsContainer.style.display = 'flex';
        pillsContainer.innerHTML = activeEffects.map(([id, eff]) => `
          <div class="status-pill-badge ${eff.type}" onclick="Game.openJournal('weather')" title="${eff.name}: ${eff.desc} (Осталось ходов: ${Math.ceil(eff.duration)})">
            <span class="status-pill-icon">${eff.icon}</span>
            <span class="status-pill-name">${eff.name}</span>
            <span class="status-pill-turns">${Math.ceil(eff.duration)}х</span>
          </div>
        `).join('');
      }
    }

    // Подзаголовок лагерного сундука
    const storageSub = document.getElementById('campStorageSubtitle');
    if (storageSub) {
      if (state.campUpgrades?.storage_chest) {
        let storageWeight = 0;
        for (const [id, count] of Object.entries(state.campStorage || {})) {
          if (count > 0 && ITEMS[id]) storageWeight += ITEMS[id].weight * count;
        }
        storageSub.textContent = `Загрузка: ${storageWeight.toFixed(1)} / 100 кг`;
      } else {
        storageSub.textContent = 'Склад (нужно построить)';
      }
    }

    // Динамическая высота HUD для корректного размещения всплывающих тост-уведомлений
    if (typeof document !== 'undefined' && typeof document.querySelector === 'function' && document.documentElement) {
      const hudHeader = document.querySelector('.hud-header');
      if (hudHeader) {
        document.documentElement.style.setProperty('--hud-height', hudHeader.offsetHeight + 'px');
      }
    }

    saveState();
  }

  // Обновляем высоту HUD при изменении размера экрана
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function' && typeof document !== 'undefined' && typeof document.querySelector === 'function') {
    window.addEventListener('resize', () => {
      const hud = document.querySelector('.hud-header');
      if (hud && document.documentElement) {
        document.documentElement.style.setProperty('--hud-height', hud.offsetHeight + 'px');
      }
    });
  }

  // --- БЫСТРЫЕ ДЕЙСТВИЯ ПРИ КЛИКЕ НА ПАРАМЕТРЫ В HUD ---
  function quickDrinkWater() {
    sfx.init();
    sfx.playClick();
    if (getItemCount('clean_water') > 0) {
      if (state.thirst >= 100) {
        toast('💧 Жажда уже полностью утолена (100%)!');
        return;
      }
      useItem('clean_water', false);
      if (typeof renderInventory === 'function') renderInventory();
    } else {
      if (getItemCount('raw_water') > 0) {
        toast('⚠️ Чистая вода закончилась! У вас есть только сырая речная вода — вскипятите её на костре.', 'warning');
      } else {
        toast('⚠️ Нет чистой воды во фляге! Наберите воды в реке и вскипятите на костре.', 'warning');
      }
    }
  }

  function quickRest() {
    sfx.init();
    sfx.playClick();
    restAtCamp();
  }

  function quickUseAntirad() {
    sfx.init();
    sfx.playClick();
    if (getItemCount('antirad') > 0) {
      if (state.rad <= 0 && state.statusEffects?.rad_shield) {
        toast('☢️ Радиационное заражение 0 Р, и радиозащита уже активна!');
        return;
      }
      useItem('antirad', false);
      if (typeof renderInventory === 'function') renderInventory();
    } else {
      if (getItemCount('herbal_tea') > 0) {
        toast('⚠️ Нет препарата «Цистамин»! Но в рюкзаке есть таёжный антирад-отвар.', 'warning');
      } else {
        toast('⚠️ Нет препарата «Цистамин»! Купите у фельдшера Анны или найдите в бункере.', 'warning');
      }
    }
  }

  // >>> MODULE: ui/modals.js (90 строк)
  function showDeathModal() {
    openModal(
      'СМЕРТЬ В ТАЙГЕ',
      'Жизненные показатели на нуле',
      'assets/images/rad_icon.png',
      `<p>Ваше тело не выдержало суровых законов постапокалиптической тайги. Вы погибли от истощения или ран.</p>
       <p>Лагерь «Всем ПОХ» продолжит борьбу за выживание, но уже без вас...</p>`,
      [{ text: 'Начать заново', action: resetGame, primary: true }]
    );
  }


  // --- МОДАЛЬНОЕ ОКНО ---
  function openModal(title, subtitle, avatar, bodyHtml, actions = []) {
    // Гарантируем актуальный расчет высоты верхнего HUD перед открытием модалки
    if (typeof document !== 'undefined' && typeof document.querySelector === 'function' && document.documentElement) {
      const hudHeader = document.querySelector('.hud-header');
      if (hudHeader) {
        document.documentElement.style.setProperty('--hud-height', hudHeader.offsetHeight + 'px');
      }
    }

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalSubtitle').textContent = subtitle;
    document.getElementById('modalAvatar').src = avatar || 'assets/images/cabin.png';
    const bodyEl = document.getElementById('modalBody');
    if (bodyEl) {
      bodyEl.innerHTML = bodyHtml;
      bodyEl.scrollTop = 0; // Всегда сбрасываем скролл на начало текста при открытии
    }

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

  // >>> MODULE: ui/journal_ui.js (109 строк)
  // ==========================================================================
  // ЖУРНАЛ ВЫЖИВШЕГО (ХРОНИКА, АРХИВ ЛОРА, ПОГОДА И СТАТУСЫ)
  // ==========================================================================
  function openJournal(tab = 'log') {
    sfx.init();
    sfx.playClick();

    const weather = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const statusEntries = Object.entries(state.statusEffects || {});
    const logs = state.eventLog || [];
    const notes = state.loreNotes || [];

    let body = `
      <div class="journal-container">
        <!-- Вкладки журнала -->
        <div class="journal-nav">
          <button class="journal-tab-btn ${tab === 'log' ? 'active' : ''}" onclick="Game.openJournal('log')">📝 Хроника (${logs.length})</button>
          <button class="journal-tab-btn ${tab === 'lore' ? 'active' : ''}" onclick="Game.openJournal('lore')">📁 Архив лора (${notes.length})</button>
          <button class="journal-tab-btn ${tab === 'weather' ? 'active' : ''}" onclick="Game.openJournal('weather')">🌤️ Погода и Статусы</button>
        </div>

        <div class="journal-body">
    `;

    if (tab === 'log') {
      body += `
        <div class="journal-log-list">
          ${logs.length === 0 ? '<div style="color:var(--text-dim); text-align:center; padding:20px;">Хроника пока пуста</div>' : ''}
          ${logs.map(l => `
            <div class="journal-log-item ${l.category || ''}">
              <div class="journal-log-meta">
                <span class="journal-log-day">День ${l.day}, ${getTimeName(l.time)}</span>
                <span class="journal-log-cat">${l.category === 'sortie' ? '🗺️ Вылазка' : l.category === 'story' ? '📜 Сюжет' : l.category === 'status' ? '⚡ Статус' : '🏕️ Лагерь'}</span>
              </div>
              <div class="journal-log-text">${l.text}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (tab === 'lore') {
      body += `
        <div class="journal-lore-list">
          ${notes.length === 0 ? '<div style="color:var(--text-dim); text-align:center; padding:20px;">Вы ещё не нашли записок или документов</div>' : ''}
          ${notes.map(noteId => {
            const item = ITEMS[noteId];
            if (!item) return '';
            return `
              <div class="journal-lore-card">
                <div class="journal-lore-header">
                  <img src="${item.icon}" class="journal-lore-icon pixel-art">
                  <div>
                    <h4 class="journal-lore-title">${item.name}</h4>
                    <span class="journal-lore-type">Документ архива</span>
                  </div>
                </div>
                <div class="journal-lore-content">${item.desc}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (tab === 'weather') {
      body += `
        <div class="journal-weather-view">
          <!-- Карточка текущей погоды -->
          <div class="journal-weather-card">
            <div style="font-size:38px; line-height:1; flex-shrink:0;">${weather.icon}</div>
            <div style="flex:1;">
              <h3 style="font-family:'Russo One'; color:var(--accent-gold); margin-bottom:4px;">${weather.name}</h3>
              <p style="font-size:12px; color:var(--text-main); margin-bottom:6px;">${weather.desc}</p>
              <div style="font-size:11px; color:var(--text-dim);">
                ${weather.energyMod ? `Трата сил: <strong style="color:${weather.energyMod > 0 ? '#e74c3c' : 'var(--accent-green)'}">${weather.energyMod > 0 ? '+' : ''}${weather.energyMod}%</strong> | ` : ''}
                ${weather.radMod ? `Радиационный фон: <strong style="color:#c084fc;">+${weather.radMod} Р</strong> | ` : ''}
                Метеосводка обновляется каждое утро на рассвете.
              </div>
            </div>
          </div>

          <!-- Активные баффы и дебаффы -->
          <h4 style="font-family:'Russo One'; color:var(--accent-ember); margin:14px 0 6px 0; font-size:13px;">Текущие статусы выжившего</h4>
          <div class="journal-status-list">
            ${statusEntries.length === 0 ? '<div style="color:var(--text-dim); font-size:12px; padding:10px; background:rgba(0,0,0,0.3); border-radius:6px; border:1px solid var(--border-dim);">Организм в норме. Нет активных баффов или дебаффов.</div>' : ''}
            ${statusEntries.map(([id, eff]) => `
              <div class="journal-status-card ${eff.type}">
                <span style="font-size:24px; flex-shrink:0;">${eff.icon}</span>
                <div style="flex:1;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#fff; font-size:12.5px;">${eff.name} (${eff.type === 'buff' ? 'Бафф' : 'Дебафф'})</strong>
                    <span class="status-duration-badge">Осталось: ${Math.ceil(eff.duration)} ходов</span>
                  </div>
                  <div style="font-size:11px; color:var(--text-main); margin-top:3px;">${eff.desc}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    body += `
        </div>
      </div>
    `;

    openModal('ЖУРНАЛ ВЫЖИВШЕГО', 'Хроника событий, архив лора и метеосводка', 'assets/images/book.png', body, [
      { text: 'Закрыть', action: closeModal }
    ]);
  }

  // >>> MODULE: ui/camp_ui.js (193 строк)
  // ==========================================================================
  // ОБУСТРОЙСТВО ЛАГЕРЯ (БАЗОСТРОЕНИЕ)
  // ==========================================================================
  function openCampUpgrades() {
    sfx.init();
    sfx.playClick();

    let html = `
      <div class="camp-upgrades-modal">
        <p style="font-size:12px; color:var(--text-dim); margin-bottom:12px;">
          Обустройство базы превращает привал в защищённый форпост. Постройки дают постоянные пассивные бонусы лагерю.
        </p>
        <div class="camp-upgrades-grid">
    `;

    for (const [key, upg] of Object.entries(CAMP_UPGRADES)) {
      const isBuilt = !!state.campUpgrades?.[key];
      let canAfford = true;
      const costList = [];
      for (const [matId, reqCount] of Object.entries(upg.cost)) {
        const has = getItemCount(matId);
        if (has < reqCount) canAfford = false;
        const matName = ITEMS[matId]?.name || matId;
        costList.push(`<span style="color:${has >= reqCount ? 'var(--accent-green)' : '#e74c3c'}">${matName}: ${has}/${reqCount}</span>`);
      }

      html += `
        <div class="camp-upg-card ${isBuilt ? 'built' : ''}">
          <div class="camp-upg-header">
            <img src="${upg.icon}" class="camp-upg-icon pixel-art" alt="">
            <div>
              <div class="camp-upg-title">${upg.name}</div>
              <div class="camp-upg-status ${isBuilt ? 'built' : ''}">${isBuilt ? '✅ Построено и функционирует' : '🔨 Доступно для строительства'}</div>
            </div>
          </div>
          <div class="camp-upg-desc">${upg.desc}</div>
          <div class="camp-upg-cost">${costList.join(' • ')}</div>
          <div class="camp-upg-footer">
            ${isBuilt 
              ? `<button class="modal-btn" disabled style="opacity:0.6; cursor:default; min-height:36px; padding:6px 10px;">✔️ Функционирует</button>`
              : `<button class="modal-btn ${canAfford ? 'primary' : ''}" onclick="Game.buildCampUpgrade('${key}')" ${canAfford ? '' : 'disabled'} style="min-height:36px; padding:6px 10px;">
                   ${canAfford ? '🔨 Возвести постройку' : '⚠️ Не хватает материалов'}
                 </button>`
            }
          </div>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;

    openModal('ОБУСТРОЙСТВО ЛАГЕРЯ', 'Инфраструктура базы «Всем ПОХ»', 'assets/images/cabin.png', html, [
      { text: 'Закрыть', action: closeModal }
    ]);
  }

  function buildCampUpgrade(key) {
    const upg = CAMP_UPGRADES[key];
    if (!upg) return;
    state.campUpgrades = state.campUpgrades || {};
    if (state.campUpgrades[key]) {
      toast('Эта постройка уже возведена!');
      return;
    }
    // Проверка ресурсов
    for (const [matId, reqCount] of Object.entries(upg.cost)) {
      if (getItemCount(matId) < reqCount) {
        toast(`Не хватает: ${ITEMS[matId]?.name || matId}!`);
        return;
      }
    }
    // Списание
    for (const [matId, reqCount] of Object.entries(upg.cost)) {
      removeItem(matId, reqCount);
    }
    state.campUpgrades[key] = true;
    if (key === 'kennel') {
      state.questFlags.dog_house_built = true;
      state.hasDog = true;
    }
    sfx.init();
    sfx.playSuccess();
    toast(`🎉 Возведено улучшение: ${upg.name}!`);
    logEvent(`В лагере построено: ${upg.name}`, 'camp');
    saveState();
    updateHUD();
    renderNPCs();
    openCampUpgrades();
  }

  // ==========================================================================
  // СКЛАД ЛАГЕРЯ (СУНДУК)
  // ==========================================================================
  function openCampStorage() {
    if (!state.campUpgrades?.storage_chest) {
      toast('Сначала постройте Лагерный сундук в обустройстве лагеря!', 'warning');
      return;
    }
    sfx.init();
    sfx.playClick();

    state.campStorage = state.campStorage || {};

    let storageWeight = 0;
    for (const [id, count] of Object.entries(state.campStorage)) {
      if (count > 0 && ITEMS[id]) storageWeight += ITEMS[id].weight * count;
    }

    let html = `
      <div class="storage-modal-container">
        <div style="font-size:12px; color:var(--text-dim); margin-bottom:10px;">
          Склад лагеря хранит неограниченно тяжелые припасы. Текущая масса в сундуке: <strong>${storageWeight.toFixed(1)} / 100 кг</strong>.
        </div>

        <div class="storage-columns">
          <!-- Рюкзак -->
          <div class="storage-col">
            <h4 style="font-family:'Russo One'; color:var(--accent-ember); margin-bottom:6px; font-size:12.5px;">🎒 В рюкзаке</h4>
            <div class="storage-item-list">
              ${Object.entries(state.inventory).filter(([id, c]) => c > 0).map(([id, c]) => `
                <div class="storage-item-row">
                  <img src="${ITEMS[id]?.icon}" class="storage-mini-icon pixel-art">
                  <div class="storage-row-info">
                    <span class="storage-row-name">${ITEMS[id]?.name || id}</span>
                    <span class="storage-row-cnt">x${c} (${(ITEMS[id]?.weight * c).toFixed(1)} кг)</span>
                  </div>
                  <button class="storage-transfer-btn" onclick="Game.transferToStorage('${id}', 1)" title="Сложить 1 шт в сундук">➡️</button>
                  ${c >= 5 ? `<button class="storage-transfer-btn all" onclick="Game.transferToStorage('${id}', ${c})" title="Сложить все">Все</button>` : ''}
                </div>
              `).join('') || '<div style="color:var(--text-dim); font-size:11px; padding:10px;">Рюкзак пуст</div>'}
            </div>
          </div>

          <!-- Сундук -->
          <div class="storage-col">
            <h4 style="font-family:'Russo One'; color:var(--accent-gold); margin-bottom:6px; font-size:12.5px;">📦 В сундуке</h4>
            <div class="storage-item-list">
              ${Object.entries(state.campStorage).filter(([id, c]) => c > 0).map(([id, c]) => `
                <div class="storage-item-row">
                  <img src="${ITEMS[id]?.icon}" class="storage-mini-icon pixel-art">
                  <div class="storage-row-info">
                    <span class="storage-row-name">${ITEMS[id]?.name || id}</span>
                    <span class="storage-row-cnt">x${c} (${(ITEMS[id]?.weight * c).toFixed(1)} кг)</span>
                  </div>
                  <button class="storage-transfer-btn" onclick="Game.transferFromStorage('${id}', 1)" title="Забрать 1 шт в рюкзак">⬅️</button>
                  ${c >= 5 ? `<button class="storage-transfer-btn all" onclick="Game.transferFromStorage('${id}', ${c})" title="Забрать все">Все</button>` : ''}
                </div>
              `).join('') || '<div style="color:var(--text-dim); font-size:11px; padding:10px;">Сундук пуст</div>'}
            </div>
          </div>
        </div>
      </div>
    `;

    openModal('ЛАГЕРНЫЙ СУНДУК', 'Хранилище базы «Всем ПОХ»', 'assets/images/food_box.png', html, [
      { text: 'Закрыть', action: closeModal }
    ]);
  }

  function transferToStorage(itemId, count = 1) {
    const has = getItemCount(itemId);
    if (has < 1) return;
    const transferCount = Math.min(has, count);
    removeItem(itemId, transferCount);
    state.campStorage = state.campStorage || {};
    state.campStorage[itemId] = (state.campStorage[itemId] || 0) + transferCount;
    sfx.init();
    sfx.playClick();
    saveState();
    updateHUD();
    renderInventory();
    openCampStorage();
  }

  function transferFromStorage(itemId, count = 1) {
    state.campStorage = state.campStorage || {};
    const inStorage = state.campStorage[itemId] || 0;
    if (inStorage < 1) return;
    const transferCount = Math.min(inStorage, count);
    state.campStorage[itemId] -= transferCount;
    if (state.campStorage[itemId] <= 0) delete state.campStorage[itemId];
    addItem(itemId, transferCount);
    sfx.init();
    sfx.playClick();
    saveState();
    updateHUD();
    renderInventory();
    openCampStorage();
  }

  // >>> MODULE: ui/navigation.js (23 строк)
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

  // >>> MODULE: ui/menu.js (158 строк)
  // --- МЕНЮ СИСТЕМЫ И НАСТРОЕК ---
  function openSystemMenu() {
    sfx.init();
    sfx.playClick();

    const title = '⚙️ МЕНЮ ВЫЖИВАНИЯ';
    const sub = 'Управление игрой и настройками';
    const curTrack = MUSIC_TRACKS[currentTrackIndex] || MUSIC_TRACKS[0];
    let body = `
      <div style="display:flex; flex-direction:column; gap:10px; margin:4px 0;">
        <!-- Секция аудио -->
        <div style="background:rgba(0,0,0,0.35); border:1px solid var(--border-dim); border-radius:6px; padding:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <b style="color:var(--accent-gold); font-size:12.5px;">🎵 Фоновая музыка</b>
            <span style="font-size:10.5px; color:var(--text-dim); font-family:monospace;">${currentTrackIndex + 1} / ${MUSIC_TRACKS.length}</span>
          </div>

          <!-- Название текущего трека -->
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:4px; padding:6px 8px; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:14px;">📻</span>
            <span style="font-size:12px; color:var(--text-main); font-weight:bold; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              ${curTrack.title}
            </span>
          </div>

          <!-- Кнопки управления: Воспроизведение + Переключение на следующий -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-bottom:8px;">
            <button class="modal-btn" style="margin:0; padding:6px 10px; min-height:36px; font-weight:bold; justify-content:center; font-size:12px;" onclick="Game.toggleMusic(); Game.openSystemMenu();">
              ${musicEnabled ? '⏸️ Пауза' : '▶️ Играть'}
            </button>
            <button class="modal-btn" style="margin:0; padding:6px 10px; min-height:36px; font-weight:bold; justify-content:center; font-size:12px;" onclick="Game.nextMusicTrack(); Game.openSystemMenu();" title="Переключить на следующий трек">
              ⏭️ След. трек
            </button>
          </div>

          <div style="margin-top:6px;">
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
          <div>🏕️ <b>Лагерь «Всем ПОХ»</b> v1.3</div>
          <div>👤 Репутация: <b>${state.reputation}</b> (${getReputationTitle(state.reputation)})</div>
          <div>📅 День: <b>${state.day}</b> | Время: <b>${getTimeName(state.timeOfDay)}</b></div>
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
        text: '🖼️ Фоновая атмосфера: выбор фона',
        action: () => showBackgroundPickerModal()
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
      <p>Игра начнётся с чистого листа с Дня 1 у костра лагеря «Всем ПОХ».</p>
    `;
    const actions = [
      {
        text: '💀 Да, удалить всё и начать заново',
        action: () => {
          resetGame();
          toast('🔄 Игра сброшена. Добро пожаловать в лагерь «Всем ПОХ»!');
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

  const BG_THEMES = [
    { id: 'camp', name: '🏕️ Лагерь «Всем ПОХ» (Атмосфера общины)', desc: 'Панорама лагеря выживших с бревенчатыми постройками и костром', preview: 'assets/images/backgrounds/camp_alt.jpg' },
    { id: 'fog', name: '🌲 Таёжный туман (Утренняя мгла)', desc: 'Хвойная глухая тайга, скрытая радиационным туманом', preview: 'assets/images/backgrounds/taiga_fog.jpg' },
    { id: 'winter', name: '❄️ Зимняя тайга (Суровый мороз)', desc: 'Заснеженные сопки и ледяной сибирский бурелом', preview: 'assets/images/backgrounds/taiga_winter.jpg' },
    { id: 'map', name: '🗺️ Топографическая карта Зоны', desc: 'Военная топокарта с изолиниями и секторами катастрофы', preview: 'assets/images/backgrounds/map_topo.jpg' },
    { id: 'none', name: '⬛ Строгий тёмный (Без текстур)', desc: 'Классический минималистичный тёмный интерфейс', preview: '' }
  ];

  function applyBgTheme(themeId) {
    const valid = BG_THEMES.find(t => t.id === themeId) ? themeId : 'camp';
    document.body.setAttribute('data-bg-theme', valid);
    try {
      localStorage.setItem('camp_bg_theme', valid);
    } catch(e) {}
  }

  function showBackgroundPickerModal() {
    const currentTheme = document.body.getAttribute('data-bg-theme') || 'camp';
    const title = '🖼️ АТМОСФЕРНЫЕ ФОНЫ';
    const sub = 'Выбор фонового оформления игры';
    let body = `
      <p style="font-size:12px; color:var(--text-dim); margin-bottom:10px;">
        Выберите фоновую текстуру для погружения в атмосферу края:
      </p>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${BG_THEMES.map(t => `
          <div style="background:${t.id === currentTheme ? 'rgba(255, 190, 34, 0.15)' : 'rgba(0,0,0,0.35)'}; border:1px solid ${t.id === currentTheme ? 'var(--accent-gold)' : 'var(--border-dim)'}; border-radius:6px; padding:8px 10px; cursor:pointer;" onclick="Game.setBgTheme('${t.id}')">
            <div style="display:flex; gap:10px; align-items:center;">
              ${t.preview ? `<img src="${t.preview}" style="width:50px; height:38px; object-fit:cover; border-radius:4px; border:1px solid rgba(255,255,255,0.2); flex-shrink:0;">` : `<div style="width:50px; height:38px; background:#1b201d; border-radius:4px; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0;">⬛</div>`}
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:bold; font-size:12px; color:${t.id === currentTheme ? 'var(--accent-gold)' : 'var(--text-main)'};">${t.name}</span>
                  ${t.id === currentTheme ? '<span style="font-size:11px; color:var(--accent-gold); font-weight:bold;">✓ Выбран</span>' : ''}
                </div>
                <p style="font-size:11px; color:var(--text-dim); margin:2px 0 0;">${t.desc}</p>
              </div>
            </div>
          </div>
        `).join('')}
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

  function setBgTheme(themeId) {
    applyBgTheme(themeId);
    toast('🖼️ Тема оформления обновлена!');
    showBackgroundPickerModal();
  }

  // >>> MODULE: systems/inventory.js (266 строк)
  // --- УПРАВЛЕНИЕ ИНВЕНТАРЕМ ---
  function addItem(itemId, count = 1) {
    if (!ITEMS[itemId]) return;
    state.inventory[itemId] = (state.inventory[itemId] || 0) + count;
    renderInventory();
    renderRecipes();
    renderQuests();
    updateHUD();
    saveState();
    checkSideQuestProgressReminders();
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
    checkSideQuestProgressReminders();
    return true;
  }

  function checkSideQuestProgressReminders() {
    if (!state.sideQuests) return;
    if (state.sideQuests.sq_wood_anna?.status === 'active') {
      if (getItemCount('firewood') >= 4) {
        if (!state.sideQuests.sq_wood_anna.notified) {
          state.sideQuests.sq_wood_anna.notified = true;
          toast('🪵 Дрова для лазарета собраны (4/4)! Сдайте поручение Анне Павловне в лазарете.');
        }
      } else {
        state.sideQuests.sq_wood_anna.notified = false;
      }
    }
    if (state.sideQuests.sq_fish_egor?.status === 'active') {
      if (getItemCount('raw_fish') >= 3 && getItemCount('firewood') >= 2) {
        if (!state.sideQuests.sq_fish_egor.notified) {
          state.sideQuests.sq_fish_egor.notified = true;
          toast('🐟 Улов для коптильни готов (3/3 рыбы, 2/2 дров)! Сдайте поручение Егору Леснику.');
        }
      } else {
        state.sideQuests.sq_fish_egor.notified = false;
      }
    }
    if (state.sideQuests.sq_berries_anna?.status === 'active') {
      if (getItemCount('berries') >= 3) {
        if (!state.sideQuests.sq_berries_anna.notified) {
          state.sideQuests.sq_berries_anna.notified = true;
          toast('🫐 Таёжные ягоды собраны (3/3)! Сдайте бруснику Анне Павловне в лазарете.');
        }
      } else {
        state.sideQuests.sq_berries_anna.notified = false;
      }
    }
    if (state.sideQuests.sq_coal_prokhor?.status === 'active') {
      if (getItemCount('scrap') >= 2) {
        if (!state.sideQuests.sq_coal_prokhor.notified) {
          state.sideQuests.sq_coal_prokhor.notified = true;
          toast('⚙️ Металлолом для горна собран (2/2)! Отнесите его Прохору в лагерь.');
        }
      } else {
        state.sideQuests.sq_coal_prokhor.notified = false;
      }
    }
    if (state.sideQuests.spiridon_mushrooms?.status === 'active') {
      if (getItemCount('amanita') >= 3) {
        if (!state.sideQuests.spiridon_mushrooms.notified) {
          state.sideQuests.spiridon_mushrooms.notified = true;
          toast('🍄 Мухоморы собраны (3/3)! Отнесите их деду Спиридону на болота.');
        }
      } else {
        state.sideQuests.spiridon_mushrooms.notified = false;
      }
    }
  }

  function getItemCount(itemId) {
    return state.inventory[itemId] || 0;
  }

  function useItem(itemId, closeOverlay = true) {
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

      // Обработка баффов и статусов от предметов
      if (itemId === 'spiridon_vodka') {
        addStatusEffect('spiridon_vigor', 4);
        toast('🧪 Огненная «Спиридоновка» обжигает горло! Усталость снята как рукой (+40% энергии, бафф «Тонус»).');
      } else if (itemId === 'tar_salve') {
        state.spiridonBuff = 3;
        removeStatusEffect('bleeding');
        toast('🍯 Дегтярный бальзам заживляет раны (+40 HP) и останавливает кровотечение!');
      } else if (itemId === 'lynx_eye') {
        state.lynxEyeBuff = 4;
        addStatusEffect('lynx_vision', 6);
        toast('👁️ Эликсир «Око рыси»: зрачки расширяются во тьме! Ночные вылазки проходят без штрафов к энергии.');
      } else if (itemId === 'stimulator_m') {
        state.maxEnergy = (state.maxEnergy || 100) + 25;
        state.energy = state.maxEnergy;
        toast('🧬 «Стимулятор-М» введён! Максимальный запас энергии повышен до ' + state.maxEnergy + '%!');
      } else if (itemId === 'hot_tea') {
        removeStatusEffect('hypothermia');
        addStatusEffect('body_warmth', 4);
        toast('☕ Горячий таёжный чай согревает изнутри! Переохлаждение снято.');
      } else if (itemId === 'charcoal') {
        removeStatusEffect('poisoning');
        toast('🖤 Берёзовый уголь впитал яды. Пищевое отравление нейтрализовано!');
      } else if (itemId === 'bandage') {
        removeStatusEffect('bleeding');
        toast('🩹 Стерильный бинт наложен. Кровотечение остановлено.');
      } else if (itemId === 'herbal_salve') {
        removeStatusEffect('bleeding');
        toast('🌿 Целебная мазь затянула рваную рану.');
      } else if (itemId === 'antirad') {
        addStatusEffect('rad_shield', 4);
        toast('💊 Принят Цистамин (-50 Р). Радиозащита активна на 4 хода!');
      } else if (itemId === 'herbal_tea') {
        addStatusEffect('rad_shield', 4);
        toast('🍵 Выпит таёжный антирад-отвар (-25 Р). Радиозащита активна на 4 хода!');
      } else if (itemId === 'clean_water') {
        toast('💧 Вы сделали несколько глотков чистой воды из фляги (+45% жажды).');
      } else if (itemId === 'smoked_meat') {
        addStatusEffect('well_fed', 6);
        toast('🥩 Сытный копчёный окорок дарит сытость и регенерацию на 6 ходов!');
      } else if (['cooked_fish', 'cooked_meat', 'fish_soup', 'canned_food', 'dried_fish'].includes(itemId)) {
        addStatusEffect('well_fed', 4);
        toast('🍲 Сытная горячая трапеза! Получен бафф «Сытость» (+2 HP за ход).');
      } else if (['raw_fish', 'raw_meat', 'raw_water'].includes(itemId)) {
        if (Math.random() < 0.45) {
          addStatusEffect('poisoning', 4);
          toast('🤢 В сырой пище были паразиты! Получен дебафф «Отравление».', 'warning');
        } else {
          toast(`Использовано: ${item.name}`);
        }
      } else {
        toast(`Использовано: ${item.name}`);
      }

      removeItem(itemId, 1);
      updateHUD();
      if (closeOverlay) {
        closeModal();
      }
        } else if (item.type === 'lore') {
      state.loreNotes = state.loreNotes || [];
      if (!state.loreNotes.includes(itemId)) {
        state.loreNotes.push(itemId);
        logEvent(`В архив добавлен документ: ${item.name}`, 'story');
      }
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
        <i>Биохимический концентрат для нейтрализации радиационного фона в почве и грунтовых водах. С ним лагерь «Всем ПОХ» сможет засеять поля и выращивать чистые культуры без риска лучевой болезни.</i>`;
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

  // >>> MODULE: systems/npcs.js (2502 строк)
  // ==========================================================================
  // СИСТЕМА ЖИТЕЛЕЙ ЛАГЕРЯ «ВСЕМ ПОХ»: СОВЕТ ОСНОВАТЕЛЕЙ
  // Саныч, Атарон, Скай, Боб («Бобчонок»), Чагрон («Глыба»), Варя, Марго, Стронг
  // ==========================================================================

  // --- СИСТЕМА ИНДИВИДУАЛЬНОЙ РЕПУТАЦИИ У ЖИТЕЛЕЙ ЛАГЕРЯ ---
  function getNpcRep(npcId) {
    if (!state.npcRep) state.npcRep = {};
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    if (state.npcRep[id] === undefined) {
      const defs = { sanych: 15, ataron: 15, sky: 15, bob: 15, chagron: 15, varya: 15, margo: 5, strong: 0 };
      state.npcRep[id] = defs[id] !== undefined ? defs[id] : 10;
    }
    if (canonicalMap[npcId]) state.npcRep[npcId] = state.npcRep[id];
    return state.npcRep[id];
  }

  function getNpcRepTitle(rep) {
    if (rep < 25) return { title: 'Чужак', level: 1, color: '#9ca3af', icon: '⚪', attitude: '«Присматривается с настороженностью»' };
    if (rep < 50) return { title: 'Знакомый', level: 2, color: 'var(--accent-blue)', icon: '🔵', attitude: '«Считает надёжным и дельным человеком»' };
    if (rep < 80) return { title: 'Доверенный', level: 3, color: 'var(--accent-green)', icon: '🟢', attitude: '«Полное доверие и уважение»' };
    return { title: 'Побратим / Верный друг', level: 4, color: 'var(--accent-gold)', icon: '⭐', attitude: '«Готов стоять спиной к спине в любой беде»' };
  }

  function changeNpcRep(npcId, amount, notify = true) {
    if (!state.npcRep) state.npcRep = {};
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    const current = getNpcRep(id);
    const oldTier = getNpcRepTitle(current);
    const newRep = Math.max(0, current + amount);
    state.npcRep[id] = newRep;
    if (canonicalMap[npcId]) state.npcRep[npcId] = newRep;

    if (notify && amount !== 0) {
      const npcName = NPCS[id]?.name ? NPCS[id].name.split(' ')[0] : id;
      const sign = amount > 0 ? '+' : '';
      toast(`🤝 Репутация (${npcName}): ${sign}${amount} (${oldTier.title} ➔ ${getNpcRepTitle(newRep).title}, ${newRep})`);
    }
    const newTier = getNpcRepTitle(newRep);
    if (oldTier.level !== newTier.level && notify && amount > 0) {
      const npcName = NPCS[id]?.name || id;
      toast(`🎉 ${npcName} теперь считает вас: ${newTier.title}! Открыты новые возможности общины.`);
      sfx.playSuccess();
    }
    saveState();
    updateHUD();
  }

  function renderNpcRepHeader(npcId) {
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    const rep = getNpcRep(id);
    const tier = getNpcRepTitle(rep);
    return `
      <div style="background:rgba(0,0,0,0.35); border:1px solid var(--border-dim); border-left:3px solid ${tier.color}; border-radius:4px; padding:6px 10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:11.5px; color:var(--text-dim);">
          Отношение: <strong style="color:${tier.color};">${tier.icon} ${tier.title} (${rep})</strong>
        </span>
        <span style="font-size:10px; color:${tier.color}; font-style:italic;">
          ${tier.attitude}
        </span>
      </div>
    `;
  }

  // --- ДУШЕВНЫЕ ДИАЛОГИ И ЛАГЕРНЫЕ НОВОСТИ («ПОБОЛТАТЬ») ---
  function openNpcChat(npcId) {
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    const npc = NPCS[id] || NPCS[npcId];
    if (!npc) return;
    const rep = getNpcRep(id);
    const tier = getNpcRepTitle(rep);

    state.npcChatDay = state.npcChatDay || {};
    const chatKey = `${id}_${state.day}`;
    let bonusText = '';
    if (!state.npcChatDay[chatKey]) {
      state.npcChatDay[chatKey] = true;
      changeNpcRep(id, 1, false);
      bonusText = `<div style="color:var(--accent-green); font-size:11px; margin-top:8px;">🤝 ${npc.name.split(' ')[0]} оценил(а) душевную беседу (+1 к личной репутации)!</div>`;
    }

    let chatText = '';
    if (id === 'sanych') {
      if (tier.level >= 3) {
        chatText = `<i>«Вот смотрю я на тебя и душа радуется! "Видишь суслика? И я не вижу. А он есть!" Знаешь, когда мы тут на пустой продуваемой лесопилке начинали, вокруг не было ни души — только стужа, дырявый брезент и тоска. Паникерам и нытикам в тайге места нет! Каждая слеза — это минус сто миллилитров чистой воды из организма! И ведь выстояли! Я даже Короб №42 с семенами помидоров отстоял — весной взойдут красные, сахарные! Красный помидор посреди серой тайги — это ведь не просто еда, это доказательство, что жизнь продолжается, сечешь? Доказать этой проклятой мерзлоте, что мы люди, а не зверьё под корягой. Ты настоящий соратник, на таких наш «Всем ПОХ» и держится. Горжусь тобой!»</i>`;
      } else {
        chatText = `<i>«Здорово, боец! Присаживайся к печурке, хлебни смородинового взвара. Запомни главное: паника убивает быстрее радиации и волчьих клыков. Оптимизм у нас — это не пустые слова, это воинская дисциплина! Собрались, выдохнули и работаем. Если руки из плеч растут и совесть на месте — тайга нас не сломит. Работай на совесть, держись общины, а если тоска подступит — стисни зубы и делай своё дело. Прорвёмся, не впервой!»</i>`;
      }
    } else if (id === 'ataron') {
      if (tier.level >= 3) {
        chatText = `<i>«Вольно. Присядь... Да брось ты вытягиваться, свои люди. Знаешь... я ведь эти склады придумываю, сметы пишу и гвозди считаю не от хорошей жизни. Три тысячи двести семнадцать гвоздей пересчитано за зиму! Ночью в изоляторе сидишь, а внутри пустота воет... Мы души свои в железный лом превратили, чтобы не свихнуться. Но когда я вижу, как частокол стоит ровно под сорок пять градусов, как караулы сменяются по секундомеру и как ты с вылазок целый возвращаешься — я верю, что порядок победит энтропию. На, держи мою редкую пивную крышечку с якорем. Я её только тем отдаю, с кем готов стоять спиной к спине под пулемётом.»</i>`;
      } else {
        chatText = `<i>«Так, боец. Порядок должен быть наглядным! Шаг вправо, шаг влево — считаю попыткой уйти в нирвану! На частоколе угол наклона проверял? Ровно сорок пять градусов, ни минутой больше, иначе напор мутантов его опрокинет. Патроны держи в сухом подсумке, оружие чисти керосином каждый вечер. В тайге расхлябанность карается мгновенно. Будешь соблюдать устав — получишь патроны и уважение. Не будешь — отправлю строем лужи вокруг лагеря ровнять.»</i>`;
      }
    } else if (id === 'sky') {
      if (tier.level >= 3) {
        chatText = `<i>«Огласите весь список жалоб, пожалуйста! А, это ты... Заходи, закрывай гермодверь, не неси сюда сырость. Честно сказать? Я до смерти устал спасать этот чертов мир. То открытый перелом речной водой промывай, то легкие от радиоактивного пепла отскабливай... Я ведь полевой хирург, а не волшебник. Иногда хочется просто пару лет лечить банальный детский насморк в теплом кабинете с белыми занавесками... Но пока ты таскаешь с болот сфагнум, а Боб клепает автоклавы — мы еще потрепыхаемся. Я тут партию "Адского варева" забодяжил — сшибает радиацию на раз, правда, на вкус как жженая резина с полынью. Держись, друг. Ты единственный, чья рожа мне в этом лагере еще не осточертела.»</i>`;
      } else {
        chatText = `<i>«Чего встал в проходе? Если ничего не оторвало и из ушей зеленая слизь не капает — не занимай кушетку! Наука тут проиграла речной воде давным-давно. Будешь пить сырую жижу из Быстрянки — ампутировать желудок придется той же пилой, которой дрова на кухню пилим. Цистамин принимай вовремя, раны заливай спиртом и не строй из себя бессмертного сталкера. Кладбище у нас за сопкой, и расширять его мне лень.»</i>`;
      }
    } else if (id === 'bob') {
      if (tier.level >= 3) {
        chatText = `<i>«Здорово, братуха! Пункт первый: ты вовремя зашел! Пункт второй: я только что настроил охладитель на нашем пивоваренном реакторе из машинки "Малютка" и радиатора от "Жигулей"! Да тише ты, а то Атарон услышит — он же за Сухой закон готов на дыбу вздернуть! А Стронг посчитал, что кружка холодного эля повышает выживаемость личного состава на 89 процентов! Ты для лагеря столько железа перетаскал, что я тебе хоть миниган из водопроводной трубы соберу. Давай, за наше кустарное братство!»</i>`;
      } else {
        chatText = `<i>«Привет! Расклад такой: пункт первый — железа в тайге навалом, но всё ржавое. Пункт второй — верстак требует смазки и свёрл. Пункт третий — ты идёшь всё это искать, потому что тебя не жалко! Найдёшь обрезки труб, нихром или радиодетали — тащи ко мне, я даже из консервной банки обогреватель спаяю. А будешь клювом щёлкать — в тайге быстро на запчасти разберут. Шевели поршнями!»</i>`;
      }
    } else if (id === 'chagron') {
      if (tier.level >= 3) {
        chatText = `<i>«Садись... к огню. Хорошо, что пришел. Я... не люблю темноту. Лес вокруг лагеря молчит, а пустота давит сильнее бетона. Тяжело — это не когда полутонную плиту моста двигаешь. Бетон просто лежит, ему всё равно. Тяжело — это когда на прицеле знакомое лицо, а приказ уже отдан... А здесь люди. Варя на кухне гремит, Боб ругается... тепло. Слышал, девчонка всё про гильзу семь шестьдесят два на пятьдесят четыре выспрашивает? (Чагрон скупо усмехается в густую бороду и отводит взгляд к реке). Хороший калибр. Надежный. Главное — на мосту вовремя палец на спуске держать... Пусть варит суп. Человеку нужно горячее, иначе он звереет. Ты с ней помягче. И сам себя береги.»</i>`;
      } else {
        chatText = `<i>«Здорово. Быстрянка сегодня шумит глухо — к перемене погоды. На воде не зевай: следы на иле видел? Крупная выдра ходит, зубы острые. Нож держи под рукой, патроны береги от сырости. Удочку я тебе помогу наладить, рыба сытость дает долгую. Будет трудно — зови. Я рядом.»</i>`;
      }
    } else if (id === 'margo') {
      if (tier.level >= 3) {
        chatText = `<i>«О, явился, свет очей моих! Смотри, какую я настойку на чабреце и березовом дегте состряпала! Ты знаешь, почему я волосы в фиолетовый крашу? Чтобы этот серый мертвый лес сквозь душу не пророс! А вообще, послушай мою теорию: Добро и Зло. Зло — оно ведь как сорняк, растет само там, где пусто, холодно и темно. Зло думает, что оно хитрее всех, а на деле оно просто одиноко и трусливо! А Добро требует труда! Добро всегда в мозолях и пахнет навозом и хвоей! И Добро должно быть с кулаками! Трави бобров по всей земле! Трави бобров, спасай деревья! Пей взвар, чисти карму и не давай тоске себя сожрать!»</i>`;
      } else {
        chatText = `<i>«Привет, путник с большой земли! В кедах "Два мяча" по болоту ходить — особое искусство, учись, пока я жива! Гнилая гать суеты не терпит: ступишь мимо кочки — болотный газ легкие обожжет. Травы рви с уважением, мухоморы суши на березовой коре. Помни: земля живая, она всё залечит и нас переживёт. Ты главное лишнего у неё не хватай, зла в душе не копи и под ноги гляди.»</i>`;
      }
    } else if (id === 'strong') {
      if (tier.level >= 3) {
        chatText = `<i>«Фиксирую объект. Объект: Человек. Статус: Выживание 99.4%. Знаешь... раньше я вел "Реестр Угасания". Записывал: Объект №08 — Скай, угасание печени; Объект №614 — Забор, гниение досок; Объект №1047 — Сердце Атарона, погребено под слоем бюрократии. А теперь я переименовал его в "Реестр Всходов". Лагерь "Всем ПОХ", существующий в условиях радиоактивной антисанитарии с коэффициентом выживаемости девяносто восемь процентов — это чертовски красивая аномалия! Твой вклад в снижение лагерной энтропии максимален. Радиоприемник настроен. Лови координаты тайников.»</i>`;
      } else {
        chatText = `<i>«Внимание. Радиочастота 3650 кГц нестабильна. Вероятность радиоактивного выброса в течение сорока восьми часов — сорок два процента. Пока вещи учтены и записаны в блокнот — мир удерживается от окончательного распада. Принеси радиодетали, если хочешь, чтобы энтропия не поглотила наш сектор.»</i>`;
      }
    } else if (id === 'varya') {
      if (state.weather === 'freeze') {
        chatText = `<i>«Бр-р-р! Ну и мороз тут у вас в Сибири! В моём родном Брянске тоже зимы бывали лютые, но там хоть вековые дубравы от ветра закрывали, а здесь сквозь сосны стужа до костей продирает. Ты к жаровне ближе садись, погрей пальцы. Я в похлёбку чабреца да брусники бросила — мигом кровь разгонит! Слушай... а у тебя в подсумке патроны не звенят случайно? Какой у тебя калибр? Не семь шестьдесят два?..»</i>`;
      } else if (state.weather === 'rain') {
        chatText = `<i>«Опять ливень хлещет, вода с навеса водопадом льётся! В брянских лесах под таким дождём мы с дедом подосиновики вёдрами таскали, а тут из-за едких туманов лишний раз нос из палатки страшно высунуть. Хорошо хоть в котле ушица закипает. Слушай, пока дождь шумит... ты стреляные гильзы на вылазках не подбирал? Специфические такие, с закраиной у донца? Очень калибр один ищу!»</i>`;
      } else if (tier.level >= 3) {
        chatText = `<i>«Садись, я тебе с самого донышка навар зачерпну, с густым мясом! Знаешь... я ведь до сих пор вздрагиваю по ночам. Когда из Брянска бежала на восток, на старом мосту через Десну нас окружили бандиты. Загнали в тупик, шансов не было совсем... И тут из лесной чащи — хлёсткие, глухие выстрелы! Один, второй, третий... Нападавшие падали как подкошенные, точно в лоб! Я зажмурилась, а когда стрельба стихла — бандиты мертвы, а стрелок растворился в тумане, даже лица не показал. Только стреляные гильзы на мокром асфальте дымились... Он спас мне жизнь. Я ту гильзу на груди ношу как оберег и у каждого бойца калибр выспрашиваю — вдруг это был ты или его сослуживец? Ты для меня уже самым близким человеком во «Всем ПОХ» стал...»</i>`;
      } else {
        chatText = `<i>«Привет! Садись к огоньку, сейчас миску налью. Я Варя, сама из Брянска. Поварскому ремеслу ещё дома училась, так что даже из топора и смолы наваристый суп сбацаю! Главное правило кухни: кто за дровами не ходит — тот за добавкой не тянется. Слушай, а ты с чем в рейды ходишь? Какой калибр у ствола? 5.45? 7.62? А может, тяжёлый винтовочный или гладкоствол?.. Скажи, это ужасно важно!»</i>`;
      }
    }

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const weatherRemark = getNpcWeatherQuote(id, state.weather);
    const weatherHtml = `
      <div style="margin-top:10px; padding:8px 10px; background:rgba(0,0,0,0.25); border-left:3px solid ${wInfo.color || 'var(--accent-gold)'}; border-radius:4px; font-size:12px; color:var(--text-main);">
        <div style="font-size:11px; color:${wInfo.color || 'var(--accent-gold)'}; font-weight:700; margin-bottom:3px;">
          ${wInfo.icon} Мысли о погоде (${wInfo.name}):
        </div>
        <i>${weatherRemark}</i>
      </div>
    `;

    const body = `
      ${renderNpcRepHeader(id)}
      <div style="font-size:12.5px; line-height:1.6; color:var(--text-main); margin-bottom:12px;">
        ${chatText}
      </div>
      ${weatherHtml}
      ${bonusText}
    `;

    openModal(npc.name, `Беседа • ${npc.role}`, npc.avatar, body, [
      { text: '↩️ Вернуться к делам', action: () => talkToNPC(id), primary: true }
    ]);
  }

  // --- ЛАГЕРЬ И НПС ---
  function renderNPCs() {
    const list = document.getElementById('npcList');
    if (!list) return;
    list.innerHTML = '';

    const founderOrder = ['sanych', 'ataron', 'sky', 'bob', 'chagron', 'varya', 'margo', 'strong'];
    founderOrder.forEach(id => {
      const npc = NPCS[id];
      if (!npc) return;

      // Марго видна после обнаружения заимки на болоте
      if (id === 'margo' && !state.questFlags?.met_margo && !state.questFlags?.met_spiridon) return;
      // Стронг виден после спасения на Радиовышке
      if (id === 'strong' && !state.questFlags?.met_strong && !state.questFlags?.met_sasha) return;

      const repVal = getNpcRep(id);
      const repTier = getNpcRepTitle(repVal);

      const card = document.createElement('div');
      card.className = 'npc-card';
      card.innerHTML = `
        <img src="${npc.avatar}" class="npc-avatar pixel-art" alt="">
        <div class="npc-info">
          <div class="npc-header-row">
            <span class="npc-name">${npc.name}</span>
            <span class="npc-role">${npc.role}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin:2px 0 3px;">
            <span class="npc-badge" style="border-color:${repTier.color}; color:${repTier.color}; background:rgba(0,0,0,0.35); font-size:10px; padding:1px 5px;">
              ${repTier.icon} ${repTier.title} (${repVal})
            </span>
          </div>
          <p class="npc-desc">${npc.desc}</p>
        </div>
      `;
      card.onclick = () => talkToNPC(id);
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

    const today = state.day;
    const canPetForEnergy = (state.dogPetClaimedDay !== today);

    if (!canPetForEnergy) {
      body += `<p style="color:var(--accent-green); font-size:11.5px;">✓ Вы уже потрепали Бурана сегодня и зарядились бодростью (+10 энергии). Пёс сыто жмурится и лениво помахивает хвостом.</p>`;
    }

    const actions = [];
    if (canPetForEnergy) {
      actions.push({
        text: '🦴 Потрепать Бурана за ухом (+10 энергии раз в день)',
        action: () => {
          state.dogPetClaimedDay = today;
          state.energy = Math.min(state.maxEnergy || 100, state.energy + 10);
          toast('🐶 Буран довольно жмурится и виляет хвостом (+10 энергии).');
          sfx.playClick();
          updateHUD();
          saveState();
          closeModal();
        },
        primary: true
      });
    } else {
      actions.push({
        text: '🦴 Почесать Бурана за ушком (просто так)',
        action: () => {
          toast('🐶 Буран тихо поскуливает от удовольствия и тычется мокрым носом (энергия восстанавливается 1 раз в сутки).');
          sfx.playClick();
          closeModal();
        }
      });
    }

    if (getItemCount('cooked_meat') > 0 || getItemCount('cooked_fish') > 0) {
      actions.push({
        text: '🥩 Угостить Бурана куском жареной рыбы или мяса',
        action: () => {
          if (getItemCount('cooked_meat') > 0) removeItem('cooked_meat', 1);
          else removeItem('cooked_fish', 1);
          state.reputation += 3;
          toast('🐕 Буран с урчанием проглатывает угощение и благодарно лижет вам пальцы (+3 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          interactWithDog();
        }
      });
    }

    openModal('Буран (Западносибирская лайка)', 'Верный четвероногий друг', 'assets/images/dog.png?v=2.2', body, actions);
  }

  // --- РОУТЕР ДИАЛОГОВ НПС ---
  function talkToNPC(npcId) {
    sfx.init();
    sfx.playClick();
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    const npc = NPCS[id] || NPCS[npcId];
    if (!npc) return;

    // Switch view to Camp tab in case player clicked from Quest tab
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    const campTab = document.getElementById('tabCamp');
    if (campTab) campTab.classList.add('active');
    const navButtons = document.querySelectorAll('.nav-btn');
    if (navButtons[0]) navButtons[0].classList.add('active');

    if (!state.questFlags) state.questFlags = {};
    state.questFlags['met_' + id] = true;
    if (canonicalMap[npcId]) state.questFlags['met_' + npcId] = true;

    if (id === 'sanych') {
      talkSanych();
    } else if (id === 'ataron') {
      talkAtaron();
    } else if (id === 'sky') {
      talkSky();
    } else if (id === 'bob') {
      talkBob();
    } else if (id === 'chagron') {
      talkChagron();
    } else if (id === 'margo') {
      talkMargo();
    } else if (id === 'strong') {
      talkStrong();
    } else if (id === 'varya') {
      talkVarya();
    }
  }

  function checkStarterQuestProgress() {
    const skyDone = state.questFlags.met_sky || state.questFlags.met_anna;
    const chagronDone = state.questFlags.met_chagron || state.questFlags.met_egor;
    if (state.mainQuestStep === 1 && skyDone && chagronDone) {
      toast('⭐ Вы познакомились с жителями лагеря! Вернитесь к Санычу для доклада.');
      sfx.playSuccess();
      renderQuests();
    }
  }

  // ==========================================================================
  // 1. АЛЕКСАНДР АЛЕКСАНДРОВИЧ «САНЫЧ» (ПОЗЫВНОЙ «БЕЛКА»)
  // Глава поселения, верховный дипломат, хранитель семян Короба №42
  // ==========================================================================
  function talkSanych() {
    const npc = NPCS.sanych;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_sanych = true;
    state.questFlags.met_batya = true;

    let body = renderNpcRepHeader('sanych');
    body += `<p>Александр Александрович (Саныч) стоит у деревянного штабного стола. В кружке дымится травяной чай, рядом лежит потёртая карта района и старый кассетник «Весна». В глазах блестит лукавый, неугасимый огонёк.</p>`;
    body += `<p><i>«Ну что, боец! Лагерь "Всем ПОХ" — это не просто привал, это крепость духа. Уныние и сопли здесь вне закона. Кто руки опускает — тот тайге добыча. А кто с улыбкой да с честью пашет — тот хозяин жизни!»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('sanych', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Санычем о делах в лагере и жизни»',
      action: () => openNpcChat('sanych')
    });

    // Квест 1: Стартовый инструктаж (step 0)
    if (state.mainQuestStep === 0) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 1: ПРИБЫТИЕ В «ВСЕМ ПОХ»]:</b></p>`;
      body += `<p><i>«Ты еле живой до нас добрёл. "Видишь суслика? И я не вижу. А он есть!" Вот так и с надеждой: пока живы — победим. Прими закон общины: тунеядцев не держим, работаем все. Держи стартовый сухпай, флягу чистой воды и покажи, на что способен.»</i></p>`;
      actions.push({
        text: '«Я готов служить лагерю. С чего начать, Саныч?»',
        action: () => {
          state.mainQuestStep = 1;
          state.reputation += 6;
          addItem('clean_water', 1);
          addItem('ammo', 3);
          toast('⭐ Задание 1 выполнено: «Прибытие в «Всем ПОХ»» (+6 репутации, фляга воды, 3 патрона)!');
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
      const skyDone = !!(state.questFlags.met_sky || state.questFlags.met_anna);
      const chagronDone = !!(state.questFlags.met_chagron || state.questFlags.met_egor);
      const allDone = skyDone && chagronDone;

      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: ПЕРВЫЕ ШАГИ]:</b></p>`;
      body += `<div style="background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px; margin:8px 0; border:1px solid rgba(255,255,255,0.12);">`;
      body += `<b style="color:var(--accent-gold); font-size:12px;">📋 Задачи осмотра лагеря:</b><br>`;
      body += `• Главврач Николай Скай (лазарет): ${skyDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}<br>`;
      body += `• Следопыт Чагрон (река Быстрянка): ${chagronDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}`;
      body += `</div>`;

      if (allDone) {
        body += `<p style="color:var(--accent-green);"><i>«Скай и Чагрон уже передали, что ты парень хваткий. "Кузьмич, ты что, обиделся? — Нет, я за понимание!" Инструктаж окончен! Теперь иди к коменданту Атарону на периметр — он за безопасность отвечает, у него там всё строго по уставу.»</i></p>`;
        actions.push({
          text: '⭐ «Доложить Санычу об осмотре лагеря (Завершить квест 2)»',
          action: () => {
            state.mainQuestStep = 2;
            state.reputation += 10;
            addItem('ammo', 3);
            toast('⭐ Квест 2 завершён: «Первые шаги» (+10 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        body += `<p><i>«Загляни к Скаю в лазарет — узнай про радиацию и цистамин, и к Чагрону на берег Быстрянки — он покажет, как рыбу ловить и зверя выслеживать.»</i></p>`;
        actions.push({
          text: '«Саныч, я уже осмотрел лагерь и готов к делу!»',
          action: () => {
            state.questFlags.met_sky = true;
            state.questFlags.met_anna = true;
            state.questFlags.met_chagron = true;
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
    // Военные шаги 3-5 курирует Атарон, напоминание от Саныча:
    else if (state.mainQuestStep >= 2 && state.mainQuestStep <= 4) {
      body += `<p style="color:var(--accent-blue);"><i>«Сейчас главная задача — рубежи обороны. Комендант Атарон на посту периметра ждет тебя. Держи частокол строго под 45 градусов, как он требует!»</i></p>`;
      actions.push({
        text: '🛡️ «Иду к Атарону на пост периметра»',
        action: () => {
          closeModal();
          talkAtaron();
        },
        primary: true
      });
    }
    // Квест 13: Шифр Воронова (step 12)
    else if (state.mainQuestStep === 12) {
      const decoded = !!state.questFlags.tape_decoded;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 13: ШИФР ВОРОНОВА]:</b></p>`;
      body += `<p><i>«Ты принёс аудиокассету Воронова с Радиовышки? Давай её сюда, вставляем в наш магнитофон "Весна"! "Ну, за понимание!" Сейчас послушаем, что зашифровал профессор.»</i></p>`;

      if (decoded) {
        body += `<p style="color:var(--accent-green);">✓ Запись Воронова расшифрована! Координаты Заброшенного кордона нанесены на карту!</p>`;
        actions.push({
          text: '⭐ «Обсудить координаты кордона с Санычем (Завершить квест 13)»',
          action: () => {
            state.mainQuestStep = 13;
            state.reputation += 18;
            addItem('ammo', 5);
            if (!state.unlockedLocations.includes('old_cordon')) {
              state.unlockedLocations.push('old_cordon');
            }
            toast('⭐ Квест 13 выполнен: «Шифр Воронова» (+18 репутации, открыт Заброшенный кордон)!');
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
          text: '📻 «Включить магнитофон "Весна" и прослушать кассету»',
          action: () => {
            state.questFlags.tape_decoded = true;
            toast('📻 «...Говорит профессор Воронов. Бункер запечатан. Ключ-карта «Сфера» спрятана на Заброшенном кордоне...»');
            sfx.playSuccess();
            talkSanych();
          },
          primary: true
        });
      }
    }
    // Квест 14: Тайна Заброшенного кордона (step 13)
    else if (state.mainQuestStep === 13) {
      const hasKeycard = getItemCount('keycard_sfera') > 0 || state.questFlags.cordon_searched;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 14: ТАЙНА ЗАБРОШЕННОГО КОРДОНА]:</b></p>`;
      body += `<p><i>«Выдвигайся на Заброшенный кордон лесничества в предгорьях. Воронов оставил там ключ-карту допуска к Бункеру и полевой дневник. Найди их!»</i></p>`;

      if (hasKeycard) {
        body += `<p style="color:var(--accent-green);">✓ Дневник Воронова и ключ-карта «Сфера-Допуск» найдены!</p>`;
        actions.push({
          text: '⭐ «Сдать материалы кордона Санычу (Завершить квест 14)»',
          action: () => {
            state.mainQuestStep = 14;
            state.reputation += 22;
            addItem('ammo', 8);
            if (!state.unlockedLocations.includes('hunting_grounds')) {
              state.unlockedLocations.push('hunting_grounds');
            }
            toast('⭐ Квест 14 выполнен: «Тайна кордона» (+22 репутации, +8 патронов)!');
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
    // Квест 19: Предотвращение Каскада-2 (step 18)
    else if (state.mainQuestStep === 18) {
      const shutdown = !!state.questFlags.reactor_shutdown;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 19: ПРЕДОТВРАЩЕНИЕ «КАСКАДА-2»]:</b></p>`;
      body += `<p><i>«Датчики бункера воют сиреной: реактор перегрет, грядет второй выброс на всю Сибирь! Пробейся в реакторный зал, заглуши стержни и забери научный архив и отвар «Оптимист-7»!»</i></p>`;

      if (shutdown) {
        body += `<p style="color:var(--accent-green);">✓ Реактор заглушен! Архив «Каскад» и капсула «Оптимист-7» спасены!</p>`;
        actions.push({
          text: '⭐ «Доложить Санычу о спасении всей тайги (Завершить квест 19)»',
          action: () => {
            state.mainQuestStep = 19;
            state.reputation += 40;
            toast('⭐ КВЕСТ 19 ВЫПОЛНЕН: «Каскад-2» предотвращён (+40 репутации)!');
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
    // Квест 20: Новый рассвет «Всем ПОХ» (step 19 - Триумф Совета)
    else if (state.mainQuestStep === 19) {
      body += `<p style="color:var(--accent-gold); font-size:14px; font-weight:bold;">🏆 [ФИНАЛ: НОВЫЙ РАССВЕТ «ВСЕМ ПОХ»]:</p>`;
      body += `<p><i>«ДРУЖИЩЕ! ТЫ СДЕЛАЛ ЭТО! "И вновь продолжается бой, и сердцу тревожно в груди!" Ты предотвратил второй взрыв, добыл стабилизатор «Оптимист-7» и сохранил жизнь нашей общины. Совет Основателей в полном сборе салютует тебе!»</i></p>`;
      actions.push({
        text: '🏆 «Принять высшую награду Совета Основателей (Торжественный Финал)»',
        action: () => {
          state.mainQuestStep = 20;
          state.questFlags.bunker_completed = true;
          state.reputation += 50;
          toast('🏆 СЮЖЕТНАЯ САГА «ВСЕМ ПОХ» ЗАВЕРШЕНА! ВЫ — ЛЕГЕНДА ТАЙГИ!');
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
      body += `<p style="color:var(--accent-gold);"><b>[ЛЕГЕНДА ЛАГЕРЯ «ВСЕМ ПОХ»]:</b></p>`;
      body += `<p><i>«Здравствуй, легенда! О твоих рейдах у костра слагают былины. Лагерь процветает, семена всходят. Всем ПОХ на апокалипсис — мы победили!»</i></p>`;
    }

    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ САНЫЧА ---
    // «Чистый глоток» (вода в резерв штаба)
    if (!state.sideQuests?.sq_water_batya?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '💧 «Саныч, нужно пополнить штабной резерв воды? Я помогу»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_water_batya = { status: 'active' };
          toast('📜 Взято поручение: «Чистый глоток» (Вскипятить и сдать 3 фляги воды Санычу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkSanych();
        }
      });
    } else if (state.sideQuests?.sq_water_batya?.status === 'active') {
      const hasWater = getItemCount('clean_water') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ШТАБНОЙ РЕЗЕРВ]:</b> <i>«Ты вскипятил три фляги чистой воды? Если мутанты перережут тропу к реке, лагерь без воды не протянет.»</i></p>`;
      if (hasWater) {
        actions.push({
          text: '💧 «Вот 3 фляги чистой кипячёной воды для штаба, Саныч!»',
          action: () => {
            removeItem('clean_water', 3);
            state.sideQuests.sq_water_batya.status = 'completed';
            addItem('ammo', 3);
            state.reputation += 10;
            changeNpcRep('sanych', 5);
            toast('⭐ Поручение выполнено: «Чистый глоток» (+10 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkSanych();
          },
          primary: true
        });
      }
    }

    // Уникальный квест высокой репутации (80+): Короб №42: Семена надежды
    const sanychRep = getNpcRep('sanych');
    if (sanychRep >= 80 && !state.highRepQuests?.sanych?.status && !state.questFlags?.sanych_seeds_given) {
      actions.push({
        text: '🌱 «Саныч, расскажи про легендарный Короб №42 с семенами!» (Репутация 80+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.sanych = { status: 'completed' };
          state.questFlags.sanych_seeds_given = true;
          addItem('ammo', 20);
          addItem('canned_food', 3);
          addItem('antirad', 2);
          addItem('army_ration_box', 1);
          changeNpcRep('sanych', 10);
          state.reputation += 25;
          toast('🌱 КОРОБ №42 ОТКРЫТ! Саныч заложил парники лагеря «Всем ПОХ» (+20 патронов, 3 тушёнки, 2 цистамина, спецпаёк, +25 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkSanych();
        }
      });
    }

    body += `<p style="font-size:11px; color:var(--text-dim); margin-top:10px;">Репутация в лагере: ${getReputationTitle(state.reputation)} (${state.reputation} очков)</p>`;
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 2. АНДРЕЙ «АТАРОН»
  // Комендант периметра и безопасности, фанатик устава и коллекционер пивных крышечек
  // ==========================================================================
  function talkAtaron() {
    const npc = NPCS.ataron;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_ataron = true;
    state.questFlags.met_batya = true;

    let body = renderNpcRepHeader('ataron');
    body += `<p>Андрей Атарон стоит на караульной вышке у главных ворот лагеря. За плечом висит верный АК-74, на поясе — связка коллекционных пивных крышечек и секундомер. Взгляд цепкий, сканирующий сектор до последнего куста.</p>`;
    body += `<p><i>«Так, боец. Порядок должен быть наглядным! Угол наклона частокола у меня выверен строго под сорок пять градусов — ни градусом больше. Оружие чистить каждый вечер, патроны беречь. В тайге только дисциплина отделяет нас от превращения в корм.»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('ataron', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Атароном об обороне и порядке»',
      action: () => openNpcChat('ataron')
    });

    // Квест 3: Огонь во тьме (step 2)
    if (state.mainQuestStep === 2) {
      const hasTorch = getItemCount('torch') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 3: ОГОНЬ ВО ТЬМЕ]:</b></p>`;
      body += `<p><i>«Ночами к частоколу лезет всякая мерзость. Нам нужны факелы для ночных дозоров. Собери в лесу 3 охапки сушняка, свяжи смоляной факел на верстаке у Боба и покажи мне. За отличную службу выдам особую крышечку строгой отчетности!»</i></p>`;

      if (hasTorch) {
        body += `<p style="color:var(--accent-green);">✓ У вас есть смоляной факел!</p>`;
        actions.push({
          text: '⭐ «Сдать смоляной факел Атарону (Завершить квест 3)»',
          action: () => {
            removeItem('torch', 1);
            state.mainQuestStep = 3;
            state.reputation += 10;
            changeNpcRep('ataron', 5);
            addItem('ammo', 3);
            toast('⭐ Квест 3 выполнен: «Огонь во тьме» (+10 репутации, +3 патрона, жетон-крышечка Атарона)!');
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
    // Квест 5: Крещение тайгой (step 4)
    else if (state.mainQuestStep === 4) {
      const dogsDead = !!state.questFlags.dogs_defeated;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 5: КРЕЩЕНИЕ ТАЙГОЙ]:</b></p>`;
      body += `<p><i>«Боевая тревога! Стая мутировавших псов окружила сектор учета №3 на опушке леса. Смастери охотничье копьё на верстаке у Боба, зачисти сектор и доложи о расходе боеприпасов!»</i></p>`;

      if (dogsDead) {
        body += `<p style="color:var(--accent-green);">✓ Стая диких псов разбита! Сектор чист!</p>`;
        actions.push({
          text: '⭐ «Доложить Атарону о зачистке сектора (Завершить квест 5)»',
          action: () => {
            state.mainQuestStep = 5;
            state.reputation += 15;
            changeNpcRep('ataron', 8);
            addItem('ammo', 4);
            if (!state.unlockedLocations.includes('swamp')) {
              state.unlockedLocations.push('swamp');
            }
            toast('⭐ Квест 5 выполнен: «Крещение тайгой» (+15 репутации, ранг «Свой», открыты Болота)!');
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
    // Квест 9: Прорыв к Насосной станции (step 8)
    else if (state.mainQuestStep === 8) {
      const cleared = !!state.questFlags.pump_cleared;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 9: ПРОРЫВ К НАСОСНОЙ СТАНЦИИ]:</b></p>`;
      body += `<p><i>«Разведка доносит: на Насосной станции №4 завал из арматуры перекрыл проход к машинному залу. Выдвигайся на станцию, расчисти завал и обеспечь коридор для инженеров!»</i></p>`;

      if (cleared) {
        body += `<p style="color:var(--accent-green);">✓ Завал у цеха Насосной станции №4 расчищен!</p>`;
        actions.push({
          text: '⭐ «Доложить Атарону о расчищенном коридоре (Завершить квест 9)»',
          action: () => {
            state.mainQuestStep = 9;
            state.reputation += 20;
            changeNpcRep('ataron', 9);
            addItem('ammo', 5);
            toast('⭐ Квест 9 выполнен: «Прорыв к Насосной» (+20 репутации, +5 патронов)!');
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
    // Квест 12: Эхо на Скалистом утёсе (step 11)
    else if (state.mainQuestStep === 11) {
      const radioOk = !!state.questFlags.radio_repaired;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 12: ЭХО НА СКАЛИСТОМ УТЁСЕ]:</b></p>`;
      body += `<p><i>«Возьми 3 металлолома и 2 проволоки. Поднимись на Скалистый утёс, восстанови радиомачту и прикрой радиста Стронга. Мы должны установить радиоконтроль над сектором!»</i></p>`;

      if (radioOk) {
        body += `<p style="color:var(--accent-green);">✓ Антенна на Радиовышке восстановлена! Сигнал взят под контроль!</p>`;
        actions.push({
          text: '⭐ «Доложить Атарону о восстановлении связи (Завершить квест 12)»',
          action: () => {
            state.mainQuestStep = 12;
            state.reputation += 20;
            changeNpcRep('ataron', 8);
            addItem('ammo', 5);
            if (getItemCount('audio_tape') === 0) addItem('audio_tape', 1);
            toast('⭐ Квест 12 выполнен: «Эхо на Скалистом утёсе» (+20 репутации, кассета Воронова)!');
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
          text: '📡 «Выдвигаюсь к Радиовышке на Скалистый утёс»',
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
    // Квест 15: Хозяин тайги (step 14)
    else if (state.mainQuestStep === 14) {
      const bearDead = !!state.questFlags.bear_defeated || getItemCount('bear_pelt') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 15: ХОЗЯИН ТАЙГИ]:</b></p>`;
      body += `<p><i>«Медведь-шатун с железными когтями заблокировал ущелье. Чагрон подскажет его уязвимые места. Ликвидируй угрозу — и получишь штатное боевое ружьё ТОЗ-34!»</i></p>`;

      if (bearDead) {
        body += `<p style="color:var(--accent-green);">✓ Хозяин тайги повержен! Трофейная шкура у вас!</p>`;
        actions.push({
          text: '⭐ «Сдать шкуру медведя Атарону и получить ружьё ТОЗ-34 (Завершить квест 15)»',
          action: () => {
            state.mainQuestStep = 15;
            state.reputation += 30;
            changeNpcRep('ataron', 12);
            if (getItemCount('toz') === 0) addItem('toz', 1);
            addItem('ammo', 10);
            toast('⭐ КВЕСТ 15 ВЫПОЛНЕН: «Хозяин тайги» (+30 репутации, ружьё ТОЗ-34, 10 патронов)!');
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
          text: '🏹 «Иду к Чагрону за охотничьим планом»',
          action: () => {
            closeModal();
            talkChagron();
          },
          primary: true
        });
      }
    }
    // Квест 18: Штурм Бункера (step 17)
    else if (state.mainQuestStep === 17) {
      const turretsDead = !!state.questFlags.turrets_neutralized;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 18: ШТУРМ БУНКЕРА «СФЕРА»]:</b></p>`;
      body += `<p><i>«Боевой приказ: снаряди ТОЗ-34, надень респиратор Р-2, примени ключ-карту «Сфера» и подави автоматические турели охраны в гермоблоке Бункера!»</i></p>`;

      if (turretsDead) {
        body += `<p style="color:var(--accent-green);">✓ Гермоблок вскрыт, охранный периметр турелей смят!</p>`;
        actions.push({
          text: '⭐ «Доложить Атарону о прорыве обороны Бункера (Завершить квест 18)»',
          action: () => {
            state.mainQuestStep = 18;
            state.reputation += 25;
            changeNpcRep('ataron', 10);
            addItem('ammo', 10);
            toast('⭐ Квест 18 выполнен: «Штурм Бункера» (+25 репутации, +10 патронов)!');
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

    // «Ночной дозор»
    if (!state.sideQuests?.sq_watch_batya?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '🏮 «Атарон, готов заступить в ночной караул на вышке»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_watch_batya = { status: 'active' };
          toast('📜 Взято поручение: «Ночной дозор» (Заступить на вышку в фазу Ночи с факелом)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkAtaron();
        }
      });
    } else if (state.sideQuests?.sq_watch_batya?.status === 'active') {
      const isNight = isNightTime(state.timeOfDay);
      const hasTorch = getItemCount('torch') > 0 || getItemCount('electric_torch') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[НОЧНОЙ ДОЗОР]:</b> <i>«В темноте твари жмутся к частоколу. Бери факел и заступай на вышку у ворот, проверяй углы наклона забора.»</i></p>`;
      if (isNight && hasTorch) {
        actions.push({
          text: '🏮 «Отстоять ночную смену на смотровой вышке до рассвета»',
          action: () => {
            state.sideQuests.sq_watch_batya.status = 'completed';
            passTime(1);
            addItem('ammo', 4);
            addItem('canned_food', 1);
            state.reputation += 12;
            changeNpcRep('ataron', 5);
            toast('⭐ Ночной караул сдан! Атарон одобрительно кивнул (+12 репутации, 4 патрона, тушенка)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkAtaron();
          },
          primary: true
        });
      }
    }

    // Жетоны разведгруппы «Север» (сержанта Гурова)
    if (state.questFlags.brdm_searched && !state.questFlags.brdm_reported) {
      actions.push({
        text: '🎖️ «Атарон... я нашёл в трясине БРДМ-2. Вот жетоны сержанта Гурова...»',
        action: () => {
          state.questFlags.brdm_reported = true;
          addItem('ammo', 6);
          state.reputation += 20;
          changeNpcRep('ataron', 10);
          toast('⭐ Жетоны группы «Север» переданы Атарону (+20 репутации, командирский бинокль, 6 патронов)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAtaron();
        },
        primary: true
      });
    }

    // Финал «Эхо чёрного каравана»
    if (state.questFlags.caravan_cache_found && !state.questFlags.caravan_completed) {
      actions.push({
        text: '🏴‍☠️ «Атарон, схрон банды «Хлыща» уничтожен! Вот оружие мародёров»',
        action: () => {
          state.questFlags.caravan_completed = true;
          addItem('ammo', 12);
          state.reputation += 25;
          changeNpcRep('ataron', 10);
          toast('🏆 Схрон каравана ликвидирован! Порядок восстановлен (+25 репутации, 12 патронов)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAtaron();
        },
        primary: true
      });
    }

    // Квест высокой репутации (80+): Спецрезерв коменданта: Крышечка с якорем
    const ataronRep = getNpcRep('ataron');
    if (ataronRep >= 80 && !state.highRepQuests?.ataron?.status && !state.highRepQuests?.batya?.status) {
      actions.push({
        text: '🎖️ «Атарон, на какую поддержку арсенала я могу рассчитывать?» (Репутация 80+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.ataron = { status: 'completed' };
          state.highRepQuests.batya = { status: 'completed' };
          addItem('ammo', 15);
          addItem('canned_food', 2);
          addItem('antirad', 1);
          addItem('army_ration_box', 1);
          changeNpcRep('ataron', 8);
          toast('⭐ Атарон открыл армейский спецрезерв коменданта (+15 патронов, 2 тушёнки, цистамин, жетон с якорем)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAtaron();
        }
      });
    }

    // Союзный квест: Штабной перехват: Секретный арсенал (Саныч, Атарон, Стронг, Боб - реп 60+)
    const strongRep = getNpcRep('strong');
    const bobRep = getNpcRep('bob');
    if (ataronRep >= 60 && strongRep >= 60 && bobRep >= 60 && !state.crossQuests?.cross_arsenal?.status) {
      actions.push({
        text: '📻 «Атарон, Стронг перехватил военный шифр, а Боб готов вскрыть спецхран!»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_arsenal = { status: 'completed' };
          addItem('ammo', 20);
          addItem('army_ration_box', 1);
          changeNpcRep('ataron', 10);
          changeNpcRep('strong', 10);
          changeNpcRep('bob', 10);
          changeNpcRep('sanych', 10);
          state.reputation += 25;
          toast('🏆 СЕКРЕТНЫЙ АРСЕНАЛ ВСКРЫТ! Офицерский спецхран передан общине (+20 патронов, спецпаёк, +10 репутации соратникам)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAtaron();
        }
      });
    }

    body += `<p style="font-size:11px; color:var(--text-dim); margin-top:10px;">Дисциплина периметра: ${ataronRep >= 80 ? '⭐ Безупречная' : ataronRep >= 50 ? '🟢 Образцовая' : '⚪ Требует проверки'}</p>`;
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 3. НИКОЛАЙ «СКАЙ»
  // Главный врач, токсиколог, полевой хирург с черным юмором
  // ==========================================================================
  function talkSky() {
    const npc = NPCS.sky;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_sky = true;
    state.questFlags.met_anna = true;

    let body = renderNpcRepHeader('sky');
    body += `<p>В лазарете пахнет медицинским спиртом, йодом и сушеной полынью. Николай Скай хмуро протирает хирургический зажим марлей, потягивая остывший чай.</p>`;
    body += `<p><i>«Огласите весь список жалоб, пожалуйста! Если ничего не оторвало — дышите глубже. Главное в этой тайге — не пить сырую речную воду и не ловить галлюцинации от светящихся поганок. Наука проиграла реке, но пока я жив — от радиации я вас отскребу.»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('sky', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать со Скаем о лазарете и медицине»',
      action: () => openNpcChat('sky')
    });

    // Квест 2
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: УРОКИ ВЫЖИВАНИЯ]:</b> Скай скептически осматривает вас: <i>«Саныч предупредил, что ты новенький. Живой пока? Это временно, если голову в радиоактивные ямы совать будешь. Но раз дошел — будем знакомы.»</i></p>`;
      actions.push({
        text: '«Саныч велел познакомиться с лазаретом. Рад встрече, доктор Скай!»',
        action: () => {
          state.questFlags.met_sky = true;
          state.questFlags.met_anna = true;
          toast('⭐ Знакомство с главврачом Скаем зачтено!');
          sfx.playSuccess();
          checkStarterQuestProgress();
          talkSky();
        },
        primary: true
      });
    }

    // Квест 6: Мёртвые заводи (step 5)
    if (state.mainQuestStep === 5) {
      const hasSample = getItemCount('water_sample') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 6: МЁРТВЫЕ ЗАВОДИ]:</b></p>`;
      body += `<p><i>«Вода в Быстрянке пошла с желто-зеленой пеной и вонью кислотного электролита. Если люди этой жижи хлебнут — мне придется им кишки той же пилой пилить, которой дрова заготавливаем. Набери пробу в колбу у реки и тащи сюда!»</i></p>`;
      if (hasSample) {
        actions.push({
          text: '🧪 «Передать пробу токсичной воды Скаю (Завершить квест 6)»',
          action: () => {
            removeItem('water_sample', 1);
            state.questFlags.water_sample_given = true;
            state.mainQuestStep = 6;
            state.reputation += 12;
            changeNpcRep('sky', 6);
            addItem('antirad', 1);
            toast('⭐ Квест 6 выполнен: «Мёртвые заводи» (+12 репутации, цистамин)!');
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
          text: '🌊 «Выдвигаюсь на реку Быстрянку за пробой воды»',
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
      body += `<p><i>«Бинты стерильные на исходе. При гангрене мне останется только цинично разводить руками. В Гнилой гати растет болотный сфагнум — природный антисептик с йодом. Нарви 2 пучка в топях!»</i></p>`;
      if (mossCount >= 2) {
        actions.push({
          text: '🌿 «Передать болотный сфагнум Скаю (Завершить квест 8)»',
          action: () => {
            removeItem('swamp_moss', 2);
            state.mainQuestStep = 8;
            state.reputation += 18;
            changeNpcRep('sky', 8);
            addItem('herbal_salve', 2);
            toast('⭐ Квест 8 выполнен: «Экспедиция в Гнилую гать» (+18 репутации, 2 целебные мази)!');
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
      body += `<p><i>«В вентиляционных стволах Бункера скопился аэрозоль «Каскад-Б». Без армейского респиратора Р-2 легкие превратятся в кашу за три минуты. Скрафти респиратор на верстаке у Боба и покажи мне на проверку герметичности!»</i></p>`;
      if (hasResp) {
        actions.push({
          text: '😷 «Пройти проверку респиратора Р-2 у Ская (Завершить квест 17)»',
          action: () => {
            state.questFlags.respirator_crafted = true;
            state.mainQuestStep = 17;
            state.reputation += 18;
            changeNpcRep('sky', 9);
            addItem('antirad', 2);
            if (!state.unlockedLocations.includes('bunker')) {
              state.unlockedLocations.push('bunker');
            }
            toast('⭐ Квест 17 выполнен: «Дыхание бездны» (+18 репутации, открыт Бункер)!');
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

    // Стандартные медицинские услуги лазарета
    actions.push(
      {
        text: '🩹 Перевязать раны на месте (Восстановить HP до 100 за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            state.hp = 100;
            toast('Скай зашил раны и наложил антисептическую повязку (+100% HP)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSky();
          } else {
            toast('Недостаточно патронов (нужно 2 шт.)');
          }
        }
      },
      {
        text: '🩹 Купить стерильный бинт с собой (за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            addItem('bandage', 1);
            toast('Куплен стерильный бинт');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSky();
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
            toast('Куплен цистамин (препарат антирадиационной защиты)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSky();
          } else {
            toast('Недостаточно патронов (нужно 3 шт.)');
          }
        }
      },
      {
        text: '🌿 Сдать 3 пучка трав в лазарет (+5 репутации, +1 патрон)',
        action: () => {
          if (getItemCount('herbs') >= 3) {
            removeItem('herbs', 3);
            addItem('ammo', 1);
            state.reputation += 5;
            changeNpcRep('sky', 3);
            toast('Скай принял сушеные травы для фармакопеи (+5 репутации, +1 патрон)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSky();
          } else {
            toast('Нужно минимум 3 пучка трав для лазарета.');
          }
        }
      }
    );

    // Ежедневное поручение: Аптечный сбор
    const dailyHerbs = (state.dailyQuests || []).find(q => q.id === 'daily_herbs' && !q.completed && q.current >= q.goal);
    if (dailyHerbs) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: АПТЕЧНЫЙ СБОР]:</b> <i>«Полынь и целебные травы... Именно то, что нужно лазарету. Повязки дозорным менять, раны прижигать. Держи патроны из нашего фонда.»</i></p>`;
      actions.push({
        text: `🌿 «Сдать целебные травы Скаю (+${dailyHerbs.rewardRep} реп, +${dailyHerbs.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_herbs');
          talkSky();
        },
        primary: true
      });
    }

    // Поручение: Дрова для лазарета
    if (!state.sideQuests?.sq_wood_anna?.status && state.mainQuestStep >= 1) {
      actions.push({
        text: '🪵 «Скай, дрова для буржуйки лазарета нужны?» (Поручение)',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_wood_anna = { status: 'active' };
          toast('📜 Взято поручение: «Дрова для лазарета» (Собрать 4 охапки сухих дров)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkSky();
        }
      });
    } else if (state.sideQuests?.sq_wood_anna?.status === 'active') {
      const hasWood = getItemCount('firewood') >= 4;
      body += `<p style="color:var(--accent-gold);"><b>[ДРОВА ДЛЯ ЛАЗАРЕТА]:</b> <i>«Без сухих поленьев вагончик выстынет, а в холоде раны не заживают. Принёс 4 охапки?»</i></p>`;
      if (hasWood) {
        actions.push({
          text: '🪵 «Вот 4 охапки сухих дров для печки лазарета»',
          action: () => {
            removeItem('firewood', 4);
            state.sideQuests.sq_wood_anna.status = 'completed';
            addItem('bandage', 2);
            state.reputation += 8;
            changeNpcRep('sky', 5);
            toast('⭐ Поручение выполнено: «Дрова для лазарета» (+8 репутации, 2 бинта)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkSky();
          },
          primary: true
        });
      }
    }

    // Уникальный квест высокой репутации (70+): Адское варево Ская
    const skyRep = getNpcRep('sky');
    if (skyRep >= 70 && !state.highRepQuests?.sky?.status && !state.highRepQuests?.anna?.status) {
      actions.push({
        text: '🧪 «Скай, давай создадим твой легендарный детоксикатор!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.sky = { status: 'completed' };
          state.highRepQuests.anna = { status: 'completed' };
          addItem('antirad', 3);
          addItem('alcohol', 2);
          changeNpcRep('sky', 10);
          state.reputation += 22;
          toast('⭐ АДСКОЕ ВАРЕВО СКАЯ СОЗДАНО! Получено 3 цистамина, 2 спирта (+10 репутации Ская, +22 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkSky();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 4. ВОВА «БОБ» («БОБЧОНОК»)
  // Главный инженер, кузнец и механик кустарных технологий («Пункт первый...»)
  // ==========================================================================
  function talkBob() {
    const npc = NPCS.bob;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_bob = true;
    state.questFlags.met_prokhor = true;

    let body = renderNpcRepHeader('bob');
    body += `<p>Вова Боб («Бобчонок») орудует напильником над куском швеллера. Под ногами гора стружки, шестеренок и медных трубок. Из-под верстака доносится тихое бульканье самодельного пивоваренного аппарата из машинки «Малютка».</p>`;
    body += `<p><i>«Здорово! Расклад такой: пункт первый — подходи к верстаку, делай капканы, факелы и инструменты. Пункт второй — найдешь металлолом, проволоку или нихром — тащи сюда, перекуем! Пункт третий — порядок превыше всего, закон Архимеда не обманешь!»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('bob', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Бобом об инженерных чудесах»',
      action: () => openNpcChat('bob')
    });

    // Квест 3: Совет по факелу
    if (state.mainQuestStep === 2) {
      body += `<p style="color:var(--accent-gold);"><b>[СОВЕТ ИНЖЕНЕРА]:</b> <i>«Атарон требует факел? Пункт первый: возьми 1 сухое полено и 1 проволоку. Пункт второй: на верстаке свяжи смоляной факел за полминуты!»</i></p>`;
    }

    // Квест 10: Сборка гидроузла насосной (step 9)
    if (state.mainQuestStep === 9) {
      const hasMembrane = getItemCount('filter_membrane') > 0 || state.questFlags.has_membrane;
      const scrapCount = getItemCount('scrap');
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 10: СЕРДЦЕ ФИЛЬТРА]:</b> <i>«Принёс керамическую мембрану и 3 куска лома со станции? Давай сюда, перепаяем штуцера и пустим чистую воду в лагерь!»</i></p>`;
      if (hasMembrane && scrapCount >= 3) {
        actions.push({
          text: '🔧 «Смонтировать водоочистной узел вместе с Бобом»',
          action: () => {
            if (getItemCount('filter_membrane') > 0) removeItem('filter_membrane', 1);
            removeItem('scrap', 3);
            state.questFlags.pump_repaired = true;
            toast('Станция запущена! Чистая вода пошла в баки лагеря!');
            sfx.playSuccess();
            talkBob();
          },
          primary: true
        });
      }
    }

    // Квест 11: Морзе в ночи (step 10)
    if (state.mainQuestStep === 10) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 11: МОРЗЕ В НОЧИ]:</b></p>`;
      body += `<p><i>«Слушай сюда: пункт первый — в 03:00 наш приемник поймал сигнал SOS на частоте 142.5 МГц! Пункт второй — держи схему ретранслятора, нужно подниматься на Радиовышку на Скалистый утёс!»</i></p>`;
      actions.push({
        text: '📜 «Взять схему ретранслятора у Боба и разведать Радиовышку»',
        action: () => {
          state.questFlags.met_prokhor_radio = true;
          state.mainQuestStep = 11;
          state.reputation += 14;
          changeNpcRep('bob', 6);
          if (!state.unlockedLocations.includes('radio_tower')) {
            state.unlockedLocations.push('radio_tower');
          }
          toast('⭐ Квест 11 выполнен: «Морзе в ночи» (+14 репутации, открыта Радиовышка)!');
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

    // Квест 16: Доспех сталкера (step 15)
    if (state.mainQuestStep === 15) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 16: ДОСПЕХ СТАЛКЕРА]:</b></p>`;
      body += `<p><i>«Шкура Хозяина тайги у тебя? На верстаке из неё, 3 металлолома и 2 проволок сошьем настоящую броню сталкера! Она и от пуль турелей защитит, и рюкзак расширит!»</i></p>`;
    }

    // Стандартные услуги мастерской Боба
    actions.push(
      {
        text: '🔨 Починить стальной капкан (за 1 металлолом)',
        action: () => {
          if (getItemCount('scrap') >= 1) {
            removeItem('scrap', 1);
            addItem('trap', 1);
            toast('Боб выправил пружины капкана');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkBob();
          } else {
            toast('Нужен 1 металлолом.');
          }
        }
      },
      {
        text: '⚙️ Купить сталистую проволоку (за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('wire', 1);
            toast('Куплен моток проволоки');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkBob();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      },
      {
        text: '🔩 Купить металлолом (2 шт. за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('scrap', 2);
            toast('Куплено 2 ед. металлолома у Боба');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkBob();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      },
      {
        text: '🔩 Сдать 3 металлолома в мастерскую (+5 репутации, +1 патрон)',
        action: () => {
          if (getItemCount('scrap') >= 3) {
            removeItem('scrap', 3);
            addItem('ammo', 1);
            state.reputation += 5;
            changeNpcRep('bob', 3);
            toast('Боб принял металлолом для ковки (+5 репутации, +1 патрон)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkBob();
          } else {
            toast('Нужно минимум 3 металлолома.');
          }
        }
      }
    );

    // Ежедневное поручение: Дрова для костра
    const dailyWood = (state.dailyQuests || []).find(q => q.id === 'daily_wood' && !q.completed && q.current >= q.goal);
    if (dailyWood) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: ДРОВА ДЛЯ ГОРНА]:</b> <i>«Сухие поленья для кузнечного горна... Отлично! Без жара металл не куётся. Получи довольствие.»</i></p>`;
      actions.push({
        text: `🌲 «Сдать поленья для кузницы Бобу (+${dailyWood.rewardRep} реп, +${dailyWood.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_wood');
          talkBob();
        },
        primary: true
      });
    }

    // Поручение: Уголь для горна
    if (!state.sideQuests?.sq_coal_prokhor?.status && state.mainQuestStep >= 1) {
      actions.push({
        text: '⚙️ «Боб, металл для горна нужен?» (Поручение)',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_coal_prokhor = { status: 'active' };
          toast('📜 Взято поручение: «Уголь для горна» (Принести 2 металлолома)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkBob();
        }
      });
    } else if (state.sideQuests?.sq_coal_prokhor?.status === 'active') {
      const hasScrap = getItemCount('scrap') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[УГОЛЬ И ЛОМ ДЛЯ ГОРНА]:</b> <i>«Принёс 2 металлолома? Мне скобы для ворот отковать надо.»</i></p>`;
      if (hasScrap) {
        actions.push({
          text: '⚙️ «Вот 2 металлолома для кузнечного горна»',
          action: () => {
            removeItem('scrap', 2);
            state.sideQuests.sq_coal_prokhor.status = 'completed';
            addItem('wire', 3);
            addItem('ammo', 2);
            state.reputation += 10;
            changeNpcRep('bob', 5);
            toast('⭐ Поручение выполнено: «Уголь для горна» (+10 репутации, 3 проволоки, 2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkBob();
          },
          primary: true
        });
      }
    }

    // Уникальный квест высокой репутации (70+): Особая заточка Бобчонка
    const bobRep = getNpcRep('bob');
    if (bobRep >= 70 && !state.highRepQuests?.bob?.status && !state.highRepQuests?.prokhor?.status) {
      actions.push({
        text: '🔪 «Боб, сделай особую доводку лезвий и ствола!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.bob = { status: 'completed' };
          state.highRepQuests.prokhor = { status: 'completed' };
          addItem('ammo', 15);
          addItem('wire', 4);
          changeNpcRep('bob', 10);
          state.reputation += 22;
          toast('⭐ ОСОБАЯ ЗАТОЧКА БОБЧОНКА ВЫПОЛНЕНА! (+10 постоянного урона в боях, +15 патронов, 4 проволоки, +10 реп Бобу, +22 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkBob();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 5. ЧАГРОН («ГЛЫБА»)
  // Богатырь-снайпер, таёжный следопыт, тайный спаситель Вари
  // ==========================================================================
  function talkChagron() {
    const npc = NPCS.chagron;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_chagron = true;
    state.questFlags.met_egor = true;

    let body = renderNpcRepHeader('chagron');
    body += `<p>Двухметровый богатырь Чагрон сидит на прибрежном бревне у Быстрянки. Его ладони-лопаты бережно чистят карабин Мосина с оптикой. Рядом плещутся рыболовные верши и висят плетёные силки.</p>`;
    body += `<p><i>«Тайга... тишину любит. Суета людей губит. У реки сядь, дыхание переведи. Червей накопай, удочку забрось — река накормит. А в чащу пойдешь — гляди в оба: волчьи следы свежие были.»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('chagron', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Посидеть у костра с Чагроном и послушать тайгу»',
      action: () => openNpcChat('chagron')
    });

    // Квест 2
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: УРОКИ ВЫЖИВАНИЯ]:</b> Чагрон поднимает тяжелый взгляд: <i>«Саныч говорил про тебя. Держись реки. Учись ловить рыбу, слушать лес — выживешь.»</i></p>`;
      actions.push({
        text: '«Саныч велел перенять таёжный опыт. Рад знакомству, Чагрон!»',
        action: () => {
          state.questFlags.met_chagron = true;
          state.questFlags.met_egor = true;
          toast('⭐ Знакомство со следопытом Чагроном зачтено!');
          sfx.playSuccess();
          checkStarterQuestProgress();
          talkChagron();
        },
        primary: true
      });
    }

    // Квест 4: Голодный рассвет (step 3)
    if (state.mainQuestStep === 3) {
      const hasFishMeal = getItemCount('fish_soup') > 0 || getItemCount('cooked_fish') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 4: ГОЛОДНЫЙ РАССВЕТ]:</b></p>`;
      body += `<p><i>«Люди в лагере голодные. Скрафти удочку на верстаке у Боба, вылови хариуса в Быстрянке и свари уху на костре. Угостишь меня... и Варе миску занеси. Ей силы нужны.»</i></p>`;
      if (hasFishMeal) {
        actions.push({
          text: '🍲 «Угостить Чагрона свежей таёжной ухой (Завершить квест 4)»',
          action: () => {
            if (getItemCount('fish_soup') > 0) removeItem('fish_soup', 1);
            else removeItem('cooked_fish', 1);
            state.mainQuestStep = 4;
            state.reputation += 12;
            changeNpcRep('chagron', 6);
            addItem('ammo', 2);
            toast('⭐ Квест 4 выполнен: «Голодный рассвет» (+12 репутации, +2 патрона)!');
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
      body += `<p><i>«У отмели трехпалые следы. Выдра-переросток. Сколоти капкан у Боба, взведи у коряжника и добудь шкуру. Тайга уважает терпеливых.»</i></p>`;
      if (hasLeather) {
        actions.push({
          text: '🐾 «Показать шкуру зверя Чагрону (Завершить квест 7)»',
          action: () => {
            state.mainQuestStep = 7;
            state.reputation += 15;
            changeNpcRep('chagron', 8);
            addItem('ammo', 3);
            toast('⭐ Квест 7 выполнен: «Следы на иле» (+15 репутации, +3 патрона)!');
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
      body += `<p><i>«Шатун... не просто зверь. В нем злость и железо. В лоб не стреляй — рикошетит. Бей копьём под лопатку или жди, когда на дыбы встанет. Вернись живым.»</i></p>`;
      actions.push({
        text: '🏹 «Принять охотничий совет Чагрона по Шатуну»',
        action: () => {
          state.questFlags.talked_bear = true;
          toast('Вы узнали уязвимые места Хозяина тайги от снайпера!');
          sfx.playSuccess();
          talkChagron();
        },
        primary: true
      });
    }

    // Стартовая наживка (бесплатно 1 раз)
    if (!state.questFlags.egor_starter_worms) {
      actions.push({
        text: '🪱 Взять стартовую наживку (3 червя бесплатно от Чагрона)',
        action: () => {
          state.questFlags.egor_starter_worms = true;
          addItem('worms', 3);
          toast('Чагрон отсыпал 3 червя: «Держи. Рыбу поймай — горячего поешь. Одному в тайге нельзя.»');
          sfx.playSuccess();
          saveState();
          talkChagron();
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
            toast('Куплена банка червей для рыбалки.');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkChagron();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      });
    }

    // Сдача рыбы в общий котёл
    actions.push({
      text: '🐟 Сдать 2 сырые рыбы в общий котёл (+5 репутации, +1 патрон)',
      action: () => {
        if (getItemCount('raw_fish') >= 2) {
          removeItem('raw_fish', 2);
          addItem('ammo', 1);
          state.reputation += 5;
          changeNpcRep('chagron', 3);
          toast('Чагрон принял улов в общий котёл (+5 репутации, +1 патрон)');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkChagron();
        } else {
          toast('Нужно минимум 2 сырые рыбы для общего котла.');
        }
      }
    });

    // Разговор о калибре 7.62x54R и Варе
    actions.push({
      text: '🎯 «Чагрон, а какой калибр у твоего карабина? Варя всё время спрашивает...»',
      action: () => {
        openModal(
          'Чагрон о винтовке и Варе',
          'Снайпер лагеря • Тайна моста через Десну',
          'assets/images/npc_def_male.png',
          `<p>Чагрон неспешно протирает затвор ветошью. На вороненой стали блестит клеймо Ижевского завода.</p>
           <p><i>«Семь шестьдесят два на пятьдесят четыре. Трёхлинейка Мосина. Винтовочный патрон с закраиной. Надежный... пуля рельс пробивает.»</i></p>
           <p>Великан на мгновение замолкает, глядя на дым над полевой кухней, где хлопочет молодая девушка. Едва заметная тёплая улыбка трогает его губы в седой бороде.</p>
           <p><i>«Под Брянском на мосту через Десну... бандиты загнали беженцев в тупик. Стрелять пришлось с восьмисот метров, сквозь туман. Бандиты попадали, а девчонка... испугалась, но выжила. Ты ей гильзы не подсовывай пустые зря. Пусть варит суп. Человеку нужно горячее, иначе он звереет. А за суп — спасибо ей скажи.»</i></p>`,
          [{ text: '«Понял тебя, Чагрон. Твоя тайна останется со мной.»', action: () => { closeModal(); talkChagron(); }, primary: true }]
        );
      }
    });

    // Ежедневное поручение: Рыбный день
    const dailyFish = (state.dailyQuests || []).find(q => q.id === 'daily_fish' && !q.completed && q.current >= q.goal);
    if (dailyFish) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: РЫБНЫЙ ДЕНЬ]:</b> <i>«Рыба свежая... блестит. Молодец. Варя котел поставила, община сыта будет. На патроны.»</i></p>`;
      actions.push({
        text: `🐟 «Сдать улов Чагрону (+${dailyFish.rewardRep} реп, +${dailyFish.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_fish');
          talkChagron();
        },
        primary: true
      });
    }

    // Уникальный квест высокой репутации (70+): Тайный омут Чагрона
    const chagronRep = getNpcRep('chagron');
    if (chagronRep >= 70 && !state.highRepQuests?.chagron?.status && !state.highRepQuests?.egor?.status) {
      actions.push({
        text: '🎣 «Чагрон, покажи тайный омут на Быстрянке!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.chagron = { status: 'completed' };
          state.highRepQuests.egor = { status: 'completed' };
          addItem('ammo', 15);
          addItem('worms', 10);
          changeNpcRep('chagron', 10);
          state.reputation += 22;
          toast('⭐ ТАЙНЫЙ ОМУТ ЧАГРОНА ОТКРЫТ! Шанс выловить Золотистого хариуса (+15 патронов, 10 червей, +10 реп Чагрону, +22 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkChagron();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 6. МАРГО (МАРЬЯ МОРЕВНА)
  // Лесная травница Пустоши, фиолетовые волосы, кеды «Два мяча», «Трави бобров!»
  // ==========================================================================
  function talkMargo() {
    const npc = NPCS.margo;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_margo = true;
    state.questFlags.met_spiridon = true;

    let body = renderNpcRepHeader('margo');
    body += `<p>Марго сидит на лавке у бревенчатой стены своей заимки в Гнилой гати. Фиолетовые волосы собраны в озорной хвост, на ногах — культовые кеды «Два мяча», на плечах — синяя олимпийка. Вокруг сохнут пучки чабреца, березового дегтя и шляпки мухоморов.</p>`;
    body += `<p><i>«Привет, путник! Слышу по шагам — сквозь топь продирался. В тайге суета — враг номер один! Сядь у огня, отдышись. Земля живая, всё залечит, если сердце не гнилое. А вообще помни: Добро должно быть с кулаками! Трави бобров, спасай деревья!»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('margo', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Марго о Добре, Зле и болотах»',
      action: () => openNpcChat('margo')
    });

    // Обучение зельеварению: Ведьмин гриб
    if (state.sideQuests?.spiridon_mushrooms?.status === 'active' || state.sideQuests?.margo_mushrooms?.status === 'active') {
      const hasMushrooms = getItemCount('amanita') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ЗНАХАРСКИЙ СБОР]:</b> <i>«Набрал три ядрёных мухомора в лесу? Они под старыми березами прячутся.»</i></p>`;
      if (hasMushrooms) {
        actions.push({
          text: '🍄 «Вот 3 красных мухомора, Марго (Сдать сбор)»',
          action: () => {
            removeItem('amanita', 3);
            if (!state.sideQuests) state.sideQuests = {};
            state.sideQuests.spiridon_mushrooms = { status: 'completed' };
            state.sideQuests.margo_mushrooms = { status: 'completed' };
            addItem('spiridon_vodka', 2);
            state.reputation += 16;
            changeNpcRep('margo', 9);
            toast('⭐ Марго сварила партию таёжной настойки (+2 флакона, +16 репутации, +9 Марго)! Рецепты открыты для костра.');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkMargo();
          },
          primary: true
        });
      }
    } else if (!state.sideQuests?.spiridon_mushrooms?.status && !state.sideQuests?.margo_mushrooms?.status) {
      actions.push({
        text: '🍄 «Марго, научи меня варить таёжную настойку бодрости!»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.spiridon_mushrooms = { status: 'active' };
          state.sideQuests.margo_mushrooms = { status: 'active' };
          toast('📜 Взято задание: «Ведьмин гриб» (Собрать 3 мухомора в лесу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkMargo();
        },
        primary: true
      });
    }

    // Геологоразведка «Енисей-3» (триангулятор на скале)
    if (!state.questFlags.geo1_done) {
      body += `<p style="color:var(--accent-gold);"><b>[ТАЙНА ТРИАНГУЛЯТОРА НА СОПКЕ]:</b> <i>«Ты в Ближнем лесу на скалу над сосняком глядел? Туда геологи лазали — триангуляцию ставили. Скважину №7 бурили у Быстрянки, что-то аномальное доставали. На треноге на вершине скалы тубус с картами пластов до сих пор прикручен. Поднимись, глянь тубус!»</i></p>`;
      actions.push({
        text: '📍 «Марго, расскажи про партию геологов и скалу с триангулятором»',
        action: () => {
          state.questFlags.spiridon_told_geo = true;
          toast('📍 Марго отметила скалу с триангулятором в Ближнем лесу!');
          sfx.playClick();
          saveState();
          renderQuests();
          openModal(
            'Марго о геологах «Енисей-3»',
            'Заимка травницы • Тайны болот',
            'assets/images/npc_default_woman.png',
            `<p><i>«Слушай сюда! За пару лет до Каскада на вездеходах понаехали буровики из партии «Енисей-3». На сопке в лесу дюралевую треногу вбили, а в пойме Быстрянки шурф глубокий забурили — скважину номер семь. Говорили, гравитация там шалит и стрелка компаса кругом ходит!»</i></p>
             <p><i>«Когда рвануло, они всё побросали. А тубус с картами пластов так на скале и остался. С твоей армейской ловкостью снять его — раз плюнуть! А по карте и саму скважину у реки найдешь.»</i></p>`,
            [{ text: '«Спасибо за наводку, Марго. Поднимусь на скалу.»', action: () => { closeModal(); talkMargo(); }, primary: true }]
          );
        }
      });
    }

    // Рецепты зелий Марго
    if (state.sideQuests?.spiridon_mushrooms?.status === 'completed' || state.sideQuests?.margo_mushrooms?.status === 'completed') {
      body += `<p style="color:var(--accent-green); font-size:12px;"><b>[ТАЙНЫ ПУСТОШИ]:</b> <i>«Теперь ты посвящен в таёжное знахарство. Можешь варить снадобья у меня или на костре в лагере.»</i></p>`;
      actions.push(
        {
          text: '🧪 Сварить «Бальзам Марго» (1 мухомор, 1 спирт, 1 чистая вода)',
          action: () => {
            if (getItemCount('amanita') >= 1 && getItemCount('alcohol') >= 1 && getItemCount('clean_water') >= 1) {
              removeItem('amanita', 1);
              removeItem('alcohol', 1);
              removeItem('clean_water', 1);
              addItem('spiridon_vodka', 1);
              toast('🧪 Сварен ядрёный Бальзам Марго (+40 энергии при приеме)!');
              sfx.playSuccess();
              updateHUD();
              saveState();
              talkMargo();
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
              toast('🍯 Приготовлен Дегтярный бальзам (+40 HP, защита на 3 вылазки)!');
              sfx.playSuccess();
              updateHUD();
              saveState();
              talkMargo();
            } else {
              toast('Нужно: 1 сфагнум, 1 дрова и 1 травы.');
            }
          }
        }
      );
    }

    // Торговля
    actions.push(
      {
        text: '🍶 Купить очищенный спирт (за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            addItem('alcohol', 1);
            toast('Куплен флакон спирта');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkMargo();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      },
      {
        text: '🌿 Купить сушёные целебные травы (1 шт. за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('herbs', 1);
            toast('Куплен пучок сушеных трав');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkMargo();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      }
    );

    // Уникальный квест высокой репутации (70+): Философия Добра: Трави бобров!
    const margoRep = getNpcRep('margo');
    if (margoRep >= 70 && !state.highRepQuests?.margo?.status && !state.highRepQuests?.spiridon?.status) {
      actions.push({
        text: '🌿 «Марго, проведи обряд очищения от болотной хвори!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.margo = { status: 'completed' };
          state.highRepQuests.spiridon = { status: 'completed' };
          state.rad = 0;
          state.hp = 100;
          changeNpcRep('margo', 10);
          state.reputation += 22;
          toast('⭐ ОБРЯД ОЧИЩЕНИЯ ПРОВЕДЕН! Радиация снята полностью, HP на максимуме (+10 реп Марго, +22 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkMargo();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 7. СТРОНГ
  // Аналитик, статистик, регистратор энтропии с антрацитовым глазом
  // ==========================================================================
  function talkStrong() {
    const npc = NPCS.strong;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_strong = true;
    state.questFlags.met_sasha = true;

    let body = renderNpcRepHeader('strong');
    body += `<p>Стронг сидит за радиостанцией на Скалистом утёсе. Его правый глаз — полированный черный антрацит без зрачка, в руках — потертый блокнот с «Реестром Всходов». Из динамиков Р-326 сквозь шипение доносятся телеметрические сигналы.</p>`;
    body += `<p><i>«Фиксирую объект. Точный учёт и фиксация в реестре — единственное, что сдерживает энтропию. Раз в сутки я провожу пеленгацию аварийных сбросов в секторе.»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('strong', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поговорить со Стронгом о статистике и радиоэфире»',
      action: () => openNpcChat('strong')
    });

    // Ежедневное сканирование радиоэфира
    if (!state.sashaRadioUsedToday && !state.strongRadioUsedToday) {
      actions.push({
        text: '📡 «Стронг, включи пеленгатор: найди аварийный контейнер на сегодня»',
        action: () => {
          state.sashaRadioUsedToday = true;
          state.strongRadioUsedToday = true;
          const locs = ['river', 'forest', 'swamp', 'pump_station'];
          state.activeStashLocation = locs[Math.floor(Math.random() * locs.length)];
          const locNames = { river: 'Реке Быстрянке', forest: 'Ближнем лесу', swamp: 'Гнилой гати', pump_station: 'Насосной станции' };
          toast(`📡 СИГНАЛ ЗАПЕЛЕНГОВАН! Стронг зафиксировал контейнер на ${locNames[state.activeStashLocation]}!`);
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkStrong();
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
            talkStrong();
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
            talkStrong();
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
          talkStrong();
        } else {
          toast('Недостаточно патронов.');
        }
      }
    });

    // Уникальный квест высокой репутации (70+): Глубокий радиопеленг энтропии
    const strongRep = getNpcRep('strong');
    if (strongRep >= 70 && !state.highRepQuests?.strong?.status && !state.highRepQuests?.sasha?.status) {
      actions.push({
        text: '📡 «Стронг, перепаяем контур для глубокого радиопеленга?» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.strong = { status: 'completed' };
          state.highRepQuests.sasha = { status: 'completed' };
          addItem('ammo', 10);
          addItem('batteryaaa', 2);
          changeNpcRep('strong', 9);
          state.reputation += 20;
          toast('⭐ Стронг модернизировал радиоконтур (+10 патронов, 2 батарейки, +9 реп Стронгу, +20 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkStrong();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 8. ВАРЯ (ВАРВАРА)
  // Полевой повар лагеря, родом из Брянска, тайна калибра 7.62x54R
  // ==========================================================================
  function talkVarya() {
    const npc = NPCS.varya;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_varya = true;

    const rep = getNpcRep('varya');
    const tier = getNpcRepTitle(rep);

    let body = renderNpcRepHeader('varya');
    body += `<p>Варя ловко помешивает большой ковш в бурлящем чугунном котле. От жаровни исходит потрясающий, наваристый аромат лесных трав, ухи и разварного мяса. На шее у девушки на тонком кожаном шнурке поблескивает стреляная латунная гильза с закраиной.</p>`;
    body += `<p><i>«О, привет! Вовремя пришёл — как раз похлёбка настоялась! В такую холодину без горячего супа в тайге и часу не выдюжишь. Садись к костру, тарелку подставляй! Слушай... а ты в рейд с каким калибром ходишь? Какой у тебя патрон в подсумке? 5.45? 7.62?.. А семь шестьдесят два на пятьдесят четыре не попадался случайно? Ну скажи, это ужасно важно!»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('varya', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Варей о кухне, Брянске и калибрах»',
      action: () => openNpcChat('varya')
    });

    // Бесплатная порция похлёбки 1 раз в день
    const today = state.day;
    if (state.varyaStewClaimedDay !== today) {
      actions.push({
        text: '🍲 «Варя, налей миску горячей похлёбки из котла!» (Бесплатно раз в день)',
        action: () => {
          state.varyaStewClaimedDay = today;
          addItem('varya_stew', 1);
          changeNpcRep('varya', 1, false);
          toast('🍲 Варя от души налила миску горячей наваристой похлёбки (+45 сытости, +15 энергии)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkVarya();
        },
        primary: true
      });
    } else {
      body += `<p style="color:var(--accent-green); font-size:11.5px;">✓ Вы уже отведали сегодняшнюю порцию горячего супа у Вари. Приходите завтра!</p>`;
    }

    // Чистая вода из кухонного фильтра (если построен varya_filter)
    if (state.sideQuests?.varya_filter?.status === 'completed') {
      if (state.varyaWaterClaimedDay !== today) {
        actions.push({
          text: '💧 «Набрать чистой ключевой воды из кухонного фильтра Вари» (Раз в день)',
          action: () => {
            state.varyaWaterClaimedDay = today;
            addItem('clean_water', 1);
            toast('💧 Фляга чистой питьевой воды набрана из фильтра Вари (+35 жажды)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkVarya();
          }
        });
      }
    }

    // Линейка поручений Вари
    // Квест 1: Огонь и котелок (varya_fire)
    if (!state.sideQuests?.varya_fire?.status) {
      actions.push({
        text: '🪵 «Варя, чем помочь на кухне лагеря?» (Квест: Огонь и котелок)',
        action: () => {
          state.sideQuests = state.sideQuests || {};
          state.sideQuests.varya_fire = { status: 'active' };
          toast('📜 Взято поручение: «Огонь и котелок» (Принести 3 охапки сухих дров)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.sideQuests.varya_fire.status === 'active') {
      const hasWood = getItemCount('firewood') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ОГОНЬ И КОТЕЛОК]:</b> <i>«Дрова для печи принёс? Без сухого жара щи не закипят!»</i></p>`;
      if (hasWood) {
        actions.push({
          text: '🪵 «Вот 3 охапки сухих берёзовых дров, Варя!»',
          action: () => {
            removeItem('firewood', 3);
            state.sideQuests.varya_fire.status = 'completed';
            addItem('varya_stew', 2);
            changeNpcRep('varya', 6);
            state.reputation += 10;
            toast('⭐ Квест «Огонь и котелок» сдан (+2 порции похлёбки, +6 репутации у Вари, +10 лагерю)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // Квест 2: Чистый исток (varya_filter) - требует репутацию 25+
    if (rep >= 25 && state.sideQuests?.varya_fire?.status === 'completed' && !state.sideQuests?.varya_filter?.status) {
      actions.push({
        text: '💧 «Варя, как сделать воду на кухне чище?» (Квест: Чистый исток)',
        action: () => {
          state.sideQuests.varya_filter = { status: 'active' };
          toast('📜 Взято поручение: «Чистый исток» (Собрать: 2 древесных угля, 2 сфагнума, 1 металлолом)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.sideQuests?.varya_filter?.status === 'active') {
      const hasFilterMats = getItemCount('charcoal') >= 2 && getItemCount('swamp_moss') >= 2 && getItemCount('scrap') >= 1;
      body += `<p style="color:var(--accent-gold);"><b>[ЧИСТЫЙ ИСТОК]:</b> <i>«Нужны 2 угля, 2 сфагнума и кусок жести для гравийного фильтра.»</i></p>`;
      if (hasFilterMats) {
        actions.push({
          text: '🪨 «Собрать гравийный фильтр тонкой очистки для кухни»',
          action: () => {
            removeItem('charcoal', 2);
            removeItem('swamp_moss', 2);
            removeItem('scrap', 1);
            state.sideQuests.varya_filter.status = 'completed';
            addItem('gravel_filter', 1);
            changeNpcRep('varya', 9);
            state.reputation += 15;
            toast('⭐ Гравийный фильтр Вари готов! Теперь можно бесплатно набирать чистую воду каждый день (+9 реп Варе, +15 лагерю)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // Квест 3: Вкус прежнего мира (varya_royal_soup) - требует репутацию 70+
    if (rep >= 70 && !state.sideQuests?.varya_royal_soup?.status) {
      actions.push({
        text: '🍲 «Варя, давай сварим настоящий праздник для всего лагеря!»',
        action: () => {
          state.sideQuests.varya_royal_soup = { status: 'active' };
          toast('📜 Взято поручение: «Вкус прежнего мира» (Принести: 1 тушёнку, 3 брусники, 2 чистой воды, 2 дров)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.sideQuests?.varya_royal_soup?.status === 'active') {
      const hasSoupMats = getItemCount('canned_food') >= 1 && getItemCount('berries') >= 3 && getItemCount('clean_water') >= 2 && getItemCount('firewood') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[ВКУС ПРЕЖНЕГО МИРА]:</b> <i>«Ох, если найдёшь банку армейской тушёнки, брусники и чистой воды — сотворим борщ, какого тайга ещё не пробовала!»</i></p>`;
      if (hasSoupMats) {
        actions.push({
          text: '🍲 «Сварить Праздничный таёжный борщ вместе с Варей»',
          action: () => {
            removeItem('canned_food', 1);
            removeItem('berries', 3);
            removeItem('clean_water', 2);
            removeItem('firewood', 2);
            state.sideQuests.varya_royal_soup.status = 'completed';
            addItem('royal_soup', 2);
            changeNpcRep('varya', 10);
            state.reputation += 20;
            toast('🏆 Праздничный таёжный борщ готов! Открыт рецепт для костра (+2 порции, +10 реп у Вари, +20 лагерю)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // --- ПЕРЕСЕКАЮЩИЕСЯ КВЕСТЫ (СОЮЗЫ) ---
    // 1. Большой таёжный пир (Варя + Чагрон, реп >= 50)
    const chagronRep = getNpcRep('chagron');
    if (rep >= 50 && chagronRep >= 50 && !state.crossQuests?.cross_feast?.status) {
      actions.push({
        text: '🍖 «Варя, мы с Чагроном предлагаем устроить Большой таёжный пир!»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_feast = { status: 'active' };
          toast('⚔️ СОЮЗ ЖИТЕЛЕЙ: Взят квест «Большой таёжный пир» (Варя + Чагрон)! Нужно: 2 мяса, 3 рыбы, 3 ягоды.');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.crossQuests?.cross_feast?.status === 'active') {
      const hasFeastMats = getItemCount('raw_meat') >= 2 && getItemCount('raw_fish') >= 3 && getItemCount('berries') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[СОЮЗ: БОЛЬШОЙ ТАЁЖНЫЙ ПИР]:</b> <i>«Чагрон обещал подсобить с разделкой! Принёс 2 мяса, 3 рыбы и 3 брусники?»</i></p>`;
      if (hasFeastMats) {
        actions.push({
          text: '🎉 «Сдать припасы и зажечь праздничный костёр пира»',
          action: () => {
            removeItem('raw_meat', 2);
            removeItem('raw_fish', 3);
            removeItem('berries', 3);
            state.crossQuests.cross_feast.status = 'completed';
            addItem('smoked_feast', 2);
            changeNpcRep('varya', 9);
            changeNpcRep('chagron', 9);
            state.reputation += 24;
            toast('🏆 БОЛЬШОЙ ТАЁЖНЫЙ ПИР СОСТОЯЛСЯ! Весь лагерь празднует (+9 реп Варе, +9 реп Чагрону, +24 лагерю, открыт рецепт «Окорок по-лесному»)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // 2. Полевой автоклав и дистиллятор (Варя, Боб, Скай, реп >= 50 у всех трёх)
    const bobRep = getNpcRep('bob');
    const skyRep = getNpcRep('sky');
    if (rep >= 50 && bobRep >= 50 && skyRep >= 50 && !state.crossQuests?.cross_autoclave?.status) {
      actions.push({
        text: '⚙️ «Варя, объединим силы с Бобом и Скаем для сборки Автоклава?»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_autoclave = { status: 'active' };
          toast('⚔️ ТРОЙСТВЕННЫЙ СОЮЗ: Взят квест «Полевой автоклав» (Варя + Боб + Скай)! Нужно: 3 лома, 2 проволоки, 1 мембрана.');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.crossQuests?.cross_autoclave?.status === 'active') {
      const hasAutoMats = getItemCount('scrap') >= 3 && getItemCount('wire') >= 2 && (getItemCount('filter_membrane') >= 1 || getItemCount('scrap') >= 5);
      body += `<p style="color:var(--accent-gold);"><b>[СОЮЗ: ПОЛЕВОЙ АВТОКЛАВ]:</b> <i>«Боб согнёт корпус из труб, Скай продизенфицирует штуцера, а мы с тобой пустим чистый пар!»</i></p>`;
      if (hasAutoMats) {
        actions.push({
          text: '🔧 «Смонтировать автоклав-дистиллятор в лагере»',
          action: () => {
            removeItem('scrap', 3);
            removeItem('wire', 2);
            if (getItemCount('filter_membrane') >= 1) removeItem('filter_membrane', 1);
            else removeItem('scrap', 2);
            state.crossQuests.cross_autoclave.status = 'completed';
            addItem('autoclave_unit', 1);
            changeNpcRep('varya', 9);
            changeNpcRep('bob', 9);
            changeNpcRep('sky', 9);
            state.reputation += 24;
            toast('🏆 АВТОКЛАВ УСТАНОВЛЕН! Община получила постоянную стерилизацию и дистиллятор (+9 реп каждому соратнику, +24 лагерю)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // 3. Таёжный бальзам долголетия (Варя + Марго, реп >= 50 оба)
    const margoRep = getNpcRep('margo');
    if (rep >= 50 && margoRep >= 50 && !state.crossQuests?.cross_balsam?.status) {
      actions.push({
        text: '🌿 «Варя, объединим твои сиропы с настойками травницы Марго?»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_balsam = { status: 'active' };
          toast('⚔️ СОЮЗ ЗНАХАРЕЙ: Взят квест «Таёжный бальзам» (Варя + Марго)! Нужно: 1 спирт, 3 травы, 2 сфагнума, 2 брусники.');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.crossQuests?.cross_balsam?.status === 'active') {
      const hasBalsamMats = getItemCount('alcohol') >= 1 && getItemCount('herbs') >= 3 && getItemCount('swamp_moss') >= 2 && getItemCount('berries') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[СОЮЗ: ТАЁЖНЫЙ БАЛЬЗАМ]:</b> <i>«Марго шептала над чашей с травами, теперь наш черёд варить взвар!»</i></p>`;
      if (hasBalsamMats) {
        actions.push({
          text: '🧪 «Приготовить легендарный Бальзам Вари и Марго»',
          action: () => {
            removeItem('alcohol', 1);
            removeItem('herbs', 3);
            removeItem('swamp_moss', 2);
            removeItem('berries', 2);
            state.crossQuests.cross_balsam.status = 'completed';
            addItem('taiga_balsam', 2);
            changeNpcRep('varya', 9);
            changeNpcRep('margo', 9);
            state.reputation += 22;
            toast('🏆 БАЛЬЗАМ ДОЛГОЛЕТИЯ СВАРЕН! Рецепт открыт для костра (+2 бальзама, +9 реп обеим, +22 лагерю)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // --- ОБРАТНАЯ СОВМЕСТИМОСТЬ СО СТАРЫМИ ФУНКЦИЯМИ ---
  function talkBatya() {
    if ([2, 4, 8, 11, 14, 17].includes(state.mainQuestStep)) {
      talkAtaron();
    } else {
      talkSanych();
    }
  }

  function talkAnna() { talkSky(); }
  function talkProkhor() { talkBob(); }
  function talkEgor() { talkChagron(); }
  function talkSpiridon() { talkMargo(); }
  function talkSasha() { talkStrong(); }

  // >>> MODULE: systems/sorties.js (1454 строк)
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
    addItem('ammo', 8);
    state.reputation += 15;
    toast('📦 ТЕРМОБОКС ПОДНЯТ СО ДНА! Найдено 3 банки армейской тушенки и 8 патронов (+15 репутации)!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    state.reputation += 18;
    toast(`🐺 ВОЛЧЬЕ ЛОГОВО РАЗГРОМЛЕНО! Вожак повержен! Получен амулет «Волчий клык» (+5 к урону), 2 шкуры (${damage} урона, +18 репутации)!`);
    sfx.playSuccess();
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    state.reputation += 12;
    toast('🐾 ЩЕНОК СПАСЕН! Вы аккуратно разжали дуги ржавого капкана, промыли рану и перевязали щенка. Отнесите его Чагрону в лагерь (+12 репутации)!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    refreshLocationModal(loc);
  }

  function doVisitSpiridon(loc) {
    sfx.init();
    sfx.playClick();
    state.questFlags.met_margo = true;
    state.questFlags.met_spiridon = true;
    toast('🛖 Вы пробрались по замшелым кочкам к затерянной Заимке травницы Марго!');
    closeModal();
    talkMargo();
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
    addItem('ammo', 6);
    state.reputation += 20;
    toast('🚜 БРДМ-2 ОБСЛЕДОВАН! Найдены жетоны сержанта Гурова, патроны и планшет! Отнесите Атарону (+20 репутации).');
    sfx.playSuccess();
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    state.reputation += 16;
    toast('✨ СВЕТЯЩИЙСЯ СФАГНУМ СОБРАН! Чистый экстракт спасет от ран и радиации! Отнесите Марго или Скаю (+16 репутации).');
    sfx.playSuccess();
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    state.reputation += 20;
    passTime(1);
    toast('🚰 ДОННЫЙ ВЕНТИЛЬ ПОВЕРНУТ! Шлам сброшен! Теперь каждое утро лагерная колонка выдает +1 флягу чистой воды (+20 репутации)!');
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    addItem('ammo', 10);
    addItem('wire', 2);
    state.reputation += 20;
    passTime(1);
    toast('🔐 СЕЙФ ВЗЛОМАН! Найдены чертежи разгрузки Кузьмина (+2.5 кг к вместимости), 10 патронов и проволока (+20 репутации)!');
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    state.reputation += 16;
    passTime(1);
    toast('🏚️ ТАЙНИК В ПЕЧИ ОБНАРУЖЕН! Найден кожаный патронташ лесничего (+2.5 кг к весу) и 6 патронов ТОЗ (+16 репутации)!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    refreshLocationModal(loc);
  }

  function doRescueSasha(loc) {
    sfx.init();
    sfx.playClick();
    if (getItemCount('bandage') < 2 || getItemCount('clean_water') < 1) {
      toast('Стронг истекает кровью в расщелине! Нужно: 2 стерильных бинта и 1 фляга чистой воды.');
      return;
    }
    removeItem('bandage', 2);
    removeItem('clean_water', 1);
    state.questFlags.met_strong = true;
    state.questFlags.met_sasha = true;
    state.reputation += 22;
    passTime(2);
    toast('🆘 СТРОНГ СПАСЕН! Вы перевязали раненого аналитика и помогли ему добраться до лагеря! Теперь Стронг наладит радиопеленг (+22 репутации)!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    closeModal();
    talkStrong();
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
    state.reputation += 25;
    passTime(2);
    toast('📊 САМОПИСЕЦ ИЗВЛЕЧЕН! Архивные данные аварии и ценные радиодетали сняты со шпиля вышки (+25 репутации)!');
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    state.reputation += 24;
    passTime(2);
    toast(`🐗 ВЕПРЬ-СЕКАЧ ПОВЕРЖЕН! Двустволка свалила гиганта (+4 мяса, +2 толстые шкуры, получено ${damage} урона, +24 репутации)!`);
    sfx.playSuccess();
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    state.reputation += 30;
    passTime(2);
    toast('🧬 СПЕЦХРАН «БИО-4» ВСКРЫТ! Извлечен армейский биостимулятор «Стимулятор-М» (+25 постоянной максимальной энергии, +30 репутации)!');
    updateHUD();
    saveState();
    refreshLocationModal(loc);
  }

  function doSearchTriangulator(loc) {
    sfx.init();
    sfx.playClick();
    state.energy -= 10;
    state.questFlags.geo1_done = true;
    state.reputation += 10;
    toast('📍 ТРИАНГУЛЯТОР ОБСЛЕДОВАН! В металлическом тубусе найдена карта геологоразведки «Енисей-3» с координатами скважины №7 на Быстрянке (+10 репутации)!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
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
    state.reputation += 15;
    toast('⛏️ СКВАЖИНА №7 РАСЧИЩЕНА! Со дна шурфа поднят запечатанный геологический керн с черным аномальным минералом! Покажите Бобу (+15 репутации).');
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
  }

  function doSearchCaravanFord(loc) {
    sfx.init();
    sfx.playClick();
    state.energy -= 10;
    state.questFlags.caravan1_done = true;
    state.reputation += 12;
    toast('👣 СЛЕДЫ БАНДЫ «ХЛЫЩА» ОБНАРУЖЕНЫ! Найдены гильзы и нацарапанная на камне стрелка в сторону штольни на Скалистом утёсе (+12 репутации)!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    addItem('ammo', 20);
    state.hasTozScope = true;
    state.reputation += 25;
    toast('🏴‍☠️ СХРОН МАРОДЕРОВ ВЗЯТ! Растяжка обезврежена! Найден коллиматорный прицел ТОЗ (+30% крит) и 20 патронов! Доложите Атарону (+25 репутации).');
    updateHUD();
    saveState();
    refreshLocationModal(loc);
  }

  function doCollectRadioStash(loc) {
    sfx.init();
    sfx.playSuccess();
    state.energy = Math.max(0, state.energy - 10);
    state.activeStashLocation = null;
    addItem('canned_food', 2);
    addItem('ammo', 8);
    addItem('batteryaaa', 1);
    state.reputation += 12;
    toast('📦 ПАРАШЮТНЫЙ КОНТЕЙНЕР НАЙДЕН! Забрано: 2 банки тушёнки, 8 патронов и комплект батареек ААА (+12 репутации)!');
    updateHUD();
    saveState();
    refreshLocationModal(loc);
  }

  // --- УНИКАЛЬНЫЕ ПОГОДНЫЕ КВЕСТЫ (WEATHER QUESTS) ---
  function doWeatherQuestRiverFlood(loc) {
    if (state.energy < 15) {
      toast('Недостаточно сил для борьбы со стремительным паводком! Нужно 15% энергии.');
      return;
    }
    sfx.init();
    sfx.playSplash();
    state.energy -= 15;
    passTime(1);
    state.questFlags.wq_river_flood_done = true;
    addItem('raw_fish', 3);
    addItem('firewood', 2);
    addItem('scrap', 2);
    changeNpcRep('chagron', 6);
    changeNpcRep('bob', 6);
    state.reputation += 12;
    toast('🌊 ПАВОДОК ПРЕОДОЛЁН! Вы укрепили мостки и перехватили сеть с крупным уловом! Чагрон и Боб благодарят (+6 реп обоим, +12 общей)!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
  }

  function doWeatherQuestSwampLights(loc) {
    if (state.energy < 15) {
      toast('Нужно 15% энергии для блуждания по топи в густом смоге!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= 15;
    const radDamage = (getItemCount('respirator') > 0 || state.questFlags.respirator_crafted) ? 5 : 15;
    state.rad += radDamage;
    passTime(1);
    state.questFlags.wq_swamp_lights_done = true;
    addItem('glowing_moss', 2);
    addItem('herbs', 2);
    addItem('stabilizer_nectar', 1);
    changeNpcRep('margo', 7);
    state.reputation += 12;
    toast('✨ ОГНИ ГАТИ НАЙДЕНЫ! Сквозь ядовитую пелену вы вышли к мерцающему люминесцентному мху! Марго в восторге (+7 репутации Марго, +12 общей)!');
    sfx.playSuccess();
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
  }

  function doWeatherQuestTowerAurora(loc) {
    if (state.energy < 20) {
      toast('Нужно 20% энергии для подъёма на вышку во время авроры!');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= 20;
    passTime(1.5);
    state.questFlags.wq_tower_aurora_done = true;
    addItem('scrap', 3);
    addItem('wire', 2);
    addItem('batteryaaa', 1);
    addItem('ammo', 6);
    changeNpcRep('sky', 7);
    changeNpcRep('strong', 7);
    state.reputation += 14;
    toast('🌌 ДАЛЬНИЙ СИГНАЛ ПЕРЕХВАЧЕН! В сиянии ионосферы антенна приняла радиограмму геологов и координаты тайника! (+7 реп Скаю и Стронгу, +14 общей)!');
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
  }

  function doWeatherQuestPerimeterFrost(loc) {
    if (getItemCount('spear') < 1 && getItemCount('toz') < 1 && getItemCount('knife') < 1) {
      toast('Выходить против волчьей стаи на морозе без оружия — самоубийство!');
      return;
    }
    if (state.hp < 25) {
      toast('Вы слишком слабы для боя в стужу!');
      return;
    }
    sfx.init();
    sfx.playDanger();
    const damage = state.hasDog ? 8 : 15;
    state.hp = Math.max(10, state.hp - damage);
    state.energy = Math.max(0, state.energy - 20);
    passTime(1.5);
    state.questFlags.wq_perimeter_frost_done = true;
    addItem('raw_meat', 3);
    addItem('leather', 2);
    addItem('ammo', 4);
    changeNpcRep('ataron', 7);
    state.reputation += 12;
    toast(`❄️ ПЕРИМЕТР ОТСТОЯН! Замки сигналок отогреты, нападавшая на морозе стая рассеяна! Атарон доволен выучкой (+7 репутации Атарону, +12 общей)!`);
    sfx.playSuccess();
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
  }

  function doWeatherQuestPeatFire(loc) {
    if (state.energy < 15) {
      toast('Недостаточно сил для окапывания тлеющего торфа! Нужно 15% энергии.');
      return;
    }
    sfx.init();
    sfx.playSuccess();
    state.energy -= 15;
    passTime(1);
    state.questFlags.wq_peat_fire_done = true;
    addItem('charcoal', 3);
    addItem('firewood', 2);
    changeNpcRep('sanych', 7);
    state.reputation += 12;
    toast('🔥 ТОРФЯНИК ЛИКВИДИРОВАН! Вы забросали пласт землёй и песком, спася частокол лагеря от пожара! Саныч выражает почтение (+7 реп Санычу, +12 общей)!');
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
  }

  function restAtCamp() {
    sfx.init();
    sfx.playClick();
    if (state.energy >= 95) {
      toast(`⚡ Вы полны сил (${Math.round(state.energy)}% энергии) и пока не хотите спать!`);
      return;
    }

    closeModal();
    const maxEng = state.maxEnergy || 100;
    state.energy = Math.min(maxEng, state.energy + 50);
    state.hp = Math.min(100, state.hp + 10);
    passTime(1, 8, 12);
    toast('🛌 Вы отдохнули в бараке (+50% энергии, прошло время).');
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

  function getEffectiveEnergyCost(loc, baseCost = null) {
    let cost = baseCost !== null ? baseCost : (loc ? loc.energyCost : 10);
    const weather = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    if (weather && weather.energyMod) {
      cost = Math.max(5, Math.round(cost * (1 + weather.energyMod / 100)));
    }
    if (hasStatusEffect('spiridon_vigor')) {
      cost = Math.max(5, Math.round(cost * 0.85));
    }
    if (hasStatusEffect('hypothermia')) {
      cost = Math.round(cost * 1.25);
    }
    if (state.hasGeoCompass) {
      cost = Math.max(5, cost - 5);
    }
    if (isNightTime(state.timeOfDay) && !state.hasElectricTorch && !hasStatusEffect('lynx_vision')) {
      if (state.weather !== 'aurora') {
        cost += 10;
      }
    }
    return Math.max(5, cost);
  }

  function getEffectiveRad(loc, baseRad = null) {
    let rad = baseRad !== null ? baseRad : (loc ? loc.rad : 0);
    const weather = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    if (weather && weather.radMod) {
      rad = rad + weather.radMod;
    }
    if (hasStatusEffect('rad_shield') || state.hasGeiger) {
      rad = Math.round(rad * 0.5);
    }
    return Math.max(0, rad);
  }

  function refreshLocationModal(loc) {
    if (!loc) return;
    if (state.hp <= 0) return;
    openLocationModal(loc);
  }

  function openLocationModal(loc) {
    sfx.init();
    sfx.playClick();
    let body = `<p>${loc.desc}</p>`;

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
      if ((state.weather === 'rain' || state.weather === 'storm') && !state.questFlags.wq_river_flood_done) {
        actions.unshift({
          text: `🌊 Спасти рыбацкие мостки и перехватить оторванную сеть (Погода: ${WEATHER_TYPES[state.weather]?.name || ''})`,
          action: () => doWeatherQuestRiverFlood(loc),
          primary: true
        });
      }
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
      if (state.weather === 'heat' && !state.questFlags.wq_peat_fire_done) {
        actions.unshift({
          text: '🔥 Затушить тлеющий торфяник у опушки (Погода: Знойное марево)',
          action: () => doWeatherQuestPeatFire(loc),
          primary: true
        });
      }
      if (state.weather === 'freeze' && !state.questFlags.wq_perimeter_frost_done) {
        actions.unshift({
          text: '❄️ Отогреть замки периметра и отбить стаю на морозе (Погода: Заморозки)',
          action: () => doWeatherQuestPerimeterFrost(loc),
          primary: true
        });
      }
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
      if (state.questFlags.wolves_defeated && !state.questFlags.pup_rescued) {
        actions.push({
          text: '🐾 Пойти на жалобный скулёж в малиннике (Спасти щенка)',
          action: () => doRescuePup(loc),
          primary: true
        });
      }
      if ((state.questFlags.met_margo || state.questFlags.met_spiridon) && !state.questFlags.geo1_done) {
        actions.push({
          text: '📍 Осмотреть геодезический триангулятор на скале (Наводка Марго)',
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
      if ((state.weather === 'fog' || state.weather === 'toxic_rain') && !state.questFlags.wq_swamp_lights_done) {
        actions.unshift({
          text: `✨ Выследить блуждающие огни в ядовитом тумане (Погода: ${WEATHER_TYPES[state.weather]?.name || ''})`,
          action: () => doWeatherQuestSwampLights(loc),
          primary: true
        });
      }
      const metM = !!(state.questFlags.met_margo || state.questFlags.met_spiridon);
      actions.push({
        text: metM ? '🛖 Зайти на Заимку травницы Марго' : '🛖 Пробраться по гати к Заимке травницы Марго',
        action: () => doVisitSpiridon(loc),
        primary: !metM
      });
      if (!state.questFlags.brdm_searched) {
        actions.push({
          text: '🚜 Обследовать затопленный БРДМ разведгруппы «Север»',
          action: () => doSearchBrdm(loc)
        });
      }
      if (isNightTime(state.timeOfDay) && !state.questFlags.glowing_moss_found) {
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
      if (state.weather === 'freeze' && !state.questFlags.wq_perimeter_frost_done) {
        actions.unshift({
          text: '❄️ Отогреть замки периметра и отбить стаю на морозе (Погода: Заморозки)',
          action: () => doWeatherQuestPerimeterFrost(loc),
          primary: true
        });
      }
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
      if (state.weather === 'aurora' && !state.questFlags.wq_tower_aurora_done) {
        actions.unshift({
          text: '🌌 Калибровать антенну в сполохах авроры (Погода: Аномальное сияние)',
          action: () => doWeatherQuestTowerAurora(loc),
          primary: true
        });
      }
      if (state.mainQuestStep >= 11 && !state.questFlags.met_strong && !state.questFlags.met_sasha) {
        actions.push({
          text: '🆘 Осмотреть расщелину под утесом (Спасенный Стронг)',
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
      if (state.mainQuestStep < 17) {
        body += `<p style="color:var(--text-dim); font-size:12px;">🔒 <i>Тяжёлые бронированные гермодвери наглухо заперты автоматикой. Доступ откроется на завершающих этапах кампании (Квест 18).</i></p>`;
      } else if (state.mainQuestStep === 17 && !state.questFlags.turrets_neutralized) {
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
      } else if (state.questFlags.bunker_entered) {
        if (!state.questFlags.bio4_cleared) {
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

    openModal(loc.name, 'Вылазка', loc.icon, body, actions);
  }

  // --- КОНКРЕТНЫЕ АКТИВНОСТИ ВЫЛАЗОК ---
  function doFishing(loc) {
    const energyCost = getEffectiveEnergyCost(loc);
    const radCost = getEffectiveRad(loc);
    if (state.energy < energyCost) {
      toast('Недостаточно сил для рыбалки!');
      return;
    }
    if (getItemCount('rod') < 1) {
      toast('У вас нет удочки! Скрафтите её на верстаке у Боба.');
      return;
    }
    if (getItemCount('worms') < 1) {
      toast('Нет наживки! Накопайте червей у берега.');
      return;
    }

    sfx.init();
    sfx.playSplash();
    removeItem('worms', 1);
    state.energy -= energyCost;
    state.rad += radCost;
    passTime(1);

    const roll = Math.random();
    if (roll > 0.3) {
      let fishCaught = 1;
      let weatherBonusText = '';
      if (state.weather === 'rain' || state.weather === 'storm') {
        fishCaught += 1;
        weatherBonusText = ' (в ненастье клёв отличный: +1 бонусная рыба!)';
      }
      addItem('raw_fish', fishCaught);
      toast(`🐟 Отличный клёв! Вы поймали ${fishCaught} шт. речной рыбы${weatherBonusText}.`);
      sfx.playSuccess();
    } else if (roll > 0.1) {
      addItem('scrap', 1);
      toast('👢 Со дна выловлен ржавый металлолом.');
    } else {
      toast('Рыба сорвалась с крючка.');
    }

    checkDailyProgress('fish', 1);
    refreshLocationModal(loc);
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
    refreshLocationModal(loc);
  }

  function doGatherToxicWater(loc) {
    sfx.init();
    sfx.playSplash();
    state.energy -= 5;
    state.rad += 5;
    addItem('water_sample', 1);
    toast('🧪 Набрана проба токсичной желтоватой воды. Отнесите Скаю в лазарет!');
    sfx.playSuccess();
    passTime(0.5);
    refreshLocationModal(loc);
  }

  function doDigWorms(loc) {
    sfx.init();
    sfx.playClick();
    state.energy -= 5;
    addItem('worms', 2);
    toast('🪱 Найдено 2 земляных червя.');
    passTime(0.5);
    refreshLocationModal(loc);
  }

  function doGatherWood(loc) {
    const energyCost = getEffectiveEnergyCost(loc);
    const radCost = getEffectiveRad(loc);
    if (state.energy < energyCost) {
      toast('Недостаточно сил!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= energyCost;
    state.rad += radCost;
    let woodAmount = 2;
    let extraWoodMsg = '';
    if (state.weather === 'storm') {
      woodAmount += 1;
      extraWoodMsg = ' (Буря повалила сухостой: +1 бонусное полено!)';
    } else if (state.weather === 'heat') {
      addItem('charcoal', 1);
      extraWoodMsg = ' (В знойное марево найден сухой уголь: +1 уголь!)';
    }
    addItem('firewood', woodAmount);
    toast(`🪵 Заготовлено ${woodAmount} охапки сушняка для костра.${extraWoodMsg}`);
    passTime(1);
    checkDailyProgress('wood', 2);
    refreshLocationModal(loc);
  }

  function doGatherHerbs(loc) {
    const energyCost = getEffectiveEnergyCost(loc);
    const radCost = getEffectiveRad(loc);
    if (state.energy < energyCost) {
      toast('Недостаточно сил!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= energyCost;
    state.rad += radCost;
    let herbsAmount = 2;
    let extraHerbsMsg = '';
    if (state.weather === 'fog' || state.weather === 'toxic_rain') {
      herbsAmount += 1;
      extraHerbsMsg = ' (Во влажном тумане травы растут гуще: +1 бонусный пучок!)';
    }
    addItem('herbs', herbsAmount);
    addItem('berries', 1);
    toast(`🌿 Нарвано ${herbsAmount} пучка целебных трав и горсть брусники.${extraHerbsMsg}`);
    passTime(1);
    checkDailyProgress('herbs', 2);
    refreshLocationModal(loc);
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
    refreshLocationModal(loc);
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
    toast('💥 СТАЯ ПСОВ РАЗБИТА! Вы отбились копьём (+2 мяса, +1 шкура). Доложите Атарону!');
    passTime(1.5);
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
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
    let mossAmount = 2;
    if (state.weather === 'fog' || state.weather === 'toxic_rain') {
      mossAmount += 1;
    }
    addItem('swamp_moss', mossAmount);
    toast(`🌿 Собрано ${mossAmount} пучка болотного сфагнума для фильтров и мазей.`);
    passTime(1);
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
  }

  function doScavengeSwamp(loc) {
    const energyCost = getEffectiveEnergyCost(loc);
    const radCost = getEffectiveRad(loc);
    if (state.energy < energyCost) {
      toast('Слишком устали.');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= energyCost;
    state.rad += radCost;
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
    refreshLocationModal(loc);
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
    refreshLocationModal(loc);
  }

  function doScavengeStation(loc) {
    const energyCost = getEffectiveEnergyCost(loc);
    const radCost = getEffectiveRad(loc);
    if (state.energy < energyCost) {
      toast(`Недостаточно сил для обыска! Нужно ${energyCost}% энергии.`);
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= energyCost;
    state.rad += radCost;
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
    refreshLocationModal(loc);
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
    refreshLocationModal(loc);
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
    refreshLocationModal(loc);
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
    refreshLocationModal(loc);
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
    refreshLocationModal(loc);
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
    refreshLocationModal(loc);
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
    refreshLocationModal(loc);
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
    toast('🔭 С вышки виден дым костров «Всем ПОХ», кордон лесничества и бетонный купол Бункера «Сфера».');
    refreshLocationModal(loc);
  }

  function doEnterBunker(loc) {
    if (state.mainQuestStep < 17) {
      toast('Бункер запечатан бронированными гермодверями! Доступ откроется на завершающих этапах кампании.');
      return;
    }
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
    toast('⭐ ОХРАННЫЕ ТУРЕЛИ ПОДАВЛЕНЫ! Проход в глубины Бункера открыт! Доложите Санычу.');
    sfx.playSuccess();
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
  }

  function doShutdownReactor(loc) {
    if (!state.questFlags?.bunker_entered || state.mainQuestStep < 18) {
      toast('Сначала необходимо проникнуть в бункер и подавить турели!');
      return;
    }
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
    toast('⭐ РЕАКТОР ЗАГЛУШЕН! Катастрофа предотвращена! Архив «Каскад» и «Оптимист-7» спасены! Срочно к Санычу!');
    updateHUD();
    saveState();
    renderQuests();
    refreshLocationModal(loc);
  }

  function doScavengeBunker(loc) {
    if (!state.questFlags?.bunker_entered) {
      toast('Сначала необходимо проникнуть в бункер и подавить охранные турели!');
      return;
    }
    const energyCost = getEffectiveEnergyCost(loc);
    const radCost = getEffectiveRad(loc);
    if (state.energy < energyCost) {
      toast('Недостаточно сил!');
      return;
    }
    sfx.init();
    sfx.playClick();
    state.energy -= energyCost;
    state.rad += radCost;
    passTime(2);
    addItem('scrap', 3);
    if (Math.random() > 0.4) addItem('antirad', 1);
    if (Math.random() > 0.6) addItem('ammo', 3);
    toast('В Бункере найден металлолом, патроны и медикаменты.');
    refreshLocationModal(loc);
  }

  function showVictoryScreen() {
    const title = '🏆 ВЕЛИКАЯ ПОБЕДА! СПАСЕНИЕ ЛАГЕРЯ «ВСЕМ ПОХ»!';
    const sub = 'Сюжетная сага из 20 квестов успешно завершена';
    const body = `
      <p style="color:var(--accent-gold); font-size:14px; font-weight:bold;">Саныч, Атарон и весь Совет Основателей салютуют вам!</p>
      <p>Вы прошли колоссальный путь: от истощённого беженца до легендарного защитника тайги. Реактор НИИ «Сфера» заглушен, повторный ядовитый выброс остановлен навсегда, а биостабилизатор «Оптимист-7» очистит сибирские земли и вернёт людям жизнь! «Всем ПОХ на апокалипсис!» — гремит победный салют над костром.</p>
      <div style="background:rgba(0,0,0,0.45); padding:10px 14px; border-radius:8px; margin:12px 0; border:1px solid rgba(255,255,255,0.15); line-height:1.6;">
        <b>Ваш итоговый послужной список:</b><br>
        • Финальный статус: <b>\${getReputationTitle(state.reputation)}</b> (\${state.reputation} очков репутации)<br>
        • Прожито дней в тайге: <b>\${state.day}</b><br>
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
    openModal(title, sub, 'assets/images/npc_leader.png', body, actions);
  }

  // >>> MODULE: systems/craft.js (137 строк)
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

    const currentRecipes = RECIPES.filter(r => {
      if (r.station !== state.craftStation) return false;
      // Скрывать разовые уникальные рецепты после их изготовления
      if (r.oneTime && r.isCrafted && r.isCrafted(state)) return false;
      // Проверка условий открытия рецепта
      if (r.unlocked && !r.unlocked(state)) return false;
      return true;
    });

    if (currentRecipes.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; padding:35px 15px; color:var(--text-dim); font-size:12px; background:rgba(0,0,0,0.25); border:1px dashed var(--border-dim); border-radius:8px;">
          <p style="font-weight:bold; color:var(--text-main); margin-bottom:4px;">В этой категории пока нет доступных рецептов</p>
          <p style="font-size:11px;">Все уникальные чертежи изготовлены, либо требуются новые знания от жителей лагеря.</p>
        </div>
      `;
      return;
    }

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
          <div style="flex:1;">
            <div class="recipe-title" style="display:flex; justify-content:space-between; align-items:center;">
              <span>${r.name}</span>
              ${r.oneTime ? '<span style="font-size:9.5px; color:var(--accent-gold); font-weight:normal; border:1px solid rgba(255,190,34,0.4); border-radius:3px; padding:1px 5px;">РАЗОВО</span>' : ''}
            </div>
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

    if (r.unlocked && !r.unlocked(state)) {
      toast('Этот рецепт вам ещё неизвестен!');
      return;
    }

    if (r.oneTime && r.isCrafted && r.isCrafted(state)) {
      toast('Этот уникальный чертёж уже изготовлен!');
      return;
    }

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
    for (const [resId, addCount] of Object.entries(r.result || {})) {
      addItem(resId, addCount);
    }

    state.energy = Math.max(0, state.energy - r.energy);
    passTime(0.5);

    if (!state.questFlags) state.questFlags = {};
    if (r.id === 'craft_rod') state.questFlags.rod_crafted = true;
    if (r.id === 'craft_spear') state.questFlags.spear_crafted = true;
    if (r.id === 'craft_stalker_suit') {
      state.questFlags.suit_crafted = true;
      state.maxWeight = Math.max(state.maxWeight, 30.0);
    }
    if (r.id === 'craft_respirator') state.questFlags.respirator_crafted = true;
    if (r.id === 'craft_geiger') {
      state.hasGeiger = true;
      state.questFlags.geiger_crafted = true;
    }
    if (r.id === 'craft_electric_torch') {
      state.hasElectricTorch = true;
      state.questFlags.electric_torch_crafted = true;
    }
    if (r.id === 'craft_doghouse') {
      state.hasDog = true;
      state.questFlags.dog_house_built = true;
      if (!state.campUpgrades) state.campUpgrades = {};
      state.campUpgrades.kennel = true;
      state.reputation += 35;
      toast('🐶 БУРАН ОБРЕЛ ТЁПЛЫЙ ДОМ! Лайка стала вашим верным спутником (+25% к урону в боях, +35 репутации)!');
      renderNPCs();
      renderQuests();
    }

    sfx.playSuccess();
    toast(`🔨 Изготовлено: ${r.name}`);
    renderRecipes();
  }

  // >>> MODULE: systems/quests.js (507 строк)
  // --- СИСТЕМА КВЕСТОВ И ЕЖЕДНЕВНЫХ ЗАДАНИЙ ---
  const DAILY_GIVER_MAP = {
    daily_fish: { giver: 'Чагрон («Глыба»)', giverId: 'chagron' },
    daily_wood: { giver: 'Вова «Боб»', giverId: 'bob' },
    daily_herbs: { giver: 'Николай «Скай»', giverId: 'sky' },
    daily_berries: { giver: 'Варя (Полевой повар)', giverId: 'varya' },
    daily_water: { giver: 'Варя (Полевой повар)', giverId: 'varya' }
  };

  function generateDailyQuestsIfNeeded(force = false) {
    if (state.dailyQuests.length > 0 && !force) {
      state.dailyQuests.forEach(q => {
        if (!q.giver && DAILY_GIVER_MAP[q.id]) {
          q.giver = DAILY_GIVER_MAP[q.id].giver;
          q.giverId = DAILY_GIVER_MAP[q.id].giverId;
        }
      });
      return;
    }

    // Проверяем уровень репутации жителей для улучшенных наград
    const chagronRep = getNpcRep('chagron');
    const bobRep = getNpcRep('bob');
    const skyRep = getNpcRep('sky');
    const varyaRep = getNpcRep('varya');

    state.dailyQuests = [
      { 
        id: 'daily_fish', type: 'fish', 
        title: chagronRep >= 50 ? '🐟 Царский улов' : 'Рыбный день', 
        giver: 'Чагрон («Глыба»)', giverId: 'chagron', 
        desc: chagronRep >= 50 ? 'Поймать 3 отборные рыбы на реке Быстрянке для старого следопыта.' : 'Поймать 2 рыбы на реке Быстрянке.', 
        goal: chagronRep >= 50 ? 3 : 2, current: 0, 
        rewardRep: chagronRep >= 50 ? 12 : 7, 
        rewardAmmo: chagronRep >= 50 ? 2 : 1, 
        completed: false, notifiedReady: false, 
        isUpgraded: chagronRep >= 50 
      },
      { 
        id: 'daily_wood', type: 'wood', 
        title: bobRep >= 50 ? '🌲 Отборная сушина' : 'Дрова для костра', 
        giver: 'Вова «Боб»', giverId: 'bob', 
        desc: bobRep >= 50 ? 'Заготовить 3 плотных полена для кузнечного горна Бобчонка.' : 'Заготовить 2 охапки сухих дров.', 
        goal: bobRep >= 50 ? 3 : 2, current: 0, 
        rewardRep: bobRep >= 50 ? 12 : 7, 
        rewardAmmo: bobRep >= 50 ? 2 : 1, 
        completed: false, notifiedReady: false, 
        isUpgraded: bobRep >= 50 
      },
      { 
        id: 'daily_herbs', type: 'herbs', 
        title: skyRep >= 50 ? '🌿 Чистый аптечный сбор' : 'Аптечный сбор', 
        giver: 'Николай «Скай»', giverId: 'sky', 
        desc: skyRep >= 50 ? 'Собрать 3 пучка душистой полыни и чабреца для лазарета Ская.' : 'Собрать 2 пучка полыни для доктора Ская.', 
        goal: skyRep >= 50 ? 3 : 2, current: 0, 
        rewardRep: skyRep >= 50 ? 12 : 7, 
        rewardAmmo: skyRep >= 50 ? 2 : 1, 
        completed: false, notifiedReady: false, 
        isUpgraded: skyRep >= 50 
      },
      { 
        id: 'daily_berries', type: 'berries', 
        title: varyaRep >= 50 ? '🍒 Таёжный ягодный запас' : 'Ягоды для котла', 
        giver: 'Варя (Полевой повар)', giverId: 'varya', 
        desc: varyaRep >= 50 ? 'Собрать 3 порции брусники для лагерного киселя и витаминного взвара.' : 'Собрать 2 порции лесной брусники для полевой кухни.', 
        goal: varyaRep >= 50 ? 3 : 2, current: 0, 
        rewardRep: varyaRep >= 50 ? 12 : 7, 
        rewardAmmo: varyaRep >= 50 ? 2 : 1, 
        completed: false, notifiedReady: false, 
        isUpgraded: varyaRep >= 50 
      }
    ];
  }

  function checkDailyProgress(type, amount) {
    state.dailyQuests.forEach(q => {
      if (!q.completed && q.type === type) {
        q.current += amount;
        if (q.current >= q.goal) {
          if (!q.notifiedReady) {
            q.notifiedReady = true;
            const giverInfo = q.giver ? ` Сдайте его ${q.giver} в лагере.` : ' Сдайте его в лагере.';
            toast(`📋 Поручение «${q.title}» готово к сдаче (${Math.min(q.current, q.goal)}/${q.goal})!${giverInfo}`);
            sfx.playSuccess();
          }
        }
      }
    });
    renderQuests();
  }

  function turnInDailyQuest(questId) {
    const q = (state.dailyQuests || []).find(x => x.id === questId);
    if (!q || q.completed || q.current < q.goal) return false;

    q.completed = true;
    state.reputation += q.rewardRep;
    addItem('ammo', q.rewardAmmo);

    // Рост индивидуальной репутации у конкретного жителя
    if (q.giverId) {
      changeNpcRep(q.giverId, Math.max(2, Math.round(q.rewardRep * 0.45)));
    }

    toast(`🎖️ Поручение «${q.title}» успешно сдано! Получено: +${q.rewardRep} репутации, +${q.rewardAmmo} патрона.`, 'success');
    sfx.playSuccess();
    updateHUD();
    renderQuests();
    saveState();
    return true;
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
          <span style="font-weight:700; font-size:13px; color:var(--accent-gold);">📜 Основной сюжет: Спасение «Всем ПОХ»</span>
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

      // Дашборд индивидуальной репутации жителей лагеря
      const repBox = document.createElement('div');
      repBox.style.cssText = 'background:rgba(0,0,0,0.3); border:1px solid var(--border-dim); border-radius:6px; padding:10px; margin-bottom:12px;';
      let repRows = '';
      const order = ['sanych', 'ataron', 'sky', 'bob', 'chagron', 'varya', 'margo', 'strong'];
      order.forEach(id => {
        const npc = NPCS[id];
        if (!npc) return;
        if (id === 'margo' && !state.questFlags?.met_margo && !state.questFlags?.met_spiridon) return;
        if (id === 'strong' && !state.questFlags?.met_strong && !state.questFlags?.met_sasha) return;
        const repVal = getNpcRep(id);
        const tier = getNpcRepTitle(repVal);
        const firstName = npc.name.split(' ')[0];
        repRows += `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:11.5px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <img src="${npc.avatar}" style="width:20px; height:20px; border-radius:3px; object-fit:cover;" alt="">
              <span style="color:#fff; font-weight:bold;">${firstName}</span>
              <span style="font-size:10px; color:var(--text-dim);">(${npc.role})</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color:${tier.color}; font-weight:bold; font-size:11px;">${tier.icon} ${tier.title}</span>
              <span style="color:var(--accent-gold); font-size:11px; font-family:monospace; min-width:32px; text-align:right;">${repVal}</span>
            </div>
          </div>
        `;
      });
      repBox.innerHTML = `
        <div style="font-family:Russo One,sans-serif; font-size:12px; color:var(--accent-gold); margin-bottom:6px; display:flex; justify-content:space-between;">
          <span>🤝 Отношения с жителями лагеря</span>
          <span style="font-size:10px; color:var(--text-dim); font-family:sans-serif;">Репутация открывает союзы и уникальные квесты</span>
        </div>
        ${repRows}
      `;
      area.appendChild(repBox);

      const categories = [
        { id: 'weather', name: '🌦️ Погодные испытания и сезонные аномалии' },
        { id: 'cross', name: '⚔️ Союзы жителей (Пересекающиеся цепочки)' },
        { id: 'high_rep', name: '⭐ Квесты высокой репутации (70+)' },
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
          const sq = state.sideQuests?.[q.id];
          const isActive = sq && sq.status === 'active';

          let statusBadge = '⏳ Доступно';
          let statusColor = 'var(--accent-gold)';
          let statusBorder = isCompleted ? 'var(--accent-green)' : 'var(--accent-blue)';
          let progressDetail = '';

          if (isCompleted) {
            statusBadge = '✓ Выполнено (Сдано)';
            statusColor = 'var(--accent-green)';
            statusBorder = 'var(--accent-green)';
          } else if (q.category === 'weather') {
            const isMatch = q.weatherReq && q.weatherReq.includes(state.weather);
            if (isMatch) {
              statusBadge = '⚡ Доступно сейчас!';
              statusColor = 'var(--accent-gold)';
              statusBorder = 'var(--accent-gold)';
              const currentW = WEATHER_TYPES[state.weather];
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-gold); margin:3px 0 5px;">⚡ Погода благоприятствует (${currentW?.icon || ''} ${currentW?.name || ''})! Отправляйтесь на локацию поручения.</div>`;
            } else {
              const reqNames = (q.weatherReq || []).map(w => WEATHER_TYPES[w]?.name).join(' или ');
              const curW = WEATHER_TYPES[state.weather];
              statusBadge = '⏳ Ожидание погоды';
              statusColor = 'var(--text-dim)';
              statusBorder = 'rgba(255,255,255,0.15)';
              progressDetail = `<div style="font-size:11.5px; color:var(--text-dim); margin:3px 0 5px;">🔒 Требуется погода: <b>${reqNames}</b>. Сейчас: ${curW?.icon || ''} ${curW?.name || ''}. Дождитесь смены погоды.</div>`;
            }
          } else if (q.id === 'chain_dog') {
            if (!state.questFlags?.wolves_defeated) {
              statusBadge = '🔒 После победы над вожаком';
              statusColor = 'var(--text-dim)';
              statusBorder = 'rgba(255,255,255,0.15)';
              progressDetail = `<div style="font-size:11.5px; color:var(--text-dim); margin:3px 0 5px;">🔒 Станет доступно после разгрома волчьего логова и победы над вожаком в Ближнем лесу.</div>`;
            } else if (!state.questFlags?.pup_rescued) {
              statusBadge = '● Спасти щенка';
              statusColor = 'var(--accent-gold)';
              statusBorder = 'var(--accent-gold)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-gold); margin:3px 0 5px;">🐾 В малиннике Ближнего леса раздаётся жалобный скулёж — освободите щенка из капкана (нужен бинт).</div>`;
            } else if (!state.hasDog) {
              statusBadge = '● Построить конуру';
              statusColor = 'var(--accent-blue)';
              statusBorder = 'var(--accent-blue)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-blue); margin:3px 0 5px;">🏠 Щенок в лагере! Сколотите тёплую будку для Бурана на верстаке (3 дров, 1 проволока, 1 кожа).</div>`;
            }
          } else if (q.id === 'chain_geo') {
            if (!state.questFlags?.met_spiridon) {
              statusBadge = '🔒 До встречи со Спиридоном';
              statusColor = 'var(--text-dim)';
              statusBorder = 'rgba(255,255,255,0.15)';
              progressDetail = `<div style="font-size:11.5px; color:var(--text-dim); margin:3px 0 5px;">🔒 Станет доступно после встречи с дедом Спиридоном на заимке в Гнилой гати (Болота).</div>`;
            } else if (!state.questFlags?.geo1_done) {
              statusBadge = '● Шаг 1: Скала в лесу';
              statusColor = 'var(--accent-gold)';
              statusBorder = 'var(--accent-gold)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-gold); margin:3px 0 5px;">📍 По наводке Спиридона поднимитесь на скалу в Ближнем лесу и осмотрите геодезический триангулятор.</div>`;
            } else if (!state.questFlags?.geo2_done) {
              statusBadge = '● Шаг 2: Скважина №7';
              statusColor = 'var(--accent-gold)';
              statusBorder = 'var(--accent-gold)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-gold); margin:3px 0 5px;">⛏️ Отправляйтесь на Реку Быстрянку и отыщите заиленную скважину №7 по карте геологов.</div>`;
            } else if (!state.hasGeoCompass) {
              statusBadge = '● Шаг 3: Собрать компас';
              statusColor = 'var(--accent-blue)';
              statusBorder = 'var(--accent-blue)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-blue); margin:3px 0 5px;">🧭 Керн с аномальным минералом у вас! Поговорите с Прохором в лагере, чтобы собрать компас.</div>`;
            }
          } else if (isActive) {
            let ready = false;
            let info = '';
            if (q.id === 'sq_wood_anna') {
              const c = getItemCount('firewood');
              ready = c >= 4;
              info = `Дрова: ${c}/4`;
            } else if (q.id === 'sq_fish_egor') {
              const f = getItemCount('raw_fish');
              const w = getItemCount('firewood');
              ready = f >= 3 && w >= 2;
              info = `Рыба: ${f}/3, Дрова: ${w}/2`;
            } else if (q.id === 'sq_water_batya') {
              const c = getItemCount('clean_water');
              ready = c >= 3;
              info = `Чистая вода: ${c}/3`;
            } else if (q.id === 'sq_berries_anna') {
              const c = getItemCount('berries');
              ready = c >= 3;
              info = `Брусника: ${c}/3`;
            } else if (q.id === 'sq_coal_prokhor') {
              const c = getItemCount('scrap');
              ready = c >= 2;
              info = `Лом: ${c}/2`;
            } else if (q.id === 'sq_snare_egor') {
              const c = getItemCount('raw_meat');
              ready = c >= 1;
              info = `Мясо: ${c}/1`;
            } else if (q.id === 'sq_medkit_anna') {
              const b = getItemCount('bandage');
              const h = getItemCount('herbs');
              ready = b >= 2 && h >= 1;
              info = `Бинты: ${b}/2, Травы: ${h}/1`;
            } else if (q.id === 'sq_watch_batya') {
              const isNight = isNightTime(state.timeOfDay);
              const hasTorch = getItemCount('torch') > 0 || getItemCount('electric_torch') > 0;
              ready = isNight && hasTorch;
              info = isNight ? 'Ночь наступила!' : 'Ждите ночи';
            } else if (q.id === 'spiridon_mushrooms') {
              const c = getItemCount('amanita');
              ready = c >= 3;
              info = `Мухоморы: ${c}/3`;
            }

            if (ready) {
              statusBadge = '🟢 Готово к сдаче!';
              statusColor = 'var(--accent-green)';
              statusBorder = 'var(--accent-green)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-green); margin:3px 0 5px; font-weight:700;">🟢 Все предметы собраны! Вернитесь в лагерь и сдайте поручение: ${q.giver}.</div>`;
            } else {
              statusBadge = `● В процессе (${info || 'выполняется'})`;
              statusColor = 'var(--accent-gold)';
              statusBorder = 'var(--accent-gold)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-gold); margin:3px 0 5px;">● Собрано: <b>${info}</b>. Сдаётся лично у: <b>${q.giver}</b>.</div>`;
            }
          }

          const card = document.createElement('div');
          card.className = `quest-item-card ${isCompleted ? 'completed' : ''}`;
          card.style.cssText = `border-left: 3px solid ${statusBorder}; margin-bottom:8px;`;
          card.innerHTML = `
            <div class="quest-title-row" style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; font-size:13px; color:${isCompleted ? 'var(--accent-green)' : 'var(--text-main)'};">${q.title}</span>
              <span style="font-size:11px; font-weight:700; color:${statusColor};">
                ${statusBadge}
              </span>
            </div>
            <div style="font-size:11px; color:var(--accent-blue); margin:2px 0 4px;">Квестодатель: <b>${q.giver}</b></div>
            <p class="quest-desc" style="font-size:12px; margin-bottom:6px;">${q.desc}</p>
            ${progressDetail}
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
          if (!q.giver && DAILY_GIVER_MAP[q.id]) {
            q.giver = DAILY_GIVER_MAP[q.id].giver;
            q.giverId = DAILY_GIVER_MAP[q.id].giverId;
          }
          const isDone = !!q.completed;
          const isReady = !isDone && q.current >= q.goal;

          let statusBadge = isDone ? '✓ Сдано (Награда получена)' : (isReady ? '🟢 Готово к сдаче!' : `● В процессе (${q.current} / ${q.goal})`);
          let statusColor = isDone ? 'var(--accent-green)' : (isReady ? 'var(--accent-green)' : 'var(--accent-gold)');
          let borderStyle = isDone ? 'var(--accent-green)' : (isReady ? 'var(--accent-green)' : 'var(--border-color)');

          const card = document.createElement('div');
          card.className = `quest-item-card ${isDone ? 'completed' : (isReady ? 'active-quest' : '')}`;
          card.style.cssText = `border-left: 3px solid ${borderStyle}; margin-bottom: 8px;`;

          let readyHtml = '';
          if (isReady) {
            readyHtml = `
              <div style="font-size:11.5px; color:var(--accent-green); margin:6px 0; font-weight:700;">
                🟢 Условия выполнены (${q.current}/${q.goal})! Вернитесь в лагерь и сдайте поручение лично: <b>${q.giver}</b>.
              </div>
              <button class="modal-btn primary" style="font-size:11.5px; padding:5px 12px; margin-top:4px;" onclick="Game.talkToNPC('${q.giverId}')">
                💬 Подойти к ${q.giver} для сдачи
              </button>
            `;
          }

          card.innerHTML = `
            <div class="quest-title-row" style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700;">${q.title}</span>
              <span style="font-size:11px; font-weight:700; color:${statusColor}">
                ${statusBadge}
              </span>
            </div>
            <div style="font-size:11px; color:var(--accent-blue); margin:2px 0 4px;">Поручитель: <b>${q.giver || 'Жители лагеря'}</b></div>
            <p class="quest-desc" style="margin-bottom:6px;">${q.desc}</p>
            ${readyHtml}
            <div style="font-size:11px; color:var(--accent-gold); background:rgba(0,0,0,0.25); padding:4px 8px; border-radius:4px; margin-top:4px;">
              🎁 Награда: +${q.rewardRep} репутации, +${q.rewardAmmo} патрона (выдаётся при личной сдаче)
            </div>
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
          <div class="quest-title-row"><span>🏕️ Основание лагеря «Всем ПОХ»</span></div>
          <p class="quest-desc">Александр Александрович («Саныч») вместе с Андреем «Атароном» собрали уцелевших рабочих, егерей, ученых и скитальцев на холме у старой продуваемой лесопилки. Для Саныча оптимизм — это не блажь, а железная воинская дисциплина, а строгость Атарона и сплочённость Совета Основателей помогли лагерю выстоять. Сегодня «Всем ПОХ» — единственный оплот надежды посреди отравленной сибирской тайги.</p>
        </div>
        <div class="quest-item-card">
          <div class="quest-title-row"><span>🧪 Тайна профессора Воронова</span></div>
          <p class="quest-desc">Главный научный руководитель проекта профессор Воронов остался в зоне бедствия, пытаясь разработать стабилизатор «Оптимист-7» для нейтрализации мутаций и распада. Его дневники и записи хранят ключ к спасению края от второго, окончательного взрыва реактора.</p>
        </div>
      `;
    }
  }

  // >>> MODULE: core/persistence.js (197 строк)
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
        if (parsed.mainQuestStep >= 1) {
          parsed.questFlags.met_sanych = true;
          parsed.questFlags.met_batya = true;
        }
        if (parsed.mainQuestStep >= 2) {
          parsed.questFlags.met_sanych = true;
          parsed.questFlags.met_batya = true;
          parsed.questFlags.met_sky = true;
          parsed.questFlags.met_anna = true;
          parsed.questFlags.met_chagron = true;
          parsed.questFlags.met_egor = true;
          parsed.questFlags.met_bob = true;
          parsed.questFlags.met_prokhor = true;
          parsed.questFlags.met_ataron = true;
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
        if (parsed.hasDog) parsed.questFlags.dog_house_built = true;
        if (parsed.questFlags.dog_house_built) parsed.hasDog = true;
        if (parsed.pumpWaterActive === undefined) parsed.pumpWaterActive = false;
        if (parsed.hasGeoCompass === undefined) parsed.hasGeoCompass = false;
        if (parsed.hasGeiger === undefined) parsed.hasGeiger = false;
        if (parsed.hasGeiger) parsed.questFlags.geiger_crafted = true;
        if (parsed.hasElectricTorch === undefined) parsed.hasElectricTorch = false;
        if (parsed.hasElectricTorch) parsed.questFlags.electric_torch_crafted = true;
        if (parsed.hasTozScope === undefined) parsed.hasTozScope = false;
        if (parsed.introSeen === undefined) {
          parsed.introSeen = (parsed.mainQuestStep > 0 || parsed.day > 1);
        }
        if (typeof parsed.timeOfDay !== 'number' || isNaN(parsed.timeOfDay)) {
          parsed.timeOfDay = 0;
        } else {
          parsed.timeOfDay = Math.max(0, parsed.timeOfDay % 4);
        }
        if (typeof parsed.day !== 'number' || isNaN(parsed.day) || parsed.day < 1) {
          parsed.day = 1;
        }
        if (!parsed.weather) parsed.weather = 'clear';
        parsed.statusEffects = parsed.statusEffects || {};
        parsed.campUpgrades = Object.assign({}, INITIAL_STATE.campUpgrades, parsed.campUpgrades || {});
        if (parsed.questFlags.dog_house_built || parsed.hasDog) {
          parsed.campUpgrades.kennel = true;
        }
        parsed.campStorage = parsed.campStorage || {};
        parsed.eventLog = Array.isArray(parsed.eventLog) ? parsed.eventLog : [];
        if (parsed.eventLog.length === 0) {
          parsed.eventLog.push({ id: 1, day: parsed.day || 1, time: parsed.timeOfDay || 0, text: 'Хроника лагеря начата.', category: 'story' });
        }
        
        // Нормализация индивидуальной репутации и новых квестовых систем
        parsed.npcRep = Object.assign({}, INITIAL_STATE.npcRep, parsed.npcRep || {});

        // Синхронизация старых и новых ключей репутации
        if (parsed.npcRep.batya !== undefined) {
          if (parsed.npcRep.sanych === undefined || parsed.npcRep.sanych === 15) parsed.npcRep.sanych = parsed.npcRep.batya;
          if (parsed.npcRep.ataron === undefined || parsed.npcRep.ataron === 15) parsed.npcRep.ataron = parsed.npcRep.batya;
        }
        if (parsed.npcRep.anna !== undefined) {
          if (parsed.npcRep.sky === undefined || parsed.npcRep.sky === 15) parsed.npcRep.sky = parsed.npcRep.anna;
        }
        if (parsed.npcRep.prokhor !== undefined) {
          if (parsed.npcRep.bob === undefined || parsed.npcRep.bob === 15) parsed.npcRep.bob = parsed.npcRep.prokhor;
        }
        if (parsed.npcRep.egor !== undefined) {
          if (parsed.npcRep.chagron === undefined || parsed.npcRep.chagron === 15) parsed.npcRep.chagron = parsed.npcRep.egor;
        }
        if (parsed.npcRep.spiridon !== undefined) {
          if (parsed.npcRep.margo === undefined || parsed.npcRep.margo === 5) parsed.npcRep.margo = parsed.npcRep.spiridon;
        }
        if (parsed.npcRep.sasha !== undefined) {
          if (parsed.npcRep.strong === undefined || parsed.npcRep.strong === 0) parsed.npcRep.strong = parsed.npcRep.sasha;
        }

        // Двусторонняя синхронизация псевдонимов
        parsed.npcRep.batya = parsed.npcRep.sanych;
        parsed.npcRep.anna = parsed.npcRep.sky;
        parsed.npcRep.prokhor = parsed.npcRep.bob;
        parsed.npcRep.egor = parsed.npcRep.chagron;
        parsed.npcRep.spiridon = parsed.npcRep.margo;
        parsed.npcRep.sasha = parsed.npcRep.strong;

        // Синхронизация флагов знакомства
        parsed.questFlags.met_sanych = parsed.questFlags.met_sanych || parsed.questFlags.met_batya || false;
        parsed.questFlags.met_ataron = parsed.questFlags.met_ataron || parsed.questFlags.met_batya || false;
        parsed.questFlags.met_sky = parsed.questFlags.met_sky || parsed.questFlags.met_anna || false;
        parsed.questFlags.met_bob = parsed.questFlags.met_bob || parsed.questFlags.met_prokhor || false;
        parsed.questFlags.met_chagron = parsed.questFlags.met_chagron || parsed.questFlags.met_egor || false;
        parsed.questFlags.met_margo = parsed.questFlags.met_margo || parsed.questFlags.met_spiridon || false;
        parsed.questFlags.met_strong = parsed.questFlags.met_strong || parsed.questFlags.met_sasha || false;
        parsed.questFlags.met_batya = parsed.questFlags.met_sanych;
        parsed.questFlags.met_anna = parsed.questFlags.met_sky;
        parsed.questFlags.met_prokhor = parsed.questFlags.met_bob;
        parsed.questFlags.met_egor = parsed.questFlags.met_chagron;
        parsed.questFlags.met_spiridon = parsed.questFlags.met_margo;
        parsed.questFlags.met_sasha = parsed.questFlags.met_strong;

        if (parsed.reputation && parsed.reputation > 50) {
          const bonus = Math.floor((parsed.reputation - 50) / 10);
          ['sanych', 'ataron', 'sky', 'bob', 'chagron', 'varya', 'batya', 'anna', 'prokhor', 'egor'].forEach(id => {
            if (parsed.npcRep[id] <= 15) parsed.npcRep[id] += Math.min(bonus, 35);
          });
          if (parsed.questFlags?.met_margo && parsed.npcRep.margo <= 5) {
            parsed.npcRep.margo += Math.min(bonus, 25);
            parsed.npcRep.spiridon = parsed.npcRep.margo;
          }
          if (parsed.questFlags?.met_strong && parsed.npcRep.strong <= 0) {
            parsed.npcRep.strong += Math.min(bonus, 25);
            parsed.npcRep.sasha = parsed.npcRep.strong;
          }
        }
        parsed.crossQuests = parsed.crossQuests || {};
        parsed.highRepQuests = parsed.highRepQuests || {};
        parsed.npcChatDay = parsed.npcChatDay || {};
        if (parsed.varyaStewClaimedDay === undefined) parsed.varyaStewClaimedDay = -1;
        if (parsed.varyaWaterClaimedDay === undefined) parsed.varyaWaterClaimedDay = -1;
        if (parsed.dogPetClaimedDay === undefined) parsed.dogPetClaimedDay = -1;

        state = Object.assign(state, parsed);
      }
    } catch(e) {}
  }

  function resetGame() {
    try {
      localStorage.removeItem('camp_zarya_save');
    } catch(e) {}
    for (const key in state) delete state[key];
    Object.assign(state, JSON.parse(JSON.stringify(INITIAL_STATE)));
    state.introSeen = false;
    closeModal();
    init();
  }

  // >>> MODULE: main.js (161 строк)
  // --- ИНИЦИАЛИЗАЦИЯ И ОБНОВЛЕНИЕ UI ---
  function init() {
    initAudio();
    loadSavedState();
    try {
      const savedBg = localStorage.getItem('camp_bg_theme') || 'camp';
      applyBgTheme(savedBg);
    } catch(e) {}
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
      toast('🏕️ Добро пожаловать обратно в Лагерь «Всем ПОХ»!');
    }
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
      const curSrc = MUSIC_TRACKS[currentTrackIndex].src;
      if (!bgMusicEl.src || !bgMusicEl.src.includes(curSrc)) {
        bgMusicEl.src = curSrc;
      }
      bgMusicEl.volume = musicVolume;
      bgMusicEl.play().catch(() => {});
    }
    updateMusicUI();

    toast('🏕️ Вы прибыли в лагерь «Всем ПОХ»! Поговорите с Санычем в штабе.');
    if (state.mainQuestStep === 0) {
    }
  }

  // Запуск при загрузке страницы
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', init);
  }

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
    nextMusicTrack,
    MUSIC_TRACKS,
    getCurrentTrackIndex: () => currentTrackIndex,
    openSystemMenu,
    resetGame,
    showIntroScreen,
    hideIntroScreen,
    setMusicFromIntro,
    startGameFromIntro,
    saveState,
    loadSavedState,
    talkToNPC,
    talkSanych,
    talkAtaron,
    talkSky,
    talkBob,
    talkChagron,
    talkMargo,
    talkStrong,
    talkVarya,
    interactWithDog,
    talkBatya,
    talkAnna,
    talkProkhor,
    talkEgor,
    talkSpiridon,
    talkSasha,
    getNpcRep,
    getNpcRepTitle,
    changeNpcRep,
    openNpcChat,
    turnInDailyQuest,
    setBgTheme,
    applyBgTheme,
    openJournal,
    openCampUpgrades,
    buildCampUpgrade,
    openCampStorage,
    transferToStorage,
    transferFromStorage,
    toast,
    get state() { return state; },
    getState: () => state,
    addItem,
    removeItem,
    getItemCount,
    useItem,
    passTime,
    onNewDay,
    updateHUD,
    openLocationModal,
    quickDrinkWater,
    quickRest,
    quickUseAntirad,
    LOCATIONS,
    ITEMS,
    NPCS,
    RECIPES,
    WEATHER_TYPES,
    NPC_WEATHER_QUOTES,
    getNpcWeatherQuote,
    SIDE_QUESTS,
    doFishing,
    doGatherWood,
    doGatherHerbs,
    doGatherMoss
  };

})();

