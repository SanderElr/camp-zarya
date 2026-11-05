  // --- МЕНЮ СИСТЕМЫ И НАСТРОЕК ---
  function openSystemMenu() {
    sfx.init();
    sfx.playClick();

    const title = '⚙️ МЕНЮ ВЫЖИВАНИЯ';
    const sub = 'Управление игрой и настройками';
    const curTrack = MUSIC_TRACKS[currentTrackIndex] || MUSIC_TRACKS[0];
    let body = `
      <div style="display:flex; flex-direction:column; gap:10px; margin:4px 0;">
        <!-- Секция аудио -->
        <div style="background:rgba(0,0,0,0.35); border:1px solid var(--border-dim); border-radius:6px; padding:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <b style="color:var(--accent-gold); font-size:12.5px;">🎵 Фоновая музыка</b>
            <span style="font-size:10.5px; color:var(--text-dim); font-family:monospace;">${currentTrackIndex + 1} / ${MUSIC_TRACKS.length}</span>
          </div>

          <!-- Название текущего трека -->
          <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:4px; padding:6px 8px; margin-bottom:8px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:14px;">📻</span>
            <span style="font-size:12px; color:var(--text-main); font-weight:bold; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
              ${curTrack.title}
            </span>
          </div>

          <!-- Кнопки управления: Воспроизведение + Переключение на следующий -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; margin-bottom:8px;">
            <button class="modal-btn" style="margin:0; padding:6px 10px; min-height:36px; font-weight:bold; justify-content:center; font-size:12px;" onclick="Game.toggleMusic(); Game.openSystemMenu();">
              ${musicEnabled ? '⏸️ Пауза' : '▶️ Играть'}
            </button>
            <button class="modal-btn" style="margin:0; padding:6px 10px; min-height:36px; font-weight:bold; justify-content:center; font-size:12px;" onclick="Game.nextMusicTrack(); Game.openSystemMenu();" title="Переключить на следующий трек">
              ⏭️ След. трек
            </button>
          </div>

          <div style="margin-top:6px;">
            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-dim); margin-bottom:4px;">
              <span>Громкость музыки:</span>
              <span id="musicVolDisplay" style="color:var(--accent-gold); font-weight:bold;">${Math.round(musicVolume * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value="${musicVolume}" 
                   style="width:100%; accent-color:var(--accent-gold); cursor:pointer;" 
                   oninput="Game.setMusicVolume(this.value)">
          </div>
        </div>

        <!-- Секция информации -->
        <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px 10px; font-size:11.5px; color:var(--text-dim); line-height:1.6;">
          <div>🏕️ <b>Лагерь «Всем ПОХ»</b> v1.3</div>
          <div>👤 Репутация: <b>${state.reputation}</b> (${getReputationTitle(state.reputation)})</div>
          <div>📅 День: <b>${state.day}</b> | Время: <b>${getTimeName(state.timeOfDay)}</b></div>
        </div>
      </div>
    `;

    const actions = [
      {
        text: '📜 Вводная история и памятка (Пролог)',
        action: () => {
          closeModal();
          showIntroScreen();
        }
      },
      {
        text: '🖼️ Фоновая атмосфера: выбор фона',
        action: () => showBackgroundPickerModal()
      },
      {
        text: '🔄 Начать игру заново (Сбросить прогресс)',
        action: () => confirmResetGame(),
        danger: true
      }
    ];

    openModal(title, sub, 'assets/images/cabin.png', body, actions);
  }

  function confirmResetGame() {
    const title = '⚠️ СБРОС ИГРЫ';
    const sub = 'Подтверждение очистки сохранения';
    const body = `
      <p style="color:var(--accent-danger); font-weight:bold; font-size:13px;">Внимание! Весь текущий прогресс будет удалён!</p>
      <p>Вы потеряете инвентарь, оружие, патроны, репутацию у выживших и выполненные сюжетные задания.</p>
      <p>Игра начнётся с чистого листа с Дня 1 у костра лагеря «Всем ПОХ».</p>
    `;
    const actions = [
      {
        text: '💀 Да, удалить всё и начать заново',
        action: () => {
          resetGame();
          toast('🔄 Игра сброшена. Добро пожаловать в лагерь «Всем ПОХ»!');
        },
        danger: true
      },
      {
        text: '↩️ Отмена (вернуться)',
        action: () => openSystemMenu()
      }
    ];
    openModal(title, sub, 'assets/images/cabin.png', body, actions);
  }

  const BG_THEMES = [
    { id: 'camp', name: '🏕️ Лагерь «Всем ПОХ» (Атмосфера общины)', desc: 'Панорама лагеря выживших с бревенчатыми постройками и костром', preview: 'assets/images/backgrounds/camp_alt.jpg' },
    { id: 'fog', name: '🌲 Таёжный туман (Утренняя мгла)', desc: 'Хвойная глухая тайга, скрытая радиационным туманом', preview: 'assets/images/backgrounds/taiga_fog.jpg' },
    { id: 'winter', name: '❄️ Зимняя тайга (Суровый мороз)', desc: 'Заснеженные сопки и ледяной сибирский бурелом', preview: 'assets/images/backgrounds/taiga_winter.jpg' },
    { id: 'map', name: '🗺️ Топографическая карта Зоны', desc: 'Военная топокарта с изолиниями и секторами катастрофы', preview: 'assets/images/backgrounds/map_topo.jpg' },
    { id: 'none', name: '⬛ Строгий тёмный (Без текстур)', desc: 'Классический минималистичный тёмный интерфейс', preview: '' }
  ];

  function applyBgTheme(themeId) {
    const valid = BG_THEMES.find(t => t.id === themeId) ? themeId : 'camp';
    document.body.setAttribute('data-bg-theme', valid);
    try {
      localStorage.setItem('camp_bg_theme', valid);
    } catch(e) {}
  }

  function showBackgroundPickerModal() {
    const currentTheme = document.body.getAttribute('data-bg-theme') || 'camp';
    const title = '🖼️ АТМОСФЕРНЫЕ ФОНЫ';
    const sub = 'Выбор фонового оформления игры';
    let body = `
      <p style="font-size:12px; color:var(--text-dim); margin-bottom:10px;">
        Выберите фоновую текстуру для погружения в атмосферу края:
      </p>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${BG_THEMES.map(t => `
          <div style="background:${t.id === currentTheme ? 'rgba(255, 190, 34, 0.15)' : 'rgba(0,0,0,0.35)'}; border:1px solid ${t.id === currentTheme ? 'var(--accent-gold)' : 'var(--border-dim)'}; border-radius:6px; padding:8px 10px; cursor:pointer;" onclick="Game.setBgTheme('${t.id}')">
            <div style="display:flex; gap:10px; align-items:center;">
              ${t.preview ? `<img src="${t.preview}" style="width:50px; height:38px; object-fit:cover; border-radius:4px; border:1px solid rgba(255,255,255,0.2); flex-shrink:0;">` : `<div style="width:50px; height:38px; background:#1b201d; border-radius:4px; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0;">⬛</div>`}
              <div style="flex:1;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:bold; font-size:12px; color:${t.id === currentTheme ? 'var(--accent-gold)' : 'var(--text-main)'};">${t.name}</span>
                  ${t.id === currentTheme ? '<span style="font-size:11px; color:var(--accent-gold); font-weight:bold;">✓ Выбран</span>' : ''}
                </div>
                <p style="font-size:11px; color:var(--text-dim); margin:2px 0 0;">${t.desc}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    const actions = [
      {
        text: '↩️ Назад в меню',
        action: () => openSystemMenu()
      }
    ];
    openModal(title, sub, 'assets/images/cabin.png', body, actions);
  }

  function setBgTheme(themeId) {
    applyBgTheme(themeId);
    toast('🖼️ Тема оформления обновлена!');
    showBackgroundPickerModal();
  }
