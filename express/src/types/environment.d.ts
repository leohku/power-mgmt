declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string;
      DEV_DB_PATH: string;
      PROD_DB_PATH: string;
    }
  }
}

export {}