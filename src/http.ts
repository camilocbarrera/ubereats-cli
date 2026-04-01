import type { UberEatsConfig } from "./schemas/config";
import { BASE_URL, DEFAULT_HEADERS } from "./constants";

function buildHeaders(config: UberEatsConfig): Record<string, string> {
  return {
    ...DEFAULT_HEADERS,
    cookie: config.cookies,
  };
}

export async function get<T>(path: string, config: UberEatsConfig): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: buildHeaders(config),
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status} ${res.statusText}`);
  return res.json();
}

export async function post<T>(
  path: string,
  body: unknown,
  config: UberEatsConfig
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(config),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errorBody = "";
    try {
      errorBody = await res.text();
    } catch {}
    const details = errorBody ? ` (${errorBody.substring(0, 200)})` : "";
    throw new Error(`POST ${path} → ${res.status} ${res.statusText}${details}`);
  }
  return res.json();
}

export async function put<T>(
  path: string,
  body: unknown,
  config: UberEatsConfig
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: buildHeaders(config),
    body: JSON.stringify(body),
  });
  if (!res.ok)
    throw new Error(`PUT ${path} → ${res.status} ${res.statusText}`);
  return res.json();
}

export async function del<T>(
  path: string,
  config: UberEatsConfig
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: buildHeaders(config),
  });
  if (!res.ok)
    throw new Error(`DELETE ${path} → ${res.status} ${res.statusText}`);
  return res.json();
}
