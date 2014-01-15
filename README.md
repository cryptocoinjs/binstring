# BinString

JavaScript component to convert to/from strings and byte arrays.

AMD/CommonJS compatible.


## Usage

This library exposes a single function that takes a data parameter and an options object. Set `options.in` and `options.out` to the format of the input and desired output. Possible values include:

* `hex`: Hex-encoded string; two hexadecimal characters per byte
* `binary`: Binary-encoded string (ASCII-encoded)
* `utf8`: Binary-encoded string (UTF8-encoded)
* `bytes`: Byte array; an array of numbers, each representing one byte of data
* `buffer`: A Node.js native Buffer object

The default encoding for `options.out` is a buffer (`buffer`). The input format is duck-typed if it's an Array (`bytes`) or Buffer (`buffer`) or Number object. If it's a string, it's interpreted as `binary` unless it's prefixed by `0x` (then it's `hex`). If `options.in` is set, it overrides the automatic duck-typing of the input variable.

```js
var conv = require('binstring');

console.dir(conv('hello', { in:'binary' })); // No output encoding specified, defaults to Buffer; output: Buffer([104,101,108,108,111])
console.dir(conv([104,101,108,108,111], { out:'hex' })); // No input encoding specified, auto-detected as Byte Array; output: 68656c6c6f
console.dir(conv('hello', { in:'binary', out:'hex' })); // output: 68656c6c6f
```

## Test

Unit tests are written in [Mocha](http://visionmedia.github.io/mocha/). To run the test suite, checkout the git repository, and from within the base folder run:

```sh
$ npm install --dev
$ ./node_modules/mocha/bin/mocha
```

## References on JavaScript UTF-8 forced encoding
(these sources are also included as PDFs in the repo in case the links go dead)

- http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
- http://hossa.in/2012/07/20/utf-8-in-javascript.html

# License
(MIT License)

Copyright 2014, Brooks Boyd <boydb@midnightdesign.ws>