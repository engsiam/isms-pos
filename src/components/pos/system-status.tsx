"use client";

import * as React from "react";
import { Cpu, MonitorDown, WifiOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { isTauri, getDeviceInfo, getAppVersion, pingBackend, type DeviceInfo } from "@/lib/tauri";
import { formatNumber } from "@/lib/format";

interface Status {
  mode: "desktop" | "browser" | "error";
  version: string;
  platform: string;
  host: string;
  pingMillis?: number;
}

export function SystemStatus() {
  const [status, setStatus] = React.useState<Status | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function detect() {
      if (!isTauri()) {
        mounted && setStatus({
          mode: "browser",
          version: "-",
          platform: "web preview",
          host: "localhost",
        });
        return;
      }

      try {
        const started = performance.now();
        const [version, device, pong] = await Promise.all([
          getAppVersion(),
          getDeviceInfo(),
          pingBackend(),
        ]);
        mounted && setStatus({
          mode: "desktop",
          version,
          platform: device.platform,
          host: device.name,
          pingMillis: Math.round(performance.now() - started + (pong.ok ? 0 : 0)),
        });
      } catch {
        mounted && setStatus({
          mode: "error",
          version: "-",
          platform: "unknown",
          host: "unknown",
        });
      }
    }

    detect();
    return () => {
      mounted = false;
    };
  }, []);

  if (!status) return null;

  const isDesktop = status.mode === "desktop";

  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          {isDesktop ? (
            <Cpu className="size-4 text-primary" />
          ) : (
            <MonitorDown className="size-4 text-muted-foreground" />
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">
              {isDesktop ? "Running as native desktop app" : "Browser preview mode"}
            </span>
            {isDesktop ? (
              <Badge variant="secondary" className="gap-1 rounded-full text-[10px]">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                IPC connected
              </Badge>
            ) : status.mode === "error" ? (
              <Badge variant="destructive" className="gap-1 rounded-full text-[10px]">
                <WifiOff className="size-3" />
                bridge error
              </Badge>
            ) : (
              <Badge variant="outline" className="rounded-full text-[10px]">
                Run <code className="font-mono">npm run tauri:dev</code> for the desktop shell
              </Badge>
            )}
          </div>
        </div>

        <div className="text-muted-foreground hidden items-center gap-4 text-xs sm:flex">
          {status.version !== "-" && <span>v{status.version}</span>}
          {status.platform !== "-" && <span>os: {status.platform}</span>}
          {status.host !== "-" && <span>host: {status.host}</span>}
          {typeof status.pingMillis === "number" && (
            <span>bridge: {formatNumber(status.pingMillis)}ms</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}