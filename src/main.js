  // --- ИНИЦИАЛИЗАЦИЯ И ОБНОВЛЕНИЕ UI ---
  function init() {
    initAudio();
    loadSavedState();
    try {
      const savedBg = localStorage.getItem('camp_bg_theme') || 'camp';
      applyBgTheme(savedBg);
    } catch(e) {}
    generateDailyQuestsIfNeeded();
    updateHUD();
    renderNPCs();
    renderLocations();
    renderInventory();
    renderRecipes();
    renderQuests();

    if (!state.introSeen) {
      showIntroScreen();
    } else {
      hideIntroScreen();
      toast('🏕️ Добро пожаловать обратно в Лагерь «Всем ПОХ»!');
    }
  }


  // --- УПРАВЛЕНИЕ СТАРТОВЫМ ЭКРАНОМ ---
  function showIntroScreen() {
    const el = document.getElementById('introScreen');
    if (el) el.classList.add('active');
    const chk = document.getElementById('introMusicCheckbox');
    if (chk) chk.checked = musicEnabled;
  }

  function hideIntroScreen() {
    const el = document.getElementById('introScreen');
    if (el) el.classList.remove('active');
  }

  function setMusicFromIntro(enabled) {
    musicEnabled = enabled;
    try {
      localStorage.setItem('camp_music_enabled', musicEnabled);
    } catch(e) {}
    updateMusicUI();
  }

  function startGameFromIntro() {
    sfx.init();
    sfx.playSuccess();
    state.introSeen = true;
    saveState();
    hideIntroScreen();

    const chk = document.getElementById('introMusicCheckbox');
    if (chk) {
      musicEnabled = chk.checked;
      try {
        localStorage.setItem('camp_music_enabled', musicEnabled);
      } catch(e) {}
    }
    if (musicEnabled && bgMusicEl) {
      const curSrc = MUSIC_TRACKS[currentTrackIndex].src;
      if (!bgMusicEl.src || !bgMusicEl.src.includes(curSrc)) {
        bgMusicEl.src = curSrc;
      }
      bgMusicEl.volume = musicVolume;
      bgMusicEl.play().catch(() => {});
    }
    updateMusicUI();

    toast('🏕️ Вы прибыли в лагерь «Всем ПОХ»! Поговорите с Санычем в штабе.');
    if (state.mainQuestStep === 0) {
    }
  }

  // Запуск при загрузке страницы
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', init);
  }

  return {
    switchTab,
    filterInv,
    switchCraftStation,
    craftRecipe,
    switchQuestView,
    restAtCamp,
    openCampFire,
    closeModal,
    toggleMusic,
    setMusicVolume,
    nextMusicTrack,
    MUSIC_TRACKS,
    getCurrentTrackIndex: () => currentTrackIndex,
    openSystemMenu,
    resetGame,
    showIntroScreen,
    hideIntroScreen,
    setMusicFromIntro,
    startGameFromIntro,
    saveState,
    loadSavedState,
    talkToNPC,
    talkSanych,
    talkAtaron,
    talkSky,
    talkBob,
    talkChagron,
    talkMargo,
    talkStrong,
    talkVarya,
    talkBatya,
    talkAnna,
    talkProkhor,
    talkEgor,
    talkSpiridon,
    talkSasha,
    getNpcRep,
    getNpcRepTitle,
    changeNpcRep,
    openNpcChat,
    turnInDailyQuest,
    setBgTheme,
    applyBgTheme,
    openJournal,
    openCampUpgrades,
    buildCampUpgrade,
    openCampStorage,
    transferToStorage,
    transferFromStorage,
    toast,
    state,
    updateHUD,
    openLocationModal,
    quickDrinkWater,
    quickRest,
    quickUseAntirad,
    LOCATIONS,
    ITEMS,
    NPCS,
    RECIPES
  };

})();
