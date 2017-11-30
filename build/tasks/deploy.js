var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var runSequence = require('run-sequence');
gulp.copy = function(src, dest) {
    return gulp.src(src, {
            base: "."
        })
        .pipe(gulp.dest(dest));
};

gulp.task('deploy', function(callback) {
    runSequence(['copy-assets', 'copy-pages', 'copy-images', 'copy-favicon', 'copy-cname', 'copy-config'],
        'push-to-gh-pages',
        callback);
});

gulp.task('copy-assets', function() {

    return gulp.src(['assets/**/*']).pipe(gulp.dest('dist/assets'));

});
gulp.task('copy-pages', function() {

    return gulp.src(['pages/**/*']).pipe(gulp.dest('dist/pages'));

});
gulp.task('copy-images', function() {

    return gulp.src(['images/**/*']).pipe(gulp.dest('dist/images'));

});
gulp.task('copy-config', function() {

    return gulp.src(['config/**/*']).pipe(gulp.dest('dist/config'));

});
gulp.task('copy-favicon', function() {

    return gulp.src(['favicon.ico']).pipe(gulp.dest('dist/'));

});
gulp.task('copy-cname', function() {
    return gulp.src(['CNAME']).pipe(gulp.dest('dist/'));
})
gulp.task('push-to-gh-pages', function() {
    return gulp.src('./dist/**/*')
        .pipe(ghPages({
            remoteUrl: 'https://github.com/vinaas/cafenews-cms.git'
        }));
});