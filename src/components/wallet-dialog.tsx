"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import svgClose from "@/assets/img/close.svg";
import { Dispatch, SetStateAction } from "react";

export function WalletDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={open}>
      <DialogContent
        className={`max-w-[330px] bg-[#F6501B] border-[#F6501B] rounded-md`}
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="text-[20px]">{"Warning"}</DialogTitle>
        <div className="flex flex-col items-center">
          <div className="flex justify-around items-center rounded py-[10px] px-[20px] bg-white text-[#F6501B] text-[12px]">
            Please <span className="font-bold mx-1">Select wallet</span> before
            betting
          </div>
        </div>
        <DialogClose asChild>
          <Image
            src={svgClose}
            alt="Close button"
            className="absolute bottom-[-30px] left-1/2 cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
