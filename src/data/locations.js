  // --- ЛОКАЦИИ КАРТЫ ---
  const LOCATIONS = [
    {
      id: 'river', name: 'Река Быстрянка', tier: 1, icon: 'assets/images/polluted_water.png', rad: 5, energyCost: 10, timePass: 1,
      desc: 'Бурная таёжная река. Здесь ловят рыбу, собирают тростник и набирают воду.',
      unlocked: true,
      actions: ['fish', 'gather_water', 'dig_worms']
    },
    {
      id: 'forest', name: 'Ближний лесок', tier: 1, icon: 'assets/images/wood.png', rad: 10, energyCost: 10, timePass: 1,
      desc: 'Опушка тайги вокруг лагеря. Место сбора хвороста, брусники и лекарственных трав.',
      unlocked: true,
      actions: ['gather_wood', 'gather_herbs', 'hunt_birds']
    },
    {
      id: 'swamp', name: 'Гнилая гать (Торфяники)', tier: 2, icon: 'assets/images/moss.png', rad: 25, energyCost: 20, timePass: 2,
      desc: 'Зловонные торфяники, окутанные желтоватым смогом. Здесь растёт ценный антисептический сфагнум.',
      unlocked: false, reqRep: 60,
      actions: ['gather_moss', 'scavenge_swamp']
    },
    {
      id: 'pump_station', name: 'Насосная станция №4', tier: 2, icon: 'assets/images/a_chemistry_station.png', rad: 25, energyCost: 20, timePass: 2,
      desc: 'Полузатопленный бетонный комплекс очистки воды. Здесь можно найти фильтры и трубы.',
      unlocked: false, reqRep: 100,
      actions: ['scavenge_station']
    },
    {
      id: 'hunting_grounds', name: 'Охотничьи угодья', tier: 2, icon: 'assets/images/wolf.png', rad: 20, energyCost: 25, timePass: 2,
      desc: 'Глухой бурелом. Водятся кабаны, зайцы и волки. Нужна осторожность и оружие.',
      unlocked: false, reqRep: 150,
      actions: ['place_trap', 'hunt_big_game']
    },
    {
      id: 'old_cordon', name: 'Заброшенный кордон', tier: 2, icon: 'assets/images/abandoned_house.png', rad: 15, energyCost: 15, timePass: 2,
      desc: 'Старый бревенчатый кордон лесничества у подножия скал. Бывшая полевая база экспедиции НИИ «Сфера».',
      unlocked: false, reqRep: 250,
      actions: ['search_cordon', 'scavenge_cordon']
    },
    {
      id: 'radio_tower', name: 'Радиовышка на утесе', tier: 3, icon: 'assets/images/generator_skin.png', rad: 35, energyCost: 30, timePass: 3,
      desc: 'Старая советская вышка связи. Отсюда открывается вид на всю закрытую зону.',
      unlocked: false, reqRep: 300,
      actions: ['repair_antenna']
    },
    {
      id: 'bunker', name: 'Бункер НИИ «Сфера»', tier: 3, icon: 'assets/images/hatch.png', rad: 60, energyCost: 40, timePass: 4,
      desc: 'Запечатанный подземный научный центр, ставший источником Каскада.',
      unlocked: false, reqRep: 500,
      actions: ['enter_bunker']
    }
  ];
