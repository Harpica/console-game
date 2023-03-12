import { ConsoleInterface } from './modules/ConsoleInterface';
import { HelpTable } from './modules/HelpTable';
import { HmacGenerator } from './modules/HmacGenerator';
import { KeyGenerator } from './modules/KeyGenerator';
import { Rules } from './modules/Rules';
import { getIndexOfComputerValue } from './modules/utils';

function game() {
  // Getting array of values from env variables
  const values = process.argv.slice(2);
  // If values[] is empty or the number of them is even - exiting program
  if (!values.length || values.length % 2 === 0) {
    console.log('Please enter odd number of turns as arguments');
    process.exit();
  }
  // Creating controllers
  const rules = new Rules(values);
  const helpTable = new HelpTable(rules);
  const key = new KeyGenerator();
  const hmac = new HmacGenerator();
  const consoleInterface = new ConsoleInterface();

  // Playing game
  key.createKey();
  const computerIndex = getIndexOfComputerValue(values);
  hmac.createHmac(key.key, values[computerIndex]);
  console.log('HMAC: ', hmac.hmac);
  // Asking user to make his move
  consoleInterface.rl.question(
    consoleInterface.getOptions(values),
    { signal: consoleInterface.signal },
    (answer) =>
      consoleInterface.proceedInputOptions(answer, values, computerIndex, {
        checkWinner: rules.checkWinner,
        help: () => {
          helpTable.showTable();
        },
        key: key.key,
      })
  );
}

game();
