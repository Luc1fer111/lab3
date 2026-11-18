// Допоміжний сценарій сторінки tasks.html: рахує виклики console.assert і показує підсумок на сторінці
(function () {
  "use strict";

  const originalAssert = console.assert.bind(console);
  const stats = { total: 0, failed: [] };

  console.assert = (condition, ...args) => {
    stats.total += 1;
    if (!condition) stats.failed.push(args.join(" "));
    originalAssert(condition, ...args);
  };

  const show = () => {
    const status = document.getElementById("report-status");
    const log = document.getElementById("report-log");
    const ok = stats.failed.length === 0;
    status.textContent = ok
      ? `Усі перевірки пройдено: ${stats.total} з ${stats.total}`
      : `Не пройдено перевірок: ${stats.failed.length} з ${stats.total}`;
    status.classList.toggle("report__status--fail", !ok);
    log.replaceChildren(...stats.failed.map((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      return li;
    }));
  };

  // debounce/throttle перевіряються асинхронно, тому підсумок оновлюється з паузою
  window.addEventListener("load", () => {
    show();
    setTimeout(show, 600);
  });
})();
