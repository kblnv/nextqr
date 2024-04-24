"use client";

import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { List, Menu, QrCode, Upload } from "lucide-react";

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>NextQR</title>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
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
            <div className="flex flex-col">
              <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 md:hidden"
                    >
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
              <main className="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
