const sceneTitle = document.getElementById('sceneTitle');
const sceneCaption = document.getElementById('sceneCaption');
const sceneText = document.getElementById('sceneText');
const sceneStage = document.getElementById('sceneStage');
const sceneLocation = document.getElementById('sceneLocation');
const choicePanel = document.getElementById('choicePanel');
const logList = document.getElementById('logList');
const restartButton = document.getElementById('restartButton');

const progressLabel = document.getElementById('progressLabel');
const partyLabel = document.getElementById('partyLabel');
const itemLabel = document.getElementById('itemLabel');
const fearLabel = document.getElementById('fearLabel');

const scenes = {
  intro: {
    stage: '序盤',
    location: '洋館1階',
    caption: '閉ざされた洋館の玄関前',
    title: '目を覚ますと、出口は塞がれていた',
    text:
      '静かな洋館。だが、玄関は開かない。\n\n' +
      'あなた、ユウキ、ミナの3人は、置き去りにされたようにこの屋敷へ閉じ込められていた。\n' +
      '遠くで床が軋む。何かが、こちらを探している。',
    choices: [
      { id: 'searchHall', title: '玄関ホールを調べる', desc: '最初の手がかりを探す。', next: 'hallSearch' },
      { id: 'goStudy', title: '書斎へ向かう', desc: '鍵や暗号を探しに行く。', next: 'studyBegin' },
    ],
  },
  hallSearch: {
    stage: '序盤',
    location: '洋館1階',
    caption: '最初の異変',
    title: '暗い廊下の奥から、低い足音が近づく',
    text:
      '壁の肖像画の視線が妙に刺さる。\n' +
      'ホールの奥で、青白い影が一瞬だけ揺れた。\n\n' +
      'クローゼットに隠れたミナは無事だったが、ユウキが別方向へ逃げてしまった。\n' +
      'ここから先は、隠れることを覚えないと生き残れない。',
    choices: [
      { id: 'hideFirst', title: 'クローゼットに隠れる', desc: '青鬼の基本を学ぶ。', next: 'studyBegin', effects: { fear: 8 } },
      { id: 'inspectHall', title: 'ホールを調べ続ける', desc: '危険だが、手がかりがあるかもしれない。', next: 'studyBegin', effects: { fear: 14, item: 1, log: 'ホールの机から「書斎の鍵」を入手した。' } },
    ],
  },
  studyBegin: {
    stage: '序盤',
    location: '書斎',
    caption: 'シンプルな謎解き',
    title: '書斎の机に、暗号メモが残されている',
    text:
      '鍵穴は複数あるが、まずは書斎の奥を開ける必要がある。\n\n' +
      '「赤、青、黒。順番がある」\n' +
      'そのメモが、最初の脱出ルートを示しているようだった。',
    choices: [
      { id: 'solveCode', title: '暗号を解く', desc: '序盤の基本ギミックを突破する。', next: 'basementGate', effects: { item: 1, log: '暗号装置が解除され、地下への隠し扉が開いた。' } },
      { id: 'findFriends', title: '仲間を探す', desc: '行方不明のユウキを追う。', next: 'basementGate', effects: { fear: 10, party: -1, log: 'ユウキの叫び声が地下へ消えた。' } },
    ],
  },
  basementGate: {
    stage: '中盤',
    location: '地下通路',
    caption: '変化する恐怖',
    title: '隠し扉の先は、湿った地下通路だった',
    text:
      '壁には古い配管。遠くで水が流れる。\n\n' +
      'ここから先は、序盤の安全策が通用しない。\n' +
      'やけに速い青鬼、扉を開けてくる青鬼、そして仲間を切り離す仕掛けが待っている。',
    choices: [
      { id: 'waterValve', title: '水門を操作する', desc: '別館へのルートを作る。', next: 'annexLab', effects: { item: 1, fear: 12, log: '水門の圧力が抜け、別館への道が現れた。' } },
      { id: 'balancePuzzle', title: '天秤の部屋を調べる', desc: '中盤らしい複合ギミック。', next: 'annexLab', effects: { item: 1, fear: 6, log: '天秤の重さが揃い、地下の封印が解除された。' } },
    ],
  },
  annexLab: {
    stage: '中盤',
    location: '別館',
    caption: '仲間が減る不安',
    title: '別館には、誰かの実験記録が残されていた',
    text:
      'ここで初めて、この館がただの廃屋ではないと分かる。\n' +
      '青鬼は生まれたのではなく、作られたのかもしれない。\n\n' +
      '仲間の姿は減り、足音だけが増えていく。\n' +
      '安全地帯だった部屋も、もう信用できない。',
    choices: [
      { id: 'rescueMina', title: 'ミナを救う', desc: '真相に近づくための分岐。', next: 'finalRoute', effects: { party: 1, fear: 10, item: 1, log: 'ミナを救出した。仲間が一人戻った。' } },
      { id: 'takeRecord', title: '実験記録を回収する', desc: 'トゥルーエンド条件に関わる。', next: 'finalRoute', effects: { item: 2, fear: 6, log: '実験記録の断片を入手した。青鬼の起源に近づいた。' } },
    ],
  },
  finalRoute: {
    stage: '終盤',
    location: '地下実験室',
    caption: '狂気の核心',
    title: '実験室で、青鬼の正体が明らかになる',
    text:
      '壁一面の記録。壊された装置。残された文字。\n\n' +
      '「館の秘密を見た者は、逃がさない」\n\n' +
      '最後の鍵を取った瞬間、背後で金属扉が閉じる。\n' +
      'ここから先は、ほとんど逃走だけが全てだ。',
    choices: [
      { id: 'grabKey', title: '最終鍵を奪う', desc: '超ロング追跡を開始する。', next: 'escapeChase', effects: { item: 1, fear: 18, log: '最終鍵を入手。館全体が警戒状態に入った。' } },
      { id: 'readAll', title: '記録を全て読む', desc: 'トゥルーエンドの条件を満たす。', next: 'escapeChase', effects: { item: 2, fear: 8, log: '青鬼誕生の経緯を把握した。仲間を救う方法が見えた。' } },
    ],
  },
  escapeChase: {
    stage: '終盤',
    location: '脱出口',
    caption: '最後の追跡',
    title: 'もう隠れられない。走り切るしかない',
    text:
      '廊下の先に出口が見える。だが、青鬼はすぐ後ろだ。\n\n' +
      '一瞬の判断でルートを選び、最後まで走り抜けろ。\n' +
      'ここでの選択が、結末を決める。',
    choices: [
      { id: 'sacrifice', title: '仲間を置いて一人で逃げる', desc: 'バッドエンドに向かう。', next: 'ending', effects: { fear: 20, party: -2, ending: 'bad', log: '誰かを見捨ててでも、生き延びる道を選んだ。' } },
      { id: 'escape', title: '全員で出口を目指す', desc: '条件次第でノーマルかトゥルーに分岐する。', next: 'ending', effects: { fear: 14, ending: 'auto', log: '全員で脱出口へ走り出した。' } },
    ],
  },
  ending: {
    stage: 'エンディング',
    location: '脱出後',
    caption: '結末',
    title: '',
    text: '',
    choices: [
      { id: 'restartEnding', title: 'もう一度遊ぶ', desc: '別の分岐や結末を確認する。', next: 'intro', effects: { restart: true } },
    ],
  },
};

const state = {
  sceneId: 'intro',
  fear: 0,
  itemCount: 0,
  partyCount: 3,
  flags: {
    hasTruePath: false,
  },
  log: [],
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
}

function applyEffects(effects = {}) {
  if (typeof effects.fear === 'number') {
    state.fear = clamp(state.fear + effects.fear, 0, 100);
  }

  if (typeof effects.item === 'number') {
    state.itemCount += effects.item;
    if (state.itemCount >= 4) {
      state.flags.hasTruePath = true;
    }
  }

  if (typeof effects.party === 'number') {
    state.partyCount = clamp(state.partyCount + effects.party, 0, 3);
  }

  if (effects.log) {
    addLog(effects.log);
  }

  if (effects.ending === 'bad') {
    state.flags.endingType = 'bad';
  }

  if (effects.ending === 'auto') {
    state.flags.endingType = state.flags.hasTruePath && state.partyCount === 3 ? 'true' : 'normal';
  }
}

function getProgressLabel(stage) {
  if (stage === '序盤') return '序盤';
  if (stage === '中盤') return '中盤';
  if (stage === '終盤') return '終盤';
  return 'エンディング';
}

function updateStats() {
  progressLabel.textContent = getProgressLabel(scenes[state.sceneId].stage);
  partyLabel.textContent = `${state.partyCount}人`;
  itemLabel.textContent = `${state.itemCount}`;
  fearLabel.textContent = `${state.fear}%`;
}

function renderLog() {
  logList.innerHTML = '';

  if (state.log.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'まだ記録はない。';
    logList.appendChild(empty);
    return;
  }

  for (const entry of state.log) {
    const item = document.createElement('li');
    item.textContent = entry;
    logList.appendChild(item);
  }
}

function resolveEnding() {
  if (state.flags.endingType === 'bad') {
    return {
      title: 'バッドエンド: 見捨てた代償',
      text:
        'あなたは一人だけ脱出した。\n\n' +
        'しかし、館の中に残したものは大きすぎた。\n' +
        '背中の冷たさは、しばらく消えない。',
      caption: 'BAD END',
    };
  }

  if (state.flags.hasTruePath && state.partyCount === 3) {
    return {
      title: 'トゥルーエンド: 呪いを断つ',
      text:
        '全ての記録と仲間を手にしたあなたたちは、青鬼の呪いを断ち切った。\n\n' +
        '館は静まり、朝日が差し込む。\n' +
        '誰も欠けない結末だけが、ここに残った。',
      caption: 'TRUE END',
    };
  }

  return {
    title: 'ノーマルエンド: 館は残る',
    text:
      '主人公は脱出に成功した。だが、真相には届かなかった。\n\n' +
      '館はそのまま残り、次の犠牲者を待ち続ける。\n' +
      'この夜は終わったが、恐怖は終わっていない。',
    caption: 'NORMAL END',
  };
}

function renderScene() {
  const scene = scenes[state.sceneId];

  if (state.sceneId === 'ending') {
    const ending = resolveEnding();
    sceneCaption.textContent = ending.caption;
    sceneTitle.textContent = ending.title;
    sceneText.textContent = ending.text;
    sceneStage.textContent = 'エンディング';
    sceneLocation.textContent = '脱出後';
    choicePanel.innerHTML = '';
    sceneCardShake(false);
    renderEndingChoices(scene.choices);
    updateStats();
    renderLog();
    return;
  }

  sceneCaption.textContent = scene.caption;
  sceneTitle.textContent = scene.title;
  sceneText.textContent = scene.text;
  sceneStage.textContent = scene.stage;
  sceneLocation.textContent = scene.location;
  renderChoices(scene.choices);
  updateStats();
  renderLog();
}

function renderChoices(choices) {
  choicePanel.innerHTML = '';

  choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-button';
    button.innerHTML = `
      <span class="choice-title">${choice.title}</span>
      <span class="choice-desc">${choice.desc}</span>
    `;

    button.addEventListener('click', () => handleChoice(choice));
    choicePanel.appendChild(button);
  });
}

function renderEndingChoices(choices) {
  choicePanel.innerHTML = '';

  choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-button';
    button.innerHTML = `
      <span class="choice-title">${choice.title}</span>
      <span class="choice-desc">${choice.desc}</span>
    `;
    button.addEventListener('click', () => resetGame());
    choicePanel.appendChild(button);
  });
}

function sceneCardShake(active) {
  const panel = document.querySelector('.scene-card');
  if (!panel) return;
  panel.classList.toggle('shake', active);
}

function handleChoice(choice) {
  applyEffects(choice.effects);
  sceneCardShake(true);

  window.setTimeout(() => {
    sceneCardShake(false);
    if (choice.next === 'ending') {
      state.sceneId = 'ending';
    } else {
      state.sceneId = choice.next;
    }

    if (choice.id === 'readAll') {
      state.flags.hasTruePath = true;
    }

    if (state.sceneId === 'escapeChase' && state.flags.hasTruePath) {
      addLog('真相を知ったことで、最後の選択が変わり始めた。');
    }

    if (state.sceneId === 'ending') {
      const ending = resolveEnding();
      if (choice.effects && choice.effects.ending === 'bad') {
        state.flags.endingType = 'bad';
      } else if (!state.flags.endingType) {
        state.flags.endingType = ending.caption === 'TRUE END' ? 'true' : 'normal';
      }
    }

    renderScene();
  }, 220);
}

function resetGame() {
  state.sceneId = 'intro';
  state.fear = 0;
  state.itemCount = 0;
  state.partyCount = 3;
  state.flags = {
    hasTruePath: false,
    endingType: null,
  };
  state.log = ['館の扉が、静かに閉まった。'];
  renderScene();
}

restartButton.addEventListener('click', resetGame);

resetGame();