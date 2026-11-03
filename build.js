#!/usr/bin/env node
/**
 * ⚡ BUILD SYSTEM ДЛЯ «ЛАГЕРЬ ЗАРЯ»
 * Сборщик модулей из src/ в монолитный distribution game.js
 * Обеспечивает 100% совместимость:
 * - Локальный запуск (file:///) без CORS-ошибок
 * - GitHub Pages публикация
 * - Поддержка автоматического watch-режима (node build.js --watch)
 * - Синтаксическая валидация через node -c
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const OUTPUT_FILE = path.join(ROOT_DIR, 'game.js');

// Топологический порядок модулей
const MODULE_ORDER = [
  // 1. Контентные базы данных (Data)
  'data/items.js',
  'data/recipes.js',
  'data/locations.js',
  'data/npcs.js',
  'data/weather.js',
  'data/statuses.js',
  'data/upgrades.js',
  'data/quests_side.js',
  'data/quests_main.js',

  // 2. Ядро состояния и механик (Core)
  'core/state.js',
  'core/events.js',
  'core/audio.js',
  'core/time.js',

  // 3. Пользовательский интерфейс (UI)
  'ui/hud.js',
  'ui/modals.js',
  'ui/journal_ui.js',
  'ui/camp_ui.js',
  'ui/navigation.js',
  'ui/menu.js',

  // 4. Игровые механики и логика (Systems)
  'systems/inventory.js',
  'systems/npcs.js',
  'systems/sorties.js',
  'systems/craft.js',
  'systems/quests.js',

  // 5. Персистентность (Persistence)
  'core/persistence.js',

  // 6. Главная точка входа и экспорт (Main)
  'main.js'
];

function build() {
  const startTime = Date.now();
  console.log('⚡ [Сборка] Начало сборки модулей...');

  const banner = `/* ==========================================================================
   ИГРОВОЙ ДВИЖОК: ТЕКСТОВАЯ RPG «ЛАГЕРЬ ЗАРЯ»
   Собрано автоматически из src/ (${new Date().toISOString()})
   Не редактируйте этот файл вручную — вносите изменения в файлы src/
   ========================================================================== */

const Game = (() => {

`;

  let totalLines = 0;
  const parts = [banner];

  for (const relPath of MODULE_ORDER) {
    const fullPath = path.join(SRC_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ [Ошибка] Файл не найден: ${relPath}`);
      process.exit(1);
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split('\n').length;
    totalLines += lines;
    parts.push(`  // >>> MODULE: ${relPath} (${lines} строк)\n`);
    parts.push(content.trimEnd());
    parts.push('\n\n');
  }

  // Запись в game.js
  const bundled = parts.join('');
  fs.writeFileSync(OUTPUT_FILE, bundled, 'utf8');

  // Валидация синтаксиса через node -c
  try {
    execSync(`node -c "${OUTPUT_FILE}"`, { stdio: 'pipe' });
  } catch (err) {
    console.error('❌ [Синтаксическая ошибка в собранном game.js]:');
    console.error(err.stderr ? err.stderr.toString() : err.message);
    process.exit(1);
  }

  const duration = Date.now() - startTime;
  const stat = fs.statSync(OUTPUT_FILE);
  const sizeKb = (stat.size / 1024).toFixed(1);

  console.log(`✅ [Успех] game.js успешно собран: ${sizeKb} KB, ~${totalLines} строк за ${duration} мс.`);
}

// Watch режим
if (process.argv.includes('--watch')) {
  build();
  console.log('👀 [Watch] Отслеживание изменений в папке src/...');

  let debounceTimer = null;
  fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.js')) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`\n🔄 [Изменение] ${filename} изменен. Пересборка...`);
      try {
        build();
      } catch (e) {
        console.error('Ошибка при сборке:', e.message);
      }
    }, 100);
  });
} else {
  build();
}
