module.exports = {
  plugins: {
    tailwindcss: {},
    'vue-cli-plugin-tailwind/purgecss': {
      whitelistPatterns: [/(bg|text|border)-(dark|light)-/]
    },
    autoprefixer: {}
  }
}
