import { Express, Request, Response } from "express";
import { Database } from "sqlite3";
import axios from "axios";
import cors from "cors";
import { Server } from "http";

interface DBResult {
  last_request_timestamp?: string | null,
  power_on_status?: 0 | 1
};

enum DBErrorResponse {
  NoResultsReturned = "NoResultsReturned",
  ErrorWhenRunningQuery = "ErrorWhenRunningQuery"
}

/* --- */

const initAPIRouteHandler = (app: Express, db: Database, port: string): Server => {

  // Turn CORS on if development, else Nginx serves everything behind one origin
  if (process.env.NODE_ENV === "development") {
    app.use(cors());
  };

  // Golden path response: null | timestamp in %Y-%m-%d %H:%M:%f format (2022-08-06 12:03:10.123)
  app.get("/last_request_timestamp", async (req: Request, res: Response): Promise<void> => {
    let response = await new Promise((
        resolve: (value: DBResult["last_request_timestamp"] | PromiseLike<DBResult["last_request_timestamp"]>) => void,
        reject: (reason: string) => void) => {
      db.get(`
        select last_request_timestamp from machines
          where machine_name = ?
      `, "lambda", (err: Error | null, row: DBResult) => {
        if (!err) {
          if (row !== undefined) {
            resolve(row.last_request_timestamp);
          } else {
            console.log("No results returned");
            reject(DBErrorResponse.NoResultsReturned);
          }
        } else {
          console.log("Error when running query: ", err);
          reject(DBErrorResponse.ErrorWhenRunningQuery);
        }
      })
    }).then(
      (value: DBResult["last_request_timestamp"]): void => {res.send(String(value))},
      (reason: string): void => {res.status(500).send(reason)}
    );
  });

  // Golden path response: 0 | 1
  app.get("/power_on_status", async (req: Request, res: Response): Promise<void> => {
    await new Promise((
        resolve: (value: DBResult["power_on_status"] | PromiseLike<DBResult["power_on_status"]>) => void,
        reject: (reason: string) => void) => {
      db.get(`
        select power_on_status from machines
          where machine_name = ?
      `, "lambda", (err: Error | null, row: DBResult) => {
        if (!err) {
          if (row !== undefined) {
            resolve(row.power_on_status);
          } else {
            console.log("No results returned");
            reject(DBErrorResponse.NoResultsReturned);
          }
        } else {
          console.log("Error when running query: ", err);
          reject(DBErrorResponse.ErrorWhenRunningQuery);
        }
      });
    }).then(
      (value: DBResult["power_on_status"]): void => {res.send(String(value))},
      (reason: string): void => {res.status(500).send(reason)}
    );
  });

  // Golden path response: OK
  app.post("/request_power_on", async (req: Request, res: Response): Promise<void> => {
    await new Promise((
        resolve: (value: DBResult | PromiseLike<DBResult>) => void,
        reject: (reason: string) => void) => {
      db.get(`
          select last_request_timestamp, power_on_status from machines
            where machine_name = ?
      `, "lambda", (err: Error | null, row: DBResult) => {
        if (!err) {
          if (row !== undefined) {
            resolve(row);
          } else {
            console.log("No results returned");
            reject(DBErrorResponse.NoResultsReturned);
          }
        } else {
          console.log("Error when running query: ", err);
          reject(DBErrorResponse.ErrorWhenRunningQuery);
        }
      });
    }).then(
      (value: DBResult): void => {
        const curTimeWithoutOffset = Date.now() + (new Date()).getTimezoneOffset() * 60000;
        const lastRequestTimestamp = Date.parse(value.last_request_timestamp as string);
        const timeDelta = curTimeWithoutOffset - lastRequestTimestamp;

        if ((
            value.last_request_timestamp === null ||
            timeDelta > (5 * 60 * 1000)
          ) &&
          value.power_on_status === 0
        ) {
          // Best Effort: Set last_request_timestamp to current time
          db.run(`
            update machines
            set last_request_timestamp = strftime('%Y-%m-%d %H:%M:%f','now')
            where machine_name = ?
          `, ["lambda"], (err: Error | null) => {
            if (err) {
              console.log("Error when updating last_request_timestamp: " + err);
            }
          });

          // Call Switchbot API to press PVE Switch
          if (process.env.NODE_ENV !== "development") {
            let data = JSON.stringify({
              "command": "press",
              "parameter": "default",
              "commandType": "command"
            });
            
            let config = {
              method: 'post',
              url: 'https://api.switch-bot.com/v1.0/devices/' + process.env.SWITCHBOT_DEVICE_ID + '/commands',
              headers: { 
                'Authorization': 'Bearer ' + process.env.SWITCHBOT_TOKEN, 
                'Content-Type': 'application/json'
              },
              data : data
            };
            
            axios(config)
            .then(function (response) {
              if (response.data.statusCode === 100) {
                res.send("OK");
              } else {
                res.status(500).send("Switchbot API returned an unknown status code " + String(response.data.statusCode));
              }
            })
            .catch(function (error) {
              console.log(error);
              res.status(500).send("Switchbot API encountered an error");
            });
          } else {
            // Always send OK when working in development
            res.send("OK");
          }
        } else {
          if (!(value.power_on_status === 0)) {
            res.status(401).send("Unmet power on requirements, already on");
          } else {
            res.status(401).send("Unmet power on requirements, cooldown time not finished");
          }
        }
      },
      (reason: string): void => {res.status(500).send(reason)}
    )
  });
  
  // Health check route
  // Golden path response: up
  app.get("/", (req: Request, res: Response): void => {
    res.send("up");
  });

  return app.listen(port, (): void => {
    console.log(`[Express] Express Server is running at https://localhost:${port}`);
  });
}

export default initAPIRouteHandler;
