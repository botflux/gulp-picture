# :construction::warning: gulp-picture

A gulp plugin that replace html image tags by picture tags. This plugin works with `gulp-responsive`.

## Installation

```
npm install --save-dev gulp-picture
```

## How to use it ?

The array for breakpoints is the as [gulp-responsive](https://npmjs.org/package/gulp-responsive).

```js
const { src, dist, task } = require('gulp')
const picture = require('gulp-picture')

const breakpoints = [
    {
        width: 200,
        rename: {
            suffix: '-200px'
        }
    }, {
        width: 400,
        rename: {
            suffix: '-400px'
        }        
    }, {
        rename: {
            suffix: '-original'
        }
    }
]

const html = () => {
    return src('src/*.html')
        .pipe(picture({
            breakpoints
        }))
}

task('html', html)
```

## Install

```shell
# Clone the project
git clone https://github.com/botflux/gulp-picture.git

# Install node modules
npm install

# Run tests
npm test

# Start gulp
gulp
```

## Note

This implementation is just a 'sandbox'. The guidelines are not respected. This plugin is in development.