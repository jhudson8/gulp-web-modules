# Release Notes

## Development

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.5.1...master)

## v0.5.1 - June 23rd, 2014
- implement default "test" using mocha - 3772a4e
- added proper async callbacks - bdf9833

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.5.0...v0.5.1)

## v0.5.0 - June 19th, 2014
- add test support - 1323e0e
  For example usage see jhudson8/react-plugins-united-example@cf610e5

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.4.0...v0.5.0)

## v0.4.0 - June 16th, 2014
- update read me - 57170fa
- allow plugins to optionally lazy load using a callback function - e55c14e
- bug fix: don't fail if the "sections" directory doesn't exist - c197c59
- use -t {build type} to specify build mode (ex: dev or prod) - b1e0ef0

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.3.0...v0.4.0)

## v0.3.0 - June 7th, 2014
- use ./js and ./styles for base module instead of ./sections/base/... - 29717e4

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.2.5...v0.3.0)

## v0.2.5 - March 7th, 2014

- [#6](https://github.com/jhudson8/gulp-web-modules/pull/6) - Adding `gulpplugin` keyword ([@pdehaan](https://api.github.com/users/pdehaan))
- [#5](https://github.com/jhudson8/gulp-web-modules/issues/5) - Not a gulpplugin

- add "beep" if the build fails - a1e3d0b

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.2.4...v0.2.5)

## v0.2.4 - March 1st, 2014

- add shortcut task "wr" to "watchrun" - cd5e863
- change jumpstart - d4f4550
- change jumpstart - 90e1586

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.2.3...v0.2.4)

## v0.2.3 - February 27th, 2014

- add plumber to keep watching after build error - c76744e
- add watch to css build - 5ab2975
- change "glob" to "watch" in the plugin API - b4c490e

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.2.2...v0.2.3)

## v0.2.2 - February 25th, 2014

- remove duplicate pipes (because of watch) - 6a40cdf
- remove section exports from base section - a4f8dd5
- allow for negative globs - a0e4a5a
- allow browserify options in gulp web module options - b99eee9
- remove console log in css-concat - 30ed74d
- remove temporary file usage with section-builder - a80f45b
- add 'js' prefix to all javascript code - 94f7940
- add browserifyTransform javascript plugin attribute - 2e00354
- allow globs to be functions - 9d1992d
- update image - 8f5d1ef
- update fs image - 3a795fd
- add file structure image ref - 69fc1a9
- add file structure visual - 44f2e66

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.2.1...v0.2.2)

## v0.2.1 - February 4th, 2014

- [#2](https://github.com/jhudson8/gulp-web-modules/issues/2) - Remove gulp as a depencency

- add quick start docs - 5b7a31b
- update references - e832bf4
- update documentation - 0c8188b
- update plugin search key - 37fdcb1
- update the jumpstart template - dc0dd13

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.2.0...v0.2.1)

## v0.2.0 - February 3rd, 2014

- [Revised plugin API](https://github.com/jhudson8/gulp-web-modules/blob/master/docs/plugin-api.md)
- Extracted all plugins into external projects
  - [gwm-lib](https://github.com/jhudson8/gwm-lib)
  - [gwm-config](https://github.com/jhudson8/gwm-config)
  - [gwm-handlebars]https://github.com/jhudson8/gwm-handlebars)
  - [gwm-react](https://github.com/jhudson8/gwm-react)
  - [gwm-sass](https://github.com/jhudson8/gwm-sass)
  - [gwm-stylus](https://github.com/jhudson8/gwm-stylus)
- Extracted the dev server into an [external project](https://github.com/jhudson8/gwm-dev-server)

[Commits](https://github.com/jhudson8/gulp-web-modules/compare/v0.1.6...v0.2.0)

## v0.1.6 - January 26th, 2014
