!function(globals) {
'use strict'


function hexToBytes(data) {
  if (data.length % 2 === 1) throw new Error("Can't convert a hex string with an odd number of characters.");
  if (data.indexOf('0x') === 0) data = data.slice(2);
  return data.match(/../g).map(function(x) { return parseInt(x,16); });
}

function binToBytes(data) {
  data = utf8ToAscii(data); // Sanitize in case UTF8 data is passed in
  return data.split('').map(function(x) { return x.charCodeAt(0); });
}

function bufferToBytes(data) {
  var rs = [];
  for (var i = 0; i < data.length; i++) {
    rs.push(data[i]);
  }
  return rs;
}

// http://hossa.in/2012/07/20/utf-8-in-javascript.html
function utf8ToAscii(data) {
  return unescape(encodeURIComponent(data));
}
function asciiToUtf8(data) {
  return decodeURIComponent(escape(data));
}

var binString = function binString(data, options) {
  // Set default options
  options = options || {};
  if (!options.in) {
    // Quack, quack! Duck-type the input
    if (Array.isArray(data)) {
      options.in = 'bytes';
    } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(data)) {
      options.in = 'buffer';
    } else if (typeof data == 'number') {
      data = data.toString(16);
      options.in = 'hex'
    } else if (data.slice(0,2) == '0x') {
      data = data.slice(2);
      options.in = 'hex';
    } else {
      options.in = 'binary';
    }
  }
  if (!options.out) options.out = 'bytes';
  
  options.in = options.in.toLowerCase();
  options.out = options.out.toLowerCase();
  
  // Special cases
  if (options.in == options.out) return data; // No conversion needed
  if (options.in == 'buffer' && typeof Buffer !== 'undefined' && Buffer.isBuffer(data)) {
    // Use built-in Buffer conversion options
    switch (options.out) {
    case 'hex':
      return data.toString('hex');
    case 'binary':
      return data.toString('binary');
    case 'utf8':
      return data.toString('utf8');
    case 'bytes':
      return bufferToBytes(data);
    }
  }
  
  // Get input into a byte array
  // TODO: switch to Typed Arrays when available: http://www.khronos.org/registry/typedarray/specs/latest/
  switch (options.in) {
  case 'hex':
    data = hexToBytes(data);
    break;
  case 'binary':
  case 'utf8':
    data = binToBytes(data);
    break;
  case 'buffer':
    if (typeof Buffer === 'undefined') throw new Error("Can't use a Buffer object on this platform!");
    data = bufferToBytes(data);
    break;
  }
  
  // Set output to desired format
  switch (options.out) {
  case 'hex':
    return data.map(function(x) { return ('000'+x.toString(16)).slice(-2); }).join('');
  case 'binary':
    return data.map(function(x) { return String.fromCharCode(x); }).join('');
  case 'utf8':
    return asciiToUTF8(data.map(function(x) { return String.fromCharCode(x); }).join(''));
  case 'bytes':
    return data;
  case 'buffer':
    if (typeof Buffer === 'undefined') throw new Error("Can't use a Buffer object on this platform!");
    return new Buffer(data);
  default:
    throw new Error('Output format "'+options.out+'" not understood');
  }
}

if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = binString
} else {
  globals.binString = binString
}

}(this);