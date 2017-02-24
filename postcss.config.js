module.exports = {
  plugins: {
    'postcss-import': {
      root: __dirname,
    },
    'postcss-mixins': {},
    'postcss-each': {},
    'postcss-cssnext': {
      features: {
        customProperties: {
          variables: {
            'color-primary': '#619e35',
          },
        },
      },
    },
  },
};
