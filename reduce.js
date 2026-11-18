// Your custom Reduce
(function () {
  "use strict";

  const reduce = (arr, fn, ...rest) => {
    let acc;
    let start = 0;
    if (rest.length > 0) {
      acc = rest[0];
    } else {
      if (arr.length === 0) throw new TypeError("Reduce of empty array with no initial value");
      acc = arr[0];
      start = 1;
    }
    for (let i = start; i < arr.length; i++) {
      acc = fn(acc, arr[i], i, arr);
    }
    return acc;
  };

  const arr = [1, 2, 3, 4];
  const snapshot = JSON.stringify(arr);
  const sum = (accumulator, val) => accumulator + val;

  const sum01 = arr.reduce(sum, 0);
  const sum02 = reduce(arr, sum, 0);

  console.assert(sum01 === sum02, "reduce: з початковим значенням не збігається зі вбудованим");
  console.assert(arr.reduce(sum) === reduce(arr, sum), "reduce: без початкового значення не збігається зі вбудованим");
  console.assert(reduce([], sum, 10) === 10, "reduce: порожній масив із початковим значенням має повертати його");
  console.assert(reduce([7], sum) === 7, "reduce: один елемент без початкового значення");

  let thrown = null;
  try {
    reduce([], sum);
  } catch (error) {
    thrown = error;
  }
  console.assert(thrown instanceof TypeError, "reduce: порожній масив без початкового значення має кидати TypeError");
  console.assert(JSON.stringify(reduce(arr, (acc, x) => [...acc, x * 2], [])) === "[2,4,6,8]", "reduce: накопичувач-масив");
  console.assert(JSON.stringify(arr) === snapshot, "reduce: вхідний масив не має змінюватися");
  console.log("custom reduce: перевірки виконано");
})();
