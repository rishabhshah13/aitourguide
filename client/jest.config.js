// jest.config.js
module.exports = {
  // Other configurations...
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/", // This regex tells Jest to transform axios within node_modules
  ],
};
