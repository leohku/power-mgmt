import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port: string = process.env.PORT;

app.get("/", (req: Request, res: Response): void => {
  res.send("Express + Typescript Server");
});

app.listen(port, (): void => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});