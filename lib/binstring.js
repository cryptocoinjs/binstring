'use strict'

function bufferToBytes(data) {
  var rs = [];
  for (var i = 0; i < data.length; i++) {
    rs.push(data[i]);
  }
  return rs;
}

var binString = module.exports = function binString(data, options) {
  // Set default options
  options = options || {};

  function duckString(str) {
    if (str.substring(0,2) == '0x') {
      return new Buffer(str.slice(2), 'hex');
    } else if (parseInt(str)+'' == str) {
      // Integer stored as a string
      var hex = parseInt(str).toString(16);
      if (hex.length % 2 !== 0) hex = '0'+hex;
      return new Buffer(hex, 'hex');
    } else {
      // Binary string
      return new Buffer(str, 'binary');
    }
  }

  if (Array.isArray(data)) {
    data = new Buffer(data);
  } else if (typeof data == 'number') {
    data = new Buffer(data.toString(16), 'hex');
  } else if (typeof data == 'string') {
    if (!options.in) {
      // Quack, quack! Duck-type the input
      data = duckString(data);
    } else {
      data = new Buffer(data, options.in);
    }
  } else if (typeof data == 'object' && !Buffer.isBuffer(data)) {
    // Some object that's not a Buffer...
    if (typeof data.length !== 'undefined' && data.length > 0 && typeof data[0] !== 'undefined') {
      // "Array-like"
      data = new Buffer(Array.apply([], data));
    } else {
      // Some other object type; use its toString() method
      data = duckString(data.toString());
    }
  }
  if (!options.out) options.out = 'buffer';

  // Convert
  switch (options.out) {
    case 'buffer':
      return data;
    case 'bytes':
      return bufferToBytes(data);
    case 'hex':
    case 'binary':
    case 'utf8':
    case 'base64':
      return data.toString(options.out);
    default:
      throw new Error('Output format "'+options.out+'" not understood');
  }
};
