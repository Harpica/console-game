import crypto from 'crypto';
import readline from 'readline';
import { table } from 'table';

type Result = 'win' | 'lose' | 'draw';

class Rules {
  public values: Array<string>;
  private halfNumberOfTurns: number;
  constructor(values: Array<string>) {
    this.values = values;
    this.halfNumberOfTurns = Math.floor(values.length / 2);
    this.checkWinner = this.checkWinner.bind(this);
  }
  public checkWinner(firstValue: number, secondValue: number): Result {
    const lastWin = (firstValue + this.halfNumberOfTurns) % this.values.length;
    const isOver = firstValue + this.halfNumberOfTurns >= this.values.length;

    if (isOver) {
      if (secondValue > firstValue || secondValue <= lastWin) {
        return 'win';
      }
    } else if (secondValue > firstValue && secondValue <= lastWin) {
      return 'win';
    }
    if (secondValue === firstValue) {
      return 'draw';
    }
    return 'lose';
  }
}

class HelpTable {
  private rules: Rules;
  private table: Array<Array<string>>;
  constructor(rules: Rules) {
    this.rules = rules;
    this.table = [[...this.rules.values]];
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
    this.table[0].unshift('');
  }
  showTable() {
    console.log(table(this.table));
  }
}

class KeyGenerator {
  public key: string;
  constructor() {
    this.key = '';
  }
  createKey() {
    this.key = crypto.randomBytes(32).toString('hex');
  }
}

class HmacGenerator {
  public hmac: string;
  constructor() {
    this.hmac = '';
  }
  createHmac(key: string, value: string) {
    this.hmac = crypto.createHmac('sha3-256', key).update(value).digest('hex');
  }
}

function getOptions(values: Array<string>): string {
  let optionsString = 'Available moves:\n';
  values.forEach((value, i) => {
    optionsString += `${i} - ${value}\n`;
  });
  optionsString += 'q - exit\n? - help\n';
  optionsString += 'Enter your move: ';
  return optionsString;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const ac = new AbortController();
const signal = ac.signal;

function proceedInputOptions(
  input: string,
  values: Array<string>,
  computerIndex: number,
  optionsMaintainer: {
    checkWinner: (a: number, b: number) => Result;
    help: () => void;
    key: string;
  }
) {
  const { checkWinner, help, key } = optionsMaintainer;
  const inputIndex = parseInt(input);
  if (input === '?') {
    help();
  } else if (input === 'q') {
    ac.abort();
    process.exit();
  } else if (!isNaN(inputIndex)) {
    if (inputIndex >= 0 && inputIndex < values.length) {
      console.log('Your move: ' + values[inputIndex]);
      console.log("Computer's move: " + values[computerIndex]);
      switch (checkWinner(inputIndex, computerIndex)) {
        case 'win':
          console.log('You win!');
          break;
        case 'lose':
          console.log('You lose :C');
          break;
        case 'draw':
          console.log('Dead heat!');
          break;
        default:
          break;
      }
      console.log('Secret key: ' + key);
      process.exit();
    }
  } else {
    console.log('Please enter valid value from the table above');
  }
  ac.abort();
  rl.question('Your move: ', (answer) =>
    proceedInputOptions(answer, values, computerIndex, {
      checkWinner,
      help,
      key,
    })
  );
}

function getIndexOfComputerValue(values: Array<string>): number {
  return Math.floor(Math.random() * values.length);
}

function game() {
  const values = process.argv.slice(2);
  if (!values.length || values.length % 2 === 0) {
    console.log('Please enter odd number of turns as arguments');
    process.exit();
  }
  const rules = new Rules(values);
  const helpTable = new HelpTable(rules);
  const key = new KeyGenerator();
  const hmac = new HmacGenerator();
  key.createKey();
  const computerIndex = getIndexOfComputerValue(values);
  hmac.createHmac(key.key, values[computerIndex]);
  console.log('HMAC: ', hmac.hmac);
  rl.question(getOptions(values), { signal }, (answer) =>
    proceedInputOptions(answer, values, computerIndex, {
      checkWinner: rules.checkWinner,
      help: () => {
        helpTable.showTable();
      },
      key: key.key,
    })
  );
}

game();
