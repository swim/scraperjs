const gulp = require('gulp');
const mocha = require('gulp-mocha');
const jshint = require('gulp-jshint');
const watch = require('gulp-watch');
const clean = require('gulp-clean');
const exec = require('child_process').exec;

const testServer = require('./test/setupServer');
const MOCHA_TIMEOUT_S = 10,
      MOCHA_TIMEOUT_MS = MOCHA_TIMEOUT_S * 1000,
      COVERAGE_THRESHOLD = 95;

let server = false;
let mochaOptions = {
    reporter: 'spec',
    timeout: MOCHA_TIMEOUT_MS
};
let tests = [
    'serve',
    'testAbstract', 
    'testStatic',
    'testDynamic',
    'testPromise',
    'testRouter',
    'testScraperError',
    'testCommandLine'
];

/**
 * @task
 * start server
 */
gulp.task('serve', () =>
    server = testServer(gulp)
);

/**
 * @task
 * stop server
 */
gulp.task('unserve', tests, () =>
    server.close()
);

/**
 * @task
 * run all tests
 */
gulp.task('test', ['unserve']);

/**
 * @task
 * watch all
 */
gulp.task('watch-all', ['serve', 'watch']);

/**
 * @task
 * run watcher
 */
gulp.task('watch', () =>
    gulp.watch(['src/**/*.js', 'test/**/*.js', 'Gruntfile.js'], ['jshint'])
);

/**
 * @task
 * run coverge
 */
gulp.task('coverage', () =>
    exec('istanbul cover ./node_modules/mocha/bin/_mocha -x src/PhantomWrapper.js -- -t ' + MOCHA_TIMEOUT_MS + ' --root src/ test/')
);
          
/**
 * @task
 * run coveralls
 */
gulp.task('coveralls', () =>
    gulp.src('istanbul cover ./node_modules/mocha/bin/_mocha -x src/PhantomWrapper.js --report lcovonly -- -t ' + MOCHA_TIMEOUT_MS + ' -x src/PhantomWrapper.js --root src/ test/ && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js')
);

/**
 * @task
 * check coverage
 */
gulp.task('check-coverage', () =>
    gulp.src('istanbul check-coverage --lines ' + COVERAGE_THRESHOLD + ' --statements ' + COVERAGE_THRESHOLD + ' --functions ' + COVERAGE_THRESHOLD + ' --branches ' + COVERAGE_THRESHOLD + ' ./coverage/coverage.json')
);

/**
 * @task
 * run linting & unit tests
 */
gulp.task('unit', ['jshint', 'test']);

/**
 * @task
 * run linting
 */
gulp.task('jshint', () =>
    gulp.src(['src/**/*.js', 'test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
);

/**
 * @task
 * run cleaning
 */
gulp.task('clean', () =>
    gulp.src('coverage/', {read: false})
        .pipe(clean())
);

/**
 * @task
 * Abstract test
 */
gulp.task('testAbstract', ['serve'], () =>
    gulp.src('test/AbstractScraper.js', {read: false})
        .pipe(mocha(mochaOptions))
);

/**
 * @task
 * Static test
 */
gulp.task('testStatic', ['serve'], () =>
    gulp.src('test/StaticScraper.js', {read: false})
        .pipe(mocha(mochaOptions))
);

/**
 * @task
 * Dynamic test
 */
gulp.task('testDynamic', ['serve'], () =>
    gulp.src('test/DynamicScraper.js', {read: false})
        .pipe(mocha(mochaOptions))
);

/**
 * @task
 * Promise test
 */
gulp.task('testPromise', ['serve'], () =>
    gulp.src('test/ScraperPromise.js', {read: false})
        .pipe(mocha(mochaOptions))
);

/**
 * @task
 * Router test
 */
gulp.task('testRouter', ['serve'], () =>
    gulp.src('test/Router.js', {read: false})
        .pipe(mocha(mochaOptions))
);

/**
 * @task
 * Error test
 */
gulp.task('testScraperError', ['serve'], () =>
    gulp.src('test/ScraperError.js', {read: false})
        .pipe(mocha(mochaOptions))
);

/**
 * @task
 * CLI test
 */
gulp.task('testCommandLine', ['serve'], () =>
    gulp.src('test/commandLine.js', {read: false})
        .pipe(mocha(mochaOptions))
);
