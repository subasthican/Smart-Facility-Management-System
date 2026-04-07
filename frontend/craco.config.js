module.exports = {
  style: {
    postcss: {
      mode: "extends",
      plugins: [
        { plugin: require("tailwindcss"), options: {} },
        { plugin: require("autoprefixer"), options: {} },
      ],
    },
  },
};
