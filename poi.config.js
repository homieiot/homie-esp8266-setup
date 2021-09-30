module.exports = (options, req) => ({
  entry: './src/index.js',
  homepage: './', // overwrite homepage from package.json (to use relative URLs)
  html: {
    template: './index.html'
  },
   env: {
    HEAD_TITLE: 'Set up your Homie for ESP8266 device',
    TITLE: 'Homie for ESP8266',
    SUBTITLE: 'Set up your device.',
    DESCRIPTION: 'Connect to your device Wi-Fi AP. It should be named something like <strong>Homie-123456abcdef</strong>.<br/>Note this configurator is only for Homie for ESP8266 v2. The v1 configurator is available <a href="https://github.com/marvinroger/homie-esp8266/releases/download/v1.5.0/homie-esp8266-v1-setup.zip">here</a>.'
  }
})
