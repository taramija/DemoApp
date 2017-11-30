import gulp from 'gulp'
import sass from 'gulp-sass'
import browserSync from 'browser-sync'
import useref from 'gulp-useref'
import uglify from 'gulp-uglify'
import gulpIf from 'gulp-if'
import cssnano from 'gulp-cssnano'
import imagemin from 'gulp-imagemin'
import cache from 'gulp-cache'
import del from 'del'
import runSequence from 'run-sequence'
import babel from 'gulp-babel'
import sourcemaps from 'gulp-sourcemaps'
import concat from 'gulp-concat'
import eslint from 'gulp-eslint'
import browserify from 'browserify'
import babelify from 'babelify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import autoClose from 'browser-sync-close-hook'


// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('Hello Zell!');
})


// Development Tasks 
// -----------------

// Copy bootstrap css
// gulp.task('copyBootstrap', function() {
//   return gulp.src('node_modules/react/dist/react.js')
//     .pipe(newer('assets/js/src/vendor/react.js'))
//     .pipe(gulp.dest('assets/js/src/vendor'));
// });

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync.use({
    plugin() {},
    hooks: {
      'client:js': autoClose, // <-- important part 
    },
  })
  browserSync({
    server: {
        baseDir: 'build'
    }
  })
})


// Lint JS/JSX files
gulp.task('eslint', function() {
  return gulp.src('build/*.js')
    // eslint() attaches the lint output to the "eslint" property 
    // of the file object so it can be used by other modules. 
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console. 
    // Alternatively use eslint.formatEach() (see Docs). 
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on 
    // lint error, return the stream and pipe to failAfterError last. 
    .pipe(eslint.failAfterError());
});

// Concatenate jsFiles.vendor and jsFiles.source into one JS file.
// Run eslint before concatenating
gulp.task('jsify', ['eslint'], function() {
  return browserify({entries: 'app/js/app.js', 
        extensions: ['.js'], debug: true})
        .transform(babelify)
        .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init())
    // .pipe(concat('bundle.js'))
    .pipe(uglify())
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
});

gulp.task('concatJs', ['jsify'], function() {
  return gulp.src(['app/js/vendor/*.js','build/bundle.js'])
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
});

// Sass compilation
gulp.task('cssify', function() {
  return gulp.src([
    'node_modules/bootstrap/dist/css/bootstrap.css',
    'app/scss/*.scss']) // Gets all files ending with .scss in app/scss and children dirs
    // .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(concat('bundle.css'))
    .pipe(postcss([autoprefixer()]))
    // .pipe(cssnano())
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build')) // Outputs it in the css folder
    .pipe(browserSync.stream());
})


// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
// gulp.task('useref', function() {

//   return gulp.src('app/*.html')
//     .pipe(useref())
//     // .pipe(gulpIf('*.js', uglify()))
//     .pipe(gulpIf('*.css', cssnano()))
//     .pipe(gulp.dest('build'))
// })

// Optimizing Images 
gulp.task('copyImg', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('build/images'));
})

//Copy static files from html folder to build folder
gulp.task("copyHtml", function(){
    return gulp.src("app/*.html")
    .pipe(gulp.dest("build"))
    .pipe(browserSync.stream());
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))
})

// Cleaning 
gulp.task('clean', function() {
  return del.sync('build').then(function(cb) {
    return cache.clearAll(cb);
  })
})

gulp.task('clean:build', function() {
  return del.sync(['build/**/*', '!build/images', '!build/images/**/*']);
})

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['build', 'browserSync'], 'watch',
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:build','copyHtml', 'copyImg', 'fonts','cssify','concatJs',
    callback
  )
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['cssify']);
  gulp.watch('app/*.html', ['copyHtml']);
  gulp.watch('app/js/**/*.js', ['concatJs']);
})