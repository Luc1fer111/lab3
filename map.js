// Your custom Map
(function () {
  "use strict";

  const map = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(fn(arr[i], i, arr));
    }
    return result;
  };

  const arr = [1, 2, 3, 4];
  const snapshot = JSON.stringify(arr);
  const double = (x) => x * 2;
  const byIndex = (x, i) => x * i;

  const res01 = arr.map(double);          // вбудований map
  const res02 = map(arr, double);         // власна реалізація

  console.assert(JSON.stringify(res01) === JSON.stringify(res02), "map: результат не збігається зі вбудованим");
  console.assert(res02 !== arr && res02.length === arr.length, "map: має повертати новий масив тієї самої довжини");
  console.assert(map([], double).length === 0, "map: порожній масив має давати порожній масив");
  console.assert(JSON.stringify(map(arr, byIndex)) === JSON.stringify(arr.map(byIndex)), "map: індекс має передаватися у функцію");
  console.assert(JSON.stringify(arr) === snapshot, "map: вхідний масив не має змінюватися");
  console.log("custom map: перевірки виконано");
})();
