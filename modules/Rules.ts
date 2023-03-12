import { Result } from './types';

export class Rules {
  public values: Array<string>;
  private halfNumberOfTurns: number;
  constructor(values: Array<string>) {
    this.values = values;
    this.halfNumberOfTurns = Math.floor(values.length / 2);
    this.checkWinner = this.checkWinner.bind(this);
  }
  public checkWinner(firstValue: number, secondValue: number): Result {
    // Current value beats the next 'this.halfNumberOfTurns' ones and
    // loses to the previous 'this.halfNumberOfTurns' ones

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
