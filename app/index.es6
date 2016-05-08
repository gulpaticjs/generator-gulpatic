const Base = require('yeoman-generator').Base;

class MyBase extends Base {
  copyFiles(files) {
    files.forEach((file) => {
      if (typeof file === 'string') {
        this.fs.copy(this.templatePath(file), this.destinationPath(file));
      } else {
        // Rename file
        this.fs.copy(this.templatePath(file[0]), this.destinationPath(file[1]));
      }
    });
  }

  copyTplFiles(files) {
    const config = this.config.getAll();

    files.forEach((file) => {
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), config);
    });
  }
}

class GulpaticGenerator extends MyBase {
  prompting() {
    const done = this.async();
    const config = this.config.getAll();

    const prompts = [
      {
        name: 'name',
        message: 'name:',
        default: config.name || this.appname,
      },
      {
        name: 'version',
        message: 'version:',
        default: config.version || '1.0.0',
      },
      {
        name: 'description',
        message: 'description:',
        default: config.description || null,
      },
      {
        name: 'homepage',
        message: 'homepage:',
        default: config.homepage || null,
      },
      {
        name: 'gitRepository',
        message: 'git repository:',
        default: config.gitRepository || null,
      },
      {
        name: 'authorName',
        message: 'author name:',
        default: config.authorName || this.user.git.name(),
      },
      {
        name: 'authorEmail',
        message: 'author email:',
        default: config.authorEmail || this.user.git.email(),
      },
      {
        name: 'authorUrl',
        message: 'author url:',
        default: config.authorUrl || null,
      },
      {
        name: 'license',
        message: 'How is your project licensed?',
        default: config.license || 'MIT',
      },
    ];

    this.prompt(prompts, (answers) => {
      // Cache answers
      Object.keys(answers).forEach(answer => this.config.set(answer, answers[answer]));
      done();
    });
  }

  configuring() {
    // Copy metadata files
    const files = [
      ['babelrc', '.babelrc'],
      ['bowerrc', '.bowerrc'],
      ['editorconfig', '.editorconfig'],
      ['eslintrc', '.eslintrc'],
      ['gitattributes', '.gitattributes'],
      ['gitignore', '.gitignore'],
      ['nvmrc', '.nvmrc'],
    ];
    this.copyFiles(files);
  }

  get writing() {
    return {
      app() {
        const files = [
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
          'app/src/views/index.twig',
        ];
        this.copyFiles(files);

        const filesTpl = ['app/src/views/data.json'];
        this.copyTplFiles(filesTpl);
      },

      gulpfile() {
        // Copy gulp files
        const files = [
          'gulpfile.babel.js/config/browsersync.js',
          'gulpfile.babel.js/config/htmlmin.js',
          'gulpfile.babel.js/config/imagemin.js',
          'gulpfile.babel.js/config/postcss.js',
          'gulpfile.babel.js/config/sass.js',
          'gulpfile.babel.js/config/uglify.js',
          'gulpfile.babel.js/config/webpack.js',
          'gulpfile.babel.js/index.js',
          'gulpfile.babel.js/paths.js',
        ];
        this.copyFiles(files);
      },

      bower() {
        this.copyTplFiles(['bower.json']);
      },

      license() {
        if (this.config.get('license') === 'MIT') {
          this.copyTplFiles(['license']);
        }
      },

      package() {
        this.copyTplFiles(['package.json']);
      },

      readme() {
        this.copyTplFiles(['readme.md']);
      },
    };
  }

  install() {
    this.installDependencies();
  }
}

module.exports = GulpaticGenerator;
