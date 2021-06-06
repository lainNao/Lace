const removeImports = require("next-remove-imports")();

module.exports = removeImports({
  webpack: (config) => Object.assign(config, {
    target: 'electron-renderer',
  }),
});