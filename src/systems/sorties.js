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
    state.reputation += 30;
    toast(`🐺 ВОЛЧЬЕ ЛОГОВО РАЗГРОМЛЕНО! Вожак повержен! Получен амулет «Волчий клык» (+5 к урону), 2 шкуры (${damage} урона)!`);
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
    state.reputation += 20;
    toast('🐾 ЩЕНОК СПАСЕН! Вы аккуратно разжали дуги ржавого капкана, промыли рану и перевязали щенка. Отнесите его Егору в лагерь!');
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
    addItem('ammo', 8);
    state.reputation += 35;
    toast('🚜 БРДМ-2 ОБСЛЕДОВАН! Найдены жетоны сержанта Гурова, патроны и офицерский планшет! Отнесите Бате.');
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
    state.reputation += 30;
    toast('✨ СВЕТЯЩИЙСЯ СФАГНУМ СОБРАН! Чистый экстракт спасет от любых ран и радиации! Отнесите Анне.');
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
    state.reputation += 35;
    passTime(1);
    toast('🚰 ДОННЫЙ ВЕНТИЛЬ ПОВЕРНУТ! Шлам сброшен! Теперь каждое утро лагерная колонка выдает +1 флягу чистой воды!');
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
    addItem('ammo', 12);
    addItem('wire', 2);
    state.reputation += 35;
    passTime(1);
    toast('🔐 СЕЙФ ВЗЛОМАН! Найдены чертежи разгрузки Кузьмина (+2.5 кг к вместимости), 12 патронов и проволока!');
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
    state.reputation += 30;
    passTime(1);
    toast('🏚️ ТАЙНИК В ПЕЧИ ОБНАРУЖЕН! Найден кожаный патронташ лесничего (+2.5 кг к весу) и 6 патронов ТОЗ!');
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
    state.reputation += 40;
    passTime(2);
    toast('🆘 СТРОНГ СПАСЕН! Вы перевязали раненого аналитика и помогли ему добраться до лагеря! Теперь Стронг наладит радиопеленг в «Всем ПОХ»!');
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
    state.reputation += 50;
    passTime(2);
    toast('📊 САМОПИСЕЦ ИЗВЛЕЧЕН! Архивные данные аварии и ценные радиодетали сняты со шпиля вышки (+50 репутации)!');
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
    state.reputation += 45;
    passTime(2);
    toast(`🐗 ВЕПРЬ-СЕКАЧ ПОВЕРЖЕН! Двустволка свалила гиганта (+4 мяса, +2 толстые шкуры, получено ${damage} урона)!`);
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
    state.reputation += 60;
    passTime(2);
    toast('🧬 СПЕЦХРАН «БИО-4» ВСКРЫТ! Извлечен армейский биостимулятор «Стимулятор-М» (+25 постоянной максимальной энергии)!');
    updateHUD();
    saveState();
    refreshLocationModal(loc);
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
    state.reputation += 25;
    toast('⛏️ СКВАЖИНА №7 РАСЧИЩЕНА! Со дна шурфа поднят запечатанный геологический керн с черным аномальным минералом! Покажите Прохору.');
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
    state.reputation += 20;
    toast('👣 СЛЕДЫ БАНДЫ «ХЛЫЩА» ОБНАРУЖЕНЫ! Найдены гильзы и нацарапанная на камне стрелка в сторону штольни на Скалистом утёсе!');
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
    addItem('ammo', 25);
    state.hasTozScope = true;
    state.reputation += 50;
    toast('🏴‍☠️ СХРОН МАРОДЕРОВ ВЗЯТ! Растяжка обезврежена! Найден коллиматорный прицел ТОЗ (+30% крит) и 25 патронов! Доложите Бате.');
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
    state.reputation += 20;
    toast('📦 ПАРАШЮТНЫЙ КОНТЕЙНЕР НАЙДЕН! Забрано: 2 банки тушёнки, 8 патронов и комплект батареек ААА (+20 репутации)!');
    updateHUD();
    saveState();
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
      cost += 10;
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
    state.energy -= energyCost;
    state.rad += radCost;
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
    toast('🧪 Набрана проба токсичной желтоватой воды. Отнесите Анне в лагерь!');
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
    addItem('firewood', 2);
    toast('🪵 Заготовлено 2 охапки сушняка для костра.');
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
    addItem('herbs', 2);
    addItem('berries', 1);
    toast('🌿 Нарвано 2 пучка целебных трав и горсть брусники.');
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
    toast('💥 СТАЯ ПСОВ РАЗБИТА! Вы отбились копьём (+2 мяса, +1 шкура). Доложите Бате!');
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
    addItem('swamp_moss', 2);
    toast('🌿 Собрано 2 пучка болотного сфагнума для фильтров и мазей.');
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
