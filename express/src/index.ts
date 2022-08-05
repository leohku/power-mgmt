import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import initDBConnection from "./sqlite";

const main = async () => {
  dotenv.config();

  const app: Express = express();
  const port: string = process.env.PORT;
  
  const dbPath: string = process.env.NODE_ENV === "development" ? process.env.DEV_DB_PATH : process.env.PROD_DB_PATH;
  const db = await initDBConnection(dbPath);
  
  app.get("/", (req: Request, res: Response): void => {
    res.send("Express + Typescript Server");
  });
  
  app.listen(port, (): void => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });
}

main();
