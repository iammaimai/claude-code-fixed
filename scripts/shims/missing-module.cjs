const callable = new Proxy(
  function missingRecoveredModule() {},
  {
    apply() {
      return undefined;
    },
    construct() {
      return {};
    },
    get(_target, prop) {
      if (prop === 'default') return callable;
      if (prop === '__esModule') return true;
      return callable;
    },
  },
);

module.exports = callable;
module.exports.default = callable;
