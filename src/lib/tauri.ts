import { invoke } from "@tauri-apps/api/core";

export interface DeviceInfo {
  name: string;
  platform: string;
  version: string;
  arch: string;
  uptime_seconds: number;
}

export interface PingResponse {
  ok: boolean;
  message: string;
  timestamp: number;
}

export const isTauri = (): boolean =>
  typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;

export async function greet(name: string): Promise<string> {
  return invoke<string>("greet", { name });
}

export async function getAppVersion(): Promise<string> {
  return invoke<string>("get_app_version");
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  return invoke<DeviceInfo>("get_device_info");
}

export async function pingBackend(): Promise<PingResponse> {
  return invoke<PingResponse>("ping");
}