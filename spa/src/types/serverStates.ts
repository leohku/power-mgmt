export interface ServerRestResponse {
  last_request_timestamp: string | null,
  power_on_status: 0 | 1
};

enum PowerOnStatusEnum {
  PoweredOff = "PoweredOff",
  PoweringOn = "PoweringOn",
  PoweredOn = "PoweredOn"
}

export { PowerOnStatusEnum };
