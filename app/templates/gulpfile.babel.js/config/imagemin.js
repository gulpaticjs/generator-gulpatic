import pngquant from 'imagemin-pngquant';

export default {
  progressive: true,
  interlaced: true,
  use: [pngquant()],
  svgoPlugins: [
    { cleanupIDs: false },
    { removeTitle: true },
    { removeDimensions: true },
    { mergePaths: false },
    { removeStyleElement: true },
    {
      removeAttrs: {
        attrs: ['fill', 'fill-rule'],
      },
    },
  ],
};
