import crypto from 'crypto';

export class HmacGenerator {
  public hmac: string;
  constructor() {
    this.hmac = '';
  }
  createHmac(key: string, value: string) {
    this.hmac = crypto.createHmac('sha3-256', key).update(value).digest('hex');
  }
}
