  // --- КАТАЛОГ СТАТУСОВ (БАФФЫ И ДЕБАФФЫ) ---
  const STATUS_EFFECTS_DEF = {
    well_fed: {
      id: 'well_fed',
      name: 'Сытость',
      icon: '🍲',
      type: 'buff',
      desc: 'Организм полон сил: восстанавливает +2 HP за каждый ход.'
    },
    spiridon_vigor: {
      id: 'spiridon_vigor',
      name: 'Тонус Спиридоновки',
      icon: '🍄',
      type: 'buff',
      desc: 'Ядрёная настойка: снижение расхода энергии в вылазках на -15%.'
    },
    rad_shield: {
      id: 'rad_shield',
      name: 'Радиозащита',
      icon: '🛡️',
      type: 'buff',
      desc: 'Травяной барьер: снижает всё накопление радиации на 50%.'
    },
    lynx_vision: {
      id: 'lynx_vision',
      name: 'Око рыси',
      icon: '👁️',
      type: 'buff',
      desc: 'Обострённые чувства: ночные вылазки проходят без штрафов к энергии.'
    },
    body_warmth: {
      id: 'body_warmth',
      name: 'Таёжное тепло',
      icon: '☕',
      type: 'buff',
      desc: 'Защита от простуды и дождя, комфорт в любую непогоду.'
    },
    bleeding: {
      id: 'bleeding',
      name: 'Рваная рана',
      icon: '🩸',
      type: 'debuff',
      desc: 'Кровотечение: отнимает -4 HP за ход. Перевяжите бинтом или нанесите мазь!'
    },
    hypothermia: {
      id: 'hypothermia',
      name: 'Переохлаждение',
      icon: '🥶',
      type: 'debuff',
      desc: 'Трясёт от холода: расход энергии +25%. Отогрейтесь у костра или выпейте горячий чай.'
    },
    poisoning: {
      id: 'poisoning',
      name: 'Отравление',
      icon: '🤢',
      type: 'debuff',
      desc: 'Токсины в желудке: теряется -3 HP за ход. Примите берёзовый уголь!'
    }
  };
