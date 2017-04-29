var conv = require('../lib/binstring')

require('terst')

describe('+ convert(data)', () => {
  it('should default output to buffer', () => {
    var test = conv('hello', { in:'binary' });
    T (Buffer.isBuffer(test));
    EQ (test.toString('hex'), '68656c6c6f' );
  }),
  it('should duck-type a byte array', () => {
    var test = conv([104,101,108,108,111]);
    T (Buffer.isBuffer(test));
    EQ (test.toString('hex'), '68656c6c6f' );
  }),
  it('should duck-type a Buffer', () => {
    var test = conv(new Buffer([104,101,108,108,111]));
    T (Buffer.isBuffer(test));
    EQ (test.toString('hex'), '68656c6c6f' );
  }),
  it('should duck-type a Number', () => {
    var test = conv(48879);
    T (Buffer.isBuffer(test));
    EQ (test.toString('hex'), 'beef' );
  }),
  it('should duck-type a 0x-prefixed hex string', () => {
    var test = conv('0x68656c6c6f');
    T (Buffer.isBuffer(test));
    EQ (test.toString('hex'), '68656c6c6f' );
  }),
  it('should not duck-type a 0x-prefixed hex string, if input format set', () => {
    var test = conv('0x68656c6c6f', {in: 'binary'});
    T (Buffer.isBuffer(test));
    EQ (test.toString('hex'), '307836383635366336633666' );
  }),
  it('should convert from base64 when asked', () => {
    var test = conv('aGVsbG8=', {in: 'base64'});
    T (Buffer.isBuffer(test));
    EQ (test.toString('hex'), '68656c6c6f' );
  }),

  describe('> should properly convert byte array...', () => {
    var input = [104,101,108,108,111];
    it('...to hex', () => {
        EQ (conv(input, { in:'bytes', out:'hex' }), '68656c6c6f' );
    }),
    it('...to binary', () => {
        EQ (conv(input, { in:'bytes', out:'binary' }), 'hello' );
    }),
    it('...to Buffer', () => {
      var test = conv(input, { in:'bytes', out:'buffer' });
      T (Buffer.isBuffer(test));
      EQ (test.toString('binary'), 'hello');
    })
  }),

  describe('> should properly convert hex string...', () => {
    var input = '68656c6c6f';
    it('...to binary', () => {
        EQ (conv(input, { in:'hex', out:'binary' }), 'hello' );
    }),
    it('...to bytes', () => {
      var test = conv(input, { in:'hex', out:'bytes' });
      T (Array.isArray(test));
      EQ (test.join(','), '104,101,108,108,111');
    }),
    it('...to Buffer', () => {
      var test = conv(input, { in:'hex', out:'buffer' });
      T (Buffer.isBuffer(test));
      EQ (test.toString('binary'), 'hello');
    })
  }),

  describe('> should properly convert binary string...', () => {
    var input = 'hello';
    it('...to hex', () => {
      EQ (conv(input, { in:'binary', out:'hex' }), '68656c6c6f' );
    }),
    it('...to bytes', () => {
      var test = conv(input, { in:'binary', out:'bytes' });
      T (Array.isArray(test));
      EQ (test.join(','), '104,101,108,108,111');
    }),
    it('...to Buffer', () => {
      var test = conv(input, { in:'binary', out:'buffer' });
      T (Buffer.isBuffer(test));
      EQ (test.toString('binary'), 'hello');
    })
  }),

  describe('> should properly convert utf8 string...', () => {
    var input = 'R\u00e9sum\u00e9';
    it('...to hex', () => {
      EQ (conv(input, { in:'utf8', out:'hex' }), '52c3a973756dc3a9' );
    }),
    it('...to binary', () => {
        EQ (conv(input, { in:'utf8', out:'binary' }), 'R\xc3\xa9sum\xc3\xa9' );
    }),
    it('...to bytes', () => {
      var test = conv(input, { in:'utf8', out:'bytes' });
      T (Array.isArray(test));
      EQ (test.join(','), '82,195,169,115,117,109,195,169');
    }),
    it('...to Buffer', () => {
      var test = conv(input, { in:'utf8', out:'buffer' });
      T (Buffer.isBuffer(test));
      EQ (test.toString('hex'), '52c3a973756dc3a9');
    })
  }),

  describe('> should properly convert Buffer...', () => {
    var input = new Buffer([104,101,108,108,111]);
    it('...to hex', () => {
      EQ (conv(input, { in:'buffer', out:'hex' }), '68656c6c6f' );
    }),
    it('...to base64', () => {
      EQ (conv(input, { in:'buffer', out:'base64' }), 'aGVsbG8=' );
    }),
    it('...to binary', () => {
      EQ (conv(input, { in:'buffer', out:'binary' }), 'hello' );
    }),
    it('...to bytes', () => {
      var test = conv(input, { in:'buffer', out:'bytes' });
      T (Array.isArray(test));
      EQ (test.join(','), '104,101,108,108,111');
    })
  })
})
