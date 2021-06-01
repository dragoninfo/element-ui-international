'use strict';

const { series, src, dest } = require('gulp');
const sass = require('gulp-sass');// gulp 编译 scss文件的插件
const autoprefixer = require('gulp-autoprefixer');// 根据设置浏览器版本自动处理浏览器前缀的插件
const cssmin = require('gulp-cssmin');// 压缩css文件的插件
// 新建 compile 任务
function compile() {
  // 匹配所有的 src目录下的 scss 文件
  return src('./src/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: ['ie > 9', 'last 2 versions'], // 兼容 ie9 以上的版本  以及 其他浏览器最后的2个版本
      cascade: false // 文件不缓存
    }))
    .pipe(cssmin())// 编译后的scss文件进行压缩
    .pipe(dest('./lib'));// 将编译后的文件放在 lib 目录下
}
// iconfont 图标编译任务
function copyfont() {
  return src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(dest('./lib/fonts'));
}

exports.build = series(compile, copyfont);
