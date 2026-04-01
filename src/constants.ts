export const BASE_URL = "https://www.ubereats.com";
export const DEFAULT_COORDS = { lat: 40.7128, lng: -73.9060 } as const; // NYC
export const CONFIG_FILENAME = ".ubereats-config.json";
export const SESSION_FILENAME = ".ubereats-session.json";
export const API_PORT = 3200;

export const DEFAULT_HEADERS: Record<string, string> = {
  accept: "application/json",
  "accept-language": "en-US,en;q=0.9",
  "content-type": "application/json",
  "x-csrf-token": "x",
  origin: "https://www.ubereats.com",
  referer: "https://www.ubereats.com/",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
};
