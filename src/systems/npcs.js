  // ==========================================================================
  // СИСТЕМА ЖИТЕЛЕЙ ЛАГЕРЯ «ВСЕМ ПОХ»: СОВЕТ ОСНОВАТЕЛЕЙ
  // Саныч, Атарон, Скай, Боб («Бобчонок»), Чагрон («Глыба»), Варя, Марго, Стронг
  // ==========================================================================

  // --- СИСТЕМА ИНДИВИДУАЛЬНОЙ РЕПУТАЦИИ У ЖИТЕЛЕЙ ЛАГЕРЯ ---
  function getNpcRep(npcId) {
    if (!state.npcRep) state.npcRep = {};
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    if (state.npcRep[id] === undefined) {
      const defs = { sanych: 15, ataron: 15, sky: 15, bob: 15, chagron: 15, varya: 15, margo: 5, strong: 0 };
      state.npcRep[id] = defs[id] !== undefined ? defs[id] : 10;
    }
    if (canonicalMap[npcId]) state.npcRep[npcId] = state.npcRep[id];
    return state.npcRep[id];
  }

  function getNpcRepTitle(rep) {
    if (rep < 25) return { title: 'Чужак', level: 1, color: '#9ca3af', icon: '⚪', attitude: '«Присматривается с настороженностью»' };
    if (rep < 50) return { title: 'Знакомый', level: 2, color: 'var(--accent-blue)', icon: '🔵', attitude: '«Считает надёжным и дельным человеком»' };
    if (rep < 80) return { title: 'Доверенный', level: 3, color: 'var(--accent-green)', icon: '🟢', attitude: '«Полное доверие и уважение»' };
    return { title: 'Побратим / Верный друг', level: 4, color: 'var(--accent-gold)', icon: '⭐', attitude: '«Готов стоять спиной к спине в любой беде»' };
  }

  function changeNpcRep(npcId, amount, notify = true) {
    if (!state.npcRep) state.npcRep = {};
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    const current = getNpcRep(id);
    const oldTier = getNpcRepTitle(current);
    const newRep = Math.max(0, current + amount);
    state.npcRep[id] = newRep;
    if (canonicalMap[npcId]) state.npcRep[npcId] = newRep;

    if (notify && amount !== 0) {
      const npcName = NPCS[id]?.name ? NPCS[id].name.split(' ')[0] : id;
      const sign = amount > 0 ? '+' : '';
      toast(`🤝 Репутация (${npcName}): ${sign}${amount} (${oldTier.title} ➔ ${getNpcRepTitle(newRep).title}, ${newRep})`);
    }
    const newTier = getNpcRepTitle(newRep);
    if (oldTier.level !== newTier.level && notify && amount > 0) {
      const npcName = NPCS[id]?.name || id;
      toast(`🎉 ${npcName} теперь считает вас: ${newTier.title}! Открыты новые возможности общины.`);
      sfx.playSuccess();
    }
    saveState();
    updateHUD();
  }

  function renderNpcRepHeader(npcId) {
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    const rep = getNpcRep(id);
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
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    const npc = NPCS[id] || NPCS[npcId];
    if (!npc) return;
    const rep = getNpcRep(id);
    const tier = getNpcRepTitle(rep);

    state.npcChatDay = state.npcChatDay || {};
    const chatKey = `${id}_${state.day}`;
    let bonusText = '';
    if (!state.npcChatDay[chatKey]) {
      state.npcChatDay[chatKey] = true;
      changeNpcRep(id, 2, false);
      bonusText = `<div style="color:var(--accent-green); font-size:11px; margin-top:8px;">🤝 ${npc.name.split(' ')[0]} оценил(а) душевную беседу (+2 к личной репутации)!</div>`;
    }

    let chatText = '';
    if (id === 'sanych') {
      if (tier.level >= 3) {
        chatText = `<i>«Вот смотрю я на тебя и душа радуется! "Видишь суслика? И я не вижу. А он есть!" Знаешь, когда мы тут на пустой продуваемой лесопилке начинали, вокруг не было ни души — только стужа, дырявый брезент и тоска. Паникерам и нытикам в тайге места нет! Каждая слеза — это минус сто миллилитров чистой воды из организма! И ведь выстояли! Я даже Короб №42 с семенами помидоров отстоял — весной взойдут красные, сахарные! Красный помидор посреди серой тайги — это ведь не просто еда, это доказательство, что жизнь продолжается, сечешь? Доказать этой проклятой мерзлоте, что мы люди, а не зверьё под корягой. Ты настоящий соратник, на таких наш «Всем ПОХ» и держится. Горжусь тобой!»</i>`;
      } else {
        chatText = `<i>«Здорово, боец! Присаживайся к печурке, хлебни смородинового взвара. Запомни главное: паника убивает быстрее радиации и волчьих клыков. Оптимизм у нас — это не пустые слова, это воинская дисциплина! Собрались, выдохнули и работаем. Если руки из плеч растут и совесть на месте — тайга нас не сломит. Работай на совесть, держись общины, а если тоска подступит — стисни зубы и делай своё дело. Прорвёмся, не впервой!»</i>`;
      }
    } else if (id === 'ataron') {
      if (tier.level >= 3) {
        chatText = `<i>«Вольно. Присядь... Да брось ты вытягиваться, свои люди. Знаешь... я ведь эти склады придумываю, сметы пишу и гвозди считаю не от хорошей жизни. Три тысячи двести семнадцать гвоздей пересчитано за зиму! Ночью в изоляторе сидишь, а внутри пустота воет... Мы души свои в железный лом превратили, чтобы не свихнуться. Но когда я вижу, как частокол стоит ровно под сорок пять градусов, как караулы сменяются по секундомеру и как ты с вылазок целый возвращаешься — я верю, что порядок победит энтропию. На, держи мою редкую пивную крышечку с якорем. Я её только тем отдаю, с кем готов стоять спиной к спине под пулемётом.»</i>`;
      } else {
        chatText = `<i>«Так, боец. Порядок должен быть наглядным! Шаг вправо, шаг влево — считаю попыткой уйти в нирвану! На частоколе угол наклона проверял? Ровно сорок пять градусов, ни минутой больше, иначе напор мутантов его опрокинет. Патроны держи в сухом подсумке, оружие чисти керосином каждый вечер. В тайге расхлябанность карается мгновенно. Будешь соблюдать устав — получишь патроны и уважение. Не будешь — отправлю строем лужи вокруг лагеря ровнять.»</i>`;
      }
    } else if (id === 'sky') {
      if (tier.level >= 3) {
        chatText = `<i>«Огласите весь список жалоб, пожалуйста! А, это ты... Заходи, закрывай гермодверь, не неси сюда сырость. Честно сказать? Я до смерти устал спасать этот чертов мир. То открытый перелом речной водой промывай, то легкие от радиоактивного пепла отскабливай... Я ведь полевой хирург, а не волшебник. Иногда хочется просто пару лет лечить банальный детский насморк в теплом кабинете с белыми занавесками... Но пока ты таскаешь с болот сфагнум, а Боб клепает автоклавы — мы еще потрепыхаемся. Я тут партию "Адского варева" забодяжил — сшибает радиацию на раз, правда, на вкус как жженая резина с полынью. Держись, друг. Ты единственный, чья рожа мне в этом лагере еще не осточертела.»</i>`;
      } else {
        chatText = `<i>«Чего встал в проходе? Если ничего не оторвало и из ушей зеленая слизь не капает — не занимай кушетку! Наука тут проиграла речной воде давным-давно. Будешь пить сырую жижу из Быстрянки — ампутировать желудок придется той же пилой, которой дрова на кухню пилим. Цистамин принимай вовремя, раны заливай спиртом и не строй из себя бессмертного сталкера. Кладбище у нас за сопкой, и расширять его мне лень.»</i>`;
      }
    } else if (id === 'bob') {
      if (tier.level >= 3) {
        chatText = `<i>«Здорово, братуха! Пункт первый: ты вовремя зашел! Пункт второй: я только что настроил охладитель на нашем пивоваренном реакторе из машинки "Малютка" и радиатора от "Жигулей"! Да тише ты, а то Атарон услышит — он же за Сухой закон готов на дыбу вздернуть! А Стронг посчитал, что кружка холодного эля повышает выживаемость личного состава на 89 процентов! Ты для лагеря столько железа перетаскал, что я тебе хоть миниган из водопроводной трубы соберу. Давай, за наше кустарное братство!»</i>`;
      } else {
        chatText = `<i>«Привет! Расклад такой: пункт первый — железа в тайге навалом, но всё ржавое. Пункт второй — верстак требует смазки и свёрл. Пункт третий — ты идёшь всё это искать, потому что тебя не жалко! Найдёшь обрезки труб, нихром или радиодетали — тащи ко мне, я даже из консервной банки обогреватель спаяю. А будешь клювом щёлкать — в тайге быстро на запчасти разберут. Шевели поршнями!»</i>`;
      }
    } else if (id === 'chagron') {
      if (tier.level >= 3) {
        chatText = `<i>«Садись... к огню. Хорошо, что пришел. Я... не люблю темноту. Лес вокруг лагеря молчит, а пустота давит сильнее бетона. Тяжело — это не когда полутонную плиту моста двигаешь. Бетон просто лежит, ему всё равно. Тяжело — это когда на прицеле знакомое лицо, а приказ уже отдан... А здесь люди. Варя на кухне гремит, Боб ругается... тепло. Слышал, девчонка всё про гильзу семь шестьдесят два на пятьдесят четыре выспрашивает? (Чагрон скупо усмехается в густую бороду и отводит взгляд к реке). Хороший калибр. Надежный. Главное — на мосту вовремя палец на спуске держать... Пусть варит суп. Человеку нужно горячее, иначе он звереет. Ты с ней помягче. И сам себя береги.»</i>`;
      } else {
        chatText = `<i>«Здорово. Быстрянка сегодня шумит глухо — к перемене погоды. На воде не зевай: следы на иле видел? Крупная выдра ходит, зубы острые. Нож держи под рукой, патроны береги от сырости. Удочку я тебе помогу наладить, рыба сытость дает долгую. Будет трудно — зови. Я рядом.»</i>`;
      }
    } else if (id === 'margo') {
      if (tier.level >= 3) {
        chatText = `<i>«О, явился, свет очей моих! Смотри, какую я настойку на чабреце и березовом дегте состряпала! Ты знаешь, почему я волосы в фиолетовый крашу? Чтобы этот серый мертвый лес сквозь душу не пророс! А вообще, послушай мою теорию: Добро и Зло. Зло — оно ведь как сорняк, растет само там, где пусто, холодно и темно. Зло думает, что оно хитрее всех, а на деле оно просто одиноко и трусливо! А Добро требует труда! Добро всегда в мозолях и пахнет навозом и хвоей! И Добро должно быть с кулаками! Трави бобров по всей земле! Трави бобров, спасай деревья! Пей взвар, чисти карму и не давай тоске себя сожрать!»</i>`;
      } else {
        chatText = `<i>«Привет, путник с большой земли! В кедах "Два мяча" по болоту ходить — особое искусство, учись, пока я жива! Гнилая гать суеты не терпит: ступишь мимо кочки — болотный газ легкие обожжет. Травы рви с уважением, мухоморы суши на березовой коре. Помни: земля живая, она всё залечит и нас переживёт. Ты главное лишнего у неё не хватай, зла в душе не копи и под ноги гляди.»</i>`;
      }
    } else if (id === 'strong') {
      if (tier.level >= 3) {
        chatText = `<i>«Фиксирую объект. Объект: Человек. Статус: Выживание 99.4%. Знаешь... раньше я вел "Реестр Угасания". Записывал: Объект №08 — Скай, угасание печени; Объект №614 — Забор, гниение досок; Объект №1047 — Сердце Атарона, погребено под слоем бюрократии. А теперь я переименовал его в "Реестр Всходов". Лагерь "Всем ПОХ", существующий в условиях радиоактивной антисанитарии с коэффициентом выживаемости девяносто восемь процентов — это чертовски красивая аномалия! Твой вклад в снижение лагерной энтропии максимален. Радиоприемник настроен. Лови координаты тайников.»</i>`;
      } else {
        chatText = `<i>«Внимание. Радиочастота 3650 кГц нестабильна. Вероятность радиоактивного выброса в течение сорока восьми часов — сорок два процента. Пока вещи учтены и записаны в блокнот — мир удерживается от окончательного распада. Принеси радиодетали, если хочешь, чтобы энтропия не поглотила наш сектор.»</i>`;
      }
    } else if (id === 'varya') {
      if (state.weather === 'freeze') {
        chatText = `<i>«Бр-р-р! Ну и мороз тут у вас в Сибири! В моём родном Брянске тоже зимы бывали лютые, но там хоть вековые дубравы от ветра закрывали, а здесь сквозь сосны стужа до костей продирает. Ты к жаровне ближе садись, погрей пальцы. Я в похлёбку чабреца да брусники бросила — мигом кровь разгонит! Слушай... а у тебя в подсумке патроны не звенят случайно? Какой у тебя калибр? Не семь шестьдесят два?..»</i>`;
      } else if (state.weather === 'rain') {
        chatText = `<i>«Опять ливень хлещет, вода с навеса водопадом льётся! В брянских лесах под таким дождём мы с дедом подосиновики вёдрами таскали, а тут из-за едких туманов лишний раз нос из палатки страшно высунуть. Хорошо хоть в котле ушица закипает. Слушай, пока дождь шумит... ты стреляные гильзы на вылазках не подбирал? Специфические такие, с закраиной у донца? Очень калибр один ищу!»</i>`;
      } else if (tier.level >= 3) {
        chatText = `<i>«Садись, я тебе с самого донышка навар зачерпну, с густым мясом! Знаешь... я ведь до сих пор вздрагиваю по ночам. Когда из Брянска бежала на восток, на старом мосту через Десну нас окружили бандиты. Загнали в тупик, шансов не было совсем... И тут из лесной чащи — хлёсткие, глухие выстрелы! Один, второй, третий... Нападавшие падали как подкошенные, точно в лоб! Я зажмурилась, а когда стрельба стихла — бандиты мертвы, а стрелок растворился в тумане, даже лица не показал. Только стреляные гильзы на мокром асфальте дымились... Он спас мне жизнь. Я ту гильзу на груди ношу как оберег и у каждого бойца калибр выспрашиваю — вдруг это был ты или его сослуживец? Ты для меня уже самым близким человеком во «Всем ПОХ» стал...»</i>`;
      } else {
        chatText = `<i>«Привет! Садись к огоньку, сейчас миску налью. Я Варя, сама из Брянска. Поварскому ремеслу ещё дома училась, так что даже из топора и смолы наваристый суп сбацаю! Главное правило кухни: кто за дровами не ходит — тот за добавкой не тянется. Слушай, а ты с чем в рейды ходишь? Какой калибр у ствола? 5.45? 7.62? А может, тяжёлый винтовочный или гладкоствол?.. Скажи, это ужасно важно!»</i>`;
      }
    }

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const weatherRemark = getNpcWeatherQuote(id, state.weather);
    const weatherHtml = `
      <div style="margin-top:10px; padding:8px 10px; background:rgba(0,0,0,0.25); border-left:3px solid ${wInfo.color || 'var(--accent-gold)'}; border-radius:4px; font-size:12px; color:var(--text-main);">
        <div style="font-size:11px; color:${wInfo.color || 'var(--accent-gold)'}; font-weight:700; margin-bottom:3px;">
          ${wInfo.icon} Мысли о погоде (${wInfo.name}):
        </div>
        <i>${weatherRemark}</i>
      </div>
    `;

    const body = `
      ${renderNpcRepHeader(id)}
      <div style="font-size:12.5px; line-height:1.6; color:var(--text-main); margin-bottom:12px;">
        ${chatText}
      </div>
      ${weatherHtml}
      ${bonusText}
    `;

    openModal(npc.name, `Беседа • ${npc.role}`, npc.avatar, body, [
      { text: '↩️ Вернуться к делам', action: () => talkToNPC(id), primary: true }
    ]);
  }

  // --- ЛАГЕРЬ И НПС ---
  function renderNPCs() {
    const list = document.getElementById('npcList');
    if (!list) return;
    list.innerHTML = '';

    const founderOrder = ['sanych', 'ataron', 'sky', 'bob', 'chagron', 'varya', 'margo', 'strong'];
    founderOrder.forEach(id => {
      const npc = NPCS[id];
      if (!npc) return;

      // Марго видна после обнаружения заимки на болоте
      if (id === 'margo' && !state.questFlags?.met_margo && !state.questFlags?.met_spiridon) return;
      // Стронг виден после спасения на Радиовышке
      if (id === 'strong' && !state.questFlags?.met_strong && !state.questFlags?.met_sasha) return;

      const repVal = getNpcRep(id);
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
      card.onclick = () => talkToNPC(id);
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

  // --- РОУТЕР ДИАЛОГОВ НПС ---
  function talkToNPC(npcId) {
    sfx.init();
    sfx.playClick();
    const canonicalMap = {
      batya: 'sanych',
      anna: 'sky',
      prokhor: 'bob',
      egor: 'chagron',
      spiridon: 'margo',
      sasha: 'strong'
    };
    const id = canonicalMap[npcId] || npcId;
    const npc = NPCS[id] || NPCS[npcId];
    if (!npc) return;

    // Switch view to Camp tab in case player clicked from Quest tab
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    const campTab = document.getElementById('tabCamp');
    if (campTab) campTab.classList.add('active');
    const navButtons = document.querySelectorAll('.nav-btn');
    if (navButtons[0]) navButtons[0].classList.add('active');

    if (!state.questFlags) state.questFlags = {};
    state.questFlags['met_' + id] = true;
    if (canonicalMap[npcId]) state.questFlags['met_' + npcId] = true;

    if (id === 'sanych') {
      talkSanych();
    } else if (id === 'ataron') {
      talkAtaron();
    } else if (id === 'sky') {
      talkSky();
    } else if (id === 'bob') {
      talkBob();
    } else if (id === 'chagron') {
      talkChagron();
    } else if (id === 'margo') {
      talkMargo();
    } else if (id === 'strong') {
      talkStrong();
    } else if (id === 'varya') {
      talkVarya();
    }
  }

  function checkStarterQuestProgress() {
    const skyDone = state.questFlags.met_sky || state.questFlags.met_anna;
    const chagronDone = state.questFlags.met_chagron || state.questFlags.met_egor;
    if (state.mainQuestStep === 1 && skyDone && chagronDone) {
      toast('⭐ Вы познакомились с жителями лагеря! Вернитесь к Санычу для доклада.');
      sfx.playSuccess();
      renderQuests();
    }
  }

  // ==========================================================================
  // 1. АЛЕКСАНДР АЛЕКСАНДРОВИЧ «САНЫЧ» (ПОЗЫВНОЙ «БЕЛКА»)
  // Глава поселения, верховный дипломат, хранитель семян Короба №42
  // ==========================================================================
  function talkSanych() {
    const npc = NPCS.sanych;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_sanych = true;
    state.questFlags.met_batya = true;

    let body = renderNpcRepHeader('sanych');
    body += `<p>Александр Александрович (Саныч) стоит у деревянного штабного стола. В кружке дымится травяной чай, рядом лежит потёртая карта района и старый кассетник «Весна». В глазах блестит лукавый, неугасимый огонёк.</p>`;
    body += `<p><i>«Ну что, боец! Лагерь "Всем ПОХ" — это не просто привал, это крепость духа. Уныние и сопли здесь вне закона. Кто руки опускает — тот тайге добыча. А кто с улыбкой да с честью пашет — тот хозяин жизни!»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('sanych', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Санычем о делах в лагере и жизни»',
      action: () => openNpcChat('sanych')
    });

    // Квест 1: Стартовый инструктаж (step 0)
    if (state.mainQuestStep === 0) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 1: ПРИБЫТИЕ В «ВСЕМ ПОХ»]:</b></p>`;
      body += `<p><i>«Ты еле живой до нас добрёл. "Видишь суслика? И я не вижу. А он есть!" Вот так и с надеждой: пока живы — победим. Прими закон общины: тунеядцев не держим, работаем все. Держи стартовый сухпай, флягу чистой воды и покажи, на что способен.»</i></p>`;
      actions.push({
        text: '«Я готов служить лагерю. С чего начать, Саныч?»',
        action: () => {
          state.mainQuestStep = 1;
          state.reputation += 6;
          addItem('clean_water', 1);
          addItem('ammo', 3);
          toast('⭐ Задание 1 выполнено: «Прибытие в «Всем ПОХ»» (+6 репутации, фляга воды, 3 патрона)!');
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
      const skyDone = !!(state.questFlags.met_sky || state.questFlags.met_anna);
      const chagronDone = !!(state.questFlags.met_chagron || state.questFlags.met_egor);
      const allDone = skyDone && chagronDone;

      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: ПЕРВЫЕ ШАГИ]:</b></p>`;
      body += `<div style="background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px; margin:8px 0; border:1px solid rgba(255,255,255,0.12);">`;
      body += `<b style="color:var(--accent-gold); font-size:12px;">📋 Задачи осмотра лагеря:</b><br>`;
      body += `• Главврач Николай Скай (лазарет): ${skyDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}<br>`;
      body += `• Следопыт Чагрон (река Быстрянка): ${chagronDone ? '<span style="color:var(--accent-green);">✓ Знакомство состоялось</span>' : '<span style="color:var(--accent-gold);">⏳ Нужно поговорить</span>'}`;
      body += `</div>`;

      if (allDone) {
        body += `<p style="color:var(--accent-green);"><i>«Скай и Чагрон уже передали, что ты парень хваткий. "Кузьмич, ты что, обиделся? — Нет, я за понимание!" Инструктаж окончен! Теперь иди к коменданту Атарону на периметр — он за безопасность отвечает, у него там всё строго по уставу.»</i></p>`;
        actions.push({
          text: '⭐ «Доложить Санычу об осмотре лагеря (Завершить квест 2)»',
          action: () => {
            state.mainQuestStep = 2;
            state.reputation += 10;
            addItem('ammo', 3);
            toast('⭐ Квест 2 завершён: «Первые шаги» (+10 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            closeModal();
          },
          primary: true
        });
      } else {
        body += `<p><i>«Загляни к Скаю в лазарет — узнай про радиацию и цистамин, и к Чагрону на берег Быстрянки — он покажет, как рыбу ловить и зверя выслеживать.»</i></p>`;
        actions.push({
          text: '«Саныч, я уже осмотрел лагерь и готов к делу!»',
          action: () => {
            state.questFlags.met_sky = true;
            state.questFlags.met_anna = true;
            state.questFlags.met_chagron = true;
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
    // Военные шаги 3-5 курирует Атарон, напоминание от Саныча:
    else if (state.mainQuestStep >= 2 && state.mainQuestStep <= 4) {
      body += `<p style="color:var(--accent-blue);"><i>«Сейчас главная задача — рубежи обороны. Комендант Атарон на посту периметра ждет тебя. Держи частокол строго под 45 градусов, как он требует!»</i></p>`;
      actions.push({
        text: '🛡️ «Иду к Атарону на пост периметра»',
        action: () => {
          closeModal();
          talkAtaron();
        },
        primary: true
      });
    }
    // Квест 13: Шифр Воронова (step 12)
    else if (state.mainQuestStep === 12) {
      const decoded = !!state.questFlags.tape_decoded;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 13: ШИФР ВОРОНОВА]:</b></p>`;
      body += `<p><i>«Ты принёс аудиокассету Воронова с Радиовышки? Давай её сюда, вставляем в наш магнитофон "Весна"! "Ну, за понимание!" Сейчас послушаем, что зашифровал профессор.»</i></p>`;

      if (decoded) {
        body += `<p style="color:var(--accent-green);">✓ Запись Воронова расшифрована! Координаты Заброшенного кордона нанесены на карту!</p>`;
        actions.push({
          text: '⭐ «Обсудить координаты кордона с Санычем (Завершить квест 13)»',
          action: () => {
            state.mainQuestStep = 13;
            state.reputation += 18;
            addItem('ammo', 5);
            if (!state.unlockedLocations.includes('old_cordon')) {
              state.unlockedLocations.push('old_cordon');
            }
            toast('⭐ Квест 13 выполнен: «Шифр Воронова» (+18 репутации, открыт Заброшенный кордон)!');
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
          text: '📻 «Включить магнитофон "Весна" и прослушать кассету»',
          action: () => {
            state.questFlags.tape_decoded = true;
            toast('📻 «...Говорит профессор Воронов. Бункер запечатан. Ключ-карта «Сфера» спрятана на Заброшенном кордоне...»');
            sfx.playSuccess();
            talkSanych();
          },
          primary: true
        });
      }
    }
    // Квест 14: Тайна Заброшенного кордона (step 13)
    else if (state.mainQuestStep === 13) {
      const hasKeycard = getItemCount('keycard_sfera') > 0 || state.questFlags.cordon_searched;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 14: ТАЙНА ЗАБРОШЕННОГО КОРДОНА]:</b></p>`;
      body += `<p><i>«Выдвигайся на Заброшенный кордон лесничества в предгорьях. Воронов оставил там ключ-карту допуска к Бункеру и полевой дневник. Найди их!»</i></p>`;

      if (hasKeycard) {
        body += `<p style="color:var(--accent-green);">✓ Дневник Воронова и ключ-карта «Сфера-Допуск» найдены!</p>`;
        actions.push({
          text: '⭐ «Сдать материалы кордона Санычу (Завершить квест 14)»',
          action: () => {
            state.mainQuestStep = 14;
            state.reputation += 22;
            addItem('ammo', 8);
            if (!state.unlockedLocations.includes('hunting_grounds')) {
              state.unlockedLocations.push('hunting_grounds');
            }
            toast('⭐ Квест 14 выполнен: «Тайна кордона» (+22 репутации, +8 патронов)!');
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
    // Квест 19: Предотвращение Каскада-2 (step 18)
    else if (state.mainQuestStep === 18) {
      const shutdown = !!state.questFlags.reactor_shutdown;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 19: ПРЕДОТВРАЩЕНИЕ «КАСКАДА-2»]:</b></p>`;
      body += `<p><i>«Датчики бункера воют сиреной: реактор перегрет, грядет второй выброс на всю Сибирь! Пробейся в реакторный зал, заглуши стержни и забери научный архив и отвар «Оптимист-7»!»</i></p>`;

      if (shutdown) {
        body += `<p style="color:var(--accent-green);">✓ Реактор заглушен! Архив «Каскад» и капсула «Оптимист-7» спасены!</p>`;
        actions.push({
          text: '⭐ «Доложить Санычу о спасении всей тайги (Завершить квест 19)»',
          action: () => {
            state.mainQuestStep = 19;
            state.reputation += 40;
            toast('⭐ КВЕСТ 19 ВЫПОЛНЕН: «Каскад-2» предотвращён (+40 репутации)!');
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
    // Квест 20: Новый рассвет «Всем ПОХ» (step 19 - Триумф Совета)
    else if (state.mainQuestStep === 19) {
      body += `<p style="color:var(--accent-gold); font-size:14px; font-weight:bold;">🏆 [ФИНАЛ: НОВЫЙ РАССВЕТ «ВСЕМ ПОХ»]:</p>`;
      body += `<p><i>«ДРУЖИЩЕ! ТЫ СДЕЛАЛ ЭТО! "И вновь продолжается бой, и сердцу тревожно в груди!" Ты предотвратил второй взрыв, добыл стабилизатор «Оптимист-7» и сохранил жизнь нашей общины. Совет Основателей в полном сборе салютует тебе!»</i></p>`;
      actions.push({
        text: '🏆 «Принять высшую награду Совета Основателей (Торжественный Финал)»',
        action: () => {
          state.mainQuestStep = 20;
          state.questFlags.bunker_completed = true;
          state.reputation += 50;
          toast('🏆 СЮЖЕТНАЯ САГА «ВСЕМ ПОХ» ЗАВЕРШЕНА! ВЫ — ЛЕГЕНДА ТАЙГИ!');
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
      body += `<p style="color:var(--accent-gold);"><b>[ЛЕГЕНДА ЛАГЕРЯ «ВСЕМ ПОХ»]:</b></p>`;
      body += `<p><i>«Здравствуй, легенда! О твоих рейдах у костра слагают былины. Лагерь процветает, семена всходят. Всем ПОХ на апокалипсис — мы победили!»</i></p>`;
    }

    // --- ДОПОЛНИТЕЛЬНЫЕ ЗАДАНИЯ САНЫЧА ---
    // «Чистый глоток» (вода в резерв штаба)
    if (!state.sideQuests?.sq_water_batya?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '💧 «Саныч, нужно пополнить штабной резерв воды? Я помогу»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_water_batya = { status: 'active' };
          toast('📜 Взято поручение: «Чистый глоток» (Вскипятить и сдать 3 фляги воды Санычу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkSanych();
        }
      });
    } else if (state.sideQuests?.sq_water_batya?.status === 'active') {
      const hasWater = getItemCount('clean_water') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ШТАБНОЙ РЕЗЕРВ]:</b> <i>«Ты вскипятил три фляги чистой воды? Если мутанты перережут тропу к реке, лагерь без воды не протянет.»</i></p>`;
      if (hasWater) {
        actions.push({
          text: '💧 «Вот 3 фляги чистой кипячёной воды для штаба, Саныч!»',
          action: () => {
            removeItem('clean_water', 3);
            state.sideQuests.sq_water_batya.status = 'completed';
            addItem('ammo', 3);
            state.reputation += 10;
            changeNpcRep('sanych', 8);
            toast('⭐ Поручение выполнено: «Чистый глоток» (+10 репутации, +3 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkSanych();
          },
          primary: true
        });
      }
    }

    // Уникальный квест высокой репутации (80+): Короб №42: Семена надежды
    const sanychRep = getNpcRep('sanych');
    if (sanychRep >= 80 && !state.highRepQuests?.sanych?.status && !state.questFlags?.sanych_seeds_given) {
      actions.push({
        text: '🌱 «Саныч, расскажи про легендарный Короб №42 с семенами!» (Репутация 80+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.sanych = { status: 'completed' };
          state.questFlags.sanych_seeds_given = true;
          addItem('ammo', 20);
          addItem('canned_food', 3);
          addItem('antirad', 2);
          addItem('army_ration_box', 1);
          changeNpcRep('sanych', 15);
          state.reputation += 25;
          toast('🌱 КОРОБ №42 ОТКРЫТ! Саныч заложил парники лагеря «Всем ПОХ» (+20 патронов, 3 тушёнки, 2 цистамина, спецпаёк, +25 репутации)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkSanych();
        }
      });
    }

    body += `<p style="font-size:11px; color:var(--text-dim); margin-top:10px;">Репутация в лагере: ${getReputationTitle(state.reputation)} (${state.reputation} очков)</p>`;
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 2. АНДРЕЙ «АТАРОН»
  // Комендант периметра и безопасности, фанатик устава и коллекционер пивных крышечек
  // ==========================================================================
  function talkAtaron() {
    const npc = NPCS.ataron;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_ataron = true;
    state.questFlags.met_batya = true;

    let body = renderNpcRepHeader('ataron');
    body += `<p>Андрей Атарон стоит на караульной вышке у главных ворот лагеря. За плечом висит верный АК-74, на поясе — связка коллекционных пивных крышечек и секундомер. Взгляд цепкий, сканирующий сектор до последнего куста.</p>`;
    body += `<p><i>«Так, боец. Порядок должен быть наглядным! Угол наклона частокола у меня выверен строго под сорок пять градусов — ни градусом больше. Оружие чистить каждый вечер, патроны беречь. В тайге только дисциплина отделяет нас от превращения в корм.»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('ataron', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Атароном об обороне и порядке»',
      action: () => openNpcChat('ataron')
    });

    // Квест 3: Огонь во тьме (step 2)
    if (state.mainQuestStep === 2) {
      const hasTorch = getItemCount('torch') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 3: ОГОНЬ ВО ТЬМЕ]:</b></p>`;
      body += `<p><i>«Ночами к частоколу лезет всякая мерзость. Нам нужны факелы для ночных дозоров. Собери в лесу 3 охапки сушняка, свяжи смоляной факел на верстаке у Боба и покажи мне. За отличную службу выдам особую крышечку строгой отчетности!»</i></p>`;

      if (hasTorch) {
        body += `<p style="color:var(--accent-green);">✓ У вас есть смоляной факел!</p>`;
        actions.push({
          text: '⭐ «Сдать смоляной факел Атарону (Завершить квест 3)»',
          action: () => {
            removeItem('torch', 1);
            state.mainQuestStep = 3;
            state.reputation += 10;
            changeNpcRep('ataron', 8);
            addItem('ammo', 3);
            toast('⭐ Квест 3 выполнен: «Огонь во тьме» (+10 репутации, +3 патрона, жетон-крышечка Атарона)!');
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
    // Квест 5: Крещение тайгой (step 4)
    else if (state.mainQuestStep === 4) {
      const dogsDead = !!state.questFlags.dogs_defeated;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 5: КРЕЩЕНИЕ ТАЙГОЙ]:</b></p>`;
      body += `<p><i>«Боевая тревога! Стая мутировавших псов окружила сектор учета №3 на опушке леса. Смастери охотничье копьё на верстаке у Боба, зачисти сектор и доложи о расходе боеприпасов!»</i></p>`;

      if (dogsDead) {
        body += `<p style="color:var(--accent-green);">✓ Стая диких псов разбита! Сектор чист!</p>`;
        actions.push({
          text: '⭐ «Доложить Атарону о зачистке сектора (Завершить квест 5)»',
          action: () => {
            state.mainQuestStep = 5;
            state.reputation += 15;
            changeNpcRep('ataron', 12);
            addItem('ammo', 4);
            if (!state.unlockedLocations.includes('swamp')) {
              state.unlockedLocations.push('swamp');
            }
            toast('⭐ Квест 5 выполнен: «Крещение тайгой» (+15 репутации, ранг «Свой», открыты Болота)!');
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
    // Квест 9: Прорыв к Насосной станции (step 8)
    else if (state.mainQuestStep === 8) {
      const cleared = !!state.questFlags.pump_cleared;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 9: ПРОРЫВ К НАСОСНОЙ СТАНЦИИ]:</b></p>`;
      body += `<p><i>«Разведка доносит: на Насосной станции №4 завал из арматуры перекрыл проход к машинному залу. Выдвигайся на станцию, расчисти завал и обеспечь коридор для инженеров!»</i></p>`;

      if (cleared) {
        body += `<p style="color:var(--accent-green);">✓ Завал у цеха Насосной станции №4 расчищен!</p>`;
        actions.push({
          text: '⭐ «Доложить Атарону о расчищенном коридоре (Завершить квест 9)»',
          action: () => {
            state.mainQuestStep = 9;
            state.reputation += 20;
            changeNpcRep('ataron', 14);
            addItem('ammo', 5);
            toast('⭐ Квест 9 выполнен: «Прорыв к Насосной» (+20 репутации, +5 патронов)!');
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
    // Квест 12: Эхо на Скалистом утёсе (step 11)
    else if (state.mainQuestStep === 11) {
      const radioOk = !!state.questFlags.radio_repaired;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 12: ЭХО НА СКАЛИСТОМ УТЁСЕ]:</b></p>`;
      body += `<p><i>«Возьми 3 металлолома и 2 проволоки. Поднимись на Скалистый утёс, восстанови радиомачту и прикрой радиста Стронга. Мы должны установить радиоконтроль над сектором!»</i></p>`;

      if (radioOk) {
        body += `<p style="color:var(--accent-green);">✓ Антенна на Радиовышке восстановлена! Сигнал взят под контроль!</p>`;
        actions.push({
          text: '⭐ «Доложить Атарону о восстановлении связи (Завершить квест 12)»',
          action: () => {
            state.mainQuestStep = 12;
            state.reputation += 20;
            changeNpcRep('ataron', 12);
            addItem('ammo', 5);
            if (getItemCount('audio_tape') === 0) addItem('audio_tape', 1);
            toast('⭐ Квест 12 выполнен: «Эхо на Скалистом утёсе» (+20 репутации, кассета Воронова)!');
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
          text: '📡 «Выдвигаюсь к Радиовышке на Скалистый утёс»',
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
    // Квест 15: Хозяин тайги (step 14)
    else if (state.mainQuestStep === 14) {
      const bearDead = !!state.questFlags.bear_defeated || getItemCount('bear_pelt') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 15: ХОЗЯИН ТАЙГИ]:</b></p>`;
      body += `<p><i>«Медведь-шатун с железными когтями заблокировал ущелье. Чагрон подскажет его уязвимые места. Ликвидируй угрозу — и получишь штатное боевое ружьё ТОЗ-34!»</i></p>`;

      if (bearDead) {
        body += `<p style="color:var(--accent-green);">✓ Хозяин тайги повержен! Трофейная шкура у вас!</p>`;
        actions.push({
          text: '⭐ «Сдать шкуру медведя Атарону и получить ружьё ТОЗ-34 (Завершить квест 15)»',
          action: () => {
            state.mainQuestStep = 15;
            state.reputation += 30;
            changeNpcRep('ataron', 18);
            if (getItemCount('toz') === 0) addItem('toz', 1);
            addItem('ammo', 10);
            toast('⭐ КВЕСТ 15 ВЫПОЛНЕН: «Хозяин тайги» (+30 репутации, ружьё ТОЗ-34, 10 патронов)!');
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
          text: '🏹 «Иду к Чагрону за охотничьим планом»',
          action: () => {
            closeModal();
            talkChagron();
          },
          primary: true
        });
      }
    }
    // Квест 18: Штурм Бункера (step 17)
    else if (state.mainQuestStep === 17) {
      const turretsDead = !!state.questFlags.turrets_neutralized;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 18: ШТУРМ БУНКЕРА «СФЕРА»]:</b></p>`;
      body += `<p><i>«Боевой приказ: снаряди ТОЗ-34, надень респиратор Р-2, примени ключ-карту «Сфера» и подави автоматические турели охраны в гермоблоке Бункера!»</i></p>`;

      if (turretsDead) {
        body += `<p style="color:var(--accent-green);">✓ Гермоблок вскрыт, охранный периметр турелей смят!</p>`;
        actions.push({
          text: '⭐ «Доложить Атарону о прорыве обороны Бункера (Завершить квест 18)»',
          action: () => {
            state.mainQuestStep = 18;
            state.reputation += 25;
            changeNpcRep('ataron', 16);
            addItem('ammo', 10);
            toast('⭐ Квест 18 выполнен: «Штурм Бункера» (+25 репутации, +10 патронов)!');
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

    // «Ночной дозор»
    if (!state.sideQuests?.sq_watch_batya?.status && state.mainQuestStep >= 2) {
      actions.push({
        text: '🏮 «Атарон, готов заступить в ночной караул на вышке»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_watch_batya = { status: 'active' };
          toast('📜 Взято поручение: «Ночной дозор» (Заступить на вышку в фазу Ночи с факелом)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkAtaron();
        }
      });
    } else if (state.sideQuests?.sq_watch_batya?.status === 'active') {
      const isNight = isNightTime(state.timeOfDay);
      const hasTorch = getItemCount('torch') > 0 || getItemCount('electric_torch') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[НОЧНОЙ ДОЗОР]:</b> <i>«В темноте твари жмутся к частоколу. Бери факел и заступай на вышку у ворот, проверяй углы наклона забора.»</i></p>`;
      if (isNight && hasTorch) {
        actions.push({
          text: '🏮 «Отстоять ночную смену на смотровой вышке до рассвета»',
          action: () => {
            state.sideQuests.sq_watch_batya.status = 'completed';
            passTime(1);
            addItem('ammo', 4);
            addItem('canned_food', 1);
            state.reputation += 12;
            changeNpcRep('ataron', 8);
            toast('⭐ Ночной караул сдан! Атарон одобрительно кивнул (+12 репутации, 4 патрона, тушенка)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkAtaron();
          },
          primary: true
        });
      }
    }

    // Жетоны разведгруппы «Север» (сержанта Гурова)
    if (state.questFlags.brdm_searched && !state.questFlags.brdm_reported) {
      actions.push({
        text: '🎖️ «Атарон... я нашёл в трясине БРДМ-2. Вот жетоны сержанта Гурова...»',
        action: () => {
          state.questFlags.brdm_reported = true;
          addItem('ammo', 6);
          state.reputation += 20;
          changeNpcRep('ataron', 15);
          toast('⭐ Жетоны группы «Север» переданы Атарону (+20 репутации, командирский бинокль, 6 патронов)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAtaron();
        },
        primary: true
      });
    }

    // Финал «Эхо чёрного каравана»
    if (state.questFlags.caravan_cache_found && !state.questFlags.caravan_completed) {
      actions.push({
        text: '🏴‍☠️ «Атарон, схрон банды «Хлыща» уничтожен! Вот оружие мародёров»',
        action: () => {
          state.questFlags.caravan_completed = true;
          addItem('ammo', 12);
          state.reputation += 25;
          changeNpcRep('ataron', 16);
          toast('🏆 Схрон каравана ликвидирован! Порядок восстановлен (+25 репутации, 12 патронов)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAtaron();
        },
        primary: true
      });
    }

    // Квест высокой репутации (80+): Спецрезерв коменданта: Крышечка с якорем
    const ataronRep = getNpcRep('ataron');
    if (ataronRep >= 80 && !state.highRepQuests?.ataron?.status && !state.highRepQuests?.batya?.status) {
      actions.push({
        text: '🎖️ «Атарон, на какую поддержку арсенала я могу рассчитывать?» (Репутация 80+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.ataron = { status: 'completed' };
          state.highRepQuests.batya = { status: 'completed' };
          addItem('ammo', 15);
          addItem('canned_food', 2);
          addItem('antirad', 1);
          addItem('army_ration_box', 1);
          changeNpcRep('ataron', 12);
          toast('⭐ Атарон открыл армейский спецрезерв коменданта (+15 патронов, 2 тушёнки, цистамин, жетон с якорем)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAtaron();
        }
      });
    }

    // Союзный квест: Штабной перехват: Секретный арсенал (Саныч, Атарон, Стронг, Боб - реп 60+)
    const strongRep = getNpcRep('strong');
    const bobRep = getNpcRep('bob');
    if (ataronRep >= 60 && strongRep >= 60 && bobRep >= 60 && !state.crossQuests?.cross_arsenal?.status) {
      actions.push({
        text: '📻 «Атарон, Стронг перехватил военный шифр, а Боб готов вскрыть спецхран!»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_arsenal = { status: 'completed' };
          addItem('ammo', 20);
          addItem('army_ration_box', 1);
          changeNpcRep('ataron', 16);
          changeNpcRep('strong', 16);
          changeNpcRep('bob', 16);
          changeNpcRep('sanych', 16);
          state.reputation += 25;
          toast('🏆 СЕКРЕТНЫЙ АРСЕНАЛ ВСКРЫТ! Офицерский спецхран передан общине (+20 патронов, спецпаёк, +16 репутации соратникам)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkAtaron();
        }
      });
    }

    body += `<p style="font-size:11px; color:var(--text-dim); margin-top:10px;">Дисциплина периметра: ${ataronRep >= 80 ? '⭐ Безупречная' : ataronRep >= 50 ? '🟢 Образцовая' : '⚪ Требует проверки'}</p>`;
    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 3. НИКОЛАЙ «СКАЙ»
  // Главный врач, токсиколог, полевой хирург с черным юмором
  // ==========================================================================
  function talkSky() {
    const npc = NPCS.sky;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_sky = true;
    state.questFlags.met_anna = true;

    let body = renderNpcRepHeader('sky');
    body += `<p>В лазарете пахнет медицинским спиртом, йодом и сушеной полынью. Николай Скай хмуро протирает хирургический зажим марлей, потягивая остывший чай.</p>`;
    body += `<p><i>«Огласите весь список жалоб, пожалуйста! Если ничего не оторвало — дышите глубже. Главное в этой тайге — не пить сырую речную воду и не ловить галлюцинации от светящихся поганок. Наука проиграла реке, но пока я жив — от радиации я вас отскребу.»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('sky', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать со Скаем о лазарете и медицине»',
      action: () => openNpcChat('sky')
    });

    // Квест 2
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: УРОКИ ВЫЖИВАНИЯ]:</b> Скай скептически осматривает вас: <i>«Саныч предупредил, что ты новенький. Живой пока? Это временно, если голову в радиоактивные ямы совать будешь. Но раз дошел — будем знакомы.»</i></p>`;
      actions.push({
        text: '«Саныч велел познакомиться с лазаретом. Рад встрече, доктор Скай!»',
        action: () => {
          state.questFlags.met_sky = true;
          state.questFlags.met_anna = true;
          toast('⭐ Знакомство с главврачом Скаем зачтено!');
          sfx.playSuccess();
          checkStarterQuestProgress();
          talkSky();
        },
        primary: true
      });
    }

    // Квест 6: Мёртвые заводи (step 5)
    if (state.mainQuestStep === 5) {
      const hasSample = getItemCount('water_sample') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 6: МЁРТВЫЕ ЗАВОДИ]:</b></p>`;
      body += `<p><i>«Вода в Быстрянке пошла с желто-зеленой пеной и вонью кислотного электролита. Если люди этой жижи хлебнут — мне придется им кишки той же пилой пилить, которой дрова заготавливаем. Набери пробу в колбу у реки и тащи сюда!»</i></p>`;
      if (hasSample) {
        actions.push({
          text: '🧪 «Передать пробу токсичной воды Скаю (Завершить квест 6)»',
          action: () => {
            removeItem('water_sample', 1);
            state.questFlags.water_sample_given = true;
            state.mainQuestStep = 6;
            state.reputation += 12;
            changeNpcRep('sky', 10);
            addItem('antirad', 1);
            toast('⭐ Квест 6 выполнен: «Мёртвые заводи» (+12 репутации, цистамин)!');
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
          text: '🌊 «Выдвигаюсь на реку Быстрянку за пробой воды»',
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
      body += `<p><i>«Бинты стерильные на исходе. При гангрене мне останется только цинично разводить руками. В Гнилой гати растет болотный сфагнум — природный антисептик с йодом. Нарви 2 пучка в топях!»</i></p>`;
      if (mossCount >= 2) {
        actions.push({
          text: '🌿 «Передать болотный сфагнум Скаю (Завершить квест 8)»',
          action: () => {
            removeItem('swamp_moss', 2);
            state.mainQuestStep = 8;
            state.reputation += 18;
            changeNpcRep('sky', 12);
            addItem('herbal_salve', 2);
            toast('⭐ Квест 8 выполнен: «Экспедиция в Гнилую гать» (+18 репутации, 2 целебные мази)!');
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
      body += `<p><i>«В вентиляционных стволах Бункера скопился аэрозоль «Каскад-Б». Без армейского респиратора Р-2 легкие превратятся в кашу за три минуты. Скрафти респиратор на верстаке у Боба и покажи мне на проверку герметичности!»</i></p>`;
      if (hasResp) {
        actions.push({
          text: '😷 «Пройти проверку респиратора Р-2 у Ская (Завершить квест 17)»',
          action: () => {
            state.questFlags.respirator_crafted = true;
            state.mainQuestStep = 17;
            state.reputation += 18;
            changeNpcRep('sky', 14);
            addItem('antirad', 2);
            if (!state.unlockedLocations.includes('bunker')) {
              state.unlockedLocations.push('bunker');
            }
            toast('⭐ Квест 17 выполнен: «Дыхание бездны» (+18 репутации, открыт Бункер)!');
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

    // Стандартные медицинские услуги лазарета
    actions.push(
      {
        text: '🩹 Перевязать раны на месте (Восстановить HP до 100 за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            state.hp = 100;
            toast('Скай зашил раны и наложил антисептическую повязку (+100% HP)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSky();
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
            talkSky();
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
            toast('Куплен цистамин (препарат антирадиационной защиты)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSky();
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
            changeNpcRep('sky', 5);
            toast('Скай принял сушеные травы для фармакопеи (+5 репутации, +1 патрон)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkSky();
          } else {
            toast('Нужно минимум 3 пучка трав для лазарета.');
          }
        }
      }
    );

    // Ежедневное поручение: Аптечный сбор
    const dailyHerbs = (state.dailyQuests || []).find(q => q.id === 'daily_herbs' && !q.completed && q.current >= q.goal);
    if (dailyHerbs) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: АПТЕЧНЫЙ СБОР]:</b> <i>«Полынь и целебные травы... Именно то, что нужно лазарету. Повязки дозорным менять, раны прижигать. Держи патроны из нашего фонда.»</i></p>`;
      actions.push({
        text: `🌿 «Сдать целебные травы Скаю (+${dailyHerbs.rewardRep} реп, +${dailyHerbs.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_herbs');
          talkSky();
        },
        primary: true
      });
    }

    // Поручение: Дрова для лазарета
    if (!state.sideQuests?.sq_wood_anna?.status && state.mainQuestStep >= 1) {
      actions.push({
        text: '🪵 «Скай, дрова для буржуйки лазарета нужны?» (Поручение)',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_wood_anna = { status: 'active' };
          toast('📜 Взято поручение: «Дрова для лазарета» (Собрать 4 охапки сухих дров)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkSky();
        }
      });
    } else if (state.sideQuests?.sq_wood_anna?.status === 'active') {
      const hasWood = getItemCount('firewood') >= 4;
      body += `<p style="color:var(--accent-gold);"><b>[ДРОВА ДЛЯ ЛАЗАРЕТА]:</b> <i>«Без сухих поленьев вагончик выстынет, а в холоде раны не заживают. Принёс 4 охапки?»</i></p>`;
      if (hasWood) {
        actions.push({
          text: '🪵 «Вот 4 охапки сухих дров для печки лазарета»',
          action: () => {
            removeItem('firewood', 4);
            state.sideQuests.sq_wood_anna.status = 'completed';
            addItem('bandage', 2);
            state.reputation += 8;
            changeNpcRep('sky', 8);
            toast('⭐ Поручение выполнено: «Дрова для лазарета» (+8 репутации, 2 бинта)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkSky();
          },
          primary: true
        });
      }
    }

    // Уникальный квест высокой репутации (70+): Адское варево Ская
    const skyRep = getNpcRep('sky');
    if (skyRep >= 70 && !state.highRepQuests?.sky?.status && !state.highRepQuests?.anna?.status) {
      actions.push({
        text: '🧪 «Скай, давай создадим твой легендарный детоксикатор!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.sky = { status: 'completed' };
          state.highRepQuests.anna = { status: 'completed' };
          addItem('antirad', 3);
          addItem('alcohol', 2);
          changeNpcRep('sky', 15);
          state.reputation += 22;
          toast('⭐ АДСКОЕ ВАРЕВО СКАЯ СОЗДАНО! Получено 3 цистамина, 2 спирта (+15 репутации Ская, +22 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkSky();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 4. ВОВА «БОБ» («БОБЧОНОК»)
  // Главный инженер, кузнец и механик кустарных технологий («Пункт первый...»)
  // ==========================================================================
  function talkBob() {
    const npc = NPCS.bob;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_bob = true;
    state.questFlags.met_prokhor = true;

    let body = renderNpcRepHeader('bob');
    body += `<p>Вова Боб («Бобчонок») орудует напильником над куском швеллера. Под ногами гора стружки, шестеренок и медных трубок. Из-под верстака доносится тихое бульканье самодельного пивоваренного аппарата из машинки «Малютка».</p>`;
    body += `<p><i>«Здорово! Расклад такой: пункт первый — подходи к верстаку, делай капканы, факелы и инструменты. Пункт второй — найдешь металлолом, проволоку или нихром — тащи сюда, перекуем! Пункт третий — порядок превыше всего, закон Архимеда не обманешь!»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('bob', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Бобом об инженерных чудесах»',
      action: () => openNpcChat('bob')
    });

    // Квест 3: Совет по факелу
    if (state.mainQuestStep === 2) {
      body += `<p style="color:var(--accent-gold);"><b>[СОВЕТ ИНЖЕНЕРА]:</b> <i>«Атарон требует факел? Пункт первый: возьми 1 сухое полено и 1 проволоку. Пункт второй: на верстаке свяжи смоляной факел за полминуты!»</i></p>`;
    }

    // Квест 10: Сборка гидроузла насосной (step 9)
    if (state.mainQuestStep === 9) {
      const hasMembrane = getItemCount('filter_membrane') > 0 || state.questFlags.has_membrane;
      const scrapCount = getItemCount('scrap');
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 10: СЕРДЦЕ ФИЛЬТРА]:</b> <i>«Принёс керамическую мембрану и 3 куска лома со станции? Давай сюда, перепаяем штуцера и пустим чистую воду в лагерь!»</i></p>`;
      if (hasMembrane && scrapCount >= 3) {
        actions.push({
          text: '🔧 «Смонтировать водоочистной узел вместе с Бобом»',
          action: () => {
            if (getItemCount('filter_membrane') > 0) removeItem('filter_membrane', 1);
            removeItem('scrap', 3);
            state.questFlags.pump_repaired = true;
            toast('Станция запущена! Чистая вода пошла в баки лагеря!');
            sfx.playSuccess();
            talkBob();
          },
          primary: true
        });
      }
    }

    // Квест 11: Морзе в ночи (step 10)
    if (state.mainQuestStep === 10) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 11: МОРЗЕ В НОЧИ]:</b></p>`;
      body += `<p><i>«Слушай сюда: пункт первый — в 03:00 наш приемник поймал сигнал SOS на частоте 142.5 МГц! Пункт второй — держи схему ретранслятора, нужно подниматься на Радиовышку на Скалистый утёс!»</i></p>`;
      actions.push({
        text: '📜 «Взять схему ретранслятора у Боба и разведать Радиовышку»',
        action: () => {
          state.questFlags.met_prokhor_radio = true;
          state.mainQuestStep = 11;
          state.reputation += 14;
          changeNpcRep('bob', 10);
          if (!state.unlockedLocations.includes('radio_tower')) {
            state.unlockedLocations.push('radio_tower');
          }
          toast('⭐ Квест 11 выполнен: «Морзе в ночи» (+14 репутации, открыта Радиовышка)!');
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

    // Квест 16: Доспех сталкера (step 15)
    if (state.mainQuestStep === 15) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 16: ДОСПЕХ СТАЛКЕРА]:</b></p>`;
      body += `<p><i>«Шкура Хозяина тайги у тебя? На верстаке из неё, 3 металлолома и 2 проволок сошьем настоящую броню сталкера! Она и от пуль турелей защитит, и рюкзак расширит!»</i></p>`;
    }

    // Стандартные услуги мастерской Боба
    actions.push(
      {
        text: '🔨 Починить стальной капкан (за 1 металлолом)',
        action: () => {
          if (getItemCount('scrap') >= 1) {
            removeItem('scrap', 1);
            addItem('trap', 1);
            toast('Боб выправил пружины капкана');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkBob();
          } else {
            toast('Нужен 1 металлолом.');
          }
        }
      },
      {
        text: '⚙️ Купить сталистую проволоку (за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('wire', 1);
            toast('Куплен моток проволоки');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkBob();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      },
      {
        text: '🔩 Купить металлолом (2 шт. за 1 патрон)',
        action: () => {
          if (getItemCount('ammo') >= 1) {
            removeItem('ammo', 1);
            addItem('scrap', 2);
            toast('Куплено 2 ед. металлолома у Боба');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkBob();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      },
      {
        text: '🔩 Сдать 3 металлолома в мастерскую (+5 репутации, +1 патрон)',
        action: () => {
          if (getItemCount('scrap') >= 3) {
            removeItem('scrap', 3);
            addItem('ammo', 1);
            state.reputation += 5;
            changeNpcRep('bob', 5);
            toast('Боб принял металлолом для ковки (+5 репутации, +1 патрон)');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkBob();
          } else {
            toast('Нужно минимум 3 металлолома.');
          }
        }
      }
    );

    // Ежедневное поручение: Дрова для костра
    const dailyWood = (state.dailyQuests || []).find(q => q.id === 'daily_wood' && !q.completed && q.current >= q.goal);
    if (dailyWood) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: ДРОВА ДЛЯ ГОРНА]:</b> <i>«Сухие поленья для кузнечного горна... Отлично! Без жара металл не куётся. Получи довольствие.»</i></p>`;
      actions.push({
        text: `🌲 «Сдать поленья для кузницы Бобу (+${dailyWood.rewardRep} реп, +${dailyWood.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_wood');
          talkBob();
        },
        primary: true
      });
    }

    // Поручение: Уголь для горна
    if (!state.sideQuests?.sq_coal_prokhor?.status && state.mainQuestStep >= 1) {
      actions.push({
        text: '⚙️ «Боб, металл для горна нужен?» (Поручение)',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.sq_coal_prokhor = { status: 'active' };
          toast('📜 Взято поручение: «Уголь для горна» (Принести 2 металлолома)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkBob();
        }
      });
    } else if (state.sideQuests?.sq_coal_prokhor?.status === 'active') {
      const hasScrap = getItemCount('scrap') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[УГОЛЬ И ЛОМ ДЛЯ ГОРНА]:</b> <i>«Принёс 2 металлолома? Мне скобы для ворот отковать надо.»</i></p>`;
      if (hasScrap) {
        actions.push({
          text: '⚙️ «Вот 2 металлолома для кузнечного горна»',
          action: () => {
            removeItem('scrap', 2);
            state.sideQuests.sq_coal_prokhor.status = 'completed';
            addItem('wire', 3);
            addItem('ammo', 2);
            state.reputation += 10;
            changeNpcRep('bob', 8);
            toast('⭐ Поручение выполнено: «Уголь для горна» (+10 репутации, 3 проволоки, 2 патрона)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkBob();
          },
          primary: true
        });
      }
    }

    // Уникальный квест высокой репутации (70+): Особая заточка Бобчонка
    const bobRep = getNpcRep('bob');
    if (bobRep >= 70 && !state.highRepQuests?.bob?.status && !state.highRepQuests?.prokhor?.status) {
      actions.push({
        text: '🔪 «Боб, сделай особую доводку лезвий и ствола!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.bob = { status: 'completed' };
          state.highRepQuests.prokhor = { status: 'completed' };
          addItem('ammo', 15);
          addItem('wire', 4);
          changeNpcRep('bob', 15);
          state.reputation += 22;
          toast('⭐ ОСОБАЯ ЗАТОЧКА БОБЧОНКА ВЫПОЛНЕНА! (+10 постоянного урона в боях, +15 патронов, 4 проволоки, +15 реп Бобу, +22 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkBob();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 5. ЧАГРОН («ГЛЫБА»)
  // Богатырь-снайпер, таёжный следопыт, тайный спаситель Вари
  // ==========================================================================
  function talkChagron() {
    const npc = NPCS.chagron;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_chagron = true;
    state.questFlags.met_egor = true;

    let body = renderNpcRepHeader('chagron');
    body += `<p>Двухметровый богатырь Чагрон сидит на прибрежном бревне у Быстрянки. Его ладони-лопаты бережно чистят карабин Мосина с оптикой. Рядом плещутся рыболовные верши и висят плетёные силки.</p>`;
    body += `<p><i>«Тайга... тишину любит. Суета людей губит. У реки сядь, дыхание переведи. Червей накопай, удочку забрось — река накормит. А в чащу пойдешь — гляди в оба: волчьи следы свежие были.»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('chagron', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Посидеть у костра с Чагроном и послушать тайгу»',
      action: () => openNpcChat('chagron')
    });

    // Квест 2
    if (state.mainQuestStep === 1) {
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 2: УРОКИ ВЫЖИВАНИЯ]:</b> Чагрон поднимает тяжелый взгляд: <i>«Саныч говорил про тебя. Держись реки. Учись ловить рыбу, слушать лес — выживешь.»</i></p>`;
      actions.push({
        text: '«Саныч велел перенять таёжный опыт. Рад знакомству, Чагрон!»',
        action: () => {
          state.questFlags.met_chagron = true;
          state.questFlags.met_egor = true;
          toast('⭐ Знакомство со следопытом Чагроном зачтено!');
          sfx.playSuccess();
          checkStarterQuestProgress();
          talkChagron();
        },
        primary: true
      });
    }

    // Квест 4: Голодный рассвет (step 3)
    if (state.mainQuestStep === 3) {
      const hasFishMeal = getItemCount('fish_soup') > 0 || getItemCount('cooked_fish') > 0;
      body += `<p style="color:var(--accent-gold);"><b>[КВЕСТ 4: ГОЛОДНЫЙ РАССВЕТ]:</b></p>`;
      body += `<p><i>«Люди в лагере голодные. Скрафти удочку на верстаке у Боба, вылови хариуса в Быстрянке и свари уху на костре. Угостишь меня... и Варе миску занеси. Ей силы нужны.»</i></p>`;
      if (hasFishMeal) {
        actions.push({
          text: '🍲 «Угостить Чагрона свежей таёжной ухой (Завершить квест 4)»',
          action: () => {
            if (getItemCount('fish_soup') > 0) removeItem('fish_soup', 1);
            else removeItem('cooked_fish', 1);
            state.mainQuestStep = 4;
            state.reputation += 12;
            changeNpcRep('chagron', 10);
            addItem('ammo', 2);
            toast('⭐ Квест 4 выполнен: «Голодный рассвет» (+12 репутации, +2 патрона)!');
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
      body += `<p><i>«У отмели трехпалые следы. Выдра-переросток. Сколоти капкан у Боба, взведи у коряжника и добудь шкуру. Тайга уважает терпеливых.»</i></p>`;
      if (hasLeather) {
        actions.push({
          text: '🐾 «Показать шкуру зверя Чагрону (Завершить квест 7)»',
          action: () => {
            state.mainQuestStep = 7;
            state.reputation += 15;
            changeNpcRep('chagron', 12);
            addItem('ammo', 3);
            toast('⭐ Квест 7 выполнен: «Следы на иле» (+15 репутации, +3 патрона)!');
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
      body += `<p><i>«Шатун... не просто зверь. В нем злость и железо. В лоб не стреляй — рикошетит. Бей копьём под лопатку или жди, когда на дыбы встанет. Вернись живым.»</i></p>`;
      actions.push({
        text: '🏹 «Принять охотничий совет Чагрона по Шатуну»',
        action: () => {
          state.questFlags.talked_bear = true;
          toast('Вы узнали уязвимые места Хозяина тайги от снайпера!');
          sfx.playSuccess();
          talkChagron();
        },
        primary: true
      });
    }

    // Стартовая наживка (бесплатно 1 раз)
    if (!state.questFlags.egor_starter_worms) {
      actions.push({
        text: '🪱 Взять стартовую наживку (3 червя бесплатно от Чагрона)',
        action: () => {
          state.questFlags.egor_starter_worms = true;
          addItem('worms', 3);
          toast('Чагрон отсыпал 3 червя: «Держи. Рыбу поймай — горячего поешь. Одному в тайге нельзя.»');
          sfx.playSuccess();
          saveState();
          talkChagron();
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
            toast('Куплена банка червей для рыбалки.');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkChagron();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      });
    }

    // Сдача рыбы в общий котёл
    actions.push({
      text: '🐟 Сдать 2 сырые рыбы в общий котёл (+5 репутации, +1 патрон)',
      action: () => {
        if (getItemCount('raw_fish') >= 2) {
          removeItem('raw_fish', 2);
          addItem('ammo', 1);
          state.reputation += 5;
          changeNpcRep('chagron', 5);
          toast('Чагрон принял улов в общий котёл (+5 репутации, +1 патрон)');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkChagron();
        } else {
          toast('Нужно минимум 2 сырые рыбы для общего котла.');
        }
      }
    });

    // Разговор о калибре 7.62x54R и Варе
    actions.push({
      text: '🎯 «Чагрон, а какой калибр у твоего карабина? Варя всё время спрашивает...»',
      action: () => {
        openModal(
          'Чагрон о винтовке и Варе',
          'Снайпер лагеря • Тайна моста через Десну',
          'assets/images/npc_def_male.png',
          `<p>Чагрон неспешно протирает затвор ветошью. На вороненой стали блестит клеймо Ижевского завода.</p>
           <p><i>«Семь шестьдесят два на пятьдесят четыре. Трёхлинейка Мосина. Винтовочный патрон с закраиной. Надежный... пуля рельс пробивает.»</i></p>
           <p>Великан на мгновение замолкает, глядя на дым над полевой кухней, где хлопочет молодая девушка. Едва заметная тёплая улыбка трогает его губы в седой бороде.</p>
           <p><i>«Под Брянском на мосту через Десну... бандиты загнали беженцев в тупик. Стрелять пришлось с восьмисот метров, сквозь туман. Бандиты попадали, а девчонка... испугалась, но выжила. Ты ей гильзы не подсовывай пустые зря. Пусть варит суп. Человеку нужно горячее, иначе он звереет. А за суп — спасибо ей скажи.»</i></p>`,
          [{ text: '«Понял тебя, Чагрон. Твоя тайна останется со мной.»', action: () => { closeModal(); talkChagron(); }, primary: true }]
        );
      }
    });

    // Ежедневное поручение: Рыбный день
    const dailyFish = (state.dailyQuests || []).find(q => q.id === 'daily_fish' && !q.completed && q.current >= q.goal);
    if (dailyFish) {
      body += `<p style="color:var(--accent-gold);"><b>[ЕЖЕДНЕВНОЕ ПОРУЧЕНИЕ: РЫБНЫЙ ДЕНЬ]:</b> <i>«Рыба свежая... блестит. Молодец. Варя котел поставила, община сыта будет. На патроны.»</i></p>`;
      actions.push({
        text: `🐟 «Сдать улов Чагрону (+${dailyFish.rewardRep} реп, +${dailyFish.rewardAmmo} патр)»`,
        action: () => {
          turnInDailyQuest('daily_fish');
          talkChagron();
        },
        primary: true
      });
    }

    // Уникальный квест высокой репутации (70+): Тайный омут Чагрона
    const chagronRep = getNpcRep('chagron');
    if (chagronRep >= 70 && !state.highRepQuests?.chagron?.status && !state.highRepQuests?.egor?.status) {
      actions.push({
        text: '🎣 «Чагрон, покажи тайный омут на Быстрянке!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.chagron = { status: 'completed' };
          state.highRepQuests.egor = { status: 'completed' };
          addItem('ammo', 15);
          addItem('worms', 10);
          changeNpcRep('chagron', 15);
          state.reputation += 22;
          toast('⭐ ТАЙНЫЙ ОМУТ ЧАГРОНА ОТКРЫТ! Шанс выловить Золотистого хариуса (+15 патронов, 10 червей, +15 реп Чагрону, +22 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkChagron();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 6. МАРГО (МАРЬЯ МОРЕВНА)
  // Лесная травница Пустоши, фиолетовые волосы, кеды «Два мяча», «Трави бобров!»
  // ==========================================================================
  function talkMargo() {
    const npc = NPCS.margo;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_margo = true;
    state.questFlags.met_spiridon = true;

    let body = renderNpcRepHeader('margo');
    body += `<p>Марго сидит на лавке у бревенчатой стены своей заимки в Гнилой гати. Фиолетовые волосы собраны в озорной хвост, на ногах — культовые кеды «Два мяча», на плечах — синяя олимпийка. Вокруг сохнут пучки чабреца, березового дегтя и шляпки мухоморов.</p>`;
    body += `<p><i>«Привет, путник! Слышу по шагам — сквозь топь продирался. В тайге суета — враг номер один! Сядь у огня, отдышись. Земля живая, всё залечит, если сердце не гнилое. А вообще помни: Добро должно быть с кулаками! Трави бобров, спасай деревья!»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('margo', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Марго о Добре, Зле и болотах»',
      action: () => openNpcChat('margo')
    });

    // Обучение зельеварению: Ведьмин гриб
    if (state.sideQuests?.spiridon_mushrooms?.status === 'active' || state.sideQuests?.margo_mushrooms?.status === 'active') {
      const hasMushrooms = getItemCount('amanita') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[ЗНАХАРСКИЙ СБОР]:</b> <i>«Набрал три ядрёных мухомора в лесу? Они под старыми березами прячутся.»</i></p>`;
      if (hasMushrooms) {
        actions.push({
          text: '🍄 «Вот 3 красных мухомора, Марго (Сдать сбор)»',
          action: () => {
            removeItem('amanita', 3);
            if (!state.sideQuests) state.sideQuests = {};
            state.sideQuests.spiridon_mushrooms = { status: 'completed' };
            state.sideQuests.margo_mushrooms = { status: 'completed' };
            addItem('spiridon_vodka', 2);
            state.reputation += 16;
            changeNpcRep('margo', 14);
            toast('⭐ Марго сварила партию таёжной настойки (+2 флакона, +16 репутации, +14 Марго)! Рецепты открыты для костра.');
            sfx.playSuccess();
            updateHUD();
            saveState();
            renderQuests();
            talkMargo();
          },
          primary: true
        });
      }
    } else if (!state.sideQuests?.spiridon_mushrooms?.status && !state.sideQuests?.margo_mushrooms?.status) {
      actions.push({
        text: '🍄 «Марго, научи меня варить таёжную настойку бодрости!»',
        action: () => {
          if (!state.sideQuests) state.sideQuests = {};
          state.sideQuests.spiridon_mushrooms = { status: 'active' };
          state.sideQuests.margo_mushrooms = { status: 'active' };
          toast('📜 Взято задание: «Ведьмин гриб» (Собрать 3 мухомора в лесу)');
          sfx.playClick();
          saveState();
          renderQuests();
          talkMargo();
        },
        primary: true
      });
    }

    // Геологоразведка «Енисей-3» (триангулятор на скале)
    if (!state.questFlags.geo1_done) {
      body += `<p style="color:var(--accent-gold);"><b>[ТАЙНА ТРИАНГУЛЯТОРА НА СОПКЕ]:</b> <i>«Ты в Ближнем лесу на скалу над сосняком глядел? Туда геологи лазали — триангуляцию ставили. Скважину №7 бурили у Быстрянки, что-то аномальное доставали. На треноге на вершине скалы тубус с картами пластов до сих пор прикручен. Поднимись, глянь тубус!»</i></p>`;
      actions.push({
        text: '📍 «Марго, расскажи про партию геологов и скалу с триангулятором»',
        action: () => {
          state.questFlags.spiridon_told_geo = true;
          toast('📍 Марго отметила скалу с триангулятором в Ближнем лесу!');
          sfx.playClick();
          saveState();
          renderQuests();
          openModal(
            'Марго о геологах «Енисей-3»',
            'Заимка травницы • Тайны болот',
            'assets/images/npc_default_woman.png',
            `<p><i>«Слушай сюда! За пару лет до Каскада на вездеходах понаехали буровики из партии «Енисей-3». На сопке в лесу дюралевую треногу вбили, а в пойме Быстрянки шурф глубокий забурили — скважину номер семь. Говорили, гравитация там шалит и стрелка компаса кругом ходит!»</i></p>
             <p><i>«Когда рвануло, они всё побросали. А тубус с картами пластов так на скале и остался. С твоей армейской ловкостью снять его — раз плюнуть! А по карте и саму скважину у реки найдешь.»</i></p>`,
            [{ text: '«Спасибо за наводку, Марго. Поднимусь на скалу.»', action: () => { closeModal(); talkMargo(); }, primary: true }]
          );
        }
      });
    }

    // Рецепты зелий Марго
    if (state.sideQuests?.spiridon_mushrooms?.status === 'completed' || state.sideQuests?.margo_mushrooms?.status === 'completed') {
      body += `<p style="color:var(--accent-green); font-size:12px;"><b>[ТАЙНЫ ПУСТОШИ]:</b> <i>«Теперь ты посвящен в таёжное знахарство. Можешь варить снадобья у меня или на костре в лагере.»</i></p>`;
      actions.push(
        {
          text: '🧪 Сварить «Бальзам Марго» (1 мухомор, 1 спирт, 1 чистая вода)',
          action: () => {
            if (getItemCount('amanita') >= 1 && getItemCount('alcohol') >= 1 && getItemCount('clean_water') >= 1) {
              removeItem('amanita', 1);
              removeItem('alcohol', 1);
              removeItem('clean_water', 1);
              addItem('spiridon_vodka', 1);
              toast('🧪 Сварен ядрёный Бальзам Марго (+40 энергии при приеме)!');
              sfx.playSuccess();
              updateHUD();
              saveState();
              talkMargo();
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
              toast('🍯 Приготовлен Дегтярный бальзам (+40 HP, защита на 3 вылазки)!');
              sfx.playSuccess();
              updateHUD();
              saveState();
              talkMargo();
            } else {
              toast('Нужно: 1 сфагнум, 1 дрова и 1 травы.');
            }
          }
        }
      );
    }

    // Торговля
    actions.push(
      {
        text: '🍶 Купить очищенный спирт (за 2 патрона)',
        action: () => {
          if (getItemCount('ammo') >= 2) {
            removeItem('ammo', 2);
            addItem('alcohol', 1);
            toast('Куплен флакон спирта');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkMargo();
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
            toast('Куплен пучок сушеных трав');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkMargo();
          } else {
            toast('Недостаточно патронов.');
          }
        }
      }
    );

    // Уникальный квест высокой репутации (70+): Философия Добра: Трави бобров!
    const margoRep = getNpcRep('margo');
    if (margoRep >= 70 && !state.highRepQuests?.margo?.status && !state.highRepQuests?.spiridon?.status) {
      actions.push({
        text: '🌿 «Марго, проведи обряд очищения от болотной хвори!» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.margo = { status: 'completed' };
          state.highRepQuests.spiridon = { status: 'completed' };
          state.rad = 0;
          state.hp = 100;
          changeNpcRep('margo', 15);
          state.reputation += 22;
          toast('⭐ ОБРЯД ОЧИЩЕНИЯ ПРОВЕДЕН! Радиация снята полностью, HP на максимуме (+15 реп Марго, +22 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkMargo();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 7. СТРОНГ
  // Аналитик, статистик, регистратор энтропии с антрацитовым глазом
  // ==========================================================================
  function talkStrong() {
    const npc = NPCS.strong;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_strong = true;
    state.questFlags.met_sasha = true;

    let body = renderNpcRepHeader('strong');
    body += `<p>Стронг сидит за радиостанцией на Скалистом утёсе. Его правый глаз — полированный черный антрацит без зрачка, в руках — потертый блокнот с «Реестром Всходов». Из динамиков Р-326 сквозь шипение доносятся телеметрические сигналы.</p>`;
    body += `<p><i>«Фиксирую объект. Точный учёт и фиксация в реестре — единственное, что сдерживает энтропию. Раз в сутки я провожу пеленгацию аварийных сбросов в секторе.»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('strong', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поговорить со Стронгом о статистике и радиоэфире»',
      action: () => openNpcChat('strong')
    });

    // Ежедневное сканирование радиоэфира
    if (!state.sashaRadioUsedToday && !state.strongRadioUsedToday) {
      actions.push({
        text: '📡 «Стронг, включи пеленгатор: найди аварийный контейнер на сегодня»',
        action: () => {
          state.sashaRadioUsedToday = true;
          state.strongRadioUsedToday = true;
          const locs = ['river', 'forest', 'swamp', 'pump_station'];
          state.activeStashLocation = locs[Math.floor(Math.random() * locs.length)];
          const locNames = { river: 'Реке Быстрянке', forest: 'Ближнем лесу', swamp: 'Гнилой гати', pump_station: 'Насосной станции' };
          toast(`📡 СИГНАЛ ЗАПЕЛЕНГОВАН! Стронг зафиксировал контейнер на ${locNames[state.activeStashLocation]}!`);
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkStrong();
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
            talkStrong();
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
            talkStrong();
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
          talkStrong();
        } else {
          toast('Недостаточно патронов.');
        }
      }
    });

    // Уникальный квест высокой репутации (70+): Глубокий радиопеленг энтропии
    const strongRep = getNpcRep('strong');
    if (strongRep >= 70 && !state.highRepQuests?.strong?.status && !state.highRepQuests?.sasha?.status) {
      actions.push({
        text: '📡 «Стронг, перепаяем контур для глубокого радиопеленга?» (Репутация 70+)',
        action: () => {
          state.highRepQuests = state.highRepQuests || {};
          state.highRepQuests.strong = { status: 'completed' };
          state.highRepQuests.sasha = { status: 'completed' };
          addItem('ammo', 10);
          addItem('batteryaaa', 2);
          changeNpcRep('strong', 14);
          state.reputation += 20;
          toast('⭐ Стронг модернизировал радиоконтур (+10 патронов, 2 батарейки, +14 реп Стронгу, +20 лагерю)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          renderQuests();
          talkStrong();
        }
      });
    }

    openModal(npc.name, npc.role, npc.avatar, body, actions);
  }

  // ==========================================================================
  // 8. ВАРЯ (ВАРВАРА)
  // Полевой повар лагеря, родом из Брянска, тайна калибра 7.62x54R
  // ==========================================================================
  function talkVarya() {
    const npc = NPCS.varya;
    if (!state.questFlags) state.questFlags = {};
    state.questFlags.met_varya = true;

    const rep = getNpcRep('varya');
    const tier = getNpcRepTitle(rep);

    let body = renderNpcRepHeader('varya');
    body += `<p>Варя ловко помешивает большой ковш в бурлящем чугунном котле. От жаровни исходит потрясающий, наваристый аромат лесных трав, ухи и разварного мяса. На шее у девушки на тонком кожаном шнурке поблескивает стреляная латунная гильза с закраиной.</p>`;
    body += `<p><i>«О, привет! Вовремя пришёл — как раз похлёбка настоялась! В такую холодину без горячего супа в тайге и часу не выдюжишь. Садись к костру, тарелку подставляй! Слушай... а ты в рейд с каким калибром ходишь? Какой у тебя патрон в подсумке? 5.45? 7.62?.. А семь шестьдесят два на пятьдесят четыре не попадался случайно? Ну скажи, это ужасно важно!»</i></p>`;

    const wInfo = WEATHER_TYPES[state.weather] || WEATHER_TYPES.clear;
    const wQuote = getNpcWeatherQuote('varya', state.weather);
    body += `<p style="font-size:11.5px; color:var(--text-dim); margin:4px 0 8px; border-left:2px solid ${wInfo.color || 'var(--accent-gold)'}; padding-left:8px;">${wInfo.icon} <b>Погода (${wInfo.name}):</b> <i>${wQuote}</i></p>`;

    const actions = [];

    // Душевная беседа
    actions.push({
      text: '💬 «Поболтать с Варей о кухне, Брянске и калибрах»',
      action: () => openNpcChat('varya')
    });

    // Бесплатная порция похлёбки 1 раз в день
    const today = state.day;
    if (state.varyaStewClaimedDay !== today) {
      actions.push({
        text: '🍲 «Варя, налей миску горячей похлёбки из котла!» (Бесплатно раз в день)',
        action: () => {
          state.varyaStewClaimedDay = today;
          addItem('varya_stew', 1);
          changeNpcRep('varya', 2, false);
          toast('🍲 Варя от души налила миску горячей наваристой похлёбки (+45 сытости, +15 энергии)!');
          sfx.playSuccess();
          updateHUD();
          saveState();
          talkVarya();
        },
        primary: true
      });
    } else {
      body += `<p style="color:var(--accent-green); font-size:11.5px;">✓ Вы уже отведали сегодняшнюю порцию горячего супа у Вари. Приходите завтра!</p>`;
    }

    // Чистая вода из кухонного фильтра (если построен varya_filter)
    if (state.sideQuests?.varya_filter?.status === 'completed') {
      if (state.varyaWaterClaimedDay !== today) {
        actions.push({
          text: '💧 «Набрать чистой ключевой воды из кухонного фильтра Вари» (Раз в день)',
          action: () => {
            state.varyaWaterClaimedDay = today;
            addItem('clean_water', 1);
            toast('💧 Фляга чистой питьевой воды набрана из фильтра Вари (+35 жажды)!');
            sfx.playSuccess();
            updateHUD();
            saveState();
            talkVarya();
          }
        });
      }
    }

    // Линейка поручений Вари
    // Квест 1: Огонь и котелок (varya_fire)
    if (!state.sideQuests?.varya_fire?.status) {
      actions.push({
        text: '🪵 «Варя, чем помочь на кухне лагеря?» (Квест: Огонь и котелок)',
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
            changeNpcRep('varya', 10);
            state.reputation += 10;
            toast('⭐ Квест «Огонь и котелок» сдан (+2 порции похлёбки, +10 репутации у Вари, +10 лагерю)!');
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
            changeNpcRep('varya', 14);
            state.reputation += 15;
            toast('⭐ Гравийный фильтр Вари готов! Теперь можно бесплатно набирать чистую воду каждый день (+14 реп Варе, +15 лагерю)!');
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
            changeNpcRep('varya', 16);
            state.reputation += 20;
            toast('🏆 Праздничный таёжный борщ готов! Открыт рецепт для костра (+2 порции, +16 реп у Вари, +20 лагерю)!');
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
    // 1. Большой таёжный пир (Варя + Чагрон, реп >= 50)
    const chagronRep = getNpcRep('chagron');
    if (rep >= 50 && chagronRep >= 50 && !state.crossQuests?.cross_feast?.status) {
      actions.push({
        text: '🍖 «Варя, мы с Чагроном предлагаем устроить Большой таёжный пир!»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_feast = { status: 'active' };
          toast('⚔️ СОЮЗ ЖИТЕЛЕЙ: Взят квест «Большой таёжный пир» (Варя + Чагрон)! Нужно: 2 мяса, 3 рыбы, 3 ягоды.');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.crossQuests?.cross_feast?.status === 'active') {
      const hasFeastMats = getItemCount('raw_meat') >= 2 && getItemCount('raw_fish') >= 3 && getItemCount('berries') >= 3;
      body += `<p style="color:var(--accent-gold);"><b>[СОЮЗ: БОЛЬШОЙ ТАЁЖНЫЙ ПИР]:</b> <i>«Чагрон обещал подсобить с разделкой! Принёс 2 мяса, 3 рыбы и 3 брусники?»</i></p>`;
      if (hasFeastMats) {
        actions.push({
          text: '🎉 «Сдать припасы и зажечь праздничный костёр пира»',
          action: () => {
            removeItem('raw_meat', 2);
            removeItem('raw_fish', 3);
            removeItem('berries', 3);
            state.crossQuests.cross_feast.status = 'completed';
            addItem('smoked_feast', 2);
            changeNpcRep('varya', 14);
            changeNpcRep('chagron', 14);
            state.reputation += 24;
            toast('🏆 БОЛЬШОЙ ТАЁЖНЫЙ ПИР СОСТОЯЛСЯ! Весь лагерь празднует (+14 реп Варе, +14 реп Чагрону, +24 лагерю, открыт рецепт «Окорок по-лесному»)!');
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

    // 2. Полевой автоклав и дистиллятор (Варя, Боб, Скай, реп >= 50 у всех трёх)
    const bobRep = getNpcRep('bob');
    const skyRep = getNpcRep('sky');
    if (rep >= 50 && bobRep >= 50 && skyRep >= 50 && !state.crossQuests?.cross_autoclave?.status) {
      actions.push({
        text: '⚙️ «Варя, объединим силы с Бобом и Скаем для сборки Автоклава?»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_autoclave = { status: 'active' };
          toast('⚔️ ТРОЙСТВЕННЫЙ СОЮЗ: Взят квест «Полевой автоклав» (Варя + Боб + Скай)! Нужно: 3 лома, 2 проволоки, 1 мембрана.');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.crossQuests?.cross_autoclave?.status === 'active') {
      const hasAutoMats = getItemCount('scrap') >= 3 && getItemCount('wire') >= 2 && (getItemCount('filter_membrane') >= 1 || getItemCount('scrap') >= 5);
      body += `<p style="color:var(--accent-gold);"><b>[СОЮЗ: ПОЛЕВОЙ АВТОКЛАВ]:</b> <i>«Боб согнёт корпус из труб, Скай продизенфицирует штуцера, а мы с тобой пустим чистый пар!»</i></p>`;
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
            changeNpcRep('varya', 14);
            changeNpcRep('bob', 14);
            changeNpcRep('sky', 14);
            state.reputation += 24;
            toast('🏆 АВТОКЛАВ УСТАНОВЛЕН! Община получила постоянную стерилизацию и дистиллятор (+14 реп каждому соратнику, +24 лагерю)!');
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

    // 3. Таёжный бальзам долголетия (Варя + Марго, реп >= 50 оба)
    const margoRep = getNpcRep('margo');
    if (rep >= 50 && margoRep >= 50 && !state.crossQuests?.cross_balsam?.status) {
      actions.push({
        text: '🌿 «Варя, объединим твои сиропы с настойками травницы Марго?»',
        action: () => {
          state.crossQuests = state.crossQuests || {};
          state.crossQuests.cross_balsam = { status: 'active' };
          toast('⚔️ СОЮЗ ЗНАХАРЕЙ: Взят квест «Таёжный бальзам» (Варя + Марго)! Нужно: 1 спирт, 3 травы, 2 сфагнума, 2 брусники.');
          sfx.playClick();
          saveState();
          renderQuests();
          talkVarya();
        }
      });
    } else if (state.crossQuests?.cross_balsam?.status === 'active') {
      const hasBalsamMats = getItemCount('alcohol') >= 1 && getItemCount('herbs') >= 3 && getItemCount('swamp_moss') >= 2 && getItemCount('berries') >= 2;
      body += `<p style="color:var(--accent-gold);"><b>[СОЮЗ: ТАЁЖНЫЙ БАЛЬЗАМ]:</b> <i>«Марго шептала над чашей с травами, теперь наш черёд варить взвар!»</i></p>`;
      if (hasBalsamMats) {
        actions.push({
          text: '🧪 «Приготовить легендарный Бальзам Вари и Марго»',
          action: () => {
            removeItem('alcohol', 1);
            removeItem('herbs', 3);
            removeItem('swamp_moss', 2);
            removeItem('berries', 2);
            state.crossQuests.cross_balsam.status = 'completed';
            addItem('taiga_balsam', 2);
            changeNpcRep('varya', 14);
            changeNpcRep('margo', 14);
            state.reputation += 22;
            toast('🏆 БАЛЬЗАМ ДОЛГОЛЕТИЯ СВАРЕН! Рецепт открыт для костра (+2 бальзама, +14 реп обеим, +22 лагерю)!');
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

  // --- ОБРАТНАЯ СОВМЕСТИМОСТЬ СО СТАРЫМИ ФУНКЦИЯМИ ---
  function talkBatya() {
    if ([2, 4, 8, 11, 14, 17].includes(state.mainQuestStep)) {
      talkAtaron();
    } else {
      talkSanych();
    }
  }

  function talkAnna() { talkSky(); }
  function talkProkhor() { talkBob(); }
  function talkEgor() { talkChagron(); }
  function talkSpiridon() { talkMargo(); }
  function talkSasha() { talkStrong(); }
