import crypto from 'crypto';

export class KeyGenerator {
  public key: string;
  constructor() {
    this.key = '';
  }
  createKey() {
    this.key = crypto.randomBytes(32).toString('hex');
  }
}
