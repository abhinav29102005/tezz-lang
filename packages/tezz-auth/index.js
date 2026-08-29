const crypto = require('crypto');
module.exports = {
  sign(payload, secret) {
    const data = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', secret).update(data).digest('base64');
    return signature + '.' + Buffer.from(data).toString('base64');
  },
  verify(token, secret) {
    try {
      const [sig64, payload64] = token.split('.');
      const data = Buffer.from(payload64, 'base64').toString('utf8');
      const expectedSig = crypto.createHmac('sha256', secret).update(data).digest('base64');
      return (sig64 === expectedSig) ? JSON.parse(data) : null;
    } catch(e) { return null; }
  }
};
