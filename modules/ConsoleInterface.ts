import readline from 'readline';
import { Result } from './types';

export class ConsoleInterface {
  public rl: readline.Interface;
  public ac: AbortController;
  public signal: AbortSignal;
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.ac = new AbortController();
    this.signal = this.ac.signal;
  }
  public getOptions(values: Array<string>): string {
    let optionsString = 'Available moves:\n';
    values.forEach((value, i) => {
      optionsString += `${i} - ${value}\n`;
    });
    optionsString += 'q - exit\n? - help\n';
    optionsString += 'Enter your move: ';
    return optionsString;
  }
  public proceedInputOptions(
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
      this.ac.abort();
      process.exit();
    } else if (inputIndex >= 0 && inputIndex < values.length) {
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
    } else {
      console.log('Please enter valid value from the table above');
    }
    this.ac.abort();
    this.rl.question('Your move: ', (answer) =>
      this.proceedInputOptions(answer, values, computerIndex, {
        checkWinner,
        help,
        key,
      })
    );
  }
}
