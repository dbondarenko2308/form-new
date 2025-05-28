const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()
const bssi = require('browsersync-ssi')
const ssi = require('ssi')
const plumber = require('gulp-plumber')
const del = require('del')
const formatHtml = require('gulp-format-html')
const extReplace = require('gulp-ext-replace')
const webpLast = require('gulp-webp')

/* Build HTML */

async function buildhtml() {
	let includes = new ssi('app/', 'build/', '/**/*.html')
	includes.compile()

	del('build/parts', { force: true })

	return src('build/*.html').pipe(formatHtml()).pipe(dest('build'))
}

// Webp

function exportWebP() {
	return src(['app/images/*.jpg', 'app/images/*.png'], {
		base: 'app/images',
	})
		.pipe(webpLast())
		.pipe(extReplace('.webp'))
		.pipe(dest('./app/images/webp'))
		.pipe(browserSync.stream())
}
exports.exportWebP = exportWebP

// Style

function style() {
	return src('app/scss/style.scss')
		.pipe(plumber())
		.pipe(
			sass({
				outputStyle: 'expanded',
			}).on('error', sass.logError)
		)
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}
exports.css = style

// Watch

function watchFiles() {
	browserSync.init({
		server: {
			baseDir: 'app',
			middleware: bssi({ baseDir: 'app/', ext: '.html' }),
		},
		// server: true,
		notify: false,
		online: true,
	})

	watch('app/scss/**/*.scss', style)
	watch('app/images/*.{jpg,jpeg,png}', exportWebP)
	watch('app/**/*.html').on('change', browserSync.reload)
	watch('app/js/**/*.js').on('change', browserSync.reload)
}
exports.watch = watchFiles

/* Clean */

function clean() {
	return del('build/**/*', { force: true })
}

exports.clean = clean

/* Copy static */

function copy() {
	return src(
		['app/js/main.js', 'app/css/**/*', 'app/libs/**/*', 'app/fonts/**/*'],
		{ base: 'app/' }
	).pipe(dest('build'))
}

exports.copy = copy

function copyImagesWebp() {
	return src(['app/images/webp/*'], { base: 'app/images/webp' }).pipe(dest('build/images'))
}

exports.copyImagesWebp = copyImagesWebp

// Webp

// Exports

exports.build = series(clean, style, buildhtml, copyImagesWebp, copy)
exports.default = series(style, watchFiles)

// https://webdesign-master.ru/blog/tools/gulp-include-ssi.html
// http://htmlbook.ru/webserver/ssi/direktivy-ssi
