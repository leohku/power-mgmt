import { useQuery } from "@tanstack/react-query";
import { ServerRestResponse, PowerOnStatusEnum } from "../types/serverStates";

const baseUrl: string = process.env.NODE_ENV === "development" ? process.env.REACT_APP_API_BASE_URL as string : "/api";

const fetchFromServer = async (endpoint: string): Promise<string> => {
  return await fetch(baseUrl + endpoint)
          .then(r => {if (r.ok) {return r.text()} else {throw new Error("Unknown status code")}})
          .catch((networkError) => {throw new Error(networkError)});
}

const useServerState = () => {
  const lastRequestTimestampQuery = useQuery(["last_request_timestamp"], async () => {
    let response = await fetchFromServer("/last_request_timestamp") as ServerRestResponse["last_request_timestamp"];
    if (response === "null") {
      response = null
    };
    return response;
  });

  const powerOnStatusQuery = useQuery(["power_on_status"], async () => {
    return Number(await fetchFromServer("/power_on_status")) as ServerRestResponse["power_on_status"];
  });

  const isFetching: boolean = lastRequestTimestampQuery.isFetching || powerOnStatusQuery.isFetching;
  const isError: boolean = lastRequestTimestampQuery.isError || powerOnStatusQuery.isError;
  const isFetchingOrError: boolean = isFetching || isError;

  const isInCooldown: boolean = !isFetchingOrError ? (() => {
    if (lastRequestTimestampQuery.data === null) {
      return false;
    }
    
    const curTimeWithoutOffset = Date.now() + (new Date()).getTimezoneOffset() * 60000;
    const lastRequestTimestamp = Date.parse(lastRequestTimestampQuery.data as string);
    const timeDelta = curTimeWithoutOffset - lastRequestTimestamp;
    return timeDelta < (5 * 60 * 1000);
  })() : false;

  const powerOnStatus: PowerOnStatusEnum = !isFetchingOrError ? (() => {
    if (powerOnStatusQuery.data === 1) {
      return PowerOnStatusEnum.PoweredOn;
    } else if (isInCooldown) {
      return PowerOnStatusEnum.PoweringOn;
    } else {
      return PowerOnStatusEnum.PoweredOff;
    }
  })(): PowerOnStatusEnum.PoweredOff;

  const buttonDisabled: boolean = !isFetchingOrError ? (() => {
    if (powerOnStatusQuery.data === 1 || isInCooldown) {
      return true;
    } else {
      return false;
    }
  })(): true;

  return { isFetchingOrError, powerOnStatus, buttonDisabled };
}

export default useServerState;