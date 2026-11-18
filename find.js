// Your custom Find
(function () {
  "use strict";

  const find = (arr, fn) => {
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i], i, arr)) return arr[i];
    }
    return undefined;
  };

  const arr = [5, 12, 8, 130, 44];
  const snapshot = JSON.stringify(arr);
  const bigger = (x) => x > 10;

  console.assert(arr.find(bigger) === find(arr, bigger), "find: результат не збігається зі вбудованим");
  console.assert(find(arr, bigger) === 12, "find: має повертати перший відповідний елемент");
  console.assert(find(arr, (x) => x > 1000) === undefined, "find: за відсутності збігу очікується undefined");
  console.assert(find([], bigger) === undefined, "find: порожній масив – undefined");
  const users = [{ id: 1 }, { id: 2 }];
  console.assert(find(users, (u) => u.id === 2) === users[1], "find: має повертати той самий об’єкт, а не копію");
  console.assert(JSON.stringify(arr) === snapshot, "find: вхідний масив не має змінюватися");
  console.log("custom find: перевірки виконано");
})();
