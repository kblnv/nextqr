"use client";

import { Button } from "@/components/shared/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/shared/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, QrCode, Upload } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Открыть навигационное меню</span>
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
                <QrCode className="h-5 w-5" />
                Сканировать
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
                <Upload className="h-5 w-5" />
                Загрузить
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

export { Header };
