# gulp-pug-es7-less

This project builds a simple static site, with only static assets, you can host it on any http server you want.

Except it's not that old school, it uses [Gulp](http://gulpjs.com/) to manage the dev env and dist build, uses [Pug](https://pugjs.org/api/getting-started.html) for html templating, [LESS](http://lesscss.org/) for CSS, and capable of [compiling ES7](https://babeljs.io/docs/plugins/preset-es2017/) to Javascript, too. In production mode (dist build), assets are bundled, minified, and revved to speed up loading and allow usage of server cache.

Please note that [jQuery slim](http://jquery.com/download/) is included, AJAX and animation features are trimmed in favor of CSS animations and Fetch. I also included the [Fetch Polypill](https://github.com/github/fetch) to help managing AJAX calls.

Lastly, [BootstrapV4](https://v4-alpha.getbootstrap.com/) is included for css scaffolding. Since V4 no longer include a glyph set, [FontAwesome4](http://fontawesome.io/) is included.

A [Yeoman generator](http://yeoman.io/) is made for an easier bootstrapping of this template, for example, you can choose to exclude the templating languages, or use the full version of jQuery. The generator's git is available [here](https://github.com/andersoo/generator-gulp-static), the command for using the generator is also available at the end of this page, click [here](#yeoman-generator-usage).


## Installation
Install node modules via yarn

  ```sh
  yarn install
  ```

or via npm if you are not familiar with yarn
  ```sh
  npm install
  ```


## Usage

### Development

In development, the `src` is built into a directory named `public` and served by `gulp-connect`. The `public` directory is actually ready for server hosting as well, the `dist` version is just more optimized.

1. **To build** 

  ```sh
  gulp build
  ```

2. **To build and preview** 

  ```sh
  gulp serve
  gulp serve --port=PORT_NUMBER     # serve at a specific port
  gulp serve --allowlan             # allow devices on the lan network to access your hosted preview
  ```

3. **To show all available commands**
  ```sh
  gulp
  ```


### Production (Distribution)

In production, the html is minimized, js and css files are concatenated and minified, imagemin is also used to compress/optimize the images. The result files are placed in a directory named `dist`

1. **To compress**  `public` **into** `dist` 

  ```sh
  #The are multiple options:

  # Complete build
  gulp build --all

  # Compress html/js/css files only
  gulp dist #or
  gulp build --dist

  # Compress images only
  gulp build --img #or
  gulp build --images

  ```

2. **To preview the `dist`**

  ```sh
  gulp serve --dist
  ```

#### Server Scripts

In some cases, it may be difficult to install a global bower/gulp on your server, npm commands that uses local node modules to install and build are available as well

1. To install Bower components

  ```sh
  npm run bower   # equivalent to  `bower install`
  ```

2. To build 

  ```sh
  npm run build   # equivalent to `gulp build --all`
  ```


## Yeoman Generator Usage

First, install yo and the generator
```bash
npm install -g yo
npm install -g generator-gulp-static
```
Then generate your new project:

```bash
yo gulp-static
```
