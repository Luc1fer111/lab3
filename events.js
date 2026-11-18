// js/events.js – обробники подій, валідація, debounce
(function (App) {
  "use strict";

  const debounce = (fn, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), delay);
    };
  };

  const makeId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  // ---------- валідація ----------
  const errorBox = (input) => input.closest(".field").querySelector(".field__error");

  const validateField = (input) => {
    input.setCustomValidity("");
    const value = input.value.trim();
    const v = input.validity;
    let message = "";
    if (v.valueMissing || value === "") message = "Поле обов’язкове для заповнення";
    else if (input.minLength > 0 && value.length < input.minLength) message = `Мінімум ${input.minLength} символи`;
    else if (v.badInput || v.stepMismatch) message = input.step === "1" ? "Введіть ціле число" : "Введіть число з двома знаками після коми";
    else if (v.rangeUnderflow) message = `Значення має бути не менше ${input.min}`;
    else if (input.name === "name" && !/^[\p{L}\p{N} «»"'’.,\-]+$/u.test(value)) message = "Назва містить недопустимі символи";
    input.setCustomValidity(message);
    errorBox(input).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return message === "";
  };

  // перевіряє всі поля, фокус – на першому помилковому
  const validateAll = (container) => {
    const inputs = [...container.querySelectorAll(".field__input")];
    const results = inputs.map(validateField);
    const firstBad = inputs.find((_, i) => !results[i]);
    if (firstBad) firstBad.focus();
    return !firstBad;
  };

  const readValues = (container) => {
    const get = (name) => container.querySelector(`[name="${name}"]`).value.trim();
    return { name: get("name"), price: Number(get("price")), qty: Number(get("qty")) };
  };

  // ---------- прив’язка ----------
  const bind = (state) => {
    const list = document.getElementById("list");
    const form = document.getElementById("add-form");

    const rerender = () => App.render.all(state);
    const commit = () => {
      App.storage.save(state.items);
      rerender();
    };

    // Делегування: один обробник click на контейнері списку
    list.addEventListener("click", (event) => {
      const control = event.target.closest("[data-action]");
      if (!control || !list.contains(control)) return;
      const row = control.closest(".item");
      const id = row.dataset.id;
      const item = state.items.find((entry) => entry.id === id);

      switch (control.dataset.action) {
        case "toggle":
          item.selected = control.checked;
          commit();
          break;
        case "delete":
          state.items = state.items.filter((entry) => entry.id !== id);
          if (state.editingId === id) state.editingId = null;
          commit();
          break;
        case "edit":
          state.editingId = id;
          rerender();
          list.querySelector(`[data-id="${id}"] .field__input`).focus();
          break;
        case "cancel":
          state.editingId = null;
          rerender();
          break;
        case "save": {
          if (!validateAll(row)) return;
          Object.assign(item, readValues(row));
          state.editingId = null;
          commit();
          break;
        }
      }
    });

    // Enter – зберегти, Escape – скасувати (теж через делегування)
    list.addEventListener("keydown", (event) => {
      if (!event.target.matches(".field__input")) return;
      const row = event.target.closest(".item");
      if (event.key === "Enter") row.querySelector('[data-action="save"]').click();
      if (event.key === "Escape") row.querySelector('[data-action="cancel"]').click();
    });

    // Форма додавання
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validateAll(form)) return;
      state.items.push({ id: makeId(), ...readValues(form), selected: false });
      form.reset();
      form.querySelectorAll(".field__input").forEach((input) => input.setAttribute("aria-invalid", "false"));
      form.querySelector('[name="name"]').focus();
      commit();
    });

    form.addEventListener("input", (event) => {
      if (event.target.getAttribute("aria-invalid") === "true") validateField(event.target);
    });

    // Фільтри
    document.getElementById("filters").addEventListener("submit", (event) => event.preventDefault());
    document.getElementById("search").addEventListener("input", debounce((event) => {
      state.query = event.target.value;
      rerender();
    }, 300));
    document.getElementById("status").addEventListener("change", (event) => {
      state.status = event.target.value;
      rerender();
    });
    document.getElementById("sort").addEventListener("change", (event) => {
      state.sort = event.target.value;
      rerender();
    });

    document.getElementById("clear").addEventListener("click", () => {
      App.storage.clear();
      state.items = [];
      state.editingId = null;
      rerender();
    });
  };

  App.events = { bind, debounce, validateField };
})(window.App = window.App || {});
