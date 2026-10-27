
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
