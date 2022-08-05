import { exit } from "process";
import sqlite3 from "sqlite3";
import { validateDBPromiseFactory } from "./validate";

interface SQLite3NewDBError extends Error {
  errno: number,
  code: string
};

function isSQLite3NewDBError(err: Error | SQLite3NewDBError | null): err is SQLite3NewDBError {
  if ((err as SQLite3NewDBError)?.code !== undefined) {
    return true;
  }
  return false;
};

/* --- */

let initDBConnection = async (dbPath: string): Promise<sqlite3.Database> => {
  let db: sqlite3.Database = await new Promise((resolve) => {
    // Test DB connectivity
    new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err: Error | null) => {
      if (!err) {
        let returnedNormalDB = new sqlite3.Database(dbPath, (err) => {
          if (err) {
            console.log("Getting error opening normal database: " + err);
            exit(1);
          };
          resolve(returnedNormalDB);
        });
      } else if (isSQLite3NewDBError(err) && err.code === "SQLITE_CANTOPEN") {
        let returnedNewlyCreatedDB = createDatabase(dbPath);
        resolve(returnedNewlyCreatedDB);
      } else {
        console.log("Getting error opening database " + err);
        exit(1);
      };
    });
  });

  // Test connection to ensure schema and values
  await new Promise(validateDBPromiseFactory(db)).then(
    (value) => {
      if (!value) {
        console.log("Connection test query failed, possible DB schema corruption");
        exit(1);
      }
    }
  );

  console.log("Database initiated and tested");
  return db;
};

let createDatabase = (dbPath: string): sqlite3.Database => {
  let newDB = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.log("Getting error creating database: " + err);
      exit(1);
    }
    createTables(newDB);
  });
  return newDB;
};

let createTables = (newDB: sqlite3.Database): void => {
  newDB.exec(`
    create table machines (
      machine_id integer primary key autoincrement not null,
      machine_name text not null,
      last_request_timestamp datetime,
      power_on_status integer not null
    );
    insert into machines (machine_name, last_request_timestamp, power_on_status)
      values ('lambda', null, 0);
  `, (err) => {
    if (err) {
      console.log("Getting error creating table: " + err);
      exit(1);
    }
  });
};

export default initDBConnection;