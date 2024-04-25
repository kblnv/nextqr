"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, QrCode, Upload, List } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";

const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <SheetClose asChild>
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <span>NextQR</span>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/"
                className={
                  pathname === "/"
                    ? "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                    : "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                }
              >
                <QrCode className="w-5 h-5" />
                Scan
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/upload"
                className={
                  pathname === "/upload"
                    ? "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                    : "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                }
              >
                <Upload className="w-5 h-5" />
                Upload
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/recently"
                className={
                  pathname === "/recently"
                    ? "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                    : "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                }
              >
                <List className="w-5 h-5" />
                Recently
              </Link>
            </SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
