// Your custom Filter
(function () {
  "use strict";

  const filter = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i], i, arr)) result.push(arr[i]);
    }
    return result;
  };

  const arr = [1, 2, 3, 4, 5, 6];
  const snapshot = JSON.stringify(arr);
  const isEven = (x) => x % 2 === 0;

  const res01 = arr.filter(isEven);
  const res02 = filter(arr, isEven);

  console.assert(JSON.stringify(res01) === JSON.stringify(res02), "filter: результат не збігається зі вбудованим");
  console.assert(res02 !== arr, "filter: має повертати новий масив");
  console.assert(filter(arr, () => false).length === 0, "filter: жоден елемент не підходить – очікується порожній масив");
  console.assert(JSON.stringify(filter(arr, () => true)) === snapshot, "filter: підходять усі – очікується копія масиву");
  console.assert(filter(arr, () => true) !== arr, "filter: копія не має бути тим самим масивом");
  console.assert(JSON.stringify(filter(arr, (x, i) => i < 2)) === "[1,2]", "filter: індекс має передаватися у функцію");
  console.assert(JSON.stringify(arr) === snapshot, "filter: вхідний масив не має змінюватися");
  console.log("custom filter: перевірки виконано");
})();
