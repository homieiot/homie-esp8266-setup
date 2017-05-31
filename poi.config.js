module.exports = (options, req) => ({
  entry: './src/index.js',
  homepage: './', // overwrite homepage from package.json (to use relative URLs)
  html: {
    template: './index.html'
  }
})
