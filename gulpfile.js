const gulp = require('gulp');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglifycss = require('gulp-uglifycss');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');

const path = {
	src: {
		html: './src/index.html',
		js: './src/assets/js/',
		css: './src/assets/style/',
		img: './src/assets/img/'
	},
	public: {
		main: './public/',
		js: './public/assets/js/',
		css: './public/assets/style/',
		img: './public/assets/img/'
	},
};

gulp.task('clean', done => {
	gulp.src(`${path.public.main}*`)
		.pipe(clean());
	done();
});

gulp.task('scss', done => {
	gulp.src(`${path.src.css}main.scss`)
		.pipe(scss())
		.pipe(autoprefixer())
		.pipe(uglifycss())
		.pipe(gulp.dest(path.public.css));
	done();
});

gulp.task('js', done => {
	gulp.src(`${path.src.js}*.js`)
		.pipe(concat('all.js'))
	 	.pipe(babel({
            presets: ['@babel/env']
        }))
		.pipe(uglify())
		.pipe(gulp.dest(path.public.js));
	done();
});

gulp.task('copy', done => {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.public.main));
    done();
});

gulp.task('imgmin', done =>
    gulp.src(`${path.src.img}*`)
        .pipe(imagemin())
        .pipe(gulp.dest(path.public.img))
);

gulp.task('watch', () => {
	gulp.watch(`${path.src.css}**/*.{scss,css}`, gulp.series('scss'));
	gulp.watch(`${path.src.js}*.js`, gulp.series('js'));
	gulp.watch(`${path.src.img}*.png`, gulp.series('imgmin'));
});


gulp.task('build', gulp.series('clean', 'copy', 'scss', 'js', 'imgmin', 'watch'));