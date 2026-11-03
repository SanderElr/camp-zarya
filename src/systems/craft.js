  // --- КРАФТ И КУЛИНАРИЯ ---
  function switchCraftStation(station) {
    sfx.init();
    sfx.playClick();
    state.craftStation = station;
    document.querySelectorAll('.craft-tab-btn').forEach(b => {
      const isFire = b.getAttribute('onclick')?.includes('fire') || b.textContent.includes('Костёр');
      b.classList.toggle('active', station === 'fire' ? isFire : !isFire);
    });
    renderRecipes();
  }

  function renderRecipes() {
    const list = document.getElementById('recipesList');
    if (!list) return;
    list.innerHTML = '';

    const currentRecipes = RECIPES.filter(r => {
      if (r.station !== state.craftStation) return false;
      // Скрывать разовые уникальные рецепты после их изготовления
      if (r.oneTime && r.isCrafted && r.isCrafted(state)) return false;
      // Проверка условий открытия рецепта
      if (r.unlocked && !r.unlocked(state)) return false;
      return true;
    });

    if (currentRecipes.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; padding:35px 15px; color:var(--text-dim); font-size:12px; background:rgba(0,0,0,0.25); border:1px dashed var(--border-dim); border-radius:8px;">
          <p style="font-weight:bold; color:var(--text-main); margin-bottom:4px;">В этой категории пока нет доступных рецептов</p>
          <p style="font-size:11px;">Все уникальные чертежи изготовлены, либо требуются новые знания от жителей лагеря.</p>
        </div>
      `;
      return;
    }

    currentRecipes.forEach(r => {
      let canCraft = true;
      let costBadges = [];
      for (const [resId, reqCount] of Object.entries(r.cost)) {
        if (reqCount <= 0) continue;
        const have = getItemCount(resId);
        const resName = ITEMS[resId]?.name || resId;
        const isEnough = have >= reqCount;
        if (!isEnough) canCraft = false;
        costBadges.push(`<span class="ingredient-pill ${isEnough ? 'pill-ok' : 'pill-missing'}">${isEnough ? '✓' : '✗'} ${resName}: ${have}/${reqCount}</span>`);
      }

      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <div class="recipe-header">
          <img src="${r.icon}" class="recipe-icon pixel-art" alt="">
          <div style="flex:1;">
            <div class="recipe-title" style="display:flex; justify-content:space-between; align-items:center;">
              <span>${r.name}</span>
              ${r.oneTime ? '<span style="font-size:9.5px; color:var(--accent-gold); font-weight:normal; border:1px solid rgba(255,190,34,0.4); border-radius:3px; padding:1px 5px;">РАЗОВО</span>' : ''}
            </div>
            <div class="recipe-ingredients">${costBadges.join('')}</div>
          </div>
        </div>
        <p style="font-size:11px; color:var(--text-dim); margin:4px 0 0 0;">${r.desc}</p>
        <button class="recipe-btn ${canCraft ? 'can-craft' : ''}" onclick="Game.craftRecipe('${r.id}')" ${!canCraft ? 'disabled style="opacity:0.4;"' : ''}>
          ${canCraft ? 'Изготовить' : 'Не хватает сырья'}
        </button>
      `;
      list.appendChild(card);
    });
  }

  function craftRecipe(recipeId) {
    sfx.init();
    const r = RECIPES.find(x => x.id === recipeId);
    if (!r) return;

    if (r.unlocked && !r.unlocked(state)) {
      toast('Этот рецепт вам ещё неизвестен!');
      return;
    }

    if (r.oneTime && r.isCrafted && r.isCrafted(state)) {
      toast('Этот уникальный чертёж уже изготовлен!');
      return;
    }

    // Проверка ингредиентов
    for (const [resId, reqCount] of Object.entries(r.cost)) {
      if (getItemCount(resId) < reqCount) {
        toast('Недостаточно материалов!');
        return;
      }
    }

    // Списание
    for (const [resId, reqCount] of Object.entries(r.cost)) {
      removeItem(resId, reqCount);
    }
    // Выдача
    for (const [resId, addCount] of Object.entries(r.result || {})) {
      addItem(resId, addCount);
    }

    state.energy = Math.max(0, state.energy - r.energy);
    passTime(0.5);

    if (!state.questFlags) state.questFlags = {};
    if (r.id === 'craft_rod') state.questFlags.rod_crafted = true;
    if (r.id === 'craft_spear') state.questFlags.spear_crafted = true;
    if (r.id === 'craft_stalker_suit') {
      state.questFlags.suit_crafted = true;
      state.maxWeight = Math.max(state.maxWeight, 30.0);
    }
    if (r.id === 'craft_respirator') state.questFlags.respirator_crafted = true;
    if (r.id === 'craft_geiger') {
      state.hasGeiger = true;
      state.questFlags.geiger_crafted = true;
    }
    if (r.id === 'craft_electric_torch') {
      state.hasElectricTorch = true;
      state.questFlags.electric_torch_crafted = true;
    }
    if (r.id === 'craft_doghouse') {
      state.hasDog = true;
      state.questFlags.dog_house_built = true;
      state.reputation += 35;
      toast('🐶 БУРАН ОБРЕЛ ТЁПЛЫЙ ДОМ! Лайка стала вашим верным спутником (+25% к урону в боях, +35 репутации)!');
      renderNPCs();
      renderQuests();
    }

    sfx.playSuccess();
    toast(`🔨 Изготовлено: ${r.name}`);
    renderRecipes();
  }
