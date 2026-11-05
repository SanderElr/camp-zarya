  // --- НПС ЛАГЕРЯ «ВСЕМ ПОХ»: СОВЕТ ОСНОВАТЕЛЕЙ И ЖИТЕЛИ ---
  const NPCS = {
    sanych: {
      id: 'sanych',
      name: 'Александр Александрович (Саныч)',
      role: 'Глава лагеря «Всем ПОХ»',
      avatar: 'assets/images/npc_leader.png?v=2.2',
      desc: 'Основатель поселения, верховный дипломат и мотиватор. Собрал уцелевших на старой продуваемой лесопилке посреди мёртвой тайги. Для него оптимизм — это не блажь, а железная воинская дисциплина.'
    },
    ataron: {
      id: 'ataron',
      name: 'Андрей «Атарон»',
      role: 'Комендант периметра и безопасности',
      avatar: 'assets/images/npc_male2.png?v=2.2',
      desc: 'Отвечает за оборону и строгий учет. Частокол у него стоит строго под 45 градусов, факелы горят по уставу. Коллекционирует пивные крышечки — твердую валюту порядка.'
    },
    sky: {
      id: 'sky',
      name: 'Николай «Скай»',
      role: 'Главный врач и токсиколог',
      avatar: 'assets/images/npc_vet.png?v=2.2',
      desc: 'Полевой хирург с чернейшим юмором и усталыми глазами. Лечит раненых, ворчит на речную воду («Наука проиграла реке!»), варит «Адское варево» и спасает от радиации.'
    },
    bob: {
      id: 'bob',
      name: 'Вова «Боб» («Бобчонок»)',
      role: 'Главный инженер и механик',
      avatar: 'assets/images/npc_engineer.png?v=2.2',
      desc: 'Кудесник кустарных технологий. Рассуждает строго по пунктам: «Пункт первый, пункт второй...». Перебирает водоочистители, кует снаряжение и варит крафтовое пиво.'
    },
    chagron: {
      id: 'chagron',
      name: 'Чагрон («Глыба»)',
      role: 'Снайпер и таёжный следопыт',
      avatar: 'assets/images/npc_def_male.png?v=2.2',
      desc: 'Двухметровый богатырь с ладонями-лопатами. Немногословен, виртуозно бьет калибром 7.62x54R. Втайне не выносит пустоты и одиночества, поэтому любит греться у костра с новичками.'
    },
    varya: {
      id: 'varya',
      name: 'Варя (Варвара)',
      role: 'Полевой повар лагеря',
      avatar: 'assets/images/npc_varya.png?v=2.2',
      desc: 'Молодая девушка родом из Брянска, спасённая на мосту неизвестным снайпером. Заведует общим котлом, варит наваристые супы и выспрашивает у всех калибр 7.62x54R.'
    },
    margo: {
      id: 'margo',
      name: 'Марго (Марья Моревна)',
      role: 'Лесная травница Пустоши',
      avatar: 'assets/images/npc_default_woman.png?v=2.2',
      desc: 'Травница с фиолетовыми волосами в кедах «Два мяча». Знает все секреты болот, берёзового дёгтя и целебных трав. Главный лесной философ Пустоши.',
      marker: 'swamp'
    },
    strong: {
      id: 'strong',
      name: 'Стронг',
      role: 'Аналитик и радио-статист',
      avatar: 'assets/images/npc_sasha.png?v=2.2',
      desc: 'Человек с антрацитовым глазом и потертым блокнотом. Ведет «Реестр Всходов», сканирует радиоэфир на Скалистом утёсе и точно вычисляет вероятности.'
    }
  };

  // Неперечислимые псевдонимы для 100% обратной совместимости со старыми сохранениями и кодом
  Object.defineProperty(NPCS, 'batya', { value: NPCS.sanych, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'anna', { value: NPCS.sky, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'prokhor', { value: NPCS.bob, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'egor', { value: NPCS.chagron, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'spiridon', { value: NPCS.margo, enumerable: false, writable: true, configurable: true });
  Object.defineProperty(NPCS, 'sasha', { value: NPCS.strong, enumerable: false, writable: true, configurable: true });
