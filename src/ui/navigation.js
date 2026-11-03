  // --- НАВИГАЦИЯ ПО ВКЛАДКАМ ---
  function switchTab(tabId) {
    sfx.init();
    sfx.playClick();
    closeModal();
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const btnIndex = ['tabCamp', 'tabMap', 'tabInventory', 'tabCraft', 'tabQuests'].indexOf(tabId);
    const navButtons = document.querySelectorAll('.nav-btn');
    if (navButtons[btnIndex]) navButtons[btnIndex].classList.add('active');

    // Всегда обновляем активную вкладку свежими данными
    if (tabId === 'tabInventory') renderInventory();
    else if (tabId === 'tabCraft') renderRecipes();
    else if (tabId === 'tabQuests') renderQuests();
    else if (tabId === 'tabMap') renderLocations();
    else if (tabId === 'tabCamp') renderNPCs();
  }
