"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/command-palette";
import { CustomCursor } from "@/components/custom-cursor";
import { Header } from "@/components/header";

export function GlobalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [palette, setPalette] = useState(false);

  if (pathname === "/") {
    return (
      <>
        <CustomCursor />
        {children}
      </>
    );
  }

  return (
    <>
      <Header onPalette={() => setPalette(true)} />
      <CommandPalette open={palette} setOpen={setPalette} />
      <CustomCursor />
      <div className="site-shell">{children}</div>
    </>
  );
}
