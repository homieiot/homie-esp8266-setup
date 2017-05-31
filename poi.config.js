module.exports = (options, req) => ({
  entry: './src/index.js',
  homepage: './', // overwrite homepage from package.json (to use relative URLs)
  copy: { from: './static/*', to: './dist/*' },
  html: {
    template: './index.html'
  }
})
