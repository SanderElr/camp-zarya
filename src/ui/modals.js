  function showDeathModal() {
    openModal(
      'СМЕРТЬ В ТАЙГЕ',
      'Жизненные показатели на нуле',
      'assets/images/rad_icon.png',
      `<p>Ваше тело не выдержало суровых законов постапокалиптической тайги. Вы погибли от истощения или ран.</p>
       <p>Лагерь «Всем ПОХ» продолжит борьбу за выживание, но уже без вас...</p>`,
      [{ text: 'Начать заново', action: resetGame, primary: true }]
    );
  }


  // --- МОДАЛЬНОЕ ОКНО ---
  function openModal(title, subtitle, avatar, bodyHtml, actions = []) {
    // Гарантируем актуальный расчет высоты верхнего HUD перед открытием модалки
    if (typeof document !== 'undefined' && typeof document.querySelector === 'function' && document.documentElement) {
      const hudHeader = document.querySelector('.hud-header');
      if (hudHeader) {
        document.documentElement.style.setProperty('--hud-height', hudHeader.offsetHeight + 'px');
      }
    }

    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalSubtitle').textContent = subtitle;
    document.getElementById('modalAvatar').src = avatar || 'assets/images/cabin.png';
    const bodyEl = document.getElementById('modalBody');
    if (bodyEl) {
      bodyEl.innerHTML = bodyHtml;
      bodyEl.scrollTop = 0; // Всегда сбрасываем скролл на начало текста при открытии
    }

    const footer = document.getElementById('modalFooter');
    footer.innerHTML = '';

    actions.forEach(act => {
      const btn = document.createElement('button');
      btn.className = `modal-btn ${act.primary ? 'primary' : ''} ${act.danger ? 'danger' : ''}`;
      btn.innerHTML = act.text;
      btn.onclick = act.action;
      footer.appendChild(btn);
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-btn';
    closeBtn.textContent = 'Закрыть';
    closeBtn.onclick = closeModal;
    footer.appendChild(closeBtn);

    document.getElementById('modalOverlay').classList.add('active');
  }

  function closeModal() {
    sfx.init();
    sfx.playClick();
    document.getElementById('modalOverlay').classList.remove('active');
  }


  // --- ТОСТ-УВЕДОМЛЕНИЯ ---
  function toast(message, type = 'auto') {
    const container = document.getElementById('toastLog');
    if (!container) return;
    const toastEl = document.createElement('div');

    const isWarning = type === 'warning' || (type === 'auto' && /недостаточно|слишком|не хватает|заперт|закрыт|требуется|ранен|гибель|яд|опасн|самоубийство|отсутствует|нужен|нужно|⚠️|❌|⛔|🔒/i.test(message));
    const isSuccess = type === 'success' || (type === 'auto' && /выполнен|завершен|получен|наград|добыт|побежд|открыт|запущен|починен|спасен|найден|⭐|🏆|🎉|✓/i.test(message));

    let prefix = '';
    if (isWarning && !message.startsWith('⚠️') && !message.startsWith('❌') && !message.startsWith('🔒') && !message.startsWith('⛔')) {
      prefix = '⚠️ ';
    }

    toastEl.className = `toast-msg ${isWarning ? 'toast-warning' : (isSuccess ? 'toast-success' : '')}`;
    toastEl.textContent = prefix + message;

    if (isWarning) {
      sfx.init();
      sfx.playDanger();
    }

    toastEl.onclick = () => {
      if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    };

    container.appendChild(toastEl);
    setTimeout(() => {
      if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 2800);
  }
