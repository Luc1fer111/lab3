// Extra: debounce та throttle з перевіркою кількості фактичних викликів
(function () {
  "use strict";

  const debounce = (fn, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), delay);
    };
  };

  const throttle = (fn, interval) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last < interval) return;
      last = now;
      fn(...args);
    };
  };

  // debounce: серія з 5 викликів – один фактичний, з аргументами останнього
  let debounced = 0;
  let lastArg = null;
  const d = debounce((arg) => { debounced += 1; lastArg = arg; }, 100);
  for (let i = 1; i <= 5; i++) d(i);
  console.assert(debounced === 0, "debounce: обробник не має виконуватися до завершення паузи");
  setTimeout(() => {
    console.assert(debounced === 1, `debounce: очікувався 1 виклик, фактично ${debounced}`);
    console.assert(lastArg === 5, "debounce: обробник має отримати аргументи останнього виклику");
  }, 250);

  // throttle: серія з 5 викликів – лише перший виконується одразу
  let throttled = 0;
  const t = throttle(() => { throttled += 1; }, 200);
  for (let i = 0; i < 5; i++) t();
  console.assert(throttled === 1, `throttle: очікувався 1 виклик у межах інтервалу, фактично ${throttled}`);
  setTimeout(() => {
    t();
    console.assert(throttled === 2, `throttle: після інтервалу очікувалося 2 виклики, фактично ${throttled}`);
  }, 300);

  console.log("debounce/throttle: перевірки заплановано");
})();
