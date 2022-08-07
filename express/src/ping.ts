import { Database } from "sqlite3";
import { SQLiteSingleResult } from "./sqlite/validate";
import ping from "ping";
import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";

const initPersistentPingServer = (server: Server, db: Database): void => {
  const wss = initWebSocketServer(server);
  initPersistentPing(db, wss);
};

const initWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });
  wss.on("connection", ws => {
    console.log("[WebSocket] New client connected");

    ws.on("close", () => {
      console.log("[WebSocket] Client close");
    });
  });

  console.log("[WebSocket] WebSocket server running");
  return wss;
};

const initPersistentPing = async (db: Database, wss: WebSocketServer): Promise<void> => {
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

  const last6Ping = curPowerOnStatus ? [1,1,1,1,1,1] : [0,0,0,0,0,0];

  const didStatusChange = (): boolean => {
    const arrSum = last6Ping.reduce((a, b) => a + b, 0);
    const instantaneousPowerOnStatus: boolean = arrSum >= 3;
    return (instantaneousPowerOnStatus !== curPowerOnStatus);
  };

  setInterval(() => {
    ping.sys.probe((host as string), (isAlive: boolean | null) => {
      last6Ping.unshift(isAlive ? 1 : 0);
      last6Ping.pop();
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
        
        // Broadcast link state change to all WS clients
        wss.clients.forEach((client: WebSocket) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(String(curPowerOnStatus ? 1 : 0));
          };
        });

        console.log("[Pinger] Lambda link state changed to " + (curPowerOnStatus ? "UP" : "DOWN"));
        console.log("[WebSocket] State change broadcast to all WS clients");
      };
    });
  }, 1000);

  console.log("[Pinger] Ping monitoring initiated");
};

export default initPersistentPingServer;