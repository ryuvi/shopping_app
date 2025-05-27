module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
            "@db": "./src/db",
            "@shared": "./src/screens/shared",
          },
        }
      ],
      ["inline-import", { extensions: [".sql"] }]
    ],
  };
};