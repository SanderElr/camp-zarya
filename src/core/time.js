
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
