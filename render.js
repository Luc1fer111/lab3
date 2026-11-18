// js/render.js – формування розмітки (лише createElement, append, textContent)
(function (App) {
  "use strict";

  const money = (value) => `${value.toFixed(2)} ₴`;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const button = (action, label, extra = "") => {
    const btn = el("button", `button button--small ${extra}`.trim(), label);
    btn.type = "button";
    btn.dataset.action = action;
    return btn;
  };

  const field = (rowId, name, label, attrs) => {
    const wrap = el("div", "field");
    const id = `edit-${rowId}-${name}`;
    const lab = el("label", "field__label", label);
    lab.htmlFor = id;
    const input = el("input", "field__input");
    input.id = id;
    input.name = name;
    input.dataset.field = name;
    Object.assign(input, attrs);
    input.setAttribute("aria-describedby", `${id}-error`);
    const error = el("span", "field__error");
    error.id = `${id}-error`;
    error.setAttribute("role", "alert");
    wrap.append(lab, input, error);
    return wrap;
  };

  const COMPARATORS = {
    name: (a, b) => a.name.localeCompare(b.name, "uk"),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "total-desc": (a, b) => b.price * b.qty - a.price * a.qty,
  };

  // filter -> копія -> sort
  const visible = (state) => {
    const query = state.query.trim().toLowerCase();
    const filtered = state.items.filter((item) => {
      const byName = query === "" || item.name.toLowerCase().includes(query);
      const byState = state.status === "all" || (state.status === "selected") === item.selected;
      return byName && byState;
    });
    return [...filtered].sort(COMPARATORS[state.sort] || COMPARATORS.name);
  };

  const buildRow = (item, editingId) => {
    const editing = item.id === editingId;
    const row = el("li", `item${item.selected ? " item--selected" : ""}${editing ? " item--editing" : ""}`);
    row.dataset.id = item.id;

    const check = el("input", "item__check");
    check.type = "checkbox";
    check.checked = item.selected;
    check.dataset.action = "toggle";
    check.setAttribute("aria-label", `Обрати: ${item.name}`);
    const actions = el("div", "item__actions");

    if (editing) {
      const form = el("div", "item__edit");
      form.append(
        field(item.id, "name", "Назва", { type: "text", value: item.name, required: true, minLength: 2, maxLength: 60 }),
        field(item.id, "price", "Ціна, ₴", { type: "number", value: String(item.price), required: true, min: "0.01", step: "0.01" }),
        field(item.id, "qty", "Кількість", { type: "number", value: String(item.qty), required: true, min: "0", step: "1" })
      );
      actions.append(button("save", "Зберегти"), button("cancel", "Скасувати", "button--ghost"));
      row.append(check, form, actions);
    } else {
      const info = el("div", "item__info");
      info.append(
        el("h3", "item__title", item.name),
        el("p", "item__meta", `${money(item.price)} × ${item.qty} шт = ${money(item.price * item.qty)}`)
      );
      actions.append(button("edit", "Редагувати", "button--ghost"), button("delete", "Видалити", "button--danger"));
      row.append(check, info, actions);
    }
    return row;
  };

  const list = (state) => {
    const container = document.getElementById("list");
    const rows = visible(state).map((item) => buildRow(item, state.editingId));
    if (rows.length === 0) rows.push(el("li", "list__empty", "Нічого не знайдено. Змініть умови відбору або додайте позицію."));
    container.replaceChildren(...rows);
  };

  const summary = (state) => {
    const shown = visible(state);
    const cost = shown.reduce((sum, item) => sum + item.price * item.qty, 0);
    const values = {
      total: String(state.items.length),
      selected: String(state.items.filter((item) => item.selected).length),
      shown: String(shown.length),
      cost: money(cost),
    };
    Object.entries(values).forEach(([key, value]) => {
      document.querySelector(`[data-summary="${key}"]`).textContent = value;
    });
  };

  const all = (state) => {
    list(state);
    summary(state);
  };

  App.render = { visible, list, summary, all };
})(window.App = window.App || {});
