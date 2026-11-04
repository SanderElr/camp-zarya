  // --- СИСТЕМА КВЕСТОВ И ЕЖЕДНЕВНЫХ ЗАДАНИЙ ---
  const DAILY_GIVER_MAP = {
    daily_fish: { giver: 'Егор Лесник', giverId: 'egor' },
    daily_wood: { giver: 'Прохор Кузьмич', giverId: 'prokhor' },
    daily_herbs: { giver: 'Анна Павловна', giverId: 'anna' },
    daily_berries: { giver: 'Варя (Полевой повар)', giverId: 'varya' },
    daily_water: { giver: 'Варя (Полевой повар)', giverId: 'varya' }
  };

  function generateDailyQuestsIfNeeded(force = false) {
    if (state.dailyQuests.length > 0 && !force) {
      state.dailyQuests.forEach(q => {
        if (!q.giver && DAILY_GIVER_MAP[q.id]) {
          q.giver = DAILY_GIVER_MAP[q.id].giver;
          q.giverId = DAILY_GIVER_MAP[q.id].giverId;
        }
      });
      return;
    }

    // Проверяем уровень репутации жителей для улучшенных наград
    const egorRep = getNpcRep('egor');
    const prokhorRep = getNpcRep('prokhor');
    const annaRep = getNpcRep('anna');
    const varyaRep = getNpcRep('varya');

    state.dailyQuests = [
      { 
        id: 'daily_fish', type: 'fish', 
        title: egorRep >= 50 ? '🐟 Царский улов' : 'Рыбный день', 
        giver: 'Егор Лесник', giverId: 'egor', 
        desc: egorRep >= 50 ? 'Поймать 3 отборные рыбы на реке Быстрянке для старого следопыта.' : 'Поймать 2 рыбы на реке Быстрянке.', 
        goal: egorRep >= 50 ? 3 : 2, current: 0, 
        rewardRep: egorRep >= 50 ? 25 : 15, 
        rewardAmmo: egorRep >= 50 ? 3 : 2, 
        completed: false, notifiedReady: false, 
        isUpgraded: egorRep >= 50 
      },
      { 
        id: 'daily_wood', type: 'wood', 
        title: prokhorRep >= 50 ? '🌲 Отборная сушина' : 'Дрова для костра', 
        giver: 'Прохор Кузьмич', giverId: 'prokhor', 
        desc: prokhorRep >= 50 ? 'Заготовить 3 плотных полена для кузнечного горна Кузьмича.' : 'Заготовить 2 охапки сухих дров.', 
        goal: prokhorRep >= 50 ? 3 : 2, current: 0, 
        rewardRep: prokhorRep >= 50 ? 20 : 10, 
        rewardAmmo: prokhorRep >= 50 ? 2 : 1, 
        completed: false, notifiedReady: false, 
        isUpgraded: prokhorRep >= 50 
      },
      { 
        id: 'daily_herbs', type: 'herbs', 
        title: annaRep >= 50 ? '🌿 Чистый аптечный сбор' : 'Аптечный сбор', 
        giver: 'Анна Павловна', giverId: 'anna', 
        desc: annaRep >= 50 ? 'Собрать 3 пучка душистой полыни и чабреца для медпункта.' : 'Собрать 2 пучка полыни для лазарета Анны.', 
        goal: annaRep >= 50 ? 3 : 2, current: 0, 
        rewardRep: annaRep >= 50 ? 25 : 15, 
        rewardAmmo: annaRep >= 50 ? 3 : 2, 
        completed: false, notifiedReady: false, 
        isUpgraded: annaRep >= 50 
      },
      { 
        id: 'daily_berries', type: 'berries', 
        title: varyaRep >= 50 ? '🍒 Таёжный ягодный запас' : 'Ягоды для котла', 
        giver: 'Варя (Полевой повар)', giverId: 'varya', 
        desc: varyaRep >= 50 ? 'Собрать 3 порции брусники для лагерного киселя и витаминного взвара.' : 'Собрать 2 порции лесной брусники для полевой кухни.', 
        goal: varyaRep >= 50 ? 3 : 2, current: 0, 
        rewardRep: varyaRep >= 50 ? 20 : 12, 
        rewardAmmo: varyaRep >= 50 ? 2 : 1, 
        completed: false, notifiedReady: false, 
        isUpgraded: varyaRep >= 50 
      }
    ];
  }

  function checkDailyProgress(type, amount) {
    state.dailyQuests.forEach(q => {
      if (!q.completed && q.type === type) {
        q.current += amount;
        if (q.current >= q.goal) {
          if (!q.notifiedReady) {
            q.notifiedReady = true;
            const giverInfo = q.giver ? ` Сдайте его ${q.giver} в лагере.` : ' Сдайте его в лагере.';
            toast(`📋 Поручение «${q.title}» готово к сдаче (${Math.min(q.current, q.goal)}/${q.goal})!${giverInfo}`);
            sfx.playSuccess();
          }
        }
      }
    });
    renderQuests();
  }

  function turnInDailyQuest(questId) {
    const q = (state.dailyQuests || []).find(x => x.id === questId);
    if (!q || q.completed || q.current < q.goal) return false;

    q.completed = true;
    state.reputation += q.rewardRep;
    addItem('ammo', q.rewardAmmo);

    // Рост индивидуальной репутации у конкретного жителя
    if (q.giverId) {
      changeNpcRep(q.giverId, Math.max(5, Math.round(q.rewardRep * 0.8)));
    }

    toast(`🎖️ Поручение «${q.title}» успешно сдано! Получено: +${q.rewardRep} репутации, +${q.rewardAmmo} патрона.`, 'success');
    sfx.playSuccess();
    updateHUD();
    renderQuests();
    saveState();
    return true;
  }

  function switchQuestView(view) {
    sfx.init();
    sfx.playClick();
    state.questView = view;
    document.querySelectorAll('.quest-subtab').forEach(b => {
      const match = b.getAttribute('onclick')?.includes(`'${view}'`);
      b.classList.toggle('active', !!match);
    });
    renderQuests();
  }

  

  function renderQuests() {
    const area = document.getElementById('questContentArea');
    if (!area) return;
    area.innerHTML = '';

    if (!state.questFlags) {
      state.questFlags = JSON.parse(JSON.stringify(INITIAL_STATE.questFlags));
    }

    if (state.questView === 'main') {
      const completedCount = MAIN_QUESTS.filter(q => state.mainQuestStep > q.step || (q.step === 19 && state.mainQuestStep >= 20)).length;
      const progressPct = Math.round((completedCount / MAIN_QUESTS.length) * 100);

      const headerDiv = document.createElement('div');
      headerDiv.className = 'quest-campaign-header';
      headerDiv.style.cssText = 'background:var(--bg-card); border:1px solid var(--border-color); border-radius:6px; padding:10px 12px; margin-bottom:12px;';
      headerDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:700; font-size:13px; color:var(--accent-gold);">📜 Основной сюжет: Спасение «Зари»</span>
          <span style="font-weight:700; font-size:12px; color:var(--text-main);">${completedCount} / ${MAIN_QUESTS.length} (${progressPct}%)</span>
        </div>
        <div style="background:rgba(0,0,0,0.4); border-radius:4px; height:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
          <div style="background:linear-gradient(90deg, var(--accent-gold), var(--accent-green)); height:100%; width:${progressPct}%; transition:width 0.3s ease;"></div>
        </div>
        ${state.mainQuestStep >= 20 ? '<div style="margin-top:6px; font-size:11.5px; color:var(--accent-green); font-weight:700; text-align:center;">🏆 Вся сага из 20 квестов завершена! Вы — Легенда тайги.</div>' : ''}
      `;
      area.appendChild(headerDiv);

      let currentAct = 0;

      MAIN_QUESTS.forEach(q => {
        const isDone = state.mainQuestStep > q.step || (q.step === 19 && state.mainQuestStep >= 20);
        const isCurrent = state.mainQuestStep === q.step;
        const isLocked = state.mainQuestStep < q.step;

        if (q.actNum !== currentAct) {
          currentAct = q.actNum;
          const actHeader = document.createElement('div');
          actHeader.className = 'quest-act-header';
          actHeader.style.cssText = 'margin:14px 0 6px; font-weight:700; font-size:11.5px; letter-spacing:0.5px; text-transform:uppercase; color:var(--accent-gold); display:flex; align-items:center; gap:8px;';
          actHeader.innerHTML = `
            <span>${q.act}</span>
            <span style="flex:1; height:1px; background:var(--border-color); opacity:0.6;"></span>
          `;
          area.appendChild(actHeader);
        }

        const card = document.createElement('div');
        card.className = `quest-item-card ${isDone ? 'completed' : (isCurrent ? 'active-quest' : '')}`;

        let checklistHtml = '';
        if (!isLocked) {
          const items = q.checklist(state);
          checklistHtml = `
            <div class="quest-checklist" style="margin-top:8px; font-size:12px; display:flex; flex-direction:column; gap:4px;">
              ${items.map(item => `
                <div style="color:${item.done ? 'var(--accent-green)' : 'var(--text-main)'}; display:flex; align-items:center; gap:6px;">
                  <span>${item.done ? '☑' : '☐'}</span>
                  <span style="${item.done ? 'text-decoration:line-through; opacity:0.8;' : 'font-weight:500;'}">${item.text}</span>
                </div>
              `).join('')}
            </div>
          `;
        }

        let hintHtml = '';
        if (isCurrent && q.hint) {
          hintHtml = `
            <div style="margin-top:8px; padding:6px 8px; background:rgba(217, 119, 6, 0.15); border-left:3px solid var(--accent-gold); border-radius:4px; font-size:11.5px; color:var(--accent-gold);">
              <strong>💡 Задачи:</strong> ${q.hint}
            </div>
          `;
        }

        card.innerHTML = `
          <div class="quest-title-row">
            <span style="font-weight:700;">${q.title}</span>
            <span style="font-size:11px; font-weight:600; color:${isDone ? 'var(--accent-green)' : (isCurrent ? 'var(--accent-gold)' : 'var(--text-dim)')}">
              ${isDone ? '✓ Выполнено' : (isCurrent ? '● В процессе' : '🔒 Закрыто')}
            </span>
          </div>
          <div style="font-size:11px; color:var(--text-dim); margin-bottom:4px;">Поручитель: <b style="color:var(--text-main);">${q.giver}</b></div>
          <p class="quest-desc" style="margin-top:2px;">${isLocked ? 'Станет доступно по мере развития сюжетной цепочки.' : q.desc}</p>
          ${checklistHtml}
          ${hintHtml}
        `;
        area.appendChild(card);
      });
        } else if (state.questView === 'side') {
      const completedCount = SIDE_QUESTS.filter(q => q.isDone(state)).length;
      const progressPct = Math.round((completedCount / SIDE_QUESTS.length) * 100);

      const headerDiv = document.createElement('div');
      headerDiv.className = 'quest-campaign-header';
      headerDiv.style.cssText = 'background:var(--bg-card); border:1px solid var(--border-color); border-radius:6px; padding:10px 12px; margin-bottom:12px;';
      headerDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-weight:700; font-size:13px; color:var(--accent-gold);">📜 Дополнительные задания и тайны Зоны</span>
          <span style="font-weight:700; font-size:12px; color:var(--text-main);">${completedCount} / ${SIDE_QUESTS.length} (${progressPct}%)</span>
        </div>
        <div style="background:rgba(0,0,0,0.4); border-radius:4px; height:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
          <div style="background:linear-gradient(90deg, #3498db, var(--accent-green)); height:100%; width:${progressPct}%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:11px; color:var(--text-dim); margin-top:6px;">
          Поручения лагеря, исследования отдалённых локаций, цепочки историй и союзники.
        </div>
      `;
      area.appendChild(headerDiv);

      // Дашборд индивидуальной репутации жителей лагеря
      const repBox = document.createElement('div');
      repBox.style.cssText = 'background:rgba(0,0,0,0.3); border:1px solid var(--border-dim); border-radius:6px; padding:10px; margin-bottom:12px;';
      let repRows = '';
      Object.entries(NPCS).forEach(([id, npc]) => {
        if (id === 'spiridon' && !state.questFlags?.met_spiridon) return;
        if (id === 'sasha' && !state.questFlags?.met_sasha) return;
        const repVal = getNpcRep(id);
        const tier = getNpcRepTitle(repVal);
        const firstName = npc.name.split(' ')[0];
        repRows += `
          <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:11.5px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <img src="${npc.avatar}" style="width:20px; height:20px; border-radius:3px; object-fit:cover;" alt="">
              <span style="color:#fff; font-weight:bold;">${firstName}</span>
              <span style="font-size:10px; color:var(--text-dim);">(${npc.role})</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color:${tier.color}; font-weight:bold; font-size:11px;">${tier.icon} ${tier.title}</span>
              <span style="color:var(--accent-gold); font-size:11px; font-family:monospace; min-width:32px; text-align:right;">${repVal}</span>
            </div>
          </div>
        `;
      });
      repBox.innerHTML = `
        <div style="font-family:Russo One,sans-serif; font-size:12px; color:var(--accent-gold); margin-bottom:6px; display:flex; justify-content:space-between;">
          <span>🤝 Отношения с жителями лагеря</span>
          <span style="font-size:10px; color:var(--text-dim); font-family:sans-serif;">Репутация открывает союзы и уникальные квесты</span>
        </div>
        ${repRows}
      `;
      area.appendChild(repBox);

      const categories = [
        { id: 'cross', name: '⚔️ Союзы жителей (Пересекающиеся цепочки)' },
        { id: 'high_rep', name: '⭐ Квесты высокой репутации (70+)' },
        { id: 'camp', name: '⛺ Поручения жителей лагеря' },
        { id: 'location', name: '🗺️ Тайны открытых локаций' },
        { id: 'story', name: '📖 Сюжетные цепочки историй' },
        { id: 'npc', name: '🤝 Союзники и новые механики' }
      ];

      categories.forEach(cat => {
        const catQuests = SIDE_QUESTS.filter(q => q.category === cat.id);
        const catCompleted = catQuests.filter(q => q.isDone(state)).length;

        const catTitle = document.createElement('div');
        catTitle.style.cssText = 'font-family:Russo One,sans-serif; font-size:12px; color:var(--accent-gold); margin:12px 0 6px 2px; display:flex; justify-content:space-between;';
        catTitle.innerHTML = `<span>${cat.name}</span> <span style="font-size:11px; color:var(--text-dim);">${catCompleted} / ${catQuests.length}</span>`;
        area.appendChild(catTitle);

        catQuests.forEach(q => {
          const isCompleted = q.isDone(state);
          const sq = state.sideQuests?.[q.id];
          const isActive = sq && sq.status === 'active';

          let statusBadge = '⏳ Доступно';
          let statusColor = 'var(--accent-gold)';
          let statusBorder = isCompleted ? 'var(--accent-green)' : 'var(--accent-blue)';
          let progressDetail = '';

          if (isCompleted) {
            statusBadge = '✓ Выполнено (Сдано)';
            statusColor = 'var(--accent-green)';
            statusBorder = 'var(--accent-green)';
          } else if (q.id === 'chain_dog') {
            if (!state.questFlags?.wolves_defeated) {
              statusBadge = '🔒 После победы над вожаком';
              statusColor = 'var(--text-dim)';
              statusBorder = 'rgba(255,255,255,0.15)';
              progressDetail = `<div style="font-size:11.5px; color:var(--text-dim); margin:3px 0 5px;">🔒 Станет доступно после разгрома волчьего логова и победы над вожаком в Ближнем лесу.</div>`;
            } else if (!state.questFlags?.pup_rescued) {
              statusBadge = '● Спасти щенка';
              statusColor = 'var(--accent-gold)';
              statusBorder = 'var(--accent-gold)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-gold); margin:3px 0 5px;">🐾 В малиннике Ближнего леса раздаётся жалобный скулёж — освободите щенка из капкана (нужен бинт).</div>`;
            } else if (!state.hasDog) {
              statusBadge = '● Построить конуру';
              statusColor = 'var(--accent-blue)';
              statusBorder = 'var(--accent-blue)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-blue); margin:3px 0 5px;">🏠 Щенок в лагере! Сколотите тёплую будку для Бурана на верстаке (3 дров, 1 проволока, 1 кожа).</div>`;
            }
          } else if (q.id === 'chain_geo') {
            if (!state.questFlags?.met_spiridon) {
              statusBadge = '🔒 До встречи со Спиридоном';
              statusColor = 'var(--text-dim)';
              statusBorder = 'rgba(255,255,255,0.15)';
              progressDetail = `<div style="font-size:11.5px; color:var(--text-dim); margin:3px 0 5px;">🔒 Станет доступно после встречи с дедом Спиридоном на заимке в Гнилой гати (Болота).</div>`;
            } else if (!state.questFlags?.geo1_done) {
              statusBadge = '● Шаг 1: Скала в лесу';
              statusColor = 'var(--accent-gold)';
              statusBorder = 'var(--accent-gold)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-gold); margin:3px 0 5px;">📍 По наводке Спиридона поднимитесь на скалу в Ближнем лесу и осмотрите геодезический триангулятор.</div>`;
            } else if (!state.questFlags?.geo2_done) {
              statusBadge = '● Шаг 2: Скважина №7';
              statusColor = 'var(--accent-gold)';
              statusBorder = 'var(--accent-gold)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-gold); margin:3px 0 5px;">⛏️ Отправляйтесь на Реку Быстрянку и отыщите заиленную скважину №7 по карте геологов.</div>`;
            } else if (!state.hasGeoCompass) {
              statusBadge = '● Шаг 3: Собрать компас';
              statusColor = 'var(--accent-blue)';
              statusBorder = 'var(--accent-blue)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-blue); margin:3px 0 5px;">🧭 Керн с аномальным минералом у вас! Поговорите с Прохором в лагере, чтобы собрать компас.</div>`;
            }
          } else if (isActive) {
            let ready = false;
            let info = '';
            if (q.id === 'sq_wood_anna') {
              const c = getItemCount('firewood');
              ready = c >= 4;
              info = `Дрова: ${c}/4`;
            } else if (q.id === 'sq_fish_egor') {
              const f = getItemCount('raw_fish');
              const w = getItemCount('firewood');
              ready = f >= 3 && w >= 2;
              info = `Рыба: ${f}/3, Дрова: ${w}/2`;
            } else if (q.id === 'sq_water_batya') {
              const c = getItemCount('clean_water');
              ready = c >= 3;
              info = `Чистая вода: ${c}/3`;
            } else if (q.id === 'sq_berries_anna') {
              const c = getItemCount('berries');
              ready = c >= 3;
              info = `Брусника: ${c}/3`;
            } else if (q.id === 'sq_coal_prokhor') {
              const c = getItemCount('scrap');
              ready = c >= 2;
              info = `Лом: ${c}/2`;
            } else if (q.id === 'sq_snare_egor') {
              const c = getItemCount('raw_meat');
              ready = c >= 1;
              info = `Мясо: ${c}/1`;
            } else if (q.id === 'sq_medkit_anna') {
              const b = getItemCount('bandage');
              const h = getItemCount('herbs');
              ready = b >= 2 && h >= 1;
              info = `Бинты: ${b}/2, Травы: ${h}/1`;
            } else if (q.id === 'sq_watch_batya') {
              const isNight = isNightTime(state.timeOfDay);
              const hasTorch = getItemCount('torch') > 0 || getItemCount('electric_torch') > 0;
              ready = isNight && hasTorch;
              info = isNight ? 'Ночь наступила!' : 'Ждите ночи';
            } else if (q.id === 'spiridon_mushrooms') {
              const c = getItemCount('amanita');
              ready = c >= 3;
              info = `Мухоморы: ${c}/3`;
            }

            if (ready) {
              statusBadge = '🟢 Готово к сдаче!';
              statusColor = 'var(--accent-green)';
              statusBorder = 'var(--accent-green)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-green); margin:3px 0 5px; font-weight:700;">🟢 Все предметы собраны! Вернитесь в лагерь и сдайте поручение: ${q.giver}.</div>`;
            } else {
              statusBadge = `● В процессе (${info || 'выполняется'})`;
              statusColor = 'var(--accent-gold)';
              statusBorder = 'var(--accent-gold)';
              progressDetail = `<div style="font-size:11.5px; color:var(--accent-gold); margin:3px 0 5px;">● Собрано: <b>${info}</b>. Сдаётся лично у: <b>${q.giver}</b>.</div>`;
            }
          }

          const card = document.createElement('div');
          card.className = `quest-item-card ${isCompleted ? 'completed' : ''}`;
          card.style.cssText = `border-left: 3px solid ${statusBorder}; margin-bottom:8px;`;
          card.innerHTML = `
            <div class="quest-title-row" style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; font-size:13px; color:${isCompleted ? 'var(--accent-green)' : 'var(--text-main)'};">${q.title}</span>
              <span style="font-size:11px; font-weight:700; color:${statusColor};">
                ${statusBadge}
              </span>
            </div>
            <div style="font-size:11px; color:var(--accent-blue); margin:2px 0 4px;">Квестодатель: <b>${q.giver}</b></div>
            <p class="quest-desc" style="font-size:12px; margin-bottom:6px;">${q.desc}</p>
            ${progressDetail}
            <div style="font-size:11px; color:var(--accent-gold); background:rgba(0,0,0,0.25); padding:4px 8px; border-radius:4px;">
              🎁 Награда: ${q.reward}
            </div>
          `;
          area.appendChild(card);
        });
      });

    } else if (state.questView === 'daily') {
      if (!state.dailyQuests || state.dailyQuests.length === 0) {
        area.innerHTML = `
          <div class="quest-item-card" style="text-align:center; padding:16px;">
            <p class="quest-desc">Нет активных ежедневных поручений. Дождитесь следующего утра или проверьте доску объявлений у костра.</p>
          </div>
        `;
      } else {
        state.dailyQuests.forEach(q => {
          if (!q.giver && DAILY_GIVER_MAP[q.id]) {
            q.giver = DAILY_GIVER_MAP[q.id].giver;
            q.giverId = DAILY_GIVER_MAP[q.id].giverId;
          }
          const isDone = !!q.completed;
          const isReady = !isDone && q.current >= q.goal;

          let statusBadge = isDone ? '✓ Сдано (Награда получена)' : (isReady ? '🟢 Готово к сдаче!' : `● В процессе (${q.current} / ${q.goal})`);
          let statusColor = isDone ? 'var(--accent-green)' : (isReady ? 'var(--accent-green)' : 'var(--accent-gold)');
          let borderStyle = isDone ? 'var(--accent-green)' : (isReady ? 'var(--accent-green)' : 'var(--border-color)');

          const card = document.createElement('div');
          card.className = `quest-item-card ${isDone ? 'completed' : (isReady ? 'active-quest' : '')}`;
          card.style.cssText = `border-left: 3px solid ${borderStyle}; margin-bottom: 8px;`;

          let readyHtml = '';
          if (isReady) {
            readyHtml = `
              <div style="font-size:11.5px; color:var(--accent-green); margin:6px 0; font-weight:700;">
                🟢 Условия выполнены (${q.current}/${q.goal})! Вернитесь в лагерь и сдайте поручение лично: <b>${q.giver}</b>.
              </div>
              <button class="modal-btn primary" style="font-size:11.5px; padding:5px 12px; margin-top:4px;" onclick="Game.talkToNPC('${q.giverId}')">
                💬 Подойти к ${q.giver} для сдачи
              </button>
            `;
          }

          card.innerHTML = `
            <div class="quest-title-row" style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700;">${q.title}</span>
              <span style="font-size:11px; font-weight:700; color:${statusColor}">
                ${statusBadge}
              </span>
            </div>
            <div style="font-size:11px; color:var(--accent-blue); margin:2px 0 4px;">Поручитель: <b>${q.giver || 'Жители лагеря'}</b></div>
            <p class="quest-desc" style="margin-bottom:6px;">${q.desc}</p>
            ${readyHtml}
            <div style="font-size:11px; color:var(--accent-gold); background:rgba(0,0,0,0.25); padding:4px 8px; border-radius:4px; margin-top:4px;">
              🎁 Награда: +${q.rewardRep} репутации, +${q.rewardAmmo} патрона (выдаётся при личной сдаче)
            </div>
          `;
          area.appendChild(card);
        });
      }
    } else if (state.questView === 'lore') {
      area.innerHTML = `
        <div class="quest-item-card">
          <div class="quest-title-row"><span>📻 История Катастрофы («Каскад»)</span></div>
          <p class="quest-desc">В конце 1980-х годов в закрытом исследовательском комплексе НИИ «Сфера» произошла аномальная авария реактора синтеза. Заражённые токсичные воды и радиоактивный смог накрыли прилегающую тайгу. Жилые посёлки были эвакуированы, а оставшиеся превратились в изолированные очаги выживания.</p>
        </div>
        <div class="quest-item-card">
          <div class="quest-title-row"><span>🏕️ Основание лагеря «Заря»</span></div>
          <p class="quest-desc">Майор Дмитрий («Батя») собрал уцелевших рабочих, егерей и семьи на холме у старой лесопилки. Благодаря возвышенности и бьющим родникам лагерь выстоял. Сегодня «Заря» — единственный оплот надежды посреди отравленной сибирской тайги.</p>
        </div>
        <div class="quest-item-card">
          <div class="quest-title-row"><span>🧪 Тайна профессора Воронова</span></div>
          <p class="quest-desc">Главный научный руководитель проекта профессор Воронов остался в зоне бедствия, пытаясь разработать биостабилизатор «Нектар-7» для нейтрализации мутаций и распада. Его дневники и записи хранят ключ к спасению края от второго, окончательного взрыва реактора.</p>
        </div>
      `;
    }
  }
