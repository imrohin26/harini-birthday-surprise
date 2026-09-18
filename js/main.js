"use strict";

const openingStage = document.querySelector('[data-stage="opening"]');
const interstitialStage = document.querySelector('[data-stage="interstitial"]');
const balloonStage = document.querySelector('[data-stage="balloons"]');
const cakePlaceholderStage = document.querySelector('[data-stage="cake-placeholder"]');
const cakeIntro = document.querySelector("[data-cake-intro]");
const cakeContent = document.querySelector("[data-cake-content]");
const cakeWishes = document.querySelector("[data-cake-wishes]");
const cakePrompt = document.querySelector("[data-cake-prompt]");
const cakeCandles = [...document.querySelectorAll("[data-candle]")];

const cakeWishesList = [
  "Make a wish for yourself.",
  "Make a wish for Rithi.",
  "Make a wish for your loved one.",
];

let currentWish = 0;
const openSurpriseButton = document.querySelector('[data-action="open-surprise"]');
const balloonField = document.querySelector("[data-balloon-field]");
const balloonCelebration = document.querySelector("[data-balloon-celebration]");
const balloonStatus = document.querySelector("[data-balloon-status]");
const balloonHeading = document.querySelector("[data-balloon-heading]");
const balloonInstruction = document.querySelector("[data-balloon-instruction]");
const memoryReveal = document.querySelector("[data-memory-reveal]");
const memoryPhotoWrap = document.querySelector("[data-memory-photo-wrap]");
const memoryPhoto = document.querySelector("[data-memory-photo]");
const memoryTitle = document.querySelector("[data-memory-title]");
const memoryMessage = document.querySelector("[data-memory-message]");

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const balloonTimers = new Set();

const balloons = [
  {
    color: "rose",
    left: "13%",
    top: "29%",
    delay: 100,
    floatDelay: "0ms",
    title: "The little girl you once were...",
    message: "Before all the chapters that brought you here, there was you — full of wonder and dreams.",
    photo: "assets/photos/photo-1-childhood.jpg",
    alt: "Harini as a child",
  },
  {
    color: "gold",
    left: "75%",
    top: "27%",
    delay: 280,
    floatDelay: "400ms",
    title: "The girl with dreams in her eyes...",
    message: "You grew, you changed, and you carried your own dreams with you along the way.",
    photo: "assets/photos/photo-2-growing-up.jpg",
    alt: "A younger photo of Harini",
  },
  {
    color: "mauve",
    left: "22%",
    top: "48%",
    delay: 460,
    floatDelay: "800ms",
    title: "And then you became the woman you are today.",
    message: "Every experience, every smile, and every little step shaped the person I love today.",
    photo: "assets/photos/photo-3-her-journey.jpg",
    alt: "A meaningful photo from Harini's journey",
  },
  {
    color: "sage",
    left: "72%",
    top: "50%",
    delay: 640,
    floatDelay: "200ms",
    title: "Somewhere along the way, our stories became one.",
    message: "And one of the most beautiful chapters of my life became the one we started together.",
    photo: "assets/photos/photo-4-us.jpg",
    alt: "Harini and Rohin together",
  },
  {
    color: "blush",
    left: "12%",
    top: "69%",
    delay: 820,
    floatDelay: "600ms",
    title: "We built a little world of our own.",
    message: "It is made of ordinary days, little moments, and memories that became special because they were ours.",
    photo: "assets/photos/photo-5-our-life.jpg",
    alt: "A memory from Harini and Rohin's life together",
  },
  {
    color: "violet",
    left: "79%",
    top: "71%",
    delay: 1000,
    floatDelay: "1000ms",
    title: "And then our greatest little chapter began.",
    message: "Rithi made our little world even more beautiful — and gave us a whole new future to look forward to.",
    photo: "assets/photos/photo-6-rithi.jpg",
    alt: "Harini and Rithi",
  },
  {
    color: "pearl",
    left: "46%",
    top: "82%",
    delay: 1180,
    floatDelay: "300ms",
    title: "The best chapters haven’t been written yet...",
    message: "There is still so much life to live, love to share, and happiness waiting for you.",
    photo: null,
    alt: "",
  },
];

const celebrationParticles = [
  { color: "#f4cbb7", left: "18%", top: "46%" },
  { color: "#c99a6b", left: "31%", top: "60%" },
  { color: "#d2929b", left: "43%", top: "40%" },
  { color: "#aa85a6", left: "54%", top: "64%" },
  { color: "#d7b9ae", left: "66%", top: "43%" },
  { color: "#7e9d95", left: "78%", top: "58%" },
  { color: "#f4cbb7", left: "24%", top: "74%" },
  { color: "#c99a6b", left: "74%", top: "76%" },
];

let poppedBalloonCount = 0;
let memoryBusy = false;

function motionDuration(duration) {
  return reducedMotionQuery.matches ? 0 : duration;
}

function revealStage(stage) {
  stage.hidden = false;

  window.requestAnimationFrame(() => {
    stage.classList.add("is-active");
    stage.focus({ preventScroll: true });
  });
}

function clearBalloonTimers() {
  balloonTimers.forEach((timer) => window.clearTimeout(timer));
  balloonTimers.clear();
}

function scheduleBalloonTimer(callback, duration) {
  const timer = window.setTimeout(() => {
    balloonTimers.delete(timer);
    callback();
  }, motionDuration(duration));

  balloonTimers.add(timer);
}

function resetCakeScene() {
  currentWish = 0;

  cakeIntro.classList.remove("is-hidden");
  cakeContent.classList.remove("is-visible");
  cakeWishes.classList.remove("is-visible");
  cakePrompt.classList.remove("is-visible", "is-complete");

  cakeWishes.textContent = cakeWishesList[currentWish];
  cakePrompt.textContent = "Tap the candle...";

  cakeCandles.forEach((candle) => {
    candle.hidden = true;
    candle.disabled = true;
    candle.classList.remove("is-lit", "is-extinguished", "is-appearing");
  });
}

function showCakeCandle(index) {
  const candle = cakeCandles[index];

  if (!candle) {
    return;
  }

  candle.hidden = false;
  candle.disabled = false;

  window.requestAnimationFrame(() => {
    candle.classList.add("is-appearing", "is-lit");
  });
}

function extinguishCakeCandle(candle) {
  if (!candle.classList.contains("is-lit")) {
    return;
  }

  candle.classList.remove("is-lit");
  candle.classList.add("is-extinguished");

  /*
   * Let the flame disappear and smoke animation play
   * before moving to the next wish.
   */
  window.setTimeout(() => {
    currentWish += 1;

    /* Three wishes completed */
    if (currentWish >= cakeWishesList.length) {
      cakeCandles.forEach((nextCandle) => {
        nextCandle.hidden = true;
        nextCandle.disabled = true;
        nextCandle.classList.remove("is-lit", "is-extinguished", "is-appearing");
      });

      cakePrompt.textContent = "Your wishes are yours to keep...";
      cakePrompt.classList.add("is-complete");
      announce("Three wishes completed.");

      window.setTimeout(showConfettiStage, motionDuration(900));
      return;
    }

    /* Fade out the current wish before showing the next one. */
    cakeWishes.classList.remove("is-visible");

    window.setTimeout(() => {
      cakeWishes.textContent = cakeWishesList[currentWish];

      /* Keep all candles hidden except the next one. */
      cakeCandles.forEach((nextCandle, index) => {
        nextCandle.classList.remove(
          "is-lit",
          "is-extinguished",
          "is-appearing"
        );
        nextCandle.hidden = index !== currentWish;
        nextCandle.disabled = index !== currentWish;
      });

      window.requestAnimationFrame(() => {
        cakeWishes.classList.add("is-visible");
        showCakeCandle(currentWish);
      });
    }, motionDuration(500));
  }, motionDuration(900));
}

function showCakePlaceholder() {
  activateStage(cakePlaceholderStage);


  clearBalloonTimers();
  balloonField.replaceChildren();
  balloonCelebration.replaceChildren();

  resetCakeScene();

  window.requestAnimationFrame(() => {

    cakePlaceholderStage.classList.add("is-active");

    cakePlaceholderStage.focus({
      preventScroll: true
    });

    /*
     * "Something sweet is waiting..."
     */
    window.setTimeout(() => {
      cakeIntro.classList.add("is-hidden");
    }, motionDuration(1800));


    /*
     * Cake appears
     */
    window.setTimeout(() => {
      cakeContent.classList.add("is-visible");
    }, motionDuration(2400));


    /*
     * First wish + candle
     */
    window.setTimeout(() => {

      cakeWishes.classList.add("is-visible");
      cakePrompt.classList.add("is-visible");

      showCakeCandle(currentWish);

    }, motionDuration(3400));

  });
}

function playCompletionEffect() {
  const particles = celebrationParticles.map((particleConfig) => {
    const particle = document.createElement("span");

    particle.className = "celebration-particle";
    particle.style.setProperty("--celebration-color", particleConfig.color);
    particle.style.setProperty("--celebration-left", particleConfig.left);
    particle.style.setProperty("--celebration-top", particleConfig.top);

    return particle;
  });

  balloonCelebration.replaceChildren(...particles);
}

function leaveBalloonStage() {
  balloonStage.classList.add("is-leaving");
  scheduleBalloonTimer(showCakePlaceholder, 700);
}

function completeBalloonScene() {
  balloonStage.classList.add("is-complete");
  playCompletionEffect();
  scheduleBalloonTimer(leaveBalloonStage, 1000);
}

function showMemoryReveal(config, isFinal) {
  memoryBusy = true;
  balloonField.classList.add("is-memory-open");

  memoryTitle.textContent = config.title;
  memoryMessage.textContent = config.message;

  memoryPhotoWrap.hidden = !config.photo;
  if (config.photo) {
    memoryPhoto.src = config.photo;
    memoryPhoto.alt = config.alt;
    memoryPhoto.onerror = () => {
      memoryPhotoWrap.hidden = true;
    };
  } else {
    memoryPhoto.removeAttribute("src");
    memoryPhoto.alt = "";
  }

  memoryReveal.hidden = false;
  window.requestAnimationFrame(() => {
    memoryReveal.classList.add("is-visible");
  });

  scheduleBalloonTimer(() => {
    memoryReveal.classList.remove("is-visible");

    scheduleBalloonTimer(() => {
      memoryReveal.hidden = true;
      balloonField.classList.remove("is-memory-open");
      memoryBusy = false;

      if (isFinal) {
        completeBalloonScene();
      }
    }, 650);
  }, config.photo ? 3000 : 2600);
}

function popBalloon(button, index) {
  if (button.dataset.popped === "true" || memoryBusy) {
    return;
  }

  button.dataset.popped = "true";
  button.disabled = true;
  button.classList.add("is-popped");
  poppedBalloonCount += 1;
  balloonStatus.textContent = `${poppedBalloonCount} of ${balloons.length} balloons popped.`;

  scheduleBalloonTimer(() => button.remove(), 500);
  showMemoryReveal(balloons[index], poppedBalloonCount === balloons.length);
}

function createBalloon(config, index) {
  const slot = document.createElement("div");
  const button = document.createElement("button");
  const shape = document.createElement("span");
  const string = document.createElement("span");
  const burst = document.createElement("span");

  const number = document.createElement("span");
  number.className = "balloon__number";
  number.textContent = index + 1;

  slot.className = "balloon-slot";
  slot.style.setProperty("--balloon-left", config.left);
  slot.style.setProperty("--balloon-top", config.top);
  slot.style.setProperty("--appear-delay", `${motionDuration(config.delay)}ms`);

  button.className = `balloon balloon--${config.color}`;
  button.type = "button";
  button.setAttribute("aria-label", `Pop balloon ${index + 1}`);
  button.style.setProperty("--float-delay", config.floatDelay);

  shape.className = "balloon__shape";
  string.className = "balloon__string";
  burst.className = "balloon__burst";
  button.setAttribute("aria-label", `Story memory ${index + 1}`);

  shape.append(number);

  for (let particleIndex = 0; particleIndex < 6; particleIndex += 1) {
    const particle = document.createElement("span");
    particle.className = "balloon__particle";
    burst.append(particle);
  }

  button.append(shape, string, burst);
  button.addEventListener("click", () => popBalloon(button, index), { once: true });
  slot.append(button);

  return slot;
}

function showBalloonStage() {
  poppedBalloonCount = 0;
  memoryBusy = false;
  memoryReveal.hidden = true;
  memoryReveal.classList.remove("is-visible");
  balloonField.classList.remove("is-memory-open");
  balloonHeading.textContent = "There’s something waiting for you...";
  balloonInstruction.textContent = "Tap a balloon to continue.";
  balloonStatus.textContent = `0 of ${balloons.length} balloons popped.`;
  balloonField.replaceChildren(...balloons.map(createBalloon));
  interstitialStage.hidden = true;
  revealStage(balloonStage);
}

function leaveInterstitial() {
  interstitialStage.classList.add("is-leaving");
  window.setTimeout(showBalloonStage, motionDuration(600));
}

function showInterstitial() {
  openingStage.hidden = true;
  revealStage(interstitialStage);

  window.setTimeout(leaveInterstitial, motionDuration(3000));
}

function openSurprise() {
  openSurpriseButton.disabled = true;
  openSurpriseButton.classList.add("is-pressed");
  openingStage.classList.add("is-leaving");
  if (audio) audio.load();

  window.setTimeout(showInterstitial, motionDuration(900));
}



/* =========================================================
   PHASE 5 — CONFETTI
   ========================================================= */

/* The confetti stage is declared in index.html too; use that real node. */
const confettiStageNode = document.querySelector('[data-stage="confetti"]');
const confettiBurst = document.querySelector("[data-confetti-burst]");
const globalStatus = document.querySelector("[data-global-status]");

const letterStage = document.querySelector('[data-stage="letter"]');
const letterEnvelope = document.querySelector("[data-letter-envelope]");
const letterCard = document.querySelector("[data-letter-card]");
const openLetterButton = document.querySelector('[data-action="open-letter"]');
const nextFromLetterButton = document.querySelector('[data-action="next-from-letter"]');

const musicStage = document.querySelector('[data-stage="music"]');
const audio = document.querySelector("[data-audio]");
const musicButton = document.querySelector('[data-action="toggle-music"]');
const musicHint = document.querySelector("[data-music-hint]");
const finishButton = document.querySelector('[data-action="finish-surprise"]');

const allStages = [
  openingStage,
  interstitialStage,
  balloonStage,
  cakePlaceholderStage,
  confettiStageNode,
  letterStage,
  musicStage,
];

function activateStage(stage) {
  allStages.forEach((candidate) => {
    if (!candidate || candidate === stage) return;
    candidate.classList.remove("is-active", "is-leaving", "is-celebrating");
    candidate.hidden = true;
  });

  stage.hidden = false;

  window.requestAnimationFrame(() => {
    stage.classList.add("is-active");
    stage.focus({ preventScroll: true });
  });
}

function announce(message) {
  if (globalStatus) globalStatus.textContent = message;
}

function makeConfettiPiece(index) {
  const piece = document.createElement("span");
  piece.className = "confetti-piece";
  piece.style.setProperty("--confetti-x", `${(index % 9) * 11 - 44}px`);
  piece.style.setProperty("--confetti-r", `${(index * 37) % 360}deg`);
  piece.style.setProperty("--confetti-d", `${1100 + (index % 8) * 90}ms`);
  piece.style.setProperty("--confetti-delay", `${(index % 12) * 20}ms`);
  piece.style.setProperty("--confetti-scale", `${0.75 + ((index % 5) * 0.08)}`);
  return piece;
}

function showConfettiStage() {
  activateStage(confettiStageNode);
  confettiBurst.replaceChildren(
    ...Array.from({ length: 70 }, (_, index) => makeConfettiPiece(index))
  );
  confettiStageNode.classList.add("is-celebrating");
  announce("Three wishes completed.");

  scheduleBalloonTimer(() => {
    confettiStageNode.classList.remove("is-celebrating");
    showLetterStage();
  }, 3900);
}

function resetLetter() {
  letterEnvelope.classList.remove("is-open");
  letterCard.classList.remove("is-visible");
  openLetterButton.hidden = false;
  nextFromLetterButton.hidden = true;
}

function showLetterStage() {
  resetLetter();
  activateStage(letterStage);
}

openLetterButton.addEventListener("click", () => {
  letterEnvelope.classList.add("is-open");
  letterCard.classList.add("is-visible");
  openLetterButton.hidden = true;
  nextFromLetterButton.hidden = false;
  announce("Letter opened.");
});

nextFromLetterButton.addEventListener("click", showMusicStage);

let hasMusicError = false;

function showMusicStage() {
  activateStage(musicStage);
  musicButton.textContent = "Play our song";
  musicHint.hidden = false;
  if (audio.readyState > 0) {
    musicHint.hidden = true;
  }
  announce("Music section.");
}

audio.addEventListener("loadedmetadata", () => {
  hasMusicError = false;
  musicHint.hidden = true;
});

audio.addEventListener("error", () => {
  hasMusicError = true;
  musicHint.hidden = false;
  musicButton.textContent = "Music file missing";
});

audio.addEventListener("play", () => {
  musicButton.textContent = "Pause our song";
});

audio.addEventListener("pause", () => {
  musicButton.textContent = "Play our song";
});

musicButton.addEventListener("click", async () => {
  if (hasMusicError) return;
  try {
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  } catch {
    musicHint.hidden = false;
  }
});

finishButton.addEventListener("click", () => {
  audio.pause();
  document.body.classList.add("is-finished");
  announce("Birthday surprise complete.");
  scheduleBalloonTimer(() => {
    finishButton.textContent = "Made with love for Harini ❤️";
  }, 300);
});

openSurpriseButton.addEventListener("click", openSurprise);

cakeCandles.forEach((candle) => {
  candle.addEventListener("click", () => {
    extinguishCakeCandle(candle);
  });
  candle.hidden = true;
});

if (window.matchMedia("(pointer: coarse)").matches) {
  document.documentElement.classList.add("touch-device");
}

window.addEventListener("orientationchange", () => {
  document.documentElement.classList.add("orientation-changing");
  scheduleBalloonTimer(() => {
    document.documentElement.classList.remove("orientation-changing");
  }, 250);
});

announce("Birthday surprise ready.");
