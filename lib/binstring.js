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
  if (Array.isArray(data)) {
    data = new Buffer(data);
  } else if (typeof data == 'number') {
    data = new Buffer(data.toString(16), 'hex');
  } else if (typeof data == 'string') {
    if (!options.in) {
      // Quack, quack! Duck-type the input
      if (data.slice(0,2) == '0x') {
        data = new Buffer(data.slice(2), 'hex');
      } else {
        // Binary string
        data = new Buffer(data, 'binary');
      }
    } else {
      data = new Buffer(data, options.in);
    }
  }
  if (!options.out) options.out = 'buffer';
  
  // Convert
  switch (options.out) {
    case 'buffer':
      return data;
    case 'hex':
      return data.toString('hex');
    case 'binary':
      return data.toString('binary');
    case 'utf8':
      return data.toString('utf8');
    case 'base64':
      return data.toString('base64');
    case 'bytes':
      return bufferToBytes(data);
    default:
      throw new Error('Output format "'+options.out+'" not understood');
  }
};
