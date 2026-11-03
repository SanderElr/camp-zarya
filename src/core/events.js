  // --- СИСТЕМА ЛОГИРОВАНИЯ И СТАТУСОВ ---
  function logEvent(text, category = 'camp') {
    state.eventLog = state.eventLog || [];
    state.eventLog.unshift({
      id: Date.now() + Math.random(),
      day: Number(state.day) || 1,
      time: Number(state.timeOfDay) || 0,
      text: String(text),
      category: String(category)
    });
    if (state.eventLog.length > 50) state.eventLog.pop();
  }

  function addStatusEffect(id, duration = 4) {
    const def = STATUS_EFFECTS_DEF[id];
    if (!def) return;
    state.statusEffects = state.statusEffects || {};
    state.statusEffects[id] = {
      id: def.id,
      name: def.name,
      icon: def.icon,
      type: def.type,
      desc: def.desc,
      duration: Number(duration) || 4
    };
    logEvent(`Получен статус: ${def.icon} ${def.name} (${duration}х)`, 'status');
    updateHUD();
  }

  function removeStatusEffect(id) {
    if (state.statusEffects && state.statusEffects[id]) {
      const name = state.statusEffects[id].name;
      delete state.statusEffects[id];
      logEvent(`Статус «${name}» снят.`, 'status');
      updateHUD();
    }
  }

  function hasStatusEffect(id) {
    return !!(state.statusEffects && state.statusEffects[id]);
  }


  function getTimeName(time = state?.timeOfDay) {
    const idx = Math.floor(Number(time) || 0) % 4;
    return TIME_NAMES[(idx + 4) % 4] || 'Утро';
  }

  function isNightTime(time = state?.timeOfDay) {
    const idx = Math.floor(Number(time) || 0) % 4;
    return ((idx + 4) % 4) === 3;
  }
