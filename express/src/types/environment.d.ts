declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT: string;
      DB_PATH: string;
      SWITCHBOT_TOKEN: string;
      SWITCHBOT_DEVICE_ID: string;
      LAMBDA_IP: string;
    }
  }
}

export {}