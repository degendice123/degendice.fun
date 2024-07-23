"use client";

import { cn } from "@/lib/utils";
import localFont from "next/font/local";

const fontSans = localFont({
  src: "../assets/fonts/MinecraftTen-VGORe.ttf",
});

export default function Footer({ className }: { className: string }) {
  return (
    <div className={cn(fontSans.className, "w-full flex items-center justify-center text-[hsla(0,0%,100%,.25)]", "absolute bottom-0 left-0 right-0", className)}>
      COPYRIGHT © 2024, DEGEN DICE
    </div>
  );
}
