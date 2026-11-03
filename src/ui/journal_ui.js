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
