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

    openModal('ОБУСТРОЙСТВО ЛАГЕРЯ', 'Инфраструктура базы «Заря»', 'assets/images/cabin.png', html, [
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

    openModal('ЛАГЕРНЫЙ СУНДУК', 'Хранилище базы «Заря»', 'assets/images/food_box.png', html, [
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
