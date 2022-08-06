import { exit } from "process";
import sqlite3 from "sqlite3";

interface SQLiteSingleResult {
  last_request_timestamp: string | null,
  power_on_status: 0 | 1
};

function isSQLiteSingleResult(result: any): result is SQLiteSingleResult {
  let last_request_timestamp = (result as SQLiteSingleResult)?.last_request_timestamp;
  let power_on_status = (result as SQLiteSingleResult)?.power_on_status

  let tests = [
            (typeof last_request_timestamp === "string" || last_request_timestamp === null),
            [0, 1].includes(power_on_status),
            ]
  if (tests.reduce((a, b) => a && b, true) === true) {
    return true;
  }
  return false;
};

/* --- */

let validateDBPromiseFactory = (db: sqlite3.Database) => {
  return (resolve: (value?: boolean | PromiseLike<boolean>) => void) => {
    validateDB(db, resolve);
  }
};

let validateDB = (db: sqlite3.Database, resolve: (value: boolean | PromiseLike<boolean>) => void): any => {
  runTestQueries(db, (result) => {
    if (!isSQLiteSingleResult(result)) {
      resolve(false);
    }
    resolve(true);
  });
};

let runTestQueries = (db: sqlite3.Database, callback: (result: any) => void): void => {
  db.get(`
    select last_request_timestamp, power_on_status from machines
      where machine_name = ?
  `, "lambda", (err, row) => {
    if (err) {
      console.log("Error when running queries: ", err);
      exit(1);
    } else if (row === undefined) {
      console.log("No results returned");
      exit(1);
    } else {
      callback(row);
    }
  });
};

export { validateDBPromiseFactory, SQLiteSingleResult };