import { table } from 'table';
import { Rules } from './Rules';

export class HelpTable {
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
