// js/storage.js – робота з localStorage
(function (App) {
  "use strict";

  const KEY = "catalog-items-v1";

  const SEED = [
    { id: "seed1", name: "Кухоль «Дніпро»", price: 450, qty: 12, selected: false },
    { id: "seed2", name: "Ваза «Калина»", price: 980, qty: 4, selected: true },
    { id: "seed3", name: "Миска «Хвиля»", price: 380, qty: 9, selected: false },
    { id: "seed4", name: "Чайник «М’ята»", price: 1250, qty: 3, selected: false },
  ];

  const isValidItem = (item) =>
    item !== null && typeof item === "object" &&
    typeof item.id === "string" && item.id !== "" &&
    typeof item.name === "string" && item.name.trim() !== "" &&
    Number.isFinite(item.price) && item.price >= 0 &&
    Number.isInteger(item.qty) && item.qty >= 0 &&
    typeof item.selected === "boolean";

  const copySeed = () => SEED.map((item) => ({ ...item }));

  // Порожнє сховище -> початкові дані; пошкоджений JSON або неправильна структура -> початкові дані
  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === null) return copySeed();
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) throw new TypeError("Очікувався масив");
      return data.filter(isValidItem);
    } catch (error) {
      console.warn("Сховище пошкоджене, використано початкові дані:", error.message);
      return copySeed();
    }
  };

  const save = (items) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (error) {
      console.warn("Не вдалося записати у сховище:", error.message);
    }
  };

  const clear = () => {
    try {
      localStorage.removeItem(KEY);
    } catch (error) {
      console.warn("Не вдалося очистити сховище:", error.message);
    }
  };

  App.storage = { KEY, load, save, clear };
})(window.App = window.App || {});
