import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ServerRestResponse, PowerOnStatusEnum } from "../types/serverStates";
import usePowerOnStatusSubscription from "./usePowerOnStatusSubscription";

const baseUrl: string = process.env.NODE_ENV === "development" ? "http://" + process.env.REACT_APP_API_BASE_HOST as string : "/api";

const fetchFromServer = async (endpoint: string): Promise<string> => {
  return await fetch(baseUrl + endpoint)
          .then(r => {if (r.ok) {return r.text()} else {throw new Error("Unknown status code")}})
          .catch((networkError) => {throw new Error(networkError)});
}

const useServerState = () => {
  
  // Fetch or subscribe to data sources
  
  const lastRequestTimestampQuery = useQuery(["last_request_timestamp"], async () => {
    let response = await fetchFromServer("/last_request_timestamp") as ServerRestResponse["last_request_timestamp"];
    if (response === "null") {
      response = null
    };
    return response;
  }, {
    staleTime: Infinity
  });

  const powerOnStatusServerQuery = useQuery(["power_on_status"], async () => {
    return Number(await fetchFromServer("/power_on_status")) as ServerRestResponse["power_on_status"];
  }, {
    staleTime: Infinity
  });

  usePowerOnStatusSubscription();

  // Derived states, especially isInCooldown

  const isInitialFetching: boolean = (lastRequestTimestampQuery.isFetching && lastRequestTimestampQuery.isLoading) ||
                              (powerOnStatusServerQuery.isFetching && powerOnStatusServerQuery.isLoading);
  const isError: boolean = lastRequestTimestampQuery.isError || powerOnStatusServerQuery.isError;
  const isInitialFetchingOrError: boolean = isInitialFetching || isError;

  let timeDelta: number;
  const isInCooldown: boolean = !isInitialFetchingOrError ? (() => {
    if (lastRequestTimestampQuery.data === null) {
      return false;
    }
    
    const curTimeWithoutOffset = Date.now() + (new Date()).getTimezoneOffset() * 60000;
    const lastRequestTimestamp = Date.parse(lastRequestTimestampQuery.data as string);
    timeDelta = curTimeWithoutOffset - lastRequestTimestamp;
    return timeDelta < (5 * 60 * 1000);
  })() : false;

  // Every time in a cooldown, refetch to enable button after cooldown is over
  useEffect(() => {
    let timer: NodeJS.Timer;
    if (isInCooldown) {
      timer = setTimeout(() => {
        lastRequestTimestampQuery.refetch();
      }, (5 * 60 * 1000 - timeDelta))
    }

    return () => clearInterval(timer);
  }, [lastRequestTimestampQuery.data])

  // UI States Mixing

  const powerOnStatusUI: PowerOnStatusEnum = !isInitialFetchingOrError ? (() => {
    if (powerOnStatusServerQuery.data === 1) {
      return PowerOnStatusEnum.PoweredOn;
    } else if (isInCooldown) {
      return PowerOnStatusEnum.PoweringOn;
    } else {
      return PowerOnStatusEnum.PoweredOff;
    }
  })(): PowerOnStatusEnum.PoweredOff;

  const buttonDisabled: boolean = !isInitialFetchingOrError ? (() => {
    if (powerOnStatusServerQuery.data === 1 || isInCooldown) {
      return true;
    } else {
      return false;
    }
  })(): true;

  return { isInitialFetchingOrError, powerOnStatusUI, buttonDisabled };
}

export default useServerState;