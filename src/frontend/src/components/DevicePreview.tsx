import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type DeviceMode = "desktop" | "tablet" | "mobile";

interface DevicePreviewProps {
  mode: DeviceMode;
  children: ReactNode;
}

const deviceWidths: Record<DeviceMode, string> = {
  desktop: "w-full",
  tablet: "w-[768px]",
  mobile: "w-[390px]",
};

export default function DevicePreview({ mode, children }: DevicePreviewProps) {
  if (mode === "mobile") {
    return (
      <div className="flex justify-center items-start w-full py-4">
        <div
          className={cn(
            "relative transition-smooth",
            deviceWidths[mode],
            "flex-shrink-0",
          )}
        >
          {/* Phone outer shell */}
          <div className="relative bg-card border-2 border-border rounded-[2.5rem] shadow-elevated overflow-hidden">
            {/* Notch bar */}
            <div className="relative flex items-center justify-center bg-card h-10 border-b border-border">
              <div className="absolute left-1/2 -translate-x-1/2 w-24 h-5 bg-background rounded-b-xl" />
              <span className="relative z-10 text-[10px] text-muted-foreground font-mono tracking-wider">
                9:41
              </span>
            </div>
            {/* Content */}
            <div
              className="overflow-y-auto"
              style={{ height: "calc(100vh - 200px)", maxHeight: "660px" }}
            >
              {children}
            </div>
            {/* Home indicator */}
            <div className="flex justify-center items-center h-6 bg-card">
              <div className="w-24 h-1 bg-border rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop / Tablet — browser chrome frame
  return (
    <div
      className={cn(
        "flex justify-center items-start w-full py-4",
        mode === "tablet" ? "" : "",
      )}
    >
      <div
        className={cn(
          "relative transition-smooth flex-shrink-0",
          deviceWidths[mode],
          mode === "tablet" && "mx-auto",
        )}
      >
        {/* Browser chrome */}
        <div className="bg-card border border-border rounded-t-xl shadow-elevated">
          {/* Traffic lights + URL bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="w-3 h-3 rounded-full bg-destructive opacity-80" />
              <div className="w-3 h-3 rounded-full bg-accent opacity-80" />
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: "oklch(0.65 0.18 150)" }}
              />
            </div>
            {/* URL bar */}
            <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded-md px-3 py-1.5 min-w-0">
              <div className="w-3 h-3 flex-shrink-0 opacity-40">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-label="Security shield"
                  role="img"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="text-xs text-muted-foreground font-mono truncate">
                forge.app/preview
              </span>
            </div>
          </div>
        </div>
        {/* Page content */}
        <div
          className="border-x border-b border-border rounded-b-xl overflow-hidden"
          style={{ height: "calc(100vh - 200px)", overflowY: "auto" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
