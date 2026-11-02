/**
 * Integration Test for all 20 Main Quests in Camp Zarya
 */
const fs = require('fs');
const vm = require('vm');

let lastModalButtons = [];
const domElements = {};

function createMockElement(id = '') {
  return {
    id,
    innerHTML: '',
    textContent: '',
    src: '',
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false
    },
    appendChild: (child) => {
      if (id === 'modalFooter') {
        lastModalButtons.push(child);
      }
    },
    querySelectorAll: () => [],
    style: {}
  };
}

const mockDocument = {
  getElementById: (id) => {
    if (!domElements[id]) domElements[id] = createMockElement(id);
    if (id === 'modalFooter') {
      const origEl = domElements[id];
      return {
        ...origEl,
        set innerHTML(val) {
          lastModalButtons = [];
        },
        appendChild(btn) {
          lastModalButtons.push(btn);
        }
      };
    }
    return domElements[id];
  },
  querySelectorAll: () => [],
  createElement: (tag) => {
    return {
      tagName: tag,
      className: '',
      innerHTML: '',
      textContent: '',
      onclick: null,
      style: {}
    };
  },
  body: createMockElement('body')
};

const mockLocalStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, val) { this.store[key] = String(val); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

const mockAudio = class {
  play() { return Promise.resolve(); }
  pause() {}
  load() {}
};

const sandbox = {
  document: mockDocument,
  window: {
    addEventListener: () => {},
    localStorage: mockLocalStorage,
    Audio: mockAudio,
    AudioContext: class {
      createGain() { return { connect: () => {}, gain: { value: 1 } }; }
      createOscillator() { return { connect: () => {}, start: () => {}, stop: () => {}, frequency: { setValueAtTime: () => {} } }; }
    }
  },
  localStorage: mockLocalStorage,
  Audio: mockAudio,
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Math: Math,
  event: { target: { classList: { add: () => {} } } }
};

sandbox.window.window = sandbox.window;
sandbox.window.document = mockDocument;

const code = fs.readFileSync('d:/down/ag/camp/game.js', 'utf8');

const lastReturnIdx = code.lastIndexOf('return {');
const injectedCode = code.slice(0, lastReturnIdx) + `
  globalThis.__TEST__ = {
    getState: () => state,
    setState: (s) => { state = s; },
    MAIN_QUESTS,
    ITEMS,
    RECIPES,
    LOCATIONS,
    getItemCount,
    addItem,
    removeItem,
    talkBatya,
    talkAnna,
    talkEgor,
    talkProkhor,
    doGatherToxicWater,
    doFightDogs,
    doGatherMoss,
    doScavengeSwamp,
    doClearPumpDebris,
    doScavengeStation,
    doSearchCordon,
    doHuntBear,
    doRepairAntenna,
    doEnterBunker,
    doShutdownReactor,
    renderQuests,
    showVictoryScreen
  };
` + code.slice(lastReturnIdx);

vm.createContext(sandbox);

try {
  vm.runInContext(injectedCode, sandbox);
  console.log('Sandbox initialized successfully!');
} catch (e) {
  console.error('Sandbox initialization error:', e);
  process.exit(1);
}

const T = sandbox.__TEST__;
const state = T.getState();

console.log('==============================================');
console.log('🚀 STARTING TEST SUITE: 20 MAIN QUESTS FLOW');
console.log('==============================================');

function assert(condition, message) {
  if (!condition) {
    console.error('❌ ASSERTION FAILED:', message);
    throw new Error(message);
  } else {
    console.log('  ✓', message);
  }
}

function clickPrimaryModalButton() {
  const btn = lastModalButtons.find(b => b.className && b.className.includes('primary')) || lastModalButtons[0];
  if (btn && btn.onclick) {
    btn.onclick();
  } else {
    console.warn('⚠️ No clickable button found in modalFooter! buttons count:', lastModalButtons.length);
  }
}

// -------------------------------------------------------------
// STEP 0: Квест 1: Прибытие в Зарю
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 1: Прибытие в «Зарю» (Step 0 -> 1) ---');
assert(state.mainQuestStep === 0, 'Initial mainQuestStep is 0');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 1, 'mainQuestStep advanced to 1 after talking to Batya');
assert(state.questFlags.met_batya === true, 'met_batya flag is set');
assert(T.getItemCount('clean_water') >= 2, 'Received clean water reward');
assert(T.getItemCount('ammo') >= 8, 'Received ammo reward');

// -------------------------------------------------------------
// STEP 1: Квест 2: Первые шаги (Step 1 -> 2)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 2: Первые шаги (Step 1 -> 2) ---');
T.talkAnna();
assert(state.questFlags.met_anna === true, 'met_anna flag set');
T.talkEgor();
assert(state.questFlags.met_egor === true, 'met_egor flag set');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 2, 'mainQuestStep advanced to 2 after completing introductions');
assert(T.getItemCount('ammo') >= 11, 'Received ammo reward for completing Quest 2');

// -------------------------------------------------------------
// STEP 2: Квест 3: Огонь во тьме (Step 2 -> 3)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 3: Огонь во тьме (Step 2 -> 3) ---');
T.addItem('firewood', 3);
T.addItem('torch', 1);
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 3, 'mainQuestStep advanced to 3 after crafting torch & firewood');

// -------------------------------------------------------------
// STEP 3: Квест 4: Голодный рассвет (Step 3 -> 4)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 4: Голодный рассвет (Step 3 -> 4) ---');
T.addItem('rod', 1);
T.addItem('cooked_fish', 1);
T.talkEgor();
clickPrimaryModalButton();
assert(state.mainQuestStep === 4, 'mainQuestStep advanced to 4 after sharing cooked fish with Egor');

// -------------------------------------------------------------
// STEP 4: Квест 5: Крещение тайгой (Step 4 -> 5)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 5: Крещение тайгой (Step 4 -> 5) ---');
T.addItem('spear', 1);
const forestLoc = T.LOCATIONS.find(l => l.id === 'forest');
state.energy = 50;
T.doFightDogs(forestLoc);
assert(state.questFlags.dogs_defeated === true, 'Dogs defeated on forest edge');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 5, 'mainQuestStep advanced to 5 after reporting defense to Batya');
assert(state.unlockedLocations.includes('swamp'), 'Swamp (Гнилая гать) unlocked');

// -------------------------------------------------------------
// STEP 5: Квест 6: Мёртвые заводи (Step 5 -> 6)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 6: Мёртвые заводи (Step 5 -> 6) ---');
const riverLoc = T.LOCATIONS.find(l => l.id === 'river');
state.energy = 50;
T.doGatherToxicWater(riverLoc);
assert(T.getItemCount('water_sample') >= 1, 'Toxic water sample collected');
T.talkAnna();
clickPrimaryModalButton();
assert(state.mainQuestStep === 6, 'mainQuestStep advanced to 6 after delivering sample to Anna');
assert(state.questFlags.water_sample_given === true, 'water_sample_given flag set');
assert(T.getItemCount('antirad') >= 1, 'Received antirad medication');

// -------------------------------------------------------------
// STEP 6: Квест 7: Следы на иле (Step 6 -> 7)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 7: Следы на иле (Step 6 -> 7) ---');
T.addItem('leather', 1);
T.talkEgor();
clickPrimaryModalButton();
assert(state.mainQuestStep === 7, 'mainQuestStep advanced to 7 after showing pelt to Egor');

// -------------------------------------------------------------
// STEP 7: Квест 8: Экспедиция в Гнилую гать (Step 7 -> 8)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 8: Экспедиция в Гнилую гать (Step 7 -> 8) ---');
const swampLoc = T.LOCATIONS.find(l => l.id === 'swamp');
state.energy = 50;
T.doGatherMoss(swampLoc);
assert(state.questFlags.swamp_explored === true, 'Swamp explored');
T.addItem('swamp_moss', 3);
T.talkAnna();
clickPrimaryModalButton();
assert(state.mainQuestStep === 8, 'mainQuestStep advanced to 8 after bringing moss to Anna');
assert(T.getItemCount('herbal_salve') >= 1, 'Received herbal salve');

// -------------------------------------------------------------
// STEP 8: Квест 9: Прорыв к Насосной станции (Step 8 -> 9)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 9: Прорыв к Насосной станции (Step 8 -> 9) ---');
const pumpLoc = T.LOCATIONS.find(l => l.id === 'pump_station');
state.energy = 50;
T.doClearPumpDebris(pumpLoc);
assert(state.questFlags.pump_cleared === true, 'Pump station debris cleared');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 9, 'mainQuestStep advanced to 9 after clearing pump station');

// -------------------------------------------------------------
// STEP 9: Квест 10: Сердце фильтра (Step 9 -> 10)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 10: Сердце фильтра (Step 9 -> 10) ---');
state.energy = 50;
T.doScavengeStation(pumpLoc);
assert(T.getItemCount('filter_membrane') >= 1, 'Filter membrane found in station');
T.addItem('scrap', 3);
T.talkProkhor();
clickPrimaryModalButton();
assert(state.questFlags.pump_repaired === true, 'Pump repaired with Prokhor');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 10, 'mainQuestStep advanced to 10 after reporting to Batya');

// -------------------------------------------------------------
// STEP 10: Квест 11: Морзе в ночи (Step 10 -> 11)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 11: Морзе в ночи (Step 10 -> 11) ---');
T.talkProkhor();
clickPrimaryModalButton();
assert(state.mainQuestStep === 11, 'mainQuestStep advanced to 11 after consulting Prokhor about radio');
assert(state.unlockedLocations.includes('radio_tower'), 'Radio tower unlocked on map');

// -------------------------------------------------------------
// STEP 11: Квест 12: Эхо на Скалистом утёсе (Step 11 -> 12)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 12: Эхо на Скалистом утёсе (Step 11 -> 12) ---');
const radioLoc = T.LOCATIONS.find(l => l.id === 'radio_tower');
state.energy = 50;
T.addItem('scrap', 3);
T.addItem('wire', 2);
T.doRepairAntenna(radioLoc);
assert(state.questFlags.radio_repaired === true, 'Radio antenna repaired');
assert(T.getItemCount('audio_tape') >= 1, 'Audio tape received from radio transmission');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 12, 'mainQuestStep advanced to 12 after reporting radio signal');

// -------------------------------------------------------------
// STEP 12: Квест 13: Шифр Воронова (Step 12 -> 13)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 13: Шифр Воронова (Step 12 -> 13) ---');
T.talkProkhor();
clickPrimaryModalButton();
assert(state.questFlags.tape_decoded === true, 'tape_decoded flag set by Prokhor');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 13, 'mainQuestStep advanced to 13 after decoding audio tape and reporting to Batya');
assert(state.unlockedLocations.includes('old_cordon'), 'Old Cordon unlocked on map');

// -------------------------------------------------------------
// STEP 13: Квест 14: Тайна Заброшенного кордона (Step 13 -> 14)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 14: Тайна Заброшенного кордона (Step 13 -> 14) ---');
const cordonLoc = T.LOCATIONS.find(l => l.id === 'old_cordon');
state.energy = 50;
T.doSearchCordon(cordonLoc);
assert(T.getItemCount('keycard_sfera') >= 1, 'Keycard Sfera obtained');
assert(T.getItemCount('note_voronov') >= 1, 'Voronov diary obtained');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 14, 'mainQuestStep advanced to 14 after delivering cordon findings');

// -------------------------------------------------------------
// STEP 14: Квест 15: Хозяин тайги (Step 14 -> 15)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 15: Хозяин тайги (Step 14 -> 15) ---');
T.talkEgor();
clickPrimaryModalButton();
assert(state.questFlags.talked_bear === true, 'talked_bear flag set');
const huntingLoc = T.LOCATIONS.find(l => l.id === 'hunting_grounds');
state.hp = 100;
state.energy = 60;
T.addItem('spear', 1);
T.doHuntBear(huntingLoc);
assert(state.questFlags.bear_defeated === true, 'Giant bear defeated');
assert(T.getItemCount('bear_pelt') >= 1, 'Bear pelt obtained');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 15, 'mainQuestStep advanced to 15 after defeating bear');
assert(T.getItemCount('toz') >= 1, 'Legendary TOZ-34 shotgun rewarded');

// -------------------------------------------------------------
// STEP 15: Квест 16: Доспех сталкера (Step 15 -> 16)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 16: Доспех сталкера (Step 15 -> 16) ---');
T.addItem('stalker_suit', 1);
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 16, 'mainQuestStep advanced to 16 after showing stalker suit to Batya');
assert(state.questFlags.suit_crafted === true, 'suit_crafted flag set');

// -------------------------------------------------------------
// STEP 16: Квест 17: Дыхание бездны (Step 16 -> 17)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 17: Дыхание бездны (Step 16 -> 17) ---');
T.addItem('respirator', 1);
T.talkAnna();
clickPrimaryModalButton();
assert(state.mainQuestStep === 17, 'mainQuestStep advanced to 17 after showing respirator to Anna');
assert(state.questFlags.respirator_crafted === true, 'respirator_crafted flag set');
assert(state.unlockedLocations.includes('bunker'), 'Bunker Sfera unlocked on map');

// -------------------------------------------------------------
// STEP 17: Квест 18: Штурм Бункера «Сфера» (Step 17 -> 18)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 18: Штурм Бункера «Сфера» (Step 17 -> 18) ---');
const bunkerLoc = T.LOCATIONS.find(l => l.id === 'bunker');
state.energy = 60;
T.addItem('ammo', 5);
T.doEnterBunker(bunkerLoc);
assert(state.questFlags.bunker_entered === true, 'Bunker breached');
assert(state.questFlags.turrets_neutralized === true, 'Turrets neutralized');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 18, 'mainQuestStep advanced to 18 after reporting bunker assault to Batya');

// -------------------------------------------------------------
// STEP 18: Квест 19: Предотвращение «Каскада-2» (Step 18 -> 19)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 19: Предотвращение «Каскада-2» (Step 18 -> 19) ---');
state.energy = 50;
T.doShutdownReactor(bunkerLoc);
assert(state.questFlags.reactor_shutdown === true, 'Reactor successfully shut down');
assert(T.getItemCount('floppy_disk') >= 1, 'Cascade archives floppy disk retrieved');
assert(T.getItemCount('stabilizer_nectar') >= 1, 'Nectar-7 stabilizer retrieved');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 19, 'mainQuestStep advanced to 19 after reporting reactor shutdown');

// -------------------------------------------------------------
// STEP 19: Квест 20: Новый рассвет «Зари» (Step 19 -> 20)
// -------------------------------------------------------------
console.log('\n--- TESTING QUEST 20: Новый рассвет «Зари» (Step 19 -> 20) ---');
T.talkBatya();
clickPrimaryModalButton();
assert(state.mainQuestStep === 20, 'mainQuestStep advanced to 20 (Campaign Victory)');
assert(state.questFlags.bunker_completed === true, 'bunker_completed flag set');

// -------------------------------------------------------------
// VERIFY QUESTS RENDERING & COMPLETION PERCENTAGE
// -------------------------------------------------------------
console.log('\n--- VERIFYING QUESTS RENDERING & CHECKLISTS ---');
state.questView = 'main';
T.renderQuests();

const completedCount = T.MAIN_QUESTS.filter(q => state.mainQuestStep > q.step || (q.step === 19 && state.mainQuestStep >= 20)).length;
assert(completedCount === 20, 'All 20 quests are counted as completed at endgame');

T.MAIN_QUESTS.forEach((q, idx) => {
  const checklist = q.checklist(state);
  const allDone = checklist.every(item => item.done);
  assert(allDone, `Quest ${idx + 1} (${q.title}): all checklist items are marked done!`);
});

console.log('\n==============================================');
console.log('🎉 ALL TESTS PASSED! ALL 20 QUESTS VERIFIED!');
console.log('==============================================');
