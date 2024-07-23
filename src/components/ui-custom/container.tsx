"use client";

import { ReactNode } from "react";

type IContainerProps = {
  className?: string;
  children: ReactNode;
};

export default function Container({ children, className }: IContainerProps) {
  return (
    <div className={`bg-[#0B0B1F] rounded-[10px] p-[16px] ${className}`}>
      {children}
    </div>
  );
}
