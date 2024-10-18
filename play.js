const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let player = {
  name: 'Герой',
  health: 100,
  inventory: [],
  location: 'modernCity',
  amuletFound: false, 
  egyptianKnowledge: 0
};

let heroHealth = 100; 
const maxHealth = 100; 
const healthReplenishAmount = 5; 
const replenishInterval = 60000; 

function replenishHealth() {
  if (heroHealth < maxHealth) {
    heroHealth += healthReplenishAmount;
    if (heroHealth > maxHealth) {
      heroHealth = maxHealth; 
    }
  }
}

setInterval(replenishHealth, replenishInterval);

const locations = {
  modernCity: {
    name: 'Современный город',
    description: 'Ты стоишь на оживленной улице, где царит суета городской жизни.',
    choices: [
      { text: 'Пойти в музей', nextLocation: 'museum' },
      { text: 'Искать ответы в библиотеке', nextLocation: 'library' },
      { text: 'Заглянуть в антикварный магазин', nextLocation: 'antiqueShop' },
      { text: 'Попробовать использовать амулет', event: 'useAmulet' } 
    ]
  },
  museum: {
    name: 'Музей истории',
    description: 'В музее царит тишина, только шелестят страницы книг и тикают часы.',
    choices: [
      { text: 'Посмотреть экспонаты', event: 'exploreMuseum' },
      { text: 'Найти смотрителя', event: 'talkToCurator' },
      { text: 'Покинуть музей', nextLocation: 'modernCity'} 
    ],
    visitedMuseum: false,
    visitedCurator: false,
  },
  library: {
    name: 'Библиотека',
    description: 'В тишине библиотеки пахнет старыми книгами и древесиной.',
    choices: [
      { text: 'Поискать информацию о путешествиях во времени', event: 'searchForInfo' },
      { text: 'Почитать книгу о Древнем Египте', event: 'readEgyptBook' },
      { text: 'Покинуть библиотеку', nextLocation: 'modernCity' }
    ],
    visitedInfo: false,
    visitedBook: false,
  },
  antiqueShop: {
    name: 'Антикварный магазин',
    description: 'В магазине царит полумрак, а воздух пропитан запахом древесины и старых вещей.',
    choices: [
      { text: 'Посмотреть товары', event: 'exploreShop' },
      { text: 'Поговорить с продавцом', event: 'talkToSeller' },
      { text: 'Покинуть магазин', nextLocation: 'modernCity' }
    ],
    visitedShop: false,
    visitedSeller: false,
  },
  temple: {
    name: 'Заброшенный Храм',
    description: 'Ты стоишь в тишине заброшенного храма, окутанного тайной. Стены покрыты странными символами, а воздух пропитан таинственностью.',
    choices: [
      { text: 'Исследовать храм', event: 'exploreTemple' },
      { text: 'Искать выход', event: 'searchForExit' },
      { text: 'Встретить сфинксов', event: 'meetSphinxes' },
      { text: 'Встретить Ра', event: 'meetRa', locked: true }
    ]
  },
  ancientEgypt: {
    name: 'Древний Египет',
    description: 'Ты стоишь в центре Древнего Египта, окруженный величественными пирамидами и храмами.',
    choices: [
      { text: 'Исследовать пирамиды', nextLocation: 'pyramid' },
      { text: 'Посетить святилище времени', nextLocation: 'timeSanctuary' }
    ]
  },
  pyramid: {
    name: 'Пирамида',
    description: 'Ты заходишь в величественную пирамиду. Внутри тебя ждут тайны и древние силы.',
    choices: [
      { text: 'Войти в правую комнату', nextLocation: 'pharaohLibrary' },
      { text: 'Войти в левую комнату', nextLocation: 'guardHall' },
      { text: 'Покинуть пирамиду', nextLocation: 'ancientEgypt' }
    ]
  },
  pharaohLibrary: {
    name: 'Тайная библиотека фараона',
    description: 'Ты находишься в древней библиотеке, спрятанной в подземельях пирамиды. Стены покрыты иероглифами, и тут хранятся древние свитки.',
    choices: [
      { text: 'Исследовать библиотеку', event: 'exploreLibrary' },
      { text: 'Покинуть библиотеку', nextLocation: 'pyramid' }
    ]
  },
  guardHall: {
    name: 'Зал Стражей',
    description: 'Перед тобой стоят три статуи, охраняющие артефакты. Когда ты приближаешься, они оживают.',
    choices: [
      { text: 'Сразиться с первым стражем (Анубис)', event: 'fightFirstGuardian' },
      { text: 'Сразиться со вторым стражем (Осирис)', event: 'fightSecondGuardian' },
      { text: 'Сразиться с третьим стражем (Нехбет)', event: 'fightThirdGuardian' },
      { text: 'Покинуть зал', nextLocation: 'pyramid' }
    ],
    visitedA: false,
    visitedO: false,
    visitedN: false,
  },
  timeSanctuary: {
    name: 'Святилище времени',
    description: 'Ты направился к святилищу. Войдя в него, ты оказался сразу в главном зале, в котором находишь Сердце Времени, но оно окружено магическим барьером.',
    choices: [
      { text: 'Снять барьер', event: 'solveTimePuzzle' },
      { text: 'Покинуть святилище', nextLocation: 'pyramid' }
    ]
  },
  medievalEurope: {
    name: 'Средневековая Европа',
    description: 'Ты попадаешь в средневековье, где перед тобой открывается новый мир, полный рыцарей, замков и тайн.',
    choices: [
      { text: 'Исследовать средневековый замок', event: 'exploreCastle' },
      { text: 'Поискать местного торговца', event: 'findMerchant' }
    ]
  }
};

const events = {
  exploreMuseum: function() {
    if (!locations.museum.visitedMuseum) {
      console.log("\nТы рассматриваешь экспонаты в музее, и вдруг замечаешь странный предмет - амулет, который излучает слабое свечение. Ты чувствуешь, что этот амулет может быть ключом к чему-то важному.");
      player.amuletFound = true;
      player.inventory.push('Амулет');
      locations.museum.visitedMuseum = true;
    } else {
      console.log("\nТы уже осмотрел все экспонаты в музее. Тебе не удалось найти ничего нового.");
    }
  },
  talkToCurator: function() {
    if (!locations.museum.visitedCurator) {
      console.log("\nТы подходишь к смотрителю музея и спрашиваешь его о странном амулете. Смотритель, кажется, смущен твоим вопросом. Он говорит, что не знает ничего о таком амулете, и советует тебе обратиться в библиотеку, где, возможно, есть информация о подобных артефактах. В глаза тебе бросается странный символ, на шее смотрителя. Что это?... Кажется глаз, похожий на Египетские символы.");
      locations.museum.visitedCurator = true;
    } else {
      console.log("\nТы уже говорил с смотрителем.");
    }  
  },
  searchForInfo: function() {
    if (!locations.library.visitedInfo) {
      console.log("\nТы ищешь информацию о путешествиях во времени в библиотеке. Тебе попадаются книги о парадоксах времени, теории относительности, но ничего о практических методах путешествий во времени. Ты разочарован.");
      console.log("\nНо вдруг ты находишь интересующую тебя секцию - 'Эзотеризм и магия'.");
      console.log("\nТы видишь книгу с интересным названием - 'Хроники времени'.");
      console.log("\nТы открываешь книгу и видишь, что она содержит информацию о ритуале, который может помочь тебе в путешествиях во времени.");
      player.inventory.push('Хроники времени');
      locations.library.visitedInfo = true;
    } else {
      console.log("\nТы уже осмотрел все книги в библиотеке. Тебе не удалось найти ничего нового.");
    }
  },

  readEgyptBook: function() {
    if (!locations.library.visitedBook) {
      console.log("\nТы находишь книгу о Древнем Египте и начинаешь ее читать. Тебе попадаются описания различных ритуалов, мифов и легенд.");
      console.log("\nТы узнаешь, что в древности люди верили в существование порталов, которые могли переносить их в другие миры.");
      console.log("\nТы находишь символ, который ты видел у смотрителя музея.");
      player.egyptianKnowledge++;
      player.inventory.push('Страница из книги с описанием символа');
      locations.library.visitedBook = true;
    } else {
      console.log("\nТы уже прочитал все книги о Древнем Египте. Тебе не удалось найти ничего нового.");
    }
  },
  exploreShop: function() {
    if (!locations.antiqueShop.visitedShop) {
      console.log("\nТы осматриваешь товары в магазине, но ничего не привлекает твое внимание. Ты разочарован.");
      locations.antiqueShop.visitedShop = true;
    } else {
      console.log("\nТы уже осмотрел все товары в магазине. Тебе не удалось найти ничего нового.");
    }
  },
  talkToSeller: function() {
    if (!locations.antiqueShop.visitedSeller) {
      console.log("\nТы спрашиваешь продавца о странных предметах в магазине. Продавец, не моргнув глазом, говорит, что все предметы имеют свою историю, и их ценность - не только в материальной составляющей, но и в тайнах, которые они хранят. Он советует тебе быть внимательнее и изучать предметы, прежде чем судить о них.");
      locations.antiqueShop.visitedSeller = true;
    } else {
      console.log("\nТы уже говорил с продавцом. Тебе не удалось узнать ничего нового.");
    }
  },
  useAmulet: function() {
    if (player.amuletFound) {
      console.log("\nТы прижимаешь амулет к груди, и он начинает светиться ярким светом. Ты чувствуешь прилив энергии, и перед тобой открывается портал, ведущий в другое место.");
      player.location = 'temple';
    } else {
      console.log("\nУ тебя нет амулета.");
    }
  },
  exploreTemple: function() {
    if (!locations.temple.visited) {
      console.log("\nТы исследуешь храм, пытаясь разгадать его тайны. Ты находишь странные символы на стенах, которые, кажется, излучают странную энергию. Ты понимаешь, что этот храм - не простой объект, он хранит в себе тайну, которая может быть опасна.");
      locations.temple.visited = true;
    } else {
      console.log("\nТы уже исследовал храм. Тебе ничего нового не удалось найти.");
    }
  },
  searchForExit: function() {
    console.log("\nТы ищешь выход из храма, но все пути ведут в тупик. Ты понимаешь, что выход из храма - это не просто дверь, а решение какой-то загадки. Ты чувствуешь, что должен найти ключ к разгадке этой загадки.");
  },
  meetSphinxes: async function() {
    console.log("\nТы подходишь к входу в храм и видишь трех сфинксов, которые охраняют вход.");
  
    const questions = [
      { question: "Я имею голову человека, тело льва и крылья орла. Я могу видеть будущее. Кто я?", answer: "сфинкс" },
      { question: "Какое животное имеет четыре ноги утром, две днем и три вечером?", answer: "человек" },
      { question: "Я египтянин, и я не говорю, не ем, не пью. Что я?", answer: "смерть" },
    ];
  
    for (let i = 0; i < questions.length; i++) {
      const { question, answer } = questions[i];
  
      while (true) {
        console.log(`\n${i + 1}й сфинкс говорит: '${question}'`);
        const userAnswer = await askQuestion('Введите ответ: ');
  
        if (userAnswer.toLowerCase() === answer) {
          console.log("\nСфинкс говорит: 'Правильно! Ты можешь пройти дальше.'");
          break;
        } else {
          console.log("\nСфинкс говорит: 'Неправильно! Ты не можешь пройти дальше.'");
          player.health -= 10;
          console.log(`\nТвое здоровье: ${player.health}`);
  
          if (player.health <= 0) {
            console.log("\nТы проиграл и умер.");
            player.location = 'modernCity';
            return;
          } else {
            console.log("Вы можете попытаться снова.");
          }
        }
      }
    }
  
    console.log("\nТы прошел все три испытания и можешь пройти дальше.");
    locations.temple.choices[3].locked = false; 
    player.location = 'temple';
    displayLocation();
    showChoices();
  },
  meetRa: async function() {
    console.log("\nТы подходишь к Ра, который охраняет Хрусталь Времени.");
    console.log("\nРа говорит: 'Ты хочешь пройти мимо меня? Тогда сначала ответь на мой вопрос.'");
    console.log("\nРа говорит: 'Что такое время?'");
    if (heroHealth > 0) {
    const answer = await askQuestion('Введите ответ: ');
    if (answer.toLowerCase() === 'время - это измерение, которое позволяет нам понимать последовательность событий') {
      if (player.inventory.includes('Хроники времени')) {
        console.log("\nРа говорит: 'Правильно! Ты можешь пройти мимо меня.'");
        player.inventory.push('Хрусталь Времени');
        console.log("\nТы получил Хрусталь Времени.");
        console.log("\nТы чувствуешь, что Хрусталь Времени дает тебе силу путешествовать во времени.");
        console.log("\nТы решаешь использовать Хрусталь Времени, чтобы попасть в Древний Египет.");
        player.location = 'ancientEgypt';
      } else {
        console.log("\nУ тебя нет точных знаний о времени, потому что ты не достаточно прочитал книг. Теперь ты навеки подчиняешься Ра.");
        console.log("\nТы проиграл.");
        rl.close();
        process.exit();
      }
        if (heroHealth <= 0) {
          console.log("\nТы проиграл и умер.");
          rl.close();
          process.exit();
        }
      }
    } else {
      console.log("\nРа говорит: 'Неправильно! Ты не можешь пройти мимо меня.'");
      heroHealth -= 20;
      console.log(`\nТвое здоровье: ${heroHealth}`);
      if (heroHealth <= 0) {
        console.log("\nТы проиграл и умер.");
        rl.close();
        process.exit();
      } else {
        console.log("\nТы можешь попробовать еще раз.");
      }
      }
  },
  exploreLibrary: function () {
    if (player.egyptianKnowledge > 0) {
    console.log("\nТы исследуешь библиотеку и находишь свиток с картой пирамиды. Ты узнаешь, что Сердце Времени охраняется могущественным духом.");
    player.inventory.push('Карта пирамиды');
    player.egyptianKnowledge++;
  } else {
    console.log("\nТы обладаешь недостаточными знаниями о Древнем Египте. Ты навсегда застрял там.");
    player.health = 0;
    console.log("\nТы проиграл и умер.");
    rl.close();
    process.exit();
  }
  },
  fightFirstGuardian: async function () {
    if (!locations.guardHall.visitedA) {
        console.log("\nПервый страж Анубис оживает и атакует тебя магическими чарами. Чтобы победить его, тебе нужно использовать знания о магии.");
        const result = await solvePuzzle("анубис", "Расположите буквы в правильном порядке для имени стража смерти: б и а н с у");
        if (result) {
            console.log("\nТы успешно отражаешь магическую атаку Анубиса и побеждаешь его!");
            player.inventory.push('Артефакт Анубиса');
            locations.guardHall.visitedA = true;
        } else {
            console.log("\nТы не знаешь, как противостоять магии Анубиса. Ты потерял часть своего здоровья.");
            player.health -= 20;
        }
    } else {
        console.log("\nТы уже победил Анубиса.");
    }
  },
  fightSecondGuardian: async function () {
    if (!locations.guardHall.visitedO) {
      console.log("\nВторой страж Осирис атакует тебя. Это страж времени, и тебе нужно замедлить его атаки с помощью артефакта.");
      const result = await solvePuzzle("осирис", "Расположите буквы в правильном порядке для имени стража времени: и р с и с о");
      if (result) {
          console.log("\nТы используешь амулет и замедляешь время. Осирис побежден!");
          player.inventory.push('Артефакт Осириса');
          locations.guardHall.visitedO = true;
      } else {
          console.log("\nУ тебя нет амулета для замедления времени. Ты получаешь удар от Осириса.");
          player.health -= 30;
      }
    } else {
      console.log("\nТы уже победил Осириса.");
    }
  },
  fightThirdGuardian: async function () {
    if (!locations.guardHall.visitedN) {
      console.log("\nТретий страж атакует тебя мощными ударами. Это физическое сражение.");
      const result = await solvePuzzle("нехбет", "Расположите буквы в правильном порядке для имени стража силы: е н т е б х");
      if (result) {
          console.log("\nТы сражаешься с третьим стражем и побеждаешь её!");
          player.inventory.push('Артефакт Нехбет');
          locations.guardHall.visitedN = true;
      } else {
          console.log("\nТы слишком слаб, чтобы победить третьего стража. Тебе нужно больше здоровья.");
          player.health -= 40;
      }
    } else {
      console.log("\nТы уже победил Нехбет.");
    }
  },
  solveTimePuzzle: function () {
    if (player.inventory.includes('Артефакт Осириса') && player.inventory.includes('Артефакт Анубиса') && player.inventory.includes('Артефакт Нехбет')) {
        console.log("\nТы соединяешь артефакты в правильной последовательности, и барьер, защищающий Сердце Времени, исчезает.");
        player.inventory.push('Сердце Времени');
        console.log("\nТы получил Сердце Времени! Теперь у тебя есть сила управлять временем.");
        console.log("\nПирамиды начинают дрожать, и перед тобой открывается портал в средневековье...");
        player.location = 'medievalEurope';
    } else {
        console.log("\nДля того, чтобы снять барьер нужно собрать и соединить 3 артефакта.");
    }
  }
};

function solvePuzzle(correctAnswer, puzzleName) {
  return new Promise(async (resolve) => {
    let attempts = 3;
    while (attempts > 0) {
      const answer = await askQuestion(`\n${puzzleName} \nВведите правильный ответ: `);
      if (answer.toLowerCase() === correctAnswer) {
        console.log("\nПравильный ответ! Головоломка решена.");
        resolve(true);
        return;
      } else {
        attempts--;
        console.log(`\nНеправильно! Осталось попыток: ${attempts}`);
      }
    }
    console.log("\nГоловоломка не решена. Придется попробовать снова.");
    resolve(false);
  });
}

function travel(nextLocation) {
  return new Promise(resolve => {
    setTimeout(() => {
      player.location = nextLocation;
      console.log(`\nТы перемещаешься в ${locations[nextLocation].name}.`);
      resolve();
    }, 2000);
  });
}


function displayLocation() {
  const currentLocation = locations[player.location];
  console.log(`\n${currentLocation.description}\n`);
}


function showChoices() {
  const currentLocation = locations[player.location];
  console.log('Что вы хотите сделать?');
  currentLocation.choices.forEach((choice, index) => {
    if (!choice.locked) {
      console.log(`${index + 1}. ${choice.text}`);
    }
  });
}


async function handleChoice(choiceIndex) {
  const currentLocation = locations[player.location];
  const choice = currentLocation.choices[choiceIndex - 1];

  if (choice.nextLocation) {
      await travel(choice.nextLocation);
      displayLocation();
      showChoices();
  } else if (choice.event) {
    if (events[choice.event]) {
      await events[choice.event](); 
      displayLocation();
      showChoices();
    }
  }
}


function askQuestion(query) {
  if (rl.closed) {
    console.log('Игра окончена.');
    process.exit();
  }
  return new Promise(resolve => rl.question(query, resolve));
}

async function startGame() {
  console.log("Ты - обычный человек, который случайно получил возможность путешествовать во времени.");
  console.log("Но что-то пошло не так, и мир изменился...");
  console.log("Ты должен исправить ошибку и вернуть мир в нормальное состояние.");

  displayLocation();
  showChoices();

  while (true) {
    const answer = await askQuestion('Введите номер действия: ');
    const choiceIndex = parseInt(answer);
    if (choiceIndex && !isNaN(choiceIndex)) {
      await handleChoice(choiceIndex);
    } else {
      console.log('Игра окончена.');
      rl.close();
      break;
    }
  }
}

startGame();
