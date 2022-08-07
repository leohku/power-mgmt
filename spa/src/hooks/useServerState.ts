import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ServerRestResponse, PowerOnStatusEnum } from "../types/serverStates";

const baseUrl: string = process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_BASE_URL as string : "/api";

const fetchFromServer = async (endpoint: string): Promise<string> => {
  return await fetch(baseUrl + endpoint)
          .then(r => {if (r.ok) {return r.text()} else {throw new Error("Unknown status code")}})
          .catch((networkError) => {throw new Error(networkError)});
}

const useServerState = () => {
  const timer = useRef(null);

  const lastRequestTimestampQuery = useQuery(["last_request_timestamp"], async () => {
    let response = await fetchFromServer("/last_request_timestamp") as ServerRestResponse["last_request_timestamp"];
    if (response === "null") {
      response = null
    };
    return response;
  }, {
    staleTime: Infinity
  });

  const powerOnStatusQuery = useQuery(["power_on_status"], async () => {
    return Number(await fetchFromServer("/power_on_status")) as ServerRestResponse["power_on_status"];
  }, {
    refetchInterval: 2 * 1000 // Try not to use Websockets first
  });

  const isInitialFetching: boolean = (lastRequestTimestampQuery.isFetching && lastRequestTimestampQuery.isLoading) ||
                              (powerOnStatusQuery.isFetching && powerOnStatusQuery.isLoading);
  const isError: boolean = lastRequestTimestampQuery.isError || powerOnStatusQuery.isError;
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

  // If initially was in cooldown, refetch to enable button after cooldown is over
  useEffect(() => {
    if (isInCooldown) {
      setTimeout(() => {
        lastRequestTimestampQuery.refetch();
      }, (5 * 60 * 1000 - timeDelta))
    }
  }, [lastRequestTimestampQuery.data])

  // UI States Mixing

  const powerOnStatus: PowerOnStatusEnum = !isInitialFetchingOrError ? (() => {
    if (powerOnStatusQuery.data === 1) {
      return PowerOnStatusEnum.PoweredOn;
    } else if (isInCooldown) {
      return PowerOnStatusEnum.PoweringOn;
    } else {
      return PowerOnStatusEnum.PoweredOff;
    }
  })(): PowerOnStatusEnum.PoweredOff;

  const buttonDisabled: boolean = !isInitialFetchingOrError ? (() => {
    if (powerOnStatusQuery.data === 1 || isInCooldown) {
      return true;
    } else {
      return false;
    }
  })(): true;

  return { isFetchingOrError: isInitialFetchingOrError, powerOnStatus, buttonDisabled };
}

export default useServerState;