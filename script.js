
const canvas = document.querySelector("#stars");
const ctx = canvas.getContext("2d");
const heartArtwork = new Image();
const heartArtworkCanvas = document.createElement("canvas");
const heartArtworkContext = heartArtworkCanvas.getContext("2d", { willReadFrequently: true });
let heartArtworkReady = false;

heartArtwork.onload = () => {
  const sourceScale = heartArtwork.naturalWidth / 1024;
  const crop = { x: 240 * sourceScale, y: 65 * sourceScale, width: 550, height: 890 };
  heartArtworkCanvas.width = crop.width;
  heartArtworkCanvas.height = crop.height;
  heartArtworkContext.drawImage(
    heartArtwork,
    crop.x, crop.y, crop.width * sourceScale, crop.height * sourceScale,
    0, 0, crop.width, crop.height
  );

  const pixels = heartArtworkContext.getImageData(0, 0, crop.width, crop.height);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const luminance = pixels.data[index] * 0.299 + pixels.data[index + 1] * 0.587 + pixels.data[index + 2] * 0.114;
    pixels.data[index] = 245;
    pixels.data[index + 1] = 226;
    pixels.data[index + 2] = 231;
    pixels.data[index + 3] = Math.max(0, Math.min(255, (220 - luminance) * 1.8));
  }
  heartArtworkContext.putImageData(pixels, 0, 0);
  heartArtworkReady = true;
};
heartArtwork.src = "assets/heart-vintage-source.webp";

let stars = [];
let bars = [];
let width = 0;
let height = 0;
let animationFrame;
let musicIsPlaying = false;
let musicPlaybackTime = 0;
const musicTempo = 85;
const pointer = { x: 0, y: 0 };
const pointerTarget = { x: 0, y: 0 };
let beatClock = 0;

function updatePointerPosition(x, y) {
  pointerTarget.x = x;
  pointerTarget.y = y;
  document.body.style.setProperty("--pointer-x", `${(x / Math.max(width, 1)) * 100}%`);
  document.body.style.setProperty("--pointer-y", `${(y / Math.max(height, 1)) * 100}%`);
}

window.addEventListener("pointermove", (event) => {
  updatePointerPosition(event.clientX, event.clientY);
});

window.addEventListener("pointerleave", () => {
  updatePointerPosition(window.innerWidth * 0.5, window.innerHeight * 0.5);
});

function createStars() {
  width = window.innerWidth;
  height = window.innerHeight;
  pointer.x = width * 0.5;
  pointer.y = height * 0.5;
  pointerTarget.x = width * 0.5;
  pointerTarget.y = height * 0.5;
  updatePointerPosition(pointer.x, pointer.y);

  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(42, Math.floor(width / 28));
  stars = Array.from({ length: count }, (_, index) => ({
    x: (index / Math.max(count - 1, 1)) * width,
    y: height * 0.5,
    amplitude: Math.random() * 90 + 20,
    base: Math.random() * 0.8 + 0.4,
    speed: Math.random() * 0.03 + 0.012,
    phase: Math.random() * Math.PI * 2
  }));

  bars = Array.from({ length: count }, (_, index) => ({
    offset: index,
    amplitude: Math.random() * 0.8 + 0.4,
    speed: Math.random() * 0.08 + 0.05,
    phase: Math.random() * Math.PI * 2,
    width: Math.max(2, width / count * 0.8)
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);

  pointer.x += (pointerTarget.x - pointer.x) * 0.08;
  pointer.y += (pointerTarget.y - pointer.y) * 0.08;

  beatClock += 0.016;
  const pulse = (Math.sin(beatClock * 3.4) + 1) / 2;
  const heartbeat = Math.max(0, Math.sin(beatClock * 2.2));
  const primaryBeat = Math.max(0, Math.sin(beatClock * 2.2 * Math.PI));
  const heartThump = musicIsPlaying ? beatPulseFromMusic() : Math.max(0, Math.sin(beatClock * 1.8));
  const pointerMotionX = (pointer.x - width / 2) / Math.max(width, 1);
  const pointerMotionY = (pointer.y - height / 2) / Math.max(height, 1);

  const blackout = ctx.createLinearGradient(0, 0, width, height);
  blackout.addColorStop(0, "#020407");
  blackout.addColorStop(0.5, "#090a11");
  blackout.addColorStop(1, "#010204");
  ctx.fillStyle = blackout;
  ctx.fillRect(0, 0, width, height);

  const aura = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    0,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.9
  );
  aura.addColorStop(0, `rgba(185, 64, 108, ${0.1 + heartThump * 0.38 + Math.abs(pointerMotionX) * 0.18})`);
  aura.addColorStop(0.25, "rgba(118, 44, 89, 0.18)");
  aura.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, width, height);

  for (let index = 0; index < bars.length; index += 1) {
    const bar = bars[index];
    const x = (index / Math.max(bars.length - 1, 1)) * width;
    const pulseWave = Math.sin(beatClock * 4 + index * 0.6 + bar.phase) * (18 + bar.amplitude * 55);
    const lineLift = (heartThump + pulse * 0.8) * 90 + (primaryBeat * 30);
    const y = height * 0.5;

    ctx.beginPath();
    for (let step = 0; step <= 18; step += 1) {
      const px = x + ((step - 9) * 16) * (1 + pointerMotionX * 0.4);
      const py = y + Math.sin(step * 0.9 + beatClock * 3.8 + bar.phase) * (lineLift * (0.14 + bar.amplitude * 0.35)) + pulseWave * 0.2;
      if (step === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }

    const alpha = 0.16 + heartThump * 0.7 + pulse * 0.2;
    const red = 120 + Math.round(heartThump * 80);
    const green = 80 + Math.round(heartThump * 35);
    const blue = 130 + Math.round(heartThump * 60);
    ctx.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    ctx.lineWidth = 1 + heartThump * 1.7 + pulse * 0.6;
    ctx.stroke();
  }

  if (heartArtworkReady) {
    const centerX = width * 0.5;
    const centerY = height * 0.52;
    const imageHeight = Math.min(height * 0.82, width * 1.52, 690);
    const imageWidth = imageHeight * (heartArtworkCanvas.width / heartArtworkCanvas.height);
    const pulseScale = 1 + heartThump * 0.025;

    ctx.save();
    ctx.translate(centerX + pointerMotionX * 5, centerY + pointerMotionY * 4);
    ctx.scale(pulseScale, pulseScale);
    ctx.globalAlpha = 0.78 + heartThump * 0.18;
    ctx.drawImage(heartArtworkCanvas, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
    ctx.restore();
  }

  for (const star of stars) {
    star.phase += star.speed * (1 + heartThump * 3.5);
    const wave = Math.sin(star.phase + beatClock * 4) * star.amplitude;
    const driftX = pointerMotionX * 22;
    const driftY = pointerMotionY * 18;
    star.x += Math.cos(star.phase) * 0.18 + driftX * 0.06;
    star.y = height * 0.52 + wave * 0.7 + driftY * 1.6;

    if (star.x < -30) star.x = width + 30;
    if (star.x > width + 30) star.x = -30;

    const opacity = 0.12 + heartThump * 0.8 + star.base * 0.2;
    ctx.beginPath();
    ctx.arc(star.x, star.y, 1.2 + heartThump * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
  }

  if (heartThump > 0.58) {
    ctx.fillStyle = `rgba(255, 140, 190, ${0.08 + heartThump * 0.18})`;
    ctx.fillRect(0, 0, width, height);
  }

  animationFrame = requestAnimationFrame(drawStars);
}

createStars();
drawStars();

window.addEventListener("resize", createStars);

const musicFrame = document.querySelector("#music-iframe");
const musicError = document.querySelector("#music-error");
const musicPlayerFrame = document.querySelector(".music-player");
const musicStatus = document.querySelector("#music-status");

if (musicFrame) {
  const musicUrl = new URL(musicFrame.src);
  if (window.location.origin !== "null") {
    musicUrl.searchParams.set("origin", window.location.origin);
  }
  musicFrame.src = musicUrl.toString();

  window.onYouTubeIframeAPIReady = () => {
    const player = new window.YT.Player(musicFrame, {
      events: {
        onStateChange: (event) => {
          musicIsPlaying = event.data === 1;
          document.body.classList.toggle("music-is-playing", musicIsPlaying);
          musicPlayerFrame.classList.toggle("is-playing", musicIsPlaying);
          musicStatus.textContent = musicIsPlaying
            ? "TOCANDO"
            : event.data === 2
              ? "PAUSADA"
              : "PRONTA";

          if (musicIsPlaying) {
            musicPlaybackTime = player.getCurrentTime();
          }
        },
        onError: () => {
          musicIsPlaying = false;
          document.body.classList.remove("music-is-playing");
          musicPlayerFrame.classList.remove("is-playing");
          musicStatus.textContent = "INDISPONÍVEL";
          musicError.hidden = false;
          musicPlayerFrame.classList.add("has-error");
        }
      }
    });

    window.setInterval(() => {
      if (musicIsPlaying) {
        musicPlaybackTime = player.getCurrentTime();
      }
    }, 120);
  };

  const youtubeApi = document.createElement("script");
  youtubeApi.src = "https://www.youtube.com/iframe_api";
  document.head.append(youtubeApi);
}

function beatPulseFromMusic() {
  const beatPosition = (musicPlaybackTime * musicTempo) / 60;
  const phase = (beatPosition % 1 + 1) % 1;
  const envelope = 1 - Math.abs(phase * 2 - 1);
  return musicIsPlaying ? Math.max(0.1, Math.pow(envelope, 2) * 1.2) : 0.12;
}

const memories = [
  {
    title: "Onde nossos caminhos se cruzaram",
    text: "Foi no silêncio de um momento simples que a vida nos mostrou que algumas pessoas chegam para mudar a direção de tudo. E, desde então, cada passo parece ter sido desenhado para nos levar um ao outro."
  },
  {
    title: "O começo de tudo",
    text: "Nem sempre o início parece enorme quando acontece. Mas há encontros que crescem dentro da gente devagar, até se tornarem a parte mais bonita da nossa história."
  },
  {
    title: "Uma lembrança só nossa",
    text: "Há momentos que não precisam de muitas palavras para se tornar inesquecíveis: a conversa, o riso, o jeito de se olhar e a sensação de que era natural estar junto. Esses são os meus favoritos."
  },
  {
    title: "O que eu admiro em você",
    text: "Eu admiro o jeito como você vive com gentileza, a força que você carrega mesmo nos seus dias mais cansados e a luz que você consegue espalhar sem nem perceber. Você é bonita de um jeito que toca a alma."
  },
  {
    title: "Os nossos laços",
    text: "O que nos une não é só o tempo, mas também o cuidado, a confiança e a vontade de construir algo verdadeiro juntos. São pequenos gestos que se transformam em um universo inteiro."
  },
  {
    title: "Aquilo que o tempo não apaga",
    text: "Se o tempo mudar os detalhes, que ele nunca apague o carinho, a vontade de estar perto e a certeza de que esse amor foi valioso desde o começo."
  },
  {
    title: "O universo que ainda virá",
    text: "E mesmo com todo o que já vivemos, ainda há um futuro bonito esperando por nós: sonhos, risadas, novas histórias e a certeza de que o melhor da jornada ainda está sendo escrito."
  }
];

const memoryButtons = document.querySelectorAll("[data-memory]");
const memoryTitle = document.querySelector("#memory-title");
const memoryText = document.querySelector("#memory-text");
const memoryCard = document.querySelector("#memory-card");

const midnightCountdown = document.querySelector("#midnight-countdown");
const countdownHours = document.querySelector("#countdown-hours");
const countdownMinutes = document.querySelector("#countdown-minutes");
const countdownSeconds = document.querySelector("#countdown-seconds");
const countdownMessage = document.querySelector("#countdown-message");
const surpriseBox = document.querySelector("#surprise-box");
const birthdayBurst = document.querySelector("#birthday-burst");
let birthdaySurpriseOpened = false;

function getNextMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next;
}

const countdownTarget = getNextMidnight();

function launchBirthdayConfetti() {
  if (!birthdayBurst) return;

  const colors = ["#ffe27a", "#ff82b4", "#9ee7ff", "#bfa3ff", "#9ff0c0", "#fff4f8"];
  const kinds = ["is-square", "is-circle", "is-ribbon", "is-star"];

  for (let index = 0; index < 56; index += 1) {
    const angle = (Math.PI * 2 * index) / 56 + (Math.random() - 0.5) * 0.22;
    const distance = 90 + Math.random() * 180;
    const particle = document.createElement("span");
    particle.className = `birthday-confetti ${kinds[index % kinds.length]}`;
    particle.style.setProperty("--particle-color", colors[index % colors.length]);
    particle.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--burst-y", `${Math.sin(angle) * distance - 55}px`);
    particle.style.setProperty("--particle-spin", `${360 + Math.random() * 720}deg`);
    particle.style.setProperty("--particle-delay", `${Math.random() * 0.16}s`);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
    birthdayBurst.append(particle);
  }
}

function updateCountdown() {
  if (!midnightCountdown || !countdownHours || !countdownMinutes || !countdownSeconds || !countdownMessage || !surpriseBox) {
    return;
  }

  const now = new Date();
  const difference = countdownTarget.getTime() - now.getTime();

  if (difference <= 0) {
    countdownHours.textContent = "00";
    countdownMinutes.textContent = "00";
    countdownSeconds.textContent = "00";
    countdownMessage.textContent = "A meia-noite chegou. Abra sua surpresa!";
    surpriseBox.hidden = false;
    if (!birthdaySurpriseOpened) {
      birthdaySurpriseOpened = true;
      requestAnimationFrame(() => surpriseBox.classList.add("is-open"));
      launchBirthdayConfetti();
    }
    midnightCountdown.style.opacity = "0.9";
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownHours.textContent = String(hours).padStart(2, "0");
  countdownMinutes.textContent = String(minutes).padStart(2, "0");
  countdownSeconds.textContent = String(seconds).padStart(2, "0");
  countdownMessage.textContent = "Faltam alguns instantes para a surpresa.";
  surpriseBox.hidden = true;
}

if (midnightCountdown) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

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
      const active = item === button;
      item.setAttribute("aria-pressed", String(active));
      item.classList.toggle("is-active", active);
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

    document.querySelectorAll("[data-celestial]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
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
      title: "O nome que ficou",
      shortTitle: "Identidade",
      narrative: "Comece pelo básico: o arquivo repete a mesma pessoa em vários lugares. Encontre o nome que aparece em todos os registros.",
      evidence: [
        "A assinatura do poema.",
        "A carta final.",
        "A dedicatória do site."
      ],
      prompt: "Qual nome aparece nos três registros?",
      answer: "GIOVANNA",
      clues: [
        "Compare os textos que parecem ser dedicados a alguém.",
        "É o nome que aparece no poema, na carta e no rodapé.",
        "É um nome de pessoa, sempre escrito em maiúsculas."
      ]
    },
    {
      title: "A mensagem dos astros",
      shortTitle: "Sol e Lua",
      narrative: "Agora use a resposta anterior para entender o que os astros estão dizendo. O Sol avança e a Lua desfaz o caminho.",
      evidence: [
        "Mensagem registrada: RJRTWNF.",
        "O Sol move para frente e a Lua volta.",
        "A chave usa o alfabeto com A=1 e Z=26."
      ],
      prompt: "Qual palavra aparece quando a mensagem volta ao início?",
      answer: "MEMORIA",
      clues: [
        "Use o nome da missão anterior como chave.",
        "Some os valores das letras e reduza pelo ciclo de 26.",
        "O resultado final é uma palavra de sete letras."
      ]
    },
    {
      title: "A data escondida",
      shortTitle: "Cronologia",
      narrative: "A palavra da missão anterior identifica o envelope certo. A partir dele, a data aparece em uma ordem que parece invertida.",
      evidence: [
        "Envelope MEMORIA com 07/17.",
        "Envelope DESTINO com 12/24.",
        "No Brasil, o dia vem antes do mês."
      ],
      prompt: "Qual é a data correta em formato dia-mês, sem barra?",
      answer: "1707",
      clues: [
        "A ordem do registro está trocada.",
        "17 não pode ser mês.",
        "Coloque primeiro o dia e depois o mês."
      ]
    },
    {
      title: "A palavra no poema",
      shortTitle: "Poema-index",
      narrative: "A data vira leitura. Os números diferentes de zero levam a palavras no poema, e as iniciais revelam o próximo nome.",
      evidence: [],
      prompt: "Usando 1707, encontre a inicial da palavra certa em cada verso.",
      answer: "LUA",
      kind: "poem",
      clues: [
        "Use a ordem dos versos.",
        "Zero não conta.",
        "Pegue a inicial da palavra indicada em cada verso."
      ]
    },
    {
      title: "A cifra certa",
      shortTitle: "Criptografia",
      narrative: "A palavra do poema vira a chave. A cifra precisa ser decifrada com essa chave para revelar a próxima resposta.",
      evidence: [
        "Texto cifrado: WUCZM.",
        "Use a chave repetida até cobrir todas as letras.",
        "A=0, B=1... Z=25."
      ],
      prompt: "Qual palavra aparece ao decifrar a mensagem?",
      answer: "LACOS",
      clues: [
        "A chave tem 3 letras.",
        "Repita a chave ao longo do texto.",
        "Subtraia a chave de cada letra e volte ao início do alfabeto."
      ]
    },
    {
      title: "O selo final",
      shortTitle: "Fechamento",
      narrative: "Reúna as respostas das missões anteriores na ordem certa para abrir a carta final.",
      evidence: [
        "Separe tudo com espaço.",
        "Use as respostas corretas, sem títulos."
      ],
      prompt: "Digite o selo final para abrir a carta secreta.",
      answer: "GIOVANNA MEMORIA 1707 LUA LACOS",
      clues: [
        "É a ordem das missões anteriores.",
        "Tem quatro palavras e uma sequência numérica.",
        "Use: nome, memória, data, poema e cifra."
      ]
    }
  ];

  const poemLines = [
    "Longe, cada silêncio guarda o que importa.",
    "Teu silêncio também guarda uma luz única.",
    "E mesmo longe, o coração aprende a esperar."
  ];

  const fragments = [
    { id: "name", text: "A identidade confirmada inaugura o arquivo; este é o primeiro registro da linha do tempo." },
    { id: "stars", text: "Brilho e silêncio foram comparados. Este testemunho vem logo depois do nome que começou a história." },
    { id: "date", text: "O calendário aparece em seguida, antes da leitura que transforma a data em uma palavra do céu." },
    { id: "poem", text: "A leitura por índices revela a palavra celeste. Este fragmento vem logo depois do registro do calendário." },
    { id: "cipher", text: "Com essa palavra como chave, a cifra mostra o vínculo escondido. Este trecho vem imediatamente depois do poema." },
    { id: "bonds", text: "Os laços reúnem tudo o que veio antes. Este fragmento segue a cifra e prepara o encerramento." },
    { id: "future", text: "Só então as sete estrelas apontam para o fechamento; este é o último fragmento, depois dos laços." }
  ];
  const scrambledFragmentIds = ["date", "bonds", "name", "cipher", "future", "stars", "poem"];
  const completedOutputs = ["GIOVANNA", "MEMORIA", "1707", "LUA", "LACOS", "GIOVANNA MEMORIA 1707 LUA LACOS"];

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
    restartButton: root.querySelector("#mystery-restart-button"),
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
      button.setAttribute("aria-pressed", String(state.selectedMission === index));
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

    const visibleClues = missions[index].clues.slice(0, Math.max(1, level + 1));
    visibleClues.forEach((clue, clueIndex) => {
      const isFeatured = clueIndex === 0;
      appendText(elements.hintList, "p", `${isFeatured ? "Dica rápida" : `Pista ${clueIndex + 1}`}: ${clue}`, isFeatured ? "mystery-clue mystery-clue-featured" : "mystery-clue");
    });

    elements.hintButton.disabled = level >= missions[index].clues.length || state.completed.includes(index);
    elements.hintButton.textContent = state.completed.includes(index)
      ? "Missão concluída"
      : level >= missions[index].clues.length
        ? "Dicas esgotadas"
      : `Mostrar dica (${Math.min(level + 1, missions[index].clues.length)}/3)`;
  }

  function resetMysteryProgress() {
    state.completed = [];
    state.selectedMission = 0;
    state.notes = "";
    state.clues = {};
    consultedWitnesses.clear();
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    saveProgress();
    renderProgress();
    renderNotebook();
    renderMission();
    setFeedback("Arquivo reiniciado. Você pode começar do início novamente.", "notice");
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
    elements.answer.placeholder = index === missions.length - 1
      ? "Ex.: GIOVANNA MEMORIA 1707 LUA LACOS"
      : "Digite a resposta da missão";
    elements.submit.textContent = mission.kind === "fragments" ? "Conferir a sequência" : "Confirmar resposta";
    elements.answer.disabled = completed || mission.kind === "fragments";
    elements.submit.disabled = completed;
    renderEvidence(mission);
    renderHints(index);

    const brief = document.createElement("div");
    brief.className = "mystery-brief";
    brief.innerHTML = `
      <span class="mystery-brief-label">Objetivo</span>
      <strong>${mission.shortTitle}</strong>
      <small>${mission.narrative.length > 90 ? mission.narrative.slice(0, 90) + "..." : mission.narrative}</small>
    `;
    elements.workspace.prepend(brief);

    if (!mission.kind && !completed) {
      requestAnimationFrame(() => elements.answer.focus());
    }

    if (mission.kind === "fragments") {
      appendText(elements.workspace, "p", "Atribua uma posição a cada fragmento. As sete posições devem ser usadas uma única vez.", "mystery-workspace-note");
    } else if (index === missions.length - 1) {
      appendText(elements.workspace, "p", "Reúna as respostas registradas no caderno, na ordem das missões. Separe os resultados por espaços.", "mystery-workspace-note");
    }

    elements.witnessStatus.textContent = `Testemunhos consultados: ${consultedWitnesses.size}/2`;
    if (completed) {
      setFeedback("Esta missão já está registrada no caderno. Você pode revisitar suas pistas e provas.", "success");
    } else {
      setFeedback("Siga a ordem do mistério e use as pistas dos registros para responder.");
    }
    elements.secretLetter.hidden = !state.completed.includes(missions.length - 1);
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

    if (index > state.completed.length) {
      setFeedback(`Complete a missão anterior antes de responder esta etapa. A sequência do arquivo é importante.`, "notice");
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
    setFeedback(`Dica ${Math.min(level + 1, missions[index].clues.length)} revelada. Use-a junto às provas do arquivo.`);
  });

  elements.restartButton.addEventListener("click", () => {
    const shouldReset = window.confirm("Reiniciar o Arquivo das Sete Estrelas? Todo o progresso será apagado.");
    if (!shouldReset) return;
    resetMysteryProgress();
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
