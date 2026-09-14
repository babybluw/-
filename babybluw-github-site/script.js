const audio = document.getElementById("audio");
const master = document.getElementById("masterPlay");
const nowPlaying = document.getElementById("nowPlaying");
const progress = document.getElementById("progress");
const time = document.getElementById("time");
const tracks = [...document.querySelectorAll(".track")];

let current = -1;

function fmt(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function setTrack(i, autoplay = true) {
  current = i;
  tracks.forEach((t, n) => t.classList.toggle("active", n === i));
  const track = tracks[i];
  audio.src = track.dataset.src;
  nowPlaying.textContent = track.querySelector(".name").textContent;
  progress.value = 0;
  if (autoplay) {
    audio.play().then(() => {
      master.textContent = "Ⅱ";
    }).catch(() => {
      nowPlaying.textContent = "add the mp3 to /music";
    });
  }
}

tracks.forEach((track, i) => {
  track.addEventListener("click", () => {
    if (current === i && !audio.paused) {
      audio.pause();
      master.textContent = "▶";
    } else {
      if (current !== i) setTrack(i, false);
      audio.play().then(() => {
        master.textContent = "Ⅱ";
      }).catch(() => {
        nowPlaying.textContent = "add the mp3 to /music";
      });
    }
  });
});

master.addEventListener("click", () => {
  if (current < 0) setTrack(0, false);
  if (audio.paused) {
    audio.play().then(() => master.textContent = "Ⅱ").catch(() => {
      nowPlaying.textContent = "add the mp3 to /music";
    });
  } else {
    audio.pause();
    master.textContent = "▶";
  }
});

audio.addEventListener("timeupdate", () => {
  progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
});

progress.addEventListener("input", () => {
  if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
  if (current < tracks.length - 1) setTrack(current + 1, true);
  else master.textContent = "▶";
});
