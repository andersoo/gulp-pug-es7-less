# gulp-pug-es7-less

This projects build a simple static site, with only static assets, you can host it on any http server you want.

Except it's not that old school, it uses gulp to manage the dev env and dist build, uses pug for html templating, less for css, and capable of compiling es7 to javascript, too. In production, assets are bundled, minified, and revved to speed up loading and allow usage of cache.

Jquery slim is included, using Fetch to manage the AJAX calls, BootstrapV4 is included for css scaffolding. 



## Installation
1. Install node modules

  ```sh
  npm install
  ```

2. Install vendor modules via Bower

  ```sh
  bower install
  ```

## Usage

### Development

In development, the `src` is built into a directory name `public` and served by `connect`. The `public` directory is actually ready for host as well, but the `dist` version is more optimized.

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

