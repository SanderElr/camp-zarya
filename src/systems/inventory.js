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
      } else if (itemId === 'antirad' || itemId === 'herbal_tea') {
        addStatusEffect('rad_shield', 4);
        toast('🛡️ Организм защищён барьером от радиации на 4 хода!');
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
      closeModal();
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
