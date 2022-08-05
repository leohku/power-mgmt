import { Express, Request, Response } from "express";
import { Database } from "sqlite3";

interface DBResult {
  last_request_timestamp?: string | null,
  power_on_status?: 0 | 1
};

enum DBErrorResponse {
  NoResultsReturned = "NoResultsReturned",
  ErrorWhenRunningQuery = "ErrorWhenRunningQuery"
}

/* --- */

const initAPIRouteHandler = (app: Express, db: Database, port: string): void => {
  app.get("/last_request_timestamp", async (req: Request, res: Response): Promise<void> => {
    let response = await new Promise((resolve) => {
      db.get(`
        select last_request_timestamp from machines
          where machine_name = ?
      `, "lambda", (err: Error | null, row: DBResult) => {
        if (!err) {
          if (row !== undefined) {
            resolve(row.last_request_timestamp);
          } else {
            console.log("No results returned");
            resolve(DBErrorResponse.NoResultsReturned);
          }
        } else {
          console.log("Error when running query: ", err);
          resolve(DBErrorResponse.ErrorWhenRunningQuery);
        }
      });
    });

    res.send(String(response));
  });

  app.get("/power_on_status", async (req: Request, res: Response): Promise<void> => {
    let response = await new Promise((resolve) => {
      db.get(`
        select power_on_status from machines
          where machine_name = ?
      `, "lambda", (err: Error | null, row: DBResult) => {
        if (!err) {
          if (row !== undefined) {
            resolve(row.power_on_status);
          } else {
            console.log("No results returned");
            resolve(DBErrorResponse.NoResultsReturned);
          }
        } else {
          console.log("Error when running query: ", err);
          resolve(DBErrorResponse.ErrorWhenRunningQuery);
        }
      });
    });

    res.send(String(response));
  });
  
  // Health check route
  app.get("/", (req: Request, res: Response): void => {
    res.send("up");
  });

  app.listen(port, (): void => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });
}

export default initAPIRouteHandler;