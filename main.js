// js/main.js – точка входу, підключається останнім
(function (App) {
  "use strict";

  const init = () => {
    const state = {
      items: App.storage.load(),
      query: "",
      status: "all",
      sort: "name",
      editingId: null,
    };
    App.events.bind(state);
    App.render.all(state);
    return state;
  };

  App.main = { init };
  App.main.init();
})(window.App);
