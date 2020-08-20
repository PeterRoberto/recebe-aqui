var gulp = require('gulp'); 
var less = require('gulp-less'); 
var path = require('path');
var autoPrefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat'); 
var uglify = require('gulp-uglify');  
var validator = require('gulp-html');
var phpConnect = require('gulp-connect-php');
var browserSync = require("browser-sync");


function html(done) {
  gulp.src('*.html')
  .pipe(browserSync.stream())
  done();
}



function css(done) {
  gulp.src('./assets/less/*.less')
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(autoPrefixer('last 2 versions'))
  .pipe(concat('style.css'))     
  .pipe(browserSync.stream())
  .pipe(gulp.dest('./css'));
  done();
}


function js(done) {
  gulp.src('./assets/js/*.js')   
    .pipe(concat('scripts-main.js'))  
    .pipe(uglify())
    .pipe(browserSync.stream())
    .pipe(gulp.dest('./js')); 
  done();
}


function connectsync() {
  phpConnect.server({
      port: 8000,
      keepalive: true,
      base: "."
  }, function (){
    // browserSync({
    //   proxy: '127.0.0.1:8000'  // Se for site em PHP descomente esse trecho  
    // });
    
  });
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watchFiles() {
  gulp.watch('./assets/less/*.less', gulp.series(css));
  gulp.watch('./assets/js/*.js', gulp.series(js));  
  gulp.watch('*.php', browserSyncReload); 
  gulp.watch("*.html", html); 
  browserSync.init({   // Se não for site html comente esse trecho
    server: {
      baseDir: "./"
    }
  }); // Se não for site html comente esse trecho 
}


const watch = gulp.parallel([watchFiles, connectsync]);
exports.default = watch;
