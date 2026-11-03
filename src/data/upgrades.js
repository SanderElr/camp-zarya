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
