module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest", // Transform JavaScript files using Babel
  },
  testEnvironment: "node",
  testTimeout: 30000,
  setupFilesAfterEnv: ["./src/test/testSetup.js"],
}
