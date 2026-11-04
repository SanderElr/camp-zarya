  // --- СИСТЕМА ИНДИВИДУАЛЬНОЙ РЕПУТАЦИИ У ЖИТЕЛЕЙ ЛАГЕРЯ ---
  function getNpcRep(npcId) {
    if (!state.npcRep) state.npcRep = {};
    if (state.npcRep[npcId] === undefined) {
      const defs = { batya: 15, anna: 15, prokhor: 15, egor: 15, varya: 15, spiridon: 5, sasha: 0 };
      state.npcRep[npcId] = defs[npcId] !== undefined ? defs[npcId] : 10;
    }
    return state.npcRep[npcId];
  }

  function getNpcRepTitle(rep) {
    if (rep < 25) return { title: 'Чужак', level: 1, color: '#9ca3af', icon: '⚪', attitude: '«Присматривается с настороженностью»' };
    if (rep < 50) return { title: 'Знакомый', level: 2, color: 'var(--accent-blue)', icon: '🔵', attitude: '«Считает надёжным и дельным человеком»' };
    if (rep < 80) return { title: 'Доверенный', level: 3, color: 'var(--accent-green)', icon: '🟢', attitude: '«Полное доверие и уважение»' };
    return { title: 'Побратим / Верный друг', level: 4, color: 'var(--accent-gold)', icon: '⭐', attitude: '«Готов стоять спиной к спине в любой беде»' };
  }

  function changeNpcRep(npcId, amount, notify = true) {
    if (!state.npcRep) state.npcRep = {};
    const current = getNpcRep(npcId);
    const oldTier = getNpcRepTitle(current);
    const newRep = Math.max(0, current + amount);
    state.npcRep[npcId] = newRep;
    const newTier = getNpcRepTitle(newRep);

    if (notify && amount !== 0) {
      const npcName = NPCS[npcId]?.name ? NPCS[npcId].name.split(' ')[0] : npcId;
      const sign = amount > 0 ? '+' : '';
      toast(`🤝 Репутация (${npcName}): ${sign}${amount} (${newTier.title}, ${newRep})`);
    }
    if (oldTier.level !== newTier.level && notify && amount > 0) {
      const npcName = NPCS[npcId]?.name || npcId;
      toast(`🎉 ${npcName} теперь считает вас: ${newTier.title}! Открыты новые возможности общины.`);
      sfx.playSuccess();
    }
    saveState();
    updateHUD();
  }

  function renderNpcRepHeader(npcId) {
    const rep = getNpcRep(npcId);
    const tier = getNpcRepTitle(rep);
    return `
      <div style="background:rgba(0,0,0,0.35); border:1px solid var(--border-dim); border-left:3px solid ${tier.color}; border-radius:4px; padding:6px 10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:11.5px; color:var(--text-dim);">
          Отношение: <strong style="color:${tier.color};">${tier.icon} ${tier.title} (${rep})</strong>
        </span>
        <span style="font-size:10px; color:${tier.color}; font-style:italic;">
          ${tier.attitude}
        </span>
      </div>
    `;
  }

  // --- ДУШЕВНЫЕ ДИАЛОГИ И ЛАГЕРНЫЕ НОВОСТИ («ПОБОЛТАТЬ») ---
  function openNpcChat(npcId) {
    const npc = NPCS[npcId];
    if (!npc) return;
    const rep = getNpcRep(npcId);
    const tier = getNpcRepTitle(rep);

    state.npcChatDay = state.npcChatDay || {};
    const chatKey = `${npcId}_${state.day}`;
    let bonusText = '';
    if (!state.npcChatDay[chatKey]) {
      state.npcChatDay[chatKey] = true;
      changeNpcRep(npcId, 3, false);
      bonusText = `<div style="color:var(--accent-green); font-size:11px; margin-top:8px;">🤝 ${npc.name.split(' ')[0]} оценил(а) душевную беседу (+3 к личной репутации)!</div>`;
    }

    let chatText = '';
    if (npcId === 'varya') {
      if (state.weather === 'freeze') {
        chatText = `<i>«Бр-р-р! Ну и мороз тут у вас в Сибири! В моём родном Брянске тоже зимы бывали лютые, но там хоть вековые дубравы от ветра закрывали, а здесь сквозь сосны стужа до костей продирает. Ты к жаровне ближе садись, погрей пальцы. Я в похлёбку чабреца да брусники бросила — мигом кровь разгонит! Слушай... а у тебя в подсумке патроны не звенят случайно? Какой у тебя калибр? Не семь шестьдесят два?..»</i>`;
      } else if (state.weather === 'rain') {
        chatText = `<i>«Опять ливень хлещет, вода с навеса водопадом льётся! В брянских лесах под таким дождём мы с дедом подосиновики вёдрами таскали, а тут из-за едких туманов лишний раз нос из палатки страшно высунуть. Хорошо хоть в котле ушица закипает. Слушай, пока дождь шумит... ты стреляные гильзы на вылазках не подбирал? Специфические такие, с проточкой у донца? Очень калибр один ищу!»</i>`;
      } else if (tier.level >= 3) {
        chatText = `<i>«Садись, я тебе с самого донышка навар зачерпну, с густым мясом! Знаешь... я ведь до сих пор вздрагиваю по ночам. Когда из Брянска бежала на восток, на старом мосту через Десну нас окружили бандиты. Загнали в тупик, шансов не было совсем... И тут из лесной чащи — хлёсткие, глухие выстрелы! Один, второй, третий... Нападавшие падали как подкошенные, точно в лоб! Я зажмурилась, а когда стрельба стихла — бандиты мертвы, а стрелок растворился в тумане, даже лица не показал. Только стреляные гильзы на мокром асфальте дымились... Он спас мне жизнь. Я ту гильзу на груди ношу как оберег и у каждого бойца калибр выспрашиваю — вдруг это был ты или его сослуживец? Ты для меня уже самым близким человеком в «Заре» стал...»</i>`;
      } else {
        chatText = `<i>«Привет! Садись к огоньку, сейчас миску налью. Я Варя, сама из Брянска. Поварскому ремеслу ещё дома училась, так что даже из топора и смолы наваристый суп сбацаю! Главное правило кухни: кто за дровами не ходит — тот за добавкой не тянется. Слушай, а ты с чем в рейды ходишь? Какой калибр у ствола? 5.45? 7.62? А может, тяжёлый винтовочный или гладкоствол?.. Скажи, это ужасно важно!»</i>`;
      }
    } else if (npcId === 'batya') {
      if (tier.level >= 3) {
        chatText = `<i>«Вольно, боец. Гляжу на тебя и вспоминаю свою роту в первые недели катастрофы. Мало кто сдюжил, паника людей быстрее пуль косила. А ты держишься кремнем. Я за этот лагерь перед погибшими ребятами в ответе, и на тебя могу положиться как на самого себя. Береги себя в рейдах.»</i>`;
      } else {
        chatText = `<i>«Дисциплина и порядок — вот на чём держится «Заря». В тайге без устава и пяти минут не протянешь. Караулы должны сменяться вовремя, патроны беречь, а оружие чистить до блеска. Вижу, стараешься. Продолжай в том же духе — община своих людей не бросает.»</i>`;
      }
    } else if (npcId === 'anna') {
      if (tier.level >= 3) {
        chatText = `<i>«Знаешь, когда радиостанция замолчала и пошли первые кислотные туманы, мне казалось, что выхода нет... Но глядя, как вы возвращаетесь из самых гиблых топей, я снова верю, что мы выстоим. Спасибо за травы и сфагнум — без твоей помощи лазарет давно бы опустел.»</i>`;
      } else {
        chatText = `<i>«Усталость копится незаметно, береги нервы и сон. В тайге если глаза слипаются — считай, пропал: то в растяжку угодишь, то зверь подкрадётся. Пей больше кипячёной воды и не лезь в рыжие заросли мха у насосной станции — там радиация до сих пор звенит.»</i>`;
      }
    } else if (npcId === 'prokhor') {
      if (tier.level >= 3) {
        chatText = `<i>«Здорово, золотые руки! Видал, какой у меня горн весёлый? Металл ещё тот, златоустовский, не то что нынешняя сыромятина. Ты заходи, чайку из жестянки хлебнём. Если инструмент какой затупится или капкан перекосит — неси, сделаем в лучшем виде.»</i>`;
      } else {
        chatText = `<i>«Ворчу вот... Свёрла советские кончаются, напильники сточены до блеска. А лагерь железной рукой держать надо: то петлю на воротах сорвёт, то бур на скважине встанет. Найдёшь на вылазках обрезки труб, болты или тросы — тащи всё в кузницу, перекуем!»</i>`;
      }
    } else if (npcId === 'egor') {
      if (tier.level >= 3) {
        chatText = `<i>«Здорово, братка таёжный! Чуешь, как кедром тянет? Ветер с водораздела пошёл, значит, зверь к ручьям спустится. Мы с тобой уже не один овраг исходили, я по следам твоим вижу — тайгу ты начал понимать. Она ведь не злая, она просто жалости не знает. Будь честен с лесом — и он тебя прокормит.»</i>`;
      } else {
        chatText = `<i>«Следы на реке нехорошие были по утру. Не то волк-переросток прошёл, не то рысь со скальника сошла. Рыба в омутах глубже встала — чует перемену погоды. На воду выходишь — оглядывайся почаще и без ножа на берег ни ногой.»</i>`;
      }
    } else if (npcId === 'spiridon') {
      chatText = `<i>«Мир тебе, чадо. Слышу шелест сосен — старая тайга вздыхает. Люди суетятся, железом гремят, в землю трубы вбивают... А земля-то живая, всё помнит и всё залечит. Ты в лес придёшь — поклонись старому дубу, травинку не рви понапрасну. Корни силу дают тому, кто сердце чистое хранит.»</i>`;
    } else if (npcId === 'sasha') {
      chatText = `<i>«Привет! Слушай, вчера на частоте 3650 кГц странный пакет морзянки прошёл... Похоже на автоматический маркер из штольни «Сферы». Неужели там внизу до сих пор аварийные аккумуляторы держат? Если поможешь наладить фильтры приёмника — мы сможем перехватывать сигналы со всей долины!»</i>`;
    }

    const body = `
      ${renderNpcRepHeader(npcId)}
      <div style="font-size:12.5px; line-height:1.6; color:var(--text-main); margin-bottom:12px;">
        ${chatText}
      </div>
      ${bonusText}
    `;

    openModal(npc.name, `Беседа • ${npc.role}`, npc.avatar, body, [
      { text: '↩️ Вернуться к делам', action: () => talkToNPC(npcId), primary: true }
    ]);
  }

  // --- ЛАГЕРЬ И НПС ---
  function renderNPCs() {
    const list = document.getElementById('npcList');
    list.innerHTML = '';

    Object.values(NPCS).forEach(npc => {
      // Спиридон виден после обнаружения его заимки на болоте
      if (npc.id === 'spiridon' && !state.questFlags?.met_spiridon) return;
      // Саша виден после спасения у Радиовышки
      if (npc.id === 'sasha' && !state.questFlags?.met_sasha) return;

      const repVal = getNpcRep(npc.id);
      const repTier = getNpcRepTitle(repVal);

      const card = document.createElement('div');
      card.className = 'npc-card';
      card.innerHTML = `
        <img src="${npc.avatar}" class="npc-avatar pixel-art" alt="">
        <div class="npc-info">
          <div class="npc-header-row">
            <span class="npc-name">${npc.name}</span>
            <span class="npc-role">${npc.role}</span>
          </div>
          <div style="display:flex; align-items:center; gap:6px; margin:2px 0 3px;">
            <span class="npc-badge" style="border-color:${repTier.color}; color:${repTier.color}; background:rgba(0,0,0,0.35); font-size:10px; padding:1px 5px;">
              ${repTier.icon} ${repTier.title} (${repVal})
            </span>
          </div>
          <p class="npc-desc">${npc.desc}</p>
        </div>
      `;
      card.onclick = () => talkToNPC(npc.id);
      list.appendChild(card);
    });

    // Карточка верного пса Бурана
    if (state.hasDog) {
      const dogCard = document.createElement('div');
      dogCard.className = 'npc-card';
      dogCard.style.border = '1px solid var(--accent-gold)';
      dogCard.style.background = 'linear-gradient(135deg, rgba(218,165,32,0.12), rgba(0,0,0,0.4))';
      dogCard.innerHTML = `
        <img src="assets/images/dog.png?v=2.2" class="npc-avatar pixel-art" alt="">
        <div class="npc-info">
          <div class="npc-header-row">
            <span class="npc-name">🐕 Буран (Верный пёс)</span>
            <span class="npc-role" style="color:var(--accent-gold);">Боевой спутник</span>
          </div>
          <p class="npc-desc">Белоснежная таёжная лайка. Охраняет лагерь, даёт +25% к урону в боях и вынюхивает дичь.</p>
        </div>
      `;
      dogCard.onclick = interactWithDog;
      list.appendChild(dogCard);
    }
  }

  function talkToNPC(npcId) {
    sfx.init();
    sfx.playClick();
    const npc = NPCS[npcId];
    if (!npc) return;

    // Switch view to Camp tab in case player clicked from Quest tab
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    const campTab = document.getElementById('tabCamp');
    if (campTab) campTab.classList.add('active');
    const navButtons = document.querySelectorAll('.nav-btn');
    if (navButtons[0]) navButtons[0].classList.add('active');

    if (!state.questFlags) {
      state.questFlags = {
        met_batya: false,
        met_anna: false,
        met_egor: false,
        met_prokhor: false,
        met_varya: false,
        has_membrane: false,
        pump_repaired: false,
        radio_repaired: false,
        bunker_completed: false
      };
    }
    state.questFlags['met_' + npcId] = true;

    if (npcId === 'batya') {
      talkBatya();
    } else if (npcId === 'anna') {
      talkAnna();
    } else if (npcId === 'prokhor') {
      talkProkhor();
    } else if (npcId === 'egor') {
      talkEgor();
    } else if (npcId === 'spiridon') {
      talkSpiridon();
    } else if (npcId === 'sasha') {
      talkSasha();
    } else if (npcId === 'varya') {
      talkVarya();
    }
  }

  function checkStarterQuestProgress() {
    if (state.mainQuestStep === 1 && state.questFlags.met_anna && state.questFlags.met_egor) {
      toast('⭐ Вы познакомились с жителями лагеря! Вернитесь к Бате для доклада.');
      sfx.playSuccess();
      renderQuests();
    }
  }

  function talkBatya() {
    const npc = NPCS.batya;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_batya = true;

    let body = renderNpcRepHeader('batya');
    body += `<p>Майор Дмитрий стоит у карты района, скрестив руки на груди. В глазах читается усталость, но голос звенит металлом.</p>`;
    body += `<p><i>«Ну что, боец. Лагерь "Заря" — последнее место в этой тайге, где люди живут по законам чести. Если готов пахать ради общины — не пропадёшь.»</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Батей о делах в тайге»',
      action: () => openNpcChat('batya')
    });

    // Квест 1: Стартовый инструктаж (step 0)
    if (state.mainQuestStep === 0) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 1: ПРИБЫТИЕ В ЗАРЮ]:</b></p>`;
      body += `<p><i>«Ты еле живой приполз. Прими законы общины: кто не работает — тот не ест. Держи стартовый сухпай и покажи, на что способен.»</i></p>`;
      actions.push({
        text: '«Я готов служить лагерю. С чего начать, Батя?»',
        action: () => {
          state.mainQuestStep = 1;
          state.reputation += 10;
          addItem('clean_water', 1);
          addItem('ammo', 3);
          toast('⭐ Задание 1 выполнено: «Прибытие в Зарю» (+10 репутации, фляга воды, 3 патрона)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          closeModal();
          renderQuests();
        },
        primary: true
      });
    }
    // Квест 2: Первые шаги (step 1)
    else if (state.mainQuestStep === 1) {
      const annaDone = !!state.questFlags.met_anna;
      const egorDone = !!state.questFlags.met_egor;
      const allDone = annaDone && egorDone;

      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: ПЕРВЫЕ ШАГИ]:</b></p>`;
      body += `<div style="background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px; margin:8px 0; border:1px solid rgba(255,255,255,0.12);">`;
      body += `<b style="color:var(--accent-gold); font-size:12px;">📋 Задачи инструктажа:</b><br>`;
      body += `• Фельдшер Анна (лазарет): ${annaDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}<br>`;
      body += `• Охотник Егор (река): ${egorDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}`;
      body += `</div>`;

      if (allDone) {
        body += `<p style="color:var(--accent-green);"><i>«Анна и Егор доложили, что ты парень смышлёный. Инструктаж пройден! Теперь пора заняться безопасностью лагеря.»</i></p>`;
        actions.push({
          text: '⭐ «Доложить об осмотре лагеря (Завершить квест 2)»',
          action: () => {
            state.mainQuestStep = 2;
            state.reputation += 15;
            addItem('ammo', 3);
            toast('⭐ Квест 2 завершён: «Первые шаги» (+15 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        body += `<p><i>«Загляни к Анне в лазарет — узнай про радиацию, и к Егору на берег реки — он покажет, как добывать рыбу.»</i></p>`;
        actions.push({
          text: '«Батя, я уже осмотрел лагерь и готов к делу!»',
          action: () => {
            state.questFlags.met_anna = true;
            state.questFlags.met_egor = true;
            state.mainQuestStep = 2;
            state.reputation += 15;
            addItem('ammo', 3);
            toast('⭐ Квест 2 завершён: Знакомство с общиной (+15 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          }
        });
      }
    }
    // Квест 3: Огонь во тьме (step 2)
    else if (state.mainQuestStep === 2) {
      const hasTorch = getItemCount('torch') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 3: ОГОНЬ ВО ТЬМЕ]:</b></p>`;
      body += `<p><i>«Ночи в тайге чернее дегтя. Мутанты жмутся к частоколу. Нам нужны дрова для костров и факелы для караульных. Набери в лесу сушняка и свяжи смоляной факел на верстаке у Прохора.»</i></p>`;

      if (hasTorch) {
        body += `<p style="color:var(--accent-green);">✓ У вас есть смоляной факел!</p>`;
        actions.push({
          text: '⭐ «Сдать факел и дрова Бате (Завершить квест 3)»',
          action: () => {
            removeItem('torch', 1);
            state.mainQuestStep = 3;
            state.reputation += 15;
            addItem('ammo', 2);
            toast('⭐ Квест 3 выполнен: «Огонь во тьме» (+15 репутации, +2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🌲 «Выдвигаюсь в Ближний лесок за дровами»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }
    // Квест 4: Голодный рассвет (step 3 - куратор Егор)
    else if (state.mainQuestStep === 3) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 4: ГОЛОДНЫЙ РАССВЕТ]:</b></p>`;
      body += `<p><i>«Запасы провизии на исходе. Сходи к Егору на берег Быстрянки. Он покажет, как смастерить удочку, поймать рыбу и сварить таёжную уху на костре.»</i></p>`;
      actions.push({
        text: '🎣 «Иду к Егору на берег реки»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('egor');
        },
        primary: true
      });
    }
    // Квест 5: Крещение тайгой (step 4)
    else if (state.mainQuestStep === 4) {
      const dogsDead = !!state.questFlags.dogs_defeated;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 5: КРЕЩЕНИЕ ТАЙГОЙ]:</b></p>`;
      body += `<p><i>«Тревога, боец! Стая одичавших псов обложила опушку Ближнего леска. Смастери охотничье копьё на верстаке, отбей набег и защити наш тыл!»</i></p>`;

      if (dogsDead) {
        body += `<p style="color:var(--accent-green);">✓ Стая диких псов разбита!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о разгроме стаи (Завершить квест 5)»',
          action: () => {
            state.mainQuestStep = 5;
            state.reputation += 25;
            addItem('ammo', 4);
            if (!state.unlockedLocations.includes('swamp')) {
              state.unlockedLocations.push('swamp');
            }
            toast('⭐ Квест 5 выполнен: «Крещение тайгой» (+25 репутации, ранг «Свой», открыты Болота)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderLocations();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🌲 «Выдвигаюсь на опушку леса для боя»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          },
          primary: true
        });
      }
    }
    // Квест 6: Мёртвые заводи (step 5 - куратор Анна)
    else if (state.mainQuestStep === 5) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 6: МЁРТВЫЕ ЗАВОДИ]:</b></p>`;
      body += `<p><i>«Анна Павловна бьет тревогу: Быстрянка несет желтоватую радиохимическую пену. Срочно иди в лазарет и помоги ей взять пробы!»</i></p>`;
      actions.push({
        text: '🩺 «Иду в лазарет к Анне»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('anna');
        },
        primary: true
      });
    }
    // Квест 7: Следы на иле (step 6 - куратор Егор)
    else if (state.mainQuestStep === 6) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 7: СЛЕДЫ НА ИЛЕ]:</b></p>`;
      body += `<p><i>«Егор заметил трёхпалые следы болотных мутантов у берега. Загляни к нему, сколотите капканы и остановите тварей.»</i></p>`;
      actions.push({
        text: '🏹 «Иду к Егору»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('egor');
        },
        primary: true
      });
    }
    // Квест 8: Экспедиция в Гнилую гать (step 7 - куратор Анна)
    else if (state.mainQuestStep === 7) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 8: ЭКСПЕДИЦИЯ В ГНИЛУЮ ГАТЬ]:</b></p>`;
      body += `<p><i>«Анне нужен болотный сфагнум для фильтрации воды и лекарств. Сходи на торфяники Гнилой гати, но берегись радиации!»</i></p>`;
      actions.push({
        text: '🩺 «Поговорить с Анной о вылазке»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('anna');
        },
        primary: true
      });
    }
    // Квест 9: Прорыв к Насосной станции (step 8)
    else if (state.mainQuestStep === 8) {
      const cleared = !!state.questFlags.pump_cleared;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 9: ПРОРЫВ К НАСОСНОЙ СТАНЦИИ]:</b></p>`;
      body += `<p><i>«Колодцы лагеря пересыхают! Наш единственный шанс — старая Насосная станция №4. Дорога туда завалена железобетоном и кишит тварями. Пробейся к машинному залу станции!»</i></p>`;

      if (cleared) {
        body += `<p style="color:var(--accent-green);">✓ Завал у цеха Насосной станции №4 расчищен!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о пробитом коридоре (Завершить квест 9)»',
          action: () => {
            state.mainQuestStep = 9;
            state.reputation += 35;
            addItem('ammo', 5);
            toast('⭐ Квест 9 выполнен: «Прорыв к Насосной» (+35 репутации, +5 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🏭 «Выдвигаюсь на Насосную станцию №4»',
          action: () => {
            if (!state.unlockedLocations.includes('pump_station')) {
              state.unlockedLocations.push('pump_station');
            }
            closeModal();
            switchTab('tabMap');
            renderLocations();
          },
          primary: true
        });
      }
    }
    // Квест 10: Сердце фильтра (step 9)
    else if (state.mainQuestStep === 9) {
      const repaired = !!state.questFlags.pump_repaired;
      const hasMembrane = getItemCount('filter_membrane') > 0 || state.questFlags.has_membrane;
      const scrapCount = getItemCount('scrap');

      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 10: СЕРДЦЕ ФИЛЬТРА]:</b></p>`;
      body += `<p><i>«В машинном зале станции нужно найти керамическую мембрану и 3 металлолома. Без них фильтр не запустить. Прохор ждет детали!»</i></p>`;

      if (repaired) {
        body += `<p style="color:var(--accent-green);">✓ Водоочистная станция запущена! В лагере есть питьевая вода!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о победе над водным кризисом (Завершить квест 10)»',
          action: () => {
            state.mainQuestStep = 10;
            state.reputation += 40;
            addItem('canned_food', 2);
            addItem('ammo', 6);
            toast('⭐ Квест 10 выполнен: «Сердце фильтра» (+40 репутации, ранг «Уважаемый», +2 тушёнки)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else if (hasMembrane && scrapCount >= 3) {
        actions.push({
          text: '🔧 «Батя, детали со мной! Запустить станцию прямо сейчас»',
          action: () => {
            if (getItemCount('filter_membrane') > 0) removeItem('filter_membrane', 1);
            removeItem('scrap', 3);
            state.questFlags.pump_repaired = true;
            toast('Гидроузел запущен! Чистая вода пошла по трубам!');
            sfx.playSuccess();
            talkBatya();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🔍 «Искать мембрану и металлолом на станции»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }
    // Квест 11: Морзе в ночи (step 10 - куратор Прохор)
    else if (state.mainQuestStep === 10) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 11: МОРЗЕ В НОЧИ]:</b></p>`;
      body += `<p><i>«Прохор ночью перехватил аварийный морзе SOS на армейской волне! Сходи к нему к верстаку, разберитесь, откуда бьет сигнал.»</i></p>`;
      actions.push({
        text: '🔧 «Иду к Прохору к верстаку»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('prokhor');
        },
        primary: true
      });
    }
    // Квест 12: Эхо на Скалистом утёсе (step 11)
    else if (state.mainQuestStep === 11) {
      const radioOk = !!state.questFlags.radio_repaired;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 12: ЭХО НА СКАЛИСТОМ УТЁСЕ]:</b></p>`;
      body += `<p><i>«Возьми 3 металлолома и 2 проволоки. Поднимись на высотную Радиовышку на утесе и восстанови мачту связи. Мы должны поймать этот сигнал!»</i></p>`;

      if (radioOk) {
        body += `<p style="color:var(--accent-green);">✓ Антенна на Радиовышке восстановлена! Принят аварийный сигнал!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о пойманном сигнале (Завершить квест 12)»',
          action: () => {
            state.mainQuestStep = 12;
            state.reputation += 35;
            addItem('ammo', 5);
            if (getItemCount('audio_tape') === 0) addItem('audio_tape', 1);
            toast('⭐ Квест 12 выполнен: «Эхо на Скалистом утёсе» (+35 репутации, кассета Воронова)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '📡 «Выдвигаюсь к Радиовышке на утесе»',
          action: () => {
            if (!state.unlockedLocations.includes('radio_tower')) {
              state.unlockedLocations.push('radio_tower');
            }
            closeModal();
            switchTab('tabMap');
            renderLocations();
          },
          primary: true
        });
      }
    }
    // Квест 13: Шифр Воронова (step 12 - куратор Прохор)
    else if (state.mainQuestStep === 12) {
      const decoded = !!state.questFlags.tape_decoded;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 13: ШИФР ВОРОНОВА]:</b></p>`;
      body += `<p><i>«На пленке с вышки записан шифр профессора Воронова из НИИ «Сфера»! Иди к Прохору — у него в мастерской есть дешифратор и магнитофон.»</i></p>`;

      if (decoded) {
        body += `<p style="color:var(--accent-green);">✓ Запись Воронова расшифрована! Координаты Заброшенного кордона получены!</p>`;
        actions.push({
          text: '⭐ «Обсудить координаты кордона с Батей (Завершить квест 13)»',
          action: () => {
            state.mainQuestStep = 13;
            state.reputation += 30;
            addItem('ammo', 5);
            if (!state.unlockedLocations.includes('old_cordon')) {
              state.unlockedLocations.push('old_cordon');
            }
            toast('⭐ Квест 13 выполнен: «Шифр Воронова» (+30 репутации, открыт Заброшенный кордон)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderLocations();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '📻 «Иду к Прохору расшифровывать пленку»',
          action: () => {
            closeModal();
            switchTab('tabCamp');
            talkToNPC('prokhor');
          },
          primary: true
        });
      }
    }
    // Квест 14: Тайна Заброшенного кордона (step 13)
    else if (state.mainQuestStep === 13) {
      const hasKeycard = getItemCount('keycard_sfera') > 0 || state.questFlags.cordon_searched;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 14: ТАЙНА ЗАБРОШЕННОГО КОРДОНА]:</b></p>`;
      body += `<p><i>«Выдвигайся на Заброшенный кордон в предгорьях. Воронов оставил там ключ-карту допуска к Бункеру и полевой дневник. Найди их!»</i></p>`;

      if (hasKeycard) {
        body += `<p style="color:var(--accent-green);">✓ Дневник Воронова и ключ-карта «Сфера-Допуск» найдены!</p>`;
        actions.push({
          text: '⭐ «Сдать материалы кордона Бате (Завершить квест 14)»',
          action: () => {
            state.mainQuestStep = 14;
            state.reputation += 40;
            addItem('ammo', 8);
            if (!state.unlockedLocations.includes('hunting_grounds')) {
              state.unlockedLocations.push('hunting_grounds');
            }
            toast('⭐ Квест 14 выполнен: «Тайна кордона» (+40 репутации, +8 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderLocations();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🏚️ «Выдвигаюсь на Заброшенный кордон»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          },
          primary: true
        });
      }
    }
    // Квест 15: Хозяин тайги (step 14 - куратор Егор)
    else if (state.mainQuestStep === 14) {
      const bearDead = !!state.questFlags.bear_defeated || getItemCount('bear_pelt') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 15: ХОЗЯИН ТАЙГИ]:</b></p>`;
      body += `<p><i>«Путь через ущелье к Бункеру преградил гигантский медведь-шатун. Егор выследил его в Охотничьих угодьях. Одолей чудовище — и получишь лучшее оружие лагеря!»</i></p>`;

      if (bearDead) {
        body += `<p style="color:var(--accent-green);">✓ Хозяин тайги повержен! Шкура исполина у вас!</p>`;
        actions.push({
          text: '⭐ «Вручить Бате шкуру медведя и получить ТОЗ-34 (Завершить квест 15)»',
          action: () => {
            state.mainQuestStep = 15;
            state.reputation += 60;
            if (getItemCount('toz') === 0) addItem('toz', 1);
            addItem('ammo', 10);
            toast('⭐ КВЕСТ 15 ВЫПОЛНЕН: «Хозяин тайги» (+60 репутации, ружьё ТОЗ-34, 10 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🏹 «Иду к Егору разрабатывать план засады»',
          action: () => {
            closeModal();
            switchTab('tabCamp');
            talkToNPC('egor');
          },
          primary: true
        });
      }
    }
    // Квест 16: Доспех сталкера (step 15 - куратор Прохор)
    else if (state.mainQuestStep === 15) {
      const hasSuit = getItemCount('stalker_suit') > 0 || state.questFlags.suit_crafted;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 16: ДОСПЕХ СТАЛКЕРА]:</b></p>`;
      body += `<p><i>«Шкура Шатуна крепка как титан. Иди к Прохору — сшейте из нее Укреплённую броню сталкера. В Бункере без брони тебя разорвут турели!»</i></p>`;

      if (hasSuit) {
        body += `<p style="color:var(--accent-green);">✓ Броня сталкера изготовлена и готова к бою!</p>`;
        actions.push({
          text: '⭐ «Показать броню сталкера Бате (Завершить квест 16)»',
          action: () => {
            state.questFlags.suit_crafted = true;
            state.mainQuestStep = 16;
            state.reputation += 30;
            addItem('ammo', 5);
            toast('⭐ Квест 16 выполнен: «Доспех сталкера» (+30 репутации, +5 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🔨 «Иду к Прохору на верстак»',
          action: () => {
            closeModal();
            switchTab('tabCamp');
            talkToNPC('prokhor');
          },
          primary: true
        });
      }
    }
    // Квест 17: Дыхание бездны (step 16 - куратор Анна)
    else if (state.mainQuestStep === 16) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 17: ДЫХАНИЕ БЕЗДНЫ]:</b></p>`;
      body += `<p><i>«Анна изучила записи Воронова: в шахтах Бункера скопился тяжелый газ «Каскад-Б». Без специального респиратора Р-2 ты задохнешься. Срочно зайди в лазарет!»</i></p>`;
      actions.push({
        text: '🩺 «Иду в лазарет к Анне»',
        action: () => {
          closeModal();
          switchTab('tabCamp');
          talkToNPC('anna');
        },
        primary: true
      });
    }
    // Квест 18: Штурм Бункера (step 17)
    else if (state.mainQuestStep === 17) {
      const turretsDead = !!state.questFlags.turrets_neutralized;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 18: ШТУРМ БУНКЕРА «СФЕРА»]:</b></p>`;
      body += `<p><i>«Ты готов, боец. Заряди ТОЗ-34 патронами, надень респиратор Р-2, примени ключ-карту «Сфера» и подави турели охраны в гермоблоке Бункера!»</i></p>`;

      if (turretsDead) {
        body += `<p style="color:var(--accent-green);">✓ Гермоблок вскрыт, охранные турели нейтрализованы!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о прорыве обороны Бункера (Завершить квест 18)»',
          action: () => {
            state.mainQuestStep = 18;
            state.reputation += 50;
            addItem('ammo', 10);
            toast('⭐ Квест 18 выполнен: «Штурм Бункера» (+50 репутации, +10 патронов)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🚪 «Выдвигаюсь на штурм Бункера «Сфера»»',
          action: () => {
            if (!state.unlockedLocations.includes('bunker')) {
              state.unlockedLocations.push('bunker');
            }
            closeModal();
            switchTab('tabMap');
            renderLocations();
          },
          primary: true
        });
      }
    }
    // Квест 19: Предотвращение Каскада-2 (step 18)
    else if (state.mainQuestStep === 18) {
      const shutdown = !!state.questFlags.reactor_shutdown;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 19: ПРЕДОТВРАЩЕНИЕ «КАСКАДА-2»]:</b></p>`;
      body += `<p><i>«Датчики бункера воют сиреной: реактор перегрет, грядет второй химический выброс на всю долину! Пробейся в реакторный зал, заглуши стержни и забери научный архив и «Нектар-7»!»</i></p>`;

      if (shutdown) {
        body += `<p style="color:var(--accent-green);">✓ Реактор заглушен! Архив «Каскад» и капсула «Нектар-7» спасены!</p>`;
        actions.push({
          text: '⭐ «Доложить Бате о спасении всей тайги (Завершить квест 19)»',
          action: () => {
            state.mainQuestStep = 19;
            state.reputation += 80;
            toast('⭐ КВЕСТ 19 ВЫПОЛНЕН: «Каскад-2» предотвращён (+80 репутации)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '☢️ «Спускаюсь в реакторный зал Бункера»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          },
          primary: true
        });
      }
    }
    // Квест 20: Новый рассвет Зари (step 19 - Финал)
    else if (state.mainQuestStep === 19) {
      body += `<p style="color:var(--accent-gold); font-size:14px; font-weight:bold;">🏆 [ФИНАЛ: НОВЫЙ РАССВЕТ «ЗАРИ»]:</p>`;
      body += `<p><i>«СЫНОК! ТЫ СДЕЛАЛ ЭТО! Ты спас лагерь, предотвратил второй взрыв и добыл лекарство для всей сибирской земли. Вся община собралась салютовать тебе!»</i></p>`;
      actions.push({
        text: '🏆 «Принять почести Героя и Легенды тайги (Торжественный Финал)»',
        action: () => {
          state.mainQuestStep = 20;
          state.questFlags.bunker_completed = true;
          state.reputation += 100;
          toast('🏆 СЮЖЕТНАЯ КАМПАНИЯ ПОЛНОСТЬЮ ПРОЙДЕНА! ВЫ — ЛЕГЕНДА ТАЙГИ!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          closeModal();
          showVictoryScreen();
        },
        primary: true
      });
    }
    // Постгейм (step 20+)
    else {
      body += `<p style="color:var(--accent-gold);"><b>[ЛЕГЕНДА ЛАГЕРЯ «ЗАРЯ»]:</b></p>`;
      body += `<p><i>«Здравствуй, легенда! О твоих подвигах у каждого костра слагают песни. Лагерь процветает благодаря тебе. Все тропы тайги открыты для тебя!»</i></p>`;
    }

    
    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ БАТИ ---
    // «Чистый глоток» (вода в резерв штаба)
    if (!state.sideQuests?.sq_water_batya?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '💧 «Батя, нужно пополнить штабной резерв воды? Я помогу»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_water_batya = { status: 'active' };
          toast('📜 Взято поручение: «Чистый глоток» (Вскипятить и сдать 3 фляги воды Бате)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkBatya();
        }
      });
    } else if (state.sideQuests?.sq_water_batya?.status === 'active') {
      const hasWater = getItemCount('clean_water') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ШТАБНОЙ РЕЗЕРВ]:</b> <i>«Ты вскипятил три фляги чистой воды? Если мутанты отсекут нас от реки, лагерь без воды не протянет.»</i></p>`;
      if (hasWater) {
        actions.push({
          text: '💧 «Так точно, Батя! Вот 3 фляги чистой кипячёной воды»',
          action: () => {
            removeItem('clean_water', 3);
            state.sideQuests.sq_water_batya.status = 'completed';
            addItem('ammo', 4);
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Чистый глоток» (+15 репутации, +4 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkBatya();
          },
          primary: true
        });
      }
    }

    // «Ночной дозор»
    if (!state.sideQuests?.sq_watch_batya?.status && state.mainQuestStep >= 3) {
      actions.push({
        text: '🏮 «Батя, могу заступить в ночной караул на смотровой вышке»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_watch_batya = { status: 'active' };
          toast('📜 Взято поручение: «Ночной дозор» (Заступить на вышку в фазу Ночи с факелом)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkBatya();
        }
      });
    } else if (state.sideQuests?.sq_watch_batya?.status === 'active') {
      const isNight = isNightTime(state.timeOfDay);
      const hasTorch = getItemCount('torch') > 0 || getItemCount('electric_torch') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[НОЧНОЙ ДОЗОР]:</b> <i>«В темноте твари жмутся к частоколу. Бери факел и заступай на вышку у ворот, покуда луна стоит.»</i></p>`;
      if (isNight && hasTorch) {
        actions.push({
          text: '🏮 «Отстоять ночную смену на смотровой вышке до рассвета»',
          action: () => {
            state.sideQuests.sq_watch_batya.status = 'completed';
            passTime(1);
            addItem('ammo', 5);
            addItem('canned_food', 1);
            state.reputation += 20;
            toast('⭐ Ночной караул сдан! Батя пожал вам руку (+20 репутации, 5 патронов, тушенка)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkBatya();
          },
          primary: true
        });
      }
    }

    // Ежедневное поручение: Дрова для костра
    const dailyWoodBatya = (state.dailyQuests || []).find(q => q.id === 'daily_wood' && !q.completed && q.current >= q.goal);
    if (dailyWoodBatya) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: ДРОВА ДЛЯ КОСТРА]:</b> <i>«Вижу, сушняк для общего костра заготовлен. Молодец, дисциплина в лагере превыше всего. Получи довольствие.»</i></p>`;
      actions.push({
        text: `🪵 «Батя, доложить о заготовке дров (+${dailyWoodBatya.rewardRep} реп, +${dailyWoodBatya.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_wood');
          talkBatya();
        },
        primary: true
      });
    }

    // Жетоны разведгруппы «Север» (сержанта Гурова)
    if (state.questFlags.brdm_searched && !state.questFlags.brdm_reported) {
      actions.push({
        text: '🎖️ «Батя... я нашёл в трясине БРДМ-2. Вот жетоны сержанта Гурова...»',
        action: () => {
          state.questFlags.brdm_reported = true;
          addItem('ammo', 8);
          state.reputation += 40;
          toast('⭐ Жетоны сержанта Гурова переданы Бате (+40 репутации, командирский бинокль, 8 патронов)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkBatya();
        },
        primary: true
      });
    }

    // Финал «Эхо чёрного каравана»
    if (state.questFlags.caravan_cache_found && !state.questFlags.caravan_completed) {
      actions.push({
        text: '🏴‍☠️ «Батя, схрон банды «Хлыща» уничтожен! Вот украденные медикаменты»',
        action: () => {
          state.questFlags.caravan_completed = true;
          addItem('ammo', 15);
          state.reputation += 50;
          toast('🏆 Дело «Чёрного каравана» закрыто! Справедливость свершилась (+50 репутации, 15 патронов)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkBatya();
        },
        primary: true
      });
    }

        // Квест высокой репутации (80+): Спецрезерв коменданта
    const batyaRep = getNpcRep('batya');
    if (batyaRep >= 80 && !state.highRepQuests?.batya?.status) {
      actions.push({
        text: '🎖️ «Батя, на какую поддержку штаба я могу рассчитывать?» (Репутация 80+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.batya = { status: 'completed' };
          addItem('ammo', 20);
          addItem('canned_food', 2);
          addItem('antirad', 1);
          addItem('army_ration_box', 1);
          changeNpcRep('batya', 15);
          toast('⭐ Майор Дмитрий открыл спецрезерв коменданта (+20 патронов, 2 тушёнки, цистамин, спецпаёк)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkBatya();
        }
      });
    }

    // Союзный квест: Штабной перехват: Секретный арсенал (Батя, Саша, Прохор - реп 60+ у всех трёх)
    const sashaRep = getNpcRep('sasha');
    const prokhorRep = getNpcRep('prokhor');
    if (batyaRep >= 60 && sashaRep >= 60 && prokhorRep >= 60 && !state.crossQuests?.cross_arsenal?.status) {
      actions.push({
        text: '📻 «Батя, Саша перехватил военный шифр, а Прохор готов вскрыть спецхран!»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_arsenal = { status: 'completed' };
          addItem('ammo', 25);
          addItem('army_ration_box', 1);
          changeNpcRep('batya', 35);
          changeNpcRep('sasha', 35);
          changeNpcRep('prokhor', 35);
          state.reputation += 50;
          toast('🏆 СЕКРЕТНЫЙ АРСЕНАЛ ВСКРЫТ! Офицерский спецхран передан общине (+25 патронов, спецпаёк, +35 репутации каждому союзнику)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkBatya();
        }
      });
    }

    body += `<p style="font-size:11px; color:var(--text-dim); margin-top:10px;">Репутация в лагере: ${getReputationTitle(state.reputation)} (${state.reputation} очков)</p>`;
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  function talkAnna() {
    const npc = NPCS.anna;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_anna = true;

    let body = renderNpcRepHeader('anna');
    body += `<p>В медицинском вагончике приятно пахнет сушеной мятой и спиртом. Анна перевязывает жгут и тепло улыбается.</p>`;
    body += `<p><i>«Здравствуй! Главное в тайге — не пей сырую воду из реки и не хватай фонящие ягоды. Если накопишь радиацию — я сварю тебе отвар или дам цистамин.»</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Анной о лазарете и травах»',
      action: () => openNpcChat('anna')
    });

    // Квест 2
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: УРОКИ ВЫЖИВАНИЯ]:</b> Анна осматривает вас: <i>«Батя предупредил, что ты новенький. В тайге береги здоровье — радиация не прощает беспечности.»</i></p>`;
      actions.push({
        text: '«Батя велел познакомиться с лазаретом. Рад встрече, Анна Павловна!»',
        action: () => {
          state.questFlags.met_anna = true;
          toast('⭐ Знакомство с фельдшером Анной зачтено!');
          sfx.playSuccess();
          checkStarterQuestProgress();
          talkAnna();
        },
        primary: true
      });
    }

    // Квест 6: Мёртвые заводи (step 5)
    if (state.mainQuestStep === 5) {
      const hasSample = getItemCount('water_sample') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 6: МЁРТВЫЕ ЗАВОДИ]:</b></p>`;
      body += `<p><i>«Беда! В Быстрянке всплывает дохлая рыба, вода пахнет химикатами. Срочно набери пробу токсичной воды на реке и принеси мне на экспресс-тест!»</i></p>`;
      if (hasSample) {
        actions.push({
          text: '🧪 «Передать пробу токсичной воды Анне (Завершить квест 6)»',
          action: () => {
            removeItem('water_sample', 1);
            state.questFlags.water_sample_given = true;
            state.mainQuestStep = 6;
            state.reputation += 20;
            addItem('antirad', 1);
            toast('⭐ Квест 6 выполнен: «Мёртвые заводи» (+20 репутации, цистамин)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🌊 «Выдвигаюсь на реку Быстрянку за пробой»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }

    // Квест 8: Экспедиция в Гнилую гать (step 7)
    if (state.mainQuestStep === 7) {
      const mossCount = getItemCount('swamp_moss');
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 8: ЭКСПЕДИЦИЯ В ГНИЛУЮ ГАТЬ]:</b></p>`;
      body += `<p><i>«Токсины из реки проникают в грунтовые воды. Единственный природный фильтр — болотный сфагнум. На торфяниках Гнилой гати добудь 2 пучка сфагнума!»</i></p>`;
      if (mossCount >= 2) {
        actions.push({
          text: '🌿 «Передать болотный сфагнум Анне (Завершить квест 8)»',
          action: () => {
            removeItem('swamp_moss', 2);
            state.mainQuestStep = 8;
            state.reputation += 30;
            addItem('herbal_salve', 2);
            toast('⭐ Квест 8 выполнен: «Экспедиция в Гнилую гать» (+30 репутации, 2 целебные мази)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '☣️ «Отправиться в Гнилую гать за сфагнумом»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }

    // Квест 17: Дыхание бездны (step 16)
    if (state.mainQuestStep === 16) {
      const hasResp = getItemCount('respirator') > 0 || state.questFlags.respirator_crafted;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 17: ДЫХАНИЕ БЕЗДНЫ]:</b></p>`;
      body += `<p><i>«В шахтах Бункера висит смертельный газ «Каскад-Б». Без респиратора Р-2 ты погибнешь. Собери 2 сфагнума, 1 пучок трав и свяжи респиратор на верстаке!»</i></p>`;
      if (hasResp) {
        actions.push({
          text: '😷 «Показать готовый респиратор Р-2 Анне (Завершить квест 17)»',
          action: () => {
            state.questFlags.respirator_crafted = true;
            state.mainQuestStep = 17;
            state.reputation += 30;
            addItem('antirad', 2);
            if (!state.unlockedLocations.includes('bunker')) {
              state.unlockedLocations.push('bunker');
            }
            toast('⭐ Квест 17 выполнен: «Дыхание бездны» (+30 репутации, открыт Бункер)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderLocations();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      }
    }

    // Стандартные услуги лазарета
    actions.push(
      {
        text: '🩹 Перевязать раны на месте (Восстановить HP до 100 за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            state.hp = 100;
            toast('Анна обработала ваши раны (+100% HP)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkAnna();
          } else {
            toast('Недостаточно патронов (нужно 2 шт.)');
          }
        }
      },
      {
        text: '🩹 Купить стерильный бинт с собой (за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            addItem('bandage', 1);
            toast('Куплен стерильный бинт');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkAnna();
          } else {
            toast('Недостаточно патронов (нужно 2 шт.)');
          }
        }
      },
      {
        text: '💊 Купить цистамин от радиации (за 3 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 3) {
            removeItem('ammo', 3);
            addItem('antirad', 1);
            toast('Куплен цистамин');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkAnna();
          } else {
            toast('Недостаточно патронов (нужно 3 шт.)');
          }
        }
      },
      {
        text: '🌿 Сдать 3 пучка трав в лазарет (+5 репутации, +1 патрон)',
        action: () => {
          if (getItemCount('herbs') >= 3) {
            removeItem('herbs', 3);
            addItem('ammo', 1);
            state.reputation += 5;
            toast('Анна поблагодарила за травы (+5 репутации, +1 патрон)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkAnna();
          } else {
            toast('Нужно минимум 3 пучка трав для лазарета.');
          }
        }
      }
    );

    
    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ АННЫ ---
    // Ежедневное поручение: Аптечный сбор
    const dailyHerbs = (state.dailyQuests || []).find(q => q.id === 'daily_herbs' && !q.completed && q.current >= q.goal);
    if (dailyHerbs) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: АПТЕЧНЫЙ СБОР]:</b> <i>«Полынь и целебные травы... Именно то, что нужно для лазарета, раненым дозорным повязки менять. Спасибо за помощь, держи патроны из нашего фонда.»</i></p>`;
      actions.push({
        text: `🌿 «Анна Павловна, сдать целебные травы (+${dailyHerbs.rewardRep} реп, +${dailyHerbs.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_herbs');
          talkAnna();
        },
        primary: true
      });
    }

    // «Дрова для лазарета»
    if (!state.sideQuests?.sq_wood_anna?.status && state.mainQuestStep >= 1) {
      actions.push({
        text: '🪵 «Анна Павловна, не холодно в лазарете? Могу натаскать березовых дров»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_wood_anna = { status: 'active' };
          toast('📜 Взято поручение: «Дрова для лазарета» (Собрать 4 охапки дров в лесу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkAnna();
        }
      });
    } else if (state.sideQuests?.sq_wood_anna?.status === 'active') {
      const hasWood = getItemCount('firewood') >= 4;
      body += `<p style="color:var(--accent-gold);"><b>[ДРОВА ДЛЯ РАНЕНЫХ]:</b> <i>«Печка почти остыла, соколик. Нашел в лесу четыре охапки сушняка?»</i></p>`;
      if (hasWood) {
        actions.push({
          text: '🪵 «Вот 4 охапки сухих берёзовых дров, Анна Павловна»',
          action: () => {
            removeItem('firewood', 4);
            state.sideQuests.sq_wood_anna.status = 'completed';
            addItem('bandage', 2);
            state.reputation += 10;
            toast('⭐ Поручение выполнено: «Дрова для лазарета» (+10 репутации, +2 бинта)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkAnna();
          },
          primary: true
        });
      }
    }

    // «Таёжные витамины» (брусника)
    if (!state.sideQuests?.sq_berries_anna?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '🫐 «Анна Павловна, нужны лесные ягоды для противоцинготного взвара?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_berries_anna = { status: 'active' };
          toast('📜 Взято поручение: «Таёжные витамины» (Собрать 3 порции брусники в лесу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkAnna();
        }
      });
    } else if (state.sideQuests?.sq_berries_anna?.status === 'active') {
      const hasBerries = getItemCount('berries') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ПРОТИВОЦИНГОТНЫЙ СБОР]:</b> <i>«У ребят на карауле силы тают. Набрал спелой брусники в распадках?»</i></p>`;
      if (hasBerries) {
        actions.push({
          text: '🫐 «Принёс 3 порции спелой лесной брусники из сосняка»',
          action: () => {
            removeItem('berries', 3);
            state.sideQuests.sq_berries_anna.status = 'completed';
            addItem('antirad', 1);
            state.reputation += 10;
            toast('⭐ Поручение выполнено: «Таёжные витамины» (+10 репутации, +1 цистамин)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkAnna();
          },
          primary: true
        });
      }
    }

    // «Полевая перевязка»
    if (!state.sideQuests?.sq_medkit_anna?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '🩹 «Анна Павловна, помочь с подготовкой перевязочных пакетов?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_medkit_anna = { status: 'active' };
          toast('📜 Взято поручение: «Полевая перевязка» (Принести 2 бинта и 1 пучок трав)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkAnna();
        }
      });
    } else if (state.sideQuests?.sq_medkit_anna?.status === 'active') {
      const hasKits = getItemCount('bandage') >= 2 && getItemCount('herbs') >= 1;
      body += `<p style="color:var(--accent-gold);"><b>[ПЕРЕВЯЗОЧНЫЙ ЗАПАС]:</b> <i>«Бойцы из дозоров все исполосованные ветками возвращаются. Собрал два бинта и чабрец?»</i></p>`;
      if (hasKits) {
        actions.push({
          text: '🩹 «Вот 2 стерильных бинта и пучок душистого чабреца, Анна Павловна»',
          action: () => {
            removeItem('bandage', 2);
            removeItem('herbs', 1);
            state.sideQuests.sq_medkit_anna.status = 'completed';
            state.hp = 100;
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Полевая перевязка» (+15 репутации, HP полностью восстановлено)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkAnna();
          },
          primary: true
        });
      }
    }

    // «Светящийся реликтовый сфагнум»
    if (getItemCount('glowing_moss') > 0 && !state.questFlags.glowing_moss_reported) {
      actions.push({
        text: '✨ «Анна Павловна, я нашёл на болотах светящийся сфагнум!»',
        action: () => {
          state.questFlags.glowing_moss_reported = true;
          removeItem('glowing_moss', 1);
          addItem('stabilizer_nectar', 1);
          state.reputation += 30;
          toast('⭐ Анна сварила экстракт «Живая вода» (+30 репутации, редкий биостабилизатор)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAnna();
        },
        primary: true
      });
    }

        // Квест высокой репутации (70+): Биопротектор Анны
    const annaRep = getNpcRep('anna');
    if (annaRep >= 70 && !state.highRepQuests?.anna?.status) {
      actions.push({
        text: '🧪 «Анна Павловна, вы упоминали о секретной формуле биозащиты?» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.anna = { status: 'completed' };
          addItem('stimulator_m', 1);
          addItem('antirad', 2);
          changeNpcRep('anna', 20);
          state.reputation += 35;
          toast('⭐ Анна Павловна синтезировала «Биопротектор» (+1 «Стимулятор-М», +2 цистамина, +20 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAnna();
        }
      });
    }

    checkStarterQuestProgress();
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  function talkProkhor() {
    const npc = NPCS.prokhor;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_prokhor = true;

    let body = renderNpcRepHeader('prokhor');
    body += `<p>Кузьмич орудует напильником над куском рельса. Под ногами гора стружки и шестеренок.</p>`;
    body += `<p><i>«Чего стоишь как чужой? Если руки из нужного места — подходи к верстаку, делай капканы да факелы. Принесешь металлолом — по рукам ударим.»</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Прохором о железе и мастерской»',
      action: () => openNpcChat('prokhor')
    });

    // Квест 3: Совет по факелу
    if (state.mainQuestStep === 2) {
      body += `<p style="color:var(--accent-gold);"><b>[СОВЕТ МЕХАНИКА]:</b> <i>«Батя просил факел? Возьми 1 сухое полено и 1 проволоку — на верстаке за минуту свяжешь отличный смоляной факел.»</i></p>`;
    }

    // Квест 10: Сборка гидроузла насосной
    if (state.mainQuestStep === 9) {
      const hasMembrane = getItemCount('filter_membrane') > 0 || state.questFlags.has_membrane;
      const scrapCount = getItemCount('scrap');
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 10: СЕРДЦЕ ФИЛЬТРА]:</b> <i>«Принёс мембрану и 3 лома со станции? Давай сюда, перепаяем штуцера и пустим чистую воду в лагерь!»</i></p>`;
      if (hasMembrane && scrapCount >= 3) {
        actions.push({
          text: '🔧 «Смонтировать водоочистной узел вместе с Прохором»',
          action: () => {
            if (getItemCount('filter_membrane') > 0) removeItem('filter_membrane', 1);
            removeItem('scrap', 3);
            state.questFlags.pump_repaired = true;
            toast('Станция запущена! Чистая вода пошла в баки лагеря!');
            sfx.playSuccess();
            talkProkhor();
          },
          primary: true
        });
      }
    }

    // Квест 11: Морзе в ночи (step 10)
    if (state.mainQuestStep === 10) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 11: МОРЗЕ В НОЧИ]:</b></p>`;
      body += `<p><i>«Слушай сюда: в 03:00 мой приемник Р-326 поймал сигнал SOS на частоте 142.5 МГц! Кто-то просит помощи из закрытого сектора. Держи схему ретранслятора, беги к Бате — нужно идти на Радиовышку!»</i></p>`;
      actions.push({
        text: '📜 «Взять схему ретранслятора и пойти к Бате»',
        action: () => {
          state.questFlags.met_prokhor_radio = true;
          state.mainQuestStep = 11;
          state.reputation += 20;
          if (!state.unlockedLocations.includes('radio_tower')) {
            state.unlockedLocations.push('radio_tower');
          }
          toast('⭐ Квест 11 выполнен: «Морзе в ночи» (+20 репутации, открыта Радиовышка)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderLocations();
          renderQuests();
          closeModal();
        },
        primary: true
      });
    }

    // Квест 13: Шифр Воронова (step 12)
    if (state.mainQuestStep === 12) {
      const hasTape = getItemCount('audio_tape') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 13: ШИФР ВОРОНОВА]:</b> <i>«Ты принёс кассету с Радиовышки? Давай её сюда, зарядим в магнитофон!»</i></p>`;
      if (hasTape) {
        actions.push({
          text: '📻 «Вставить кассету в магнитофон и прослушать запись Воронова»',
          action: () => {
            state.questFlags.tape_decoded = true;
            toast('📻 «...Говорит профессор Воронов. Бункер запечатан. Ключ-карта на Заброшенном кордоне...»');
            sfx.playSuccess();
            talkProkhor();
          },
          primary: true
        });
      }
    }

    // Квест 16: Доспех сталкера (step 15)
    if (state.mainQuestStep === 15) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 16: ДОСПЕХ СТАЛКЕРА]:</b></p>`;
      body += `<p><i>«Шкура Хозяина тайги у тебя? На верстаке из неё, 3 металлолома и 2 проволок сошьем настоящую броню сталкера! Она и от пуль защитит, и вещмешок расширит до 30 кг!»</i></p>`;
    }

    // Стандартные услуги Прохора
    actions.push(
      {
        text: '🎒 Улучшить вещмешок до 25 кг (за 5 металлолома)',
        action: () => {
          if (state.maxWeight >= 25) {
            toast('Вещмешок уже улучшен!');
          } else if (getItemCount('scrap') >= 5) {
            removeItem('scrap', 5);
            state.maxWeight = 25.0;
            toast('Кузьмич расширил ваш вещмешок до 25 кг!');
            sfx.playSuccess();
            updateHUD();
            closeModal();
          } else {
            toast('Нужно 5 ед. металлолома.');
          }
        }
      },
      {
        text: '🔧 Купить моток сталистой проволоки (за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            addItem('wire', 1);
            toast('Куплен моток сталистой проволоки');
            sfx.playSuccess();
            saveState();
            talkProkhor();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      },
      {
        text: '⚙️ Купить металлолом (2 ед. за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('scrap', 2);
            toast('Куплен металлолом (+2 шт.)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkProkhor();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      },
      {
        text: '🔪 Купить кованый таёжный нож (за 3 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 3) {
            removeItem('ammo', 3);
            addItem('knife', 1);
            toast('Куплен острый таёжный нож из рессорной стали');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkProkhor();
          } else {
            toast('Недостаточно патронов (нужно 3 шт.)');
          }
        }
      },
      {
        text: '🔩 Сдать 3 металлолома в кузницу (+10 репутации, +1 патрон)',
        action: () => {
          if (getItemCount('scrap') >= 3) {
            removeItem('scrap', 3);
            addItem('ammo', 1);
            state.reputation += 10;
            toast('Прохор принял лом в переплавку (+10 репутации, +1 патрон)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkProkhor();
          } else {
            toast('Нужно минимум 3 ед. металлолома.');
          }
        }
      }
    );

    
    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ ПРОХОРА ---
    // Ежедневное поручение: Дрова для костра
    const dailyWood = (state.dailyQuests || []).find(q => q.id === 'daily_wood' && !q.completed && q.current >= q.goal);
    if (dailyWood) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: ДРОВА ДЛЯ КОСТРА]:</b> <i>«Хороший сушняк приволок, смолистый! Теперь костёр до утра не затухнет, зверьё к частоколу не сунется. Держи довольствие от лагеря.»</i></p>`;
      actions.push({
        text: `🪵 «Кузьмич, сдать 2 охапки сухих дров для костра (+${dailyWood.rewardRep} реп, +${dailyWood.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_wood');
          talkProkhor();
        },
        primary: true
      });
    }

    // «Уголь для горна»
    if (!state.sideQuests?.sq_coal_prokhor?.status && state.mainQuestStep >= 3) {
      actions.push({
        text: '🔨 «Кузьмич, подсобить металлом или углем для горна?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_coal_prokhor = { status: 'active' };
          toast('📜 Взято поручение: «Уголь для горна» (Принести 2 лома Прохору)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkProkhor();
        }
      });
    } else if (state.sideQuests?.sq_coal_prokhor?.status === 'active') {
      const hasScrap = getItemCount('scrap') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[УГОЛЬ И МЕТАЛЛ]:</b> <i>«Притащил пару кусков металлолома для горна? Жар стынет!»</i></p>`;
      if (hasScrap) {
        actions.push({
          text: '🔨 «Кузьмич, держи 2 куска металлолома для наковальни!»',
          action: () => {
            removeItem('scrap', 2);
            state.sideQuests.sq_coal_prokhor.status = 'completed';
            addItem('wire', 3);
            addItem('ammo', 2);
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Уголь для горна» (+15 репутации, 3 проволоки, 2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkProkhor();
          },
          primary: true
        });
      }
    }

    // «Кованые скобы»
    if (!state.sideQuests?.sq_nails_prokhor?.status && state.mainQuestStep >= 3) {
      actions.push({
        text: '⛓️ «Кузьмич, давай кувалду! Нарубим скоб для частокола (-25% энергии)»',
        action: () => {
          if (state.energy < 25) {
            toast('Нужно 25% энергии для тяжелой работы у наковальни!');
            return;
          }
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_nails_prokhor = { status: 'completed' };
          state.energy -= 25;
          addItem('trap', 1);
          state.reputation += 15;
          toast('⭐ Скобы выкованы! Прохор вручил новенький стальной капкан (+15 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkProkhor();
        }
      });
    }

    // Сейф инженера Кузьмина
    if (state.questFlags.safe_cracked && !state.questFlags.safe_reported) {
      actions.push({
        text: '📐 «Кузьмич, в сейфе на станции были чертежи инженера Кузьмина!»',
        action: () => {
          state.questFlags.safe_reported = true;
          state.reputation += 35;
          toast('⭐ Прохор модернизировал ваш рюкзак по чертежам Кузьмина (+35 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkProkhor();
        },
        primary: true
      });
    }

    // Геологоразведка «Енисей-3»: минерал
    if (state.questFlags.geo2_done && !state.hasGeoCompass) {
      actions.push({
        text: '🧭 «Прохор, я достал аномальный минерал из скважины №7!»',
        action: () => {
          state.hasGeoCompass = true;
          addItem('geo_compass', 1);
          state.reputation += 40;
          toast('🏆 Прохор собрал Компас «Енисей» (-5 энергии на все вылазки, +40 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkProkhor();
        },
        primary: true
      });
    }

        // Квест высокой репутации (70+): Особая заточка Кузьмича
    const prokhorRep = getNpcRep('prokhor');
    if (prokhorRep >= 70 && !state.highRepQuests?.prokhor?.status) {
      actions.push({
        text: '🔨 «Кузьмич, покажи свой фирменный секрет закалки стали!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.prokhor = { status: 'completed' };
          addItem('ammo', 10);
          addItem('knife', 1);
          changeNpcRep('prokhor', 20);
          state.reputation += 35;
          toast('⭐ Кузьмич выполнил особую заточку вашего клинка и подарил патроны (+1 кованый нож, +10 патронов, +20 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkProkhor();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  function talkEgor() {
    const npc = NPCS.egor;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_egor = true;

    let body = renderNpcRepHeader('egor');
    body += `<p>Егор чистит шкуру зайца за деревянным столом. Рядом лежит старая двустволка и плетёные верши.</p>`;
    body += `<p><i>«Тайга любит терпеливых. У реки червей накопай, удочку сооруди — голодным никогда не останешься. А будешь в чаще — смотри под ноги, волчьих следов полно.»</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Егором об охоте и тайге»',
      action: () => openNpcChat('egor')
    });

    // Квест 2
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: УРОКИ ВЫЖИВАНИЯ]:</b> Егор кивает вам: <i>«Батя говорил про тебя. Держись ближе к реке, учись ловить рыбу — тогда не пропадёшь.»</i></p>`;
      actions.push({
        text: '«Батя велел перенять таёжный опыт. Рад знакомству, Егор!»',
        action: () => {
          state.questFlags.met_egor = true;
          toast('⭐ Знакомство с охотником Егором зачтено!');
          sfx.playSuccess();
          checkStarterQuestProgress();
          talkEgor();
        },
        primary: true
      });
    }

    // Квест 4: Голодный рассвет (step 3)
    if (state.mainQuestStep === 3) {
      const hasFishMeal = getItemCount('fish_soup') > 0 || getItemCount('cooked_fish') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 4: ГОЛОДНЫЙ РАССВЕТ]:</b></p>`;
      body += `<p><i>«В лагере шаром покати. Сделай удочку на верстаке, вылови рыбу на Быстрянке и приготовь её на костре (запеки или свари уху). Покажи, что умеешь кормить общину!»</i></p>`;
      if (hasFishMeal) {
        actions.push({
          text: '🍲 «Угостить Егора свежей рыбой с костра (Завершить квест 4)»',
          action: () => {
            if (getItemCount('fish_soup') > 0) removeItem('fish_soup', 1);
            else removeItem('cooked_fish', 1);
            state.mainQuestStep = 4;
            state.reputation += 20;
            addItem('ammo', 2);
            toast('⭐ Квест 4 выполнен: «Голодный рассвет» (+20 репутации, +2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🎣 «Отправиться на реку ловить рыбу»',
          action: () => {
            closeModal();
            switchTab('tabMap');
          }
        });
      }
    }

    // Квест 7: Следы на иле (step 6)
    if (state.mainQuestStep === 6) {
      const hasLeather = getItemCount('leather') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 7: СЛЕДЫ НА ИЛЕ]:</b></p>`;
      body += `<p><i>«У кромки воды появились следы болотных мутантов. Сколоти капкан на верстаке у Прохора, взведи на берегу или в угодьях и добудь шкуру зверя!»</i></p>`;
      if (hasLeather) {
        actions.push({
          text: '🐾 «Показать шкуру зверя Егору (Завершить квест 7)»',
          action: () => {
            state.mainQuestStep = 7;
            state.reputation += 25;
            addItem('ammo', 3);
            toast('⭐ Квест 7 выполнен: «Следы на иле» (+25 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      }
    }

    // Квест 15: Хозяин тайги (step 14)
    if (state.mainQuestStep === 14) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 15: ХОЗЯИН ТАЙГИ]:</b></p>`;
      body += `<p><i>«Шатун — не простой медведь. Его бока покрыты костяными наростами от мутаций. Бей копьём под лопатку или трижды стреляй в пасть. Иди в Охотничьи угодья, я помогу выследить зверя по следу!»</i></p>`;
      actions.push({
        text: '🏹 «Принять охотничий совет Егора по Шатуну»',
        action: () => {
          state.questFlags.talked_bear = true;
          toast('Вы узнали уязвимые места Хозяина тайги!');
          sfx.playSuccess();
          talkEgor();
        },
        primary: true
      });
    }

    // Стартовая наживка (выдаётся Егором только 1 раз!)
    if (!state.questFlags.egor_starter_worms) {
      actions.push({
        text: '🪱 Взять стартовую наживку (3 червя бесплатно от Егора)',
        action: () => {
          state.questFlags.egor_starter_worms = true;
          addItem('worms', 3);
          toast('Егор отсыпал 3 червя: «Вот на первое время. А дальше сам на реке копай!»');
          sfx.playSuccess();
          saveState();
          talkEgor();
        },
        primary: true
      });
    } else {
      actions.push({
        text: '🪱 Купить банку отборных червей (5 шт. за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('worms', 5);
            toast('Егор отсыпал банку жирных червей.');
            sfx.playSuccess();
            saveState();
            talkEgor();
          } else {
            toast('Не хватает патронов. Накопайте червей бесплатно на берегу реки Быстрянки!');
          }
        }
      });
    }

    // Стандартные услуги Егора
    actions.push(
      {
        text: '🐟 Сдать 2 сырые рыбы в общий котёл (+5 репутации, +1 патрон)',
        action: () => {
          if (getItemCount('raw_fish') >= 2) {
            removeItem('raw_fish', 2);
            addItem('ammo', 1);
            state.reputation += 5;
            toast('Егор принял рыбу в общий котёл (+5 репутации, +1 патрон)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkEgor();
          } else {
            toast('Нужно минимум 2 рыбы.');
          }
        }
      },
      {
        text: '🐟 Купить вяленую рыбу в дорогу (за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('dried_fish', 1);
            toast('Егор достал из коптильни порцию вяленой рыбы');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkEgor();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      }
    );

    
    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ ЕГОРА ---
    // Ежедневное поручение: Рыбный день
    const dailyFish = (state.dailyQuests || []).find(q => q.id === 'daily_fish' && !q.completed && q.current >= q.goal);
    if (dailyFish) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: РЫБНЫЙ ДЕНЬ]:</b> <i>«Ого, знатная рыбалка выдалась! Быстрянка сегодня расщедрилась. Давай сюда улов на коптильню, община сыта будет. Держи патроны за труды.»</i></p>`;
      actions.push({
        text: `🐟 «Егор, сдать свежий улов по поручению (+${dailyFish.rewardRep} реп, +${dailyFish.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_fish');
          talkEgor();
        },
        primary: true
      });
    }

    // «Копчёная щука»
    if (!state.sideQuests?.sq_fish_egor?.status && state.mainQuestStep >= 3) {
      actions.push({
        text: '🎣 «Егор, помочь заготовить рыбу для лагерной коптильни?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_fish_egor = { status: 'active' };
          toast('📜 Взято поручение: «Копчёная щука» (Поймать 3 рыбы и принести 2 дров)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkEgor();
        }
      });
    } else if (state.sideQuests?.sq_fish_egor?.status === 'active') {
      const hasFishMeal = getItemCount('raw_fish') >= 3 && getItemCount('firewood') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[ЛАГЕРНАЯ КОПТИЛЬНЯ]:</b> <i>«Быстрянка сегодня щедрая. Наловил три щуки да пару сухих поленьев принёс?»</i></p>`;
      if (hasFishMeal) {
        actions.push({
          text: '🎣 «Вот 3 свежих рыбы и сухие ольховые дрова для коптильни»',
          action: () => {
            removeItem('raw_fish', 3);
            removeItem('firewood', 2);
            state.sideQuests.sq_fish_egor.status = 'completed';
            addItem('fish_soup', 2);
            addItem('ammo', 2);
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Копчёная щука» (+15 репутации, 2 ухи, 2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkEgor();
          },
          primary: true
        });
      }
    }

    // «Силки на глухаря»
    if (!state.sideQuests?.sq_snare_egor?.status && state.mainQuestStep >= 4) {
      actions.push({
        text: '🦃 «Егор, покажи, как ставить силки на глухаря в подлеске?»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_snare_egor = { status: 'active' };
          toast('📜 Взято поручение: «Силки на глухаря» (Добыть мясо птицы)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkEgor();
        }
      });
    } else if (state.sideQuests?.sq_snare_egor?.status === 'active') {
      const hasMeat = getItemCount('raw_meat') >= 1;
      body += `<p style="color:var(--accent-gold);"><b>[ОХОТА НА ГЛУХАРЯ]:</b> <i>«Попалась боровая птица в проволочную петлю?»</i></p>`;
      if (hasMeat) {
        actions.push({
          text: '🦃 «Добыл дичь в силок, как ты учил! Вот свежее мясо»',
          action: () => {
            removeItem('raw_meat', 1);
            state.sideQuests.sq_snare_egor.status = 'completed';
            addItem('cooked_meat', 2);
            state.reputation += 15;
            toast('⭐ Поручение выполнено: «Силки на глухаря» (+15 репутации, 2 вяленых мяса)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkEgor();
          },
          primary: true
        });
      }
    }

    // «Расчистка мостков»
    if (!state.sideQuests?.sq_pier_egor?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '🪵 «Помогу багром и топором отжать топляк от мостков (-15% энергии)»',
        action: () => {
          if (state.energy < 15) {
            toast('Слишком устали для тяжелой работы у реки!');
            return;
          }
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_pier_egor = { status: 'completed' };
          state.energy -= 15;
          addItem('worms', 6);
          state.reputation += 15;
          toast('⭐ Мостки у причала расчищены! Егор отсыпал отборных червей (+15 репутации, 6 червей)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkEgor();
        }
      });
    }

    // Подсказка Егора о волчьем логове и щенке
    if (!state.questFlags.wolves_defeated) {
      body += `<p style="color:var(--text-dim); font-size:12px;"><i>«В Ближнем лесу под корнями вывороченного кедра матерый волчище логово устроил. Стаю сколотил, никому проходу не даёт. Пока вожака оружием не осадишь — в чащу лучше не соваться.»</i></p>`;
    } else if (state.questFlags.wolves_defeated && !state.questFlags.pup_rescued) {
      body += `<p style="color:var(--accent-gold);"><i>«Слыхал, как ты вожака волчьего положил! Доброе дело сделал. Только вот охотники сказывали — в малиннике у логова вроде скулит кто-то жалобно... Сходи в лес, проверь, вдруг зверёныш какой в капкан попал? Возьми с собой бинт.»</i></p>`;
    }

    // Буран: сколотить конуру
    if (state.questFlags.pup_rescued && !state.hasDog) {
      const canBuild = getItemCount('firewood') >= 3 && getItemCount('wire') >= 1 && getItemCount('leather') >= 1;
      body += `<p style="color:var(--accent-gold);"><b>[ЩЕНОК БУРАН]:</b> Егор гладит щенка за ухом: <i>«Лайка чистейших кровей! Сколоти ему тёплую конуру на верстаке или прямо сейчас (3 дров, 1 проволока, 1 кожа) — лучшего друга в тайге не найдёшь!»</i></p>`;
      if (canBuild) {
        actions.push({
          text: '🐕 Сколотить тёплую конуру для Бурана (3 дров, 1 проволока, 1 кожа)',
          action: () => {
            removeItem('firewood', 3);
            removeItem('wire', 1);
            removeItem('leather', 1);
            state.hasDog = true;
            state.questFlags.dog_house_built = true;
            state.reputation += 35;
            toast('🐶 БУРАН ВЫРОС И СТАЛ ВАШИМ ВЕРНЫМ СПУТНИКОМ! (+25% урона в боях, +35 репутации)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderNPCs();
            renderQuests();
            renderRecipes();
            interactWithDog();
          },
          primary: true
        });
      } else {
        actions.push({
          text: '🔨 Перейти к верстаку (рецепт конуры)',
          action: () => {
            closeModal();
            switchTab('tabCraft');
            switchCraftStation('bench');
          }
        });
      }
    } else if (state.hasDog) {
      body += `<p style="color:var(--accent-gold);"><b>[БУРАН]:</b> Егор с гордостью кивает на конуру: <i>«Ладная будка вышла! Пёс сыт, крепок и чует любого зверя за версту. Не забывай трепать его за ухом перед вылазкой!»</i></p>`;
    }

        // Квест высокой репутации (70+): Тайный омут Егора
    const egorRep = getNpcRep('egor');
    if (egorRep >= 70 && !state.highRepQuests?.egor?.status) {
      actions.push({
        text: '🎣 «Егор, покажи мне свой секретный омут на Быстрянке!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.egor = { status: 'completed' };
          addItem('fish', 3);
          addItem('worms', 5);
          changeNpcRep('egor', 20);
          state.reputation += 35;
          toast('⭐ Егор показал тайный омут у переката! Получено 3 отборные рыбы и наживка (+20 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkEgor();
        }
      });
    }

    checkStarterQuestProgress();
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // --- ДЕЙСТВИЯ В ЛАГЕРЕ ---
  
  // --- ПИТОМЕЦ БУРАН (ВЕРНАЯ ЛАЙКА) ---
  function interactWithDog() {
    sfx.init();
    sfx.playSuccess();
    let body = `<p>Буран радостно взвизгивает, заметив вас! Пёс упирается передними лапами вам в колени, энергично виляет пушистым хвостом и тычется мокрым холодным носом в ладонь.</p>`;
    body += `<p><i>«Густой подшёрсток лайки пахнет таёжным снегом, сосновой хвоей и костровым дымом. В умных янтарных глазах читается абсолютная, беззаветная преданность. С таким другом никакие волки и шатуны не страшны!»</i></p>`;
    body += `<div style="background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px; margin:8px 0; border:1px solid rgba(255,255,255,0.12);">
      <b style="color:var(--accent-gold); font-size:12px;">🐾 Бонусы верного компаньона:</b><br>
      • <b>+25% к урону</b> в любых таёжных схватках (волчьи стаи, вепрь, медведь-шатун)<br>
      • <b>Таёжное чутьё:</b> 35% шанс каждое утро получить ценную дичь или патроны, найденные Бураном
    </div>`;

    const actions = [
      {
        text: '🦴 Потрепать Бурана за ухом (+10 энергии)',
        action: () => {
          state.energy = Math.min(state.maxEnergy || 100, state.energy + 10);
          toast('🐶 Буран довольно жмурится и виляет хвостом (+10% энергии).');
          sfx.playClick();
          updateHUD();
          closeModal();
        },
        primary: true
      }
    ];

    if (getItemCount('cooked_meat') > 0 || getItemCount('cooked_fish') > 0) {
      actions.push({
        text: '🥩 Угостить Бурана куском жареной рыбы или мяса',
        action: () => {
          if (getItemCount('cooked_meat') > 0) removeItem('cooked_meat', 1);
          else removeItem('cooked_fish', 1);
          state.reputation += 5;
          toast('🐕 Буран с урчанием проглатывает угощение и благодарно лижет вам пальцы (+5 репутации)!');
          sfx.playSuccess();
          updateHUD();
          interactWithDog();
        }
      });
    }

    openModal('Буран (Западносибирская лайка)', 'Верный четвероногий друг', 'assets/images/dog.png?v=2.2', body, actions);
  }

  // --- ДЕД СПИРИДОН (СТАРОВЕР-ЗНАХАРЬ) ---
  function talkSpiridon() {
    const npc = NPCS.spiridon;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_spiridon = true;

    let body = renderNpcRepHeader('spiridon');
    body += `<p>Дед Спиридон сидит на лавке у бревенчатой стены своей заимки, чистит деревянной ложкой сушеные травы и неспешно подкладывает лучину в чугунную плошку. В избе пахнет сухим чабрецом, воском и ладаном.</p>`;
    body += `<p><i>«Мир избе твоей, чадо. Слышу по дыханию — тяжёл твой путь был сквозь трясину. В тайге суета — первый враг. Сядь, отдышись у огня. Земля наша хоть и покалечена железной бедой, а силу живую в травах хранит. Коли с уважением к лесу придёшь — всё отдаст.»</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с дедом Спиридоном о тайнах тайги»',
      action: () => openNpcChat('spiridon')
    });

    // Квест 2 Спиридона: Ведьмин гриб
    if (state.sideQuests?.spiridon_mushrooms?.status === 'active') {
      const hasMushrooms = getItemCount('amanita') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ЗНАХАРСКИЙ СБОР]:</b> <i>«Набрал мухоморов с красной шляпкой в белую крапинку? Они в чаще под старыми березами прячутся.»</i></p>`;
      if (hasMushrooms) {
        actions.push({
          text: '🍄 «Вот три ядрёных мухомора, дедушка (Сдать Спиридону)»',
          action: () => {
            removeItem('amanita', 3);
            state.sideQuests.spiridon_mushrooms.status = 'completed';
            addItem('spiridon_vodka', 2);
            state.reputation += 30;
            toast('⭐ Дед Спиридон сварил первую партию «Спиридоновки» и обучил вас рецептам (+2 настойки, +30 репутации)! Теперь их можно варить на костре лагеря.');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkSpiridon();
          },
          primary: true
        });
      }
    } else if (!state.sideQuests?.spiridon_mushrooms?.status) {
      actions.push({
        text: '🍄 «Дед Спиридон, научи меня варить таёжную настойку от усталости!»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.spiridon_mushrooms = { status: 'active' };
          toast('📜 Взято задание: «Ведьмин гриб» (Собрать 3 мухомора в лесу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkSpiridon();
        },
        primary: true
      });
    }

    // Сюжетная ветка: Геологоразведка «Енисей-3» (триангулятор на скале)
    if (!state.questFlags.geo1_done) {
      body += `<p style="color:var(--accent-gold);"><b>[ТАЙНА ТРИАНГУЛЯТОРА НА СОПКЕ]:</b> <i>«Ты в Ближнем лесу на скалу над сосняком глядел? До Каскада туда геологи городские с железными треногами лазали — триангуляцию ставили. Сказывали, секретную скважину бурили у Быстрянки, что-то аномальное из недр достать силились. На треноге на вершине скалы в металлическом тубусе их карты пластов до сих пор лежат... Сходи, поднимись на скалу в лесу, глянь тубус.»</i></p>`;
      actions.push({
        text: '📍 «Дед Спиридон, расскажи про партию геологов и триангулятор на скале»',
        action: () => {
          state.questFlags.spiridon_told_geo = true;
          toast('📍 Дед Спиридон отметил скалу с триангулятором в Ближнем лесу!');
          sfx.playClick();
          saveState();
          renderQuests();
          openModal(
            'Старовер о партии геологов «Енисей-3»',
            'Заимка деда Спиридона • Тайны тайги',
            'assets/images/npc_spiridon.png',
            `<p><i>«Дело давнее, сынок. Года за два до аварии на вездеходах понаехали буровики из партии «Енисей-3». На сопке в лесу триангуляционную вышку из дюраля вбили, а в пойме Быстрянки шурф глубокий забурили — скважину номер семь. Говорили, гравитация там шалит и стрелка компаса кругом ходит.»</i></p>
             <p><i>«Когда Каскад грянул, они всё побросали и ушли налегке. А тубус с картами пластов так на скале и прикручен к треноге. Поднимись на скалу в Ближнем лесу — с твоей солдатской сноровкой тубус снять пара пустяков. А по их карте и саму скважину у реки сыщешь.»</i></p>`,
            [{ text: '«Спасибо за наводку, дедушка. Обязательно поднимусь на скалу.»', action: () => { closeModal(); talkSpiridon(); }, primary: true }]
          );
        }
      });
    } else if (state.questFlags.geo1_done && !state.questFlags.geo2_done) {
      body += `<p style="color:var(--accent-blue);"><b>[ПОИСК СКВАЖИНЫ]:</b> <i>«Снял тубус с триангулятора? Добро. Теперь ищи скважину №7 в пойме Быстрянки — там шурф заилило, откачать надо, чтобы до черного керна добраться.»</i></p>`;
    } else if (state.questFlags.geo2_done && !state.hasGeoCompass) {
      body += `<p style="color:var(--accent-green);"><b>[АНОМАЛЬНЫЙ КЕРН]:</b> <i>«Черный минерал греет ладонь? То-то же. Неси его Прохору в лагерь — он мужик рукастый, вставит камень в латунный корпус, смастерит надежный геологический компас «Енисей».»</i></p>`;
    } else if (state.hasGeoCompass) {
      body += `<p style="color:var(--accent-green); font-size:12px;"><b>[КОМПАС ГЕОЛОГОВ]:</b> <i>«Вижу, компас «Енисей» у тебя на портупее поблескивает. Доброе дело сделали — ведовство геологов людям на пользу пошло.»</i></p>`;
    }

    // Рецепты алхимии Спиридона (доступны только после завершения обучения и сдачи мухоморов)
    if (state.sideQuests?.spiridon_mushrooms?.status === 'completed') {
      body += `<p style="color:var(--accent-green); font-size:12px;"><b>[ТАЙНЫ СТАРОВЕРОВ]:</b> <i>«Теперь ты посвящен в знахарство. Можешь готовить снадобья прямо здесь или у костра в лагере.»</i></p>`;
      actions.push(
        {
          text: '🧪 Сварить «Спиридоновку» (1 мухомор, 1 спирт, 1 чистая вода)',
          action: () => {
            if (getItemCount('amanita') >= 1 && getItemCount('alcohol') >= 1 && getItemCount('clean_water') >= 1) {
              removeItem('amanita', 1);
              removeItem('alcohol', 1);
              removeItem('clean_water', 1);
              addItem('spiridon_vodka', 1);
              toast('🧪 Сварен флакон крепкой «Спиридоновки» (+40 энергии при приеме)!');
              sfx.playSuccess();
              updateHUD();
              saveState();
              talkSpiridon();
            } else {
              toast('Нужно: 1 мухомор, 1 спирт и 1 чистая вода.');
            }
          }
        },
        {
          text: '🍯 Сварить «Дегтярный бальзам» (1 сфагнум, 1 дрова, 1 травы)',
          action: () => {
            if (getItemCount('swamp_moss') >= 1 && getItemCount('firewood') >= 1 && getItemCount('herbs') >= 1) {
              removeItem('swamp_moss', 1);
              removeItem('firewood', 1);
              removeItem('herbs', 1);
              addItem('tar_salve', 1);
              toast('🍯 Приготовлен «Дегтярный бальзам» (+40 HP, защита от урона на 3 вылазки)!');
              sfx.playSuccess();
              updateHUD();
              saveState();
              talkSpiridon();
            } else {
              toast('Нужно: 1 сфагнум, 1 дрова и 1 травы.');
            }
          }
        },
        {
          text: '👁️ Сварить эликсир «Око рыси» (2 брусники, 1 травы, 1 чистая вода)',
          action: () => {
            if (getItemCount('berries') >= 2 && getItemCount('herbs') >= 1 && getItemCount('clean_water') >= 1) {
              removeItem('berries', 2);
              removeItem('herbs', 1);
              removeItem('clean_water', 1);
              addItem('lynx_eye', 1);
              toast('👁️ Приготовлен эликсир «Око рыси» (ночные вылазки без штрафов к энергии)!');
              sfx.playSuccess();
              updateHUD();
              saveState();
              talkSpiridon();
            } else {
              toast('Нужно: 2 брусники, 1 травы и 1 чистая вода.');
            }
          }
        }
      );
    }

    actions.push(
      {
        text: '🍶 Купить спирт за 2 патрона',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            addItem('alcohol', 1);
            toast('Куплен флакон чистого медицинского спирта.');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSpiridon();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      },
      {
        text: '🌿 Купить сушёные целебные травы (1 шт. за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('herbs', 1);
            toast('Спиридон достал из берестяного туеска пучок сушёной полыни и чабреца');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSpiridon();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      }
    );

        // Квест высокой репутации (70+): Благословение тайги
    const spiridonRep = getNpcRep('spiridon');
    if (spiridonRep >= 70 && !state.highRepQuests?.spiridon?.status) {
      actions.push({
        text: '🌲 «Дед Спиридон, проведи надо мной обряд очищения тайги» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.spiridon = { status: 'completed' };
          state.radiation = 0;
          state.hp = 100;
          changeNpcRep('spiridon', 20);
          state.reputation += 35;
          toast('⭐ Спиридон окурил вас чабрецом и можжевельником: радиация снята, HP 100% (+20 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkSpiridon();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // --- САША «СВЯЗИСТ» (РАДИОТЕХНИК НИИ) ---
  function talkSasha() {
    const npc = NPCS.sasha;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_sasha = true;

    let body = renderNpcRepHeader('sasha');
    body += `<p>Александр сидит за верстаком в радиорубке, поправив перемотанные синей изолентой очки. Из динамика лампового приёмника Р-326 доносится тихое атмосферное шипение и далёкие щелчки морзянки.</p>`;
    body += `<p><i>«Привет! Знаешь, после того ада в реакторном зале я думал, что радиоэфир навсегда мёртв. Но нет! Если правильно согласовать антенну и отфильтровать помехи от ионизированных облаков — в эфире можно поймать радиомаяки старых аварийных сбросов. Раз в сутки я могу проводить пеленгацию для тебя!»</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Сашей о радиоэфире и технике»',
      action: () => openNpcChat('sasha')
    });

    // Ежедневное сканирование радиоэфира
    if (!state.sashaRadioUsedToday) {
      actions.push({
        text: '📡 «Саша, включи радиосканер: найди аварийный контейнер на сегодня»',
        action: () => {
          state.sashaRadioUsedToday = true;
          const locs = ['river', 'forest', 'swamp', 'pump_station'];
          state.activeStashLocation = locs[Math.floor(Math.random() * locs.length)];
          const locNames = { river: 'Реке Быстрянке', forest: 'Ближнем лесу', swamp: 'Гнилой гати', pump_station: 'Насосной станции' };
          toast(`📡 СИГНАЛ ЗАПЕЛЕНГОВАН! Саша поймал радиомаяк аварийного контейнера на ${locNames[state.activeStashLocation]}!`);
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkSasha();
        },
        primary: true
      });
    } else {
      const locNames = { river: 'Реке Быстрянке', forest: 'Ближнем лесу', swamp: 'Гнилой гати', pump_station: 'Насосной станции' };
      body += `<p style="color:var(--accent-green);">📡 <b>Пеленг активен:</b> Радиомаяк сброса ждет вас на <u>${locNames[state.activeStashLocation] || 'локации'}</u>! Заберите контейнер во вкладке «Вылазка».</p>`;
    }

    // Сборка Дозиметра ДП-5
    if (getItemCount('geiger_counter') === 0 && !state.hasGeiger) {
      actions.push({
        text: '☢️ Собрать армейский Счётчик Гейгера ДП-5 (2 лома, 2 проволоки, 1 батарейка)',
        action: () => {
          if (getItemCount('scrap') >= 2 && getItemCount('wire') >= 2 && getItemCount('batteryaaa') >= 1) {
            removeItem('scrap', 2);
            removeItem('wire', 2);
            removeItem('batteryaaa', 1);
            addItem('geiger_counter', 1);
            state.hasGeiger = true;
            toast('☢️ Счётчик Гейгера ДП-5 собран! Пассивно снижает накопление радиации во всех вылазках на 30%!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSasha();
          } else {
            toast('Нужно: 2 металлолома, 2 проволоки и 1 батарейка.');
          }
        }
      });
    }

    // Сборка Электрофонаря
    if (getItemCount('electric_torch') === 0 && !state.hasElectricTorch) {
      actions.push({
        text: '🔦 Собрать полевой электрофонарь (1 проволока, 1 батарейка, 1 лом)',
        action: () => {
          if (getItemCount('wire') >= 1 && getItemCount('batteryaaa') >= 1 && getItemCount('scrap') >= 1) {
            removeItem('wire', 1);
            removeItem('batteryaaa', 1);
            removeItem('scrap', 1);
            addItem('electric_torch', 1);
            state.hasElectricTorch = true;
            toast('🔦 Полевой электрофонарь готов! Вечный источник света для ночных вылазок.');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSasha();
          } else {
            toast('Нужно: 1 проволока, 1 батарейка и 1 металлолом.');
          }
        }
      });
    }

    // Покупка батареек
    actions.push({
      text: '🔋 Купить батарейки 1.5В (за 2 патрона)',
      action: () => {
        if (getItemCount('ammo') >= 2) {
          removeItem('ammo', 2);
          addItem('batteryaaa', 1);
          toast('Куплен комплект сухих батареек стандарта ААА.');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkSasha();
        } else {
          toast('Недостаточно патронов.');
        }
      }
    });

    // Квест высокой репутации (70+): Глубокий радиопеленг
    const sashaRep = getNpcRep('sasha');
    if (sashaRep >= 70 && !state.highRepQuests?.sasha?.status) {
      actions.push({
        text: '📡 «Саша, сможем перепаять каскад усилителя для дальнего пеленга?» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.sasha = { status: 'completed' };
          addItem('ammo', 10);
          addItem('batteryaaa', 2);
          changeNpcRep('sasha', 20);
          state.reputation += 35;
          toast('⭐ Саша модернизировал ламповый каскад приемника (+10 патронов, 2 батарейки, +20 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkSasha();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }


  // --- ВАРЯ (ПОЛЕВОЙ ПОВАР ЛАГЕРЯ) ---
  function talkVarya() {
    const npc = NPCS.varya;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_varya = true;

    const rep = getNpcRep('varya');
    const tier = getNpcRepTitle(rep);

    let body = renderNpcRepHeader('varya');
    body += `<p>Варя — бойкая молодая девушка с живым взглядом и вздорной тёмной чёлкой, выбивающейся из-под вязаной шапочки. В лёгком ватнике с закатанными рукавами она ловко орудует деревянным черпаком над бурлящим котлом. На шее у неё на кожаном шнурке поблёскивает стреляная латунная гильза.</p>`;
    body += `<p><i>«Привет! Заходи к огню, не стесняйся. Я Варя, сама из Брянска. Готовить училась с детства, так что накормлю досыта даже из таёжного подножного корма! Только скажи сразу... ты с каким калибром в вылазки ходишь? Какой у тебя ствол?»</i></p>`;

    const actions = [];

    // Душевный разговор
    actions.push({
      text: '💬 «Поболтать с Варей о Брянске, новостях и стряпне»',
      action: () => openNpcChat('varya')
    });

    // Особый диалог: Тайна гильзы и спасения
    actions.push({
      text: '🔍 «Варя, а почему ты постоянно выспрашиваешь про калибр патронов?»',
      action: () => {
        openModal(
          'Тайна брянской беглянки',
          'Варя • История спасения',
          'assets/images/npc_varya.png?v=2.2',
          `<p>Варя машинально касается пальцами гильзы на груди, и её озорной взгляд на миг становится задумчивым и серьёзным.</p>
           <p><i>«Это длинная история... Когда всё рухнуло, я бежала на восток из родного Брянска. На старом мосту через Десну меня прижали мародёры из банды Лютого. Окружили, шансов спастись не было никаких... Я уже прощалась с жизнью. И вдруг из темноты со стороны леса — сухие, резкие щелчки выстрелов! Один за другим, без промаха! Троих бандитов на месте уложил, остальные с визгом в рассыпную.»</i></p>
           <p><i>«Я от страха глаза закрыла, а когда открыла — бандиты мертвы, а стрелок растворился в тумане. Даже лица не показал, ни слова не сказал! На мокром асфальте осталась лишь цепочка армейских следов и вот эта стреляная гильза с резким запахом пороха. Он спас мне жизнь... С тех пор я ищу его. Хочу взглянуть в глаза и сказать простое человеческое спасибо. Поэтому я у каждого бойца и охотника выспрашиваю калибр — вдруг однажды кто-то покажет мне именно тот патрон!»</i></p>
           <p style="color:var(--accent-gold); font-size:11.5px;">💡 Варя запомнит этот доверительный разговор (+5 к репутации у Вари)!</p>`,
          [
            {
              text: '«Обещаю обращать внимание на редкие гильзы и необычных стрелков в тайге»',
              action: () => {
                changeNpcRep('varya', 5);
                closeModal();
                talkVarya();
              },
              primary: true
            }
          ]
        );
      }
    });

    // Осмотр патронов
    if (getItemCount('ammo') > 0) {
      actions.push({
        text: '🎯 Показать свои патроны и сравнить калибры с гильзой Вари',
        action: () => {
          openModal(
            'Осмотр патронов с Варей',
            'Варя • Экспертиза калибров',
            'assets/images/npc_varya.png?v=2.2',
            `<p>Варя с неподдельным интересом берёт патрон из вашей ладони, подносит к свету костра и внимательно разглядывает донце гильзы и маркировку капсюля.</p>
             <p><i>«Так-так... стандартный 7.62х39 мм, армейская валовая партия. Надёжный патрон, в тайге незаменим. Но у моего спасителя гильза была чуть массивнее, с характерной закраиной и тонкой шейкой... Хотя форма пули похожа! Всё равно спасибо, что показал. Ты настоящий друг, держи горячую похлёбку с двойным наваром!»</i></p>`,
            [
              { text: '«Буду иметь в виду, Варя!»', action: () => { closeModal(); talkVarya(); }, primary: true }
            ]
          );
        }
      });
    }

    // 1. Дневная бесплатная похлёбка
    if (state.varyaStewClaimedDay !== state.day) {
      actions.push({
        text: '🍲 «Варя, можно порцию горячей похлёбки?» (Раз в день)',
        action: () => {
          state.varyaStewClaimedDay = state.day;
          addItem('varya_stew', 1);
          changeNpcRep('varya', 2);
          toast('🍲 Варя налила вам полную миску горячей похлёбки (+1 похлёбка, +2 к репутации у Вари)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkVarya();
        },
        primary: true
      });
    } else {
      body += `<p style="font-size:11.5px; color:var(--text-dim);">🍲 <i>«Дневную похлёбку ты уже слопал! Приходи завтра поутру, новый навар поспеет!»</i></p>`;
    }

    // 2. Набрать / очистить воду
    const hasFilter = getItemCount('gravel_filter') > 0 || state.sideQuests?.varya_filter?.status === 'completed';
    if (hasFilter && state.varyaWaterClaimedDay !== state.day) {
      actions.push({
        text: '💧 «Варя, набрать чистой воды через гравийный фильтр» (Бесплатно раз в день)',
        action: () => {
          state.varyaWaterClaimedDay = state.day;
          addItem('clean_water', 1);
          changeNpcRep('varya', 2);
          toast('💧 Набрана фляга родниковой воды через кухонный фильтр Вари (+1 чистая вода)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkVarya();
        }
      });
    }

    // Обмен сырой воды на чистую (кипячение в котле)
    if (getItemCount('raw_water') >= 2) {
      actions.push({
        text: '🫖 Вскипятить воду: обменять 2 сырой воды на 2 чистой',
        action: () => {
          removeItem('raw_water', 2);
          addItem('clean_water', 2);
          changeNpcRep('varya', 1);
          toast('🫖 Варя прокипятила речную воду в котле: получено 2 фляги чистой воды!');
          sfx.playClick();
          updateHUD();
          saveState();
          talkVarya();
        }
      });
    }

    // 3. Сдача припасов для кухни (поддержка лагеря и рост репутации)
    if (getItemCount('berries') >= 3) {
      actions.push({
        text: '🍒 Сдать лесную бруснику для компота (3 шт. ➔ 1 патрон, +5 реп)',
        action: () => {
          removeItem('berries', 3);
          addItem('ammo', 1);
          changeNpcRep('varya', 5);
          state.reputation += 8;
          toast('🍒 Брусника сдана на кухню! Варя выдала 1 патрон (+5 реп у Вари, +8 реп в лагере).');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkVarya();
        }
      });
    }

    if (getItemCount('fish') >= 2) {
      actions.push({
        text: '🐟 Сдать свежую рыбу для ухи (2 шт. ➔ 1 патрон, +6 реп)',
        action: () => {
          removeItem('fish', 2);
          addItem('ammo', 1);
          changeNpcRep('varya', 6);
          state.reputation += 10;
          toast('🐟 Рыба отдана в общий котёл! Варя выдала 1 патрон (+6 реп у Вари, +10 реп в лагере).');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkVarya();
        }
      });
    }

    if (getItemCount('firewood') >= 2) {
      actions.push({
        text: '🪵 Принести сухих дров для топки котла (2 шт. ➔ 1 патрон, +5 реп)',
        action: () => {
          removeItem('firewood', 2);
          addItem('ammo', 1);
          changeNpcRep('varya', 5);
          state.reputation += 8;
          toast('🪵 Дрова сложены у печи! Варя выдала 1 патрон (+5 реп у Вари, +8 реп в лагере).');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkVarya();
        }
      });
    }

    // --- ЛИЧНЫЕ КВЕСТЫ ВАРИ ---
    // Квест 1: Огонь и котелок (varya_fire)
    if (!state.sideQuests?.varya_fire?.status) {
      actions.push({
        text: '🔥 «Варя, помочь с растопкой кухни?» (Квест: Огонь и котелок)',
        action: () => {
          state.sideQuests = state.sideQuests || {};
          state.sideQuests.varya_fire = { status: 'active' };
          toast('📜 Взято поручение: «Огонь и котелок» (Принести 3 охапки сухих дров)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.sideQuests.varya_fire.status === 'active') {
      const hasWood = getItemCount('firewood') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ОГОНЬ И КОТЕЛОК]:</b> <i>«Дрова для печи принёс? Без сухого жара щи не закипят!»</i></p>`;
      if (hasWood) {
        actions.push({
          text: '🪵 «Вот 3 охапки сухих берёзовых дров, Варя!»',
          action: () => {
            removeItem('firewood', 3);
            state.sideQuests.varya_fire.status = 'completed';
            addItem('varya_stew', 2);
            changeNpcRep('varya', 15);
            state.reputation += 15;
            toast('⭐ Квест «Огонь и котелок» сдан (+2 порции похлёбки, +15 репутации у Вари)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // Квест 2: Чистый исток (varya_filter) - требует репутацию 25+
    if (rep >= 25 && state.sideQuests?.varya_fire?.status === 'completed' && !state.sideQuests?.varya_filter?.status) {
      actions.push({
        text: '💧 «Варя, как сделать воду на кухне чище?» (Квест: Чистый исток)',
        action: () => {
          state.sideQuests.varya_filter = { status: 'active' };
          toast('📜 Взято поручение: «Чистый исток» (Собрать: 2 древесных угля, 2 сфагнума, 1 металлолом)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.sideQuests?.varya_filter?.status === 'active') {
      const hasFilterMats = getItemCount('charcoal') >= 2 && getItemCount('swamp_moss') >= 2 && getItemCount('scrap') >= 1;
      body += `<p style="color:var(--accent-gold);"><b>[ЧИСТЫЙ ИСТОК]:</b> <i>«Нужны 2 угля, 2 сфагнума и кусок жести для гравийного фильтра.»</i></p>`;
      if (hasFilterMats) {
        actions.push({
          text: '🪨 «Собрать гравийный фильтр тонкой очистки для кухни»',
          action: () => {
            removeItem('charcoal', 2);
            removeItem('swamp_moss', 2);
            removeItem('scrap', 1);
            state.sideQuests.varya_filter.status = 'completed';
            addItem('gravel_filter', 1);
            changeNpcRep('varya', 25);
            state.reputation += 25;
            toast('⭐ Гравийный фильтр Вари готов! Теперь можно бесплатно набирать чистую воду каждый день (+25 реп)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // Квест 3: Вкус прежнего мира (varya_royal_soup) - требует репутацию 70+
    if (rep >= 70 && !state.sideQuests?.varya_royal_soup?.status) {
      actions.push({
        text: '🍲 «Варя, давай сварим настоящий праздник для всего лагеря!»',
        action: () => {
          state.sideQuests.varya_royal_soup = { status: 'active' };
          toast('📜 Взято поручение: «Вкус прежнего мира» (Принести: 1 тушёнку, 3 брусники, 2 чистой воды, 2 дров)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.sideQuests?.varya_royal_soup?.status === 'active') {
      const hasSoupMats = getItemCount('canned_food') >= 1 && getItemCount('berries') >= 3 && getItemCount('clean_water') >= 2 && getItemCount('firewood') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[ВКУС ПРЕЖНЕГО МИРА]:</b> <i>«Ох, если найдёшь банку армейской тушёнки, брусники и чистой воды — сотворим борщ, какого тайга ещё не пробовала!»</i></p>`;
      if (hasSoupMats) {
        actions.push({
          text: '🍲 «Сварить Праздничный таёжный борщ вместе с Варей»',
          action: () => {
            removeItem('canned_food', 1);
            removeItem('berries', 3);
            removeItem('clean_water', 2);
            removeItem('firewood', 2);
            state.sideQuests.varya_royal_soup.status = 'completed';
            addItem('royal_soup', 2);
            changeNpcRep('varya', 30);
            state.reputation += 35;
            toast('🏆 Праздничный таёжный борщ готов! Открыт рецепт для костра (+2 порции, +30 реп у Вари, +35 лагерю)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // --- ПЕРЕСЕКАЮЩИЕСЯ КВЕСТЫ (СОЮЗЫ) ---
    // 1. Большой таёжный пир (Варя + Егор, реп >= 50)
    const egorRep = getNpcRep('egor');
    if (rep >= 50 && egorRep >= 50 && !state.crossQuests?.cross_feast?.status) {
      actions.push({
        text: '🍖 «Варя, мы с Егором предлагаем устроить Большой таёжный пир!»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_feast = { status: 'active' };
          toast('⚔️ СОЮЗ ЖИТЕЛЕЙ: Взят квест «Большой таёжный пир» (Варя + Егор)! Нужно: 2 мяса, 3 рыбы, 3 ягоды.');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.crossQuests?.cross_feast?.status === 'active') {
      const hasFeastMats = getItemCount('raw_meat') >= 2 && getItemCount('fish') >= 3 && getItemCount('berries') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[СОЮЗ: БОЛЬШОЙ ТАЁЖНЫЙ ПИР]:</b> <i>«Егор обещал подсобить с разделкой! Принёс 2 мяса, 3 рыбы и 3 брусники?»</i></p>`;
      if (hasFeastMats) {
        actions.push({
          text: '🎉 «Сдать припасы и зажечь праздничный костёр пира»',
          action: () => {
            removeItem('raw_meat', 2);
            removeItem('fish', 3);
            removeItem('berries', 3);
            state.crossQuests.cross_feast.status = 'completed';
            addItem('smoked_feast', 2);
            changeNpcRep('varya', 25);
            changeNpcRep('egor', 25);
            state.reputation += 50;
            toast('🏆 БОЛЬШОЙ ТАЁЖНЫЙ ПИР СОСТОЯЛСЯ! Весь лагерь празднует (+25 реп Варе, +25 реп Егору, +50 лагерю, открыт рецепт «Окорок по-лесному»)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // 2. Полевой автоклав и дистиллятор (Варя, Прохор, Анна, реп >= 50 у всех трёх)
    const prokhorRep = getNpcRep('prokhor');
    const annaRep = getNpcRep('anna');
    if (rep >= 50 && prokhorRep >= 50 && annaRep >= 50 && !state.crossQuests?.cross_autoclave?.status) {
      actions.push({
        text: '⚙️ «Варя, объединим силы с Прохором и Анной для сборки Автоклава?»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_autoclave = { status: 'active' };
          toast('⚔️ ТРОЙСТВЕННЫЙ СОЮЗ: Взят квест «Полевой автоклав» (Варя + Прохор + Анна)! Нужно: 3 лома, 2 проволоки, 1 мембрана.');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.crossQuests?.cross_autoclave?.status === 'active') {
      const hasAutoMats = getItemCount('scrap') >= 3 && getItemCount('wire') >= 2 && (getItemCount('filter_membrane') >= 1 || getItemCount('scrap') >= 5);
      body += `<p style="color:var(--accent-gold);"><b>[СОЮЗ: ПОЛЕВОЙ АВТОКЛАВ]:</b> <i>«Прохор согнёт корпус из труб, Анна продизенфицирует штуцера, а мы с тобой пустим чистый пар!»</i></p>`;
      if (hasAutoMats) {
        actions.push({
          text: '🔧 «Смонтировать автоклав-дистиллятор в лагере»',
          action: () => {
            removeItem('scrap', 3);
            removeItem('wire', 2);
            if (getItemCount('filter_membrane') >= 1) removeItem('filter_membrane', 1);
            else removeItem('scrap', 2);
            state.crossQuests.cross_autoclave.status = 'completed';
            addItem('autoclave_unit', 1);
            changeNpcRep('varya', 25);
            changeNpcRep('prokhor', 25);
            changeNpcRep('anna', 25);
            state.reputation += 50;
            toast('🏆 АВТОКЛАВ УСТАНОВЛЕН! Община получила постоянную стерилизацию и дистиллятор (+25 реп каждому соратнику, +50 лагерю)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    // 3. Таёжный бальзам долголетия (Варя + Спиридон, реп >= 50 оба)
    const spiridonRep = getNpcRep('spiridon');
    if (rep >= 50 && spiridonRep >= 50 && !state.crossQuests?.cross_balsam?.status) {
      actions.push({
        text: '🌿 «Варя, объединим твои сиропы с настойками деда Спиридона?»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_balsam = { status: 'active' };
          toast('⚔️ СОЮЗ ЗНАХАРЕЙ: Взят квест «Таёжный бальзам» (Варя + Спиридон)! Нужно: 1 спирт, 3 травы, 2 сфагнума, 2 брусники.');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.crossQuests?.cross_balsam?.status === 'active') {
      const hasBalsamMats = getItemCount('alcohol') >= 1 && getItemCount('herbs') >= 3 && getItemCount('swamp_moss') >= 2 && getItemCount('berries') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[СОЮЗ: ТАЁЖНЫЙ БАЛЬЗАМ]:</b> <i>«Дед Спиридон шептал над чашей с травами, теперь наш черёд варить взвар!»</i></p>`;
      if (hasBalsamMats) {
        actions.push({
          text: '🧪 «Приготовить легендарный Бальзам Вари и Спиридона»',
          action: () => {
            removeItem('alcohol', 1);
            removeItem('herbs', 3);
            removeItem('swamp_moss', 2);
            removeItem('berries', 2);
            state.crossQuests.cross_balsam.status = 'completed';
            addItem('taiga_balsam', 2);
            changeNpcRep('varya', 25);
            changeNpcRep('spiridon', 25);
            state.reputation += 40;
            toast('🏆 БАЛЬЗАМ ДОЛГОЛЕТИЯ СВАРЕН! Рецепт открыт для костра (+2 бальзама, +25 реп обоим, +40 лагерю)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkVarya();
          },
          primary: true
        });
      }
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }
