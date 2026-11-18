// Your custom Flat
(function () {
  "use strict";

  const flat = (arr, depth = 1) => {
    const result = [];
    for (const item of arr) {
      if (Array.isArray(item) && depth > 0) {
        result.push(...flat(item, depth - 1));
      } else {
        result.push(item);
      }
    }
    return result;
  };

  const arr = [1, [2, [3, [4]]], 5];
  const snapshot = JSON.stringify(arr);
  const inner = arr[1];

  [1, 2, Infinity].forEach((depth) => {
    console.assert(
      JSON.stringify(arr.flat(depth)) === JSON.stringify(flat(arr, depth)),
      `flat: глибина ${depth} не збігається зі вбудованим`
    );
  });
  console.assert(JSON.stringify(flat(arr)) === "[1,2,[3,[4]],5]", "flat: глибина за замовчуванням має дорівнювати 1");
  console.assert(JSON.stringify(flat(arr, 0)) === snapshot, "flat: глибина 0 не розгортає нічого");
  console.assert(flat([]).length === 0, "flat: порожній масив");
  console.assert(JSON.stringify(arr) === snapshot, "flat: вихідна структура не має змінюватися");
  console.assert(arr[1] === inner, "flat: вкладені масиви мають залишитися тими самими посиланнями");
  console.log("custom flat: перевірки виконано");
})();
