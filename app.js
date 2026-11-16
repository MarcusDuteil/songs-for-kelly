(() => {
  "use strict";

  const timeZone = "Europe/Paris";
  const dayInMs = 86_400_000;
  const parisCalendar = new Intl.DateTimeFormat("fr-FR", {
    timeZone, year: "numeric", month: "long", day: "numeric",
  });
  const parisDateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  });
  const playlist = window.kellyPlaylist;
  const trackCount = playlist.tracks.length;
  const firstDay = Date.parse(playlist.startDate);
  const advanceKey = `songs-for-kelly:advance:${playlist.startDate}`;
  const demo = trackCount === 0 && (
    location.protocol === "file:" ||
    ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname) ||
    new URLSearchParams(location.search).get("demo") === "1"
  );
  const demoTrack = { title: "Lueur du soir", artist: "", file: "assets/demo.wav" };
  const verses = [
    ["Philippiens", "4:13", "Je puis tout en celui qui me fortifie."],
    ["Romains", "12:12", "Soyez pleins de la joie que donne l’espérance, patients dans l’affliction, assidus à la prière."],
    ["Ecclésiastique", "2:3", "Attache-toi à Dieu et ne t’en sépare pas, afin que tu grandisses à ta fin."],
    ["2 Timothée", "1:7", "Car ce n’est pas un esprit de timidité que Dieu nous a donné, mais un esprit de force, d’amour et de modération."],
    ["Proverbes", "16:3", "Recommande tes œuvres à Yahweh, et tes projets réussiront."],
    ["1 Pierre", "5:7", "Déchargez-vous sur lui de toutes vos sollicitudes, car lui-même prend soin de vous."],
    ["Jean", "15:12", "Ceci est mon commandement, que vous vous aimiez les uns les autres, comme je vous ai aimés."],
    ["Hébreux", "10:23", "Restons inébranlablement attachés à la profession de notre espérance ; car celui qui a fait la promesse est fidèle."],
    ["2 Corinthiens", "5:7", "Car nous marchons par la foi, et non par la vue."],
    ["Sagesse", "7:7", "C’est pourquoi j’ai prié, et la prudence m’a été donnée ; j’ai invoqué, et l’esprit de sagesse est venu en moi."],
    ["Galates", "6:9", "Ne nous lassons point de faire le bien ; car nous moissonnerons en son temps, si nous ne nous relâchons pas."],
    ["Matthieu", "5:9", "Heureux les pacifiques, car ils seront appelés enfants de Dieu !"],
  ];

  const today = document.querySelector("#today");
  const dailyVerse = document.querySelector("#daily-verse");
  const verseText = document.querySelector("#verse-text");
  const verseSource = document.querySelector("#verse-source");
  const nextTrack = document.querySelector("#next-track");
  const countdown = document.querySelector("#countdown");
  const feature = document.querySelector("#feature");
  const coverImage = document.querySelector("#cover-image");
  const defaultCover = coverImage.getAttribute("src");
  const discover = document.querySelector("#discover");
  const anotherTrack = document.querySelector("#another-track");
  const empty = document.querySelector("#empty");
  const player = document.querySelector("#player");
  const trackTitle = document.querySelector("#track-title");
  const artist = document.querySelector("#artist");
  const audio = document.querySelector("#audio");
  const audioError = document.querySelector("#audio-error");
  document.querySelector("#demo-note").hidden = !demo;

  let currentDate;
  let currentTrack;
  let currentTrackIndex;
  let advance = 0;
  let midnight;

  function dateKey(timestamp) {
    const parts = Object.fromEntries(
      parisDateParts.formatToParts(timestamp).map(({ type, value }) => [type, value]),
    );
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function nextMidnight(timestamp, day) {
    // Find the first second with a different Paris date, including on DST changes.
    let lower = Math.floor(timestamp / 1000);
    let upper = lower + 26 * 3600;
    while (upper - lower > 1) {
      const middle = Math.floor((upper + lower) / 2);
      if (dateKey(middle * 1000) === day) lower = middle;
      else upper = middle;
    }
    return upper * 1000;
  }

  function storageKey() {
    return `songs-for-kelly:${currentDate}:${currentTrack.file}`;
  }

  function wasRevealed() {
    try {
      return localStorage.getItem(storageKey()) === "yes";
    } catch {
      return false;
    }
  }

  function savedAdvance() {
    try {
      const value = Number(localStorage.getItem(advanceKey));
      return Number.isSafeInteger(value) && value >= 0 ? value : 0;
    } catch {
      return 0;
    }
  }

  function showTrack(animate) {
    discover.hidden = true;
    empty.hidden = true;
    trackTitle.textContent = currentTrack.title;
    artist.textContent = currentTrack.artist ?? "";
    coverImage.src = currentTrack.cover || defaultCover;
    audio.src = currentTrack.file;
    player.hidden = false;
    if (animate) {
      feature.classList.add("revealing");
      trackTitle.focus({ preventScroll: true });
    }
  }

  function selectTrack(index) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    player.hidden = true;
    audioError.hidden = true;
    feature.classList.remove("revealing");
    coverImage.src = defaultCover;

    currentTrackIndex = index;
    currentTrack = demo ? demoTrack : undefined;
    if (trackCount > 0 && index >= 0) {
      currentTrack = playlist.tracks[index % trackCount];
    }
    anotherTrack.hidden = !currentTrack || demo;
    nextTrack.hidden = !demo && !(trackCount > 0 && index >= -1);
    discover.hidden = !currentTrack;
    empty.hidden = Boolean(currentTrack);
    if (!currentTrack) {
      empty.textContent = index < 0
        ? "Le premier morceau arrive bientôt."
        : "Aucun morceau prévu aujourd’hui.";
    }
  }

  function switchDate(day, now) {
    const restoreFocus = player.contains(document.activeElement) ||
      document.activeElement === audio;
    currentDate = day;
    midnight = nextMidnight(now, day);
    today.dateTime = day;
    today.textContent = parisCalendar.format(now);

    const calendarDay = Date.parse(day);
    const verseIndex = ((calendarDay / dayInMs) % verses.length + verses.length) % verses.length;
    const [book, reference, quote] = verses[verseIndex];
    const bookPage = encodeURIComponent(book.replaceAll(" ", "_"));
    const verseStart = encodeURIComponent(quote.split(" ").slice(0, 7).join(" ")).replaceAll("-", "%2D");
    verseText.textContent = `« ${quote} »`;
    verseSource.textContent = `${book} ${reference} · Bible Crampon`;
    verseSource.href = `https://fr.wikisource.org/wiki/Bible_Crampon_1923/${bookPage}#:~:text=${verseStart}`;
    dailyVerse.hidden = false;

    advance = Math.max(advance, savedAdvance());
    selectTrack((calendarDay - firstDay) / dayInMs + advance);
    if (currentTrack && wasRevealed()) {
      showTrack(false);
    } else if (currentTrack && restoreFocus) {
      discover.focus({ preventScroll: true });
    }
  }

  function tick() {
    const now = Date.now();
    const day = dateKey(now);
    if (day !== currentDate) switchDate(day, now);

    const seconds = Math.max(0, Math.ceil((midnight - now) / 1000));
    const parts = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60];
    countdown.textContent = parts.map(part => String(part).padStart(2, "0")).join(":");
  }

  function playTrack() {
    try {
      localStorage.setItem(storageKey(), "yes");
    } catch {
      // The reveal still works when browser storage is unavailable.
    }
    showTrack(true);
    audio.play().catch(() => {
      // If the browser blocks autoplay, the native play button remains available.
    });
  }

  discover.addEventListener("click", () => {
    tick();
    if (!discover.hidden) playTrack();
  });

  anotherTrack.addEventListener("click", () => {
    tick();
    if (player.hidden || anotherTrack.hidden) return;

    const nextAdvance = Math.max(advance, savedAdvance()) + 1;
    const nextIndex = currentTrackIndex + (nextAdvance - advance);

    advance = nextAdvance;
    try {
      localStorage.setItem(advanceKey, String(advance));
    } catch {
      // Keep the advance in memory if browser storage is unavailable.
    }
    selectTrack(nextIndex);
    playTrack();
  });

  feature.addEventListener("animationend", event => {
    if (event.animationName === "reveal-cover") feature.classList.remove("revealing");
  });

  coverImage.addEventListener("error", () => {
    if (coverImage.getAttribute("src") !== defaultCover) {
      coverImage.src = defaultCover;
    }
  });
  audio.addEventListener("error", () => {
    if (audio.hasAttribute("src")) audioError.hidden = false;
  });
  document.addEventListener("visibilitychange", tick);
  window.addEventListener("pageshow", tick);
  tick();
  setInterval(tick, 250);
})();
