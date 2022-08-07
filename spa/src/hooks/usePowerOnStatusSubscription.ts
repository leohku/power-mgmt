import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const wsBaseUrl: string = (process.env.NODE_ENV === "development" ?
                            "ws://" + process.env.REACT_APP_API_BASE_HOST :
                            ((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.host + "/api/");

const usePowerOnStatusSubscription = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const websocket = new WebSocket(wsBaseUrl);
    websocket.onopen = () => {
      console.log("[WebSocket] Subscribed to power status");
    }
    websocket.onmessage = (event) => {
      const newPowerStatus = Number(event.data);
      queryClient.setQueryData(["power_on_status"], newPowerStatus);
    }
    websocket.onclose = () => {
      console.log("[WebSocket] Subscription closed");
    }

    return () => {
      websocket.close();
    }
  }, [queryClient]);
}

export default usePowerOnStatusSubscription;