export default {
  devtool: 'cheap-module-inline-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/, loader: 'babel',
      },
    ],
  },
  resolve: {
    modulesDirectories: ['node_modules', 'app/public/bower_components'],
  },
  output: {
    filename: '[name].js',
  },
};
