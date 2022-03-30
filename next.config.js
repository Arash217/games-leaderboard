const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./'],
    prependData: `
      @import "${path.join(__dirname, 'styles/variables.scss')}";
      @import "${path.join(__dirname, 'styles/buttons.scss')}";
      @import "${path.join(__dirname, 'styles/inputs.scss')}";
      @import "${path.join(__dirname, 'styles/typography.scss')}";
    `,
  }
}

module.exports = nextConfig
