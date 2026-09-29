import { lessons } from "../learning-content.js";
import { resolveLocalized as tr } from "../i18n.js";
import { bi, icon } from "../ui.js";
const readProgress = () => {
  try {
    const value = JSON.parse(localStorage.getItem("mythics_learning") || "[]");
    return Array.isArray(value)
      ? value.filter((id) => lessons.some((l) => l.id === id))
      : [];
  } catch {
    return [];
  }
};
export function renderLearnView(container, params = {}) {
  const lesson = lessons.find((l) => l.id === params.module) || lessons[0],
    index = lessons.indexOf(lesson),
    done = readProgress();
  container.innerHTML = `<div class="container"><header class="section-header"><span class="eyebrow">MYTHICS / ${bi("RUANG BELAJAR", "LEARNING ROOM")}</span><h1 class="section-title">${bi("Pahami kisahnya.<br>Temukan maknanya.", "Understand the story.<br>Discover its meaning.")}</h1><p class="section-subtitle">${bi("Empat panduan singkat untuk membaca mitologi dengan rasa ingin tahu dan konteks.", "Four short guides to reading mythology with curiosity and context.")}</p></header><div class="learn-layout"><nav class="lesson-nav" aria-label="${bi("Modul belajar", "Learning modules")}">${lessons.map((l, i) => `<a href="#/learn?module=${l.id}" class="${l.id === lesson.id ? "active" : ""}" ${l.id === lesson.id ? 'aria-current="page"' : ""}>0${i + 1} &nbsp; ${tr(l.title)}<small>${l.minutes} ${bi("menit baca", "min read")} ${done.includes(l.id) ? "· ✓ " + bi("Selesai", "Completed") : ""}</small></a>`).join("")}<small id="learning-progress" aria-live="polite">${done.length} / ${lessons.length} ${bi("modul selesai · tersimpan di perangkat ini", "modules complete · saved on this device")}</small></nav><article class="lesson-article"><span class="eyebrow">${bi("PANDUAN", "GUIDE")} 0${index + 1} / ${lesson.minutes} ${bi("MENIT", "MINUTES")}</span><h2>${tr(lesson.title)}</h2><p class="lesson-intro">${tr(lesson.summary)}</p><div class="lesson-objectives"><strong>${bi("YANG AKAN KAMU PELAJARI", "WHAT YOU WILL LEARN")}</strong><ul>${lesson.objectives.map((o) => `<li>${tr(o)}</li>`).join("")}</ul></div>${lesson.sections.map((s) => `<section><h3>${tr(s.title)}</h3><p>${tr(s.text)}</p></section>`).join("")}<div class="lesson-links">${lesson.creatures.map((s) => `<a class="btn btn-secondary" href="#/creature/${s}">${s.replace(/-/g, " ")} ${icon("arrow", 16)}</a>`).join("")}<a class="btn btn-ghost" href="#/compare">${bi("Buka perbandingan", "Open comparison")} ↗</a></div><div class="lesson-sources"><span class="eyebrow">${bi("SUMBER & BACAAN LANJUTAN", "SOURCES & FURTHER READING")}</span>${lesson.sources.map(([title, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${title} ↗</a>`).join("")}</div><form class="quiz" id="lesson-quiz"><h3>${bi("Uji pemahamanmu", "Check your understanding")}</h3><fieldset><legend>${tr(lesson.quiz.question)}</legend>${lesson.quiz.options.map((o, i) => `<label><input type="radio" name="answer" value="${i}" required><span>${tr(o)}</span></label>`).join("")}</fieldset><button class="btn btn-secondary" type="submit">${bi("Periksa jawaban", "Check answer")}</button><div class="quiz-feedback" id="quiz-feedback" aria-live="polite"></div></form><div class="lesson-done"><button class="btn btn-primary" id="complete-lesson" ${done.includes(lesson.id) ? "disabled" : ""}>${done.includes(lesson.id) ? "✓ " + bi("Modul selesai", "Module complete") : bi("Tandai selesai", "Mark complete")}</button><a class="text-link" href="#/learn?module=${lessons[(index + 1) % lessons.length].id}">${bi("Panduan berikutnya", "Next guide")} ${icon("arrow", 18)}</a></div></article></div></div>`;
  container.querySelector("#lesson-quiz").onsubmit = (e) => {
    e.preventDefault();
    const answer = Number(new FormData(e.currentTarget).get("answer"));
    container.querySelector("#quiz-feedback").textContent =
      (answer === lesson.quiz.answer
        ? bi("Tepat. ", "Correct. ")
        : bi("Belum tepat. ", "Not quite. ")) + tr(lesson.quiz.explanation);
  };
  container.querySelector("#complete-lesson").onclick = (e) => {
    const next = [...new Set([...readProgress(), lesson.id])];
    try {
      localStorage.setItem("mythics_learning", JSON.stringify(next));
    } catch {
      container.querySelector("#learning-progress").textContent = bi(
        "Penyimpanan perangkat tidak tersedia.",
        "Device storage is unavailable.",
      );
      return;
    }
    e.currentTarget.textContent = "✓ " + bi("Modul selesai", "Module complete");
    e.currentTarget.disabled = true;
    container.querySelector("#learning-progress").textContent =
      `${next.length} / ${lessons.length} ${bi("modul selesai · tersimpan di perangkat ini", "modules complete · saved on this device")}`;
    container.querySelector(".lesson-nav a.active small").textContent =
      `${lesson.minutes} ${bi("menit baca · ✓ Selesai", "min read · ✓ Completed")}`;
  };
}
