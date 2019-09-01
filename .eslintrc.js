module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  "globals": {
    "window": true
  },
  // add your custom rules here
  rules: {
    "no-tabs": ["off"],
    "indent": ["off"],
    "eol-last": "off",
    "func-names": "off",
    "max-len": "off",
    "no-param-reassign": ["error", { "props": false }],
    "no-shadow": ["error", { "hoist": "never" }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}