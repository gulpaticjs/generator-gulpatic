// Modules
import gulp from 'gulp';
import fs from 'fs';
import del from 'del';
import browserSync from 'browser-sync';
import runSequence from 'run-sequence';
import webpack from 'webpack-stream';
import gulpLoadPlugins from 'gulp-load-plugins';

// Init modules
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Get configs
import paths from './paths';
import imageMinConfig from './config/imagemin';
import webpackConfig from './config/webpack';
import sassConfig from './config/sass';
import postCssConfig from './config/postcss';
import browserSyncConfig from './config/browsersync';
import uglifyConfig from './config/uglify';
import htmlMinConfig from './config/htmlmin';

// Set configs
const NODE_ENV = process.env.NODE_ENV || 'development';
const devMode = NODE_ENV === 'development';
const currentDistPath = devMode ? paths.tempFolder : paths.buildFolder;

// CLEAN TASK
// Delete all files in current dist folder and images temp folder
gulp.task('clean', () =>
  del.sync([
    '!/.gitkeep',
    `${currentDistPath}/*`,
    `${paths.imagesPath}/${paths.tempFolder}/*`,
  ])
);

// COPY TASK
// Copy all files from public folder
gulp.task('copy', () =>
  gulp.src(`${paths.publicPath}/**/*`, { dot: true })
    .pipe($.size({ title: 'copy' }))
    .pipe(gulp.dest(currentDistPath))
);

// IMAGES TASK
// Optimize images
gulp.task('images', () =>
  gulp.src(`${paths.imagesPath}/**/*`)
    .pipe($.cache($.imagemin(imageMinConfig)))
    .pipe(gulp.dest(`${currentDistPath}/${paths.imagesFolder}`))
    .pipe($.size({ title: 'images' }))
    .pipe(gulp.dest(`${paths.imagesPath}/${paths.tempFolder}`))
);

// SCRIPTS TASK
// Compile js files with webpack
gulp.task('scripts', () =>
  gulp.src(`${paths.scriptsPath}/main.js`)
    .pipe($.plumber({
      errorHandler: $.notify.onError({
        title: 'Scripts task failed',
        message: '<%= error.message %>',
      }),
    }))
    .pipe(webpack(webpackConfig))
    .pipe($.size({ title: 'scripts' }))
    .pipe(gulp.dest(`${currentDistPath}/${paths.scriptsFolder}`))
);

// STYLES TASK
// Compile sass files and transform generated styles with postcss plugins
gulp.task('styles', () =>
  gulp.src(`${paths.stylesPath}/**/*.scss`)
    .pipe($.plumber({
      errorHandler: $.notify.onError({
        title: 'Styles task failed',
        message: '<%= error.message %>',
      }),
    }))
    .pipe($.if(devMode, $.sourcemaps.init()))
    .pipe($.sass(sassConfig))
    .pipe($.postcss(postCssConfig))
    .pipe($.if(devMode, $.sourcemaps.write()))
    .pipe($.if(devMode, reload({ stream: true })))
    .pipe($.size({ title: 'styles' }))
    .pipe(gulp.dest(`${currentDistPath}/${paths.stylesFolder}`))
);

// VIEWS TASK
// Compile twig files
gulp.task('views', () =>
  gulp.src([`${paths.viewsPath}/**/*.twig`, '!**/_*.twig'])
    .pipe($.plumber({
      errorHandler: $.notify.onError({
        title: 'Views task failed',
        message: '<%= error.message %>',
      }),
    }))
    .pipe($.data(() => JSON.parse(fs.readFileSync(`${paths.viewsPath}/data.json`))))
    .pipe($.twig())
    .pipe($.size({ title: 'views' }))
    .pipe(gulp.dest(`${currentDistPath}`))
);

// USEREF TASK
// Optimize assets
gulp.task('useref', () => {
  if (devMode) return;

  gulp.src(`${currentDistPath}/*.html`)
    .pipe($.useref())
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.js', $.uglify(uglifyConfig))
    )
    .pipe($.if('*.html', $.htmlmin(htmlMinConfig)))
    .pipe(gulp.dest(`${currentDistPath}`));
});

// SERVE TASK
gulp.task('serve', ['clean'], cb =>
  runSequence(
    'copy',
    ['images', 'scripts', 'styles'],
    'views',
    cb
  )
);

// DEFAULT TASK
gulp.task('default', ['serve'], () => {
  browserSync(Object.assign({
    server: {
      baseDir: currentDistPath,
    },
  }, browserSyncConfig));
  gulp.watch(`${paths.publicPath}/**/*`, ['copy', reload]);
  gulp.watch(`${paths.imagesPath}/**/*`, ['images', reload]);
  gulp.watch(`${paths.scriptsPath}/**/*.js`, ['scripts', reload]);
  gulp.watch(`${paths.stylesPath}/**/*.scss`, ['styles']);
  gulp.watch(`${paths.viewsPath}/**/*.twig`, ['views', reload]);
});

// BUILD TASK
gulp.task('build', cb => {
  runSequence(
    'serve',
    'useref',
    cb
  );
});

// DEPLOY TASK
// Deploy github page
gulp.task('deploy:gh-page', ['build'], () =>
  gulp.src(`${currentDistPath}/**/*`)
    .pipe($.ghPages())
);
