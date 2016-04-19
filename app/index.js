var _ = require('lodash');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  _copyFiles: function (files) {
    files.forEach(function (file) {
      this.fs.copy(this.templatePath(file), this.destinationPath(file));
    }.bind(this));
  },

  _copyTplFiles: function (files) {
    var config = this.config.getAll();

    files.forEach(function (file) {
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), config);
    }.bind(this));
  },

  constructor: function () {
    generators.Base.apply(this, arguments);
  },

  // Your initialization methods (checking current project state, getting configs, etc)
  initializing: function () {

  },

  // Where you prompt users for options (where you'd call this.prompt())
  prompting: function () {
    var done = this.async();
    var config = this.config.getAll();

    var prompts = [
      {
        name: 'name',
        message: 'name:',
        default: config.name || this.appname
      },
      {
        name: 'version',
        message: 'version:',
        default: config.version || '1.0.0'
      },
      {
        name: 'description',
        message: 'description:',
        default: config.description || null
      },
      {
        name: 'homepage',
        message: 'homepage:',
        default: config.homepage || null
      },
      {
        name: 'gitRepository',
        message: 'git repository:',
        default: config.gitRepository || null
      },
      {
        name: 'authorName',
        message: 'author name:',
        default: config.authorName || this.user.git.name()
      },
      {
        name: 'authorEmail',
        message: 'author email:',
        default: config.authorEmail || this.user.git.email()
      },
      {
        name: 'authorUrl',
        message: 'author url:',
        default: config.authorUrl || null
      },
      {
        name: 'license',
        message: 'How is your project licensed?',
        default: config.license || 'MIT'
      }
    ];

    this.prompt(prompts, function (answers) {
      // Cache answers
      for (var answer in answers) {
        if (answers.hasOwnProperty(answer)) {
          this.config.set(answer, answers[answer]);
        }
      }

      done();
    }.bind(this));
  },

  // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
  configuring: function () {
    // Copy metadata files
    var files = [
      '.babelrc',
      '.bowerrc',
      '.editorconfig',
      '.eslintrc',
      '.gitattributes',
      '.gitignore',
      '.nvmrc'
    ];
    this._copyFiles(files);
  },

  // If the method name doesn't match a priority, it will be pushed to this group.
  default: function () {
  },

  // Where you write the generator specific files (routes, controllers, etc)
  writing: {
    app: function () {
      var files = [
        'app/public/bower_components/.gitkeep',
        'app/public/fonts/.gitkeep',
        'app/src/images/.tmp/.gitkeep',
        'app/src/images/.gitkeep',
        'app/src/scripts/.gitkeep',
        'app/src/scripts/main.js',
        'app/src/styles/.gitkeep',
        'app/src/styles/styles.scss',
        'app/src/views/layout/_base.twig',
        'app/src/views/.gitkeep',
        'app/src/views/index.twig'
      ];
      this._copyFiles(files);

      files = ['app/src/views/data.json'];
      this._copyTplFiles(files);
    },

    gulpfile: function () {
      // Copy gulp files
      var files = [
        'gulpfile.babel.js/config/browsersync.js',
        'gulpfile.babel.js/config/htmlmin.js',
        'gulpfile.babel.js/config/imagemin.js',
        'gulpfile.babel.js/config/postcss.js',
        'gulpfile.babel.js/config/sass.js',
        'gulpfile.babel.js/config/uglify.js',
        'gulpfile.babel.js/config/webpack.js',
        'gulpfile.babel.js/index.js',
        'gulpfile.babel.js/paths.js'
      ];
      this._copyFiles(files);
    },

    bower: function () {
      this._copyTplFiles(['bower.json'])
    },

    license: function () {
      if (this.config.get('license') === 'MIT') {
        this._copyTplFiles(['license']);
      }
    },

    package: function () {
      this._copyTplFiles(['package.json'])
    },

    readme: function () {
      this._copyTplFiles(['readme.md'])
    }
  },

  // Where conflicts are handled (used internally)
  conflicts: function () {

  },

  // Where installation are run (npm, bower)
  install: function () {
    this.installDependencies();
  },

  // Called last, cleanup, say good bye, etc
  end: function () {

  }
});

