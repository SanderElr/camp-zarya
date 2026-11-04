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
