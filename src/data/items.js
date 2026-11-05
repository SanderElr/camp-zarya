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
    trap: { id: 'trap', name: 'Охотничий капкан', type: 'tool', icon: 'assets/images/trap.png', weight: 1.5, desc: 'Стальной капкан на мелкую и среднюю дичь.' },
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
