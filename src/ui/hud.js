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
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && typeof document.querySelector === 'function') {
    window.addEventListener('resize', () => {
      const hud = document.querySelector('.hud-header');
      if (hud && document.documentElement) {
        document.documentElement.style.setProperty('--hud-height', hud.offsetHeight + 'px');
      }
    });
  }