import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import minify from 'gulp-htmlmin';
import htmlmin from 'gulp-htmlmin';
import del from 'del';
import browser from 'browser-sync';

// Stylesnpm install

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}
// HTML
const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}
// Scripts
const script = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}

// Images
const optimizeImages = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/images'))
  }
const copyImages = () => {
    return gulp.src('source/images/**/*.{png,jpg}')
    .pipe(gulp.dest('build/images/'))
  }

// WebP
const createWebp = () => {
  return gulp.src('source/images/**/*.{png,jpg}')
  .pipe(squoosh({
  webp: {}
  }))
  .pipe(gulp.dest('build/images'))
  }

// SVG
const svg = () =>
gulp.src('source/images/*.svg')
.pipe(svgo())
.pipe(gulp.dest('build/images'));

const sprite = () => {
  return gulp.src('source/images/icons/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
  inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
  }

// Copy

const copy = (done) => {
  gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  'source/images/favicons/*.png',
  'source/manifest.webmanifest',
  ], {
  base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
  }
// Clean
const clean = () => {
  return del('build');
  };

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload
const reload = (done) => {
  browser.reload();
  done();
  }

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(script));
  gulp.watch('source/*.html', gulp.series(html)).on('change', browser.reload);
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
  styles,
  html,
  script,
  svg,
  sprite,
  createWebp
  ),
  );

// Default
export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
  styles,
  html,
  script,
  svg,
  sprite,
  createWebp
  ),
  gulp.series(
  server,
  watcher
));

