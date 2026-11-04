  // --- СОХРАНЕНИЕ И СБРОС ---
  function saveState() {
    try {
      localStorage.setItem('camp_zarya_save', JSON.stringify(state));
    } catch(e) {}
  }

  function loadSavedState() {
    try {
      const saved = localStorage.getItem('camp_zarya_save');
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.questFlags = Object.assign({}, INITIAL_STATE.questFlags, parsed.questFlags || {});

        // Автоматическая нормализация флагов для старых сохранений
        if (parsed.mainQuestStep >= 1) parsed.questFlags.met_batya = true;
        if (parsed.mainQuestStep >= 2) {
          parsed.questFlags.met_anna = true;
          parsed.questFlags.met_egor = true;
          parsed.questFlags.met_prokhor = true;
        }
        if (parsed.mainQuestStep >= 4) {
          parsed.questFlags.egor_starter_worms = true;
        }
        if (parsed.mainQuestStep >= 5) {
          parsed.questFlags.dogs_defeated = true;
        }
        if (parsed.mainQuestStep >= 6) {
          parsed.questFlags.water_sample_given = true;
        }
        if (parsed.mainQuestStep >= 7) {
          parsed.questFlags.swamp_explored = true;
        }
        if (parsed.mainQuestStep >= 9) {
          parsed.questFlags.pump_cleared = true;
        }
        if (parsed.mainQuestStep >= 10) {
          parsed.questFlags.has_membrane = true;
          parsed.questFlags.pump_repaired = true;
        }
        if (parsed.mainQuestStep >= 12) {
          parsed.questFlags.met_prokhor_radio = true;
          parsed.questFlags.radio_repaired = true;
        }
        if (parsed.mainQuestStep >= 13) {
          parsed.questFlags.tape_decoded = true;
        }
        if (parsed.mainQuestStep >= 14) {
          parsed.questFlags.cordon_searched = true;
        }
        if (parsed.mainQuestStep >= 15) {
          parsed.questFlags.talked_bear = true;
          parsed.questFlags.bear_defeated = true;
        }
        if (parsed.mainQuestStep >= 17) {
          parsed.questFlags.suit_crafted = true;
        }
        if (parsed.mainQuestStep >= 18) {
          parsed.questFlags.respirator_crafted = true;
          parsed.questFlags.bunker_entered = true;
        }
        if (parsed.mainQuestStep >= 19) {
          parsed.questFlags.turrets_neutralized = true;
          parsed.questFlags.reactor_reached = true;
        }
        if (parsed.mainQuestStep >= 20) {
          parsed.questFlags.reactor_shutdown = true;
          parsed.questFlags.bunker_completed = true;
        }
        parsed.maxEnergy = parsed.maxEnergy || 100;
        parsed.sideQuests = Object.assign({}, INITIAL_STATE.sideQuests, parsed.sideQuests || {});
        if (parsed.hasDog === undefined) parsed.hasDog = false;
        if (parsed.hasDog) parsed.questFlags.dog_house_built = true;
        if (parsed.questFlags.dog_house_built) parsed.hasDog = true;
        if (parsed.pumpWaterActive === undefined) parsed.pumpWaterActive = false;
        if (parsed.hasGeoCompass === undefined) parsed.hasGeoCompass = false;
        if (parsed.hasGeiger === undefined) parsed.hasGeiger = false;
        if (parsed.hasGeiger) parsed.questFlags.geiger_crafted = true;
        if (parsed.hasElectricTorch === undefined) parsed.hasElectricTorch = false;
        if (parsed.hasElectricTorch) parsed.questFlags.electric_torch_crafted = true;
        if (parsed.hasTozScope === undefined) parsed.hasTozScope = false;
        if (parsed.introSeen === undefined) {
          parsed.introSeen = (parsed.mainQuestStep > 0 || parsed.day > 1);
        }
        if (typeof parsed.timeOfDay !== 'number' || isNaN(parsed.timeOfDay)) {
          parsed.timeOfDay = 0;
        } else {
          parsed.timeOfDay = Math.max(0, parsed.timeOfDay % 4);
        }
        if (typeof parsed.day !== 'number' || isNaN(parsed.day) || parsed.day < 1) {
          parsed.day = 1;
        }
        if (!parsed.weather) parsed.weather = 'clear';
        parsed.statusEffects = parsed.statusEffects || {};
        parsed.campUpgrades = Object.assign({}, INITIAL_STATE.campUpgrades, parsed.campUpgrades || {});
        if (parsed.questFlags.dog_house_built || parsed.hasDog) {
          parsed.campUpgrades.kennel = true;
        }
        parsed.campStorage = parsed.campStorage || {};
        parsed.eventLog = Array.isArray(parsed.eventLog) ? parsed.eventLog : [];
        if (parsed.eventLog.length === 0) {
          parsed.eventLog.push({ id: 1, day: parsed.day || 1, time: parsed.timeOfDay || 0, text: 'Хроника лагеря начата.', category: 'story' });
        }
        
        // Нормализация индивидуальной репутации и новых квестовых систем
        parsed.npcRep = Object.assign({}, INITIAL_STATE.npcRep, parsed.npcRep || {});
        if (parsed.reputation && parsed.reputation > 50) {
          const bonus = Math.floor((parsed.reputation - 50) / 10);
          ['batya', 'anna', 'prokhor', 'egor', 'varya'].forEach(id => {
            if (parsed.npcRep[id] <= 15) parsed.npcRep[id] += Math.min(bonus, 35);
          });
          if (parsed.questFlags?.met_spiridon && parsed.npcRep.spiridon <= 5) {
            parsed.npcRep.spiridon += Math.min(bonus, 25);
          }
          if (parsed.questFlags?.met_sasha && parsed.npcRep.sasha <= 0) {
            parsed.npcRep.sasha += Math.min(bonus, 25);
          }
        }
        parsed.crossQuests = parsed.crossQuests || {};
        parsed.highRepQuests = parsed.highRepQuests || {};
        parsed.npcChatDay = parsed.npcChatDay || {};
        if (parsed.varyaStewClaimedDay === undefined) parsed.varyaStewClaimedDay = -1;
        if (parsed.varyaWaterClaimedDay === undefined) parsed.varyaWaterClaimedDay = -1;

        state = Object.assign(state, parsed);
      }
    } catch(e) {}
  }

  function resetGame() {
    try {
      localStorage.removeItem('camp_zarya_save');
    } catch(e) {}
    state = JSON.parse(JSON.stringify(INITIAL_STATE));
    state.introSeen = false;
    closeModal();
    init();
  }
