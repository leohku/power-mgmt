import { Database } from "sqlite3";
import { SQLiteSingleResult } from "./sqlite/validate";
import ping from "ping";

const initPersistentPing = async (db: Database): Promise<void> => {
  const host = process.env.LAMBDA_IP;

  let curPowerOnStatus: boolean = await new Promise((resolve: (value: boolean | PromiseLike<boolean>) => void): any => {
    db.get(`
      select power_on_status from machines
        where machine_name = ?
    `, "lambda", (err: Error | null, row: SQLiteSingleResult) => {
      if (err) {
        // Assume power off if DB reads error
        resolve(false);
      } else {
        resolve(row.power_on_status ? true : false);
      }
    });
  });

  const last5Ping = curPowerOnStatus ? [1,1,1,1,1] : [0,0,0,0,0];

  const didStatusChange = (): boolean => {
    const arrSum = last5Ping.reduce((a, b) => a + b, 0);
    const instantaneousPowerOnStatus: boolean = arrSum >= 4;
    return (instantaneousPowerOnStatus !== curPowerOnStatus);
  };

  setInterval(() => {
    ping.sys.probe((host as string), (isAlive: boolean | null) => {
      last5Ping.unshift(isAlive ? 1 : 0);
      last5Ping.pop();
      if (didStatusChange()) {
        curPowerOnStatus = !curPowerOnStatus;
        
        // Persist curPowerOnStatus to DB
        db.run(`
          update machines
          set power_on_status = ?
          where machine_name = ?
        `, [curPowerOnStatus ? 1 : 0, "lambda"], (err: Error | null) => {
          if (err) {
            console.log("Error when updating power_on_status: " + err);
          }
        });
        
        // TODO: Notify WS Clients


        console.log("Lambda link state changed to " + (curPowerOnStatus ? "UP" : "DOWN"));
      };
    });
  }, 1000);

  console.log("Ping monitoring initiated");
};

export default initPersistentPing;