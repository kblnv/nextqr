"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, QrCode, Upload } from "lucide-react";

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
    <div className="flex flex-col h-full max-h-screen gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold"
        >
          <span>NextQR</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "flex items-center gap-3 px-3 py-2 transition-all rounded-lg bg-muted text-primary hover:text-primary"
                : "flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary"
            }
          >
            <QrCode className="w-4 h-4" />
            Scan
          </Link>
          <Link
            href="/upload"
            className={
              pathname === "/upload"
                ? "flex items-center gap-3 px-3 py-2 transition-all rounded-lg bg-muted text-primary hover:text-primary"
                : "flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary"
            }
          >
            <Upload className="w-4 h-4" />
            Upload
          </Link>
          <Link
            href="/recently"
            className={
              pathname === "/recently"
                ? "flex items-center gap-3 px-3 py-2 transition-all rounded-lg bg-muted text-primary hover:text-primary"
                : "flex items-center gap-3 px-3 py-2 transition-all rounded-lg text-muted-foreground hover:text-primary"
            }
          >
            <List className="w-4 h-4" />
            Recently
          </Link>
        </nav>
      </div>
    </div>
  </div>
  );
}

export default Sidebar;
