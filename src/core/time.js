
  // Переход времени и естественная трата ресурсов
  function passTime(steps = 1, hungerCost = 5, thirstCost = 8) {
    const numSteps = (typeof steps === 'number' && !isNaN(steps)) ? steps : 1;
    state.timeOfDay = (Number(state.timeOfDay) || 0) + numSteps;
    while (state.timeOfDay >= 4) {
      state.timeOfDay -= 4;
      state.day = (Number(state.day) || 1) + 1;
      onNewDay();
    }
    state.timeOfDay = Math.round(state.timeOfDay * 10) / 10;

    state.hunger = Math.max(0, state.hunger - hungerCost * steps);
    state.thirst = Math.max(0, state.thirst - thirstCost * steps);

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
    // Генерация погоды на день
    const weatherRoll = Math.random();
    let newWeather = 'clear';
    if (weatherRoll < 0.40) newWeather = 'clear';
    else if (weatherRoll < 0.65) newWeather = 'rain';
    else if (weatherRoll < 0.80) newWeather = 'fog';
    else if (weatherRoll < 0.90) newWeather = 'freeze';
    else newWeather = 'storm';
    state.weather = newWeather;
    const wInfo = WEATHER_TYPES[newWeather] || WEATHER_TYPES.clear;

    toast(`🌅 Наступил День ${state.day}. Погода: ${wInfo.icon} ${wInfo.name}`);
    logEvent(`🌅 Наступил День ${state.day}. Погода: ${wInfo.icon} ${wInfo.name}. ${wInfo.desc}`, 'camp');

    generateDailyQuestsIfNeeded(true);
    // Проверка ловушек
    if (state.trapsSet > 0) {
      const caughtMeat = Math.floor(Math.random() * state.trapsSet * 2) + 1;
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
    if (state.campUpgrades?.rain_collector && (newWeather === 'rain' || newWeather === 'storm' || newWeather === 'fog')) {
      addItem('clean_water', 2);
      toast('🪣 Навес-водосборник наполнил +2 фляги чистой дождевой воды!');
      logEvent('🪣 Навес-водосборник собрал +2 фляги чистой дождевой воды', 'camp');
    }
    // Лагерная таёжная сушилка (drying_rack)
    if (state.campUpgrades?.drying_rack) {
      if (getItemCount('raw_fish') >= 1) {
        removeItem('raw_fish', 1);
        addItem('dried_fish', 1);
        toast('🐟 Таёжная сушилка завялила +1 рыбу!');
        logEvent('🐟 Таёжная сушилка завялила +1 рыбу', 'camp');
      } else if (getItemCount('herbs') >= 1) {
        removeItem('herbs', 1);
        addItem('dried_berries', 1);
        toast('🫐 Таёжная сушилка высушила порцию лесных ягод!');
        logEvent('🫐 Таёжная сушилка высушила порцию лесных ягод', 'camp');
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

