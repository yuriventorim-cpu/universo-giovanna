
const canvas = document.querySelector("#stars");
const ctx = canvas.getContext("2d");

let stars = [];
let width = 0;
let height = 0;
let animationFrame;

function createStars() {
  width = window.innerWidth;
  height = window.innerHeight;

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(150, Math.floor(width * height / 6500));

  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.3 + 0.2,
    alpha: Math.random() * 0.6 + 0.2,
    speed: Math.random() * 0.008 + 0.002,
    phase: Math.random() * Math.PI * 2
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  for (const star of stars) {
    star.phase += star.speed;
    const opacity = star.alpha *
      (0.65 + 0.35 * Math.sin(star.phase));

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(224, 211, 255, ${opacity})`;
    ctx.fill();
  }

  animationFrame = requestAnimationFrame(drawStars);
}

createStars();
drawStars();

window.addEventListener("resize", createStars);

// EDITE ESTES TEXTOS PARA CONTAR A HISTÓRIA DE VOCÊS.
const memories = [
  {
    title: "Onde nossos caminhos se cruzaram",
    text: "Foi em um ensaio da igreja para a Festa Junina que nossos caminhos se encontraram. Aqui começa uma história que merece ser contada por nós."
  },
  {
    title: "O começo de tudo",
    text: "Alguns começos parecem pequenos enquanto acontecem. Só depois percebemos o tamanho que ganharam dentro da gente."
  },
  {
    title: "Uma lembrança só nossa",
    text: "Substitua este texto por uma lembrança de vocês: um passeio, uma conversa, uma risada ou um instante que você gostaria de reviver."
  },
  {
    title: "O que eu admiro em você",
    text: "Escreva aqui o que você admira na Giovanna, com palavras suas e detalhes que só você conhece."
  },
  {
    title: "Os nossos laços",
    text: "Há coisas que não cabem em fotografias. São os significados, os gestos e as palavras que tornam uma história única."
  },
  {
    title: "Aquilo que o tempo não apaga",
    text: "Se algumas lembranças mudarem com o tempo, que o carinho com que foram vividas continue tendo seu lugar."
  },
  {
    title: "O universo que ainda virá",
    text: "Que o novo ciclo traga descobertas, sonhos, alegria e muitas histórias bonitas para escrever."
  }
];

const memoryButtons = document.querySelectorAll("[data-memory]");
const memoryTitle = document.querySelector("#memory-title");
const memoryText = document.querySelector("#memory-text");
const memoryCard = document.querySelector("#memory-card");

memoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.memory);
    const memory = memories[index];

    if (!memory) return;

    memoryTitle.textContent = memory.title;
    memoryText.textContent = memory.text;

    memoryCard.animate(
      [
        { opacity: 0.35, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 450, easing: "ease-out" }
    );

    memoryButtons.forEach((item) => {
      item.setAttribute(
        "aria-pressed",
        String(item === button)
      );
    });
  });
});

// MENSAGENS DO SOL E DA LUA
const celestialMessages = {
  sun: "Você trouxe luz para capítulos da minha história que eu ainda estava aprendendo a compreender. Que nunca faltem motivos para você brilhar por si mesma.",
  moon: "Gosto de pensar que até as noites mais silenciosas guardam alguma luz. Que você encontre beleza nos seus caminhos e carinho nas suas lembranças."
};

const celestialMessage = document.querySelector("#celestial-message");

document.querySelectorAll("[data-celestial]").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.celestial;
    celestialMessage.textContent = celestialMessages[type];
  });
});

// REVELAÇÃO DA CARTA FINAL
const openLetterButton = document.querySelector("#open-letter");
const letter = document.querySelector("#letter");

openLetterButton.addEventListener("click", () => {
  const isHidden = letter.hidden;

  letter.hidden = !isHidden;
  openLetterButton.textContent = isHidden
    ? "Fechar minha carta ↑"
    : "Abrir minha carta ✧";

  if (isHidden) {
    letter.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches ? "auto" : "smooth",
      block: "center"
    });
  }
});

// Pausa a animação quando a página não está visível.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else {
    cancelAnimationFrame(animationFrame);
    drawStars();
  }
});

(() => {
  const root = document.querySelector("#mystery-root");
  if (!root) return;

  const storageKey = "universo-giovanna:arquivo-sete-estrelas:v1";
  const missions = [
    {
      title: "O nome que permaneceu",
      shortTitle: "Identidade",
      narrative: "Três registros sobreviveram à fragmentação. Compare onde cada um foi escrito e identifique quem ocupa o centro deste arquivo.",
      evidence: [
        "A assinatura do poema, no capítulo das palavras.",
        "O endereçamento da carta original, no capítulo final.",
        "A dedicatória que encerra o site, sob o mesmo céu."
      ],
      prompt: "Qual nome aparece como destinatária nos três registros?",
      answer: "GIOVANNA",
      clues: [
        "Não procure uma pessoa nova: compare as dedicatórias já espalhadas pela página.",
        "O poema, a carta e o rodapé apontam para a mesma destinatária.",
        "Use o nome repetido no poema, no endereçamento da carta e na despedida do rodapé."
      ]
    },
    {
      title: "O testemunho dos astros",
      shortTitle: "Sol e Lua",
      narrative: "Os dois astros guardaram a mesma mensagem em sentidos opostos. Consulte os botões originais do Sol e da Lua no capítulo II: a chave da identidade define o avanço; a Lua desfaz o caminho.",
      evidence: [
        "Mensagem registrada: RJRTWNF.",
        "O Sol avança; a Lua retorna. Consulte os dois testemunhos originais antes de responder.",
        "Na chave alfabética deste arquivo, A vale 1 e Z vale 26."
      ],
      prompt: "Qual palavra de sete letras reaparece quando a luz retorna?",
      answer: "MEMORIA",
      clues: [
        "A chave não é uma letra isolada: é o nome descoberto na missão anterior.",
        "Some os valores das letras do nome usando A=1, B=2...; reduza o total pelo ciclo de 26 letras.",
        "GIOVANNA soma 83; o resto da divisão por 26 é 5. Recue cinco posições em cada letra de RJRTWNF."
      ]
    },
    {
      title: "A data fora do lugar",
      shortTitle: "Cronologia",
      narrative: "A palavra recuperada no testemunho anterior funciona como rótulo de catálogo: somente o envelope com esse nome pertence a esta cronologia. O arquivo menciona 17/07 como hipótese para a primeira vez em que Pedro e Giovanna ficaram; a data ainda precisa ser confirmada com Pedro.",
      evidence: [
        "Envelope MEMORIA: folha importada de um campo que registra mês antes do dia, 07/17.",
        "Envelope DESTINO: recorte de outro arquivo, 12/24. A palavra da missão anterior identifica qual envelope investigar.",
        "No calendário brasileiro, o dia vem antes do mês; um mês não pode ser maior que 12."
      ],
      prompt: "Reconstrua a data na ordem dia-mês e digite os quatro algarismos, sem barra.",
      answer: "1707",
      clues: [
        "Não confie na ordem em que os algarismos aparecem no recorte estrangeiro.",
        "Separe dia e mês; confira qual dos dois valores poderia ser um mês válido.",
        "17 não pode ser mês. No formato dia/mês, escreva primeiro 17 e depois 07. A data continua pendente de confirmação."
      ]
    },
    {
      title: "O poema que não se lê",
      shortTitle: "Poema-index",
      narrative: "A data também é uma régua. O zero separa o dia do mês; cada algarismo restante aponta uma palavra, nunca uma letra. As iniciais formam o próximo testemunho.",
      evidence: [],
      prompt: "Use 1707: percorra os algarismos diferentes de zero em ordem, um por verso; conte palavras e recolha a inicial de cada palavra indicada.",
      answer: "LUA",
      kind: "poem",
      clues: [
        "A ordem dos versos importa. Pontuação não conta como palavra.",
        "O zero é apenas a fronteira entre dia e mês; os índices usados são 1, 7 e 7.",
        "Pegue a inicial da 1ª palavra do verso 1, da 7ª palavra do verso 2 e da 7ª palavra do verso 3."
      ]
    },
    {
      title: "A cifra dos esquecidos",
      shortTitle: "Criptografia",
      narrative: "O ruído não foi criado ao acaso. A cifra de Vigenère soma letras como números; agora, a palavra retirada do poema é a chave que desfaz a soma.",
      evidence: [
        "Texto cifrado: WUCZM.",
        "Use a chave descoberta no poema, repetindo-a até cobrir todas as letras.",
        "A=0, B=1... Z=25. Para decifrar, subtraia o valor da chave e volte ao início do alfabeto quando necessário."
      ],
      prompt: "Qual palavra retorna quando a chave é aplicada ao texto cifrado?",
      answer: "LACOS",
      clues: [
        "A palavra-chave tem três letras e foi extraída do poema.",
        "Repita a chave até ela ter o mesmo tamanho de WUCZM; cada posição opera separadamente.",
        "Com LUA repetida (LUALU), calcule para cada posição: (cifra - chave + 26) mod 26."
      ]
    },
    {
      title: "As memórias fragmentadas",
      shortTitle: "Fragmentos",
      narrative: "Sete trechos sobreviveram fora de ordem. Cada um menciona a prova que o precede ou a consequência que o sucede. Reconstrua a cadeia causal; as iniciais da ordem correta formam a mensagem intermediária.",
      evidence: [],
      prompt: "Atribua uma posição única a cada fragmento. O primeiro não depende de outro registro; o último aponta para uma página ainda fechada.",
      answer: "ABRACOS",
      kind: "fragments",
      clues: [
        "Procure dependências: identidade, testemunho, data, poema, cifra, laços e a página final.",
        "Cada trecho usa ou descreve o resultado de uma etapa anterior. O que aponta para a página ainda fechada só pode vir por último.",
        "A cadeia é: identidade → astros → data → poema → cifra → laços → página final. Leia a inicial do primeiro termo de cada trecho nessa ordem."
      ]
    },
    {
      title: "Aquilo que ficou",
      shortTitle: "O selo final",
      narrative: "O arquivo aceita apenas um selo composto: reúna, na ordem em que foram descobertos, os seis resultados anteriores. A carta permanece fechada até que a sequência inteira seja reconhecida.",
      evidence: [
        "Separe cada resultado com um espaço. Acentos, maiúsculas e pontuação não alteram a leitura.",
        "O selo é local: este site não é um sistema de segurança e seu progresso pode ser alterado no navegador."
      ],
      prompt: "Digite as seis descobertas, na ordem das missões, para abrir a carta secreta.",
      answer: "GIOVANNA MEMORIA 1707 LUA LACOS ABRACOS",
      clues: [
        "O selo contém cinco palavras e uma sequência de quatro algarismos.",
        "Use as respostas das missões 1 a 6, sem incluir os títulos das missões.",
        "A ordem é: nome, testemunho, data, palavra do poema, palavra decifrada e iniciais dos fragmentos. Separe com espaços."
      ]
    }
  ];

  const poemLines = [
    "Longe, cada silêncio guarda o que importa.",
    "Teu silêncio também guarda uma luz única.",
    "E mesmo longe, o coração aprende a esperar."
  ];

  const fragments = [
    { id: "name", text: "A identidade confirmada inaugura o arquivo; nenhum registro vem antes dela." },
    { id: "stars", text: "Brilho e silêncio foram comparados. Este testemunho vem imediatamente depois do registro da identidade." },
    { id: "date", text: "Registro de calendário: fica imediatamente depois do testemunho dos astros e antes da leitura do poema." },
    { id: "poem", text: "A leitura por índices transformou a data em uma palavra celeste. Este registro vem imediatamente depois do calendário." },
    { id: "cipher", text: "Com essa palavra como chave, a cifra mostrou o vínculo. Este registro vem imediatamente depois do poema." },
    { id: "bonds", text: "Os laços reúnem os registros anteriores. Este fragmento vem imediatamente depois da cifra." },
    { id: "future", text: "Só então as sete estrelas indicam a página ainda fechada; este é o último registro, imediatamente depois dos laços." }
  ];
  const scrambledFragmentIds = ["date", "bonds", "name", "cipher", "future", "stars", "poem"];
  const completedOutputs = ["GIOVANNA", "MEMORIA", "1707", "LUA", "LACOS", "ABRACOS"];

  const elements = {
    progress: root.querySelector("#mystery-progress"),
    progressCopy: root.querySelector("#mystery-progress-copy"),
    missionList: root.querySelector("#mystery-mission-list"),
    title: root.querySelector("#mystery-mission-title"),
    narrative: root.querySelector("#mystery-mission-narrative"),
    prompt: root.querySelector("#mystery-mission-prompt"),
    evidence: root.querySelector("#mystery-evidence"),
    workspace: root.querySelector("#mystery-workspace"),
    answerForm: root.querySelector("#mystery-answer-form"),
    answerField: root.querySelector("#mystery-answer-field"),
    answer: root.querySelector("#mystery-answer"),
    submit: root.querySelector("#mystery-submit"),
    hintButton: root.querySelector("#mystery-hint-button"),
    hintList: root.querySelector("#mystery-hint-list"),
    feedback: root.querySelector("#mystery-feedback"),
    notebookToggle: root.querySelector("#mystery-notebook-toggle"),
    notebook: root.querySelector("#mystery-notebook"),
    notebookItems: root.querySelector("#mystery-notebook-items"),
    notes: root.querySelector("#mystery-notes"),
    secretLetter: root.querySelector("#mystery-secret-letter"),
    witnessStatus: root.querySelector("#mystery-witness-status")
  };

  if (Object.values(elements).some((element) => !element)) return;

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      const savedCompleted = Array.isArray(saved.completed)
        ? saved.completed.filter((index) => Number.isInteger(index) && index >= 0 && index < missions.length)
        : [];
      const completed = [];

      for (let index = 0; index < missions.length; index += 1) {
        if (!savedCompleted.includes(index)) break;
        completed.push(index);
      }

      const clues = {};
      for (let index = 0; index < missions.length; index += 1) {
        const level = Number(saved.clues?.[index]);
        clues[index] = Number.isInteger(level) ? Math.min(3, Math.max(0, level)) : 0;
      }

      const nextMission = Math.min(completed.length, missions.length - 1);
      const requestedMission = Number(saved.selectedMission);

      return {
        completed,
        clues,
        notes: typeof saved.notes === "string" ? saved.notes.slice(0, 2000) : "",
        selectedMission: Number.isInteger(requestedMission) && requestedMission <= nextMission
          ? Math.max(0, requestedMission)
          : nextMission
      };
    } catch {
      return { completed: [], clues: {}, notes: "", selectedMission: 0 };
    }
  }

  const state = readProgress();
  const consultedWitnesses = new Set();

  function saveProgress() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      setFeedback("O navegador não permitiu salvar este progresso. A investigação continua nesta página.", "notice");
    }
  }

  function normalizeAnswer(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleUpperCase("pt-BR")
      .replace(/[^A-Z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function setFeedback(message, type = "notice") {
    elements.feedback.textContent = message;
    elements.feedback.dataset.state = type;
  }

  function appendText(parent, tagName, text, className = "") {
    const element = document.createElement(tagName);
    element.textContent = text;
    if (className) element.className = className;
    parent.append(element);
    return element;
  }

  function renderProgress() {
    const count = state.completed.length;
    elements.progress.max = missions.length;
    elements.progress.value = count;
    elements.progressCopy.textContent = `${count} de ${missions.length} missões concluídas`;

    elements.missionList.replaceChildren();
    missions.forEach((mission, index) => {
      const completed = state.completed.includes(index);
      const locked = index > state.completed.length;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mystery-mission";
      button.dataset.mission = String(index);
      button.disabled = locked;
      button.setAttribute("aria-current", state.selectedMission === index ? "step" : "false");
      if (completed) button.classList.add("is-complete");
      if (state.selectedMission === index) button.classList.add("is-selected");

      appendText(button, "span", `0${index + 1}`, "mystery-mission-number");
      appendText(button, "span", mission.shortTitle, "mystery-mission-name");
      appendText(button, "span", completed ? "Concluída" : locked ? "Bloqueada" : "Disponível", "mystery-mission-status");
      elements.missionList.append(button);
    });

    document.querySelectorAll("[data-memory]").forEach((star) => {
      const index = Number(star.dataset.memory);
      star.classList.toggle("is-mystery-complete", state.completed.includes(index));
    });
  }

  function renderEvidence(mission) {
    elements.evidence.replaceChildren();

    if (mission.evidence.length) {
      const list = document.createElement("ul");
      list.className = "mystery-evidence-list";
      mission.evidence.forEach((item) => appendText(list, "li", item));
      elements.evidence.append(list);
    }

    if (mission.kind === "poem") {
      const poem = document.createElement("blockquote");
      poem.className = "mystery-poem";
      poemLines.forEach((line, index) => appendText(poem, "p", `${index + 1}. ${line}`));
      elements.evidence.append(poem);
    }

    if (mission.kind === "fragments") {
      const list = document.createElement("div");
      list.className = "mystery-fragment-list";
      scrambledFragmentIds.forEach((id) => {
        const fragment = fragments.find((item) => item.id === id);
        const label = document.createElement("label");
        label.className = "mystery-fragment";
        appendText(label, "span", fragment.text, "mystery-fragment-text");
        const select = document.createElement("select");
        select.dataset.fragment = fragment.id;
        select.setAttribute("aria-label", `Posição do fragmento: ${fragment.text}`);
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Escolher posição";
        select.append(placeholder);
        for (let position = 1; position <= fragments.length; position += 1) {
          const option = document.createElement("option");
          option.value = String(position);
          option.textContent = `Posição ${position}`;
          select.append(option);
        }
        label.append(select);
        list.append(label);
      });
      elements.evidence.append(list);
    }
  }

  function renderHints(index) {
    const level = state.clues[index] || 0;
    elements.hintList.replaceChildren();
    missions[index].clues.slice(0, level).forEach((clue, clueIndex) => {
      appendText(elements.hintList, "p", `Pista ${clueIndex + 1}: ${clue}`, "mystery-clue");
    });
    elements.hintButton.disabled = level >= missions[index].clues.length || state.completed.includes(index);
    elements.hintButton.textContent = state.completed.includes(index)
      ? "Missão concluída"
      : level >= missions[index].clues.length
        ? "Todas as pistas reveladas"
      : `Revelar próxima pista (${level}/3)`;
  }

  function renderMission() {
    const index = state.selectedMission;
    const mission = missions[index];
    const completed = state.completed.includes(index);

    elements.title.textContent = `Missão 0${index + 1} · ${mission.title}`;
    elements.narrative.textContent = mission.narrative;
    elements.prompt.textContent = mission.prompt;
    elements.workspace.replaceChildren();
    elements.answer.value = "";
    elements.answerField.hidden = mission.kind === "fragments";
    elements.answer.placeholder = index === 6
      ? "Ex.: GIOVANNA MEMORIA 1707 LUA LACOS ABRACOS"
      : "Digite sua resposta";
    elements.submit.textContent = mission.kind === "fragments" ? "Conferir a sequência" : "Confirmar resposta";
    elements.answer.disabled = completed || mission.kind === "fragments";
    elements.submit.disabled = completed;
    renderEvidence(mission);
    renderHints(index);

    if (mission.kind === "fragments") {
      appendText(elements.workspace, "p", "Atribua uma posição a cada fragmento. As sete posições devem ser usadas uma única vez.", "mystery-workspace-note");
    } else if (index === 6) {
      appendText(elements.workspace, "p", "Reúna as respostas registradas no caderno, na ordem das missões. Separe os resultados por espaços.", "mystery-workspace-note");
    }

    elements.witnessStatus.textContent = `Testemunhos consultados: ${consultedWitnesses.size}/2`;
    if (completed) {
      setFeedback("Esta missão já está registrada no caderno. Você pode revisitar suas pistas e provas.", "success");
    } else {
      setFeedback("Investigue os registros e apresente sua conclusão.");
    }
    elements.secretLetter.hidden = !state.completed.includes(6);
  }

  function renderNotebook() {
    elements.notebookItems.replaceChildren();
    if (!state.completed.length) {
      appendText(elements.notebookItems, "li", "Nenhuma descoberta registrada ainda.");
    }

    state.completed.forEach((index) => {
      let note = `Missão 0${index + 1}: ${completedOutputs[index]}`;
      if (index === 2) note += " · data pendente de confirmação";
      if (index === 4) note += " · Vigenère, chave LUA";
      appendText(elements.notebookItems, "li", note);
    });

    if (state.completed.includes(5)) {
      const fragmentOrder = fragments.map((fragment) => fragment.id).join(" → ");
      appendText(elements.notebookItems, "li", `Ordem dos fragmentos: ${fragmentOrder}`);
    }
    elements.notes.value = state.notes;
  }

  function selectMission(index) {
    if (index > state.completed.length || index < 0 || index >= missions.length) return;
    state.selectedMission = index;
    saveProgress();
    renderProgress();
    renderMission();
    setFeedback(`Arquivo aberto: missão 0${index + 1}.`);
  }

  function completeMission(index) {
    state.completed.push(index);
    state.selectedMission = Math.min(index + 1, missions.length - 1);
    saveProgress();
    renderProgress();
    renderNotebook();
    renderMission();

    if (index === missions.length - 1) {
      elements.secretLetter.hidden = false;
      elements.secretLetter.classList.remove("is-revealed");
      void elements.secretLetter.offsetWidth;
      elements.secretLetter.classList.add("is-revealed");
      elements.secretLetter.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center"
      });
      setFeedback("O selo foi reconhecido. A carta secreta de Pedro acaba de ser aberta.", "success");
      return;
    }

    setFeedback(`Registro confirmado. A próxima estrela foi desbloqueada: missão 0${index + 2}.`, "success");
  }

  function checkFragmentOrder() {
    const selections = [...elements.evidence.querySelectorAll("[data-fragment]")];
    const assigned = selections.map((select) => ({
      id: select.dataset.fragment,
      position: Number(select.value)
    }));
    const positions = assigned.map((item) => item.position);

    if (positions.some((position) => !position) || new Set(positions).size !== fragments.length) {
      setFeedback("Cada fragmento precisa de uma posição diferente, de 1 a 7.", "error");
      return;
    }

    const ordered = assigned
      .sort((left, right) => left.position - right.position)
      .map((item) => item.id);
    const expected = fragments.map((fragment) => fragment.id);

    if (ordered.join(",") !== expected.join(",")) {
      setFeedback("Essa sequência ainda deixa uma dependência fora do lugar. Reexamine os registros.", "error");
      return;
    }

    completeMission(state.selectedMission);
  }

  elements.missionList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mission]");
    if (button && elements.missionList.contains(button)) {
      selectMission(Number(button.dataset.mission));
    }
  });

  elements.answerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const index = state.selectedMission;
    const mission = missions[index];
    if (state.completed.includes(index)) return;

    if (mission.kind === "fragments") {
      checkFragmentOrder();
      return;
    }

    if (index === 1 && (consultedWitnesses.size !== 2)) {
      setFeedback("Consulte os dois testemunhos no capítulo do Sol e da Lua antes de concluir.", "notice");
      return;
    }

    if (normalizeAnswer(elements.answer.value) !== normalizeAnswer(mission.answer)) {
      setFeedback("O registro não corresponde. Compare as provas e tente outra leitura.", "error");
      return;
    }

    completeMission(index);
  });

  elements.hintButton.addEventListener("click", () => {
    const index = state.selectedMission;
    const level = state.clues[index] || 0;
    if (level >= missions[index].clues.length || state.completed.includes(index)) return;
    state.clues[index] = level + 1;
    saveProgress();
    renderHints(index);
    setFeedback(`Pista ${level + 1} revelada. Use-a junto às provas do arquivo.`);
  });

  elements.notebookToggle.addEventListener("click", () => {
    const isOpen = elements.notebook.hidden;
    elements.notebook.hidden = !isOpen;
    elements.notebookToggle.setAttribute("aria-expanded", String(isOpen));
    elements.notebookToggle.textContent = isOpen ? "Fechar caderno" : "Consultar caderno";
    if (isOpen) renderNotebook();
  });

  elements.notes.addEventListener("input", () => {
    state.notes = elements.notes.value.slice(0, 2000);
    saveProgress();
  });

  document.querySelectorAll("[data-celestial]").forEach((button) => {
    button.addEventListener("click", () => {
      consultedWitnesses.add(button.dataset.celestial);
      elements.witnessStatus.textContent = `Testemunhos consultados: ${consultedWitnesses.size}/2`;
    });
  });

  document.querySelectorAll("[data-memory]").forEach((star) => {
    star.addEventListener("click", () => {
      const index = Number(star.dataset.memory);
      if (index > state.completed.length) {
        setFeedback("Esta estrela ainda está adormecida. Conclua as missões anteriores para abri-la.", "notice");
        return;
      }
      selectMission(index);
      root.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  renderProgress();
  renderNotebook();
  renderMission();
})();
