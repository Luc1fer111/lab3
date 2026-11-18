// Your custom deepClone
(function () {
  "use strict";

  const deepClone = (value, seen = new WeakMap()) => {
    if (value === null || typeof value !== "object") return value;
    if (seen.has(value)) return seen.get(value);                // циклічне посилання

    if (value instanceof Date) return new Date(value.getTime());
    if (value instanceof Map) {
      const map = new Map();
      seen.set(value, map);
      value.forEach((v, k) => map.set(deepClone(k, seen), deepClone(v, seen)));
      return map;
    }
    if (value instanceof Set) {
      const set = new Set();
      seen.set(value, set);
      value.forEach((v) => set.add(deepClone(v, seen)));
      return set;
    }
    if (Array.isArray(value)) {
      const copy = [];
      seen.set(value, copy);
      value.forEach((v, i) => { copy[i] = deepClone(v, seen); });
      return copy;
    }
    const copy = Object.create(Object.getPrototypeOf(value));
    seen.set(value, copy);
    for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen);
    return copy;
  };

  const source = { name: "Кухоль", price: 450, tags: ["a", "b"], nested: { size: { h: 10 } } };
  const snapshot = JSON.stringify(source);
  const clone = deepClone(source);

  console.assert(JSON.stringify(clone) === JSON.stringify(source), "deepClone: рядкові подання не збігаються");
  console.assert(clone !== source, "deepClone: копія має бути іншим об’єктом");
  console.assert(clone.nested !== source.nested && clone.nested.size !== source.nested.size, "deepClone: вкладені об’єкти мають бути новими");
  console.assert(clone.tags !== source.tags, "deepClone: вкладений масив має бути новим");

  clone.nested.size.h = 99;
  clone.tags.push("c");
  console.assert(JSON.stringify(source) === snapshot, "deepClone: зміна копії не має впливати на оригінал");

  // значення, яких JSON.stringify не розрізняє
  const rich = { created: new Date(2026, 0, 15), map: new Map([["k", { v: 1 }]]), set: new Set([1, 2]), missing: undefined };
  const richClone = deepClone(rich);
  console.assert(richClone.created instanceof Date && richClone.created !== rich.created, "deepClone: Date має бути новим об’єктом Date");
  console.assert(richClone.created.getTime() === rich.created.getTime(), "deepClone: Date має зберегти час");
  console.assert(richClone.map instanceof Map && richClone.map.get("k") !== rich.map.get("k"), "deepClone: Map із глибокою копією значень");
  console.assert(richClone.map.get("k").v === 1, "deepClone: значення Map збережено");
  console.assert(richClone.set instanceof Set && richClone.set.has(2), "deepClone: Set збережено");
  console.assert("missing" in richClone && richClone.missing === undefined, "deepClone: властивість undefined має зберегтися");

  // циклічне посилання
  const loop = { name: "loop" };
  loop.self = loop;
  const loopClone = deepClone(loop);
  console.assert(loopClone !== loop && loopClone.self === loopClone, "deepClone: циклічне посилання має вказувати на копію");
  let stringifyError = null;
  try { JSON.stringify(loop); } catch (error) { stringifyError = error; }
  console.assert(stringifyError instanceof TypeError, "JSON.stringify на циклічній структурі має кидати TypeError");

  // еталон – вбудований structuredClone (якщо доступний)
  if (typeof structuredClone === "function") {
    const ref = structuredClone(rich);
    console.assert(ref.created.getTime() === richClone.created.getTime(), "deepClone: Date збігається зі structuredClone");
    console.assert(ref.map.get("k").v === richClone.map.get("k").v, "deepClone: Map збігається зі structuredClone");
  }
  console.log("custom deepClone: перевірки виконано");
})();
