import crypto, { Hmac } from "crypto";

type Result = "win" | "lose" | "draw";

class Rules {
  public values: Array<string>;
  private halfNumberOfTurns: number;
  constructor(values: Array<string>) {
    this.values = values;
    this.halfNumberOfTurns = Math.floor(values.length / 2);
    console.log(this.halfNumberOfTurns);
  }
  public checkWinner(firstValue: number, secondValue: number): Result {
    const lastWin = (firstValue + this.halfNumberOfTurns) % this.values.length;
    const isOver = firstValue + this.halfNumberOfTurns >= this.values.length;

    if (isOver) {
      if (secondValue > firstValue || secondValue <= lastWin) {
        return "win";
      }
    } else if (secondValue > firstValue && secondValue <= lastWin) {
      return "win";
    }
    if (secondValue === firstValue) {
      return "draw";
    }
    return "lose";
  }
}

class HelpTable {
  private rules: Rules;
  private table: Array<Array<string>>;
  constructor(rules: Rules) {
    this.rules = rules;
    this.table = [rules.values];
    this.createRulesTable();
  }
  private createRulesTable() {
    this.rules.values.forEach((value, i) => {
      const turnChecks = [value];
      for (let j = 0; j < this.rules.values.length; j++) {
        turnChecks.push(this.rules.checkWinner(i, j));
      }
      this.table.push(turnChecks);
    });
    this.table[0].unshift("");
  }
  showTable() {
    console.table(this.table);
  }
}

class KeyGenerator {
  public key: string;
  constructor() {
    this.key = "";
  }
  createKey() {
    this.key = crypto.randomBytes(32).toString("hex");
  }
}

class HmacGenerator {
  public hmac: string;
  constructor() {
    this.hmac = "";
  }
  createHmac(key: string, value: string) {
    this.hmac = crypto.createHmac("sha3-256", key).update(value).digest("hex");
  }
}

const values = process.argv.slice(2);
const rules = new Rules(values);
const helpTable = new HelpTable(rules);
const key = new KeyGenerator();
const hmac = new HmacGenerator();

// helpTable.showTable();
key.createKey();
hmac.createHmac(key.key, "Hello");
console.log(hmac.hmac, key.key);
