import gulp from 'gulp';
import babel from 'gulp-babel';

gulp.task('default', () =>
	gulp.src('./src/**/*')
		.pipe(babel())
		.pipe(gulp.dest('./lib'))
);
