'use strict';

// Load plugins
const gulp 		    = require("gulp"),
	  browsersync   = require("browser-sync").create(), // WAS
	  sass 		    = require("gulp-sass"), // SASS
	  fileinclude   = require('gulp-file-include'), // HTML
	  sourcemaps    = require("gulp-sourcemaps"), // Sass, Js sourcemaps
	  babel         = require('gulp-babel'), // JS Babel
	  del	 	    = require('del'), // Dist Reset
	  htmlbeautify  = require('gulp-html-beautify'), // HTML Comfile Beautiy
	//   replace       = require('gulp-html-replace'), // HTML replace
	  replaceImage	= require('gulp-replace-image-src'),
	  imagemin      = require('gulp-imagemin'); // 이미지 최적화

// Folder
const root = './webapp/';
const dist = './webapp/dist';
const dir          = {
	// 개발 경로
	src_scss     : root + 'src/sass',
	src_js       : root + 'src/js',
	src_html     : root + 'src/html',
	src_images   : root + 'src/images',
	src_fonts	 : root + 'src/fonts',
	src_plugin   : root + 'src/plugin',
	src_coding_list   : root + 'src/coding_list',
 
	// 컴파일 경로
	dist_css     : dist + '/npass/css',
	dist_js      : dist + '/npass/js',
	dist_lib  	 : dist + '/npass/lib',
	dist_html    : dist + '/html',
	dist_images  : dist + '/npass/img',
	dist_fonts   : dist + '/npass/fonts',
	dist_coding_list   : dist + '/coding_list',
}



// BrowserSync Reload
function reload(){
	browsersync.reload();
}

// 이미지 최적화 -> DIST 이동
gulp.task('imagemin', () => {
	return new Promise(resolve => {
		gulp.src([
			dir.src_images + '/**/*.jpg',
			dir.src_images + '/**/*.gif',
			dir.src_images + '/**/*.png'
		], {allowEmpty: true})
		.pipe(imagemin())
		.pipe(gulp.dest(dir.dist_images))
		.pipe(browsersync.reload({ // 실시간 reload
			stream : true
		}))
		console.log('이미지 최적화 DIST 이동');
		resolve();
	});
});

/** * ==============================+ * @SCSS : SCSS Config(환경설정) * ==============================+ */ 
const scssOptions = { 
	/** 
	 * outputStyle (Type : String , Default : nested) 
	 * CSS의 컴파일 결과 코드스타일 지정 
	 * Values : nested, expanded, compact, compressed 
	 **/ 
	outputStyle : "compactnp", 
	/** 
	 * indentType (>= v3.0.0 , Type : String , Default : space) 
	 * 컴파일 된 CSS의 "들여쓰기" 의 타입 * Values : space , tab 
	 **/ 
	indentType : "tab", 
	/** 
	 * indentWidth (>= v3.0.0, Type : Integer , Default : 2) 
	 * 컴파일 된 CSS의 "들여쓰기" 의 갯수 
	 **/ 
	indentWidth : 1, // outputStyle 이 nested, expanded 인 경우에 사용 
	/** 
	 * precision (Type : Integer , Default : 5) 
	 * 컴파일 된 CSS 의 소수점 자리수. 
	 **/ 
	precision: 6, 
	/** 
	 * sourceComments (Type : Boolean , Default : false) 
	 * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시. 
	 **/
	sourceComments: false 
};

// SASS 컴파일
gulp.task('sass', () => {
	return new Promise(resolve => {
		gulp.src([
			dir.src_scss + '/*.sass',
			'!' + dir.src_scss + '/config.sass' // 셋팅파일 컴파일 제외
		], {allowEmpty: true})
		.pipe(sourcemaps.init())
		.pipe(sass(scssOptions).on('error', sass.logError))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(dir.dist_css))
		.pipe(browsersync.reload({ // 실시간 reload
			stream : true
		}))
		console.log('SASS Compile');
		resolve();
	});
});

gulp.task('fileinclude', () => {
	return new Promise(resolve => {
		gulp.src([
			dir.src_html + '/**/*.html',
			'!'+dir.src_html + '/include/*.html'
		], {base : dir.src_html})
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(htmlbeautify())
		.pipe(gulp.dest(dir.dist_html))
		.pipe(browsersync.reload({ // 실시간 reload
			stream : true
		}))
		console.log('HTML Compile');
		resolve();
	});
});

gulp.task('babel', () => {
	return new Promise(resolve => {
		gulp.src(dir.src_js + '/*.js', {allowEmpty: true})
		.pipe(sourcemaps.init())
		.pipe(babel({
			"presets": ["@babel/env"]
		}))
		.pipe(sourcemaps.write('./maps'))
		
		.pipe(gulp.dest(dir.dist_js))
		.pipe(browsersync.reload({ // 실시간 reload
			stream : true
		}))
		console.log('JS Babel Compile');
		resolve();
	});
});

// File Move
gulp.task('json', () => {
	return new Promise(resolve => {
		gulp.src([
			dir.src_js + '/*.json',
		], {allowEmpty: true})
		.pipe(gulp.dest(dir.dist_js))
		.pipe(browsersync.reload({ // 실시간 reload
			stream : true
		}))
		resolve();
	});
});
gulp.task('codingList', () => {
	return new Promise(resolve => {
		gulp.src(dir.src_coding_list + '/**/*', {allowEmpty: true})
		.pipe(gulp.dest(dir.dist_coding_list))
		.pipe(browsersync.reload({ // 실시간 reload
			stream : true
		}))
		resolve();
	});
});
gulp.task('fonts', () => {
	return new Promise(resolve => {
		gulp.src(dir.src_fonts + '/*', {allowEmpty: true})
		.pipe(gulp.dest(dir.dist_fonts))
		resolve();
	});
});
gulp.task('media', () => {
	return new Promise(resolve => {
		gulp.src([
			dir.src_images + '/**/*.svg',
			dir.src_images + '/**/*.mp4',
			dir.src_images + '/**/*.ico'
		], {allowEmpty: true})
		.pipe(gulp.dest(dir.dist_images))
		.pipe(browsersync.reload({ // 실시간 reload
			stream : true
		}))
		resolve();
	});
});


// Library Dist Move
gulp.task('sassMove', () => {
	return new Promise(resolve => {
		gulp.src([
			dir.src_scss + '/**/*.sass',
		], {allowEmpty: true})
		.pipe(gulp.dest(dist + '/assets/sass'))
		resolve();
	});
});
gulp.task('jquery', () => {
	return new Promise(resolve => {
		gulp.src([
			'node_modules/jquery/dist/*.js'
		], {allowEmpty: true})
		.pipe(gulp.dest(dir.dist_lib + '/jquery/'))
		resolve();
	});
});
gulp.task('swiper', () => {
	return new Promise(resolve => {
		gulp.src([
			'node_modules/swiper/*.js',
			'node_modules/swiper/*.css'
		], {allowEmpty: true})
		.pipe(gulp.dest(dir.dist_lib + '/swiper/'))
		resolve();
	});
});


// Clean
gulp.task('clean', () => {
	return new Promise(resolve => {
		del.sync([
			dist + '/npass/',
			dist + '/assets/',
			dir.dist_html,
			dir.dist_coding_list
		], {
			force: true
		});
		console.log('배포폴더 초기화');
		resolve();
	});
});


// 실시간 감지
gulp.task('watch', () => {
	return new Promise(resolve => {
		gulp.watch(dir.src_html + '/**/*.html', gulp.series(['fileinclude']));
		gulp.watch(dir.src_images, gulp.series(['imagemin']));
		gulp.watch(dir.src_js + '/**/*.js', gulp.series(['babel']));
		gulp.watch(dir.src_scss + '/**/*.sass', gulp.series(['sass']));

		// File Move
		gulp.watch(dir.src_images, gulp.series(['media']));
		gulp.watch(dir.src_js, gulp.series(['json']));
		gulp.watch(dir.src_coding_list, gulp.series(['codingList']));
		
		resolve();
	});
});

// WAS
gulp.task('browserSync', () => {
	return new Promise(resolve => {
		browsersync.init({
			server : {
				baseDir : dist
			},
			port : 80
		});
	});
});

var allSeries = gulp.series([
	'clean',

	// Library Dist Move
	'jquery',
	'swiper',
	'sassMove',

	// File Move
	'media',
	'codingList',
	'fonts',
	'json',

	// ===================================
	'fileinclude',
	'imagemin',
	'sass',
	'babel',

	
	
	'watch',
	'browserSync'
]);

var allSeries2 = gulp.series([
	// 'clean',

	// Library Dist Move
	'jquery',
	'swiper',
	'sassMove',

	// File Move
	'media',
	'codingList',
	'fonts',
	'json',

	// ===================================
	'fileinclude',
	'imagemin',
	'sass',
	'babel',

	
	
	// 'watch',
	// 'browserSync'
]);

gulp.task('default', allSeries);

gulp.task('bs', allSeries2)