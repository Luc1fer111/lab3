// js/strict-off.js – без директиви "use strict"
(function () {
  const target = document.getElementById("log-off");

  const check = (label, fn) => {
    let text;
    try {
      text = String(fn());
    } catch (error) {
      text = `${error.name}: ${error.message}`;
    }
    console.log(label, "→", text);
    if (target) {
      const li = document.createElement("li");
      li.textContent = `${label} → ${text}`;
      target.append(li);
    }
  };

  // помилки виконання
  check("неоголошена змінна", () => { undeclaredOff = 1; return undeclaredOff; });
  check("this у функції", function () { return this; });
  const frozen = Object.freeze({ a: 1 });
  check("запис у заморожений об’єкт", () => { frozen.a = 2; return frozen.a; });
  check("нова властивість у заморожений об’єкт", () => { frozen.b = 3; return frozen.b; });
  check("delete Object.prototype", () => delete Object.prototype);
  check("arguments і параметр", function (p) { p = 2; return arguments[0]; }.bind(null, 1));

  // помилки розбору: рядок компілюється під час виконання, тому виняток перехоплюється
  check("інструкція with", () => new Function('with (Math) return PI;')());
  check("літерал 010", () => new Function('return 010;')());
  check("однакові параметри", () => new Function("a", "a", "return a;")(1, 2));
  check("delete змінної", () => new Function('var x = 1; delete x; return x;')());
})();
