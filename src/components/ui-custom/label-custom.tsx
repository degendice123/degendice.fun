"use client";

import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import { ReactNode } from "react";

const fontSans = localFont({ src: "../../assets/fonts/MinecraftTen-VGORe.ttf" });

type ILabelCustomProps = {
  className?: string;
  classNameContainer?: string;
  children: ReactNode;
};

export default function LabelCustom({
  children,
  classNameContainer,
  className,
}: ILabelCustomProps) {
  return (
    <div className={cn(fontSans.className, "relative", classNameContainer)}>
      <div
        className={cn("font-bold select-none", className)}
        style={
          {
            "WebkitTextStroke": "4px #02017E",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
      <div
        style={{
          background: "linear-gradient(180deg, #FBC350 0%, #F6501B 100%)",
          backgroundClip: "text",
        }}
        className={cn("absolute top-0 text-transparent font-bold", className)}
      >
        {children}
      </div>
    </div>
  );
}
