import path from "path";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import initDBConnection from "./sqlite";

const main = async () => {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });

  if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });
  } else {
    dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
  };

  const app: Express = express();
  const port: string = process.env.PORT;

  const dbPath: string = process.env.DB_PATH;
  const db = await initDBConnection(dbPath);
  
  app.get("/", (req: Request, res: Response): void => {
    res.send("Express + Typescript Server");
  });
  
  app.listen(port, (): void => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
  });
}

main();
